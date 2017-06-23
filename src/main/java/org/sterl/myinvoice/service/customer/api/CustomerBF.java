package org.sterl.myinvoice.service.customer.api;

import java.util.List;
import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import org.sterl.myinvoice.service.customer.dao.CustomerDao;
import org.sterl.myinvoice.service.customer.model.CustomerBE;

@Stateless
@Path("/customer")
@Produces(MediaType.APPLICATION_JSON)
public class CustomerBF {
    @Inject CustomerDao customerDao;
    
    @GET
    public List<CustomerBE> get() {
        return customerDao.findAll();
    }
    
    @POST
    public CustomerBE create(CustomerBE customer) {
        customer.setId(null);
        customerDao.create(customer);
        return customer;
    }
    
    @PUT
    public CustomerBE update(CustomerBE customer) {
        return customerDao.update(customer);
    }
}
