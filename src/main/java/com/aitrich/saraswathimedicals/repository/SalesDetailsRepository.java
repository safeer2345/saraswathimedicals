package com.aitrich.saraswathimedicals.repository;

import com.aitrich.saraswathimedicals.domain.SalesDetails;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the SalesDetails entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SalesDetailsRepository extends JpaRepository<SalesDetails, Long> {}
