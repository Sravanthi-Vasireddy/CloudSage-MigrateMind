package com.cloudsage.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "migration_failure_incidents")
public class MigrationFailureIncident {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String workloadName;

    private Long workloadStatusId;

    @Column(length = 100)
    private String migrationWave;

    @Column(nullable = false, length = 100)
    private String failureCategory;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String failureReason;

    @Column(columnDefinition = "TEXT")
    private String errorDetails;

    @Column(columnDefinition = "TEXT")
    private String recommendedCorrectiveAction;

    @Column(columnDefinition = "TEXT")
    private String troubleshootingNotes;

    @Column(nullable = false, length = 30)
    private String recoveryStatus = "OPEN"; // OPEN, INVESTIGATING, RETRY_QUEUED, RESOLVED

    @Column(nullable = false)
    private Integer retryCount = 0;

    private LocalDateTime lastRetriedAt;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime resolvedAt;

    public MigrationFailureIncident() {
    }

    public MigrationFailureIncident(String workloadName, Long workloadStatusId, String migrationWave,
                                    String failureCategory, String failureReason, String errorDetails,
                                    String recommendedCorrectiveAction) {
        this.workloadName = workloadName;
        this.workloadStatusId = workloadStatusId;
        this.migrationWave = migrationWave;
        this.failureCategory = failureCategory;
        this.failureReason = failureReason;
        this.errorDetails = errorDetails;
        this.recommendedCorrectiveAction = recommendedCorrectiveAction;
        this.recoveryStatus = "OPEN";
        this.retryCount = 0;
        this.createdAt = LocalDateTime.now();
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

