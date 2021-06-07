package com.aitrich.saraswathimedicals.service;

import com.aitrich.saraswathimedicals.repository.StockRepository;
import javax.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class StockService {

    StockRepository stockRepository;

    public StockService(StockRepository stockRepository) {
        this.stockRepository = stockRepository;
    }

    public void addStock(int quantity, long productId) {
        stockRepository.addStock(quantity, productId);
    }

    public void updateStock(int quantity, long productId) {
        stockRepository.updateStock(quantity, productId);
    }
}
