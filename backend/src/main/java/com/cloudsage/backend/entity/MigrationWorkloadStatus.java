package com.cloudsage.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "migration_workload_statuses")
public class MigrationWorkloadStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String workloadName;

    @Column(length = 150)
    private String sourceHost;

    @Column(length = 150)
    private String targetCloudService;

    private Long migrationWaveId;

    @Column(length = 100)
    private String waveName;

    @Column(nullable = false, length = 30)
    private String status; // PENDING, IN_PROGRESS, SUCCESSFUL, FAILED

    @Column(nullable = false)
    private Double completionPercentage = 0.0;

    private LocalDateTime cutoverTimestamp;

    private LocalDateTime lastValidatedAt;

    @Column(nullable = false, length = 30)
    private String healthStatus = "HEALTHY"; // HEALTHY, DEGRADED, CRITICAL, UNKNOWN

    // Telemetry metrics
    private Double cpuUtilization = 0.0; // %
    private Double memoryUtilization = 0.0; // %
    private Double storageUtilization = 0.0; // %
    private Double uptimePercentage = 99.9; // %
    private Integer responseTimeMs = 0; // ms
    private Double networkThroughputMbps = 0.0; // MB/s

    @Column(nullable = false)
    private Boolean isSimulated = true;

    public MigrationWorkloadStatus() {
    }

    public MigrationWorkloadStatus(String workloadName, String sourceHost, String targetCloudService,
                                   Long migrationWaveId, String waveName, String status,
                                   Double completionPercentage, String healthStatus,
                                   Double cpuUtilization, Double memoryUtilization,
                                   Double storageUtilization, Double uptimePercentage,
                                   Integer responseTimeMs, Double networkThroughputMbps) {
        this.workloadName = workloadName;
        this.sourceHost = sourceHost;
        this.targetCloudService = targetCloudService;
        this.migrationWaveId = migrationWaveId;
        this.waveName = waveName;
        this.status = status;
        this.completionPercentage = completionPercentage;
        this.healthStatus = healthStatus;
        this.cpuUtilization = cpuUtilization;
        this.memoryUtilization = memoryUtilization;
        this.storageUtilization = storageUtilization;
        this.uptimePercentage = uptimePercentage;
        this.responseTimeMs = responseTimeMs;
        this.networkThroughputMbps = networkThroughputMbps;
        this.isSimulated = true;
        this.lastValidatedAt = LocalDateTime.now();
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

