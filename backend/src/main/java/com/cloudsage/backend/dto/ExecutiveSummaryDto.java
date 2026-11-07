package com.cloudsage.backend.dto;

import java.util.List;
import java.util.Map;

public class ExecutiveSummaryDto {

    private String projectName;
    private String organizationName;
    private String selectedCloudProvider;
    private Integer totalResourcesAssessed;
    private Integer totalWorkloadsCount;
    private Map<String, Integer> migrationStrategyDistribution;
    private Double estimatedMonthlyCost;
    private Double estimatedAnnualCost;
    private Double estimatedAnnualSavings;
    private String migrationTimelineDuration;
    private Double migrationCompletionPercentage;
    private String overallMigrationHealth;
    private List<String> majorRisks;
    private List<String> executiveRecommendations;
    private String generatedDate;

    public ExecutiveSummaryDto() {
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
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

    public Integer getTotalResourcesAssessed() {
        return totalResourcesAssessed;
    }

    public void setTotalResourcesAssessed(Integer totalResourcesAssessed) {
        this.totalResourcesAssessed = totalResourcesAssessed;
    }

    public Integer getTotalWorkloadsCount() {
        return totalWorkloadsCount;
    }

    public void setTotalWorkloadsCount(Integer totalWorkloadsCount) {
        this.totalWorkloadsCount = totalWorkloadsCount;
    }

    public Map<String, Integer> getMigrationStrategyDistribution() {
        return migrationStrategyDistribution;
    }

    public void setMigrationStrategyDistribution(Map<String, Integer> migrationStrategyDistribution) {
        this.migrationStrategyDistribution = migrationStrategyDistribution;
    }

    public Double getEstimatedMonthlyCost() {
        return estimatedMonthlyCost;
    }

    public void setEstimatedMonthlyCost(Double estimatedMonthlyCost) {
        this.estimatedMonthlyCost = estimatedMonthlyCost;
    }

    public Double getEstimatedAnnualCost() {
        return estimatedAnnualCost;
    }

    public void setEstimatedAnnualCost(Double estimatedAnnualCost) {
        this.estimatedAnnualCost = estimatedAnnualCost;
    }

    public Double getEstimatedAnnualSavings() {
        return estimatedAnnualSavings;
    }

    public void setEstimatedAnnualSavings(Double estimatedAnnualSavings) {
        this.estimatedAnnualSavings = estimatedAnnualSavings;
    }

    public String getMigrationTimelineDuration() {
        return migrationTimelineDuration;
    }

    public void setMigrationTimelineDuration(String migrationTimelineDuration) {
        this.migrationTimelineDuration = migrationTimelineDuration;
    }

    public Double getMigrationCompletionPercentage() {
        return migrationCompletionPercentage;
    }

    public void setMigrationCompletionPercentage(Double migrationCompletionPercentage) {
        this.migrationCompletionPercentage = migrationCompletionPercentage;
    }

    public String getOverallMigrationHealth() {
        return overallMigrationHealth;
    }

    public void setOverallMigrationHealth(String overallMigrationHealth) {
        this.overallMigrationHealth = overallMigrationHealth;
    }

    public List<String> getMajorRisks() {
        return majorRisks;
    }

    public void setMajorRisks(List<String> majorRisks) {
        this.majorRisks = majorRisks;
    }

    public List<String> getExecutiveRecommendations() {
        return executiveRecommendations;
    }

    public void setExecutiveRecommendations(List<String> executiveRecommendations) {
        this.executiveRecommendations = executiveRecommendations;
    }

    public String getGeneratedDate() {
        return generatedDate;
    }

    public void setGeneratedDate(String generatedDate) {
        this.generatedDate = generatedDate;
    }
}

