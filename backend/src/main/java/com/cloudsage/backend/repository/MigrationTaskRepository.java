package com.cloudsage.backend.repository;

import com.cloudsage.backend.entity.MigrationTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MigrationTaskRepository extends JpaRepository<MigrationTask, Long> {
    List<MigrationTask> findByMigrationPlanIdOrderByDueDateAsc(Long migrationPlanId);
    List<MigrationTask> findByWaveIdOrderByDueDateAsc(Long waveId);
    List<MigrationTask> findByAssignedTo(String assignedTo);
    List<MigrationTask> findByStatus(String status);
    void deleteByMigrationPlanId(Long migrationPlanId);
}

