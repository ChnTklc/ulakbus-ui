'use strict';

var login = {
    name: 'login',
    url: '/login',
    templateUrl: '/components/auth/login.html',
    controller: 'LoginController'
};
var logout = {
    name: 'logout',
    url: '/logout',
    controller: function (AuthService) {
        AuthService.logout();
    }
};
var dashboard = {
    name: 'dashboard',
    url: '/dashboard',
    templateUrl: '/components/dashboard/dashboard.html',
    controller: 'DashController'
};
var settings = {
    name: 'dev.settings',
    url: '/dev/settings',
    templateUrl: '/components/devSettings/devSettings.html',
    controller: 'DevSettingsController'
};
var debugList = {
    name: 'debug.list',
    url: '/debug/list',
    templateUrl: '/components/debug/debug.html',
    controller: 'DebugController'
};
var adminBpmnManager = {
    name: 'admin.bpmnmanager',
    url: '/admin/bpmnmanager',
    templateUrl: '/components/admin/bpmn_manager.html',
    controller: 'BpmnManagerController'
};
var newdesigns = {
    name: 'newdesigns',
    url: '/newdesigns',
    templateUrl: '/components/uitemplates/base.html',
    controller: 'NewDesignsCtrl'
};
var formservicepg = {
    name: 'formservicepg',
    url: '/formservicepg',
    templateUrl: '/components/uitemplates/form_service_pg.html',
    controller: 'FormServicePg'
};
var gridreport = {
    name: 'gridreport', 
    url: '/gridreport',
    templateUrl: '/components/gridTable/gridreport.html'

};
var wfstate = {
    name: 'wfstate',
    url: '/:wf/',
    templateUrl: '/components/crud/templates/crud-preload.html',
    controller: 'CRUDController'
};
var pubwf = {
    name: 'pub.wf', 
    url: '/pub/:wf/',
    templateUrl: '/components/crud/templates/crud-preload.html',
    controller: 'CRUDController',
    isPublic: true
};
var cwfwftoken = {
    name: 'cwf.wf.token',
    url: '/cwf/:wf/:token',
    templateUrl: '/components/crud/templates/crud.html',
    controller: 'CRUDController'
};
var wfdocmd = {
    name: 'wf.do.cmd',
    url: '/:wf/do/:cmd',
    templateUrl: '/components/crud/templates/crud.html',
    controller: 'CRUDListFormController'
};
var pubwfdocmd = {
    name: 'pub.wf.do.cmd',
    url: '/pub/:wf/do/:cmd',
    templateUrl: 'components/crud/templates/crud.html',
    controller: 'CRUDListFormController',
    isPublic: true
};
var wfdocmdkey = {
    name: 'wf.do.cmd.key',
    url: '/:wf/do/:cmd/:key',
    templateUrl: '/components/crud/templates/crud.html',
    controller: 'CRUDListFormController'
};
var wfmodel = {
    name: 'wf.model',
    url: '/:wf/:model',
    templateUrl: '/components/crud/templates/crud-preload.html',
    controller: 'CRUDController'
};
var wfmodeldocmd = {
    name: 'wf.model.do.cmd',
    url: '/:wf/:model/do/:cmd',
    templateUrl: '/components/crud/templates/crud.html',
    controller: 'CRUDListFormController'
};
var wfmodeldocmdkey = {
    name: 'wf.model.do.cmd.key', 
    url: '/:wf/:model/do/:cmd/:key',
    templateUrl: '/components/crud/templates/crud.html',
    controller: 'CRUDListFormController'
};

angular.module('ulakbus')
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state(login)
            .state(logout)
            .state(dashboard)
            .state(settings)
            .state(debugList)
            .state(adminBpmnManager)
            .state(newdesigns)
            .state(formservicepg)
            .state(gridreport)
            .state(wfstate)
            .state(pubwf)
            .state(cwfwftoken)
            .state(wfdocmd)
            .state(pubwfdocmd)
            .state(wfdocmdkey)
            .state(wfmodel)
            .state(wfmodeldocmd)
            .state(wfmodeldocmdkey);

        $urlRouterProvider.otherwise('/login');
    })
    .run(function ($rootScope, $window, $location, $state, AuthService) {
        $rootScope.loggedInUser = false;
        $rootScope.loginAttempt = 0;
        $rootScope.current_user = true;
        //check if page is not a public page
        if(location.hash.indexOf('/pub/') === -1){
            AuthService.check_auth();
        }
        //reset the value of user interaction on form when page refreshes
        $rootScope.isUserClicked = false;

        $rootScope.$on('$stateChangeStart', function (event, toState, fromState) {
            if (toState === dashboard && $window.sessionStorage.token === "null") {
                event.preventDefault();
            }
            if (toState === logout && $window.sessionStorage.token === "null") {
                event.preventDefault();
            }
        });
    })
    .config(['$httpProvider', function ($httpProvider) {
        // to send cookies CORS
        $httpProvider.defaults.withCredentials = true;
    }])
    .run(function (gettextCatalog) {
        gettextCatalog.setCurrentLanguage('tr');
        gettextCatalog.debug = true;
    })
    .config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
        // no need bar on top of the page, set to false
        cfpLoadingBarProvider.includeBar = false;
        // loaderdiv is a placeholder tag for loader in header-sub-menu.html
        cfpLoadingBarProvider.parentSelector = "loaderdiv";
        // loader template will be used when loader initialized
        cfpLoadingBarProvider.spinnerTemplate = '<div class="loader">Loading...</div>';
    }]);