package com.cloudsage.backend.service;

import com.cloudsage.backend.dto.*;

import java.util.List;

public interface FinOpsCostService {

    CostEstimateResponseDto calculateCostEstimate(CostEstimateRequestDto request);

    CostEstimateResponseDto getBaselineEstimate(String provider, String pricingModel);

    ProviderCostComparisonDto compareProviders(String pricingModel);

    List<CostOptimizationDto> getOptimizationRecommendations();

    CostEstimateResponseDto saveEstimate(CostEstimateRequestDto request);

    List<CostEstimateResponseDto> getAllSavedEstimates();

    CostEstimateResponseDto getSavedEstimateById(Long id);

    void deleteSavedEstimate(Long id);

    CostReportDto generateCostReport(String provider, String pricingModel);

    String generateCsvReport(CostEstimateResponseDto estimate);
}

