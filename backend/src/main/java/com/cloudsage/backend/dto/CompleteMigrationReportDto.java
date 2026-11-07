package com.cloudsage.backend.dto;

import java.util.List;
import java.util.Map;

public class CompleteMigrationReportDto {

    private Long id;
    private String reportTitle;
    private String reportType;
    private String organizationName;
    private String selectedCloudProvider;
    private String version;
    private String author;
    private String reviewer;
    private String approvalStatus;
    private String generatedAt;

    private ExecutiveSummaryDto executiveSummary;

    // Stage 3 Infrastructure Summary
    private Map<String, Object> infrastructureSection;

    // Stage 4 6Rs Strategy Summary
    private Map<String, Object> strategySection;

    // Stage 5 Target Architecture Summary
    private Map<String, Object> architectureSection;

    // Stage 6 FinOps Cost Analysis Summary
    private Map<String, Object> costSection;

    // Stage 7 Migration Execution Summary
    private Map<String, Object> executionSection;

    // Stage 8 Security & Compliance Summary
    private Map<String, Object> securitySection;

    // Stage 9 Validation & Telemetry Summary
    private Map<String, Object> validationSection;

    private String statutoryDisclaimer;

    public CompleteMigrationReportDto() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getReportTitle() {
        return reportTitle;
    }

    public void setReportTitle(String reportTitle) {
        this.reportTitle = reportTitle;
    }

    public String getReportType() {
        return reportType;
    }

    public void setReportType(String reportType) {
        this.reportType = reportType;
    }

    public String getOrganizationName() {
        return organizationName;
    }

    public void setOrganizationName(String organizationName) {
        this.organizationName = organizationName;
    }

    public String getSelectedCloudProvider() {
        return selectedCloudProvider;
    }

    public void setSelectedCloudProvider(String selectedCloudProvider) {
        this.selectedCloudProvider = selectedCloudProvider;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getReviewer() {
        return reviewer;
    }

    public void setReviewer(String reviewer) {
        this.reviewer = reviewer;
    }

    public String getApprovalStatus() {
        return approvalStatus;
    }

    public void setApprovalStatus(String approvalStatus) {
        this.approvalStatus = approvalStatus;
    }

    public String getGeneratedAt() {
        return generatedAt;
    }

    public void setGeneratedAt(String generatedAt) {
        this.generatedAt = generatedAt;
    }

    public ExecutiveSummaryDto getExecutiveSummary() {
        return executiveSummary;
    }

    public void setExecutiveSummary(ExecutiveSummaryDto executiveSummary) {
        this.executiveSummary = executiveSummary;
    }

    public Map<String, Object> getInfrastructureSection() {
        return infrastructureSection;
    }

    public void setInfrastructureSection(Map<String, Object> infrastructureSection) {
        this.infrastructureSection = infrastructureSection;
    }

    public Map<String, Object> getStrategySection() {
        return strategySection;
    }

    public void setStrategySection(Map<String, Object> strategySection) {
        this.strategySection = strategySection;
    }

    public Map<String, Object> getArchitectureSection() {
        return architectureSection;
    }

    public void setArchitectureSection(Map<String, Object> architectureSection) {
        this.architectureSection = architectureSection;
    }

    public Map<String, Object> getCostSection() {
        return costSection;
    }

    public void setCostSection(Map<String, Object> costSection) {
        this.costSection = costSection;
    }

    public Map<String, Object> getExecutionSection() {
        return executionSection;
    }

    public void setExecutionSection(Map<String, Object> executionSection) {
        this.executionSection = executionSection;
    }

    public Map<String, Object> getSecuritySection() {
        return securitySection;
    }

    public void setSecuritySection(Map<String, Object> securitySection) {
        this.securitySection = securitySection;
    }

    public Map<String, Object> getValidationSection() {
        return validationSection;
    }

    public void setValidationSection(Map<String, Object> validationSection) {
        this.validationSection = validationSection;
    }

    public String getStatutoryDisclaimer() {
        return statutoryDisclaimer;
    }

    public void setStatutoryDisclaimer(String statutoryDisclaimer) {
        this.statutoryDisclaimer = statutoryDisclaimer;
    }
}

