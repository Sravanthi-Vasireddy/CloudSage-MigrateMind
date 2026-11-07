package com.cloudsage.backend.dto;

import com.cloudsage.backend.entity.Infrastructure;
import java.time.LocalDateTime;

public class InfrastructureResponseDto {

    private Long id;
    private String workloadName;
    private String applicationName;
    private String serverName;
    private String operatingSystem;
    private Integer cpuCores;
    private Integer ramGB;
    private Integer storageGB;
    private String databaseType;
    private String environment;
    private String businessCriticality;
    private String description;
    private LocalDateTime createdAt;

    public InfrastructureResponseDto() {
    }

    public InfrastructureResponseDto(Long id, String workloadName, String applicationName, String serverName,
                                   String operatingSystem, Integer cpuCores, Integer ramGB, Integer storageGB,
                                   String databaseType, String environment, String businessCriticality,
                                   String description, LocalDateTime createdAt) {
        this.id = id;
        this.workloadName = workloadName;
        this.applicationName = applicationName;
        this.serverName = serverName;
        this.operatingSystem = operatingSystem;
        this.cpuCores = cpuCores;
        this.ramGB = ramGB;
        this.storageGB = storageGB;
        this.databaseType = databaseType;
        this.environment = environment;
        this.businessCriticality = businessCriticality;
        this.description = description;
        this.createdAt = createdAt;
    }

    public static InfrastructureResponseDto fromEntity(Infrastructure entity) {
        if (entity == null) {
            return null;
        }
        return new InfrastructureResponseDto(
                entity.getId(),
                entity.getWorkloadName(),
                entity.getApplicationName(),
                entity.getServerName(),
                entity.getOperatingSystem(),
                entity.getCpuCores(),
                entity.getRamGB(),
                entity.getStorageGB(),
                entity.getDatabaseType(),
                entity.getEnvironment(),
                entity.getBusinessCriticality(),
                entity.getDescription(),
                entity.getCreatedAt()
        );
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

    public String getApplicationName() {
        return applicationName;
    }

    public void setApplicationName(String applicationName) {
        this.applicationName = applicationName;
    }

    public String getServerName() {
        return serverName;
    }

    public void setServerName(String serverName) {
        this.serverName = serverName;
    }

    public String getOperatingSystem() {
        return operatingSystem;
    }

    public void setOperatingSystem(String operatingSystem) {
        this.operatingSystem = operatingSystem;
    }

    public Integer getCpuCores() {
        return cpuCores;
    }

    public void setCpuCores(Integer cpuCores) {
        this.cpuCores = cpuCores;
    }

    public Integer getRamGB() {
        return ramGB;
    }

    public void setRamGB(Integer ramGB) {
        this.ramGB = ramGB;
    }

    public Integer getStorageGB() {
        return storageGB;
    }

    public void setStorageGB(Integer storageGB) {
        this.storageGB = storageGB;
    }

    public String getDatabaseType() {
        return databaseType;
    }

    public void setDatabaseType(String databaseType) {
        this.databaseType = databaseType;
    }

    public String getEnvironment() {
        return environment;
    }

    public void setEnvironment(String environment) {
        this.environment = environment;
    }

    public String getBusinessCriticality() {
        return businessCriticality;
    }

    public void setBusinessCriticality(String businessCriticality) {
        this.businessCriticality = businessCriticality;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

