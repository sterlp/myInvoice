package org.sterl.myinvoice.service.invoice.dao;

import javax.ejb.Stateless;
import org.sterl.common.jpa.AbstractDao;
import org.sterl.myinvoice.service.invoice.model.InvoiceBE;

@Stateless
public class InvoiceDao extends AbstractDao<Long, InvoiceBE> {
    public InvoiceDao() {
        super(InvoiceBE.class);
    }
}
