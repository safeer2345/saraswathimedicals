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
 * A Purchase.
 */
@Entity
@Table(name = "purchase")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Purchase implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "total")
    private Float total;

    @Column(name = "date")
    private Instant date;

    @ManyToOne
    @JsonIgnoreProperties(value = { "purchases" }, allowSetters = true)
    private Vender vender;

    @OneToMany(mappedBy = "purchase")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "product", "purchase" }, allowSetters = true)
    private Set<PurchaseDetails> purchaseDetails = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Purchase id(Long id) {
        this.id = id;
        return this;
    }

    public Float getTotal() {
        return this.total;
    }

    public Purchase total(Float total) {
        this.total = total;
        return this;
    }

    public void setTotal(Float total) {
        this.total = total;
    }

    public Instant getDate() {
        return this.date;
    }

    public Purchase date(Instant date) {
        this.date = date;
        return this;
    }

    public void setDate(Instant date) {
        this.date = date;
    }

    public Vender getVender() {
        return this.vender;
    }

    public Purchase vender(Vender vender) {
        this.setVender(vender);
        return this;
    }

    public void setVender(Vender vender) {
        this.vender = vender;
    }

    public Set<PurchaseDetails> getPurchaseDetails() {
        return this.purchaseDetails;
    }

    public Purchase purchaseDetails(Set<PurchaseDetails> purchaseDetails) {
        this.setPurchaseDetails(purchaseDetails);
        return this;
    }

    public Purchase addPurchaseDetails(PurchaseDetails purchaseDetails) {
        this.purchaseDetails.add(purchaseDetails);
        purchaseDetails.setPurchase(this);
        return this;
    }

    public Purchase removePurchaseDetails(PurchaseDetails purchaseDetails) {
        this.purchaseDetails.remove(purchaseDetails);
        purchaseDetails.setPurchase(null);
        return this;
    }

    public void setPurchaseDetails(Set<PurchaseDetails> purchaseDetails) {
        if (this.purchaseDetails != null) {
            this.purchaseDetails.forEach(i -> i.setPurchase(null));
        }
        if (purchaseDetails != null) {
            purchaseDetails.forEach(i -> i.setPurchase(this));
        }
        this.purchaseDetails = purchaseDetails;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Purchase)) {
            return false;
        }
        return id != null && id.equals(((Purchase) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Purchase{" +
            "id=" + getId() +
            ", total=" + getTotal() +
            ", date='" + getDate() + "'" +
            "}";
    }
}
