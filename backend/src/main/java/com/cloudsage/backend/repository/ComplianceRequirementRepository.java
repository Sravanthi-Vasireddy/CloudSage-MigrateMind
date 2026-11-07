package com.cloudsage.backend.repository;

import com.cloudsage.backend.entity.ComplianceRequirement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplianceRequirementRepository extends JpaRepository<ComplianceRequirement, Long> {
    List<ComplianceRequirement> findByFrameworkOrderByIdAsc(String framework);
    List<ComplianceRequirement> findByStatus(String status);
}

