package com.cloudsage.backend.dto;

import com.cloudsage.backend.entity.TargetArchitecture;
import java.time.LocalDateTime;

public class ArchitectureResponseDto {

    private Long id;
    private String provider;
    private String architectureName;
    private String description;
    private String primaryRegion;
    private Boolean isMultiRegionDR;
    private String secondaryRegion;
    private Integer totalComputeCores;
    private Integer totalRamGB;
    private Integer totalStorageGB;
    private String primaryDatabaseService;
    private String primaryComputeService;
    private String primaryStorageService;
    private String primaryNetworkService;
    private String primarySecurityService;
    private String operationalComplexity;
    private Double estimatedMonthlyBaseline;
    private String nodesJson;
    private String edgesJson;
    private String specsJson;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ArchitectureResponseDto() {
    }

    public static ArchitectureResponseDto fromEntity(TargetArchitecture entity) {
        if (entity == null) {
            return null;
        }
        ArchitectureResponseDto dto = new ArchitectureResponseDto();
        dto.setId(entity.getId());
        dto.setProvider(entity.getProvider());
        dto.setArchitectureName(entity.getArchitectureName());
        dto.setDescription(entity.getDescription());
        dto.setPrimaryRegion(entity.getPrimaryRegion());
        dto.setIsMultiRegionDR(entity.getIsMultiRegionDR());
        dto.setSecondaryRegion(entity.getSecondaryRegion());
        dto.setTotalComputeCores(entity.getTotalComputeCores());
        dto.setTotalRamGB(entity.getTotalRamGB());
        dto.setTotalStorageGB(entity.getTotalStorageGB());
        dto.setPrimaryDatabaseService(entity.getPrimaryDatabaseService());
        dto.setPrimaryComputeService(entity.getPrimaryComputeService());
        dto.setPrimaryStorageService(entity.getPrimaryStorageService());
        dto.setPrimaryNetworkService(entity.getPrimaryNetworkService());
        dto.setPrimarySecurityService(entity.getPrimarySecurityService());
        dto.setOperationalComplexity(entity.getOperationalComplexity());
        dto.setEstimatedMonthlyBaseline(entity.getEstimatedMonthlyBaseline());
        dto.setNodesJson(entity.getNodesJson());
        dto.setEdgesJson(entity.getEdgesJson());
        dto.setSpecsJson(entity.getSpecsJson());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        return dto;
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

