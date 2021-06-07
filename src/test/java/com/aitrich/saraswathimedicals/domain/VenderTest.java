package com.aitrich.saraswathimedicals.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.aitrich.saraswathimedicals.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class VenderTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Vender.class);
        Vender vender1 = new Vender();
        vender1.setId(1L);
        Vender vender2 = new Vender();
        vender2.setId(vender1.getId());
        assertThat(vender1).isEqualTo(vender2);
        vender2.setId(2L);
        assertThat(vender1).isNotEqualTo(vender2);
        vender1.setId(null);
        assertThat(vender1).isNotEqualTo(vender2);
    }
}
