package com.cloudsage.backend.dto;

import java.time.LocalDateTime;
import java.util.Map;

public class CostEstimateResponseDto {

    private Long id;
    private String estimateName;
    private String provider;
    private String pricingModel;
    private String pricingModelLabel;

    // Infrastructure Configuration
    private Integer vmCount;
    private Integer totalCpuCores;
    private Integer totalRamGB;
    private Integer totalStorageGB;
    private Integer operatingHoursPerMonth;
    private String storageType;
    private Boolean isMultiAzDatabase;
    private Integer networkEgressGB;

    // Cost Breakdown
    private Double computeMonthlyCost;
    private Double storageMonthlyCost;
    private Double databaseMonthlyCost;
    private Double networkingMonthlyCost;
    private Double totalMonthlyCost;
    private Double totalAnnualCost;

    // Baseline & Savings
    private Double onPremCurrentMonthlyCost;
    private Double onPremCurrentAnnualCost;
    private Double monthlySavings;
    private Double annualSavings;
    private Double savingsPercentage;

    // Financial Metrics
    private Double fiveYearRoiPercentage;
    private Double paybackPeriodMonths;
    private Double commitmentDiscountPercentage;

    // Detailed Resource Breakdown
    private Map<String, Object> componentBreakdown;
    private String notes;
    private String pricingDisclaimer;
    private LocalDateTime createdAt;

    public CostEstimateResponseDto() {
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getPricingModelLabel() {
        return pricingModelLabel;
    }

    public void setPricingModelLabel(String pricingModelLabel) {
        this.pricingModelLabel = pricingModelLabel;
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

    public Double getComputeMonthlyCost() {
        return computeMonthlyCost;
    }

    public void setComputeMonthlyCost(Double computeMonthlyCost) {
        this.computeMonthlyCost = computeMonthlyCost;
    }

    public Double getStorageMonthlyCost() {
        return storageMonthlyCost;
    }

    public void setStorageMonthlyCost(Double storageMonthlyCost) {
        this.storageMonthlyCost = storageMonthlyCost;
    }

    public Double getDatabaseMonthlyCost() {
        return databaseMonthlyCost;
    }

    public void setDatabaseMonthlyCost(Double databaseMonthlyCost) {
        this.databaseMonthlyCost = databaseMonthlyCost;
    }

    public Double getNetworkingMonthlyCost() {
        return networkingMonthlyCost;
    }

    public void setNetworkingMonthlyCost(Double networkingMonthlyCost) {
        this.networkingMonthlyCost = networkingMonthlyCost;
    }

    public Double getTotalMonthlyCost() {
        return totalMonthlyCost;
    }

    public void setTotalMonthlyCost(Double totalMonthlyCost) {
        this.totalMonthlyCost = totalMonthlyCost;
    }

    public Double getTotalAnnualCost() {
        return totalAnnualCost;
    }

    public void setTotalAnnualCost(Double totalAnnualCost) {
        this.totalAnnualCost = totalAnnualCost;
    }

    public Double getOnPremCurrentMonthlyCost() {
        return onPremCurrentMonthlyCost;
    }

    public void setOnPremCurrentMonthlyCost(Double onPremCurrentMonthlyCost) {
        this.onPremCurrentMonthlyCost = onPremCurrentMonthlyCost;
    }

    public Double getOnPremCurrentAnnualCost() {
        return onPremCurrentAnnualCost;
    }

    public void setOnPremCurrentAnnualCost(Double onPremCurrentAnnualCost) {
        this.onPremCurrentAnnualCost = onPremCurrentAnnualCost;
    }

    public Double getMonthlySavings() {
        return monthlySavings;
    }

    public void setMonthlySavings(Double monthlySavings) {
        this.monthlySavings = monthlySavings;
    }

    public Double getAnnualSavings() {
        return annualSavings;
    }

    public void setAnnualSavings(Double annualSavings) {
        this.annualSavings = annualSavings;
    }

    public Double getSavingsPercentage() {
        return savingsPercentage;
    }

    public void setSavingsPercentage(Double savingsPercentage) {
        this.savingsPercentage = savingsPercentage;
    }

    public Double getFiveYearRoiPercentage() {
        return fiveYearRoiPercentage;
    }

    public void setFiveYearRoiPercentage(Double fiveYearRoiPercentage) {
        this.fiveYearRoiPercentage = fiveYearRoiPercentage;
    }

    public Double getPaybackPeriodMonths() {
        return paybackPeriodMonths;
    }

    public void setPaybackPeriodMonths(Double paybackPeriodMonths) {
        this.paybackPeriodMonths = paybackPeriodMonths;
    }

    public Double getCommitmentDiscountPercentage() {
        return commitmentDiscountPercentage;
    }

    public void setCommitmentDiscountPercentage(Double commitmentDiscountPercentage) {
        this.commitmentDiscountPercentage = commitmentDiscountPercentage;
    }

    public Map<String, Object> getComponentBreakdown() {
        return componentBreakdown;
    }

    public void setComponentBreakdown(Map<String, Object> componentBreakdown) {
        this.componentBreakdown = componentBreakdown;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getPricingDisclaimer() {
        return pricingDisclaimer;
    }

    public void setPricingDisclaimer(String pricingDisclaimer) {
        this.pricingDisclaimer = pricingDisclaimer;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

