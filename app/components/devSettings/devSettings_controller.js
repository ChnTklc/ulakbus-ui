/**
 * @license Ulakbus-UI
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

'use strict';
angular.module('ulakbus')
    .factory('DevSettings', function ($cookies) {
        var devSettings = {};
        devSettings.settings = {
            keepAlive: $cookies.get("keepAlive") || 'on'
        };
        return devSettings;
    });

angular.module('ulakbus.devSettings', ['ui.router'])

    .controller('DevSettingsController', function ($scope, $cookies, $rootScope, RESTURL, DevSettings) {
        $scope.backendurl = $cookies.get("backendurl");
        $scope.keepAlive = $cookies.get("keepAlive") || "on";
        //$scope.querydebug = $cookies.get("querydebug") || "on";

        $scope.changeSettings = function (what, set) {
            document.cookie = what+"="+set;
            $scope[what] = set;
            $rootScope.$broadcast(what, set);
        };

        $scope.switchOnOff = function (pinn) {
            return pinn=="on" ? "off" : "on"
        };

        $scope.setbackendurl = function () {
            $scope.changeSettings("backendurl", $scope.backendurl);
            RESTURL.url = $scope.backendurl;
        };

        $scope.setKeepAlive = function () {
            $scope.changeSettings("keepAlive", $scope.switchOnOff($scope.keepAlive));
            DevSettings.settings.keepAlive = $cookies.get("keepAlive");
        };

        //$scope.setquerydebug = function () {
        //    $scope.changeSettings("querydebug", $scope.switchOnOff($scope.querydebug));
        //};

    });