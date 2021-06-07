package com.aitrich.saraswathimedicals.service;

import com.aitrich.saraswathimedicals.domain.SalesDetails;
import com.aitrich.saraswathimedicals.repository.SalesDetailsRepository;
import javax.transaction.Transactional;
import org.jboss.logging.Logger;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class SalesService {

    Logger logger = Logger.getLogger(SalesService.class.getName());
    private SalesDetailsRepository salesDetailsRepository;
    private StockService stockService;

    public SalesService(SalesDetailsRepository salesDetailsRepository, StockService stockService) {
        this.salesDetailsRepository = salesDetailsRepository;
        this.stockService = stockService;
    }

    public SalesDetails saleProduct(SalesDetails salesDetails) {
        stockService.updateStock(salesDetails.getQuantity(), salesDetails.getProduct().getId());
        logger.info("Stock updated");
        return salesDetailsRepository.save(salesDetails);
    }
}
