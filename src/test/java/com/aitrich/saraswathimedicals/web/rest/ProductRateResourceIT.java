package com.aitrich.saraswathimedicals.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.aitrich.saraswathimedicals.IntegrationTest;
import com.aitrich.saraswathimedicals.domain.ProductRate;
import com.aitrich.saraswathimedicals.repository.ProductRateRepository;
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
 * Integration tests for the {@link ProductRateResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ProductRateResourceIT {

    private static final Integer DEFAULT_PRICE = 1;
    private static final Integer UPDATED_PRICE = 2;

    private static final String ENTITY_API_URL = "/api/product-rates";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ProductRateRepository productRateRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restProductRateMockMvc;

    private ProductRate productRate;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProductRate createEntity(EntityManager em) {
        ProductRate productRate = new ProductRate().price(DEFAULT_PRICE);
        return productRate;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProductRate createUpdatedEntity(EntityManager em) {
        ProductRate productRate = new ProductRate().price(UPDATED_PRICE);
        return productRate;
    }

    @BeforeEach
    public void initTest() {
        productRate = createEntity(em);
    }

    @Test
    @Transactional
    void createProductRate() throws Exception {
        int databaseSizeBeforeCreate = productRateRepository.findAll().size();
        // Create the ProductRate
        restProductRateMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(productRate)))
            .andExpect(status().isCreated());

        // Validate the ProductRate in the database
        List<ProductRate> productRateList = productRateRepository.findAll();
        assertThat(productRateList).hasSize(databaseSizeBeforeCreate + 1);
        ProductRate testProductRate = productRateList.get(productRateList.size() - 1);
        assertThat(testProductRate.getPrice()).isEqualTo(DEFAULT_PRICE);
    }

    @Test
    @Transactional
    void createProductRateWithExistingId() throws Exception {
        // Create the ProductRate with an existing ID
        productRate.setId(1L);

        int databaseSizeBeforeCreate = productRateRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restProductRateMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(productRate)))
            .andExpect(status().isBadRequest());

        // Validate the ProductRate in the database
        List<ProductRate> productRateList = productRateRepository.findAll();
        assertThat(productRateList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllProductRates() throws Exception {
        // Initialize the database
        productRateRepository.saveAndFlush(productRate);

        // Get all the productRateList
        restProductRateMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(productRate.getId().intValue())))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE)));
    }

    @Test
    @Transactional
    void getProductRate() throws Exception {
        // Initialize the database
        productRateRepository.saveAndFlush(productRate);

        // Get the productRate
        restProductRateMockMvc
            .perform(get(ENTITY_API_URL_ID, productRate.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(productRate.getId().intValue()))
            .andExpect(jsonPath("$.price").value(DEFAULT_PRICE));
    }

    @Test
    @Transactional
    void getNonExistingProductRate() throws Exception {
        // Get the productRate
        restProductRateMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewProductRate() throws Exception {
        // Initialize the database
        productRateRepository.saveAndFlush(productRate);

        int databaseSizeBeforeUpdate = productRateRepository.findAll().size();

        // Update the productRate
        ProductRate updatedProductRate = productRateRepository.findById(productRate.getId()).get();
        // Disconnect from session so that the updates on updatedProductRate are not directly saved in db
        em.detach(updatedProductRate);
        updatedProductRate.price(UPDATED_PRICE);

        restProductRateMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedProductRate.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedProductRate))
            )
            .andExpect(status().isOk());

        // Validate the ProductRate in the database
        List<ProductRate> productRateList = productRateRepository.findAll();
        assertThat(productRateList).hasSize(databaseSizeBeforeUpdate);
        ProductRate testProductRate = productRateList.get(productRateList.size() - 1);
        assertThat(testProductRate.getPrice()).isEqualTo(UPDATED_PRICE);
    }

    @Test
    @Transactional
    void putNonExistingProductRate() throws Exception {
        int databaseSizeBeforeUpdate = productRateRepository.findAll().size();
        productRate.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProductRateMockMvc
            .perform(
                put(ENTITY_API_URL_ID, productRate.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(productRate))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProductRate in the database
        List<ProductRate> productRateList = productRateRepository.findAll();
        assertThat(productRateList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchProductRate() throws Exception {
        int databaseSizeBeforeUpdate = productRateRepository.findAll().size();
        productRate.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProductRateMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(productRate))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProductRate in the database
        List<ProductRate> productRateList = productRateRepository.findAll();
        assertThat(productRateList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamProductRate() throws Exception {
        int databaseSizeBeforeUpdate = productRateRepository.findAll().size();
        productRate.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProductRateMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(productRate)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ProductRate in the database
        List<ProductRate> productRateList = productRateRepository.findAll();
        assertThat(productRateList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateProductRateWithPatch() throws Exception {
        // Initialize the database
        productRateRepository.saveAndFlush(productRate);

        int databaseSizeBeforeUpdate = productRateRepository.findAll().size();

        // Update the productRate using partial update
        ProductRate partialUpdatedProductRate = new ProductRate();
        partialUpdatedProductRate.setId(productRate.getId());

        restProductRateMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProductRate.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProductRate))
            )
            .andExpect(status().isOk());

        // Validate the ProductRate in the database
        List<ProductRate> productRateList = productRateRepository.findAll();
        assertThat(productRateList).hasSize(databaseSizeBeforeUpdate);
        ProductRate testProductRate = productRateList.get(productRateList.size() - 1);
        assertThat(testProductRate.getPrice()).isEqualTo(DEFAULT_PRICE);
    }

    @Test
    @Transactional
    void fullUpdateProductRateWithPatch() throws Exception {
        // Initialize the database
        productRateRepository.saveAndFlush(productRate);

        int databaseSizeBeforeUpdate = productRateRepository.findAll().size();

        // Update the productRate using partial update
        ProductRate partialUpdatedProductRate = new ProductRate();
        partialUpdatedProductRate.setId(productRate.getId());

        partialUpdatedProductRate.price(UPDATED_PRICE);

        restProductRateMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProductRate.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProductRate))
            )
            .andExpect(status().isOk());

        // Validate the ProductRate in the database
        List<ProductRate> productRateList = productRateRepository.findAll();
        assertThat(productRateList).hasSize(databaseSizeBeforeUpdate);
        ProductRate testProductRate = productRateList.get(productRateList.size() - 1);
        assertThat(testProductRate.getPrice()).isEqualTo(UPDATED_PRICE);
    }

    @Test
    @Transactional
    void patchNonExistingProductRate() throws Exception {
        int databaseSizeBeforeUpdate = productRateRepository.findAll().size();
        productRate.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProductRateMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, productRate.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(productRate))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProductRate in the database
        List<ProductRate> productRateList = productRateRepository.findAll();
        assertThat(productRateList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchProductRate() throws Exception {
        int databaseSizeBeforeUpdate = productRateRepository.findAll().size();
        productRate.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProductRateMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(productRate))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProductRate in the database
        List<ProductRate> productRateList = productRateRepository.findAll();
        assertThat(productRateList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamProductRate() throws Exception {
        int databaseSizeBeforeUpdate = productRateRepository.findAll().size();
        productRate.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProductRateMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(productRate))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ProductRate in the database
        List<ProductRate> productRateList = productRateRepository.findAll();
        assertThat(productRateList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteProductRate() throws Exception {
        // Initialize the database
        productRateRepository.saveAndFlush(productRate);

        int databaseSizeBeforeDelete = productRateRepository.findAll().size();

        // Delete the productRate
        restProductRateMockMvc
            .perform(delete(ENTITY_API_URL_ID, productRate.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ProductRate> productRateList = productRateRepository.findAll();
        assertThat(productRateList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
