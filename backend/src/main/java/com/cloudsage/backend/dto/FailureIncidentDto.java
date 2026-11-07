package com.cloudsage.backend.dto;

import java.time.LocalDateTime;

public class FailureIncidentDto {

    private Long id;
    private String workloadName;
    private Long workloadStatusId;
    private String migrationWave;
    private String failureCategory;
    private String failureReason;
    private String errorDetails;
    private String recommendedCorrectiveAction;
    private String troubleshootingNotes;
    private String recoveryStatus;
    private Integer retryCount;
    private LocalDateTime lastRetriedAt;
    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;

    public FailureIncidentDto() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getWorkloadName() {
        return workloadName;
    }

    public void setWorkloadName(String workloadName) {
        this.workloadName = workloadName;
    }

    public Long getWorkloadStatusId() {
        return workloadStatusId;
    }

    public void setWorkloadStatusId(Long workloadStatusId) {
        this.workloadStatusId = workloadStatusId;
    }

    public String getMigrationWave() {
        return migrationWave;
    }

    public void setMigrationWave(String migrationWave) {
        this.migrationWave = migrationWave;
    }

    public String getFailureCategory() {
        return failureCategory;
    }

    public void setFailureCategory(String failureCategory) {
        this.failureCategory = failureCategory;
    }

    public String getFailureReason() {
        return failureReason;
    }

    public void setFailureReason(String failureReason) {
        this.failureReason = failureReason;
    }

    public String getErrorDetails() {
        return errorDetails;
    }

    public void setErrorDetails(String errorDetails) {
        this.errorDetails = errorDetails;
    }

    public String getRecommendedCorrectiveAction() {
        return recommendedCorrectiveAction;
    }

    public void setRecommendedCorrectiveAction(String recommendedCorrectiveAction) {
        this.recommendedCorrectiveAction = recommendedCorrectiveAction;
    }

    public String getTroubleshootingNotes() {
        return troubleshootingNotes;
    }

    public void setTroubleshootingNotes(String troubleshootingNotes) {
        this.troubleshootingNotes = troubleshootingNotes;
    }

    public String getRecoveryStatus() {
        return recoveryStatus;
    }

    public void setRecoveryStatus(String recoveryStatus) {
        this.recoveryStatus = recoveryStatus;
    }

    public Integer getRetryCount() {
        return retryCount;
    }

    public void setRetryCount(Integer retryCount) {
        this.retryCount = retryCount;
    }

    public LocalDateTime getLastRetriedAt() {
        return lastRetriedAt;
    }

    public void setLastRetriedAt(LocalDateTime lastRetriedAt) {
        this.lastRetriedAt = lastRetriedAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getResolvedAt() {
        return resolvedAt;
    }

    public void setResolvedAt(LocalDateTime resolvedAt) {
        this.resolvedAt = resolvedAt;
    }
}

