package com.cloudsage.backend.service;

import com.cloudsage.backend.dto.*;
import com.cloudsage.backend.entity.*;
import com.cloudsage.backend.repository.*;
import com.cloudsage.backend.service.impl.MigrationMonitoringServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Proxy;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.atomic.AtomicLong;

import static org.junit.jupiter.api.Assertions.*;

public class MigrationMonitoringServiceTest {

    private Map<Long, MigrationWorkloadStatus> workloadDb;
    private Map<Long, WorkloadValidationResult> validationDb;
    private Map<Long, MigrationFailureIncident> failureDb;
    private Map<Long, PerformanceMetricSnapshot> metricDb;
    private Map<Long, MigrationAuditLog> auditDb;
    private Map<Long, MigrationWave> waveDb;
    private AtomicLong idGen;

    private MigrationWorkloadStatusRepository workloadStatusRepository;
    private WorkloadValidationResultRepository validationResultRepository;
    private MigrationFailureIncidentRepository failureIncidentRepository;
    private PerformanceMetricSnapshotRepository metricSnapshotRepository;
    private MigrationAuditLogRepository auditLogRepository;
    private MigrationWaveRepository migrationWaveRepository;

    private MigrationMonitoringService monitoringService;

    @BeforeEach
    void setUp() {
        workloadDb = new HashMap<>();
        validationDb = new HashMap<>();
        failureDb = new HashMap<>();
        metricDb = new HashMap<>();
        auditDb = new HashMap<>();
        waveDb = new HashMap<>();
        idGen = new AtomicLong(400L);

        // Proxy for MigrationWorkloadStatusRepository
        workloadStatusRepository = (MigrationWorkloadStatusRepository) Proxy.newProxyInstance(
                MigrationWorkloadStatusRepository.class.getClassLoader(),
                new Class<?>[]{MigrationWorkloadStatusRepository.class},
                (proxy, method, args) -> {
                    String name = method.getName();
                    if ("save".equals(name)) {
                        MigrationWorkloadStatus w = (MigrationWorkloadStatus) args[0];
                        if (w.getId() == null) w.setId(idGen.incrementAndGet());
                        workloadDb.put(w.getId(), w);
                        return w;
                    }
                    if ("findAll".equals(name)) {
                        return new ArrayList<>(workloadDb.values());
                    }
                    if ("findById".equals(name)) {
                        Long id = (Long) args[0];
                        return Optional.ofNullable(workloadDb.get(id));
                    }
                    if ("findByWorkloadName".equals(name)) {
                        String wName = (String) args[0];
                        return workloadDb.values().stream()
                                .filter(w -> w.getWorkloadName().equalsIgnoreCase(wName))
                                .findFirst();
                    }
                    return null;
                }
        );

        // Proxy for WorkloadValidationResultRepository
        validationResultRepository = (WorkloadValidationResultRepository) Proxy.newProxyInstance(
                WorkloadValidationResultRepository.class.getClassLoader(),
                new Class<?>[]{WorkloadValidationResultRepository.class},
                (proxy, method, args) -> {
                    String name = method.getName();
                    if ("save".equals(name)) {
                        WorkloadValidationResult v = (WorkloadValidationResult) args[0];
                        if (v.getId() == null) v.setId(idGen.incrementAndGet());
                        if (v.getExecutedAt() == null) v.setExecutedAt(LocalDateTime.now());
                        validationDb.put(v.getId(), v);
                        return v;
                    }
                    if ("findAll".equals(name)) {
                        return new ArrayList<>(validationDb.values());
                    }
                    if ("findById".equals(name)) {
                        Long id = (Long) args[0];
                        return Optional.ofNullable(validationDb.get(id));
                    }
                    return null;
                }
        );

        // Proxy for MigrationFailureIncidentRepository
        failureIncidentRepository = (MigrationFailureIncidentRepository) Proxy.newProxyInstance(
                MigrationFailureIncidentRepository.class.getClassLoader(),
                new Class<?>[]{MigrationFailureIncidentRepository.class},
                (proxy, method, args) -> {
                    String name = method.getName();
                    if ("save".equals(name)) {
                        MigrationFailureIncident f = (MigrationFailureIncident) args[0];
                        if (f.getId() == null) f.setId(idGen.incrementAndGet());
                        if (f.getCreatedAt() == null) f.setCreatedAt(LocalDateTime.now());
                        failureDb.put(f.getId(), f);
                        return f;
                    }
                    if ("findAll".equals(name)) {
                        return new ArrayList<>(failureDb.values());
                    }
                    if ("findById".equals(name)) {
                        Long id = (Long) args[0];
                        return Optional.ofNullable(failureDb.get(id));
                    }
                    return null;
                }
        );

        // Proxy for PerformanceMetricSnapshotRepository
        metricSnapshotRepository = (PerformanceMetricSnapshotRepository) Proxy.newProxyInstance(
                PerformanceMetricSnapshotRepository.class.getClassLoader(),
                new Class<?>[]{PerformanceMetricSnapshotRepository.class},
                (proxy, method, args) -> {
                    String name = method.getName();
                    if ("findAll".equals(name)) {
                        return new ArrayList<>(metricDb.values());
                    }
                    return null;
                }
        );

        // Proxy for MigrationAuditLogRepository
        auditLogRepository = (MigrationAuditLogRepository) Proxy.newProxyInstance(
                MigrationAuditLogRepository.class.getClassLoader(),
                new Class<?>[]{MigrationAuditLogRepository.class},
                (proxy, method, args) -> {
                    String name = method.getName();
                    if ("save".equals(name)) {
                        MigrationAuditLog a = (MigrationAuditLog) args[0];
                        if (a.getId() == null) a.setId(idGen.incrementAndGet());
                        if (a.getTimestamp() == null) a.setTimestamp(LocalDateTime.now());
                        auditDb.put(a.getId(), a);
                        return a;
                    }
                    if ("findTop50ByOrderByTimestampDesc".equals(name) || "findAll".equals(name)) {
                        return new ArrayList<>(auditDb.values());
                    }
                    return null;
                }
        );

        // Proxy for MigrationWaveRepository
        migrationWaveRepository = (MigrationWaveRepository) Proxy.newProxyInstance(
                MigrationWaveRepository.class.getClassLoader(),
                new Class<?>[]{MigrationWaveRepository.class},
                (proxy, method, args) -> {
                    String name = method.getName();
                    if ("findAll".equals(name)) {
                        return new ArrayList<>(waveDb.values());
                    }
                    return null;
                }
        );

        monitoringService = new MigrationMonitoringServiceImpl(
                workloadStatusRepository,
                validationResultRepository,
                failureIncidentRepository,
                metricSnapshotRepository,
                auditLogRepository,
                migrationWaveRepository
        );
    }

    @Test
    @DisplayName("Test 1: Dashboard Summary calculation with workload status and wave progress")
    void testDashboardSummaryCalculation() {
        MigrationWorkloadStatus w1 = new MigrationWorkloadStatus(
                "Orders Portal", "srv-1", "AWS EKS", 1L, "Wave 1 - Pilot", "SUCCESSFUL",
                100.0, "HEALTHY", 30.0, 50.0, 40.0, 99.9, 40, 150.0);
        w1.setId(1L);
        workloadDb.put(1L, w1);

        MigrationWorkloadStatus w2 = new MigrationWorkloadStatus(
                "Payment API", "srv-2", "AWS EKS", 1L, "Wave 1 - Pilot", "IN_PROGRESS",
                50.0, "HEALTHY", 45.0, 60.0, 50.0, 99.8, 55, 200.0);
        w2.setId(2L);
        workloadDb.put(2L, w2);

        MigrationWorkloadStatus w3 = new MigrationWorkloadStatus(
                "Banking DB", "srv-3", "AWS Aurora", 2L, "Wave 2 - Core", "FAILED",
                20.0, "CRITICAL", 85.0, 90.0, 75.0, 95.0, 320, 20.0);
        w3.setId(3L);
        workloadDb.put(3L, w3);

        MonitoringDashboardSummaryDto summary = monitoringService.getDashboardSummary();

        assertNotNull(summary);
        assertEquals(3, summary.getTotalScheduledWorkloads());
        assertEquals(1, summary.getSuccessfulMigrations());
        assertEquals(1, summary.getInProgressMigrations());
        assertEquals(1, summary.getFailedMigrations());
        assertEquals(0, summary.getPendingMigrations());
        assertEquals(33.3, summary.getOverallCompletionPercentage());
        assertEquals(2, summary.getHealthyWorkloadsCount());
        assertEquals(1, summary.getCriticalWorkloadsCount());
        assertNotNull(summary.getTelemetryNotice());
        assertFalse(summary.getWaveProgressList().isEmpty());
    }

    @Test
    @DisplayName("Test 2: Automated validation engine execution creates validation results and audit log")
    void testExecuteWorkloadValidation() {
        ValidationExecuteRequestDto req = new ValidationExecuteRequestDto(
                "Payment Processing Gateway",
                List.of("APPLICATION_AVAILABILITY", "DATABASE_CONNECTIVITY")
        );

        List<ValidationResultDto> results = monitoringService.executeWorkloadValidation(req);

        assertNotNull(results);
        assertEquals(2, results.size());
        assertEquals("PASSED", results.get(0).getValidationStatus());
        assertEquals("PASSED", results.get(1).getValidationStatus());

        // Check audit log was recorded
        assertFalse(auditDb.isEmpty());
        MigrationAuditLog log = auditDb.values().iterator().next();
        assertEquals("VALIDATION_RUN", log.getActivityType());
        assertEquals("Payment Processing Gateway", log.getWorkloadName());
    }

    @Test
    @DisplayName("Test 3: Retrying failed validation increments retry count and sets status to PASSED")
    void testRetryValidation() {
        WorkloadValidationResult failedVal = new WorkloadValidationResult(
                "PostgreSQL Pool Handshake", "Core Banking DB", 10L,
                "DATABASE_CONNECTIVITY", "Active pool >= 10", "Connection refused",
                "FAILED", "Network timeout on port 5432"
        );
        failedVal.setId(501L);
        failedVal.setRetryCount(0);
        validationDb.put(501L, failedVal);

        ValidationResultDto retried = monitoringService.retryValidation(501L);

        assertNotNull(retried);
        assertEquals("PASSED", retried.getValidationStatus());
        assertEquals(1, retried.getRetryCount());
        assertNull(retried.getErrorDetails());

        // Verify audit log recorded
        assertTrue(auditDb.values().stream().anyMatch(a -> "RETRY_ATTEMPT".equals(a.getActivityType())));
    }

    @Test
    @DisplayName("Test 4: Resolving failure incident updates recovery status and heals linked workload")
    void testResolveFailureIncident() {
        MigrationWorkloadStatus ws = new MigrationWorkloadStatus(
                "Loyalty Mobile API", "host-1", "AWS App Runner", 2L, "Wave 2",
                "FAILED", 40.0, "CRITICAL", 80.0, 85.0, 60.0, 94.0, 400, 10.0);
        ws.setId(101L);
        workloadDb.put(101L, ws);

        MigrationFailureIncident inc = new MigrationFailureIncident(
                "Loyalty Mobile API", 101L, "Wave 2",
                "DATABASE_AUTHENTICATION_FAILURE", "Authentication failed for user",
                "psql: error FATAL", "Attach IAM policy");
        inc.setId(601L);
        failureDb.put(601L, inc);

        FailureResolveRequestDto req = new FailureResolveRequestDto(
                "Updated IAM policy and verified IAM DB token handshake.", "RESOLVED");

        FailureIncidentDto resolved = monitoringService.resolveFailureIncident(601L, req);

        assertNotNull(resolved);
        assertEquals("RESOLVED", resolved.getRecoveryStatus());
        assertEquals("Updated IAM policy and verified IAM DB token handshake.", resolved.getTroubleshootingNotes());
        assertNotNull(resolved.getResolvedAt());

        // Check linked workload is now healthy and successful
        MigrationWorkloadStatus updatedWs = workloadDb.get(101L);
        assertEquals("HEALTHY", updatedWs.getHealthStatus());
        assertEquals("SUCCESSFUL", updatedWs.getStatus());
        assertEquals(100.0, updatedWs.getCompletionPercentage());
    }

    @Test
    @DisplayName("Test 5: Retrying failure incident updates status to RETRY_QUEUED and increments counter")
    void testRetryFailureIncident() {
        MigrationFailureIncident inc = new MigrationFailureIncident(
                "DMS Sync", null, "Wave 3", "REPLICATION_LAG", "CDC lag > 120s",
                "Timeout error", "Scale instance to c6i.xlarge");
        inc.setId(602L);
        inc.setRetryCount(0);
        failureDb.put(602L, inc);

        FailureIncidentDto retried = monitoringService.retryFailureIncident(602L);

        assertNotNull(retried);
        assertEquals("RETRY_QUEUED", retried.getRecoveryStatus());
        assertEquals(1, retried.getRetryCount());
        assertNotNull(retried.getLastRetriedAt());
    }

    @Test
    @DisplayName("Test 6: Retrieving performance comparison snapshots and recording custom audit logs")
    void testPerformanceComparisonAndAuditLogs() {
        PerformanceMetricSnapshot p = new PerformanceMetricSnapshot(
                "Orders Portal", "Response Time", 120.0, 45.0, "ms", 62.5, "OPTIMAL");
        p.setId(701L);
        metricDb.put(701L, p);

        List<PerformanceComparisonDto> list = monitoringService.getPerformanceComparison("Orders Portal");
        assertEquals(1, list.size());
        assertEquals("Response Time", list.get(0).getMetricName());
        assertEquals(62.5, list.get(0).getImprovementPercentage());

        AuditLogDto audit = monitoringService.recordAuditLog(
                "USER_ACTION", "Orders Portal", "Manual health check initiated by SRE lead.",
                "SRE Engineer", "SUCCESS");

        assertNotNull(audit);
        assertEquals("USER_ACTION", audit.getActivityType());
        assertEquals("SRE Engineer", audit.getPerformedBy());
    }
}

