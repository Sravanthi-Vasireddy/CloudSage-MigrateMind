package com.cloudsage.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "target_architectures")
public class TargetArchitecture {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Cloud provider is required")
    @Column(name = "provider", nullable = false, length = 20)
    private String provider; // AWS, AZURE, GCP

    @NotBlank(message = "Architecture name is required")
    @Column(name = "architecture_name", nullable = false, length = 200)
    private String architectureName;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @NotBlank
    @Column(name = "primary_region", nullable = false, length = 50)
    private String primaryRegion;

    @Column(name = "is_multi_region_dr", nullable = false)
    private Boolean isMultiRegionDR = false;

    @Column(name = "secondary_region", length = 50)
    private String secondaryRegion;

    @NotNull
    @Column(name = "total_compute_cores", nullable = false)
    private Integer totalComputeCores;

    @NotNull
    @Column(name = "total_ram_gb", nullable = false)
    private Integer totalRamGB;

    @NotNull
    @Column(name = "total_storage_gb", nullable = false)
    private Integer totalStorageGB;

    @Column(name = "primary_database_service", length = 100)
    private String primaryDatabaseService;

    @Column(name = "primary_compute_service", length = 100)
    private String primaryComputeService;

    @Column(name = "primary_storage_service", length = 100)
    private String primaryStorageService;

    @Column(name = "primary_network_service", length = 100)
    private String primaryNetworkService;

    @Column(name = "primary_security_service", length = 100)
    private String primarySecurityService;

    @Column(name = "operational_complexity", length = 20)
    private String operationalComplexity; // Low, Medium, High

    @Column(name = "estimated_monthly_baseline")
    private Double estimatedMonthlyBaseline;

    @Lob
    @Column(name = "nodes_json", columnDefinition = "LONGTEXT")
    private String nodesJson;

    @Lob
    @Column(name = "edges_json", columnDefinition = "LONGTEXT")
    private String edgesJson;

    @Lob
    @Column(name = "specs_json", columnDefinition = "LONGTEXT")
    private String specsJson;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public TargetArchitecture() {
    }

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        this.updatedAt = LocalDateTime.now();
        if (this.isMultiRegionDR == null) {
            this.isMultiRegionDR = false;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public String getArchitectureName() {
        return architectureName;
    }

    public void setArchitectureName(String architectureName) {
        this.architectureName = architectureName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPrimaryRegion() {
        return primaryRegion;
    }

    public void setPrimaryRegion(String primaryRegion) {
        this.primaryRegion = primaryRegion;
    }

    public Boolean getIsMultiRegionDR() {
        return isMultiRegionDR;
    }

    public void setIsMultiRegionDR(Boolean isMultiRegionDR) {
        this.isMultiRegionDR = isMultiRegionDR;
    }

    public String getSecondaryRegion() {
        return secondaryRegion;
    }

    public void setSecondaryRegion(String secondaryRegion) {
        this.secondaryRegion = secondaryRegion;
    }

    public Integer getTotalComputeCores() {
        return totalComputeCores;
    }

    public void setTotalComputeCores(Integer totalComputeCores) {
        this.totalComputeCores = totalComputeCores;
    }

    public Integer getTotalRamGB() {
        return totalRamGB;
    }

    public void setTotalRamGB(Integer totalRamGB) {
        this.totalRamGB = totalRamGB;
    }

    public Integer getTotalStorageGB() {
        return totalStorageGB;
    }

    public void setTotalStorageGB(Integer totalStorageGB) {
        this.totalStorageGB = totalStorageGB;
    }

    public String getPrimaryDatabaseService() {
        return primaryDatabaseService;
    }

    public void setPrimaryDatabaseService(String primaryDatabaseService) {
        this.primaryDatabaseService = primaryDatabaseService;
    }

    public String getPrimaryComputeService() {
        return primaryComputeService;
    }

    public void setPrimaryComputeService(String primaryComputeService) {
        this.primaryComputeService = primaryComputeService;
    }

    public String getPrimaryStorageService() {
        return primaryStorageService;
    }

    public void setPrimaryStorageService(String primaryStorageService) {
        this.primaryStorageService = primaryStorageService;
    }

    public String getPrimaryNetworkService() {
        return primaryNetworkService;
    }

    public void setPrimaryNetworkService(String primaryNetworkService) {
        this.primaryNetworkService = primaryNetworkService;
    }

    public String getPrimarySecurityService() {
        return primarySecurityService;
    }

    public void setPrimarySecurityService(String primarySecurityService) {
        this.primarySecurityService = primarySecurityService;
    }

    public String getOperationalComplexity() {
        return operationalComplexity;
    }

    public void setOperationalComplexity(String operationalComplexity) {
        this.operationalComplexity = operationalComplexity;
    }

    public Double getEstimatedMonthlyBaseline() {
        return estimatedMonthlyBaseline;
    }

    public void setEstimatedMonthlyBaseline(Double estimatedMonthlyBaseline) {
        this.estimatedMonthlyBaseline = estimatedMonthlyBaseline;
    }

    public String getNodesJson() {
        return nodesJson;
    }

    public void setNodesJson(String nodesJson) {
        this.nodesJson = nodesJson;
    }

    public String getEdgesJson() {
        return edgesJson;
    }

    public void setEdgesJson(String edgesJson) {
        this.edgesJson = edgesJson;
    }

    public String getSpecsJson() {
        return specsJson;
    }

    public void setSpecsJson(String specsJson) {
        this.specsJson = specsJson;
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

