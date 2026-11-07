package com.cloudsage.backend.service;

import com.cloudsage.backend.dto.*;

import java.util.List;

public interface MigrationMonitoringService {

    MonitoringDashboardSummaryDto getDashboardSummary();

    List<WorkloadStatusDto> getAllWorkloadStatuses();

    WorkloadStatusDto getWorkloadStatusById(Long id);

    List<ValidationResultDto> getAllValidationResults(String status, String type);

    ValidationResultDto getValidationResultById(Long id);

    List<ValidationResultDto> executeWorkloadValidation(ValidationExecuteRequestDto request);

    ValidationResultDto retryValidation(Long id);

    List<FailureIncidentDto> getAllFailureIncidents(String recoveryStatus);

    FailureIncidentDto getFailureIncidentById(Long id);

    FailureIncidentDto resolveFailureIncident(Long id, FailureResolveRequestDto request);

    FailureIncidentDto retryFailureIncident(Long id);

    List<PerformanceComparisonDto> getPerformanceComparison(String workloadName);

    List<AuditLogDto> getAuditLogs(String workloadName, String activityType);

    AuditLogDto recordAuditLog(String activityType, String workloadName, String actionDescription,
                               String performedBy, String resultStatus);
}

