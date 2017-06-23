(function(angular) {
    'use strict';
    var app = angular.module('myInvoice');
    
    app.service('CustomerService', ['appConfig', '$http', function(appConfig, $http) {
        this.list = function() {
            return $http({
                method: 'GET',
                url: appConfig.rest('customer'),
                //params: 'limit=10, sort_by=created:desc'
             });
        };
    }]);

    app.component('customerList', {
        controller: ['CustomerService', function (CustomerService) {
            var that = this;
            
            this.reload = function() {
                CustomerService.list().then(function(data) {
                    that.customers = data;
                }, function(error) {
                    that.customers = null;
                    console.warn(error);
                });
            };
            if (!this.customers) this.reload();
        }],
        templateUrl: ['appConfig', function(appConfig) {
            return appConfig.html('customer/customers.html');
        }]
    });
})(angular);