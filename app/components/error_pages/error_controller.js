/**
 * @license Ulakbus-UI
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

'use strict';

angular.module('ulakbus').config(['$stateProvider', function ($stateProvider) {
        $stateProvider
        .state('500error', {
            url: '/error/500',
            templateUrl: '/components/error_pages/500.html',
            controller: '500Controller'
        })
        .state('404error', {
            url: '/error/404',
            templateUrl: '/components/error_pages/404.html',
            controller: '404Controller'
        });
}]);

angular.module('ulakbus.error_pages', ['ui.router'])
    .controller('500Controller', function ($scope, $rootScope, $location) {
    })

    .controller('404Controller', function ($scope, $rootScope, $location) {
    });