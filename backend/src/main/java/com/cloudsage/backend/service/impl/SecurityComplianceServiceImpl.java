package com.cloudsage.backend.service.impl;

import com.cloudsage.backend.dto.*;
import com.cloudsage.backend.entity.*;
import com.cloudsage.backend.exception.ResourceNotFoundException;
import com.cloudsage.backend.repository.*;
import com.cloudsage.backend.service.SecurityComplianceService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class SecurityComplianceServiceImpl implements SecurityComplianceService {

    private static final Logger logger = LoggerFactory.getLogger(SecurityComplianceServiceImpl.class);

    public static final String COMPLIANCE_DISCLAIMER =
            "This module provides assessment guidance and automated control evaluation for migration planning purposes. " +
            "It does not claim to provide official certification, legal audit validation, or statutory compliance guarantees.";

    private final MigrationRiskRepository riskRepository;
    private final SecurityAssessmentControlRepository controlRepository;
    private final ComplianceRequirementRepository complianceRepository;
    private final RiskMitigationActionRepository mitigationRepository;

    public SecurityComplianceServiceImpl(MigrationRiskRepository riskRepository,
                                          SecurityAssessmentControlRepository controlRepository,
                                          ComplianceRequirementRepository complianceRepository,
                                          RiskMitigationActionRepository mitigationRepository) {
        this.riskRepository = riskRepository;
        this.controlRepository = controlRepository;
        this.complianceRepository = complianceRepository;
        this.mitigationRepository = mitigationRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<RiskResponseDto> getAllRisks() {
        List<MigrationRisk> entities = riskRepository.findAllByOrderByRiskScoreDesc();
        return entities.stream().map(this::toRiskResponseDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public RiskResponseDto getRiskById(Long id) {
        MigrationRisk entity = riskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Migration risk not found with ID: " + id));
        return toRiskResponseDto(entity);
    }

    @Override
    public RiskResponseDto createRisk(RiskRequestDto request) {
        MigrationRisk risk = new MigrationRisk();
        String nextId = request.getRiskId() != null && !request.getRiskId().isBlank()
                ? request.getRiskId() : "RISK-" + String.format("%03d", riskRepository.count() + 1);

        risk.setRiskId(nextId);
        risk.setRiskTitle(request.getRiskTitle());
        risk.setDescription(request.getDescription());
        risk.setCategory(request.getCategory());
        risk.setAffectedWorkload(request.getAffectedWorkload() != null ? request.getAffectedWorkload() : "All Workloads");
        risk.setProbability(request.getProbability() != null ? request.getProbability() : 3);
        risk.setImpact(request.getImpact() != null ? request.getImpact() : 3);
        risk.setOwner(request.getOwner() != null ? request.getOwner() : "Unassigned");
        risk.setMitigationPlan(request.getMitigationPlan());
        risk.setStatus(request.getStatus() != null ? request.getStatus() : "OPEN");
        risk.setMitigationProgress(request.getMitigationProgress() != null ? request.getMitigationProgress() : 0);

        risk.recalculateScoreAndSeverity();
        MigrationRisk saved = riskRepository.save(risk);
        logger.info("Successfully created Migration Risk: {} (Severity: {}, Score: {})", saved.getRiskId(), saved.getSeverity(), saved.getRiskScore());
        return toRiskResponseDto(saved);
    }

    @Override
    public RiskResponseDto updateRisk(Long id, RiskRequestDto request) {
        MigrationRisk risk = riskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Migration risk not found with ID: " + id));

        if (request.getRiskTitle() != null) risk.setRiskTitle(request.getRiskTitle());
        if (request.getDescription() != null) risk.setDescription(request.getDescription());
        if (request.getCategory() != null) risk.setCategory(request.getCategory());
        if (request.getAffectedWorkload() != null) risk.setAffectedWorkload(request.getAffectedWorkload());
        if (request.getProbability() != null) risk.setProbability(request.getProbability());
        if (request.getImpact() != null) risk.setImpact(request.getImpact());
        if (request.getOwner() != null) risk.setOwner(request.getOwner());
        if (request.getMitigationPlan() != null) risk.setMitigationPlan(request.getMitigationPlan());
        if (request.getStatus() != null) risk.setStatus(request.getStatus());
        if (request.getMitigationProgress() != null) risk.setMitigationProgress(request.getMitigationProgress());

        risk.recalculateScoreAndSeverity();
        MigrationRisk saved = riskRepository.save(risk);
        logger.info("Updated Migration Risk ID: {}", id);
        return toRiskResponseDto(saved);
    }

    @Override
    public void deleteRisk(Long id) {
        if (!riskRepository.existsById(id)) {
            throw new ResourceNotFoundException("Migration risk not found with ID: " + id);
        }
        riskRepository.deleteById(id);
        logger.info("Deleted Migration Risk ID: {}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public RiskDashboardSummaryDto getDashboardSummary() {
        List<MigrationRisk> risks = riskRepository.findAll();
        List<SecurityAssessmentControl> controls = controlRepository.findAll();
        List<ComplianceRequirement> compliances = complianceRepository.findAll();

        RiskDashboardSummaryDto summary = new RiskDashboardSummaryDto();
        summary.setTotalRisks(risks.size());

        int crit = 0, high = 0, med = 0, low = 0;
        int open = 0, inMit = 0, res = 0, acc = 0;
        double scoreSum = 0;

        Map<String, Integer> catMap = new LinkedHashMap<>();
        Map<String, Integer> sevMap = new LinkedHashMap<>();

        for (MigrationRisk r : risks) {
            scoreSum += r.getRiskScore();
            if ("CRITICAL".equals(r.getSeverity())) crit++;
            else if ("HIGH".equals(r.getSeverity())) high++;
            else if ("MEDIUM".equals(r.getSeverity())) med++;
            else low++;

            if ("OPEN".equals(r.getStatus())) open++;
            else if ("IN_MITIGATION".equals(r.getStatus())) inMit++;
            else if ("RESOLVED".equals(r.getStatus())) res++;
            else if ("ACCEPTED".equals(r.getStatus())) acc++;

            String cat = r.getCategory() != null ? r.getCategory() : "GENERAL";
            catMap.put(cat, catMap.getOrDefault(cat, 0) + 1);

            String sev = r.getSeverity();
            sevMap.put(sev, sevMap.getOrDefault(sev, 0) + 1);
        }

        summary.setCriticalRisks(crit);
        summary.setHighRisks(high);
        summary.setMediumRisks(med);
        summary.setLowRisks(low);

        summary.setOpenRisks(open);
        summary.setInMitigationRisks(inMit);
        summary.setResolvedRisks(res);
        summary.setAcceptedRisks(acc);

        summary.setAverageRiskScore(risks.isEmpty() ? 0.0 : Math.round((scoreSum / risks.size()) * 10.0) / 10.0);
        summary.setRisksByCategory(catMap);
        summary.setRisksBySeverity(sevMap);

        // Security Controls Summary
        summary.setTotalSecurityControls(controls.size());
        long passedCtrl = controls.stream().filter(c -> "PASS".equals(c.getStatus())).count();
        long failedCtrl = controls.stream().filter(c -> "FAIL".equals(c.getStatus())).count();
        long missingCtrl = controls.stream().filter(c -> Boolean.TRUE.equals(c.getMissingControl())).count();

        summary.setPassedSecurityControls((int) passedCtrl);
        summary.setFailedSecurityControls((int) failedCtrl);
        summary.setMissingSecurityControlsCount((int) missingCtrl);

        // Compliance Summaries
        List<ComplianceFrameworkSummaryDto> frameworkSummaries = getComplianceFrameworkSummaries();
        summary.setFrameworkSummaries(frameworkSummaries);

        double totalCompPct = frameworkSummaries.stream()
                .mapToDouble(ComplianceFrameworkSummaryDto::getCompliancePercentage)
                .average().orElse(0.0);
        summary.setOverallCompliancePercentage(Math.round(totalCompPct * 10.0) / 10.0);

        return summary;
    }

    @Override
    @Transactional(readOnly = true)
    public List<SecurityControlDto> getSecurityAssessmentControls(String domain) {
        List<SecurityAssessmentControl> list;
        if (domain != null && !domain.isBlank() && !"ALL".equalsIgnoreCase(domain)) {
            list = controlRepository.findByDomainOrderByIdAsc(domain.toUpperCase());
        } else {
            list = controlRepository.findAll();
        }
        return list.stream().map(this::toSecurityControlDto).collect(Collectors.toList());
    }

    @Override
    public SecurityControlDto updateSecurityControl(Long id, String status, String recommendation) {
        SecurityAssessmentControl control = controlRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Security control not found with ID: " + id));

        if (status != null && !status.isBlank()) {
            control.setStatus(status.toUpperCase());
            control.setMissingControl("FAIL".equalsIgnoreCase(status));
        }
        if (recommendation != null) {
            control.setRecommendation(recommendation);
        }

        SecurityAssessmentControl saved = controlRepository.save(control);
        logger.info("Updated security control ID: {} to status: {}", id, saved.getStatus());
        return toSecurityControlDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ComplianceRequirementDto> getComplianceRequirements(String framework) {
        List<ComplianceRequirement> list;
        if (framework != null && !framework.isBlank() && !"ALL".equalsIgnoreCase(framework)) {
            list = complianceRepository.findByFrameworkOrderByIdAsc(framework.toUpperCase());
        } else {
            list = complianceRepository.findAll();
        }
        return list.stream().map(this::toComplianceRequirementDto).collect(Collectors.toList());
    }

    @Override
    public ComplianceRequirementDto updateComplianceRequirement(Long id, ComplianceUpdateRequestDto request) {
        ComplianceRequirement req = complianceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Compliance requirement not found with ID: " + id));

        if (request.getStatus() != null) req.setStatus(request.getStatus().toUpperCase());
        if (request.getAssessmentNotes() != null) req.setAssessmentNotes(request.getAssessmentNotes());
        if (request.getComplianceGap() != null) req.setComplianceGap(request.getComplianceGap());
        if (request.getSuggestedCorrectiveAction() != null) req.setSuggestedCorrectiveAction(request.getSuggestedCorrectiveAction());

        ComplianceRequirement saved = complianceRepository.save(req);
        logger.info("Updated compliance requirement ID: {} status: {}", id, saved.getStatus());
        return toComplianceRequirementDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ComplianceFrameworkSummaryDto> getComplianceFrameworkSummaries() {
        String[] frameworks = {"GDPR", "ISO_27001", "SOC2", "HIPAA"};
        List<ComplianceFrameworkSummaryDto> summaries = new ArrayList<>();

        for (String fw : frameworks) {
            List<ComplianceRequirement> reqs = complianceRepository.findByFrameworkOrderByIdAsc(fw);
            ComplianceFrameworkSummaryDto dto = new ComplianceFrameworkSummaryDto();
            dto.setFramework(fw);
            dto.setDisplayName(getFrameworkDisplayName(fw));
            dto.setDescription(getFrameworkDescription(fw));
            dto.setTotalRequirements(reqs.size());

            long compliant = reqs.stream().filter(r -> "COMPLIANT".equals(r.getStatus())).count();
            long nonCompliant = reqs.stream().filter(r -> "NON_COMPLIANT".equals(r.getStatus())).count();
            long needsReview = reqs.stream().filter(r -> "NEEDS_REVIEW".equals(r.getStatus())).count();

            dto.setCompliantCount((int) compliant);
            dto.setNonCompliantCount((int) nonCompliant);
            dto.setNeedsReviewCount((int) needsReview);

            double pct = reqs.isEmpty() ? 0.0 : Math.round((compliant * 100.0 / reqs.size()) * 10.0) / 10.0;
            dto.setCompliancePercentage(pct);

            if (pct >= 90.0) {
                dto.setStatus("COMPLIANT");
            } else if (pct >= 75.0) {
                dto.setStatus("MINOR_GAPS");
            } else {
                dto.setStatus("ACTION_REQUIRED");
            }

            summaries.add(dto);
        }

        return summaries;
    }

    @Override
    public MitigationActionDto addMitigationAction(MitigationCreateRequestDto request) {
        MigrationRisk risk = riskRepository.findById(request.getRiskId())
                .orElseThrow(() -> new ResourceNotFoundException("Migration risk not found with ID: " + request.getRiskId()));

        RiskMitigationAction action = new RiskMitigationAction();
        action.setRiskId(risk.getId());
        action.setActionTitle(request.getActionTitle());
        action.setAssignedTo(request.getAssignedTo() != null ? request.getAssignedTo() : risk.getOwner());
        action.setDueDate(request.getDueDate());
        action.setStatus(request.getStatus() != null ? request.getStatus() : "NOT_STARTED");
        action.setProgressPercentage(request.getProgressPercentage() != null ? request.getProgressPercentage() : 0);
        action.setResolutionDetails(request.getResolutionDetails());
        action.setLinkedMigrationTaskId(request.getLinkedMigrationTaskId());

        RiskMitigationAction saved = mitigationRepository.save(action);

        // Update parent risk mitigation status
        if ("COMPLETED".equals(action.getStatus())) {
            risk.setMitigationProgress(Math.min(100, risk.getMitigationProgress() + 25));
        } else if ("IN_PROGRESS".equals(action.getStatus())) {
            risk.setStatus("IN_MITIGATION");
        }
        riskRepository.save(risk);

        return toMitigationActionDto(saved);
    }

    @Override
    public MitigationActionDto updateMitigationAction(Long actionId, String status, Integer progress, String resolution) {
        RiskMitigationAction action = mitigationRepository.findById(actionId)
                .orElseThrow(() -> new ResourceNotFoundException("Mitigation action not found with ID: " + actionId));

        if (status != null) action.setStatus(status.toUpperCase());
        if (progress != null) action.setProgressPercentage(progress);
        if (resolution != null) action.setResolutionDetails(resolution);

        RiskMitigationAction saved = mitigationRepository.save(action);

        // Sync parent risk status
        Optional<MigrationRisk> riskOpt = riskRepository.findById(saved.getRiskId());
        if (riskOpt.isPresent()) {
            MigrationRisk r = riskOpt.get();
            if (progress != null) r.setMitigationProgress(progress);
            if ("COMPLETED".equals(status)) {
                r.setStatus("RESOLVED");
            }
            riskRepository.save(r);
        }

        return toMitigationActionDto(saved);
    }

    @Override
    public void deleteMitigationAction(Long actionId) {
        if (!mitigationRepository.existsById(actionId)) {
            throw new ResourceNotFoundException("Mitigation action not found with ID: " + actionId);
        }
        mitigationRepository.deleteById(actionId);
    }

    // Entity to DTO Mappers
    private RiskResponseDto toRiskResponseDto(MigrationRisk entity) {
        RiskResponseDto dto = new RiskResponseDto();
        dto.setId(entity.getId());
        dto.setRiskId(entity.getRiskId());
        dto.setRiskTitle(entity.getRiskTitle());
        dto.setDescription(entity.getDescription());
        dto.setCategory(entity.getCategory());
        dto.setAffectedWorkload(entity.getAffectedWorkload());
        dto.setProbability(entity.getProbability());
        dto.setImpact(entity.getImpact());
        dto.setRiskScore(entity.getRiskScore());
        dto.setSeverity(entity.getSeverity());
        dto.setOwner(entity.getOwner());
        dto.setMitigationPlan(entity.getMitigationPlan());
        dto.setStatus(entity.getStatus());
        dto.setMitigationProgress(entity.getMitigationProgress());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());

        List<RiskMitigationAction> actions = mitigationRepository.findByRiskIdOrderByDueDateAsc(entity.getId());
        dto.setMitigationActions(actions.stream().map(this::toMitigationActionDto).collect(Collectors.toList()));
        return dto;
    }

    private SecurityControlDto toSecurityControlDto(SecurityAssessmentControl c) {
        SecurityControlDto dto = new SecurityControlDto();
        dto.setId(c.getId());
        dto.setControlId(c.getControlId());
        dto.setDomain(c.getDomain());
        dto.setControlName(c.getControlName());
        dto.setDescription(c.getDescription());
        dto.setTargetCloudService(c.getTargetCloudService());
        dto.setStatus(c.getStatus());
        dto.setSeverity(c.getSeverity());
        dto.setMissingControl(c.getMissingControl());
        dto.setRecommendation(c.getRecommendation());
        dto.setTerraformSnippet(c.getTerraformSnippet());
        dto.setUpdatedAt(c.getUpdatedAt());
        return dto;
    }

    private ComplianceRequirementDto toComplianceRequirementDto(ComplianceRequirement r) {
        ComplianceRequirementDto dto = new ComplianceRequirementDto();
        dto.setId(r.getId());
        dto.setFramework(r.getFramework());
        dto.setSectionRef(r.getSectionRef());
        dto.setRequirementTitle(r.getRequirementTitle());
        dto.setDescription(r.getDescription());
        dto.setStatus(r.getStatus());
        dto.setAssessmentNotes(r.getAssessmentNotes());
        dto.setComplianceGap(r.getComplianceGap());
        dto.setSuggestedCorrectiveAction(r.getSuggestedCorrectiveAction());
        dto.setAffectedWorkload(r.getAffectedWorkload());
        dto.setUpdatedAt(r.getUpdatedAt());
        return dto;
    }

    private MitigationActionDto toMitigationActionDto(RiskMitigationAction a) {
        MitigationActionDto dto = new MitigationActionDto();
        dto.setId(a.getId());
        dto.setRiskId(a.getRiskId());
        dto.setActionTitle(a.getActionTitle());
        dto.setAssignedTo(a.getAssignedTo());
        dto.setDueDate(a.getDueDate());
        dto.setStatus(a.getStatus());
        dto.setProgressPercentage(a.getProgressPercentage());
        dto.setResolutionDetails(a.getResolutionDetails());
        dto.setLinkedMigrationTaskId(a.getLinkedMigrationTaskId());
        dto.setCreatedAt(a.getCreatedAt());
        dto.setUpdatedAt(a.getUpdatedAt());
        return dto;
    }

    private String getFrameworkDisplayName(String fw) {
        switch (fw) {
            case "GDPR": return "GDPR Data Protection Regulation";
            case "ISO_27001": return "ISO/IEC 27001:2022 ISMS";
            case "SOC2": return "SOC 2 Type II Trust Services";
            case "HIPAA": return "HIPAA Security Rule (ePHI)";
            default: return fw;
        }
    }

    private String getFrameworkDescription(String fw) {
        switch (fw) {
            case "GDPR": return "European Union data privacy, consent management, cross-border residency, and encryption controls.";
            case "ISO_27001": return "International standard for information security management systems, access control, and cryptographic posture.";
            case "SOC2": return "AICPA trust services criteria covering Security, Availability, Processing Integrity, and Confidentiality.";
            case "HIPAA": return "Safeguarding electronic Protected Health Information (ePHI) with access audit logging and BAA agreements.";
            default: return "";
        }
    }
}

