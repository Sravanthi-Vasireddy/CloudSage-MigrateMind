package com.cloudsage.backend.service;

import com.cloudsage.backend.dto.*;

import java.util.List;

public interface MigrationReportService {

    ProjectOverallStatisticsDto getProjectStatistics();

    ExecutiveSummaryDto getExecutiveSummary(String provider);

    CompleteMigrationReportDto getCompleteMigrationReport(String provider);

    List<ReportHistoryItemDto> getReportHistory();

    CompleteMigrationReportDto getReportById(Long id);

    ReportHistoryItemDto generateAndSaveReport(ReportGenerateRequestDto request);

    void deleteReport(Long id);

    byte[] generatePdfReport(Long id);

    byte[] generateCsvReport(Long id);
}

