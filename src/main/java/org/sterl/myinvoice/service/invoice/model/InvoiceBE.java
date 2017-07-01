package org.sterl.myinvoice.service.invoice.model;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ForeignKey;
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

import org.sterl.myinvoice.service.customer.model.CustomerBE;

import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "INVOICE")
@Data @NoArgsConstructor 
public class InvoiceBE {

    @Id
    @GeneratedValue
    @Column(name = "invoice_id")
    private Long id;
    
    @NotNull
    @Column(name = "invoice_number")
    @Size(max = 255)
    private String invoiceNumber;
    
    @Size(max = 255)
    private String name;

    @JoinColumn(name = "invoice_id", foreignKey = @ForeignKey(name = "FK_INVOICE_TO_INVOICE_POSITION"))
    @OneToMany(fetch = FetchType.LAZY, orphanRemoval = true, cascade = CascadeType.ALL)
    @Size(max = 50)
    private List<InvoicePositionBE> positions = new ArrayList<>();
    
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "customer_id", foreignKey = @ForeignKey(name = "FK_INVOICE_TO_CUSTOMER"))
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
