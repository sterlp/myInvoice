
package org.sterl.myinvoice.service.invoice.api;

import java.util.Arrays;
import java.util.List;
import javax.annotation.PostConstruct;
import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import org.sterl.myinvoice.service.invoice.dao.InvoiceDao;
import org.sterl.myinvoice.service.invoice.model.InvoiceBE;

@Path("/invoice")
@Produces(MediaType.APPLICATION_JSON)
@Stateless
public class InvoiceBF {
    
    @Inject InvoiceDao invoiceDao;
    
    @GET
    public List<InvoiceBE> get() {
        return invoiceDao.findAll();
    }
}