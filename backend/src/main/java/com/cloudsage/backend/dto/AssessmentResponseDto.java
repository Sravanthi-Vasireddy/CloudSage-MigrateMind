package com.cloudsage.backend.dto;

import com.cloudsage.backend.entity.WorkloadAssessment;
import java.time.LocalDateTime;

public class AssessmentResponseDto {

    private Long id;
    private Long infrastructureId;
    private String workloadName;
    private String applicationName;
    private String serverName;
    private String operatingSystem;
    private Integer cpuCores;
    private Integer ramGB;
    private Integer storageGB;
    private String databaseType;
    private String environment;
    private String businessCriticality;
    private Integer infrastructureComplexity;
    private Integer applicationDependencies;
    private String performanceRequirements;
    private String scalabilityRequirements;
    private String securityRequirements;
    private String migrationComplexity;
    private String recommendedStrategy;
    private String selectedStrategy;
    private Boolean isOverridden;
    private String overrideReason;
    private String recommendationRationale;
    private String risks;
    private String dependencies;
    private String suggestedActions;
    private Integer readinessScore;
    private Integer estimatedEffortWeeks;
    private LocalDateTime assessedAt;
    private LocalDateTime updatedAt;

    public AssessmentResponseDto() {
    }

    public static AssessmentResponseDto fromEntity(WorkloadAssessment entity) {
        if (entity == null) {
            return null;
        }
        AssessmentResponseDto dto = new AssessmentResponseDto();
        dto.setId(entity.getId());
        dto.setInfrastructureId(entity.getInfrastructureId());
        dto.setWorkloadName(entity.getWorkloadName());
        dto.setApplicationName(entity.getApplicationName());
        dto.setServerName(entity.getServerName());
        dto.setOperatingSystem(entity.getOperatingSystem());
        dto.setCpuCores(entity.getCpuCores());
        dto.setRamGB(entity.getRamGB());
        dto.setStorageGB(entity.getStorageGB());
        dto.setDatabaseType(entity.getDatabaseType());
        dto.setEnvironment(entity.getEnvironment());
        dto.setBusinessCriticality(entity.getBusinessCriticality());
        dto.setInfrastructureComplexity(entity.getInfrastructureComplexity());
        dto.setApplicationDependencies(entity.getApplicationDependencies());
        dto.setPerformanceRequirements(entity.getPerformanceRequirements());
        dto.setScalabilityRequirements(entity.getScalabilityRequirements());
        dto.setSecurityRequirements(entity.getSecurityRequirements());
        dto.setMigrationComplexity(entity.getMigrationComplexity());
        dto.setRecommendedStrategy(entity.getRecommendedStrategy());
        dto.setSelectedStrategy(entity.getSelectedStrategy());
        dto.setIsOverridden(entity.getIsOverridden());
        dto.setOverrideReason(entity.getOverrideReason());
        dto.setRecommendationRationale(entity.getRecommendationRationale());
        dto.setRisks(entity.getRisks());
        dto.setDependencies(entity.getDependencies());
        dto.setSuggestedActions(entity.getSuggestedActions());
        dto.setReadinessScore(entity.getReadinessScore());
        dto.setEstimatedEffortWeeks(entity.getEstimatedEffortWeeks());
        dto.setAssessedAt(entity.getAssessedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        return dto;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getInfrastructureId() {
        return infrastructureId;
    }

    public void setInfrastructureId(Long infrastructureId) {
        this.infrastructureId = infrastructureId;
    }

    public String getWorkloadName() {
        return workloadName;
    }

    public void setWorkloadName(String workloadName) {
        this.workloadName = workloadName;
    }

    public String getApplicationName() {
        return applicationName;
    }

    public void setApplicationName(String applicationName) {
        this.applicationName = applicationName;
    }

    public String getServerName() {
        return serverName;
    }

    public void setServerName(String serverName) {
        this.serverName = serverName;
    }

    public String getOperatingSystem() {
        return operatingSystem;
    }

    public void setOperatingSystem(String operatingSystem) {
        this.operatingSystem = operatingSystem;
    }

    public Integer getCpuCores() {
        return cpuCores;
    }

    public void setCpuCores(Integer cpuCores) {
        this.cpuCores = cpuCores;
    }

    public Integer getRamGB() {
        return ramGB;
    }

    public void setRamGB(Integer ramGB) {
        this.ramGB = ramGB;
    }

    public Integer getStorageGB() {
        return storageGB;
    }

    public void setStorageGB(Integer storageGB) {
        this.storageGB = storageGB;
    }

    public String getDatabaseType() {
        return databaseType;
    }

    public void setDatabaseType(String databaseType) {
        this.databaseType = databaseType;
    }

    public String getEnvironment() {
        return environment;
    }

    public void setEnvironment(String environment) {
        this.environment = environment;
    }

    public String getBusinessCriticality() {
        return businessCriticality;
    }

    public void setBusinessCriticality(String businessCriticality) {
        this.businessCriticality = businessCriticality;
    }

    public Integer getInfrastructureComplexity() {
        return infrastructureComplexity;
    }

    public void setInfrastructureComplexity(Integer infrastructureComplexity) {
        this.infrastructureComplexity = infrastructureComplexity;
    }

    public Integer getApplicationDependencies() {
        return applicationDependencies;
    }

    public void setApplicationDependencies(Integer applicationDependencies) {
        this.applicationDependencies = applicationDependencies;
    }

    public String getPerformanceRequirements() {
        return performanceRequirements;
    }

    public void setPerformanceRequirements(String performanceRequirements) {
        this.performanceRequirements = performanceRequirements;
    }

    public String getScalabilityRequirements() {
        return scalabilityRequirements;
    }

    public void setScalabilityRequirements(String scalabilityRequirements) {
        this.scalabilityRequirements = scalabilityRequirements;
    }

    public String getSecurityRequirements() {
        return securityRequirements;
    }

    public void setSecurityRequirements(String securityRequirements) {
        this.securityRequirements = securityRequirements;
    }

    public String getMigrationComplexity() {
        return migrationComplexity;
    }

    public void setMigrationComplexity(String migrationComplexity) {
        this.migrationComplexity = migrationComplexity;
    }

    public String getRecommendedStrategy() {
        return recommendedStrategy;
    }

    public void setRecommendedStrategy(String recommendedStrategy) {
        this.recommendedStrategy = recommendedStrategy;
    }

    public String getSelectedStrategy() {
        return selectedStrategy;
    }

    public void setSelectedStrategy(String selectedStrategy) {
        this.selectedStrategy = selectedStrategy;
    }

    public Boolean getIsOverridden() {
        return isOverridden;
    }

    public void setIsOverridden(Boolean isOverridden) {
        this.isOverridden = isOverridden;
    }

    public String getOverrideReason() {
        return overrideReason;
    }

    public void setOverrideReason(String overrideReason) {
        this.overrideReason = overrideReason;
    }

    public String getRecommendationRationale() {
        return recommendationRationale;
    }

    public void setRecommendationRationale(String recommendationRationale) {
        this.recommendationRationale = recommendationRationale;
    }

    public String getRisks() {
        return risks;
    }

    public void setRisks(String risks) {
        this.risks = risks;
    }

    public String getDependencies() {
        return dependencies;
    }

    public void setDependencies(String dependencies) {
        this.dependencies = dependencies;
    }

    public String getSuggestedActions() {
        return suggestedActions;
    }

    public void setSuggestedActions(String suggestedActions) {
        this.suggestedActions = suggestedActions;
    }

    public Integer getReadinessScore() {
        return readinessScore;
    }

    public void setReadinessScore(Integer readinessScore) {
        this.readinessScore = readinessScore;
    }

    public Integer getEstimatedEffortWeeks() {
        return estimatedEffortWeeks;
    }

    public void setEstimatedEffortWeeks(Integer estimatedEffortWeeks) {
        this.estimatedEffortWeeks = estimatedEffortWeeks;
    }

    public LocalDateTime getAssessedAt() {
        return assessedAt;
    }

    public void setAssessedAt(LocalDateTime assessedAt) {
        this.assessedAt = assessedAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}

