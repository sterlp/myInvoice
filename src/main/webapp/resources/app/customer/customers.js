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
            customerId: '@',
            customer: "=?"
        },
        controller: ['CustomerService', '$breadcrumb', '$state',
        function ($customer, $breadcrumb, $state) {
            var that = this;
            $breadcrumb.$getLastViewScope().pageLabel = "Customer";

            this.$onInit = function() {
                console.info('customer init: ', this.customerId, this.customer);
                if (this.customerId) {
                    if (!this.customer || this.customer.id != this.customerId) this.reload(this.customerId);
                    else {
                        // show provided customer ...
                        updateCustomer(this.customer);
                    }
                } else $breadcrumb.$getLastViewScope().pageLabel = "New Customer";
            };
            this.reload = function () {
                $customer.get(this.customerId).then(updateCustomer, function (error) {
                    if (error.status === 404) $state.transitionTo('app.customers', null, {notify: true, location: 'replace'});
                });
            };
            this.save = function () {
                if (this.customer.id) $customer.save(this.customer).then(updateCustomer);
                else {
                    $customer.save(this.customer).then(function(result) {
                        $state.go('app.customer', {customerId: result.data.id, customer: result.data}, {replace: true});
                    });
                }
            };
            this.addBankDetails = function() {
                if (!this.customer) this.customer = {};
                if (!that.customer.bankDetails) that.customer.bankDetails = [];
                that.customer.bankDetails.push({});
            };
            function updateCustomer(result) {
                that.customer = result.data ? result.data : result;
                $breadcrumb.$getLastViewScope().pageLabel = that.customer.firstName + " " + that.customer.name;
            };
        }],
        templateUrl: ['appConfig', function(appConfig) {
            return appConfig.html('customer/customer.html');
        }]
    });
})(angular);