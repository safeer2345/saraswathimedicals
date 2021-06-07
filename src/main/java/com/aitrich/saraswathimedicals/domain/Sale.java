package com.aitrich.saraswathimedicals.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Sale.
 */
@Entity
@Table(name = "sale")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Sale implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "toatal")
    private Float toatal;

    @Column(name = "date")
    private Instant date;

    @ManyToOne
    @JsonIgnoreProperties(value = { "sales" }, allowSetters = true)
    private Customer customer;

    @OneToMany(mappedBy = "sale")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "sale", "product" }, allowSetters = true)
    private Set<SalesDetails> salesDetails = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Sale id(Long id) {
        this.id = id;
        return this;
    }

    public Float getToatal() {
        return this.toatal;
    }

    public Sale toatal(Float toatal) {
        this.toatal = toatal;
        return this;
    }

    public void setToatal(Float toatal) {
        this.toatal = toatal;
    }

    public Instant getDate() {
        return this.date;
    }

    public Sale date(Instant date) {
        this.date = date;
        return this;
    }

    public void setDate(Instant date) {
        this.date = date;
    }

    public Customer getCustomer() {
        return this.customer;
    }

    public Sale customer(Customer customer) {
        this.setCustomer(customer);
        return this;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public Set<SalesDetails> getSalesDetails() {
        return this.salesDetails;
    }

    public Sale salesDetails(Set<SalesDetails> salesDetails) {
        this.setSalesDetails(salesDetails);
        return this;
    }

    public Sale addSalesDetails(SalesDetails salesDetails) {
        this.salesDetails.add(salesDetails);
        salesDetails.setSale(this);
        return this;
    }

    public Sale removeSalesDetails(SalesDetails salesDetails) {
        this.salesDetails.remove(salesDetails);
        salesDetails.setSale(null);
        return this;
    }

    public void setSalesDetails(Set<SalesDetails> salesDetails) {
        if (this.salesDetails != null) {
            this.salesDetails.forEach(i -> i.setSale(null));
        }
        if (salesDetails != null) {
            salesDetails.forEach(i -> i.setSale(this));
        }
        this.salesDetails = salesDetails;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Sale)) {
            return false;
        }
        return id != null && id.equals(((Sale) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Sale{" +
            "id=" + getId() +
            ", toatal=" + getToatal() +
            ", date='" + getDate() + "'" +
            "}";
    }
}
