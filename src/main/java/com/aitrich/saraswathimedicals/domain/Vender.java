package com.aitrich.saraswathimedicals.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Vender.
 */
@Entity
@Table(name = "vender")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Vender implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @NotNull
    @Column(name = "address", nullable = false)
    private String address;

    @NotNull
    @Column(name = "contact", nullable = false)
    private Long contact;

    @NotNull
    @Column(name = "date", nullable = false)
    private Instant date;

    @OneToMany(mappedBy = "vender")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "vender", "purchaseDetails" }, allowSetters = true)
    private Set<Purchase> purchases = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Vender id(Long id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return this.name;
    }

    public Vender name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return this.address;
    }

    public Vender address(String address) {
        this.address = address;
        return this;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Long getContact() {
        return this.contact;
    }

    public Vender contact(Long contact) {
        this.contact = contact;
        return this;
    }

    public void setContact(Long contact) {
        this.contact = contact;
    }

    public Instant getDate() {
        return this.date;
    }

    public Vender date(Instant date) {
        this.date = date;
        return this;
    }

    public void setDate(Instant date) {
        this.date = date;
    }

    public Set<Purchase> getPurchases() {
        return this.purchases;
    }

    public Vender purchases(Set<Purchase> purchases) {
        this.setPurchases(purchases);
        return this;
    }

    public Vender addPurchase(Purchase purchase) {
        this.purchases.add(purchase);
        purchase.setVender(this);
        return this;
    }

    public Vender removePurchase(Purchase purchase) {
        this.purchases.remove(purchase);
        purchase.setVender(null);
        return this;
    }

    public void setPurchases(Set<Purchase> purchases) {
        if (this.purchases != null) {
            this.purchases.forEach(i -> i.setVender(null));
        }
        if (purchases != null) {
            purchases.forEach(i -> i.setVender(this));
        }
        this.purchases = purchases;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Vender)) {
            return false;
        }
        return id != null && id.equals(((Vender) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Vender{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", address='" + getAddress() + "'" +
            ", contact=" + getContact() +
            ", date='" + getDate() + "'" +
            "}";
    }
}
