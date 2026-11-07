package com.cloudsage.backend.controller;

import com.cloudsage.backend.dto.*;
import com.cloudsage.backend.service.FinOpsCostService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/finops")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class FinOpsCostController {

    private static final Logger logger = LoggerFactory.getLogger(FinOpsCostController.class);

    private final FinOpsCostService finOpsCostService;

    public FinOpsCostController(FinOpsCostService finOpsCostService) {
        this.finOpsCostService = finOpsCostService;
    }

    /**
     * Get baseline cost estimation for a given provider and pricing model
     */
    @GetMapping("/baseline")
    public ResponseEntity<CostEstimateResponseDto> getBaselineEstimate(
            @RequestParam(defaultValue = "AWS") String provider,
            @RequestParam(defaultValue = "THREE_YEAR_COMMITTED") String pricingModel) {
        logger.info("REST request to get baseline FinOps estimate for provider={} model={}", provider, pricingModel);
        CostEstimateResponseDto response = finOpsCostService.getBaselineEstimate(provider, pricingModel);
        return ResponseEntity.ok(response);
    }

    /**
     * Compare cloud costs across AWS, Microsoft Azure, and GCP
     */
    @GetMapping("/compare")
    public ResponseEntity<ProviderCostComparisonDto> compareProviders(
            @RequestParam(defaultValue = "THREE_YEAR_COMMITTED") String pricingModel) {
        logger.info("REST request to compare cloud costs across AWS, Azure, and GCP for model={}", pricingModel);
        ProviderCostComparisonDto comparison = finOpsCostService.compareProviders(pricingModel);
        return ResponseEntity.ok(comparison);
    }

    /**
     * Retrieve prioritized cost optimization recommendations
     */
    @GetMapping("/optimizations")
    public ResponseEntity<List<CostOptimizationDto>> getOptimizationRecommendations() {
        logger.info("REST request to fetch FinOps cost optimization opportunities");
        List<CostOptimizationDto> optimizations = finOpsCostService.getOptimizationRecommendations();
        return ResponseEntity.ok(optimizations);
    }

    /**
     * Interactive What-If cost simulation endpoint
     */
    @PostMapping("/simulate")
    public ResponseEntity<CostEstimateResponseDto> simulateCost(
            @Valid @RequestBody CostEstimateRequestDto request) {
        logger.info("REST request to simulate What-If cost scenario for provider={} cores={} ram={} storage={}",
                request.getProvider(), request.getTotalCpuCores(), request.getTotalRamGB(), request.getTotalStorageGB());
        CostEstimateResponseDto response = finOpsCostService.calculateCostEstimate(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Save a cost estimation scenario to MySQL database
     */
    @PostMapping("/saved")
    public ResponseEntity<CostEstimateResponseDto> saveEstimate(
            @Valid @RequestBody CostEstimateRequestDto request) {
        logger.info("REST request to save FinOps cost estimate: '{}'", request.getEstimateName());
        CostEstimateResponseDto response = finOpsCostService.saveEstimate(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Retrieve all saved cost estimate scenarios
     */
    @GetMapping("/saved")
    public ResponseEntity<List<CostEstimateResponseDto>> getAllSavedEstimates() {
        logger.info("REST request to fetch all saved cost estimates");
        List<CostEstimateResponseDto> estimates = finOpsCostService.getAllSavedEstimates();
        return ResponseEntity.ok(estimates);
    }

    /**
     * Retrieve a specific saved cost estimate by ID
     */
    @GetMapping("/saved/{id}")
    public ResponseEntity<CostEstimateResponseDto> getSavedEstimateById(@PathVariable Long id) {
        logger.info("REST request to fetch saved cost estimate ID={}", id);
        CostEstimateResponseDto estimate = finOpsCostService.getSavedEstimateById(id);
        return ResponseEntity.ok(estimate);
    }

    /**
     * Delete a saved cost estimate by ID
     */
    @DeleteMapping("/saved/{id}")
    public ResponseEntity<Void> deleteSavedEstimate(@PathVariable Long id) {
        logger.info("REST request to delete saved cost estimate ID={}", id);
        finOpsCostService.deleteSavedEstimate(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Generate complete enterprise FinOps cost report payload
     */
    @GetMapping("/report")
    public ResponseEntity<CostReportDto> generateCostReport(
            @RequestParam(defaultValue = "AWS") String provider,
            @RequestParam(defaultValue = "THREE_YEAR_COMMITTED") String pricingModel) {
        logger.info("REST request to generate complete FinOps cost report for provider={}", provider);
        CostReportDto report = finOpsCostService.generateCostReport(provider, pricingModel);
        return ResponseEntity.ok(report);
    }

    /**
     * Export cost breakdown as downloadable CSV file
     */
    @GetMapping("/export-csv")
    public ResponseEntity<String> exportCsvReport(
            @RequestParam(defaultValue = "AWS") String provider,
            @RequestParam(defaultValue = "THREE_YEAR_COMMITTED") String pricingModel) {
        logger.info("REST request to export CSV cost report for provider={}", provider);
        CostEstimateResponseDto baseline = finOpsCostService.getBaselineEstimate(provider, pricingModel);
        String csvData = finOpsCostService.generateCsvReport(baseline);

        String filename = "CloudSage_FinOps_Cost_" + provider + "_" +
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmm")) + ".csv";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.parseMediaType("text/csv; charset=UTF-8"))
                .body(csvData);
    }
}

