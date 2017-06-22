(function() {
    var base = 'resources/app/';
    var app = angular.module('myInvoice', 
        ['ui.router', 'oc.lazyLoad', 'ncy-angular-breadcrumb',
         'angular-loading-bar', 'core-ui']);
    
    // https://github.com/angular-ui/ui-router/wiki
    app.config(['$urlRouterProvider', '$stateProvider', '$breadcrumbProvider', 
        function($urlRouterProvider, $stateProvider, $breadcrumbProvider) {
            
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
        .component('invoiceList', {
            bindings: {
                'title': '='
            },
            controller: function () {
                // this.title is available
                console.info("invoiceListComponent loaded ...");
            },
            templateUrl: base + 'invoice/invoice_list.html'
        })
        ;
})();
