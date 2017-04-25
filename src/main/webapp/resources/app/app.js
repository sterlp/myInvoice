(function() {
    var base = 'resources/app/';
    var app = angular.module('myInvoice', ['ui.router']);
    
    // https://github.com/angular-ui/ui-router/wiki
    app.config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider) {
        $stateProvider.state('apphome', {
                url: '/',
                component: 'invoiceHome'
            }
        );
        $stateProvider.state('invoiceList', {
                url: '/invoiceList',
                component: 'invoiceList'
            }
        );
        $urlRouterProvider.otherwise('/');
    }]);
    app
        .component('invoiceHome', {
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
        .component('invoiceMenu', {
            bindings: {
                'title': '='
            },
            controller: function () {
                // this.title is available
                console.info("invoiceMenu loaded ...");
            },
            templateUrl: base + 'menu/menu.html'
        })
        ;
})();
