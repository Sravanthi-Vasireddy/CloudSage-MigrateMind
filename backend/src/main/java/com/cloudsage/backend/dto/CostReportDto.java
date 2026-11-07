package com.cloudsage.backend.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class CostReportDto {

    private String reportId;
    private String projectName;
    private LocalDateTime generatedAt;
    private String targetProvider;
    private String pricingModel;
    private Double onPremMonthlySpend;
    private Double targetCloudMonthlySpend;
    private Double netMonthlySavings;
    private Double netAnnualSavings;
    private Double savingsPercentage;
    private Double fiveYearRoiPercentage;
    private Double paybackPeriodMonths;
    private Double estimatedCarbonReductionTons;
    private CostEstimateResponseDto estimateDetails;
    private ProviderCostComparisonDto comparisonSummary;
    private List<CostOptimizationDto> topOptimizations;
    private List<Map<String, Object>> monthlyCashflowProjection;
    private String executiveSummary;
    private String methodologyDisclaimer;

    public CostReportDto() {
    }

    public String getReportId() {
        return reportId;
    }

    public void setReportId(String reportId) {
        this.reportId = reportId;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public LocalDateTime getGeneratedAt() {
        return generatedAt;
    }

    public void setGeneratedAt(LocalDateTime generatedAt) {
        this.generatedAt = generatedAt;
    }

    public String getTargetProvider() {
        return targetProvider;
    }

    public void setTargetProvider(String targetProvider) {
        this.targetProvider = targetProvider;
    }

    public String getPricingModel() {
        return pricingModel;
    }

    public void setPricingModel(String pricingModel) {
        this.pricingModel = pricingModel;
    }

    public Double getOnPremMonthlySpend() {
        return onPremMonthlySpend;
    }

    public void setOnPremMonthlySpend(Double onPremMonthlySpend) {
        this.onPremMonthlySpend = onPremMonthlySpend;
    }

    public Double getTargetCloudMonthlySpend() {
        return targetCloudMonthlySpend;
    }

    public void setTargetCloudMonthlySpend(Double targetCloudMonthlySpend) {
        this.targetCloudMonthlySpend = targetCloudMonthlySpend;
    }

    public Double getNetMonthlySavings() {
        return netMonthlySavings;
    }

    public void setNetMonthlySavings(Double netMonthlySavings) {
        this.netMonthlySavings = netMonthlySavings;
    }

    public Double getNetAnnualSavings() {
        return netAnnualSavings;
    }

    public void setNetAnnualSavings(Double netAnnualSavings) {
        this.netAnnualSavings = netAnnualSavings;
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

    public Double getEstimatedCarbonReductionTons() {
        return estimatedCarbonReductionTons;
    }

    public void setEstimatedCarbonReductionTons(Double estimatedCarbonReductionTons) {
        this.estimatedCarbonReductionTons = estimatedCarbonReductionTons;
    }

    public CostEstimateResponseDto getEstimateDetails() {
        return estimateDetails;
    }

    public void setEstimateDetails(CostEstimateResponseDto estimateDetails) {
        this.estimateDetails = estimateDetails;
    }

    public ProviderCostComparisonDto getComparisonSummary() {
        return comparisonSummary;
    }

    public void setComparisonSummary(ProviderCostComparisonDto comparisonSummary) {
        this.comparisonSummary = comparisonSummary;
    }

    public List<CostOptimizationDto> getTopOptimizations() {
        return topOptimizations;
    }

    public void setTopOptimizations(List<CostOptimizationDto> topOptimizations) {
        this.topOptimizations = topOptimizations;
    }

    public List<Map<String, Object>> getMonthlyCashflowProjection() {
        return monthlyCashflowProjection;
    }

    public void setMonthlyCashflowProjection(List<Map<String, Object>> monthlyCashflowProjection) {
        this.monthlyCashflowProjection = monthlyCashflowProjection;
    }

    public String getExecutiveSummary() {
        return executiveSummary;
    }

    public void setExecutiveSummary(String executiveSummary) {
        this.executiveSummary = executiveSummary;
    }

    public String getMethodologyDisclaimer() {
        return methodologyDisclaimer;
    }

    public void setMethodologyDisclaimer(String methodologyDisclaimer) {
        this.methodologyDisclaimer = methodologyDisclaimer;
    }
}

