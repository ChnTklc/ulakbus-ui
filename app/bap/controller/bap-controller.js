/**
 * @license Ulakbus-UI
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

'use strict';
angular.module('ulakbusBap')
    /**
     * @memberof ulakbusBap
     * @ngdoc controller
     * @name DashboardController
     * @description DashboardController controller is the main controller for BAP main page
     * This controller play important role in sending data to its child directives
     *
     * @returns {object}
     */
    .controller('DashboardController', function ($scope, $state, $location, Generator, $http, toastr) {
        $scope.user_ready = false;
        //this will be API call in controller load
        $scope.dashboardData = {};
        var dashboardEndpoint = 'bap_anasayfa';
        $http.post(Generator.makeUrl(dashboardEndpoint), {})
            .success(function (response, status) {
                if(status===200){
                    $scope.dashboardData = response;
                }else{
                    toastr.error('Tekrar dene');
                }
                $scope.user_ready = true;
            });

        $scope.clickAnnouncement = function (announcement) {
            $location.path("/" + announcement.wf);
            //$state.go("/" + announcement.wf);
        };

        $scope.clickMore = function (workFlow) {
            $location.path("/" + workFlow);
            //$state.go("/" + workFlow);
        };
    })
    /**
     * @memberof ulakbusBap
     * @ngdoc controller
     * @name BapCRUDController
     * @description CRUDController controller is base controller for crud module to redirect to related controller
     * This controller play an empty role for api calls.
     * With response data, location path change to related controller
     *
     * @returns {object}
     */
    .controller('BapCRUDController', function ($scope, $stateParams, $location, Generator) {
        // get required params by calling Generator.generateParam function
        if ($location.url().indexOf('?=') > 0) {
            return $location.url($location.url().replace('?=', ''));
        }
        // before calling get_wf parameters need to be generated with Generator.generateParam
        Generator.generateParam($scope, $stateParams);
        Generator.get_wf($scope);
    })

    /**
     * @memberof ulakbusBap
     * @ngdoc controller
     * @name BapCRUDListFormController
     * @description CRUDListFormController is the main controller for crud module
     * Based on the client_cmd parameter it generates its scope items.
     * client_cmd can be in ['show', 'list', 'form', 'reload', 'refresh']
     * There are 3 directives to manipulate controllers scope objects in crud.html
     * <br>
     * The controller works in 2 ways, with and without pageData.
     * pageData is generated by formService.Generator and it contains data to manipulate page.
     * If pageData has set, using Generator's getPageData() function, sets its scope items. After getting pageData
     * pageData must be set to `{pageData: false}` for clear scope of next job.
     * <br>
     * If pageData has not set using Generator's get_wf() function gets scope items from api call.
     *
     * @returns {object}
     */
    .controller('BapCRUDListFormController', function ($scope, $rootScope, $location, $sce, $http, $log, $uibModal, $timeout, Generator, $stateParams) {
        // below show crud and $on --> $viewContentLoaded callback is for masking the view with unrendered and ugly html
        $scope.show_crud = false;
        $scope.$on('$viewContentLoaded', function () {
            $timeout(function () {
                $scope.show_crud = true;
            }, 500);
        });

        // todo: new feature wf_step is for to start a workflow from a certain step
        $scope.wf_step = $stateParams.step;

        // pagination data is coming from api when too much results
        $scope.$watch("pagination.page", function(newVal, oldVal) {
            if (newVal === oldVal) return;
            var reloadPage= {page: $scope.pagination.page};
            $scope.form_params.cmd = $scope.reload_cmd;
            $scope.form_params = angular.extend($scope.form_params, reloadPage);
            $log.debug('reload data', $scope);
            Generator.get_wf($scope);
        });
        // reload_cmd can be broadcasted app-wide, when $on it reloadCmd is called
        $scope.$on('reload_cmd', function(event, data){
            $scope.reload_cmd = data;
            $scope.reloadCmd();
        });

        // search directive updates objects after search results
        $scope.$on('updateObjects', function ($event, data) {
            $scope.objects = data;
            Generator.listPageItems($scope, {objects: $scope.objects});
        });

        // we use form generator for generic forms. this makes form's scope to confuse on the path to generate form
        // object by its name. to manage to locate the form to controllers scope we use a directive called form locator
        // a bit dirty way to find form working on but solves our problem
        $scope.$on('formLocator', function (event) {
            $scope.formgenerated = event.targetScope.formgenerated;
        });

        // remove function removes node or listnode item from model data
        $scope.remove = function (item, type, index) {
            if(angular.isDefined($scope[type][item.title])){
                $scope[type][item.title].model.splice(index, 1);
                $scope[type][item.title].items.splice(index, 1);
            }else{
                $scope[type][item.schema.model_name].model.splice(index, 1);
                $scope[type][item.schema.model_name].items.splice(index, 1);
            }
        };

        $scope.onSubmit = function (form) {
            $scope.$broadcast('schemaFormValidate');
            if (form.$valid) {
                Generator.submit($scope);
            }
        };

        $scope.do_action = function (key, todo) {
            //indicate that the user have clicked some button like edit/delete on form
            $rootScope.isUserClicked = true;
            Generator.doItemAction($scope, key, todo, todo.mode || 'normal');
        };

        $scope.getNumber = function (num) {
            return new Array(num);
        };

        $scope.markdownWorkaround = function (value) {
            // this is new line workaround for markdown support
            // kind of ugly hack
            return typeof value === 'string' ? value.replace('\n', '<br>'): value;
        };

        // inline edit fields
        $scope.datepickerstatuses = {};

        $scope.inline_datepicker_status = function (field) {
            return ($scope.datepickerstatuses[field] || false);
        };

        $scope.openDatepicker = function (field) {
            $scope.datepickerstatuses[field] = true;
        };

        $scope.createListObjects = function () {
            if ($scope.object.constructor === Array) {
                $log.debug('new type show object')
            } else {
                if ($scope.object.type) {
                    $scope.object = [$scope.object];
                } else {
                    $scope.object = [{type: 'table', fields: angular.copy($scope.object)}];
                }
            }
        };

        $scope.showCmd = function () {
            Generator.generateParam($scope, $stateParams, $stateParams.cmd);
            // todo: refactor createListObjects func

            var pageData = Generator.getPageData();
            if (pageData.pageData === true) {
                $scope.object_title = pageData.object_title;
                $scope.object = pageData.object;
                Generator.setPageData({pageData: false});
            }
            else {
                // call generator's get_single_item func
                Generator.get_wf($scope).then(function (res) {
                    $scope.object = res.data.object;
                    $scope.model = $stateParams.model;
                });
            }
            $scope.createListObjects();
        };

        // selective listing for list page todo: add to documentation
        $scope.update_selective_list = function (key) {
            $scope.objects = key["objects"];
        };
        // end of selective listing
        $scope.listFormCmd = function () {
            // function to set scope objects
            var setpageobjects = function (data) {
                Generator.listPageItems($scope, data);
                Generator.generate($scope, data);
                Generator.setPageData({pageData: false});
            };

            // get pageData from service
            var pageData = Generator.getPageData();

            // if pageData exists do not call get_wf function and manipulate page with pageData
            if (pageData.pageData === true) {
                $log.debug('pagedata', pageData.pageData);
                Generator.generateParam($scope, pageData, $stateParams.cmd);
                setpageobjects(pageData, pageData);
                if ($scope.second_client_cmd) {
                    $scope.createListObjects();
                }
            }
            // if pageData didn't defined or is {pageData: false} go get data from api with get_wf function
            if (pageData.pageData === undefined || pageData.pageData === false) {
                Generator.generateParam($scope, $stateParams, $stateParams.cmd);
                Generator.get_wf($scope);
            }

            if ($scope.object) {
                $scope.createListObjects();
            }

            // if selective listing then change objects key to its first item
            if (angular.isDefined($scope.meta) && angular.isDefined($scope.meta.selective_listing)) {
                $scope.all_objects = angular.copy($scope.objects);
                $scope.selective_list_key = $scope.all_objects[$scope.selected_key];
                $scope.objects = $scope.selective_list_key["objects"];
            }
        };
        $scope.reloadCmd = function () {
            var pageData = Generator.getPageData();
            Generator.generateParam($scope, pageData, $stateParams.cmd);
            $log.debug('reload data', $scope);
            Generator.get_wf($scope);
        };
        $scope.resetCmd = function () {
            var pageData = Generator.getPageData();
            Generator.generateParam($scope, pageData, $stateParams.cmd);
            delete $scope.token;
            delete $scope.filters;
            delete $scope.cmd;
            Generator.get_wf($scope);
        };

        var executeCmd = {
            show: $scope.showCmd,
            list: $scope.listFormCmd,
            form: $scope.listFormCmd,
            reload: $scope.reloadCmd,
            reset: $scope.resetCmd
        };

        return executeCmd[$stateParams.cmd]();

    });


