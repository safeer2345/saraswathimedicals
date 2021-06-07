package com.aitrich.saraswathimedicals.web.rest;

import com.aitrich.saraswathimedicals.domain.Vender;
import com.aitrich.saraswathimedicals.repository.VenderRepository;
import com.aitrich.saraswathimedicals.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.aitrich.saraswathimedicals.domain.Vender}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class VenderResource {

    private final Logger log = LoggerFactory.getLogger(VenderResource.class);

    private static final String ENTITY_NAME = "vender";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final VenderRepository venderRepository;

    public VenderResource(VenderRepository venderRepository) {
        this.venderRepository = venderRepository;
    }

    /**
     * {@code POST  /venders} : Create a new vender.
     *
     * @param vender the vender to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new vender, or with status {@code 400 (Bad Request)} if the vender has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/venders")
    public ResponseEntity<Vender> createVender(@Valid @RequestBody Vender vender) throws URISyntaxException {
        log.debug("REST request to save Vender : {}", vender);
        if (vender.getId() != null) {
            throw new BadRequestAlertException("A new vender cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Vender result = venderRepository.save(vender);
        return ResponseEntity
            .created(new URI("/api/venders/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /venders/:id} : Updates an existing vender.
     *
     * @param id the id of the vender to save.
     * @param vender the vender to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated vender,
     * or with status {@code 400 (Bad Request)} if the vender is not valid,
     * or with status {@code 500 (Internal Server Error)} if the vender couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/venders/{id}")
    public ResponseEntity<Vender> updateVender(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Vender vender
    ) throws URISyntaxException {
        log.debug("REST request to update Vender : {}, {}", id, vender);
        if (vender.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, vender.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!venderRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Vender result = venderRepository.save(vender);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, vender.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /venders/:id} : Partial updates given fields of an existing vender, field will ignore if it is null
     *
     * @param id the id of the vender to save.
     * @param vender the vender to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated vender,
     * or with status {@code 400 (Bad Request)} if the vender is not valid,
     * or with status {@code 404 (Not Found)} if the vender is not found,
     * or with status {@code 500 (Internal Server Error)} if the vender couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/venders/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Vender> partialUpdateVender(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Vender vender
    ) throws URISyntaxException {
        log.debug("REST request to partial update Vender partially : {}, {}", id, vender);
        if (vender.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, vender.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!venderRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Vender> result = venderRepository
            .findById(vender.getId())
            .map(
                existingVender -> {
                    if (vender.getName() != null) {
                        existingVender.setName(vender.getName());
                    }
                    if (vender.getAddress() != null) {
                        existingVender.setAddress(vender.getAddress());
                    }
                    if (vender.getContact() != null) {
                        existingVender.setContact(vender.getContact());
                    }
                    if (vender.getDate() != null) {
                        existingVender.setDate(vender.getDate());
                    }

                    return existingVender;
                }
            )
            .map(venderRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, vender.getId().toString())
        );
    }

    /**
     * {@code GET  /venders} : get all the venders.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of venders in body.
     */
    @GetMapping("/venders")
    public List<Vender> getAllVenders() {
        log.debug("REST request to get all Venders");
        return venderRepository.findAll();
    }

    /**
     * {@code GET  /venders/:id} : get the "id" vender.
     *
     * @param id the id of the vender to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the vender, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/venders/{id}")
    public ResponseEntity<Vender> getVender(@PathVariable Long id) {
        log.debug("REST request to get Vender : {}", id);
        Optional<Vender> vender = venderRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(vender);
    }

    /**
     * {@code DELETE  /venders/:id} : delete the "id" vender.
     *
     * @param id the id of the vender to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/venders/{id}")
    public ResponseEntity<Void> deleteVender(@PathVariable Long id) {
        log.debug("REST request to delete Vender : {}", id);
        venderRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
