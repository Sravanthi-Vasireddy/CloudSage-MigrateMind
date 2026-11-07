package com.cloudsage.backend.repository;

import com.cloudsage.backend.entity.WorkloadValidationResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkloadValidationResultRepository extends JpaRepository<WorkloadValidationResult, Long> {
    List<WorkloadValidationResult> findByWorkloadName(String workloadName);
    List<WorkloadValidationResult> findByValidationStatus(String validationStatus);
    List<WorkloadValidationResult> findByValidationType(String validationType);
}

