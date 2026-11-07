package com.cloudsage.backend.dto;

import java.util.List;
import java.util.Map;

public class ProviderCostComparisonDto {

    private String pricingModel;
    private String pricingModelLabel;
    private Double onPremMonthlyCost;
    private Double onPremAnnualCost;
    private String recommendedProvider;
    private String recommendationReason;
    private String pricingDisclaimer;

    // Sizing Baseline
    private Integer totalCpuCores;
    private Integer totalRamGB;
    private Integer totalStorageGB;
    private Integer vmCount;

    // Provider Details
    private List<ProviderDetailDto> providers;

    public ProviderCostComparisonDto() {
    }

    public static class ProviderDetailDto {
        private String provider; // AWS, AZURE, GCP
        private String displayName;
        private Double monthlyTotal;
        private Double annualTotal;
        private Double computeCost;
        private Double storageCost;
        private Double databaseCost;
        private Double networkingCost;
        private Double monthlySavings;
        private Double annualSavings;
        private Double savingsPercentage;
        private Double fiveYearRoiPercentage;
        private Double paybackMonths;
        private String recommendedComputeType;
        private String recommendedDatabaseType;
        private String recommendedStorageType;
        private List<String> architecturalAdvantages;
        private Boolean isRecommended;

        public ProviderDetailDto() {
        }

        public String getProvider() {
            return provider;
        }

        public void setProvider(String provider) {
            this.provider = provider;
        }

        public String getDisplayName() {
            return displayName;
        }

        public void setDisplayName(String displayName) {
            this.displayName = displayName;
        }

        public Double getMonthlyTotal() {
            return monthlyTotal;
        }

        public void setMonthlyTotal(Double monthlyTotal) {
            this.monthlyTotal = monthlyTotal;
        }

        public Double getAnnualTotal() {
            return annualTotal;
        }

        public void setAnnualTotal(Double annualTotal) {
            this.annualTotal = annualTotal;
        }

        public Double getComputeCost() {
            return computeCost;
        }

        public void setComputeCost(Double computeCost) {
            this.computeCost = computeCost;
        }

        public Double getStorageCost() {
            return storageCost;
        }

        public void setStorageCost(Double storageCost) {
            this.storageCost = storageCost;
        }

        public Double getDatabaseCost() {
            return databaseCost;
        }

        public void setDatabaseCost(Double databaseCost) {
            this.databaseCost = databaseCost;
        }

        public Double getNetworkingCost() {
            return networkingCost;
        }

        public void setNetworkingCost(Double networkingCost) {
            this.networkingCost = networkingCost;
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

        public Double getPaybackMonths() {
            return paybackMonths;
        }

        public void setPaybackMonths(Double paybackMonths) {
            this.paybackMonths = paybackMonths;
        }

        public String getRecommendedComputeType() {
            return recommendedComputeType;
        }

        public void setRecommendedComputeType(String recommendedComputeType) {
            this.recommendedComputeType = recommendedComputeType;
        }

        public String getRecommendedDatabaseType() {
            return recommendedDatabaseType;
        }

        public void setRecommendedDatabaseType(String recommendedDatabaseType) {
            this.recommendedDatabaseType = recommendedDatabaseType;
        }

        public String getRecommendedStorageType() {
            return recommendedStorageType;
        }

        public void setRecommendedStorageType(String recommendedStorageType) {
            this.recommendedStorageType = recommendedStorageType;
        }

        public List<String> getArchitecturalAdvantages() {
            return architecturalAdvantages;
        }

        public void setArchitecturalAdvantages(List<String> architecturalAdvantages) {
            this.architecturalAdvantages = architecturalAdvantages;
        }

        public Boolean getIsRecommended() {
            return isRecommended;
        }

        public void setIsRecommended(Boolean isRecommended) {
            this.isRecommended = isRecommended;
        }
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

    public Double getOnPremMonthlyCost() {
        return onPremMonthlyCost;
    }

    public void setOnPremMonthlyCost(Double onPremMonthlyCost) {
        this.onPremMonthlyCost = onPremMonthlyCost;
    }

    public Double getOnPremAnnualCost() {
        return onPremAnnualCost;
    }

    public void setOnPremAnnualCost(Double onPremAnnualCost) {
        this.onPremAnnualCost = onPremAnnualCost;
    }

    public String getRecommendedProvider() {
        return recommendedProvider;
    }

    public void setRecommendedProvider(String recommendedProvider) {
        this.recommendedProvider = recommendedProvider;
    }

    public String getRecommendationReason() {
        return recommendationReason;
    }

    public void setRecommendationReason(String recommendationReason) {
        this.recommendationReason = recommendationReason;
    }

    public String getPricingDisclaimer() {
        return pricingDisclaimer;
    }

    public void setPricingDisclaimer(String pricingDisclaimer) {
        this.pricingDisclaimer = pricingDisclaimer;
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

    public Integer getVmCount() {
        return vmCount;
    }

    public void setVmCount(Integer vmCount) {
        this.vmCount = vmCount;
    }

    public List<ProviderDetailDto> getProviders() {
        return providers;
    }

    public void setProviders(List<ProviderDetailDto> providers) {
        this.providers = providers;
    }
}

