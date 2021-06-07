package com.aitrich.saraswathimedicals.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A PurchaseDetails.
 */
@Entity
@Table(name = "purchase_details")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class PurchaseDetails implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "rate")
    private Float rate;

    @Column(name = "quantity")
    private Integer quantity;

    @ManyToOne
    @JsonIgnoreProperties(value = { "productCategory", "stock", "productRate", "salesDetails", "purchaseDetails" }, allowSetters = true)
    private Product product;

    @ManyToOne
    @JsonIgnoreProperties(value = { "vender", "purchaseDetails" }, allowSetters = true)
    private Purchase purchase;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public PurchaseDetails id(Long id) {
        this.id = id;
        return this;
    }

    public Float getRate() {
        return this.rate;
    }

    public PurchaseDetails rate(Float rate) {
        this.rate = rate;
        return this;
    }

    public void setRate(Float rate) {
        this.rate = rate;
    }

    public Integer getQuantity() {
        return this.quantity;
    }

    public PurchaseDetails quantity(Integer quantity) {
        this.quantity = quantity;
        return this;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Product getProduct() {
        return this.product;
    }

    public PurchaseDetails product(Product product) {
        this.setProduct(product);
        return this;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Purchase getPurchase() {
        return this.purchase;
    }

    public PurchaseDetails purchase(Purchase purchase) {
        this.setPurchase(purchase);
        return this;
    }

    public void setPurchase(Purchase purchase) {
        this.purchase = purchase;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof PurchaseDetails)) {
            return false;
        }
        return id != null && id.equals(((PurchaseDetails) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "PurchaseDetails{" +
            "id=" + getId() +
            ", rate=" + getRate() +
            ", quantity=" + getQuantity() +
            "}";
    }
}
