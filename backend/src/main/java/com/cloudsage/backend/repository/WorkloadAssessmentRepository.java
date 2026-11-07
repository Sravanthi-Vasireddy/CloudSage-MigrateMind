package com.cloudsage.backend.repository;

import com.cloudsage.backend.entity.WorkloadAssessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorkloadAssessmentRepository extends JpaRepository<WorkloadAssessment, Long> {

    Optional<WorkloadAssessment> findByInfrastructureId(Long infrastructureId);

    List<WorkloadAssessment> findByRecommendedStrategy(String recommendedStrategy);

    List<WorkloadAssessment> findBySelectedStrategy(String selectedStrategy);

    List<WorkloadAssessment> findByMigrationComplexity(String migrationComplexity);

    boolean existsByInfrastructureId(Long infrastructureId);

    void deleteByInfrastructureId(Long infrastructureId);
}

