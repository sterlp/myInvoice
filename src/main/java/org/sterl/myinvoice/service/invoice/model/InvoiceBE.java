package org.sterl.myinvoice.service.invoice.model;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import javax.xml.bind.annotation.XmlRootElement;

import org.sterl.myinvoice.service.customer.model.CustomerBE;

import lombok.Data;

@Entity
@Table(name = "INVOICE")
@Data
public class InvoiceBE {

    @Id
    @GeneratedValue
    private Long id;
    
    @NotNull
    @Column(name = "invoice_number")
    private String invoiceNumber;
    
    private String name;

    @JoinColumn(name = "customer_id")
    @OneToMany(fetch = FetchType.LAZY, orphanRemoval = true, cascade = CascadeType.ALL)
    @Size(max = 50)
    private List<InvoicePositionBE> positions = new ArrayList<>();
    
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "customer_id")
    @NotNull
    private CustomerBE customer;

    @Column(precision = 11, scale = 2)
    @NotNull
    private BigDecimal total = BigDecimal.ZERO;
    
    @Column(name = "invoice_date")
    private Long invoiceDate;

    @Column(name = "pay_date")
    private Long payDate;
    
    @PrePersist @PreUpdate
    private void beforeSave() {
        calculateTotal();
    }
    public boolean isEditable() {
        return true;
    }
    public BigDecimal calculateTotal() {
        total = BigDecimal.ZERO;
        for (InvoicePositionBE ip : positions) {
            total = total.add(ip.calculateBrutto());
        }
        return total;
    }
    public void addPosition(InvoicePositionBE invoicePosition) {
        if (positions == null) positions = new ArrayList<>();
        positions.add(invoicePosition);
    }
}
