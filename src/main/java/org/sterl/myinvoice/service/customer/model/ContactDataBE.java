package org.sterl.myinvoice.service.customer.model;

import javax.persistence.Embeddable;

import lombok.Data;

@Data
@Embeddable
public class ContactDataBE {
    private String email;

    private String phone;
    private String mobilePhone;
    private String fax;
}
