package com.cloudsage.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "migration_reports")
public class MigrationReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String reportTitle;

    @Column(nullable = false, length = 80)
    private String reportType; // EXECUTIVE_SUMMARY, TECHNICAL_ARCHITECTURE, FINOPS_COST_ANALYSIS, SECURITY_COMPLIANCE, COMPLETE_ENTERPRISE

    @Column(nullable = false, length = 150)
    private String organizationName;

    @Column(nullable = false, length = 30)
    private String selectedCloudProvider; // AWS, AZURE, GCP

    @Column(length = 30)
    private String version = "v2.4 Final";

    @Column(length = 150)
    private String author = "CloudSage MigrateMind Automated Engine & HCLTech CoE";

    @Column(length = 150)
    private String reviewer = "Enterprise Steering Committee & Cloud Governance Board";

    @Column(nullable = false, length = 50)
    private String approvalStatus = "APPROVED"; // APPROVED, UNDER_REVIEW, DRAFT

    @Column(columnDefinition = "LONGTEXT")
    private String summaryContent;

    @Column(columnDefinition = "LONGTEXT")
    private String jsonSectionsData;

    @Column(columnDefinition = "LONGTEXT")
    private String csvContent;

    @Column(nullable = false)
    private LocalDateTime generatedAt = LocalDateTime.now();

    private Integer fileSizeKb = 124;

    public MigrationReport() {
    }

    public MigrationReport(String reportTitle, String reportType, String organizationName,
                           String selectedCloudProvider, String version, String author,
                           String reviewer, String approvalStatus, String summaryContent,
                           String jsonSectionsData, String csvContent, Integer fileSizeKb) {
        this.reportTitle = reportTitle;
        this.reportType = reportType;
        this.organizationName = organizationName;
        this.selectedCloudProvider = selectedCloudProvider;
        this.version = version;
        this.author = author;
        this.reviewer = reviewer;
        this.approvalStatus = approvalStatus;
        this.summaryContent = summaryContent;
        this.jsonSectionsData = jsonSectionsData;
        this.csvContent = csvContent;
        this.fileSizeKb = fileSizeKb != null ? fileSizeKb : 124;
        this.generatedAt = LocalDateTime.now();
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

    public String getSummaryContent() {
        return summaryContent;
    }

    public void setSummaryContent(String summaryContent) {
        this.summaryContent = summaryContent;
    }

    public String getJsonSectionsData() {
        return jsonSectionsData;
    }

    public void setJsonSectionsData(String jsonSectionsData) {
        this.jsonSectionsData = jsonSectionsData;
    }

    public String getCsvContent() {
        return csvContent;
    }

    public void setCsvContent(String csvContent) {
        this.csvContent = csvContent;
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

