package com.cloudsage.backend.repository;

import com.cloudsage.backend.entity.MigrationWave;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MigrationWaveRepository extends JpaRepository<MigrationWave, Long> {
    List<MigrationWave> findByMigrationPlanIdOrderBySortOrderAsc(Long migrationPlanId);
    Optional<MigrationWave> findByMigrationPlanIdAndWaveNumber(Long migrationPlanId, Integer waveNumber);
    void deleteByMigrationPlanId(Long migrationPlanId);
}

