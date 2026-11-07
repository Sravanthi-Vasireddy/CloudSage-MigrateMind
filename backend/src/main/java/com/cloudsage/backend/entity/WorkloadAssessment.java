package com.cloudsage.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "workload_assessments")
public class WorkloadAssessment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Infrastructure reference ID is required")
    @Column(name = "infrastructure_id", nullable = false)
    private Long infrastructureId;

    @NotBlank(message = "Workload name is required")
    @Column(name = "workload_name", nullable = false, length = 150)
    private String workloadName;

    @NotBlank(message = "Application name is required")
    @Column(name = "application_name", nullable = false, length = 150)
    private String applicationName;

    @NotBlank(message = "Server hostname is required")
    @Column(name = "server_name", nullable = false, length = 200)
    private String serverName;

    @NotBlank(message = "Operating system is required")
    @Column(name = "operating_system", nullable = false, length = 100)
    private String operatingSystem;

    @NotNull
    @Column(name = "cpu_cores", nullable = false)
    private Integer cpuCores;

    @NotNull
    @Column(name = "ram_gb", nullable = false)
    private Integer ramGB;

    @NotNull
    @Column(name = "storage_gb", nullable = false)
    private Integer storageGB;

    @Column(name = "database_type", length = 80)
    private String databaseType;

    @NotBlank
    @Column(name = "environment", nullable = false, length = 50)
    private String environment;

    @NotBlank
    @Column(name = "business_criticality", nullable = false, length = 50)
    private String businessCriticality;

    @Min(1)
    @Max(100)
    @Column(name = "infrastructure_complexity", nullable = false)
    private Integer infrastructureComplexity;

    @Min(0)
    @Column(name = "application_dependencies", nullable = false)
    private Integer applicationDependencies;

    @Column(name = "performance_requirements", length = 80)
    private String performanceRequirements;

    @Column(name = "scalability_requirements", length = 80)
    private String scalabilityRequirements;

    @Column(name = "security_requirements", length = 100)
    private String securityRequirements;

    @NotBlank
    @Column(name = "migration_complexity", nullable = false, length = 20)
    private String migrationComplexity; // Low, Medium, High

    @NotBlank
    @Column(name = "recommended_strategy", nullable = false, length = 30)
    private String recommendedStrategy; // Rehost, Replatform, Refactor, Repurchase, Retire, Retain

    @NotBlank
    @Column(name = "selected_strategy", nullable = false, length = 30)
    private String selectedStrategy;

    @Column(name = "is_overridden", nullable = false)
    private Boolean isOverridden = false;

    @Column(name = "override_reason", columnDefinition = "TEXT")
    private String overrideReason;

    @Column(name = "recommendation_rationale", columnDefinition = "TEXT")
    private String recommendationRationale;

    @Column(name = "risks", columnDefinition = "TEXT")
    private String risks;

    @Column(name = "dependencies", columnDefinition = "TEXT")
    private String dependencies;

    @Column(name = "suggested_actions", columnDefinition = "TEXT")
    private String suggestedActions;

    @Min(0)
    @Max(100)
    @Column(name = "readiness_score", nullable = false)
    private Integer readinessScore; // 0 - 100 %

    @Column(name = "estimated_effort_weeks")
    private Integer estimatedEffortWeeks;

    @Column(name = "assessed_at", nullable = false, updatable = false)
    private LocalDateTime assessedAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public WorkloadAssessment() {
    }

    @PrePersist
    protected void onCreate() {
        if (this.assessedAt == null) {
            this.assessedAt = LocalDateTime.now();
        }
        this.updatedAt = LocalDateTime.now();
        if (this.isOverridden == null) {
            this.isOverridden = false;
        }
        if (this.selectedStrategy == null) {
            this.selectedStrategy = this.recommendedStrategy;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
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

