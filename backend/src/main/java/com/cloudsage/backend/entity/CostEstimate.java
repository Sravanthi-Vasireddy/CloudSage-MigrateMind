package com.cloudsage.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "cost_estimates")
public class CostEstimate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Estimate name is required")
    @Column(name = "estimate_name", nullable = false, length = 150)
    private String estimateName;

    @NotBlank(message = "Cloud provider is required")
    @Column(name = "provider", nullable = false, length = 20)
    private String provider; // AWS, AZURE, GCP

    @NotBlank(message = "Pricing model is required")
    @Column(name = "pricing_model", nullable = false, length = 50)
    private String pricingModel; // ON_DEMAND, ONE_YEAR_COMMITTED, THREE_YEAR_COMMITTED

    @NotNull
    @Column(name = "vm_count", nullable = false)
    private Integer vmCount;

    @NotNull
    @Column(name = "total_cpu_cores", nullable = false)
    private Integer totalCpuCores;

    @NotNull
    @Column(name = "total_ram_gb", nullable = false)
    private Integer totalRamGB;

    @NotNull
    @Column(name = "total_storage_gb", nullable = false)
    private Integer totalStorageGB;

    @NotNull
    @Column(name = "operating_hours_per_month", nullable = false)
    private Integer operatingHoursPerMonth;

    @Column(name = "storage_type", length = 50)
    private String storageType; // STANDARD_SSD, PREMIUM_SSD, INTELLIGENT_TIER

    @Column(name = "is_multi_az_database")
    private Boolean isMultiAzDatabase = true;

    @Column(name = "network_egress_gb")
    private Integer networkEgressGB = 500;

    @NotNull
    @Column(name = "compute_monthly_cost", nullable = false)
    private Double computeMonthlyCost;

    @NotNull
    @Column(name = "storage_monthly_cost", nullable = false)
    private Double storageMonthlyCost;

    @NotNull
    @Column(name = "database_monthly_cost", nullable = false)
    private Double databaseMonthlyCost;

    @NotNull
    @Column(name = "networking_monthly_cost", nullable = false)
    private Double networkingMonthlyCost;

    @NotNull
    @Column(name = "total_monthly_cost", nullable = false)
    private Double totalMonthlyCost;

    @NotNull
    @Column(name = "total_annual_cost", nullable = false)
    private Double totalAnnualCost;

    @Column(name = "on_prem_current_monthly_cost")
    private Double onPremCurrentMonthlyCost;

    @Column(name = "monthly_savings")
    private Double monthlySavings;

    @Column(name = "savings_percentage")
    private Double savingsPercentage;

    @Lob
    @Column(name = "breakdown_json", columnDefinition = "LONGTEXT")
    private String breakdownJson;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public CostEstimate() {
    }

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.isMultiAzDatabase == null) {
            this.isMultiAzDatabase = true;
        }
        if (this.networkEgressGB == null) {
            this.networkEgressGB = 500;
        }
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

    public Double getMonthlySavings() {
        return monthlySavings;
    }

    public void setMonthlySavings(Double monthlySavings) {
        this.monthlySavings = monthlySavings;
    }

    public Double getSavingsPercentage() {
        return savingsPercentage;
    }

    public void setSavingsPercentage(Double savingsPercentage) {
        this.savingsPercentage = savingsPercentage;
    }

    public String getBreakdownJson() {
        return breakdownJson;
    }

    public void setBreakdownJson(String breakdownJson) {
        this.breakdownJson = breakdownJson;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

