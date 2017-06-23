(function() {
    var app = angular.module('myInvoice', 
        ['ui.router', 'oc.lazyLoad', 'ncy-angular-breadcrumb',
         'angular-loading-bar', 'core-ui']);
    
    // https://github.com/angular-ui/ui-router/wiki
    app.constant('appConfig', {
            baseUrl: 'resources/app/',
            apiUrl: 'api/',
            html : function(val) {
                return this.baseUrl + val;
            },
            rest : function (val) {
                return this.apiUrl + val;
            }
        })
        .config(['appConfig', '$urlRouterProvider', '$stateProvider', '$breadcrumbProvider', '$ocLazyLoadProvider', 
            function(appConfig, $urlRouterProvider, $stateProvider, $breadcrumbProvider, $ocLazyLoadProvider) {
            
            $ocLazyLoadProvider.config({
                // Set to true if you want to see what and when is dynamically loaded
                debug: true
            });
            $breadcrumbProvider.setOptions({
                prefixStateName: 'app.home',
                includeAbstract: true,
                template: '<li class="breadcrumb-item" ng-repeat="step in steps" ng-class="{active: $last}" ng-switch="$last || !!step.abstract"><a ng-switch-when="false" href="{{step.ncyBreadcrumbLink}}">{{step.ncyBreadcrumbLabel}}</a><span ng-switch-when="true">{{step.ncyBreadcrumbLabel}}</span></li>'
            });
            
            var lazyLoadCustomer = ['$ocLazyLoad', 'appConfig', function ($ocLazyLoad, appConfig) {
                return $ocLazyLoad.load({
                    name: "lazyCustomers",
                    files: [appConfig.html("customer/customers.js")]
                });
            }];
            
            $urlRouterProvider.otherwise('/home');
            // URL States normal ...
            $stateProvider.state('app', {
                abstract: true,
                templateUrl: appConfig.html('layouts/full.html'),
                ncyBreadcrumb: {
                    label: 'Root',
                    skip: true
                }
            })
            .state('app.home', {
                url: '/home',
                component: 'invoiceHome',
                ncyBreadcrumb: {
                    label: 'Home'
                }
            })
            .state('app.customers', {
                url: '/customers',
                component: 'customerList',
                ncyBreadcrumb: {
                    label: 'Customers'
                },
                //resolvePolicy: { deps: { when: "EAGER" } },
                //resolve: { deps: lazyLoadCustomer }
            })
            .state('app.customer', {
                url: '/customer/:customerId',
                component: 'customer',
                ncyBreadcrumb: {
                    parent: 'app.customers',
                    label: '{{ pageLabel || "Customer" }}'
                },
                //resolvePolicy: { deps: { when: "EAGER" } },
                resolve: { 
                    customerId: function($stateParams) { return $stateParams.customerId; },
                    //deps: lazyLoadCustomer 
                }
            })
            .state('app.invoices', {
                url: '/invoiceList',
                component: 'invoiceList',
                ncyBreadcrumb: {
                    label: 'Invoice List'
                },
                resolvePolicy: { deps: { when: "EAGER" } }, // LOAD `deps` RESOLVE EAGERLY
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                      return $ocLazyLoad.load(
                        {
                          name: "lazyInvoices",
                          files: [appConfig.baseUrl + "invoice/invoices.js"]
                        }
                      );
                    }]
                }
            });
            
    }]);
    app.component('invoiceHome', {
            controller: function () {
                // this.title is available
                console.info("homeComponent loaded ...");
            },
            templateUrl: ['appConfig', function(appConfig) {
                return appConfig.html('home/home.html');
            }]
        });
})();
/*
 resolvePolicy: { deps: { when: "EAGER" } }, // LOAD `deps` RESOLVE EAGERLY
    resolve: {
      deps: ['$ocLazyLoad', function ($ocLazyLoad) {
        return $ocLazyLoad.load(
          {
            name: "lazyInvoices",
            files: [appConfig.baseUrl + "invoice/invoices.js"]
          }
        );
      }]
    }
 */