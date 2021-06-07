package com.aitrich.saraswathimedicals.repository;

import com.aitrich.saraswathimedicals.domain.PurchaseDetails;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the PurchaseDetails entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PurchaseDetailsRepository extends JpaRepository<PurchaseDetails, Long> {}
