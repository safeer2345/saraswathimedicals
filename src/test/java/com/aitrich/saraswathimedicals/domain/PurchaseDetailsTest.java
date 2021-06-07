package com.aitrich.saraswathimedicals.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.aitrich.saraswathimedicals.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PurchaseDetailsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(PurchaseDetails.class);
        PurchaseDetails purchaseDetails1 = new PurchaseDetails();
        purchaseDetails1.setId(1L);
        PurchaseDetails purchaseDetails2 = new PurchaseDetails();
        purchaseDetails2.setId(purchaseDetails1.getId());
        assertThat(purchaseDetails1).isEqualTo(purchaseDetails2);
        purchaseDetails2.setId(2L);
        assertThat(purchaseDetails1).isNotEqualTo(purchaseDetails2);
        purchaseDetails1.setId(null);
        assertThat(purchaseDetails1).isNotEqualTo(purchaseDetails2);
    }
}
