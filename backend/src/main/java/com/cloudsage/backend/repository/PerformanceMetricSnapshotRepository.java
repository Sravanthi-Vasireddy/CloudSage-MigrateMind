package com.cloudsage.backend.repository;

import com.cloudsage.backend.entity.PerformanceMetricSnapshot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PerformanceMetricSnapshotRepository extends JpaRepository<PerformanceMetricSnapshot, Long> {
    List<PerformanceMetricSnapshot> findByWorkloadName(String workloadName);
}

