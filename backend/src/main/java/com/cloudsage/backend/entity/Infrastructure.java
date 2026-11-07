package com.cloudsage.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

@Entity
@Table(name = "infrastructure")
public class Infrastructure {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Workload name is required")
    @Size(max = 150, message = "Workload name must not exceed 150 characters")
    @Column(name = "workload_name", nullable = false, length = 150)
    private String workloadName;

    @NotBlank(message = "Application name is required")
    @Size(max = 150, message = "Application name must not exceed 150 characters")
    @Column(name = "application_name", nullable = false, length = 150)
    private String applicationName;

    @NotBlank(message = "Server hostname is required")
    @Size(max = 200, message = "Server name must not exceed 200 characters")
    @Column(name = "server_name", nullable = false, length = 200)
    private String serverName;

    @NotBlank(message = "Operating system is required")
    @Size(max = 100, message = "Operating system must not exceed 100 characters")
    @Column(name = "operating_system", nullable = false, length = 100)
    private String operatingSystem;

    @NotNull(message = "CPU cores count is required")
    @Min(value = 1, message = "CPU cores must be at least 1")
    @Column(name = "cpu_cores", nullable = false)
    private Integer cpuCores;

    @NotNull(message = "RAM in GB is required")
    @Min(value = 1, message = "RAM must be at least 1 GB")
    @Column(name = "ram_gb", nullable = false)
    private Integer ramGB;

    @NotNull(message = "Storage in GB is required")
    @Min(value = 1, message = "Storage must be at least 1 GB")
    @Column(name = "storage_gb", nullable = false)
    private Integer storageGB;

    @Size(max = 80, message = "Database type must not exceed 80 characters")
    @Column(name = "database_type", length = 80)
    private String databaseType;

    @NotBlank(message = "Environment is required")
    @Size(max = 50, message = "Environment must not exceed 50 characters")
    @Column(name = "environment", nullable = false, length = 50)
    private String environment;

    @NotBlank(message = "Business criticality is required")
    @Size(max = 50, message = "Business criticality must not exceed 50 characters")
    @Column(name = "business_criticality", nullable = false, length = 50)
    private String businessCriticality;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Infrastructure() {
    }

    public Infrastructure(Long id, String workloadName, String applicationName, String serverName,
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

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }

    // Getters and Setters
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

