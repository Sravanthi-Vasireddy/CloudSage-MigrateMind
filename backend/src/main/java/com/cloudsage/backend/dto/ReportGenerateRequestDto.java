package com.cloudsage.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class ReportGenerateRequestDto {

    @NotBlank(message = "Report title is required")
    private String reportTitle;

    @NotBlank(message = "Report type is required")
    private String reportType; // EXECUTIVE_SUMMARY, TECHNICAL_ARCHITECTURE, FINOPS_COST_ANALYSIS, SECURITY_COMPLIANCE, COMPLETE_ENTERPRISE

    private String organizationName = "Acme Retail Enterprise";

    private String selectedCloudProvider = "AWS";

    private String version = "v2.4 Final";

    private String author = "CloudSage MigrateMind Automated Engine";

    private String reviewer = "Enterprise Steering Committee";

    public ReportGenerateRequestDto() {
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
}

