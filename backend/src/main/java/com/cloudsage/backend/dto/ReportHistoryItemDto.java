package com.cloudsage.backend.dto;

import java.time.LocalDateTime;

public class ReportHistoryItemDto {

    private Long id;
    private String reportTitle;
    private String reportType;
    private String organizationName;
    private String selectedCloudProvider;
    private String version;
    private String author;
    private String approvalStatus;
    private LocalDateTime generatedAt;
    private Integer fileSizeKb;

    public ReportHistoryItemDto() {
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

    public String getApprovalStatus() {
        return approvalStatus;
    }

    public void setApprovalStatus(String approvalStatus) {
        this.approvalStatus = approvalStatus;
    }

    public LocalDateTime getGeneratedAt() {
        return generatedAt;
    }

    public void setGeneratedAt(LocalDateTime generatedAt) {
        this.generatedAt = generatedAt;
    }

    public Integer getFileSizeKb() {
        return fileSizeKb;
    }

    public void setFileSizeKb(Integer fileSizeKb) {
        this.fileSizeKb = fileSizeKb;
    }
}

