package com.cloudsage.backend.service;

import com.cloudsage.backend.dto.*;
import com.cloudsage.backend.entity.*;
import com.cloudsage.backend.repository.*;
import com.cloudsage.backend.service.impl.SecurityComplianceServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Proxy;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.atomic.AtomicLong;

import static org.junit.jupiter.api.Assertions.*;

public class SecurityComplianceServiceTest {

    private Map<Long, MigrationRisk> riskDb;
    private Map<Long, SecurityAssessmentControl> controlDb;
    private Map<Long, ComplianceRequirement> complianceDb;
    private Map<Long, RiskMitigationAction> mitigationDb;
    private AtomicLong idGen;

    private MigrationRiskRepository riskRepository;
    private SecurityAssessmentControlRepository controlRepository;
    private ComplianceRequirementRepository complianceRepository;
    private RiskMitigationActionRepository mitigationRepository;
    private SecurityComplianceService securityComplianceService;

    @BeforeEach
    void setUp() {
        riskDb = new HashMap<>();
        controlDb = new HashMap<>();
        complianceDb = new HashMap<>();
        mitigationDb = new HashMap<>();
        idGen = new AtomicLong(300L);

        // Dynamic Proxy for MigrationRiskRepository
        riskRepository = (MigrationRiskRepository) Proxy.newProxyInstance(
                MigrationRiskRepository.class.getClassLoader(),
                new Class<?>[]{MigrationRiskRepository.class},
                (proxy, method, args) -> {
                    String name = method.getName();
                    if ("save".equals(name)) {
                        MigrationRisk r = (MigrationRisk) args[0];
                        if (r.getId() == null) r.setId(idGen.incrementAndGet());
                        if (r.getCreatedAt() == null) r.setCreatedAt(LocalDateTime.now());
                        r.recalculateScoreAndSeverity();
                        riskDb.put(r.getId(), r);
                        return r;
                    } else if ("findById".equals(name)) {
                        Long id = (Long) args[0];
                        return Optional.ofNullable(riskDb.get(id));
                    } else if ("findAllByOrderByRiskScoreDesc".equals(name)) {
                        List<MigrationRisk> list = new ArrayList<>(riskDb.values());
                        list.sort((a, b) -> b.getRiskScore().compareTo(a.getRiskScore()));
                        return list;
                    } else if ("findAll".equals(name)) {
                        return new ArrayList<>(riskDb.values());
                    } else if ("count".equals(name)) {
                        return (long) riskDb.size();
                    } else if ("existsById".equals(name)) {
                        Long id = (Long) args[0];
                        return riskDb.containsKey(id);
                    } else if ("deleteById".equals(name)) {
                        Long id = (Long) args[0];
                        riskDb.remove(id);
                        return null;
                    }
                    return null;
                }
        );

        // Dynamic Proxy for SecurityAssessmentControlRepository
        controlRepository = (SecurityAssessmentControlRepository) Proxy.newProxyInstance(
                SecurityAssessmentControlRepository.class.getClassLoader(),
                new Class<?>[]{SecurityAssessmentControlRepository.class},
                (proxy, method, args) -> {
                    String name = method.getName();
                    if ("save".equals(name)) {
                        SecurityAssessmentControl c = (SecurityAssessmentControl) args[0];
                        if (c.getId() == null) c.setId(idGen.incrementAndGet());
                        controlDb.put(c.getId(), c);
                        return c;
                    } else if ("findById".equals(name)) {
                        Long id = (Long) args[0];
                        return Optional.ofNullable(controlDb.get(id));
                    } else if ("findByDomainOrderByIdAsc".equals(name)) {
                        String dom = (String) args[0];
                        List<SecurityAssessmentControl> list = new ArrayList<>();
                        for (SecurityAssessmentControl c : controlDb.values()) {
                            if (dom.equals(c.getDomain())) list.add(c);
                        }
                        return list;
                    } else if ("findAll".equals(name)) {
                        return new ArrayList<>(controlDb.values());
                    }
                    return null;
                }
        );

        // Dynamic Proxy for ComplianceRequirementRepository
        complianceRepository = (ComplianceRequirementRepository) Proxy.newProxyInstance(
                ComplianceRequirementRepository.class.getClassLoader(),
                new Class<?>[]{ComplianceRequirementRepository.class},
                (proxy, method, args) -> {
                    String name = method.getName();
                    if ("save".equals(name)) {
                        ComplianceRequirement cr = (ComplianceRequirement) args[0];
                        if (cr.getId() == null) cr.setId(idGen.incrementAndGet());
                        complianceDb.put(cr.getId(), cr);
                        return cr;
                    } else if ("findById".equals(name)) {
                        Long id = (Long) args[0];
                        return Optional.ofNullable(complianceDb.get(id));
                    } else if ("findByFrameworkOrderByIdAsc".equals(name)) {
                        String fw = (String) args[0];
                        List<ComplianceRequirement> list = new ArrayList<>();
                        for (ComplianceRequirement cr : complianceDb.values()) {
                            if (fw.equals(cr.getFramework())) list.add(cr);
                        }
                        return list;
                    } else if ("findAll".equals(name)) {
                        return new ArrayList<>(complianceDb.values());
                    }
                    return null;
                }
        );

        // Dynamic Proxy for RiskMitigationActionRepository
        mitigationRepository = (RiskMitigationActionRepository) Proxy.newProxyInstance(
                RiskMitigationActionRepository.class.getClassLoader(),
                new Class<?>[]{RiskMitigationActionRepository.class},
                (proxy, method, args) -> {
                    String name = method.getName();
                    if ("save".equals(name)) {
                        RiskMitigationAction a = (RiskMitigationAction) args[0];
                        if (a.getId() == null) a.setId(idGen.incrementAndGet());
                        if (a.getCreatedAt() == null) a.setCreatedAt(LocalDateTime.now());
                        mitigationDb.put(a.getId(), a);
                        return a;
                    } else if ("findById".equals(name)) {
                        Long id = (Long) args[0];
                        return Optional.ofNullable(mitigationDb.get(id));
                    } else if ("findByRiskIdOrderByDueDateAsc".equals(name)) {
                        Long rId = (Long) args[0];
                        List<RiskMitigationAction> list = new ArrayList<>();
                        for (RiskMitigationAction a : mitigationDb.values()) {
                            if (rId.equals(a.getRiskId())) list.add(a);
                        }
                        return list;
                    } else if ("existsById".equals(name)) {
                        Long id = (Long) args[0];
                        return mitigationDb.containsKey(id);
                    } else if ("deleteById".equals(name)) {
                        Long id = (Long) args[0];
                        mitigationDb.remove(id);
                        return null;
                    }
                    return null;
                }
        );

        securityComplianceService = new SecurityComplianceServiceImpl(
                riskRepository,
                controlRepository,
                complianceRepository,
                mitigationRepository
        );

        // Seed 1 baseline control & 1 compliance requirement
        SecurityAssessmentControl c = new SecurityAssessmentControl();
        c.setId(1L);
        c.setControlId("SEC-IAM-01");
        c.setDomain("IAM");
        c.setControlName("MFA Enforcement");
        c.setStatus("PASS");
        c.setSeverity("HIGH");
        c.setMissingControl(false);
        controlDb.put(1L, c);

        ComplianceRequirement req = new ComplianceRequirement();
        req.setId(1L);
        req.setFramework("GDPR");
        req.setSectionRef("Article 32");
        req.setRequirementTitle("Data Encryption");
        req.setStatus("NEEDS_REVIEW");
        complianceDb.put(1L, req);
    }

    @Test
    @DisplayName("Should accurately calculate risk score and classify severity")
    void testRiskScoringEngine() {
        RiskRequestDto criticalReq = new RiskRequestDto();
        criticalReq.setRiskTitle("Catastrophic Database CDC Outage");
        criticalReq.setCategory("DATA_LOSS");
        criticalReq.setProbability(4);
        criticalReq.setImpact(5);
        RiskResponseDto criticalRisk = securityComplianceService.createRisk(criticalReq);
        assertEquals(20, criticalRisk.getRiskScore());
        assertEquals("CRITICAL", criticalRisk.getSeverity());

        RiskRequestDto mediumReq = new RiskRequestDto();
        mediumReq.setRiskTitle("Minor Web Session Reset on Pod Redeploy");
        mediumReq.setCategory("PERFORMANCE");
        mediumReq.setProbability(2);
        mediumReq.setImpact(3);
        RiskResponseDto mediumRisk = securityComplianceService.createRisk(mediumReq);
        assertEquals(6, mediumRisk.getRiskScore());
        assertEquals("MEDIUM", mediumRisk.getSeverity());
    }

    @Test
    @DisplayName("Should create, retrieve, update, and delete a risk in the register")
    void testRiskCrud() {
        RiskRequestDto req = new RiskRequestDto();
        req.setRiskTitle("Direct Connect BGP Route Flap");
        req.setCategory("NETWORK");
        req.setAffectedWorkload("Platform Foundation");
        req.setProbability(3);
        req.setImpact(4);
        req.setOwner("David Chen (DevOps / IaC)");

        RiskResponseDto created = securityComplianceService.createRisk(req);
        assertNotNull(created.getId());
        assertEquals("HIGH", created.getSeverity());

        RiskRequestDto updateReq = new RiskRequestDto();
        updateReq.setRiskTitle("Direct Connect BGP Route Flap (Mitigated via BFD)");
        updateReq.setStatus("IN_MITIGATION");
        updateReq.setMitigationProgress(60);

        RiskResponseDto updated = securityComplianceService.updateRisk(created.getId(), updateReq);
        assertEquals("IN_MITIGATION", updated.getStatus());
        assertEquals(60, updated.getMitigationProgress());

        securityComplianceService.deleteRisk(created.getId());
        List<RiskResponseDto> remaining = securityComplianceService.getAllRisks();
        assertFalse(remaining.stream().anyMatch(r -> r.getId().equals(created.getId())));
    }

    @Test
    @DisplayName("Should evaluate security controls and flag missing controls on failure")
    void testSecurityControlsEvaluation() {
        SecurityControlDto updated = securityComplianceService.updateSecurityControl(
                1L, "FAIL", "Deploy Hardware MFA tokens immediately."
        );
        assertEquals("FAIL", updated.getStatus());
        assertTrue(updated.getMissingControl(), "Missing control flag should be true on FAIL status");

        List<SecurityControlDto> iamControls = securityComplianceService.getSecurityAssessmentControls("IAM");
        assertFalse(iamControls.isEmpty());
        assertEquals("FAIL", iamControls.get(0).getStatus());
    }

    @Test
    @DisplayName("Should update compliance checklist requirement and recalculate summary")
    void testComplianceChecklistUpdate() {
        ComplianceUpdateRequestDto update = new ComplianceUpdateRequestDto();
        update.setStatus("COMPLIANT");
        update.setAssessmentNotes("KMS CMK AES-256 encryption configured on all database storage volumes.");

        ComplianceRequirementDto updated = securityComplianceService.updateComplianceRequirement(1L, update);
        assertEquals("COMPLIANT", updated.getStatus());

        List<ComplianceFrameworkSummaryDto> summaries = securityComplianceService.getComplianceFrameworkSummaries();
        assertFalse(summaries.isEmpty());
        ComplianceFrameworkSummaryDto gdpr = summaries.stream().filter(s -> "GDPR".equals(s.getFramework())).findFirst().orElse(null);
        assertNotNull(gdpr);
        assertEquals(1, gdpr.getCompliantCount());
        assertEquals(100.0, gdpr.getCompliancePercentage());
        assertEquals("COMPLIANT", gdpr.getStatus());
    }

    @Test
    @DisplayName("Should aggregate dashboard summary metrics correctly")
    void testRiskDashboardSummary() {
        // Seed 1 critical risk and 1 low risk
        RiskRequestDto r1 = new RiskRequestDto();
        r1.setRiskTitle("Core Banking DB Corruption");
        r1.setCategory("DATA_LOSS");
        r1.setProbability(5);
        r1.setImpact(5); // 25 Critical
        securityComplianceService.createRisk(r1);

        RiskDashboardSummaryDto summary = securityComplianceService.getDashboardSummary();
        assertNotNull(summary);
        assertTrue(summary.getTotalRisks() > 0);
        assertTrue(summary.getCriticalRisks() > 0);
        assertNotNull(summary.getRisksByCategory());
        assertNotNull(summary.getRisksBySeverity());
    }

    @Test
    @DisplayName("Should track mitigation actions and update parent risk progress")
    void testMitigationActionLifecycle() {
        RiskRequestDto r = new RiskRequestDto();
        r.setRiskTitle("Unencrypted DB Backups");
        r.setCategory("SECURITY");
        r.setProbability(3);
        r.setImpact(4);
        RiskResponseDto parentRisk = securityComplianceService.createRisk(r);

        MitigationCreateRequestDto actionReq = new MitigationCreateRequestDto();
        actionReq.setRiskId(parentRisk.getId());
        actionReq.setActionTitle("Enable KMS CMK encryption on automated snapshots");
        actionReq.setAssignedTo("Alex Morgan (Security Eng)");
        actionReq.setDueDate(LocalDate.now().plusDays(10));
        actionReq.setStatus("IN_PROGRESS");
        actionReq.setProgressPercentage(50);

        MitigationActionDto createdAction = securityComplianceService.addMitigationAction(actionReq);
        assertNotNull(createdAction);
        assertEquals("IN_PROGRESS", createdAction.getStatus());

        // Verify parent risk status moved to IN_MITIGATION
        RiskResponseDto refreshedRisk = securityComplianceService.getRiskById(parentRisk.getId());
        assertEquals("IN_MITIGATION", refreshedRisk.getStatus());
    }
}

