package com.aitrich.saraswathimedicals.service;

import com.aitrich.saraswathimedicals.repository.ProductRateRepository;
import javax.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class ProductRateService {

    private ProductRateRepository productRateRepository;

    public ProductRateService(ProductRateRepository productRateRepository) {
        this.productRateRepository = productRateRepository;
    }

    public void updateRate(float rate, long productId) {
        productRateRepository.updateRate((int) rate, productId);
    }
}
