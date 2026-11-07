package com.cloudsage.backend.repository;

import com.cloudsage.backend.entity.MigrationReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MigrationReportRepository extends JpaRepository<MigrationReport, Long> {
    List<MigrationReport> findByReportType(String reportType);
    List<MigrationReport> findAllByOrderByGeneratedAtDesc();
}

