package com.cloudsage.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

public class RiskResponseDto {

    private Long id;
    private String riskId;
    private String riskTitle;
    private String description;
    private String category;
    private String affectedWorkload;
    private Integer probability;
    private Integer impact;
    private Integer riskScore;
    private String severity;
    private String owner;
    private String mitigationPlan;
    private String status;
    private Integer mitigationProgress;
    private List<MitigationActionDto> mitigationActions;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public RiskResponseDto() {
    }

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
    }

    public Integer getImpact() {
        return impact;
    }

    public void setImpact(Integer impact) {
        this.impact = impact;
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

    public List<MitigationActionDto> getMitigationActions() {
        return mitigationActions;
    }

    public void setMitigationActions(List<MitigationActionDto> mitigationActions) {
        this.mitigationActions = mitigationActions;
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

