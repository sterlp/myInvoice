(function(angular) {
    'use strict';
    
    var jsui = angular.module("JsUI", []);
    
    jsui.filter('jsuiLast', function () {
        return function (input) {
            if (!input) {
                input = '';
            } else {
                var val = input.indexOf('.');
                if (val > 0) input = input.substring(val + 1, input.length);
            }
            return input;
        };
    });
    
    jsui.directive('jsuiValidate', ['$jsuiState', function ($jsuiState) {
        return {
            restrict: 'A',
            replace : false,
            scope: {
                path: '@jsuiValidate'
            },
            link: function ($scope, el, at) {
                var showingError = false;
                if (!$scope.path && at.ngModel) {
                    $scope.path = at.ngModel;
                    if ($scope.path.startsWith('$ctrl.')) {
                        $scope.path = $scope.path.substring(6, $scope.path.length);
                        console.debug("jsuiValidate assuming path", $scope.path, " for", el, at);
                    }
                }
                if (!$scope.path || $scope.path === "") {
                    throw "jsuiValidate has no path to attach the validation! " + el + " " + at;
                }
                $scope.$on('jsuiValidation', function(e, validationErrors) {
                    console.info('jsuiValidate $scope:', $scope.path, ' $jsuiState:', $jsuiState);

                    var validationObj = (validationErrors && validationErrors[$scope.path]) || null;
                    if (validationErrors && validationObj && !showingError) {
                        console.debug("show error...", $scope, el ,at);
                        el.addClass('form-control-danger');
                        el.closest('.form-group').addClass('has-danger');

                        if (validationObj.message) {
                            el.attr('title', validationObj.message);
                            el.attr('data-toggle', 'tooltip');
                            el.tooltip();
                        }
                        showingError = true;
                    } else if (showingError && !validationErrors) {
                        console.info("hide error...");
                        el.removeClass('form-control-danger');
                        el.closest('.form-group').removeClass('has-danger');
                        el.removeAttr('title');
                        showingError = false;
                    }
                });
            }
        };
    }]);
    
    jsui.component('jsuiMessages', {
        controller: ['$jsuiState', function ($jsuiState) {
            this.state = $jsuiState.getState();
            this.show = function() {
                // if we have an error or not an validation error
                return this.state.code >= 500
                    || (this.state.code >= 400 && !$jsuiState.hasValidationErrors());
            };
        }],
        templateUrl: 'resources/app/jsui/messages.html'
    });
    
    
    jsui.service('$jsuiState', ['$rootScope', function($rootScope) {
        var state = {loading: false, validationErrors: {}, code: 200, message: null, hasValidationErrors: false};

        this.getState = function () {
            return state;
        };
        this.hasValidationErrors = function() {
            return state.hasValidationErrors;
        };
        this.getValidationErrors = function() {
            return state.validationErrors;
        };
        this.isLoading = function() {
            return state.loading;
        };
        this.clearErrors = function() {
            state.code = null;
            state.message = null;
            state.hasValidationErrors = false;
            angular.forEach(state.validationErrors, function(key, value) {
                delete state.validationErrors[key];
            });
            $rootScope.$broadcast('jsuiValidation', null);
        };
        this.getErrorMessage = function () {
            return state.message;
        };
        this.getErrorCode = function () {
            return state.code;
        };
        this._setState = function(code, message, validationErrors) {
            state.code = code;
            state.message = message;
            if (validationErrors) {
                angular.extend(state.validationErrors, validationErrors);
                state.hasValidationErrors = true;
                $rootScope.$broadcast('jsuiValidation', state.validationErrors);
            }
        };
        this._setLoading = function(val) {
            state.loading = val;
        };
        $rootScope.$jsuiState = this; // register service to root scope
    }]);

    jsui.factory('jsuiHttpInterceptor', ['$q', '$jsuiState',
        function($q, $jsuiState) {
            var requestCount = 0;
            function add(val) {
                requestCount += val;
                if (requestCount < 0) requestCount = 0;
                $jsuiState._setLoading(requestCount > 0);
            };
            return {
                'request': function (config) {
                    add(1);
                    $jsuiState.clearErrors();
                    return config;
                },
                'requestError': function (rejection) {
                    add(-1);
                    console.warn('requestError:', rejection);
                    return $q.reject(rejection);
                },
                'response': function (response) {
                    $jsuiState._setState(response.status, response.statusText, null);
                    add(-1);
                    return response;
                },
                'responseError': function (rejection) {
                    add(-1);
                    if (!rejection.data) rejection.data = {};
                    $jsuiState._setState(
                            rejection.data.code || rejection.status,
                            rejection.data.message || rejection.statusText,
                            rejection.data.validationErrors);
                    return $q.reject(rejection);
                }
            };
        }]
    );
    
    jsui.config(['$httpProvider', function($httpProvider) {
            $httpProvider.interceptors.push('jsuiHttpInterceptor');
        }]
    );
})(angular);