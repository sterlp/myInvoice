angular.module('myInvoice').component('invoiceList', {
    bindings: {
        'title': '='
    },
    controller: function () {
        // this.title is available
        console.info("invoiceListComponent loaded ...");
    },
    templateUrl: 'resources/app/invoice/invoice_list.html'
});