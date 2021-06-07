package com.aitrich.saraswathimedicals.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.aitrich.saraswathimedicals.IntegrationTest;
import com.aitrich.saraswathimedicals.domain.PurchaseDetails;
import com.aitrich.saraswathimedicals.repository.PurchaseDetailsRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link PurchaseDetailsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PurchaseDetailsResourceIT {

    private static final Float DEFAULT_RATE = 1F;
    private static final Float UPDATED_RATE = 2F;

    private static final Integer DEFAULT_QUANTITY = 1;
    private static final Integer UPDATED_QUANTITY = 2;

    private static final String ENTITY_API_URL = "/api/purchase-details";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PurchaseDetailsRepository purchaseDetailsRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPurchaseDetailsMockMvc;

    private PurchaseDetails purchaseDetails;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PurchaseDetails createEntity(EntityManager em) {
        PurchaseDetails purchaseDetails = new PurchaseDetails().rate(DEFAULT_RATE).quantity(DEFAULT_QUANTITY);
        return purchaseDetails;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PurchaseDetails createUpdatedEntity(EntityManager em) {
        PurchaseDetails purchaseDetails = new PurchaseDetails().rate(UPDATED_RATE).quantity(UPDATED_QUANTITY);
        return purchaseDetails;
    }

    @BeforeEach
    public void initTest() {
        purchaseDetails = createEntity(em);
    }

    @Test
    @Transactional
    void createPurchaseDetails() throws Exception {
        int databaseSizeBeforeCreate = purchaseDetailsRepository.findAll().size();
        // Create the PurchaseDetails
        restPurchaseDetailsMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(purchaseDetails))
            )
            .andExpect(status().isCreated());

        // Validate the PurchaseDetails in the database
        List<PurchaseDetails> purchaseDetailsList = purchaseDetailsRepository.findAll();
        assertThat(purchaseDetailsList).hasSize(databaseSizeBeforeCreate + 1);
        PurchaseDetails testPurchaseDetails = purchaseDetailsList.get(purchaseDetailsList.size() - 1);
        assertThat(testPurchaseDetails.getRate()).isEqualTo(DEFAULT_RATE);
        assertThat(testPurchaseDetails.getQuantity()).isEqualTo(DEFAULT_QUANTITY);
    }

    @Test
    @Transactional
    void createPurchaseDetailsWithExistingId() throws Exception {
        // Create the PurchaseDetails with an existing ID
        purchaseDetails.setId(1L);

        int databaseSizeBeforeCreate = purchaseDetailsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPurchaseDetailsMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(purchaseDetails))
            )
            .andExpect(status().isBadRequest());

        // Validate the PurchaseDetails in the database
        List<PurchaseDetails> purchaseDetailsList = purchaseDetailsRepository.findAll();
        assertThat(purchaseDetailsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllPurchaseDetails() throws Exception {
        // Initialize the database
        purchaseDetailsRepository.saveAndFlush(purchaseDetails);

        // Get all the purchaseDetailsList
        restPurchaseDetailsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(purchaseDetails.getId().intValue())))
            .andExpect(jsonPath("$.[*].rate").value(hasItem(DEFAULT_RATE.doubleValue())))
            .andExpect(jsonPath("$.[*].quantity").value(hasItem(DEFAULT_QUANTITY)));
    }

    @Test
    @Transactional
    void getPurchaseDetails() throws Exception {
        // Initialize the database
        purchaseDetailsRepository.saveAndFlush(purchaseDetails);

        // Get the purchaseDetails
        restPurchaseDetailsMockMvc
            .perform(get(ENTITY_API_URL_ID, purchaseDetails.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(purchaseDetails.getId().intValue()))
            .andExpect(jsonPath("$.rate").value(DEFAULT_RATE.doubleValue()))
            .andExpect(jsonPath("$.quantity").value(DEFAULT_QUANTITY));
    }

    @Test
    @Transactional
    void getNonExistingPurchaseDetails() throws Exception {
        // Get the purchaseDetails
        restPurchaseDetailsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewPurchaseDetails() throws Exception {
        // Initialize the database
        purchaseDetailsRepository.saveAndFlush(purchaseDetails);

        int databaseSizeBeforeUpdate = purchaseDetailsRepository.findAll().size();

        // Update the purchaseDetails
        PurchaseDetails updatedPurchaseDetails = purchaseDetailsRepository.findById(purchaseDetails.getId()).get();
        // Disconnect from session so that the updates on updatedPurchaseDetails are not directly saved in db
        em.detach(updatedPurchaseDetails);
        updatedPurchaseDetails.rate(UPDATED_RATE).quantity(UPDATED_QUANTITY);

        restPurchaseDetailsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPurchaseDetails.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPurchaseDetails))
            )
            .andExpect(status().isOk());

        // Validate the PurchaseDetails in the database
        List<PurchaseDetails> purchaseDetailsList = purchaseDetailsRepository.findAll();
        assertThat(purchaseDetailsList).hasSize(databaseSizeBeforeUpdate);
        PurchaseDetails testPurchaseDetails = purchaseDetailsList.get(purchaseDetailsList.size() - 1);
        assertThat(testPurchaseDetails.getRate()).isEqualTo(UPDATED_RATE);
        assertThat(testPurchaseDetails.getQuantity()).isEqualTo(UPDATED_QUANTITY);
    }

    @Test
    @Transactional
    void putNonExistingPurchaseDetails() throws Exception {
        int databaseSizeBeforeUpdate = purchaseDetailsRepository.findAll().size();
        purchaseDetails.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPurchaseDetailsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, purchaseDetails.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(purchaseDetails))
            )
            .andExpect(status().isBadRequest());

        // Validate the PurchaseDetails in the database
        List<PurchaseDetails> purchaseDetailsList = purchaseDetailsRepository.findAll();
        assertThat(purchaseDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPurchaseDetails() throws Exception {
        int databaseSizeBeforeUpdate = purchaseDetailsRepository.findAll().size();
        purchaseDetails.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPurchaseDetailsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(purchaseDetails))
            )
            .andExpect(status().isBadRequest());

        // Validate the PurchaseDetails in the database
        List<PurchaseDetails> purchaseDetailsList = purchaseDetailsRepository.findAll();
        assertThat(purchaseDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPurchaseDetails() throws Exception {
        int databaseSizeBeforeUpdate = purchaseDetailsRepository.findAll().size();
        purchaseDetails.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPurchaseDetailsMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(purchaseDetails))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the PurchaseDetails in the database
        List<PurchaseDetails> purchaseDetailsList = purchaseDetailsRepository.findAll();
        assertThat(purchaseDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePurchaseDetailsWithPatch() throws Exception {
        // Initialize the database
        purchaseDetailsRepository.saveAndFlush(purchaseDetails);

        int databaseSizeBeforeUpdate = purchaseDetailsRepository.findAll().size();

        // Update the purchaseDetails using partial update
        PurchaseDetails partialUpdatedPurchaseDetails = new PurchaseDetails();
        partialUpdatedPurchaseDetails.setId(purchaseDetails.getId());

        restPurchaseDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPurchaseDetails.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPurchaseDetails))
            )
            .andExpect(status().isOk());

        // Validate the PurchaseDetails in the database
        List<PurchaseDetails> purchaseDetailsList = purchaseDetailsRepository.findAll();
        assertThat(purchaseDetailsList).hasSize(databaseSizeBeforeUpdate);
        PurchaseDetails testPurchaseDetails = purchaseDetailsList.get(purchaseDetailsList.size() - 1);
        assertThat(testPurchaseDetails.getRate()).isEqualTo(DEFAULT_RATE);
        assertThat(testPurchaseDetails.getQuantity()).isEqualTo(DEFAULT_QUANTITY);
    }

    @Test
    @Transactional
    void fullUpdatePurchaseDetailsWithPatch() throws Exception {
        // Initialize the database
        purchaseDetailsRepository.saveAndFlush(purchaseDetails);

        int databaseSizeBeforeUpdate = purchaseDetailsRepository.findAll().size();

        // Update the purchaseDetails using partial update
        PurchaseDetails partialUpdatedPurchaseDetails = new PurchaseDetails();
        partialUpdatedPurchaseDetails.setId(purchaseDetails.getId());

        partialUpdatedPurchaseDetails.rate(UPDATED_RATE).quantity(UPDATED_QUANTITY);

        restPurchaseDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPurchaseDetails.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPurchaseDetails))
            )
            .andExpect(status().isOk());

        // Validate the PurchaseDetails in the database
        List<PurchaseDetails> purchaseDetailsList = purchaseDetailsRepository.findAll();
        assertThat(purchaseDetailsList).hasSize(databaseSizeBeforeUpdate);
        PurchaseDetails testPurchaseDetails = purchaseDetailsList.get(purchaseDetailsList.size() - 1);
        assertThat(testPurchaseDetails.getRate()).isEqualTo(UPDATED_RATE);
        assertThat(testPurchaseDetails.getQuantity()).isEqualTo(UPDATED_QUANTITY);
    }

    @Test
    @Transactional
    void patchNonExistingPurchaseDetails() throws Exception {
        int databaseSizeBeforeUpdate = purchaseDetailsRepository.findAll().size();
        purchaseDetails.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPurchaseDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, purchaseDetails.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(purchaseDetails))
            )
            .andExpect(status().isBadRequest());

        // Validate the PurchaseDetails in the database
        List<PurchaseDetails> purchaseDetailsList = purchaseDetailsRepository.findAll();
        assertThat(purchaseDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPurchaseDetails() throws Exception {
        int databaseSizeBeforeUpdate = purchaseDetailsRepository.findAll().size();
        purchaseDetails.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPurchaseDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(purchaseDetails))
            )
            .andExpect(status().isBadRequest());

        // Validate the PurchaseDetails in the database
        List<PurchaseDetails> purchaseDetailsList = purchaseDetailsRepository.findAll();
        assertThat(purchaseDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPurchaseDetails() throws Exception {
        int databaseSizeBeforeUpdate = purchaseDetailsRepository.findAll().size();
        purchaseDetails.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPurchaseDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(purchaseDetails))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the PurchaseDetails in the database
        List<PurchaseDetails> purchaseDetailsList = purchaseDetailsRepository.findAll();
        assertThat(purchaseDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePurchaseDetails() throws Exception {
        // Initialize the database
        purchaseDetailsRepository.saveAndFlush(purchaseDetails);

        int databaseSizeBeforeDelete = purchaseDetailsRepository.findAll().size();

        // Delete the purchaseDetails
        restPurchaseDetailsMockMvc
            .perform(delete(ENTITY_API_URL_ID, purchaseDetails.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<PurchaseDetails> purchaseDetailsList = purchaseDetailsRepository.findAll();
        assertThat(purchaseDetailsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
