package com.cloudsage.backend.controller;

import com.cloudsage.backend.dto.*;
import com.cloudsage.backend.service.MigrationMonitoringService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/monitoring")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class MigrationMonitoringController {

    private static final Logger logger = LoggerFactory.getLogger(MigrationMonitoringController.class);

    private final MigrationMonitoringService monitoringService;

    public MigrationMonitoringController(MigrationMonitoringService monitoringService) {
        this.monitoringService = monitoringService;
    }

    // =========================================================================
    // DASHBOARD & WORKLOAD TELEMETRY ENDPOINTS
    // =========================================================================

    @GetMapping("/dashboard")
    public ResponseEntity<MonitoringDashboardSummaryDto> getDashboardSummary() {
        logger.info("REST request to fetch Migration Monitoring Dashboard Summary");
        MonitoringDashboardSummaryDto summary = monitoringService.getDashboardSummary();
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/workloads")
    public ResponseEntity<List<WorkloadStatusDto>> getAllWorkloadStatuses() {
        logger.info("REST request to fetch all workload migration statuses and telemetry");
        List<WorkloadStatusDto> statuses = monitoringService.getAllWorkloadStatuses();
        return ResponseEntity.ok(statuses);
    }

    @GetMapping("/workloads/{id}")
    public ResponseEntity<WorkloadStatusDto> getWorkloadStatusById(@PathVariable Long id) {
        logger.info("REST request to fetch workload status ID={}", id);
        WorkloadStatusDto status = monitoringService.getWorkloadStatusById(id);
        return ResponseEntity.ok(status);
    }

    // =========================================================================
    // WORKLOAD VALIDATION ENDPOINTS
    // =========================================================================

    @GetMapping("/validations")
    public ResponseEntity<List<ValidationResultDto>> getAllValidationResults(
            @RequestParam(required = false, defaultValue = "ALL") String status,
            @RequestParam(required = false, defaultValue = "ALL") String type) {
        logger.info("REST request to fetch validation results (status={}, type={})", status, type);
        List<ValidationResultDto> results = monitoringService.getAllValidationResults(status, type);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/validations/{id}")
    public ResponseEntity<ValidationResultDto> getValidationResultById(@PathVariable Long id) {
        logger.info("REST request to fetch validation result ID={}", id);
        ValidationResultDto result = monitoringService.getValidationResultById(id);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/validations/execute")
    public ResponseEntity<List<ValidationResultDto>> executeWorkloadValidation(
            @RequestBody ValidationExecuteRequestDto request) {
        logger.info("REST request to execute workload validation for '{}'", request.getWorkloadName());
        List<ValidationResultDto> results = monitoringService.executeWorkloadValidation(request);
        return new ResponseEntity<>(results, HttpStatus.CREATED);
    }

    @PostMapping("/validations/{id}/retry")
    public ResponseEntity<ValidationResultDto> retryValidation(@PathVariable Long id) {
        logger.info("REST request to retry validation check ID={}", id);
        ValidationResultDto retried = monitoringService.retryValidation(id);
        return ResponseEntity.ok(retried);
    }

    // =========================================================================
    // FAILURE MANAGEMENT & REMEDIATION ENDPOINTS
    // =========================================================================

    @GetMapping("/failures")
    public ResponseEntity<List<FailureIncidentDto>> getAllFailureIncidents(
            @RequestParam(required = false, defaultValue = "ALL") String recoveryStatus) {
        logger.info("REST request to fetch failure incidents (recoveryStatus={})", recoveryStatus);
        List<FailureIncidentDto> failures = monitoringService.getAllFailureIncidents(recoveryStatus);
        return ResponseEntity.ok(failures);
    }

    @GetMapping("/failures/{id}")
    public ResponseEntity<FailureIncidentDto> getFailureIncidentById(@PathVariable Long id) {
        logger.info("REST request to fetch failure incident ID={}", id);
        FailureIncidentDto incident = monitoringService.getFailureIncidentById(id);
        return ResponseEntity.ok(incident);
    }

    @PutMapping("/failures/{id}/resolve")
    public ResponseEntity<FailureIncidentDto> resolveFailureIncident(
            @PathVariable Long id,
            @Valid @RequestBody FailureResolveRequestDto request) {
        logger.info("REST request to resolve failure incident ID={}", id);
        FailureIncidentDto resolved = monitoringService.resolveFailureIncident(id, request);
        return ResponseEntity.ok(resolved);
    }

    @PostMapping("/failures/{id}/retry")
    public ResponseEntity<FailureIncidentDto> retryFailureIncident(@PathVariable Long id) {
        logger.info("REST request to retry failed migration incident ID={}", id);
        FailureIncidentDto retried = monitoringService.retryFailureIncident(id);
        return ResponseEntity.ok(retried);
    }

    // =========================================================================
    // PERFORMANCE COMPARISON ENDPOINTS
    // =========================================================================

    @GetMapping("/performance-comparison")
    public ResponseEntity<List<PerformanceComparisonDto>> getPerformanceComparison(
            @RequestParam(required = false, defaultValue = "ALL") String workload) {
        logger.info("REST request to fetch performance comparison metrics (workload={})", workload);
        List<PerformanceComparisonDto> metrics = monitoringService.getPerformanceComparison(workload);
        return ResponseEntity.ok(metrics);
    }

    // =========================================================================
    // AUDIT LOG ENDPOINTS
    // =========================================================================

    @GetMapping("/audit-logs")
    public ResponseEntity<List<AuditLogDto>> getAuditLogs(
            @RequestParam(required = false, defaultValue = "ALL") String workload,
            @RequestParam(required = false, defaultValue = "ALL") String activityType) {
        logger.info("REST request to fetch migration audit logs");
        List<AuditLogDto> logs = monitoringService.getAuditLogs(workload, activityType);
        return ResponseEntity.ok(logs);
    }

    @PostMapping("/audit-logs")
    public ResponseEntity<AuditLogDto> createAuditLog(
            @RequestParam String activityType,
            @RequestParam(required = false) String workloadName,
            @RequestParam String actionDescription,
            @RequestParam(required = false) String performedBy,
            @RequestParam(required = false) String resultStatus) {
        logger.info("REST request to record custom migration audit log");
        AuditLogDto recorded = monitoringService.recordAuditLog(
                activityType, workloadName, actionDescription, performedBy, resultStatus);
        return new ResponseEntity<>(recorded, HttpStatus.CREATED);
    }
}

