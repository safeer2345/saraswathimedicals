package com.aitrich.saraswathimedicals.web.rest;

import com.aitrich.saraswathimedicals.domain.ProductRate;
import com.aitrich.saraswathimedicals.repository.ProductRateRepository;
import com.aitrich.saraswathimedicals.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.aitrich.saraswathimedicals.domain.ProductRate}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ProductRateResource {

    private final Logger log = LoggerFactory.getLogger(ProductRateResource.class);

    private static final String ENTITY_NAME = "productRate";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProductRateRepository productRateRepository;

    public ProductRateResource(ProductRateRepository productRateRepository) {
        this.productRateRepository = productRateRepository;
    }

    /**
     * {@code POST  /product-rates} : Create a new productRate.
     *
     * @param productRate the productRate to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new productRate, or with status {@code 400 (Bad Request)} if the productRate has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/product-rates")
    public ResponseEntity<ProductRate> createProductRate(@RequestBody ProductRate productRate) throws URISyntaxException {
        log.debug("REST request to save ProductRate : {}", productRate);
        if (productRate.getId() != null) {
            throw new BadRequestAlertException("A new productRate cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ProductRate result = productRateRepository.save(productRate);
        return ResponseEntity
            .created(new URI("/api/product-rates/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /product-rates/:id} : Updates an existing productRate.
     *
     * @param id the id of the productRate to save.
     * @param productRate the productRate to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated productRate,
     * or with status {@code 400 (Bad Request)} if the productRate is not valid,
     * or with status {@code 500 (Internal Server Error)} if the productRate couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/product-rates/{id}")
    public ResponseEntity<ProductRate> updateProductRate(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ProductRate productRate
    ) throws URISyntaxException {
        log.debug("REST request to update ProductRate : {}, {}", id, productRate);
        if (productRate.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, productRate.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!productRateRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ProductRate result = productRateRepository.save(productRate);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, productRate.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /product-rates/:id} : Partial updates given fields of an existing productRate, field will ignore if it is null
     *
     * @param id the id of the productRate to save.
     * @param productRate the productRate to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated productRate,
     * or with status {@code 400 (Bad Request)} if the productRate is not valid,
     * or with status {@code 404 (Not Found)} if the productRate is not found,
     * or with status {@code 500 (Internal Server Error)} if the productRate couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/product-rates/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<ProductRate> partialUpdateProductRate(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ProductRate productRate
    ) throws URISyntaxException {
        log.debug("REST request to partial update ProductRate partially : {}, {}", id, productRate);
        if (productRate.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, productRate.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!productRateRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ProductRate> result = productRateRepository
            .findById(productRate.getId())
            .map(
                existingProductRate -> {
                    if (productRate.getPrice() != null) {
                        existingProductRate.setPrice(productRate.getPrice());
                    }

                    return existingProductRate;
                }
            )
            .map(productRateRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, productRate.getId().toString())
        );
    }

    /**
     * {@code GET  /product-rates} : get all the productRates.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of productRates in body.
     */
    @GetMapping("/product-rates")
    public List<ProductRate> getAllProductRates() {
        log.debug("REST request to get all ProductRates");
        return productRateRepository.findAll();
    }

    /**
     * {@code GET  /product-rates/:id} : get the "id" productRate.
     *
     * @param id the id of the productRate to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the productRate, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/product-rates/{id}")
    public ResponseEntity<ProductRate> getProductRate(@PathVariable Long id) {
        log.debug("REST request to get ProductRate : {}", id);
        Optional<ProductRate> productRate = productRateRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(productRate);
    }

    /**
     * {@code DELETE  /product-rates/:id} : delete the "id" productRate.
     *
     * @param id the id of the productRate to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/product-rates/{id}")
    public ResponseEntity<Void> deleteProductRate(@PathVariable Long id) {
        log.debug("REST request to delete ProductRate : {}", id);
        productRateRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
