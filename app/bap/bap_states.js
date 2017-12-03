/**
 * @license Ulakbus-UI
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */


'use strict';

var app = angular.module('ulakbusBap')
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('bap.anasayfa', {
                url: '/bap_anasayfa',
                templateUrl: '../components/bapComponents/dashboard.html'
            })
            .state('bap.wf', {
                reloadOnSearch: false,
                url: '/:wf',
                templateUrl: '../components/crud/templates/crud-preload.html',
                controller: 'BapCRUDController',
                params: {
                    wf: {value: null, squash: true}
                }
            })
            .state('bap.wf.do.cmd', {
                reloadOnSearch: false,
                url: '/:wf/do/:cmd',
                templateUrl: '../components/crud/templates/crud.html',
                controller: 'BapCRUDListFormController',
                params: {
                    wf: { value: null, squash: true },
                    cmd : { value: null, squash: true }
                }
            });

        $urlRouterProvider.otherwise('/bap_anasayfa');
    })
    .run(function ($rootScope) {
        //reset the value of user interaction on form when page refreshes
        $rootScope.isUserClicked = false;
    })
    .config(['$httpProvider', function ($httpProvider) {
        /**
         * @memberof ulakbusBap
         * @ngdoc interceptor
         * @name http_interceptor
         * @description The http interceptor for all requests and responses to check and config payload and response
         * objects.
         * - To prevent OPTIONS preflight request change header Content-Type to `text/plain`.
         * - 4xx - 5xx errors are handled in response objects.
         * - `_debug_queries` is helper object for development purposes to see how long the queries lasts.
         *   They are shown in /debug/list' page.
         * - API returns `is_login` key to check if current user is authenticated. Interceptor checks and if not logged
         *   in redirects to login page.
         */
        $httpProvider.interceptors.push(function ($rootScope , toastr) {
            return {
                'request': function (config) {
                    if (config.method === "POST") {
                        // to prevent OPTIONS preflight request
                        config.headers["Content-Type"] = "text/plain";
                    }
                    return config;
                },
                'response': function (response) {
                    //Will only be called for HTTP up to 300

                    if (response.data._debug_queries) {
                        if (response.data._debug_queries.length > 0) {
                            $rootScope.debug_queries = $rootScope.debug_queries || [];
                            $rootScope.debug_queries.push({
                                "url": response.config.url,
                                "queries": response.data._debug_queries
                            });
                        }
                    }
                    // handle toast notifications here
                    if (response.data.notify) {toastr.info(response.data.notify)}

                    if (response.data.error) {
                        //not authorized
                        if(response.data.code === 401){
                            var protocol = window.location.protocol;
                            var host = window.location.host;
                            //redirect to login page for wf that requires authentication
                            window.location.replace(protocol +'//'+ host +'/login');
                            return;
                        }else{
                            toastr.error(response.data.code)
                        }
                    }

                    return response;
                }
            };
        });

        $httpProvider.defaults.withCredentials = true;

    }]);