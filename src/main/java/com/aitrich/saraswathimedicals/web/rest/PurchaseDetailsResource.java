package com.aitrich.saraswathimedicals.web.rest;

import com.aitrich.saraswathimedicals.domain.PurchaseDetails;
import com.aitrich.saraswathimedicals.repository.PurchaseDetailsRepository;
import com.aitrich.saraswathimedicals.repository.StockRepository;
import com.aitrich.saraswathimedicals.service.PurchaseDetailsService;
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
 * REST controller for managing {@link com.aitrich.saraswathimedicals.domain.PurchaseDetails}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class PurchaseDetailsResource {

    private final Logger log = LoggerFactory.getLogger(PurchaseDetailsResource.class);

    private static final String ENTITY_NAME = "purchaseDetails";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PurchaseDetailsRepository purchaseDetailsRepository;
    private PurchaseDetailsService purchaseDetailsService;
    private StockRepository stockRepository;

    public PurchaseDetailsResource(
        PurchaseDetailsRepository purchaseDetailsRepository,
        PurchaseDetailsService purchaseDetailsService,
        StockRepository stockRepository
    ) {
        this.purchaseDetailsRepository = purchaseDetailsRepository;
        this.purchaseDetailsService = purchaseDetailsService;
        this.stockRepository = stockRepository;
    }

    /**
     * {@code POST  /purchase-details} : Create a new purchaseDetails.
     *
     * @param purchaseDetails the purchaseDetails to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new purchaseDetails, or with status {@code 400 (Bad Request)} if the purchaseDetails has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/purchase-details")
    public ResponseEntity<PurchaseDetails> createPurchaseDetails(@RequestBody PurchaseDetails purchaseDetails) throws URISyntaxException {
        log.debug("REST request to save PurchaseDetails : {}", purchaseDetails);
        if (purchaseDetails.getId() != null) {
            throw new BadRequestAlertException("A new purchaseDetails cannot already have an ID", ENTITY_NAME, "idexists");
        }
        //stockRepository.addStock(purchaseDetails.getQuantity(),purchaseDetails.getProduct().getId());
        //log.debug("Stock Added");
        PurchaseDetails result = purchaseDetailsService.addPurchaseDetails(purchaseDetails);

        return ResponseEntity
            .created(new URI("/api/purchase-details/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /purchase-details/:id} : Updates an existing purchaseDetails.
     *
     * @param id the id of the purchaseDetails to save.
     * @param purchaseDetails the purchaseDetails to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated purchaseDetails,
     * or with status {@code 400 (Bad Request)} if the purchaseDetails is not valid,
     * or with status {@code 500 (Internal Server Error)} if the purchaseDetails couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/purchase-details/{id}")
    public ResponseEntity<PurchaseDetails> updatePurchaseDetails(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody PurchaseDetails purchaseDetails
    ) throws URISyntaxException {
        log.debug("REST request to update PurchaseDetails : {}, {}", id, purchaseDetails);
        if (purchaseDetails.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, purchaseDetails.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!purchaseDetailsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        PurchaseDetails result = purchaseDetailsRepository.save(purchaseDetails);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, purchaseDetails.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /purchase-details/:id} : Partial updates given fields of an existing purchaseDetails, field will ignore if it is null
     *
     * @param id the id of the purchaseDetails to save.
     * @param purchaseDetails the purchaseDetails to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated purchaseDetails,
     * or with status {@code 400 (Bad Request)} if the purchaseDetails is not valid,
     * or with status {@code 404 (Not Found)} if the purchaseDetails is not found,
     * or with status {@code 500 (Internal Server Error)} if the purchaseDetails couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/purchase-details/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<PurchaseDetails> partialUpdatePurchaseDetails(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody PurchaseDetails purchaseDetails
    ) throws URISyntaxException {
        log.debug("REST request to partial update PurchaseDetails partially : {}, {}", id, purchaseDetails);
        if (purchaseDetails.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, purchaseDetails.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!purchaseDetailsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<PurchaseDetails> result = purchaseDetailsRepository
            .findById(purchaseDetails.getId())
            .map(
                existingPurchaseDetails -> {
                    if (purchaseDetails.getRate() != null) {
                        existingPurchaseDetails.setRate(purchaseDetails.getRate());
                    }
                    if (purchaseDetails.getQuantity() != null) {
                        existingPurchaseDetails.setQuantity(purchaseDetails.getQuantity());
                    }

                    return existingPurchaseDetails;
                }
            )
            .map(purchaseDetailsRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, purchaseDetails.getId().toString())
        );
    }

    /**
     * {@code GET  /purchase-details} : get all the purchaseDetails.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of purchaseDetails in body.
     */
    @GetMapping("/purchase-details")
    public List<PurchaseDetails> getAllPurchaseDetails() {
        log.debug("REST request to get all PurchaseDetails");
        return purchaseDetailsRepository.findAll();
    }

    /**
     * {@code GET  /purchase-details/:id} : get the "id" purchaseDetails.
     *
     * @param id the id of the purchaseDetails to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the purchaseDetails, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/purchase-details/{id}")
    public ResponseEntity<PurchaseDetails> getPurchaseDetails(@PathVariable Long id) {
        log.debug("REST request to get PurchaseDetails : {}", id);
        Optional<PurchaseDetails> purchaseDetails = purchaseDetailsRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(purchaseDetails);
    }

    /**
     * {@code DELETE  /purchase-details/:id} : delete the "id" purchaseDetails.
     *
     * @param id the id of the purchaseDetails to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/purchase-details/{id}")
    public ResponseEntity<Void> deletePurchaseDetails(@PathVariable Long id) {
        log.debug("REST request to delete PurchaseDetails : {}", id);
        purchaseDetailsRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
