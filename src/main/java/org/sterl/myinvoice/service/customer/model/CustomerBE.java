package org.sterl.myinvoice.service.customer.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Table;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import lombok.AccessLevel;
import lombok.Data;
import lombok.Getter;
import org.sterl.common.util.StringUtils;

@Entity
@Table(name = "CUSTOMER")
@Data
public class CustomerBE {

    @Id
    @GeneratedValue
    @Column(name="customer_id")
    private Long id;
    @Size(max = 64)
    private String title;
    @NotNull @Size(min = 1, max = 512)
    private String name;
    @Size(max = 512)
    private String firstName;
    @Size(max = 512)
    private String street;
    @Size(max = 16)
    private String postCode;
    @Size(max = 512)
    private String city;
    @Size(max = 512)
    private String country;
    
    @Getter(AccessLevel.NONE)
    @Valid
    private ContactDataBE contactData;
    
    @PrePersist @PreUpdate
    private void beforeSave() {
    }
    
    public String getDisplayName() {
        return  (firstName == null ? "" : firstName + " ") + name;
    }
    
    public String getAddress() {
        String result = StringUtils.trimToEmpty(street)
                + ", "
                + StringUtils.trimToEmpty(postCode)
                + " "
                + StringUtils.trimToEmpty(city);
        return StringUtils.trimToEmpty(result);
    }
    
    public ContactDataBE getContactData() {
        if (contactData == null) contactData = new ContactDataBE();
        return contactData;
     }
}