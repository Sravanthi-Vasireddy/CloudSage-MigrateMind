package com.cloudsage.backend.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class MitigationActionDto {

    private Long id;
    private Long riskId;
    private String actionTitle;
    private String assignedTo;
    private LocalDate dueDate;
    private String status; // NOT_STARTED, IN_PROGRESS, COMPLETED
    private Integer progressPercentage;
    private String resolutionDetails;
    private Long linkedMigrationTaskId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public MitigationActionDto() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getRiskId() {
        return riskId;
    }

    public void setRiskId(Long riskId) {
        this.riskId = riskId;
    }

    public String getActionTitle() {
        return actionTitle;
    }

    public void setActionTitle(String actionTitle) {
        this.actionTitle = actionTitle;
    }

    public String getAssignedTo() {
        return assignedTo;
    }

    public void setAssignedTo(String assignedTo) {
        this.assignedTo = assignedTo;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getProgressPercentage() {
        return progressPercentage;
    }

    public void setProgressPercentage(Integer progressPercentage) {
        this.progressPercentage = progressPercentage;
    }

    public String getResolutionDetails() {
        return resolutionDetails;
    }

    public void setResolutionDetails(String resolutionDetails) {
        this.resolutionDetails = resolutionDetails;
    }

    public Long getLinkedMigrationTaskId() {
        return linkedMigrationTaskId;
    }

    public void setLinkedMigrationTaskId(Long linkedMigrationTaskId) {
        this.linkedMigrationTaskId = linkedMigrationTaskId;
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

