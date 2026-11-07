package com.cloudsage.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class MitigationCreateRequestDto {

    @NotNull(message = "Risk ID is required")
    private Long riskId;

    @NotBlank(message = "Action title is required")
    private String actionTitle;

    private String assignedTo = "Unassigned";

    private LocalDate dueDate;

    private String status = "NOT_STARTED"; // NOT_STARTED, IN_PROGRESS, COMPLETED

    private Integer progressPercentage = 0;

    private String resolutionDetails;

    private Long linkedMigrationTaskId;

    public MitigationCreateRequestDto() {
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
}

