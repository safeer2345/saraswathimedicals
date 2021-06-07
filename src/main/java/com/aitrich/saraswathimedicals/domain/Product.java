package com.aitrich.saraswathimedicals.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Product.
 */
@Entity
@Table(name = "product")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Product implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @Lob
    @Column(name = "image")
    private byte[] image;

    @Column(name = "image_content_type")
    private String imageContentType;

    @ManyToOne
    @JsonIgnoreProperties(value = { "products" }, allowSetters = true)
    private ProductCategory productCategory;

    @JsonIgnoreProperties(value = { "product" }, allowSetters = true)
    @OneToOne(mappedBy = "product")
    private Stock stock;

    @JsonIgnoreProperties(value = { "product" }, allowSetters = true)
    @OneToOne(mappedBy = "product")
    private ProductRate productRate;

    @OneToMany(mappedBy = "product")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "sale", "product" }, allowSetters = true)
    private Set<SalesDetails> salesDetails = new HashSet<>();

    @OneToMany(mappedBy = "product")
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

    public Product id(Long id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return this.name;
    }

    public Product name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public byte[] getImage() {
        return this.image;
    }

    public Product image(byte[] image) {
        this.image = image;
        return this;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public String getImageContentType() {
        return this.imageContentType;
    }

    public Product imageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
        return this;
    }

    public void setImageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
    }

    public ProductCategory getProductCategory() {
        return this.productCategory;
    }

    public Product productCategory(ProductCategory productCategory) {
        this.setProductCategory(productCategory);
        return this;
    }

    public void setProductCategory(ProductCategory productCategory) {
        this.productCategory = productCategory;
    }

    public Stock getStock() {
        return this.stock;
    }

    public Product stock(Stock stock) {
        this.setStock(stock);
        return this;
    }

    public void setStock(Stock stock) {
        if (this.stock != null) {
            this.stock.setProduct(null);
        }
        if (stock != null) {
            stock.setProduct(this);
        }
        this.stock = stock;
    }

    public ProductRate getProductRate() {
        return this.productRate;
    }

    public Product productRate(ProductRate productRate) {
        this.setProductRate(productRate);
        return this;
    }

    public void setProductRate(ProductRate productRate) {
        if (this.productRate != null) {
            this.productRate.setProduct(null);
        }
        if (productRate != null) {
            productRate.setProduct(this);
        }
        this.productRate = productRate;
    }

    public Set<SalesDetails> getSalesDetails() {
        return this.salesDetails;
    }

    public Product salesDetails(Set<SalesDetails> salesDetails) {
        this.setSalesDetails(salesDetails);
        return this;
    }

    public Product addSalesDetails(SalesDetails salesDetails) {
        this.salesDetails.add(salesDetails);
        salesDetails.setProduct(this);
        return this;
    }

    public Product removeSalesDetails(SalesDetails salesDetails) {
        this.salesDetails.remove(salesDetails);
        salesDetails.setProduct(null);
        return this;
    }

    public void setSalesDetails(Set<SalesDetails> salesDetails) {
        if (this.salesDetails != null) {
            this.salesDetails.forEach(i -> i.setProduct(null));
        }
        if (salesDetails != null) {
            salesDetails.forEach(i -> i.setProduct(this));
        }
        this.salesDetails = salesDetails;
    }

    public Set<PurchaseDetails> getPurchaseDetails() {
        return this.purchaseDetails;
    }

    public Product purchaseDetails(Set<PurchaseDetails> purchaseDetails) {
        this.setPurchaseDetails(purchaseDetails);
        return this;
    }

    public Product addPurchaseDetails(PurchaseDetails purchaseDetails) {
        this.purchaseDetails.add(purchaseDetails);
        purchaseDetails.setProduct(this);
        return this;
    }

    public Product removePurchaseDetails(PurchaseDetails purchaseDetails) {
        this.purchaseDetails.remove(purchaseDetails);
        purchaseDetails.setProduct(null);
        return this;
    }

    public void setPurchaseDetails(Set<PurchaseDetails> purchaseDetails) {
        if (this.purchaseDetails != null) {
            this.purchaseDetails.forEach(i -> i.setProduct(null));
        }
        if (purchaseDetails != null) {
            purchaseDetails.forEach(i -> i.setProduct(this));
        }
        this.purchaseDetails = purchaseDetails;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Product)) {
            return false;
        }
        return id != null && id.equals(((Product) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Product{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", image='" + getImage() + "'" +
            ", imageContentType='" + getImageContentType() + "'" +
            "}";
    }
}
