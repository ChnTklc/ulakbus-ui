'use strict';


angular.module('zaerp.login', ['ngRoute', 'schemaForm'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: 'login/login.html',
            controller: 'LoginCtrl'
        });
    }])
    .controller('LoginCtrl', function ($scope, $http) {
        $scope.schema =
        {
            title: "Login",
            type: "object",
            properties: {
                email: {
                    type: "email",
                    title: "Email"
                },
                pass: {
                    type: "string",
                    title: "Password"
                },
                remember: {
                    type: "boolean",
                    title: "Remember me?"
                },
                who: {
                    title: "Who are you?",
                    type: "string",
                    enum: ["student", "stuff", "dean"]
                }
            },
            required: ["email", "pass", "who"]
        };
        //$scope.fields = ["email", "pass", "who", "remember"];
        $scope.model = {
            email: "user@example.com",
            remember: false
        };
        $scope.form = [
            {
                key: "email",
                type: "email"
            },
            {
                key: "pass",
                type: "password"
            },
            "remember",
            "who",
            {
                type: "submit",
                title: "Save"
            }
        ];
        $scope.onSubmit = function(form){
            $scope.$broadcast('schemaFormValidate');
            if (form.$valid){
                $http.post('http://127.0.0.1:8000/login', form).
                    success(function(data, status, headers, config){
                        console.log(data);
                    }).
                    error(function(data, status, headers, config){
                        console.log("form submit failed: "+status);
                    });
            }
            else {
                console.log("not valid");
            }
        }
    });