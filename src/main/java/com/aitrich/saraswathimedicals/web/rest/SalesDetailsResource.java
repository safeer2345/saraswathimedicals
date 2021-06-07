package com.aitrich.saraswathimedicals.web.rest;

import com.aitrich.saraswathimedicals.domain.SalesDetails;
import com.aitrich.saraswathimedicals.repository.SalesDetailsRepository;
import com.aitrich.saraswathimedicals.service.SalesService;
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
 * REST controller for managing {@link com.aitrich.saraswathimedicals.domain.SalesDetails}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class SalesDetailsResource {

    private final Logger log = LoggerFactory.getLogger(SalesDetailsResource.class);

    private static final String ENTITY_NAME = "salesDetails";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SalesDetailsRepository salesDetailsRepository;
    private SalesService salesService;

    public SalesDetailsResource(SalesDetailsRepository salesDetailsRepository, SalesService salesService) {
        this.salesDetailsRepository = salesDetailsRepository;
        this.salesService = salesService;
    }

    /**
     * {@code POST  /sales-details} : Create a new salesDetails.
     *
     * @param salesDetails the salesDetails to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new salesDetails, or with status {@code 400 (Bad Request)} if the salesDetails has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/sales-details")
    public ResponseEntity<SalesDetails> createSalesDetails(@RequestBody SalesDetails salesDetails) throws URISyntaxException {
        log.debug("REST request to save SalesDetails : {}", salesDetails);
        if (salesDetails.getId() != null) {
            throw new BadRequestAlertException("A new salesDetails cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SalesDetails result = salesService.saleProduct(salesDetails);
        return ResponseEntity
            .created(new URI("/api/sales-details/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /sales-details/:id} : Updates an existing salesDetails.
     *
     * @param id the id of the salesDetails to save.
     * @param salesDetails the salesDetails to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated salesDetails,
     * or with status {@code 400 (Bad Request)} if the salesDetails is not valid,
     * or with status {@code 500 (Internal Server Error)} if the salesDetails couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/sales-details/{id}")
    public ResponseEntity<SalesDetails> updateSalesDetails(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody SalesDetails salesDetails
    ) throws URISyntaxException {
        log.debug("REST request to update SalesDetails : {}, {}", id, salesDetails);
        if (salesDetails.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, salesDetails.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!salesDetailsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        SalesDetails result = salesDetailsRepository.save(salesDetails);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, salesDetails.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /sales-details/:id} : Partial updates given fields of an existing salesDetails, field will ignore if it is null
     *
     * @param id the id of the salesDetails to save.
     * @param salesDetails the salesDetails to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated salesDetails,
     * or with status {@code 400 (Bad Request)} if the salesDetails is not valid,
     * or with status {@code 404 (Not Found)} if the salesDetails is not found,
     * or with status {@code 500 (Internal Server Error)} if the salesDetails couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/sales-details/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<SalesDetails> partialUpdateSalesDetails(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody SalesDetails salesDetails
    ) throws URISyntaxException {
        log.debug("REST request to partial update SalesDetails partially : {}, {}", id, salesDetails);
        if (salesDetails.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, salesDetails.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!salesDetailsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<SalesDetails> result = salesDetailsRepository
            .findById(salesDetails.getId())
            .map(
                existingSalesDetails -> {
                    if (salesDetails.getQuantity() != null) {
                        existingSalesDetails.setQuantity(salesDetails.getQuantity());
                    }
                    if (salesDetails.getRate() != null) {
                        existingSalesDetails.setRate(salesDetails.getRate());
                    }

                    return existingSalesDetails;
                }
            )
            .map(salesDetailsRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, salesDetails.getId().toString())
        );
    }

    /**
     * {@code GET  /sales-details} : get all the salesDetails.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of salesDetails in body.
     */
    @GetMapping("/sales-details")
    public List<SalesDetails> getAllSalesDetails() {
        log.debug("REST request to get all SalesDetails");
        return salesDetailsRepository.findAll();
    }

    /**
     * {@code GET  /sales-details/:id} : get the "id" salesDetails.
     *
     * @param id the id of the salesDetails to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the salesDetails, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/sales-details/{id}")
    public ResponseEntity<SalesDetails> getSalesDetails(@PathVariable Long id) {
        log.debug("REST request to get SalesDetails : {}", id);
        Optional<SalesDetails> salesDetails = salesDetailsRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(salesDetails);
    }

    /**
     * {@code DELETE  /sales-details/:id} : delete the "id" salesDetails.
     *
     * @param id the id of the salesDetails to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/sales-details/{id}")
    public ResponseEntity<Void> deleteSalesDetails(@PathVariable Long id) {
        log.debug("REST request to delete SalesDetails : {}", id);
        salesDetailsRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
