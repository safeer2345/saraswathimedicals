package com.aitrich.saraswathimedicals.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.aitrich.saraswathimedicals.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ProductRateTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ProductRate.class);
        ProductRate productRate1 = new ProductRate();
        productRate1.setId(1L);
        ProductRate productRate2 = new ProductRate();
        productRate2.setId(productRate1.getId());
        assertThat(productRate1).isEqualTo(productRate2);
        productRate2.setId(2L);
        assertThat(productRate1).isNotEqualTo(productRate2);
        productRate1.setId(null);
        assertThat(productRate1).isNotEqualTo(productRate2);
    }
}
