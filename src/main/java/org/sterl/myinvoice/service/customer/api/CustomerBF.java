package org.sterl.myinvoice.service.customer.api;

import java.util.List;
import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.validation.Valid;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;
import org.sterl.myinvoice.service.customer.dao.CustomerDao;
import org.sterl.myinvoice.service.customer.model.CustomerBE;

@Stateless
@Path("/customer")
@Produces(MediaType.APPLICATION_JSON)
public class CustomerBF {
    @Inject CustomerDao customerDao;
    
    @GET
    public List<CustomerBE> list() {
        return customerDao.findAll();
    }
    
    @GET
    @Path("/{userId}")
    public Response get(@PathParam("userId") long userId) {
        CustomerBE result = customerDao.get(userId);
        if (result == null) return Response.status(Response.Status.NOT_FOUND).build();
        else return Response.ok(result).build();
    }
    
    @POST
    public Response create(@Context UriInfo uri, @Valid CustomerBE customer) {
        customer.setId(null);
        customerDao.create(customer);
        return Response
                .created(uri.getAbsolutePathBuilder().path(customer.getId().toString()).build())
                .entity(customer).build();
    }
    
    @PUT
    @Path("/{userId}")
    public CustomerBE update(@PathParam("userId") long userId, @Valid CustomerBE customer) {
        customer.setId(userId);
        return customerDao.update(customer);
    }
}
