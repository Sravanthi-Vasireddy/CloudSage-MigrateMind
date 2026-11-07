package com.cloudsage.backend.controller;

import com.cloudsage.backend.dto.*;
import com.cloudsage.backend.service.MigrationReportService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class MigrationReportController {

    private static final Logger logger = LoggerFactory.getLogger(MigrationReportController.class);

    private final MigrationReportService reportService;

    public MigrationReportController(MigrationReportService reportService) {
        this.reportService = reportService;
    }

    /**
     * Get final consolidated project statistics across all 10 stages
     */
    @GetMapping("/project-statistics")
    public ResponseEntity<ProjectOverallStatisticsDto> getProjectStatistics() {
        logger.info("REST request to fetch consolidated final project statistics");
        ProjectOverallStatisticsDto stats = reportService.getProjectStatistics();
        return ResponseEntity.ok(stats);
    }

    /**
     * Get real-time executive summary
     */
    @GetMapping("/executive-summary")
    public ResponseEntity<ExecutiveSummaryDto> getExecutiveSummary(
            @RequestParam(required = false, defaultValue = "AWS") String provider) {
        logger.info("REST request to fetch Executive Summary for provider={}", provider);
        ExecutiveSummaryDto summary = reportService.getExecutiveSummary(provider);
        return ResponseEntity.ok(summary);
    }

    /**
     * Get complete enterprise migration report
     */
    @GetMapping("/complete")
    public ResponseEntity<CompleteMigrationReportDto> getCompleteMigrationReport(
            @RequestParam(required = false, defaultValue = "AWS") String provider) {
        logger.info("REST request to fetch complete enterprise migration report for provider={}", provider);
        CompleteMigrationReportDto report = reportService.getCompleteMigrationReport(provider);
        return ResponseEntity.ok(report);
    }

    /**
     * Generate and save report to history
     */
    @PostMapping("/generate")
    public ResponseEntity<ReportHistoryItemDto> generateAndSaveReport(
            @Valid @RequestBody ReportGenerateRequestDto request) {
        logger.info("REST request to generate and save report '{}'", request.getReportTitle());
        ReportHistoryItemDto item = reportService.generateAndSaveReport(request);
        return new ResponseEntity<>(item, HttpStatus.CREATED);
    }

    /**
     * Get report history list
     */
    @GetMapping("/history")
    public ResponseEntity<List<ReportHistoryItemDto>> getReportHistory() {
        logger.info("REST request to fetch report history");
        List<ReportHistoryItemDto> history = reportService.getReportHistory();
        return ResponseEntity.ok(history);
    }

    /**
     * Get report by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<CompleteMigrationReportDto> getReportById(@PathVariable Long id) {
        logger.info("REST request to fetch report ID={}", id);
        CompleteMigrationReportDto report = reportService.getReportById(id);
        return ResponseEntity.ok(report);
    }

    /**
     * Delete report by ID
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReport(@PathVariable Long id) {
        logger.info("REST request to delete report ID={}", id);
        reportService.deleteReport(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Download formatted PDF report
     */
    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> downloadPdfReport(@PathVariable Long id) {
        logger.info("REST request to download PDF report ID={}", id);
        byte[] pdfBytes = reportService.generatePdfReport(id);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "CloudSage_Migration_Report_" + id + ".pdf");
        headers.setContentLength(pdfBytes.length);

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }

    /**
     * Download structured CSV export
     */
    @GetMapping("/{id}/csv")
    public ResponseEntity<byte[]> downloadCsvReport(@PathVariable Long id) {
        logger.info("REST request to download CSV report ID={}", id);
        byte[] csvBytes = reportService.generateCsvReport(id);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv"));
        headers.setContentDispositionFormData("attachment", "CloudSage_Migration_Data_" + id + ".csv");
        headers.setContentLength(csvBytes.length);

        return new ResponseEntity<>(csvBytes, headers, HttpStatus.OK);
    }
}

