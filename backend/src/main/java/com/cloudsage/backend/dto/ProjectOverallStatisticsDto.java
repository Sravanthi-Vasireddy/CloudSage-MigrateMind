package com.cloudsage.backend.dto;

public class ProjectOverallStatisticsDto {

    private String projectName;
    private String clientName;
    private String selectedProvider;

    // Stage 3 Inventory
    private Integer totalServersCount;
    private Integer totalCpuCores;
    private Integer totalRamGB;
    private Integer totalStorageGB;
    private Integer totalDatabasesCount;

    // Stage 4 Assessment
    private Integer totalWorkloadsAssessed;
    private Integer rehostCount;
    private Integer replatformCount;
    private Integer refactorCount;
    private Integer repurchaseCount;
    private Integer retireCount;
    private Integer retainCount;

    // Stage 5 Architecture
    private Boolean architectureReady;
    private String targetVpcCidr;
    private String primaryComputePlatform;
    private String primaryDatabasePlatform;

    // Stage 6 FinOps
    private Double onPremisesMonthlyCost;
    private Double estimatedCloudMonthlyCost;
    private Double estimatedAnnualSavings;
    private Double savingsPercentage;
    private Double fiveYearRoiPercentage;
    private Double paybackPeriodMonths;

    // Stage 7 Timeline & Execution
    private Integer totalWaves;
    private Integer totalTasks;
    private Double migrationProgressPercentage;
    private String plannedDuration;

    // Stage 8 Security & Compliance
    private Integer totalRisksIdentified;
    private Integer criticalRisksCount;
    private Integer highRisksCount;
    private Double complianceReadinessPercentage;
    private Integer passedSecurityControlsCount;
    private Integer totalSecurityControlsCount;

    // Stage 9 Monitoring & Validation
    private Integer passedValidationsCount;
    private Integer failedValidationsCount;
    private Integer activeFailureIncidentsCount;
    private String overallMigrationHealth;

    // Consolidated Readiness Score
    private Double overallProjectReadinessScore; // 0.0 - 100.0%

    public ProjectOverallStatisticsDto() {
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public String getClientName() {
        return clientName;
    }

    public void setClientName(String clientName) {
        this.clientName = clientName;
    }

    public String getSelectedProvider() {
        return selectedProvider;
    }

    public void setSelectedProvider(String selectedProvider) {
        this.selectedProvider = selectedProvider;
    }

    public Integer getTotalServersCount() {
        return totalServersCount;
    }

    public void setTotalServersCount(Integer totalServersCount) {
        this.totalServersCount = totalServersCount;
    }

    public Integer getTotalCpuCores() {
        return totalCpuCores;
    }

    public void setTotalCpuCores(Integer totalCpuCores) {
        this.totalCpuCores = totalCpuCores;
    }

    public Integer getTotalRamGB() {
        return totalRamGB;
    }

    public void setTotalRamGB(Integer totalRamGB) {
        this.totalRamGB = totalRamGB;
    }

    public Integer getTotalStorageGB() {
        return totalStorageGB;
    }

    public void setTotalStorageGB(Integer totalStorageGB) {
        this.totalStorageGB = totalStorageGB;
    }

    public Integer getTotalDatabasesCount() {
        return totalDatabasesCount;
    }

    public void setTotalDatabasesCount(Integer totalDatabasesCount) {
        this.totalDatabasesCount = totalDatabasesCount;
    }

    public Integer getTotalWorkloadsAssessed() {
        return totalWorkloadsAssessed;
    }

    public void setTotalWorkloadsAssessed(Integer totalWorkloadsAssessed) {
        this.totalWorkloadsAssessed = totalWorkloadsAssessed;
    }

    public Integer getRehostCount() {
        return rehostCount;
    }

    public void setRehostCount(Integer rehostCount) {
        this.rehostCount = rehostCount;
    }

    public Integer getReplatformCount() {
        return replatformCount;
    }

    public void setReplatformCount(Integer replatformCount) {
        this.replatformCount = replatformCount;
    }

    public Integer getRefactorCount() {
        return refactorCount;
    }

    public void setRefactorCount(Integer refactorCount) {
        this.refactorCount = refactorCount;
    }

    public Integer getRepurchaseCount() {
        return repurchaseCount;
    }

    public void setRepurchaseCount(Integer repurchaseCount) {
        this.repurchaseCount = repurchaseCount;
    }

    public Integer getRetireCount() {
        return retireCount;
    }

    public void setRetireCount(Integer retireCount) {
        this.retireCount = retireCount;
    }

    public Integer getRetainCount() {
        return retainCount;
    }

    public void setRetainCount(Integer retainCount) {
        this.retainCount = retainCount;
    }

    public Boolean getArchitectureReady() {
        return architectureReady;
    }

    public void setArchitectureReady(Boolean architectureReady) {
        this.architectureReady = architectureReady;
    }

    public String getTargetVpcCidr() {
        return targetVpcCidr;
    }

    public void setTargetVpcCidr(String targetVpcCidr) {
        this.targetVpcCidr = targetVpcCidr;
    }

    public String getPrimaryComputePlatform() {
        return primaryComputePlatform;
    }

    public void setPrimaryComputePlatform(String primaryComputePlatform) {
        this.primaryComputePlatform = primaryComputePlatform;
    }

    public String getPrimaryDatabasePlatform() {
        return primaryDatabasePlatform;
    }

    public void setPrimaryDatabasePlatform(String primaryDatabasePlatform) {
        this.primaryDatabasePlatform = primaryDatabasePlatform;
    }

    public Double getOnPremisesMonthlyCost() {
        return onPremisesMonthlyCost;
    }

    public void setOnPremisesMonthlyCost(Double onPremisesMonthlyCost) {
        this.onPremisesMonthlyCost = onPremisesMonthlyCost;
    }

    public Double getEstimatedCloudMonthlyCost() {
        return estimatedCloudMonthlyCost;
    }

    public void setEstimatedCloudMonthlyCost(Double estimatedCloudMonthlyCost) {
        this.estimatedCloudMonthlyCost = estimatedCloudMonthlyCost;
    }

    public Double getEstimatedAnnualSavings() {
        return estimatedAnnualSavings;
    }

    public void setEstimatedAnnualSavings(Double estimatedAnnualSavings) {
        this.estimatedAnnualSavings = estimatedAnnualSavings;
    }

    public Double getSavingsPercentage() {
        return savingsPercentage;
    }

    public void setSavingsPercentage(Double savingsPercentage) {
        this.savingsPercentage = savingsPercentage;
    }

    public Double getFiveYearRoiPercentage() {
        return fiveYearRoiPercentage;
    }

    public void setFiveYearRoiPercentage(Double fiveYearRoiPercentage) {
        this.fiveYearRoiPercentage = fiveYearRoiPercentage;
    }

    public Double getPaybackPeriodMonths() {
        return paybackPeriodMonths;
    }

    public void setPaybackPeriodMonths(Double paybackPeriodMonths) {
        this.paybackPeriodMonths = paybackPeriodMonths;
    }

    public Integer getTotalWaves() {
        return totalWaves;
    }

    public void setTotalWaves(Integer totalWaves) {
        this.totalWaves = totalWaves;
    }

    public Integer getTotalTasks() {
        return totalTasks;
    }

    public void setTotalTasks(Integer totalTasks) {
        this.totalTasks = totalTasks;
    }

    public Double getMigrationProgressPercentage() {
        return migrationProgressPercentage;
    }

    public void setMigrationProgressPercentage(Double migrationProgressPercentage) {
        this.migrationProgressPercentage = migrationProgressPercentage;
    }

    public String getPlannedDuration() {
        return plannedDuration;
    }

    public void setPlannedDuration(String plannedDuration) {
        this.plannedDuration = plannedDuration;
    }

    public Integer getTotalRisksIdentified() {
        return totalRisksIdentified;
    }

    public void setTotalRisksIdentified(Integer totalRisksIdentified) {
        this.totalRisksIdentified = totalRisksIdentified;
    }

    public Integer getCriticalRisksCount() {
        return criticalRisksCount;
    }

    public void setCriticalRisksCount(Integer criticalRisksCount) {
        this.criticalRisksCount = criticalRisksCount;
    }

    public Integer getHighRisksCount() {
        return highRisksCount;
    }

    public void setHighRisksCount(Integer highRisksCount) {
        this.highRisksCount = highRisksCount;
    }

    public Double getComplianceReadinessPercentage() {
        return complianceReadinessPercentage;
    }

    public void setComplianceReadinessPercentage(Double complianceReadinessPercentage) {
        this.complianceReadinessPercentage = complianceReadinessPercentage;
    }

    public Integer getPassedSecurityControlsCount() {
        return passedSecurityControlsCount;
    }

    public void setPassedSecurityControlsCount(Integer passedSecurityControlsCount) {
        this.passedSecurityControlsCount = passedSecurityControlsCount;
    }

    public Integer getTotalSecurityControlsCount() {
        return totalSecurityControlsCount;
    }

    public void setTotalSecurityControlsCount(Integer totalSecurityControlsCount) {
        this.totalSecurityControlsCount = totalSecurityControlsCount;
    }

    public Integer getPassedValidationsCount() {
        return passedValidationsCount;
    }

    public void setPassedValidationsCount(Integer passedValidationsCount) {
        this.passedValidationsCount = passedValidationsCount;
    }

    public Integer getFailedValidationsCount() {
        return failedValidationsCount;
    }

    public void setFailedValidationsCount(Integer failedValidationsCount) {
        this.failedValidationsCount = failedValidationsCount;
    }

    public Integer getActiveFailureIncidentsCount() {
        return activeFailureIncidentsCount;
    }

    public void setActiveFailureIncidentsCount(Integer activeFailureIncidentsCount) {
        this.activeFailureIncidentsCount = activeFailureIncidentsCount;
    }

    public String getOverallMigrationHealth() {
        return overallMigrationHealth;
    }

    public void setOverallMigrationHealth(String overallMigrationHealth) {
        this.overallMigrationHealth = overallMigrationHealth;
    }

    public Double getOverallProjectReadinessScore() {
        return overallProjectReadinessScore;
    }

    public void setOverallProjectReadinessScore(Double overallProjectReadinessScore) {
        this.overallProjectReadinessScore = overallProjectReadinessScore;
    }
}

