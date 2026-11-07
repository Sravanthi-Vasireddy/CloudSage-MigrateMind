package com.cloudsage.backend.repository;

import com.cloudsage.backend.entity.RiskMitigationAction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RiskMitigationActionRepository extends JpaRepository<RiskMitigationAction, Long> {
    List<RiskMitigationAction> findByRiskIdOrderByDueDateAsc(Long riskId);
    List<RiskMitigationAction> findByStatus(String status);
}

