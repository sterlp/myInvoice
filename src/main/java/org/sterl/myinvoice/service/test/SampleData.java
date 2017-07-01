package org.sterl.myinvoice.service.test;

import javax.annotation.PostConstruct;
import javax.ejb.EJB;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import org.sterl.myinvoice.service.customer.dao.CustomerDao;
import org.sterl.myinvoice.service.customer.model.ContactDataBE;
import org.sterl.myinvoice.service.customer.model.CustomerBE;

@Startup
@Singleton
public class SampleData {
    
    @EJB CustomerDao customerDao;
    
    @PostConstruct
    public void createSampleData() {
        CustomerBE c = new CustomerBE();
        c.setCity("München");
        c.setPostCode("D-80000");
        c.setCountry("Deutschland");
        c.setFirstName("Max");
        c.setName("Mustermann");
        c.setStreet("Maxstraße 1");
        c.setContactData(ContactDataBE.builder().email("max@web.de").phone("089-11111").mobilePhone("0172-222222").fax("089-111112").build());
        
        customerDao.create(c);
    }
}
