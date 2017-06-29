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
                // assume mapping ...
                if (!$scope.path && at.ngModel) {
                    $scope.path = at.ngModel;
                    if ($scope.path.indexOf('$ctrl.') === 0) {
                        $scope.path = $scope.path.substring(6, $scope.path.length);
                        console.debug("jsuiValidate assuming path:", $scope.path, " for ngModel: ", at.ngModel);
                    }
                    // mapping code
                    var indexOfDot = $scope.path.indexOf('.');
                    if (indexOfDot > 1) {
                        var map = $scope.path.substring(0, indexOfDot);
                        map = $jsuiState.map(map);
                        if (map) {
                            $scope.path = map + $scope.path.substring(indexOfDot, $scope.path.length);
                            console.debug("jsuiValidate mapped path to:", $scope.path);
                        }
                    }
                } // else take the scope one
                if (!$scope.path || $scope.path === "") {
                    throw "jsuiValidate has no path to attach the validation! " + el + " " + at;
                }
                
                $scope.$on('jsuiValidation', function(e, validationErrors) {
                    var validationObj = (validationErrors && validationErrors[$scope.path]) || null;
                    if (validationErrors && validationObj && !showingError) {
                        showingError = true;
                        el.addClass('form-control-danger');
                        el.closest('.form-group').addClass('has-danger');
                        if (validationObj.message) {
                            el.tooltip({'title': validationObj.message});
                        }
                        
                    } else if (showingError && !validationErrors) {
                        showingError = false;
                        el.removeClass('form-control-danger');
                        el.closest('.form-group').removeClass('has-danger');
                        el.tooltip('dispose');
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
    
    function JsuiState($rootScope, mapping) {
        this.state = {loading: false, validationErrors: {}, code: 200, message: null, hasValidationErrors: false};
        this.$rootScope = $rootScope;
        this.mapping = mapping;
        if (!$rootScope) throw 'Root scope with $broadcast method required.';
    }
    JsuiState.prototype.map = function(toMap) {
        if (!this.mapping) return null;
        if (!toMap) return null;
        return this.mapping[toMap] || this.mapping[toMap.charAt(0).toUpperCase() + toMap.slice(1)];
    };
    JsuiState.prototype.addMapping = function(key, value) {
        if (!this.mapping) this.mapping = {};
        this.mapping[key] = value;
    };
    JsuiState.prototype.clearErrors = function(code, message) {
        var state = this.state;
        state.code = code || null;
        state.message = message || null;
        state.hasValidationErrors = false;
        angular.forEach(state.validationErrors, function(value, key) {
            delete state.validationErrors[key];
        });
        this.$rootScope.$broadcast('jsuiValidation', null);
    };
    JsuiState.prototype.getState = function(field) {
        if (field) return this.state.validationErrors[field] || null;
        return this.state;
    };
    JsuiState.prototype.hasValidationErrors = function() {
        return this.state.hasValidationErrors;
    };
    JsuiState.prototype.isLoading = function() {
        return this.state.loading;
    };
    JsuiState.prototype.getErrorMessage = function () {
        return this.state.message;
    };
    JsuiState.prototype.getErrorCode = function () {
        return this.state.code;
    };
    /**
     * @param validationErrors 
     *  <pre>
     *   {
     *      "mapping.name" : {
     *          "message" : "message to show",
     *          "path": "mapping.name",
     *          "entity": "mapping"
     *          "invalidValue": "foo"
     *      }
     *   }
     *  </pre> 
     */
    JsuiState.prototype._setState = function(code, message, validationErrors) {
        if (validationErrors) {
	        this.state.code = code;
	        this.state.message = message;
            angular.extend(this.state.validationErrors, validationErrors);
            this.state.hasValidationErrors = true;
            this.$rootScope.$broadcast('jsuiValidation', this.state.validationErrors);
        } else {
            this.clearErrors(code, message);
        }
    };
    JsuiState.prototype._setLoading = function(val) {
        this.state.loading = val;
    };
    
    jsui.provider('$jsuiState', function() {
        var mapping = null;
        
        this.config = function(config) {
            if (config && config.mapping) mapping = config.mapping;
        };
        this.$get =['$rootScope', function($rootScope) {
            return new JsuiState($rootScope, mapping);
        }];
    });

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