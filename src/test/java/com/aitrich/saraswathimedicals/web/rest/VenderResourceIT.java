package com.aitrich.saraswathimedicals.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.aitrich.saraswathimedicals.IntegrationTest;
import com.aitrich.saraswathimedicals.domain.Vender;
import com.aitrich.saraswathimedicals.repository.VenderRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
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
 * Integration tests for the {@link VenderResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class VenderResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_ADDRESS = "AAAAAAAAAA";
    private static final String UPDATED_ADDRESS = "BBBBBBBBBB";

    private static final Long DEFAULT_CONTACT = 1L;
    private static final Long UPDATED_CONTACT = 2L;

    private static final Instant DEFAULT_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/venders";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private VenderRepository venderRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restVenderMockMvc;

    private Vender vender;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Vender createEntity(EntityManager em) {
        Vender vender = new Vender().name(DEFAULT_NAME).address(DEFAULT_ADDRESS).contact(DEFAULT_CONTACT).date(DEFAULT_DATE);
        return vender;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Vender createUpdatedEntity(EntityManager em) {
        Vender vender = new Vender().name(UPDATED_NAME).address(UPDATED_ADDRESS).contact(UPDATED_CONTACT).date(UPDATED_DATE);
        return vender;
    }

    @BeforeEach
    public void initTest() {
        vender = createEntity(em);
    }

    @Test
    @Transactional
    void createVender() throws Exception {
        int databaseSizeBeforeCreate = venderRepository.findAll().size();
        // Create the Vender
        restVenderMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(vender)))
            .andExpect(status().isCreated());

        // Validate the Vender in the database
        List<Vender> venderList = venderRepository.findAll();
        assertThat(venderList).hasSize(databaseSizeBeforeCreate + 1);
        Vender testVender = venderList.get(venderList.size() - 1);
        assertThat(testVender.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testVender.getAddress()).isEqualTo(DEFAULT_ADDRESS);
        assertThat(testVender.getContact()).isEqualTo(DEFAULT_CONTACT);
        assertThat(testVender.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    void createVenderWithExistingId() throws Exception {
        // Create the Vender with an existing ID
        vender.setId(1L);

        int databaseSizeBeforeCreate = venderRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restVenderMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(vender)))
            .andExpect(status().isBadRequest());

        // Validate the Vender in the database
        List<Vender> venderList = venderRepository.findAll();
        assertThat(venderList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = venderRepository.findAll().size();
        // set the field null
        vender.setName(null);

        // Create the Vender, which fails.

        restVenderMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(vender)))
            .andExpect(status().isBadRequest());

        List<Vender> venderList = venderRepository.findAll();
        assertThat(venderList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkAddressIsRequired() throws Exception {
        int databaseSizeBeforeTest = venderRepository.findAll().size();
        // set the field null
        vender.setAddress(null);

        // Create the Vender, which fails.

        restVenderMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(vender)))
            .andExpect(status().isBadRequest());

        List<Vender> venderList = venderRepository.findAll();
        assertThat(venderList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkContactIsRequired() throws Exception {
        int databaseSizeBeforeTest = venderRepository.findAll().size();
        // set the field null
        vender.setContact(null);

        // Create the Vender, which fails.

        restVenderMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(vender)))
            .andExpect(status().isBadRequest());

        List<Vender> venderList = venderRepository.findAll();
        assertThat(venderList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = venderRepository.findAll().size();
        // set the field null
        vender.setDate(null);

        // Create the Vender, which fails.

        restVenderMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(vender)))
            .andExpect(status().isBadRequest());

        List<Vender> venderList = venderRepository.findAll();
        assertThat(venderList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllVenders() throws Exception {
        // Initialize the database
        venderRepository.saveAndFlush(vender);

        // Get all the venderList
        restVenderMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(vender.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].address").value(hasItem(DEFAULT_ADDRESS)))
            .andExpect(jsonPath("$.[*].contact").value(hasItem(DEFAULT_CONTACT.intValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())));
    }

    @Test
    @Transactional
    void getVender() throws Exception {
        // Initialize the database
        venderRepository.saveAndFlush(vender);

        // Get the vender
        restVenderMockMvc
            .perform(get(ENTITY_API_URL_ID, vender.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(vender.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.address").value(DEFAULT_ADDRESS))
            .andExpect(jsonPath("$.contact").value(DEFAULT_CONTACT.intValue()))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingVender() throws Exception {
        // Get the vender
        restVenderMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewVender() throws Exception {
        // Initialize the database
        venderRepository.saveAndFlush(vender);

        int databaseSizeBeforeUpdate = venderRepository.findAll().size();

        // Update the vender
        Vender updatedVender = venderRepository.findById(vender.getId()).get();
        // Disconnect from session so that the updates on updatedVender are not directly saved in db
        em.detach(updatedVender);
        updatedVender.name(UPDATED_NAME).address(UPDATED_ADDRESS).contact(UPDATED_CONTACT).date(UPDATED_DATE);

        restVenderMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedVender.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedVender))
            )
            .andExpect(status().isOk());

        // Validate the Vender in the database
        List<Vender> venderList = venderRepository.findAll();
        assertThat(venderList).hasSize(databaseSizeBeforeUpdate);
        Vender testVender = venderList.get(venderList.size() - 1);
        assertThat(testVender.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testVender.getAddress()).isEqualTo(UPDATED_ADDRESS);
        assertThat(testVender.getContact()).isEqualTo(UPDATED_CONTACT);
        assertThat(testVender.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void putNonExistingVender() throws Exception {
        int databaseSizeBeforeUpdate = venderRepository.findAll().size();
        vender.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVenderMockMvc
            .perform(
                put(ENTITY_API_URL_ID, vender.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(vender))
            )
            .andExpect(status().isBadRequest());

        // Validate the Vender in the database
        List<Vender> venderList = venderRepository.findAll();
        assertThat(venderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchVender() throws Exception {
        int databaseSizeBeforeUpdate = venderRepository.findAll().size();
        vender.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVenderMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(vender))
            )
            .andExpect(status().isBadRequest());

        // Validate the Vender in the database
        List<Vender> venderList = venderRepository.findAll();
        assertThat(venderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamVender() throws Exception {
        int databaseSizeBeforeUpdate = venderRepository.findAll().size();
        vender.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVenderMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(vender)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Vender in the database
        List<Vender> venderList = venderRepository.findAll();
        assertThat(venderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateVenderWithPatch() throws Exception {
        // Initialize the database
        venderRepository.saveAndFlush(vender);

        int databaseSizeBeforeUpdate = venderRepository.findAll().size();

        // Update the vender using partial update
        Vender partialUpdatedVender = new Vender();
        partialUpdatedVender.setId(vender.getId());

        partialUpdatedVender.name(UPDATED_NAME).address(UPDATED_ADDRESS).contact(UPDATED_CONTACT).date(UPDATED_DATE);

        restVenderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVender.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedVender))
            )
            .andExpect(status().isOk());

        // Validate the Vender in the database
        List<Vender> venderList = venderRepository.findAll();
        assertThat(venderList).hasSize(databaseSizeBeforeUpdate);
        Vender testVender = venderList.get(venderList.size() - 1);
        assertThat(testVender.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testVender.getAddress()).isEqualTo(UPDATED_ADDRESS);
        assertThat(testVender.getContact()).isEqualTo(UPDATED_CONTACT);
        assertThat(testVender.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void fullUpdateVenderWithPatch() throws Exception {
        // Initialize the database
        venderRepository.saveAndFlush(vender);

        int databaseSizeBeforeUpdate = venderRepository.findAll().size();

        // Update the vender using partial update
        Vender partialUpdatedVender = new Vender();
        partialUpdatedVender.setId(vender.getId());

        partialUpdatedVender.name(UPDATED_NAME).address(UPDATED_ADDRESS).contact(UPDATED_CONTACT).date(UPDATED_DATE);

        restVenderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVender.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedVender))
            )
            .andExpect(status().isOk());

        // Validate the Vender in the database
        List<Vender> venderList = venderRepository.findAll();
        assertThat(venderList).hasSize(databaseSizeBeforeUpdate);
        Vender testVender = venderList.get(venderList.size() - 1);
        assertThat(testVender.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testVender.getAddress()).isEqualTo(UPDATED_ADDRESS);
        assertThat(testVender.getContact()).isEqualTo(UPDATED_CONTACT);
        assertThat(testVender.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingVender() throws Exception {
        int databaseSizeBeforeUpdate = venderRepository.findAll().size();
        vender.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVenderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, vender.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(vender))
            )
            .andExpect(status().isBadRequest());

        // Validate the Vender in the database
        List<Vender> venderList = venderRepository.findAll();
        assertThat(venderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchVender() throws Exception {
        int databaseSizeBeforeUpdate = venderRepository.findAll().size();
        vender.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVenderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(vender))
            )
            .andExpect(status().isBadRequest());

        // Validate the Vender in the database
        List<Vender> venderList = venderRepository.findAll();
        assertThat(venderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamVender() throws Exception {
        int databaseSizeBeforeUpdate = venderRepository.findAll().size();
        vender.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVenderMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(vender)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Vender in the database
        List<Vender> venderList = venderRepository.findAll();
        assertThat(venderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteVender() throws Exception {
        // Initialize the database
        venderRepository.saveAndFlush(vender);

        int databaseSizeBeforeDelete = venderRepository.findAll().size();

        // Delete the vender
        restVenderMockMvc
            .perform(delete(ENTITY_API_URL_ID, vender.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Vender> venderList = venderRepository.findAll();
        assertThat(venderList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
