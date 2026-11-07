package com.cloudsage.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class InfrastructureRequestDto {

    @NotBlank(message = "Workload name is required")
    @Size(max = 150, message = "Workload name must not exceed 150 characters")
    private String workloadName;

    @NotBlank(message = "Application name is required")
    @Size(max = 150, message = "Application name must not exceed 150 characters")
    private String applicationName;

    @NotBlank(message = "Server hostname is required")
    @Size(max = 200, message = "Server name must not exceed 200 characters")
    private String serverName;

    @NotBlank(message = "Operating system is required")
    @Size(max = 100, message = "Operating system must not exceed 100 characters")
    private String operatingSystem;

    @NotNull(message = "CPU cores count is required")
    @Min(value = 1, message = "CPU cores must be at least 1")
    private Integer cpuCores;

    @NotNull(message = "RAM in GB is required")
    @Min(value = 1, message = "RAM must be at least 1 GB")
    private Integer ramGB;

    @NotNull(message = "Storage in GB is required")
    @Min(value = 1, message = "Storage must be at least 1 GB")
    private Integer storageGB;

    @Size(max = 80, message = "Database type must not exceed 80 characters")
    private String databaseType;

    @NotBlank(message = "Environment is required")
    @Size(max = 50, message = "Environment must not exceed 50 characters")
    private String environment;

    @NotBlank(message = "Business criticality is required")
    @Size(max = 50, message = "Business criticality must not exceed 50 characters")
    private String businessCriticality;

    private String description;

    public InfrastructureRequestDto() {
    }

    public InfrastructureRequestDto(String workloadName, String applicationName, String serverName,
                                    String operatingSystem, Integer cpuCores, Integer ramGB,
                                    Integer storageGB, String databaseType, String environment,
                                    String businessCriticality, String description) {
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
    }

    // Getters and Setters
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
}

