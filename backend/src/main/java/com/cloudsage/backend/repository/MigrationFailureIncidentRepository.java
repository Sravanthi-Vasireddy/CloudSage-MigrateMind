package com.cloudsage.backend.repository;

import com.cloudsage.backend.entity.MigrationFailureIncident;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MigrationFailureIncidentRepository extends JpaRepository<MigrationFailureIncident, Long> {
    List<MigrationFailureIncident> findByRecoveryStatus(String recoveryStatus);
    List<MigrationFailureIncident> findByWorkloadName(String workloadName);
}

