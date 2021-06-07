package com.aitrich.saraswathimedicals.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.aitrich.saraswathimedicals.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SalesDetailsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SalesDetails.class);
        SalesDetails salesDetails1 = new SalesDetails();
        salesDetails1.setId(1L);
        SalesDetails salesDetails2 = new SalesDetails();
        salesDetails2.setId(salesDetails1.getId());
        assertThat(salesDetails1).isEqualTo(salesDetails2);
        salesDetails2.setId(2L);
        assertThat(salesDetails1).isNotEqualTo(salesDetails2);
        salesDetails1.setId(null);
        assertThat(salesDetails1).isNotEqualTo(salesDetails2);
    }
}
