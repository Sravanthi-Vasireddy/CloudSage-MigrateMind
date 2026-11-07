package com.cloudsage.backend.repository;

import com.cloudsage.backend.entity.MigrationPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MigrationPlanRepository extends JpaRepository<MigrationPlan, Long> {
    Optional<MigrationPlan> findFirstByOrderByCreatedAtDesc();
    List<MigrationPlan> findByStatusOrderByCreatedAtDesc(String status);
}

