(function(angular) {
    'use strict';
    var app = angular.module('myInvoice');
    
    app.service('CustomerService', ['appConfig', '$http', function(appConfig, $http) {
        this.list = function() {
            return $http({
                method: 'GET',
                url: appConfig.rest('customer')
             });
        };
        this.get = function (customerId) {
            if (!customerId) throw 'No customer id given';
            return $http({
                method: 'GET',
                url: appConfig.rest('customer/' + customerId)
            });
        };
        this.save = function (customer) {
            if (!customer) throw 'No customer given to create';
            return $http({
                method: customer.id ? 'PUT' : 'POST',
                url: appConfig.rest('customer', customer.id),
                data: customer
            });
        };
    }]);

    app.component('customerList', {
        controller: ['CustomerService', function (CustomerService) {
            var that = this;
            console.info('customerList open ...');
            this.reload = function() {
                CustomerService.list().then(function(result) {
                    that.customers = result.data;
                }, function(error) {
                    that.customers = null;
                    console.warn(error);
                });
            };
            this.reload();
        }],
        templateUrl: ['appConfig', function(appConfig) {
            return appConfig.html('customer/customers.html');
        }]
    });
    
    
    app.component('customer', {
        bindings: {
            customerId: '@'
        },
        controller: ['CustomerService', '$state', '$breadcrumb', 
        function ($customer, $state, $breadcrumb) {
            var that = this;
            $breadcrumb.$getLastViewScope().pageLabel = "Customer";

            this.$onInit = function() {
                console.info('customer init: ', this.customerId);
                if (this.customerId) this.reload(this.customerId);
                else $breadcrumb.$getLastViewScope().pageLabel = "New Customer";
            };
            this.reload = function () {
                $customer.get(this.customerId).then(updateCustomer);
            };
            this.save = function () {
                $customer.save(this.customer).then(updateCustomer);
            };
            function updateCustomer(result) {
                that.customer = result.data;
                $breadcrumb.$getLastViewScope().pageLabel = that.customer.firstName + " " + that.customer.name;
                $state.transitionTo('app.customer', {customerId: that.customer.id}, {notify: false, location: 'replace'});
            };
        }],
        templateUrl: ['appConfig', function(appConfig) {
            return appConfig.html('customer/customer.html');
        }]
    });
})(angular);