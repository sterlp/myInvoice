package org.sterl.myinvoice.service.customer.model;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data 
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class ContactDataBE {
    
    @Size(max = 250)
    @Column(length = 250)
    private String email;
    @Size(max = 30)
    @Column(length = 30)
    private String phone;
    @Column(name = "mobile_phone", length = 30)
    @Size(max = 30)
    private String mobilePhone;
    @Size(max = 30)
    @Column(length = 30)
    private String fax;
}