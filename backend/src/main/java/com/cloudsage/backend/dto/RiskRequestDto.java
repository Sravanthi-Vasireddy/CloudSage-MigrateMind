package com.cloudsage.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class RiskRequestDto {

    private String riskId;

    @NotBlank(message = "Risk title is required")
    private String riskTitle;

    private String description;

    @NotBlank(message = "Category is required")
    private String category; // DATA_LOSS, DOWNTIME, NETWORK, COMPATIBILITY, PERFORMANCE, DATABASE, COST, DEPENDENCY, SECURITY

    private String affectedWorkload;

    @NotNull
    @Min(1)
    @Max(5)
    private Integer probability = 3;

    @NotNull
    @Min(1)
    @Max(5)
    private Integer impact = 3;

    private String owner = "Unassigned";

    private String mitigationPlan;

    private String status = "OPEN"; // OPEN, IN_MITIGATION, RESOLVED, ACCEPTED

    private Integer mitigationProgress = 0;

    public RiskRequestDto() {
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
}

