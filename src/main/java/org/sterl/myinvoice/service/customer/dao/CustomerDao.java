package org.sterl.myinvoice.service.customer.dao;

import javax.ejb.Stateless;
import org.sterl.common.jpa.AbstractDao;
import org.sterl.myinvoice.service.customer.model.CustomerBE;

@Stateless
public class CustomerDao extends AbstractDao<Long, CustomerBE>{
    public CustomerDao() {
        super(CustomerBE.class);
    }
}
