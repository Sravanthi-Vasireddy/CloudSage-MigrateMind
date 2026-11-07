package com.cloudsage.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class MigrationTaskCreateRequestDto {

    private Long migrationPlanId;

    @NotNull(message = "Wave ID is required")
    private Long waveId;

    private String workloadName;

    @NotBlank(message = "Task title is required")
    private String taskTitle;

    private String description;

    private String assignedTo = "Unassigned";

    private String priority = "MEDIUM"; // CRITICAL, HIGH, MEDIUM, LOW

    private String status = "NOT_STARTED"; // NOT_STARTED, IN_PROGRESS, COMPLETED, BLOCKED

    private LocalDate startDate;

    private LocalDate dueDate;

    private String dependencies;

    private String blockerReason;

    private Double estimatedHours = 8.0;

    private String category = "FOUNDATION";

    public MigrationTaskCreateRequestDto() {
    }

    public Long getMigrationPlanId() {
        return migrationPlanId;
    }

    public void setMigrationPlanId(Long migrationPlanId) {
        this.migrationPlanId = migrationPlanId;
    }

    public Long getWaveId() {
        return waveId;
    }

    public void setWaveId(Long waveId) {
        this.waveId = waveId;
    }

    public String getWorkloadName() {
        return workloadName;
    }

    public void setWorkloadName(String workloadName) {
        this.workloadName = workloadName;
    }

    public String getTaskTitle() {
        return taskTitle;
    }

    public void setTaskTitle(String taskTitle) {
        this.taskTitle = taskTitle;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAssignedTo() {
        return assignedTo;
    }

    public void setAssignedTo(String assignedTo) {
        this.assignedTo = assignedTo;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public String getDependencies() {
        return dependencies;
    }

    public void setDependencies(String dependencies) {
        this.dependencies = dependencies;
    }

    public String getBlockerReason() {
        return blockerReason;
    }

    public void setBlockerReason(String blockerReason) {
        this.blockerReason = blockerReason;
    }

    public Double getEstimatedHours() {
        return estimatedHours;
    }

    public void setEstimatedHours(Double estimatedHours) {
        this.estimatedHours = estimatedHours;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }
}

