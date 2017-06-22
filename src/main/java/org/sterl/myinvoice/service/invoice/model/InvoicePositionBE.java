package org.sterl.myinvoice.service.invoice.model;

import java.math.BigDecimal;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import lombok.Data;

@Entity
@Table(name = "INVOICE")
@Data
public class InvoicePositionBE {
    @Id
    @GeneratedValue
    private Long id;
    
    @Size(max = 1024)
    private String text;
    
    @Size(max = 256)
    private String label;

    @Column(name = "material_number")
    @Size(max = 256)
    private String materialNumber;
    
    @Column(precision = 0, scale = 3)
    @Min(1) @Max(999)
    private int quantity = 1;

    @Column(precision = 1, scale = 3)
    @NotNull
    private BigDecimal tax = new BigDecimal(0.19f);

    /** the netto price of something */
    @Column(precision = 9, scale = 2)
    @NotNull
    private BigDecimal price = BigDecimal.ZERO;
    
    public BigDecimal calculateBrutto() {
        if (BigDecimal.ZERO.compareTo(price) == 0) return BigDecimal.ZERO;
        BigDecimal result;
        if (quantity > 1) result = price.multiply(BigDecimal.valueOf(quantity));
        else result = price;
        return result.add(result.multiply(tax));
    }
}