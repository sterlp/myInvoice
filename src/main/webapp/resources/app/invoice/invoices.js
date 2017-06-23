(function(angular) {
    'use strict';

    angular.module('myInvoice').component('invoiceList', {
        bindings: {
            'title': '@'
        },
        controller: function () {
            // this.title is available
            console.info("invoiceListComponent loaded ... " + this.title);
        },
        templateUrl: 'resources/app/invoice/invoice_list.html'
    });
})(angular);