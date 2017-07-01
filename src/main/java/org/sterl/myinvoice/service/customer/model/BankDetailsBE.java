package org.sterl.myinvoice.service.customer.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity(name = "BANK_DETAILS")
@Table(name = "BANK_DETAILS")
public class BankDetailsBE {
    @Id
    @GeneratedValue
    @Column(name = "bank_details_id")
    private Long id;
    @Size(max = 255)
    private String label;
    @Column(name = "owner_name")
    @Size(max = 150)
    private String ownerName;
    @Column(length = 11, nullable = false)
    @Size(max = 11)
    @NotNull
    private String bic;
    @Size(max = 34)
    @NotNull
    @Column(length = 34, nullable = false)
    private String iban;
}