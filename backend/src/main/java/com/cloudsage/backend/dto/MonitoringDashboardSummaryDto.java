package com.cloudsage.backend.dto;

import java.util.List;

public class MonitoringDashboardSummaryDto {

    private Integer totalScheduledWorkloads;
    private Integer successfulMigrations;
    private Integer failedMigrations;
    private Integer inProgressMigrations;
    private Integer pendingMigrations;
    private Double overallCompletionPercentage;
    private List<WaveMigrationProgressDto> waveProgressList;
    private Integer healthyWorkloadsCount;
    private Integer degradedWorkloadsCount;
    private Integer criticalWorkloadsCount;
    private String telemetryNotice;

    public MonitoringDashboardSummaryDto() {
    }

    public Integer getTotalScheduledWorkloads() {
        return totalScheduledWorkloads;
    }

    public void setTotalScheduledWorkloads(Integer totalScheduledWorkloads) {
        this.totalScheduledWorkloads = totalScheduledWorkloads;
    }

    public Integer getSuccessfulMigrations() {
        return successfulMigrations;
    }

    public void setSuccessfulMigrations(Integer successfulMigrations) {
        this.successfulMigrations = successfulMigrations;
    }

    public Integer getFailedMigrations() {
        return failedMigrations;
    }

    public void setFailedMigrations(Integer failedMigrations) {
        this.failedMigrations = failedMigrations;
    }

    public Integer getInProgressMigrations() {
        return inProgressMigrations;
    }

    public void setInProgressMigrations(Integer inProgressMigrations) {
        this.inProgressMigrations = inProgressMigrations;
    }

    public Integer getPendingMigrations() {
        return pendingMigrations;
    }

    public void setPendingMigrations(Integer pendingMigrations) {
        this.pendingMigrations = pendingMigrations;
    }

    public Double getOverallCompletionPercentage() {
        return overallCompletionPercentage;
    }

    public void setOverallCompletionPercentage(Double overallCompletionPercentage) {
        this.overallCompletionPercentage = overallCompletionPercentage;
    }

    public List<WaveMigrationProgressDto> getWaveProgressList() {
        return waveProgressList;
    }

    public void setWaveProgressList(List<WaveMigrationProgressDto> waveProgressList) {
        this.waveProgressList = waveProgressList;
    }

    public Integer getHealthyWorkloadsCount() {
        return healthyWorkloadsCount;
    }

    public void setHealthyWorkloadsCount(Integer healthyWorkloadsCount) {
        this.healthyWorkloadsCount = healthyWorkloadsCount;
    }

    public Integer getDegradedWorkloadsCount() {
        return degradedWorkloadsCount;
    }

    public void setDegradedWorkloadsCount(Integer degradedWorkloadsCount) {
        this.degradedWorkloadsCount = degradedWorkloadsCount;
    }

    public Integer getCriticalWorkloadsCount() {
        return criticalWorkloadsCount;
    }

    public void setCriticalWorkloadsCount(Integer criticalWorkloadsCount) {
        this.criticalWorkloadsCount = criticalWorkloadsCount;
    }

    public String getTelemetryNotice() {
        return telemetryNotice;
    }

    public void setTelemetryNotice(String telemetryNotice) {
        this.telemetryNotice = telemetryNotice;
    }
}

