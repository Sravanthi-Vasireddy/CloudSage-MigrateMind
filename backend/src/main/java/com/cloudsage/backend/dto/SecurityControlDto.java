package com.cloudsage.backend.dto;

import java.time.LocalDateTime;

public class SecurityControlDto {

    private Long id;
    private String controlId;
    private String domain;
    private String controlName;
    private String description;
    private String targetCloudService;
    private String status; // PASS, FAIL, WARNING, NOT_APPLICABLE
    private String severity; // CRITICAL, HIGH, MEDIUM, LOW
    private Boolean missingControl;
    private String recommendation;
    private String terraformSnippet;
    private LocalDateTime updatedAt;

    public SecurityControlDto() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getControlId() {
        return controlId;
    }

    public void setControlId(String controlId) {
        this.controlId = controlId;
    }

    public String getDomain() {
        return domain;
    }

    public void setDomain(String domain) {
        this.domain = domain;
    }

    public String getControlName() {
        return controlName;
    }

    public void setControlName(String controlName) {
        this.controlName = controlName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getTargetCloudService() {
        return targetCloudService;
    }

    public void setTargetCloudService(String targetCloudService) {
        this.targetCloudService = targetCloudService;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public Boolean getMissingControl() {
        return missingControl;
    }

    public void setMissingControl(Boolean missingControl) {
        this.missingControl = missingControl;
    }

    public String getRecommendation() {
        return recommendation;
    }

    public void setRecommendation(String recommendation) {
        this.recommendation = recommendation;
    }

    public String getTerraformSnippet() {
        return terraformSnippet;
    }

    public void setTerraformSnippet(String terraformSnippet) {
        this.terraformSnippet = terraformSnippet;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}

