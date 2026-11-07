package com.cloudsage.backend.dto;

import java.util.List;
import java.util.Map;

public class RiskDashboardSummaryDto {

    private Integer totalRisks;
    private Integer criticalRisks;
    private Integer highRisks;
    private Integer mediumRisks;
    private Integer lowRisks;

    private Integer openRisks;
    private Integer inMitigationRisks;
    private Integer resolvedRisks;
    private Integer acceptedRisks;

    private Double averageRiskScore;
    private Double overallCompliancePercentage;
    private Integer totalSecurityControls;
    private Integer passedSecurityControls;
    private Integer failedSecurityControls;
    private Integer missingSecurityControlsCount;

    private List<ComplianceFrameworkSummaryDto> frameworkSummaries;
    private Map<String, Integer> risksByCategory;
    private Map<String, Integer> risksBySeverity;

    public RiskDashboardSummaryDto() {
    }

    public Integer getTotalRisks() {
        return totalRisks;
    }

    public void setTotalRisks(Integer totalRisks) {
        this.totalRisks = totalRisks;
    }

    public Integer getCriticalRisks() {
        return criticalRisks;
    }

    public void setCriticalRisks(Integer criticalRisks) {
        this.criticalRisks = criticalRisks;
    }

    public Integer getHighRisks() {
        return highRisks;
    }

    public void setHighRisks(Integer highRisks) {
        this.highRisks = highRisks;
    }

    public Integer getMediumRisks() {
        return mediumRisks;
    }

    public void setMediumRisks(Integer mediumRisks) {
        this.mediumRisks = mediumRisks;
    }

    public Integer getLowRisks() {
        return lowRisks;
    }

    public void setLowRisks(Integer lowRisks) {
        this.lowRisks = lowRisks;
    }

    public Integer getOpenRisks() {
        return openRisks;
    }

    public void setOpenRisks(Integer openRisks) {
        this.openRisks = openRisks;
    }

    public Integer getInMitigationRisks() {
        return inMitigationRisks;
    }

    public void setInMitigationRisks(Integer inMitigationRisks) {
        this.inMitigationRisks = inMitigationRisks;
    }

    public Integer getResolvedRisks() {
        return resolvedRisks;
    }

    public void setResolvedRisks(Integer resolvedRisks) {
        this.resolvedRisks = resolvedRisks;
    }

    public Integer getAcceptedRisks() {
        return acceptedRisks;
    }

    public void setAcceptedRisks(Integer acceptedRisks) {
        this.acceptedRisks = acceptedRisks;
    }

    public Double getAverageRiskScore() {
        return averageRiskScore;
    }

    public void setAverageRiskScore(Double averageRiskScore) {
        this.averageRiskScore = averageRiskScore;
    }

    public Double getOverallCompliancePercentage() {
        return overallCompliancePercentage;
    }

    public void setOverallCompliancePercentage(Double overallCompliancePercentage) {
        this.overallCompliancePercentage = overallCompliancePercentage;
    }

    public Integer getTotalSecurityControls() {
        return totalSecurityControls;
    }

    public void setTotalSecurityControls(Integer totalSecurityControls) {
        this.totalSecurityControls = totalSecurityControls;
    }

    public Integer getPassedSecurityControls() {
        return passedSecurityControls;
    }

    public void setPassedSecurityControls(Integer passedSecurityControls) {
        this.passedSecurityControls = passedSecurityControls;
    }

    public Integer getFailedSecurityControls() {
        return failedSecurityControls;
    }

    public void setFailedSecurityControls(Integer failedSecurityControls) {
        this.failedSecurityControls = failedSecurityControls;
    }

    public Integer getMissingSecurityControlsCount() {
        return missingSecurityControlsCount;
    }

    public void setMissingSecurityControlsCount(Integer missingSecurityControlsCount) {
        this.missingSecurityControlsCount = missingSecurityControlsCount;
    }

    public List<ComplianceFrameworkSummaryDto> getFrameworkSummaries() {
        return frameworkSummaries;
    }

    public void setFrameworkSummaries(List<ComplianceFrameworkSummaryDto> frameworkSummaries) {
        this.frameworkSummaries = frameworkSummaries;
    }

    public Map<String, Integer> getRisksByCategory() {
        return risksByCategory;
    }

    public void setTasksByCategory(Map<String, Integer> risksByCategory) {
        this.risksByCategory = risksByCategory;
    }

    public void setRisksByCategory(Map<String, Integer> risksByCategory) {
        this.risksByCategory = risksByCategory;
    }

    public Map<String, Integer> getRisksBySeverity() {
        return risksBySeverity;
    }

    public void setRisksBySeverity(Map<String, Integer> risksBySeverity) {
        this.risksBySeverity = risksBySeverity;
    }
}

