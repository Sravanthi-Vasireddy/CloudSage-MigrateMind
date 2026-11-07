package com.cloudsage.backend.repository;

import com.cloudsage.backend.entity.MigrationWorkloadStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MigrationWorkloadStatusRepository extends JpaRepository<MigrationWorkloadStatus, Long> {
    Optional<MigrationWorkloadStatus> findByWorkloadName(String workloadName);
    List<MigrationWorkloadStatus> findByStatus(String status);
    List<MigrationWorkloadStatus> findByMigrationWaveId(Long migrationWaveId);
    List<MigrationWorkloadStatus> findByWaveName(String waveName);
}

