package com.cloudsage.backend.dto;

public class ComplianceFrameworkSummaryDto {

    private String framework;
    private String displayName;
    private String description;
    private Integer totalRequirements;
    private Integer compliantCount;
    private Integer nonCompliantCount;
    private Integer needsReviewCount;
    private Double compliancePercentage;
    private String status; // COMPLIANT, MINOR_GAPS, ACTION_REQUIRED

    public ComplianceFrameworkSummaryDto() {
    }

    public String getFramework() {
        return framework;
    }

    public void setFramework(String framework) {
        this.framework = framework;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getTotalRequirements() {
        return totalRequirements;
    }

    public void setTotalRequirements(Integer totalRequirements) {
        this.totalRequirements = totalRequirements;
    }

    public Integer getCompliantCount() {
        return compliantCount;
    }

    public void setCompliantCount(Integer compliantCount) {
        this.compliantCount = compliantCount;
    }

    public Integer getNonCompliantCount() {
        return nonCompliantCount;
    }

    public void setNonCompliantCount(Integer nonCompliantCount) {
        this.nonCompliantCount = nonCompliantCount;
    }

    public Integer getNeedsReviewCount() {
        return needsReviewCount;
    }

    public void setNeedsReviewCount(Integer needsReviewCount) {
        this.needsReviewCount = needsReviewCount;
    }

    public Double getCompliancePercentage() {
        return compliancePercentage;
    }

    public void setCompliancePercentage(Double compliancePercentage) {
        this.compliancePercentage = compliancePercentage;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}

