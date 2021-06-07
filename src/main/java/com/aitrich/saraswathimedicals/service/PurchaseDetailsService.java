package com.aitrich.saraswathimedicals.service;

import com.aitrich.saraswathimedicals.domain.PurchaseDetails;
import com.aitrich.saraswathimedicals.repository.PurchaseDetailsRepository;
import com.aitrich.saraswathimedicals.repository.StockRepository;
import javax.transaction.Transactional;
import org.jboss.logging.Logger;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class PurchaseDetailsService {

    Logger logger = Logger.getLogger(PurchaseDetailsService.class.getName());
    private PurchaseDetailsRepository purchaseDetailsRepository;
    private StockService stockService;
    private ProductRateService productRateService;

    public PurchaseDetailsService(
        PurchaseDetailsRepository purchaseDetailsRepository,
        StockService stockService,
        ProductRateService productRateService
    ) {
        this.purchaseDetailsRepository = purchaseDetailsRepository;
        this.stockService = stockService;
        this.productRateService = productRateService;
    }

    public PurchaseDetails addPurchaseDetails(PurchaseDetails purchaseDetails) {
        productRateService.updateRate(purchaseDetails.getRate(), purchaseDetails.getProduct().getId());
        logger.info("Rate updated");
        stockService.addStock(purchaseDetails.getQuantity(), purchaseDetails.getProduct().getId());
        logger.info("Stock added");
        return purchaseDetailsRepository.save(purchaseDetails);
    }
}
