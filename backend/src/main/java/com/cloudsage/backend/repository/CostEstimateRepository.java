package com.cloudsage.backend.repository;

import com.cloudsage.backend.entity.CostEstimate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CostEstimateRepository extends JpaRepository<CostEstimate, Long> {
    List<CostEstimate> findAllByOrderByCreatedAtDesc();
    List<CostEstimate> findByProviderOrderByCreatedAtDesc(String provider);
}

