package com.cloudsage.backend.repository;

import com.cloudsage.backend.entity.MigrationRisk;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MigrationRiskRepository extends JpaRepository<MigrationRisk, Long> {
    List<MigrationRisk> findAllByOrderByRiskScoreDesc();
    List<MigrationRisk> findBySeverityOrderByRiskScoreDesc(String severity);
    List<MigrationRisk> findByStatus(String status);
    List<MigrationRisk> findByCategory(String category);
    Optional<MigrationRisk> findByRiskId(String riskId);
}

