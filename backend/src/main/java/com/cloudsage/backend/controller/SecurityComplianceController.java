package com.cloudsage.backend.controller;

import com.cloudsage.backend.dto.*;
import com.cloudsage.backend.service.SecurityComplianceService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/security")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class SecurityComplianceController {

    private static final Logger logger = LoggerFactory.getLogger(SecurityComplianceController.class);

    private final SecurityComplianceService securityComplianceService;

    public SecurityComplianceController(SecurityComplianceService securityComplianceService) {
        this.securityComplianceService = securityComplianceService;
    }

    /**
     * Get overall security, risk, and compliance dashboard metrics
     */
    @GetMapping("/dashboard")
    public ResponseEntity<RiskDashboardSummaryDto> getDashboardSummary() {
        logger.info("REST request to fetch Security & Risk dashboard summary");
        RiskDashboardSummaryDto summary = securityComplianceService.getDashboardSummary();
        return ResponseEntity.ok(summary);
    }

    // =========================================================================
    // RISK REGISTER ENDPOINTS
    // =========================================================================

    @GetMapping("/risks")
    public ResponseEntity<List<RiskResponseDto>> getAllRisks() {
        logger.info("REST request to fetch all risks in register");
        List<RiskResponseDto> risks = securityComplianceService.getAllRisks();
        return ResponseEntity.ok(risks);
    }

    @GetMapping("/risks/{id}")
    public ResponseEntity<RiskResponseDto> getRiskById(@PathVariable Long id) {
        logger.info("REST request to fetch risk ID={}", id);
        RiskResponseDto risk = securityComplianceService.getRiskById(id);
        return ResponseEntity.ok(risk);
    }

    @PostMapping("/risks")
    public ResponseEntity<RiskResponseDto> createRisk(@Valid @RequestBody RiskRequestDto request) {
        logger.info("REST request to create risk: '{}'", request.getRiskTitle());
        RiskResponseDto created = securityComplianceService.createRisk(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/risks/{id}")
    public ResponseEntity<RiskResponseDto> updateRisk(
            @PathVariable Long id,
            @Valid @RequestBody RiskRequestDto request) {
        logger.info("REST request to update risk ID={}", id);
        RiskResponseDto updated = securityComplianceService.updateRisk(id, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/risks/{id}")
    public ResponseEntity<Void> deleteRisk(@PathVariable Long id) {
        logger.info("REST request to delete risk ID={}", id);
        securityComplianceService.deleteRisk(id);
        return ResponseEntity.noContent().build();
    }

    // =========================================================================
    // RISK MITIGATION ACTIONS ENDPOINTS
    // =========================================================================

    @PostMapping("/risks/{id}/mitigations")
    public ResponseEntity<MitigationActionDto> addMitigationAction(
            @PathVariable Long id,
            @Valid @RequestBody MitigationCreateRequestDto request) {
        request.setRiskId(id);
        logger.info("REST request to add mitigation action to risk ID={}", id);
        MitigationActionDto action = securityComplianceService.addMitigationAction(request);
        return new ResponseEntity<>(action, HttpStatus.CREATED);
    }

    @PutMapping("/mitigations/{actionId}")
    public ResponseEntity<MitigationActionDto> updateMitigationAction(
            @PathVariable Long actionId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Integer progress,
            @RequestParam(required = false) String resolution) {
        logger.info("REST request to update mitigation action ID={}", actionId);
        MitigationActionDto updated = securityComplianceService.updateMitigationAction(actionId, status, progress, resolution);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/mitigations/{actionId}")
    public ResponseEntity<Void> deleteMitigationAction(@PathVariable Long actionId) {
        logger.info("REST request to delete mitigation action ID={}", actionId);
        securityComplianceService.deleteMitigationAction(actionId);
        return ResponseEntity.noContent().build();
    }

    // =========================================================================
    // 9 SECURITY DOMAINS ENDPOINTS
    // =========================================================================

    @GetMapping("/controls")
    public ResponseEntity<List<SecurityControlDto>> getSecurityControls(
            @RequestParam(required = false, defaultValue = "ALL") String domain) {
        logger.info("REST request to fetch security controls for domain={}", domain);
        List<SecurityControlDto> controls = securityComplianceService.getSecurityAssessmentControls(domain);
        return ResponseEntity.ok(controls);
    }

    @PutMapping("/controls/{id}")
    public ResponseEntity<SecurityControlDto> updateSecurityControl(
            @PathVariable Long id,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String recommendation) {
        logger.info("REST request to update security control ID={}", id);
        SecurityControlDto updated = securityComplianceService.updateSecurityControl(id, status, recommendation);
        return ResponseEntity.ok(updated);
    }

    // =========================================================================
    // COMPLIANCE MANAGEMENT ENDPOINTS (GDPR, ISO 27001, SOC 2, HIPAA)
    // =========================================================================

    @GetMapping("/compliance/requirements")
    public ResponseEntity<List<ComplianceRequirementDto>> getComplianceRequirements(
            @RequestParam(required = false, defaultValue = "ALL") String framework) {
        logger.info("REST request to fetch compliance requirements for framework={}", framework);
        List<ComplianceRequirementDto> reqs = securityComplianceService.getComplianceRequirements(framework);
        return ResponseEntity.ok(reqs);
    }

    @PutMapping("/compliance/requirements/{id}")
    public ResponseEntity<ComplianceRequirementDto> updateComplianceRequirement(
            @PathVariable Long id,
            @Valid @RequestBody ComplianceUpdateRequestDto request) {
        logger.info("REST request to update compliance requirement ID={}", id);
        ComplianceRequirementDto updated = securityComplianceService.updateComplianceRequirement(id, request);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/compliance/summaries")
    public ResponseEntity<List<ComplianceFrameworkSummaryDto>> getComplianceFrameworkSummaries() {
        logger.info("REST request to fetch compliance framework summaries");
        List<ComplianceFrameworkSummaryDto> summaries = securityComplianceService.getComplianceFrameworkSummaries();
        return ResponseEntity.ok(summaries);
    }
}

