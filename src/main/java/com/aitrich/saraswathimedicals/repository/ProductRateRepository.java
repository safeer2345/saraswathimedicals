package com.aitrich.saraswathimedicals.repository;

import com.aitrich.saraswathimedicals.domain.ProductRate;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the ProductRate entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProductRateRepository extends JpaRepository<ProductRate, Long> {
    @Modifying
    @Query(value = "update product_rate set price = :rate where product_id = :productId", nativeQuery = true)
    void updateRate(@Param("rate") int rate, @Param("productId") long productId);
}
