package com.cloudsage.backend.service;

import com.cloudsage.backend.dto.*;
import com.cloudsage.backend.entity.*;
import com.cloudsage.backend.repository.*;
import com.cloudsage.backend.service.impl.MigrationReportServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Proxy;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.atomic.AtomicLong;

import static org.junit.jupiter.api.Assertions.*;

public class MigrationReportServiceTest {

    private Map<Long, MigrationReport> reportDb;
    private Map<Long, Infrastructure> infraDb;
    private Map<Long, WorkloadAssessment> assessDb;
    private Map<Long, TargetArchitecture> archDb;
    private Map<Long, CostEstimate> costDb;
    private Map<Long, MigrationPlan> planDb;
    private Map<Long, MigrationWave> waveDb;
    private Map<Long, MigrationRisk> riskDb;
    private Map<Long, SecurityAssessmentControl> controlDb;
    private Map<Long, ComplianceRequirement> compDb;
    private Map<Long, MigrationWorkloadStatus> statusDb;
    private Map<Long, WorkloadValidationResult> valDb;
    private Map<Long, PerformanceMetricSnapshot> metricDb;
    private AtomicLong idGen;

    private MigrationReportRepository reportRepository;
    private InfrastructureRepository infrastructureRepository;
    private WorkloadAssessmentRepository assessmentRepository;
    private TargetArchitectureRepository architectureRepository;
    private CostEstimateRepository costEstimateRepository;
    private MigrationPlanRepository migrationPlanRepository;
    private MigrationWaveRepository migrationWaveRepository;
    private MigrationRiskRepository riskRepository;
    private SecurityAssessmentControlRepository controlRepository;
    private ComplianceRequirementRepository complianceRepository;
    private MigrationWorkloadStatusRepository workloadStatusRepository;
    private WorkloadValidationResultRepository validationResultRepository;
    private PerformanceMetricSnapshotRepository metricSnapshotRepository;

    private MigrationReportService reportService;

    @BeforeEach
    void setUp() {
        reportDb = new HashMap<>();
        infraDb = new HashMap<>();
        assessDb = new HashMap<>();
        archDb = new HashMap<>();
        costDb = new HashMap<>();
        planDb = new HashMap<>();
        waveDb = new HashMap<>();
        riskDb = new HashMap<>();
        controlDb = new HashMap<>();
        compDb = new HashMap<>();
        statusDb = new HashMap<>();
        valDb = new HashMap<>();
        metricDb = new HashMap<>();
        idGen = new AtomicLong(500L);

        // Proxy for MigrationReportRepository
        reportRepository = (MigrationReportRepository) Proxy.newProxyInstance(
                MigrationReportRepository.class.getClassLoader(),
                new Class<?>[]{MigrationReportRepository.class},
                (proxy, method, args) -> {
                    String name = method.getName();
                    if ("save".equals(name)) {
                        MigrationReport r = (MigrationReport) args[0];
                        if (r.getId() == null) r.setId(idGen.incrementAndGet());
                        if (r.getGeneratedAt() == null) r.setGeneratedAt(LocalDateTime.now());
                        reportDb.put(r.getId(), r);
                        return r;
                    }
                    if ("findAll".equals(name) || "findAllByOrderByGeneratedAtDesc".equals(name)) {
                        return new ArrayList<>(reportDb.values());
                    }
                    if ("findById".equals(name)) {
                        Long id = (Long) args[0];
                        return Optional.ofNullable(reportDb.get(id));
                    }
                    if ("existsById".equals(name)) {
                        Long id = (Long) args[0];
                        return reportDb.containsKey(id);
                    }
                    if ("deleteById".equals(name)) {
                        Long id = (Long) args[0];
                        reportDb.remove(id);
                        return null;
                    }
                    return null;
                }
        );

        // Proxies for other repositories
        infrastructureRepository = createEmptyProxy(InfrastructureRepository.class, infraDb);
        assessmentRepository = createEmptyProxy(WorkloadAssessmentRepository.class, assessDb);
        architectureRepository = createEmptyProxy(TargetArchitectureRepository.class, archDb);
        costEstimateRepository = createEmptyProxy(CostEstimateRepository.class, costDb);
        migrationPlanRepository = createEmptyProxy(MigrationPlanRepository.class, planDb);
        migrationWaveRepository = createEmptyProxy(MigrationWaveRepository.class, waveDb);
        riskRepository = createEmptyProxy(MigrationRiskRepository.class, riskDb);
        controlRepository = createEmptyProxy(SecurityAssessmentControlRepository.class, controlDb);
        complianceRepository = createEmptyProxy(ComplianceRequirementRepository.class, compDb);
        workloadStatusRepository = createEmptyProxy(MigrationWorkloadStatusRepository.class, statusDb);
        validationResultRepository = createEmptyProxy(WorkloadValidationResultRepository.class, valDb);
        metricSnapshotRepository = createEmptyProxy(PerformanceMetricSnapshotRepository.class, metricDb);

        reportService = new MigrationReportServiceImpl(
                reportRepository,
                infrastructureRepository,
                assessmentRepository,
                architectureRepository,
                costEstimateRepository,
                migrationPlanRepository,
                migrationWaveRepository,
                riskRepository,
                controlRepository,
                complianceRepository,
                workloadStatusRepository,
                validationResultRepository,
                metricSnapshotRepository
        );
    }

    @SuppressWarnings("unchecked")
    private <T> T createEmptyProxy(Class<T> repoClass, Map<Long, ?> map) {
        return (T) Proxy.newProxyInstance(
                repoClass.getClassLoader(),
                new Class<?>[]{repoClass},
                (proxy, method, args) -> {
                    if ("findAll".equals(method.getName())) {
                        return new ArrayList<>(map.values());
                    }
                    return null;
                }
        );
    }

    @Test
    @DisplayName("Test 1: Project Statistics synthesis calculates consolidated values across all stages")
    void testProjectStatisticsSynthesis() {
        ProjectOverallStatisticsDto stats = reportService.getProjectStatistics();

        assertNotNull(stats);
        assertEquals("Enterprise Banking & Digital Commerce Migration", stats.getProjectName());
        assertTrue(stats.getTotalServersCount() > 0);
        assertTrue(stats.getTotalWorkloadsAssessed() > 0);
        assertTrue(stats.getEstimatedAnnualSavings() > 0);
        assertTrue(stats.getOverallProjectReadinessScore() >= 50.0 && stats.getOverallProjectReadinessScore() <= 100.0);
    }

    @Test
    @DisplayName("Test 2: Executive Summary generation contains 6Rs distribution and recommendations")
    void testExecutiveSummaryGeneration() {
        ExecutiveSummaryDto exec = reportService.getExecutiveSummary("AWS");

        assertNotNull(exec);
        assertEquals("AWS", exec.getSelectedCloudProvider());
        assertNotNull(exec.getMigrationStrategyDistribution());
        assertTrue(exec.getMigrationStrategyDistribution().containsKey("Rehost"));
        assertTrue(exec.getMigrationStrategyDistribution().containsKey("Replatform"));
        assertTrue(exec.getEstimatedAnnualSavings() > 0);
        assertFalse(exec.getMajorRisks().isEmpty());
        assertFalse(exec.getExecutiveRecommendations().isEmpty());
    }

    @Test
    @DisplayName("Test 3: Complete Migration Report compiles all 8 sections and statutory disclaimer")
    void testCompleteMigrationReportCompilation() {
        CompleteMigrationReportDto report = reportService.getCompleteMigrationReport("AWS");

        assertNotNull(report);
        assertEquals("COMPLETE_ENTERPRISE", report.getReportType());
        assertNotNull(report.getExecutiveSummary());
        assertNotNull(report.getInfrastructureSection());
        assertNotNull(report.getStrategySection());
        assertNotNull(report.getArchitectureSection());
        assertNotNull(report.getCostSection());
        assertNotNull(report.getExecutionSection());
        assertNotNull(report.getSecuritySection());
        assertNotNull(report.getValidationSection());
        assertNotNull(report.getStatutoryDisclaimer());
    }

    @Test
    @DisplayName("Test 4: Report generation, history retrieval, find by ID, and deletion")
    void testReportHistoryCrudAndSave() {
        ReportGenerateRequestDto req = new ReportGenerateRequestDto();
        req.setReportTitle("Custom Financial Sector Migration Blueprint");
        req.setReportType("FINOPS_COST_ANALYSIS");
        req.setOrganizationName("Acme Global Wealth");
        req.setSelectedCloudProvider("AWS");

        ReportHistoryItemDto created = reportService.generateAndSaveReport(req);

        assertNotNull(created);
        assertNotNull(created.getId());
        assertEquals("Custom Financial Sector Migration Blueprint", created.getReportTitle());

        List<ReportHistoryItemDto> history = reportService.getReportHistory();
        assertEquals(1, history.size());

        CompleteMigrationReportDto retrieved = reportService.getReportById(created.getId());
        assertNotNull(retrieved);
        assertEquals(created.getId(), retrieved.getId());

        reportService.deleteReport(created.getId());
        assertEquals(0, reportDb.size());
    }

    @Test
    @DisplayName("Test 5: PDF binary generation produces valid %PDF-1.4 header and trailer; CSV export produces valid rows")
    void testPdfAndCsvBinaryExport() {
        ReportGenerateRequestDto req = new ReportGenerateRequestDto();
        req.setReportTitle("Export Test Report");
        req.setReportType("EXECUTIVE_SUMMARY");
        ReportHistoryItemDto created = reportService.generateAndSaveReport(req);

        // Test PDF
        byte[] pdfBytes = reportService.generatePdfReport(created.getId());
        assertNotNull(pdfBytes);
        assertTrue(pdfBytes.length > 100);
        String pdfHeader = new String(pdfBytes, 0, 8, StandardCharsets.ISO_8859_1);
        assertEquals("%PDF-1.4", pdfHeader);
        String pdfTail = new String(pdfBytes, pdfBytes.length - 20, 20, StandardCharsets.ISO_8859_1);
        assertTrue(pdfTail.contains("%%EOF"));

        // Test CSV
        byte[] csvBytes = reportService.generateCsvReport(created.getId());
        assertNotNull(csvBytes);
        String csvString = new String(csvBytes, StandardCharsets.UTF_8);
        assertTrue(csvString.contains("Section,Metric Name,Value,Unit,Notes"));
        assertTrue(csvString.contains("Executive,Project Name"));
        assertTrue(csvString.contains("Infrastructure,Total Servers"));
        assertTrue(csvString.contains("FinOps,Net Annual Savings"));
    }
}

