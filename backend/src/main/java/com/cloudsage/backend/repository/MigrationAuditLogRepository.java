package com.cloudsage.backend.repository;

import com.cloudsage.backend.entity.MigrationAuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MigrationAuditLogRepository extends JpaRepository<MigrationAuditLog, Long> {
    List<MigrationAuditLog> findTop50ByOrderByTimestampDesc();
    List<MigrationAuditLog> findByWorkloadName(String workloadName);
    List<MigrationAuditLog> findByActivityType(String activityType);
}

