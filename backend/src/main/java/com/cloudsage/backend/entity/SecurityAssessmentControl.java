package com.cloudsage.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Entity
@Table(name = "security_assessment_controls")
public class SecurityAssessmentControl {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(name = "control_id", nullable = false, length = 50)
    private String controlId; // e.g. SEC-IAM-01

    @NotBlank
    @Column(name = "domain", nullable = false, length = 50)
    private String domain; // IAM, RBAC, ENCRYPTION_AT_REST, ENCRYPTION_IN_TRANSIT, NETWORK_SECURITY, FIREWALL, SECURITY_GROUPS, BACKUP_DISASTER_RECOVERY, ACCESS_AUDIT

    @NotBlank
    @Column(name = "control_name", nullable = false, length = 200)
    private String controlName;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "target_cloud_service", length = 100)
    private String targetCloudService;

    @Column(name = "status", nullable = false, length = 30)
    private String status = "PASS"; // PASS, FAIL, WARNING, NOT_APPLICABLE

    @Column(name = "severity", nullable = false, length = 20)
    private String severity = "MEDIUM"; // CRITICAL, HIGH, MEDIUM, LOW

    @Column(name = "is_missing_control")
    private Boolean missingControl = false;

    @Column(name = "recommendation", columnDefinition = "TEXT")
    private String recommendation;

    @Column(name = "terraform_snippet", columnDefinition = "TEXT")
    private String terraformSnippet;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public SecurityAssessmentControl() {
    }

    @PrePersist
    @PreUpdate
    protected void onSave() {
        this.updatedAt = LocalDateTime.now();
        if (this.missingControl == null) {
            this.missingControl = "FAIL".equals(this.status);
        }
    }

    // Getters and Setters
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
        this.missingControl = "FAIL".equals(status);
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

