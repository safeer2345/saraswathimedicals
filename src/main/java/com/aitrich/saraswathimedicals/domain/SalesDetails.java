package com.aitrich.saraswathimedicals.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A SalesDetails.
 */
@Entity
@Table(name = "sales_details")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class SalesDetails implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "rate")
    private Float rate;

    @ManyToOne
    @JsonIgnoreProperties(value = { "customer", "salesDetails" }, allowSetters = true)
    private Sale sale;

    @ManyToOne
    @JsonIgnoreProperties(value = { "productCategory", "stock", "productRate", "salesDetails", "purchaseDetails" }, allowSetters = true)
    private Product product;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public SalesDetails id(Long id) {
        this.id = id;
        return this;
    }

    public Integer getQuantity() {
        return this.quantity;
    }

    public SalesDetails quantity(Integer quantity) {
        this.quantity = quantity;
        return this;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Float getRate() {
        return this.rate;
    }

    public SalesDetails rate(Float rate) {
        this.rate = rate;
        return this;
    }

    public void setRate(Float rate) {
        this.rate = rate;
    }

    public Sale getSale() {
        return this.sale;
    }

    public SalesDetails sale(Sale sale) {
        this.setSale(sale);
        return this;
    }

    public void setSale(Sale sale) {
        this.sale = sale;
    }

    public Product getProduct() {
        return this.product;
    }

    public SalesDetails product(Product product) {
        this.setProduct(product);
        return this;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof SalesDetails)) {
            return false;
        }
        return id != null && id.equals(((SalesDetails) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "SalesDetails{" +
            "id=" + getId() +
            ", quantity=" + getQuantity() +
            ", rate=" + getRate() +
            "}";
    }
}
