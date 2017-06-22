(function() {
    var base = 'resources/app/';
    var app = angular.module('myInvoice', 
        ['ui.router', 'oc.lazyLoad', 'ncy-angular-breadcrumb',
         'angular-loading-bar', 'core-ui']);
    
    // https://github.com/angular-ui/ui-router/wiki
    app.value('baseUrl', base)
       .config(['$urlRouterProvider', '$stateProvider', '$breadcrumbProvider', '$ocLazyLoadProvider', 
        function($urlRouterProvider, $stateProvider, $breadcrumbProvider, $ocLazyLoadProvider) {
            
            $ocLazyLoadProvider.config({
                // Set to true if you want to see what and when is dynamically loaded
                debug: true
              });
            $breadcrumbProvider.setOptions({
                prefixStateName: 'app.home',
                includeAbstract: true,
                template: '<li class="breadcrumb-item" ng-repeat="step in steps" ng-class="{active: $last}" ng-switch="$last || !!step.abstract"><a ng-switch-when="false" href="{{step.ncyBreadcrumbLink}}">{{step.ncyBreadcrumbLabel}}</a><span ng-switch-when="true">{{step.ncyBreadcrumbLabel}}</span></li>'
            });
            
            $urlRouterProvider.otherwise('/home');
            // URL States normal ...
            $stateProvider.state('app', {
                abstract: true,
                templateUrl: base + 'layouts/full.html',
                ncyBreadcrumb: {
                    label: 'Root',
                    skip: true
                }
            })
            .state('app.home', {
                url: '/home',
                component: 'invoiceHome',
                params: {title: 'Home'},
                ncyBreadcrumb: {
                    label: 'Home'
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
                        files: [base + "invoice/invoices.js"]
                      }
                    );
                  }]
                }
            });
            
    }]);
    app.component('invoiceHome', {
            bindings: {
                'title': '='
            },
            controller: function () {
                // this.title is available
                console.info("homeComponent loaded ...");
            },
            templateUrl: base + 'home/home.html'
        })
        ;
})();
