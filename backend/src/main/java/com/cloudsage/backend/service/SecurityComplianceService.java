package com.cloudsage.backend.service;

import com.cloudsage.backend.dto.*;

import java.util.List;

public interface SecurityComplianceService {

    List<RiskResponseDto> getAllRisks();

    RiskResponseDto getRiskById(Long id);

    RiskResponseDto createRisk(RiskRequestDto request);

    RiskResponseDto updateRisk(Long id, RiskRequestDto request);

    void deleteRisk(Long id);

    RiskDashboardSummaryDto getDashboardSummary();

    List<SecurityControlDto> getSecurityAssessmentControls(String domain);

    SecurityControlDto updateSecurityControl(Long id, String status, String recommendation);

    List<ComplianceRequirementDto> getComplianceRequirements(String framework);

    ComplianceRequirementDto updateComplianceRequirement(Long id, ComplianceUpdateRequestDto request);

    List<ComplianceFrameworkSummaryDto> getComplianceFrameworkSummaries();

    MitigationActionDto addMitigationAction(MitigationCreateRequestDto request);

    MitigationActionDto updateMitigationAction(Long actionId, String status, Integer progress, String resolution);

    void deleteMitigationAction(Long actionId);
}

