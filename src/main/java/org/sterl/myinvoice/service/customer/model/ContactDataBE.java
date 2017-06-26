package org.sterl.myinvoice.service.customer.model;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.validation.constraints.Size;

import lombok.Data;

@Data
@Embeddable
public class ContactDataBE {
    
    @Size(max = 5)
    private String email;
    private String phone;
    @Column(name = "mobile_phone")
    private String mobilePhone;
    private String fax;
}