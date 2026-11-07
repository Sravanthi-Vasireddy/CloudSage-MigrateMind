package com.cloudsage.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CostEstimateRequestDto {

    private String estimateName;

    @NotBlank(message = "Cloud provider is required (AWS, AZURE, GCP)")
    private String provider = "AWS";

    private String pricingModel = "THREE_YEAR_COMMITTED"; // ON_DEMAND, ONE_YEAR_COMMITTED, THREE_YEAR_COMMITTED

    private Integer vmCount = 3;

    private Integer totalCpuCores = 40;

    private Integer totalRamGB = 224;

    private Integer totalStorageGB = 1950;

    private Integer operatingHoursPerMonth = 730;

    private String storageType = "STANDARD_SSD"; // STANDARD_SSD, PREMIUM_SSD, INTELLIGENT_TIER

    private Boolean isMultiAzDatabase = true;

    private Integer networkEgressGB = 500;

    private String notes;

    public CostEstimateRequestDto() {
    }

    public String getEstimateName() {
        return estimateName;
    }

    public void setEstimateName(String estimateName) {
        this.estimateName = estimateName;
    }

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public String getPricingModel() {
        return pricingModel;
    }

    public void setPricingModel(String pricingModel) {
        this.pricingModel = pricingModel;
    }

    public Integer getVmCount() {
        return vmCount;
    }

    public void setVmCount(Integer vmCount) {
        this.vmCount = vmCount;
    }

    public Integer getTotalCpuCores() {
        return totalCpuCores;
    }

    public void setTotalCpuCores(Integer totalCpuCores) {
        this.totalCpuCores = totalCpuCores;
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

    public Integer getOperatingHoursPerMonth() {
        return operatingHoursPerMonth;
    }

    public void setOperatingHoursPerMonth(Integer operatingHoursPerMonth) {
        this.operatingHoursPerMonth = operatingHoursPerMonth;
    }

    public String getStorageType() {
        return storageType;
    }

    public void setStorageType(String storageType) {
        this.storageType = storageType;
    }

    public Boolean getIsMultiAzDatabase() {
        return isMultiAzDatabase;
    }

    public void setIsMultiAzDatabase(Boolean isMultiAzDatabase) {
        this.isMultiAzDatabase = isMultiAzDatabase;
    }

    public Integer getNetworkEgressGB() {
        return networkEgressGB;
    }

    public void setNetworkEgressGB(Integer networkEgressGB) {
        this.networkEgressGB = networkEgressGB;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}

