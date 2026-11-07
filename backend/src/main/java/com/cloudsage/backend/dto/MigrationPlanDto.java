package com.cloudsage.backend.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class MigrationPlanDto {

    private Long id;
    private String planName;
    private String cloudProvider;
    private String status;
    private Integer totalWorkloads;
    private Integer completedWorkloads;
    private Double overallProgressPercentage;
    private LocalDate startDate;
    private LocalDate targetCompletionDate;
    private String notes;
    private List<MigrationWaveDto> waves;
    private List<MigrationTaskDto> tasks;
    private MigrationProgressSummaryDto summary;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public MigrationPlanDto() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPlanName() {
        return planName;
    }

    public void setPlanName(String planName) {
        this.planName = planName;
    }

    public String getCloudProvider() {
        return cloudProvider;
    }

    public void setCloudProvider(String cloudProvider) {
        this.cloudProvider = cloudProvider;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getTotalWorkloads() {
        return totalWorkloads;
    }

    public void setTotalWorkloads(Integer totalWorkloads) {
        this.totalWorkloads = totalWorkloads;
    }

    public Integer getCompletedWorkloads() {
        return completedWorkloads;
    }

    public void setCompletedWorkloads(Integer completedWorkloads) {
        this.completedWorkloads = completedWorkloads;
    }

    public Double getOverallProgressPercentage() {
        return overallProgressPercentage;
    }

    public void setOverallProgressPercentage(Double overallProgressPercentage) {
        this.overallProgressPercentage = overallProgressPercentage;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getTargetCompletionDate() {
        return targetCompletionDate;
    }

    public void setTargetCompletionDate(LocalDate targetCompletionDate) {
        this.targetCompletionDate = targetCompletionDate;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public List<MigrationWaveDto> getWaves() {
        return waves;
    }

    public void setWaves(List<MigrationWaveDto> waves) {
        this.waves = waves;
    }

    public List<MigrationTaskDto> getTasks() {
        return tasks;
    }

    public void setTasks(List<MigrationTaskDto> tasks) {
        this.tasks = tasks;
    }

    public MigrationProgressSummaryDto getSummary() {
        return summary;
    }

    public void setSummary(MigrationProgressSummaryDto summary) {
        this.summary = summary;
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

