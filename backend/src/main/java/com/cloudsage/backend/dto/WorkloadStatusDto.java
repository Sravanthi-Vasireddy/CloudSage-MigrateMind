package com.cloudsage.backend.dto;

import java.time.LocalDateTime;

public class WorkloadStatusDto {

    private Long id;
    private String workloadName;
    private String sourceHost;
    private String targetCloudService;
    private Long migrationWaveId;
    private String waveName;
    private String status;
    private Double completionPercentage;
    private LocalDateTime cutoverTimestamp;
    private LocalDateTime lastValidatedAt;
    private String healthStatus;
    private Double cpuUtilization;
    private Double memoryUtilization;
    private Double storageUtilization;
    private Double uptimePercentage;
    private Integer responseTimeMs;
    private Double networkThroughputMbps;
    private Boolean isSimulated;

    public WorkloadStatusDto() {
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

    public String getSourceHost() {
        return sourceHost;
    }

    public void setSourceHost(String sourceHost) {
        this.sourceHost = sourceHost;
    }

    public String getTargetCloudService() {
        return targetCloudService;
    }

    public void setTargetCloudService(String targetCloudService) {
        this.targetCloudService = targetCloudService;
    }

    public Long getMigrationWaveId() {
        return migrationWaveId;
    }

    public void setMigrationWaveId(Long migrationWaveId) {
        this.migrationWaveId = migrationWaveId;
    }

    public String getWaveName() {
        return waveName;
    }

    public void setWaveName(String waveName) {
        this.waveName = waveName;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Double getCompletionPercentage() {
        return completionPercentage;
    }

    public void setCompletionPercentage(Double completionPercentage) {
        this.completionPercentage = completionPercentage;
    }

    public LocalDateTime getCutoverTimestamp() {
        return cutoverTimestamp;
    }

    public void setCutoverTimestamp(LocalDateTime cutoverTimestamp) {
        this.cutoverTimestamp = cutoverTimestamp;
    }

    public LocalDateTime getLastValidatedAt() {
        return lastValidatedAt;
    }

    public void setLastValidatedAt(LocalDateTime lastValidatedAt) {
        this.lastValidatedAt = lastValidatedAt;
    }

    public String getHealthStatus() {
        return healthStatus;
    }

    public void setHealthStatus(String healthStatus) {
        this.healthStatus = healthStatus;
    }

    public Double getCpuUtilization() {
        return cpuUtilization;
    }

    public void setCpuUtilization(Double cpuUtilization) {
        this.cpuUtilization = cpuUtilization;
    }

    public Double getMemoryUtilization() {
        return memoryUtilization;
    }

    public void setMemoryUtilization(Double memoryUtilization) {
        this.memoryUtilization = memoryUtilization;
    }

    public Double getStorageUtilization() {
        return storageUtilization;
    }

    public void setStorageUtilization(Double storageUtilization) {
        this.storageUtilization = storageUtilization;
    }

    public Double getUptimePercentage() {
        return uptimePercentage;
    }

    public void setUptimePercentage(Double uptimePercentage) {
        this.uptimePercentage = uptimePercentage;
    }

    public Integer getResponseTimeMs() {
        return responseTimeMs;
    }

    public void setResponseTimeMs(Integer responseTimeMs) {
        this.responseTimeMs = responseTimeMs;
    }

    public Double getNetworkThroughputMbps() {
        return networkThroughputMbps;
    }

    public void setNetworkThroughputMbps(Double networkThroughputMbps) {
        this.networkThroughputMbps = networkThroughputMbps;
    }

    public Boolean getIsSimulated() {
        return isSimulated;
    }

    public void setIsSimulated(Boolean simulated) {
        isSimulated = simulated;
    }
}

