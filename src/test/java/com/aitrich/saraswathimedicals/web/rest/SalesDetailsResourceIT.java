package com.aitrich.saraswathimedicals.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.aitrich.saraswathimedicals.IntegrationTest;
import com.aitrich.saraswathimedicals.domain.SalesDetails;
import com.aitrich.saraswathimedicals.repository.SalesDetailsRepository;
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
 * Integration tests for the {@link SalesDetailsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SalesDetailsResourceIT {

    private static final Integer DEFAULT_QUANTITY = 1;
    private static final Integer UPDATED_QUANTITY = 2;

    private static final Float DEFAULT_RATE = 1F;
    private static final Float UPDATED_RATE = 2F;

    private static final String ENTITY_API_URL = "/api/sales-details";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SalesDetailsRepository salesDetailsRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSalesDetailsMockMvc;

    private SalesDetails salesDetails;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SalesDetails createEntity(EntityManager em) {
        SalesDetails salesDetails = new SalesDetails().quantity(DEFAULT_QUANTITY).rate(DEFAULT_RATE);
        return salesDetails;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SalesDetails createUpdatedEntity(EntityManager em) {
        SalesDetails salesDetails = new SalesDetails().quantity(UPDATED_QUANTITY).rate(UPDATED_RATE);
        return salesDetails;
    }

    @BeforeEach
    public void initTest() {
        salesDetails = createEntity(em);
    }

    @Test
    @Transactional
    void createSalesDetails() throws Exception {
        int databaseSizeBeforeCreate = salesDetailsRepository.findAll().size();
        // Create the SalesDetails
        restSalesDetailsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(salesDetails)))
            .andExpect(status().isCreated());

        // Validate the SalesDetails in the database
        List<SalesDetails> salesDetailsList = salesDetailsRepository.findAll();
        assertThat(salesDetailsList).hasSize(databaseSizeBeforeCreate + 1);
        SalesDetails testSalesDetails = salesDetailsList.get(salesDetailsList.size() - 1);
        assertThat(testSalesDetails.getQuantity()).isEqualTo(DEFAULT_QUANTITY);
        assertThat(testSalesDetails.getRate()).isEqualTo(DEFAULT_RATE);
    }

    @Test
    @Transactional
    void createSalesDetailsWithExistingId() throws Exception {
        // Create the SalesDetails with an existing ID
        salesDetails.setId(1L);

        int databaseSizeBeforeCreate = salesDetailsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSalesDetailsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(salesDetails)))
            .andExpect(status().isBadRequest());

        // Validate the SalesDetails in the database
        List<SalesDetails> salesDetailsList = salesDetailsRepository.findAll();
        assertThat(salesDetailsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllSalesDetails() throws Exception {
        // Initialize the database
        salesDetailsRepository.saveAndFlush(salesDetails);

        // Get all the salesDetailsList
        restSalesDetailsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(salesDetails.getId().intValue())))
            .andExpect(jsonPath("$.[*].quantity").value(hasItem(DEFAULT_QUANTITY)))
            .andExpect(jsonPath("$.[*].rate").value(hasItem(DEFAULT_RATE.doubleValue())));
    }

    @Test
    @Transactional
    void getSalesDetails() throws Exception {
        // Initialize the database
        salesDetailsRepository.saveAndFlush(salesDetails);

        // Get the salesDetails
        restSalesDetailsMockMvc
            .perform(get(ENTITY_API_URL_ID, salesDetails.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(salesDetails.getId().intValue()))
            .andExpect(jsonPath("$.quantity").value(DEFAULT_QUANTITY))
            .andExpect(jsonPath("$.rate").value(DEFAULT_RATE.doubleValue()));
    }

    @Test
    @Transactional
    void getNonExistingSalesDetails() throws Exception {
        // Get the salesDetails
        restSalesDetailsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewSalesDetails() throws Exception {
        // Initialize the database
        salesDetailsRepository.saveAndFlush(salesDetails);

        int databaseSizeBeforeUpdate = salesDetailsRepository.findAll().size();

        // Update the salesDetails
        SalesDetails updatedSalesDetails = salesDetailsRepository.findById(salesDetails.getId()).get();
        // Disconnect from session so that the updates on updatedSalesDetails are not directly saved in db
        em.detach(updatedSalesDetails);
        updatedSalesDetails.quantity(UPDATED_QUANTITY).rate(UPDATED_RATE);

        restSalesDetailsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSalesDetails.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSalesDetails))
            )
            .andExpect(status().isOk());

        // Validate the SalesDetails in the database
        List<SalesDetails> salesDetailsList = salesDetailsRepository.findAll();
        assertThat(salesDetailsList).hasSize(databaseSizeBeforeUpdate);
        SalesDetails testSalesDetails = salesDetailsList.get(salesDetailsList.size() - 1);
        assertThat(testSalesDetails.getQuantity()).isEqualTo(UPDATED_QUANTITY);
        assertThat(testSalesDetails.getRate()).isEqualTo(UPDATED_RATE);
    }

    @Test
    @Transactional
    void putNonExistingSalesDetails() throws Exception {
        int databaseSizeBeforeUpdate = salesDetailsRepository.findAll().size();
        salesDetails.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSalesDetailsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, salesDetails.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(salesDetails))
            )
            .andExpect(status().isBadRequest());

        // Validate the SalesDetails in the database
        List<SalesDetails> salesDetailsList = salesDetailsRepository.findAll();
        assertThat(salesDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSalesDetails() throws Exception {
        int databaseSizeBeforeUpdate = salesDetailsRepository.findAll().size();
        salesDetails.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSalesDetailsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(salesDetails))
            )
            .andExpect(status().isBadRequest());

        // Validate the SalesDetails in the database
        List<SalesDetails> salesDetailsList = salesDetailsRepository.findAll();
        assertThat(salesDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSalesDetails() throws Exception {
        int databaseSizeBeforeUpdate = salesDetailsRepository.findAll().size();
        salesDetails.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSalesDetailsMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(salesDetails)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the SalesDetails in the database
        List<SalesDetails> salesDetailsList = salesDetailsRepository.findAll();
        assertThat(salesDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSalesDetailsWithPatch() throws Exception {
        // Initialize the database
        salesDetailsRepository.saveAndFlush(salesDetails);

        int databaseSizeBeforeUpdate = salesDetailsRepository.findAll().size();

        // Update the salesDetails using partial update
        SalesDetails partialUpdatedSalesDetails = new SalesDetails();
        partialUpdatedSalesDetails.setId(salesDetails.getId());

        partialUpdatedSalesDetails.quantity(UPDATED_QUANTITY).rate(UPDATED_RATE);

        restSalesDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSalesDetails.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSalesDetails))
            )
            .andExpect(status().isOk());

        // Validate the SalesDetails in the database
        List<SalesDetails> salesDetailsList = salesDetailsRepository.findAll();
        assertThat(salesDetailsList).hasSize(databaseSizeBeforeUpdate);
        SalesDetails testSalesDetails = salesDetailsList.get(salesDetailsList.size() - 1);
        assertThat(testSalesDetails.getQuantity()).isEqualTo(UPDATED_QUANTITY);
        assertThat(testSalesDetails.getRate()).isEqualTo(UPDATED_RATE);
    }

    @Test
    @Transactional
    void fullUpdateSalesDetailsWithPatch() throws Exception {
        // Initialize the database
        salesDetailsRepository.saveAndFlush(salesDetails);

        int databaseSizeBeforeUpdate = salesDetailsRepository.findAll().size();

        // Update the salesDetails using partial update
        SalesDetails partialUpdatedSalesDetails = new SalesDetails();
        partialUpdatedSalesDetails.setId(salesDetails.getId());

        partialUpdatedSalesDetails.quantity(UPDATED_QUANTITY).rate(UPDATED_RATE);

        restSalesDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSalesDetails.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSalesDetails))
            )
            .andExpect(status().isOk());

        // Validate the SalesDetails in the database
        List<SalesDetails> salesDetailsList = salesDetailsRepository.findAll();
        assertThat(salesDetailsList).hasSize(databaseSizeBeforeUpdate);
        SalesDetails testSalesDetails = salesDetailsList.get(salesDetailsList.size() - 1);
        assertThat(testSalesDetails.getQuantity()).isEqualTo(UPDATED_QUANTITY);
        assertThat(testSalesDetails.getRate()).isEqualTo(UPDATED_RATE);
    }

    @Test
    @Transactional
    void patchNonExistingSalesDetails() throws Exception {
        int databaseSizeBeforeUpdate = salesDetailsRepository.findAll().size();
        salesDetails.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSalesDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, salesDetails.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(salesDetails))
            )
            .andExpect(status().isBadRequest());

        // Validate the SalesDetails in the database
        List<SalesDetails> salesDetailsList = salesDetailsRepository.findAll();
        assertThat(salesDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSalesDetails() throws Exception {
        int databaseSizeBeforeUpdate = salesDetailsRepository.findAll().size();
        salesDetails.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSalesDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(salesDetails))
            )
            .andExpect(status().isBadRequest());

        // Validate the SalesDetails in the database
        List<SalesDetails> salesDetailsList = salesDetailsRepository.findAll();
        assertThat(salesDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSalesDetails() throws Exception {
        int databaseSizeBeforeUpdate = salesDetailsRepository.findAll().size();
        salesDetails.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSalesDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(salesDetails))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the SalesDetails in the database
        List<SalesDetails> salesDetailsList = salesDetailsRepository.findAll();
        assertThat(salesDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSalesDetails() throws Exception {
        // Initialize the database
        salesDetailsRepository.saveAndFlush(salesDetails);

        int databaseSizeBeforeDelete = salesDetailsRepository.findAll().size();

        // Delete the salesDetails
        restSalesDetailsMockMvc
            .perform(delete(ENTITY_API_URL_ID, salesDetails.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<SalesDetails> salesDetailsList = salesDetailsRepository.findAll();
        assertThat(salesDetailsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
