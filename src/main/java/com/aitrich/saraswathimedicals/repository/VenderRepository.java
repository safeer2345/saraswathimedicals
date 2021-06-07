package com.aitrich.saraswathimedicals.repository;

import com.aitrich.saraswathimedicals.domain.Vender;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Vender entity.
 */
@SuppressWarnings("unused")
@Repository
public interface VenderRepository extends JpaRepository<Vender, Long> {}
