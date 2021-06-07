package com.aitrich.saraswathimedicals.repository;

import com.aitrich.saraswathimedicals.domain.Stock;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Stock entity.
 */
@SuppressWarnings("unused")
@Repository
public interface StockRepository extends JpaRepository<Stock, Long> {
    @Modifying
    @Query(value = "UPDATE stock SET quantity = quantity + :quantity WHERE product_id = :productId", nativeQuery = true)
    void addStock(@Param("quantity") int quantity, @Param("productId") long productId);

    @Modifying
    @Query(value = "UPDATE stock SET quantity = quantity - :quantity WHERE product_id = :productId", nativeQuery = true)
    void updateStock(@Param("quantity") int quantity, @Param("productId") long productId);
}
