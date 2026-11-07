package com.cloudsage.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "migration_risks")
public class MigrationRisk {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Risk ID is required")
    @Column(name = "risk_id", nullable = false, length = 30)
    private String riskId;

    @NotBlank(message = "Risk title is required")
    @Column(name = "risk_title", nullable = false, length = 200)
    private String riskTitle;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @NotBlank(message = "Category is required")
    @Column(name = "category", nullable = false, length = 50)
    private String category; // DATA_LOSS, DOWNTIME, NETWORK, COMPATIBILITY, PERFORMANCE, DATABASE, COST, DEPENDENCY, SECURITY

    @Column(name = "affected_workload", length = 150)
    private String affectedWorkload;

    @NotNull
    @Min(1)
    @Max(5)
    @Column(name = "probability", nullable = false)
    private Integer probability = 3; // 1 to 5

    @NotNull
    @Min(1)
    @Max(5)
    @Column(name = "impact", nullable = false)
    private Integer impact = 3; // 1 to 5

    @NotNull
    @Column(name = "risk_score", nullable = false)
    private Integer riskScore = 9; // probability * impact (1 to 25)

    @NotBlank
    @Column(name = "severity", nullable = false, length = 20)
    private String severity = "MEDIUM"; // CRITICAL (16-25), HIGH (10-15), MEDIUM (5-9), LOW (1-4)

    @Column(name = "owner", length = 100)
    private String owner = "Unassigned";

    @Column(name = "mitigation_plan", columnDefinition = "TEXT")
    private String mitigationPlan;

    @Column(name = "status", nullable = false, length = 30)
    private String status = "OPEN"; // OPEN, IN_MITIGATION, RESOLVED, ACCEPTED

    @Column(name = "mitigation_progress")
    private Integer mitigationProgress = 0; // 0 to 100

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public MigrationRisk() {
    }

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        this.updatedAt = LocalDateTime.now();
        recalculateScoreAndSeverity();
        if (this.status == null) {
            this.status = "OPEN";
        }
        if (this.mitigationProgress == null) {
            this.mitigationProgress = 0;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
        recalculateScoreAndSeverity();
    }

    public void recalculateScoreAndSeverity() {
        int prob = this.probability != null ? this.probability : 3;
        int imp = this.impact != null ? this.impact : 3;
        this.riskScore = prob * imp;

        if (this.riskScore >= 16) {
            this.severity = "CRITICAL";
        } else if (this.riskScore >= 10) {
            this.severity = "HIGH";
        } else if (this.riskScore >= 5) {
            this.severity = "MEDIUM";
        } else {
            this.severity = "LOW";
        }
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRiskId() {
        return riskId;
    }

    public void setRiskId(String riskId) {
        this.riskId = riskId;
    }

    public String getRiskTitle() {
        return riskTitle;
    }

    public void setRiskTitle(String riskTitle) {
        this.riskTitle = riskTitle;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getAffectedWorkload() {
        return affectedWorkload;
    }

    public void setAffectedWorkload(String affectedWorkload) {
        this.affectedWorkload = affectedWorkload;
    }

    public Integer getProbability() {
        return probability;
    }

    public void setProbability(Integer probability) {
        this.probability = probability;
        recalculateScoreAndSeverity();
    }

    public Integer getImpact() {
        return impact;
    }

    public void setImpact(Integer impact) {
        this.impact = impact;
        recalculateScoreAndSeverity();
    }

    public Integer getRiskScore() {
        return riskScore;
    }

    public void setRiskScore(Integer riskScore) {
        this.riskScore = riskScore;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public String getMitigationPlan() {
        return mitigationPlan;
    }

    public void setMitigationPlan(String mitigationPlan) {
        this.mitigationPlan = mitigationPlan;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getMitigationProgress() {
        return mitigationProgress;
    }

    public void setMitigationProgress(Integer mitigationProgress) {
        this.mitigationProgress = mitigationProgress;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}

