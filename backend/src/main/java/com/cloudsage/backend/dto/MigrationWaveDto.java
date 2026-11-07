package com.cloudsage.backend.dto;

import java.time.LocalDate;
import java.util.List;

public class MigrationWaveDto {

    private Long id;
    private Long migrationPlanId;
    private Integer waveNumber;
    private String waveName;
    private String description;
    private String status;
    private LocalDate startDate;
    private LocalDate endDate;
    private String waveLead;
    private List<String> workloadNames;
    private Double progressPercentage;
    private Integer sortOrder;
    private Integer taskCount;
    private Integer completedTaskCount;
    private List<MigrationTaskDto> tasks;

    public MigrationWaveDto() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getMigrationPlanId() {
        return migrationPlanId;
    }

    public void setMigrationPlanId(Long migrationPlanId) {
        this.migrationPlanId = migrationPlanId;
    }

    public Integer getWaveNumber() {
        return waveNumber;
    }

    public void setWaveNumber(Integer waveNumber) {
        this.waveNumber = waveNumber;
    }

    public String getWaveName() {
        return waveName;
    }

    public void setWaveName(String waveName) {
        this.waveName = waveName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public String getWaveLead() {
        return waveLead;
    }

    public void setWaveLead(String waveLead) {
        this.waveLead = waveLead;
    }

    public List<String> getWorkloadNames() {
        return workloadNames;
    }

    public void setWorkloadNames(List<String> workloadNames) {
        this.workloadNames = workloadNames;
    }

    public Double getProgressPercentage() {
        return progressPercentage;
    }

    public void setProgressPercentage(Double progressPercentage) {
        this.progressPercentage = progressPercentage;
    }

    public Integer getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(Integer sortOrder) {
        this.sortOrder = sortOrder;
    }

    public Integer getTaskCount() {
        return taskCount;
    }

    public void setTaskCount(Integer taskCount) {
        this.taskCount = taskCount;
    }

    public Integer getCompletedTaskCount() {
        return completedTaskCount;
    }

    public void setCompletedTaskCount(Integer completedTaskCount) {
        this.completedTaskCount = completedTaskCount;
    }

    public List<MigrationTaskDto> getTasks() {
        return tasks;
    }

    public void setTasks(List<MigrationTaskDto> tasks) {
        this.tasks = tasks;
    }
}

