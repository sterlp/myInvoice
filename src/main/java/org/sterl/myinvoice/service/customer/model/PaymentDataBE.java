package org.sterl.myinvoice.service.customer.model;

import javax.persistence.Embeddable;

import lombok.Data;

@Data
@Embeddable
public class PaymentDataBE {
    private String creditCardNumber;
}