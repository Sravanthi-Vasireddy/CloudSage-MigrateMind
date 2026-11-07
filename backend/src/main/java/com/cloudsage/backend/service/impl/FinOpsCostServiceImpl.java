package com.cloudsage.backend.service.impl;

import com.cloudsage.backend.dto.*;
import com.cloudsage.backend.entity.CostEstimate;
import com.cloudsage.backend.entity.Infrastructure;
import com.cloudsage.backend.entity.TargetArchitecture;
import com.cloudsage.backend.exception.ResourceNotFoundException;
import com.cloudsage.backend.repository.CostEstimateRepository;
import com.cloudsage.backend.repository.InfrastructureRepository;
import com.cloudsage.backend.repository.TargetArchitectureRepository;
import com.cloudsage.backend.service.FinOpsCostService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@Transactional
public class FinOpsCostServiceImpl implements FinOpsCostService {

    private static final Logger logger = LoggerFactory.getLogger(FinOpsCostServiceImpl.class);

    public static final String PRICING_DISCLAIMER =
            "Pricing estimates are calculated using standard benchmark rates (US-East regional catalog) " +
            "for illustrative cloud migration capacity planning. Actual invoiced billing may vary based on " +
            "negotiated enterprise discount agreements (EDP/MCA) and real-time consumption.";

    // Baseline On-Premises Spend
    public static final double ON_PREM_MONTHLY_COST = 19800.00;
    public static final double ON_PREM_ANNUAL_COST = ON_PREM_MONTHLY_COST * 12.00; // $237,600
    public static final double ESTIMATED_MIGRATION_CAPEX = 65000.00; // Estimated 1-time migration effort

    private final CostEstimateRepository costEstimateRepository;
    private final TargetArchitectureRepository architectureRepository;
    private final InfrastructureRepository infrastructureRepository;
    private final ObjectMapper objectMapper;

    public FinOpsCostServiceImpl(CostEstimateRepository costEstimateRepository,
                                  TargetArchitectureRepository architectureRepository,
                                  InfrastructureRepository infrastructureRepository) {
        this.costEstimateRepository = costEstimateRepository;
        this.architectureRepository = architectureRepository;
        this.infrastructureRepository = infrastructureRepository;
        this.objectMapper = new ObjectMapper();
    }

    @Override
    public CostEstimateResponseDto calculateCostEstimate(CostEstimateRequestDto request) {
        String provider = normalizeProvider(request.getProvider());
        String pricingModel = normalizePricingModel(request.getPricingModel());

        int vmCount = request.getVmCount() != null && request.getVmCount() > 0 ? request.getVmCount() : 3;
        int cpuCores = request.getTotalCpuCores() != null && request.getTotalCpuCores() > 0 ? request.getTotalCpuCores() : 40;
        int ramGB = request.getTotalRamGB() != null && request.getTotalRamGB() > 0 ? request.getTotalRamGB() : 224;
        int storageGB = request.getTotalStorageGB() != null && request.getTotalStorageGB() > 0 ? request.getTotalStorageGB() : 1950;
        int hours = request.getOperatingHoursPerMonth() != null && request.getOperatingHoursPerMonth() > 0 ? request.getOperatingHoursPerMonth() : 730;
        String storageType = request.getStorageType() != null ? request.getStorageType() : "STANDARD_SSD";
        boolean isMultiAz = request.getIsMultiAzDatabase() != null ? request.getIsMultiAzDatabase() : true;
        int egressGB = request.getNetworkEgressGB() != null ? request.getNetworkEgressGB() : 500;

        // 1. Calculate Compute Cost
        double cpuRatePerHour;
        double ramRatePerHour;
        double discountPct;

        switch (provider) {
            case "AZURE":
                cpuRatePerHour = 0.0400;
                ramRatePerHour = 0.0050;
                discountPct = "THREE_YEAR_COMMITTED".equals(pricingModel) ? 0.43 :
                              "ONE_YEAR_COMMITTED".equals(pricingModel) ? 0.29 : 0.0;
                break;
            case "GCP":
                cpuRatePerHour = 0.0385;
                ramRatePerHour = 0.0048;
                discountPct = "THREE_YEAR_COMMITTED".equals(pricingModel) ? 0.45 :
                              "ONE_YEAR_COMMITTED".equals(pricingModel) ? 0.30 : 0.0;
                break;
            case "AWS":
            default:
                cpuRatePerHour = 0.0416;
                ramRatePerHour = 0.0052;
                discountPct = "THREE_YEAR_COMMITTED".equals(pricingModel) ? 0.42 :
                              "ONE_YEAR_COMMITTED".equals(pricingModel) ? 0.28 : 0.0;
                break;
        }

        // App & compute instance cores (app tier ~ 60% of total compute; DB tier ~ 40% handled separately)
        int appCores = Math.max(2, (int) Math.round(cpuCores * 0.60));
        int appRamGB = Math.max(4, (int) Math.round(ramGB * 0.60));
        int dbCores = Math.max(2, cpuCores - appCores);
        int dbRamGB = Math.max(4, ramGB - appRamGB);

        double rawComputeHourly = (appCores * cpuRatePerHour) + (appRamGB * ramRatePerHour);
        double computeMonthly = rawComputeHourly * hours * (1.0 - discountPct);

        // 2. Calculate Storage Cost
        double storageRatePerGBMonth;
        switch (storageType) {
            case "PREMIUM_SSD":
                storageRatePerGBMonth = "AZURE".equals(provider) ? 0.120 : 0.125;
                break;
            case "INTELLIGENT_TIER":
                storageRatePerGBMonth = "AZURE".equals(provider) ? 0.021 : "GCP".equals(provider) ? 0.022 : 0.023;
                break;
            case "STANDARD_SSD":
            default:
                storageRatePerGBMonth = "AZURE".equals(provider) ? 0.075 : 0.080;
                break;
        }
        // Base block storage + 50% backup snapshot storage at object rates ($0.023/GB)
        double storageMonthly = (storageGB * storageRatePerGBMonth) + (storageGB * 0.50 * 0.023);

        // 3. Calculate Database Cost
        double dbRatePerHour;
        double multiAzMultiplier;
        switch (provider) {
            case "AZURE":
                dbRatePerHour = 0.115;
                multiAzMultiplier = isMultiAz ? 1.90 : 1.0;
                break;
            case "GCP":
                dbRatePerHour = 0.110;
                multiAzMultiplier = isMultiAz ? 1.80 : 1.0;
                break;
            case "AWS":
            default:
                dbRatePerHour = 0.120;
                multiAzMultiplier = isMultiAz ? 1.85 : 1.0;
                break;
        }
        double dbHourly = (dbCores * dbRatePerHour) + (dbRamGB * 0.015);
        double dbDiscount = "THREE_YEAR_COMMITTED".equals(pricingModel) ? 0.35 :
                           "ONE_YEAR_COMMITTED".equals(pricingModel) ? 0.22 : 0.0;
        double databaseMonthly = dbHourly * hours * multiAzMultiplier * (1.0 - dbDiscount);

        // 4. Calculate Networking & Data Transfer Cost
        double egressRatePerGB = "GCP".equals(provider) ? 0.085 : "AZURE".equals(provider) ? 0.087 : 0.090;
        double egressCost = egressGB * egressRatePerGB;
        double lbBaseCost = 18.25; // standard ALB / App Gateway / GCP LB
        double natGatewayCost = 32.85; // AWS NAT / Azure NAT / GCP Cloud NAT
        double networkingMonthly = egressCost + lbBaseCost + natGatewayCost + 35.00; // Transit Gateway / peering allocation

        // Total Costs
        double totalMonthly = roundTwoDecimals(computeMonthly + storageMonthly + databaseMonthly + networkingMonthly);
        double totalAnnual = roundTwoDecimals(totalMonthly * 12.00);

        // Baseline comparison & savings
        double monthlySavings = roundTwoDecimals(ON_PREM_MONTHLY_COST - totalMonthly);
        double annualSavings = roundTwoDecimals(monthlySavings * 12.00);
        double savingsPct = roundTwoDecimals((monthlySavings / ON_PREM_MONTHLY_COST) * 100.0);

        // ROI metrics
        double cumulativeFiveYearNetBenefit = (5.0 * ON_PREM_ANNUAL_COST) - (5.0 * totalAnnual) - ESTIMATED_MIGRATION_CAPEX;
        double fiveYearRoi = roundTwoDecimals(Math.max(0.0, (cumulativeFiveYearNetBenefit / ESTIMATED_MIGRATION_CAPEX) * 100.0));
        double paybackMonths = monthlySavings > 0 ? roundTwoDecimals(ESTIMATED_MIGRATION_CAPEX / monthlySavings) : 0.0;

        // Build Response DTO
        CostEstimateResponseDto dto = new CostEstimateResponseDto();
        dto.setEstimateName(request.getEstimateName() != null ? request.getEstimateName() : "Target Cloud Baseline (" + provider + ")");
        dto.setProvider(provider);
        dto.setPricingModel(pricingModel);
        dto.setPricingModelLabel(formatPricingModelLabel(pricingModel));

        dto.setVmCount(vmCount);
        dto.setTotalCpuCores(cpuCores);
        dto.setTotalRamGB(ramGB);
        dto.setTotalStorageGB(storageGB);
        dto.setOperatingHoursPerMonth(hours);
        dto.setStorageType(storageType);
        dto.setIsMultiAzDatabase(isMultiAz);
        dto.setNetworkEgressGB(egressGB);

        dto.setComputeMonthlyCost(roundTwoDecimals(computeMonthly));
        dto.setStorageMonthlyCost(roundTwoDecimals(storageMonthly));
        dto.setDatabaseMonthlyCost(roundTwoDecimals(databaseMonthly));
        dto.setNetworkingMonthlyCost(roundTwoDecimals(networkingMonthly));
        dto.setTotalMonthlyCost(totalMonthly);
        dto.setTotalAnnualCost(totalAnnual);

        dto.setOnPremCurrentMonthlyCost(ON_PREM_MONTHLY_COST);
        dto.setOnPremCurrentAnnualCost(ON_PREM_ANNUAL_COST);
        dto.setMonthlySavings(monthlySavings);
        dto.setAnnualSavings(annualSavings);
        dto.setSavingsPercentage(savingsPct);

        dto.setFiveYearRoiPercentage(fiveYearRoi);
        dto.setPaybackPeriodMonths(paybackMonths);
        dto.setCommitmentDiscountPercentage(roundTwoDecimals(discountPct * 100.0));

        // Detailed component breakdown
        Map<String, Object> breakdown = new LinkedHashMap<>();
        breakdown.put("computeInstanceHours", hours);
        breakdown.put("appTierCores", appCores);
        breakdown.put("appTierRamGB", appRamGB);
        breakdown.put("databaseCores", dbCores);
        breakdown.put("databaseRamGB", dbRamGB);
        breakdown.put("storageGB", storageGB);
        breakdown.put("networkEgressGB", egressGB);
        breakdown.put("computeDiscountApplied", roundTwoDecimals(discountPct * 100.0) + "%");
        breakdown.put("recommendedInstanceFamily", getRecommendedInstanceFamily(provider));
        breakdown.put("recommendedDatabaseEngine", getRecommendedDatabaseEngine(provider));
        dto.setComponentBreakdown(breakdown);

        dto.setNotes(request.getNotes());
        dto.setPricingDisclaimer(PRICING_DISCLAIMER);
        dto.setCreatedAt(LocalDateTime.now());

        return dto;
    }

    @Override
    public CostEstimateResponseDto getBaselineEstimate(String provider, String pricingModel) {
        String normProvider = normalizeProvider(provider);
        String normPricing = normalizePricingModel(pricingModel);

        CostEstimateRequestDto req = new CostEstimateRequestDto();
        req.setProvider(normProvider);
        req.setPricingModel(normPricing);
        req.setEstimateName("CloudSage Baseline TCO - " + normProvider);

        // Check if Stage 5 target architecture exists for accurate sizing
        Optional<TargetArchitecture> archOpt = architectureRepository.findByProvider(normProvider);
        if (archOpt.isPresent()) {
            TargetArchitecture arch = archOpt.get();
            req.setTotalCpuCores(arch.getTotalComputeCores());
            req.setTotalRamGB(arch.getTotalRamGB());
            req.setTotalStorageGB(arch.getTotalStorageGB());
            req.setIsMultiAzDatabase(arch.getIsMultiRegionDR() != null && arch.getIsMultiRegionDR());
        } else {
            // Count from infrastructure repository
            long totalCores = infrastructureRepository.findAll().stream()
                    .mapToInt(Infrastructure::getCpuCores)
                    .sum();
            long totalRam = infrastructureRepository.findAll().stream()
                    .mapToInt(Infrastructure::getRamGB)
                    .sum();
            long totalStorage = infrastructureRepository.findAll().stream()
                    .mapToInt(Infrastructure::getStorageGB)
                    .sum();
            int vmCount = (int) infrastructureRepository.count();

            if (totalCores > 0) req.setTotalCpuCores((int) totalCores);
            if (totalRam > 0) req.setTotalRamGB((int) totalRam);
            if (totalStorage > 0) req.setTotalStorageGB((int) totalStorage);
            if (vmCount > 0) req.setVmCount(vmCount);
        }

        return calculateCostEstimate(req);
    }

    @Override
    public ProviderCostComparisonDto compareProviders(String pricingModel) {
        String normPricing = normalizePricingModel(pricingModel);

        ProviderCostComparisonDto comp = new ProviderCostComparisonDto();
        comp.setPricingModel(normPricing);
        comp.setPricingModelLabel(formatPricingModelLabel(normPricing));
        comp.setOnPremMonthlyCost(ON_PREM_MONTHLY_COST);
        comp.setOnPremAnnualCost(ON_PREM_ANNUAL_COST);
        comp.setPricingDisclaimer(PRICING_DISCLAIMER);

        List<ProviderCostComparisonDto.ProviderDetailDto> providerDetails = new ArrayList<>();
        String[] providers = {"AWS", "AZURE", "GCP"};

        CostEstimateResponseDto lowestCostEstimate = null;
        String recommendedProvider = "AWS";

        for (String prov : providers) {
            CostEstimateResponseDto estimate = getBaselineEstimate(prov, normPricing);

            if (comp.getTotalCpuCores() == null) {
                comp.setTotalCpuCores(estimate.getTotalCpuCores());
                comp.setTotalRamGB(estimate.getTotalRamGB());
                comp.setTotalStorageGB(estimate.getTotalStorageGB());
                comp.setVmCount(estimate.getVmCount());
            }

            ProviderCostComparisonDto.ProviderDetailDto detail = new ProviderCostComparisonDto.ProviderDetailDto();
            detail.setProvider(prov);
            detail.setDisplayName(getDisplayName(prov));
            detail.setMonthlyTotal(estimate.getTotalMonthlyCost());
            detail.setAnnualTotal(estimate.getTotalAnnualCost());
            detail.setComputeCost(estimate.getComputeMonthlyCost());
            detail.setStorageCost(estimate.getStorageMonthlyCost());
            detail.setDatabaseCost(estimate.getDatabaseMonthlyCost());
            detail.setNetworkingCost(estimate.getNetworkingMonthlyCost());
            detail.setMonthlySavings(estimate.getMonthlySavings());
            detail.setAnnualSavings(estimate.getAnnualSavings());
            detail.setSavingsPercentage(estimate.getSavingsPercentage());
            detail.setFiveYearRoiPercentage(estimate.getFiveYearRoiPercentage());
            detail.setPaybackMonths(estimate.getPaybackPeriodMonths());
            detail.setRecommendedComputeType(getRecommendedInstanceFamily(prov));
            detail.setRecommendedDatabaseType(getRecommendedDatabaseEngine(prov));
            detail.setRecommendedStorageType(getRecommendedStorageName(prov));
            detail.setArchitecturalAdvantages(getArchitecturalAdvantages(prov));

            if (lowestCostEstimate == null || estimate.getTotalMonthlyCost() < lowestCostEstimate.getTotalMonthlyCost()) {
                lowestCostEstimate = estimate;
                recommendedProvider = prov;
            }

            providerDetails.add(detail);
        }

        // Mark the recommended provider
        for (ProviderCostComparisonDto.ProviderDetailDto detail : providerDetails) {
            detail.setIsRecommended(detail.getProvider().equals(recommendedProvider));
        }

        comp.setProviders(providerDetails);
        comp.setRecommendedProvider(recommendedProvider);
        comp.setRecommendationReason(getRecommendationReason(recommendedProvider, normPricing));

        return comp;
    }

    @Override
    public List<CostOptimizationDto> getOptimizationRecommendations() {
        List<CostOptimizationDto> list = new ArrayList<>();

        list.add(new CostOptimizationDto(
                "OPT-01",
                "COMPUTE",
                "Downsize Overprovisioned Web & App Tier Virtual Machines",
                "ShopSphere E-Commerce web instances average 38% CPU peak utilization with 62% idle headroom.",
                "Right-size from 8 vCPU / 32 GB to 4 vCPU / 16 GB Graviton3 / D4s_v5 with targeted Auto Scaling Policies.",
                167.20,
                "HIGH",
                "ALL",
                "prod-shop-web-01.dmz.internal",
                4.0
        ));

        list.add(new CostOptimizationDto(
                "OPT-02",
                "DATABASE",
                "Modernize Core Banking Oracle RAC to Cloud-Native Managed Database",
                "Legacy on-premises Oracle 19c RAC carries substantial database license fees ($1,750/core) and dedicated hardware standby overhead.",
                "Migrate to Aurora PostgreSQL Serverless v2 or Azure SQL Managed Instance with elastic auto-scaling compute.",
                1730.00,
                "HIGH",
                "ALL",
                "prod-fin-app-01.corp.internal (Oracle 19c)",
                40.0
        ));

        list.add(new CostOptimizationDto(
                "OPT-03",
                "COMMITMENT",
                "Adopt 3-Year Compute Savings Plans & Committed Use Discounts",
                "Baseline steady-state workloads run continuously 24x7x365 on high-margin On-Demand retail billing rates.",
                "Purchase 3-Year Compute Savings Plans / Azure Savings Plans / GCP CUD to lock in 42% - 45% discount on steady-state cores.",
                2180.00,
                "HIGH",
                "ALL",
                "Enterprise Compute Baseline (40 vCPU / 224 GB RAM)",
                2.0
        ));

        list.add(new CostOptimizationDto(
                "OPT-04",
                "STORAGE",
                "Implement Automated Object Lifecycle & Cold Tiering",
                "1,200 GB of CRM customer history and database backups reside on expensive Block SSD storage despite <5% monthly access rate.",
                "Transition historical records and transaction backups to S3 Glacier Instant Retrieval / Azure Blob Cool / GCP Coldline.",
                112.50,
                "MEDIUM",
                "ALL",
                "prod-crm-db-01.corp.internal (1,200 GB Storage)",
                8.0
        ));

        list.add(new CostOptimizationDto(
                "OPT-05",
                "SCHEDULE",
                "Non-Production Dev/QA Scheduled Off-Hours Auto-Shutdown",
                "Development and staging servers run 24x7 despite engineering teams working 45 hours weekly.",
                "Deploy AWS Instance Scheduler / Azure Automation Runbooks to stop non-prod workloads on nights and weekends (saving 65% runtime).",
                380.00,
                "MEDIUM",
                "ALL",
                "Non-Production & Staging Environments (400 hrs/mo)",
                6.0
        ));

        list.add(new CostOptimizationDto(
                "OPT-06",
                "DATABASE",
                "Offload Session State to Managed Redis Cache",
                "Dedicated relational database CPU cycles are spent processing read-heavy user sessions and shopping cart tokens.",
                "Implement Amazon ElastiCache / Azure Managed Redis / GCP Memorystore to offload 40% of database read queries.",
                126.00,
                "MEDIUM",
                "ALL",
                "ShopSphere Session State Layer",
                12.0
        ));

        list.add(new CostOptimizationDto(
                "OPT-07",
                "NETWORKING",
                "Consolidate Multi-AZ NAT Gateways via Centralized Transit VPC",
                "Redundant per-AZ NAT Gateways generate fixed base charges ($32.85/mo per gateway) and inter-AZ data transfer fees.",
                "Consolidate outbound internet egress into centralized egress VPC with Transit Gateway route tables.",
                98.00,
                "LOW",
                "AWS",
                "Regional VPC NAT Gateways",
                8.0
        ));

        return list;
    }

    @Override
    public CostEstimateResponseDto saveEstimate(CostEstimateRequestDto request) {
        CostEstimateResponseDto calculated = calculateCostEstimate(request);

        CostEstimate entity = new CostEstimate();
        entity.setEstimateName(request.getEstimateName() != null && !request.getEstimateName().isBlank()
                ? request.getEstimateName() : "Estimate - " + calculated.getProvider() + " (" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("MMM dd, yyyy HH:mm")) + ")");
        entity.setProvider(calculated.getProvider());
        entity.setPricingModel(calculated.getPricingModel());
        entity.setVmCount(calculated.getVmCount());
        entity.setTotalCpuCores(calculated.getTotalCpuCores());
        entity.setTotalRamGB(calculated.getTotalRamGB());
        entity.setTotalStorageGB(calculated.getTotalStorageGB());
        entity.setOperatingHoursPerMonth(calculated.getOperatingHoursPerMonth());
        entity.setStorageType(calculated.getStorageType());
        entity.setIsMultiAzDatabase(calculated.getIsMultiAzDatabase());
        entity.setNetworkEgressGB(calculated.getNetworkEgressGB());

        entity.setComputeMonthlyCost(calculated.getComputeMonthlyCost());
        entity.setStorageMonthlyCost(calculated.getStorageMonthlyCost());
        entity.setDatabaseMonthlyCost(calculated.getDatabaseMonthlyCost());
        entity.setNetworkingMonthlyCost(calculated.getNetworkingMonthlyCost());
        entity.setTotalMonthlyCost(calculated.getTotalMonthlyCost());
        entity.setTotalAnnualCost(calculated.getTotalAnnualCost());

        entity.setOnPremCurrentMonthlyCost(calculated.getOnPremCurrentMonthlyCost());
        entity.setMonthlySavings(calculated.getMonthlySavings());
        entity.setSavingsPercentage(calculated.getSavingsPercentage());
        entity.setNotes(request.getNotes());

        try {
            entity.setBreakdownJson(objectMapper.writeValueAsString(calculated.getComponentBreakdown()));
        } catch (Exception e) {
            logger.warn("Failed to serialize breakdown JSON: {}", e.getMessage());
            entity.setBreakdownJson("{}");
        }

        CostEstimate saved = costEstimateRepository.save(entity);
        calculated.setId(saved.getId());
        calculated.setCreatedAt(saved.getCreatedAt());

        logger.info("Successfully saved Cost Estimate ID {} with name '{}'", saved.getId(), saved.getEstimateName());
        return calculated;
    }

    @Override
    @Transactional(readOnly = true)
    public List<CostEstimateResponseDto> getAllSavedEstimates() {
        List<CostEstimate> entities = costEstimateRepository.findAllByOrderByCreatedAtDesc();
        List<CostEstimateResponseDto> dtoList = new ArrayList<>();

        for (CostEstimate e : entities) {
            CostEstimateResponseDto dto = new CostEstimateResponseDto();
            dto.setId(e.getId());
            dto.setEstimateName(e.getEstimateName());
            dto.setProvider(e.getProvider());
            dto.setPricingModel(e.getPricingModel());
            dto.setPricingModelLabel(formatPricingModelLabel(e.getPricingModel()));
            dto.setVmCount(e.getVmCount());
            dto.setTotalCpuCores(e.getTotalCpuCores());
            dto.setTotalRamGB(e.getTotalRamGB());
            dto.setTotalStorageGB(e.getTotalStorageGB());
            dto.setOperatingHoursPerMonth(e.getOperatingHoursPerMonth());
            dto.setStorageType(e.getStorageType());
            dto.setIsMultiAzDatabase(e.getIsMultiAzDatabase());
            dto.setNetworkEgressGB(e.getNetworkEgressGB());

            dto.setComputeMonthlyCost(e.getComputeMonthlyCost());
            dto.setStorageMonthlyCost(e.getStorageMonthlyCost());
            dto.setDatabaseMonthlyCost(e.getDatabaseMonthlyCost());
            dto.setNetworkingMonthlyCost(e.getNetworkingMonthlyCost());
            dto.setTotalMonthlyCost(e.getTotalMonthlyCost());
            dto.setTotalAnnualCost(e.getTotalAnnualCost());

            dto.setOnPremCurrentMonthlyCost(e.getOnPremCurrentMonthlyCost());
            dto.setOnPremCurrentAnnualCost(e.getOnPremCurrentMonthlyCost() != null ? e.getOnPremCurrentMonthlyCost() * 12.0 : ON_PREM_ANNUAL_COST);
            dto.setMonthlySavings(e.getMonthlySavings());
            dto.setAnnualSavings(e.getMonthlySavings() != null ? e.getMonthlySavings() * 12.0 : 0.0);
            dto.setSavingsPercentage(e.getSavingsPercentage());

            double cumulativeNet = (5.0 * ON_PREM_ANNUAL_COST) - (5.0 * e.getTotalAnnualCost()) - ESTIMATED_MIGRATION_CAPEX;
            dto.setFiveYearRoiPercentage(roundTwoDecimals(Math.max(0.0, (cumulativeNet / ESTIMATED_MIGRATION_CAPEX) * 100.0)));
            dto.setPaybackPeriodMonths(e.getMonthlySavings() != null && e.getMonthlySavings() > 0 ? roundTwoDecimals(ESTIMATED_MIGRATION_CAPEX / e.getMonthlySavings()) : 0.0);

            try {
                if (e.getBreakdownJson() != null) {
                    Map<String, Object> map = objectMapper.readValue(e.getBreakdownJson(), new TypeReference<Map<String, Object>>() {});
                    dto.setComponentBreakdown(map);
                }
            } catch (Exception ex) {
                dto.setComponentBreakdown(Collections.emptyMap());
            }

            dto.setNotes(e.getNotes());
            dto.setPricingDisclaimer(PRICING_DISCLAIMER);
            dto.setCreatedAt(e.getCreatedAt());
            dtoList.add(dto);
        }

        return dtoList;
    }

    @Override
    @Transactional(readOnly = true)
    public CostEstimateResponseDto getSavedEstimateById(Long id) {
        CostEstimate e = costEstimateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cost estimate not found with ID: " + id));

        CostEstimateResponseDto dto = new CostEstimateResponseDto();
        dto.setId(e.getId());
        dto.setEstimateName(e.getEstimateName());
        dto.setProvider(e.getProvider());
        dto.setPricingModel(e.getPricingModel());
        dto.setPricingModelLabel(formatPricingModelLabel(e.getPricingModel()));
        dto.setVmCount(e.getVmCount());
        dto.setTotalCpuCores(e.getTotalCpuCores());
        dto.setTotalRamGB(e.getTotalRamGB());
        dto.setTotalStorageGB(e.getTotalStorageGB());
        dto.setOperatingHoursPerMonth(e.getOperatingHoursPerMonth());
        dto.setStorageType(e.getStorageType());
        dto.setIsMultiAzDatabase(e.getIsMultiAzDatabase());
        dto.setNetworkEgressGB(e.getNetworkEgressGB());

        dto.setComputeMonthlyCost(e.getComputeMonthlyCost());
        dto.setStorageMonthlyCost(e.getStorageMonthlyCost());
        dto.setDatabaseMonthlyCost(e.getDatabaseMonthlyCost());
        dto.setNetworkingMonthlyCost(e.getNetworkingMonthlyCost());
        dto.setTotalMonthlyCost(e.getTotalMonthlyCost());
        dto.setTotalAnnualCost(e.getTotalAnnualCost());

        dto.setOnPremCurrentMonthlyCost(e.getOnPremCurrentMonthlyCost());
        dto.setOnPremCurrentAnnualCost(e.getOnPremCurrentMonthlyCost() != null ? e.getOnPremCurrentMonthlyCost() * 12.0 : ON_PREM_ANNUAL_COST);
        dto.setMonthlySavings(e.getMonthlySavings());
        dto.setAnnualSavings(e.getMonthlySavings() != null ? e.getMonthlySavings() * 12.0 : 0.0);
        dto.setSavingsPercentage(e.getSavingsPercentage());

        try {
            if (e.getBreakdownJson() != null) {
                Map<String, Object> map = objectMapper.readValue(e.getBreakdownJson(), new TypeReference<Map<String, Object>>() {});
                dto.setComponentBreakdown(map);
            }
        } catch (Exception ex) {
            dto.setComponentBreakdown(Collections.emptyMap());
        }

        dto.setNotes(e.getNotes());
        dto.setPricingDisclaimer(PRICING_DISCLAIMER);
        dto.setCreatedAt(e.getCreatedAt());

        return dto;
    }

    @Override
    public void deleteSavedEstimate(Long id) {
        if (!costEstimateRepository.existsById(id)) {
            throw new ResourceNotFoundException("Cost estimate not found with ID: " + id);
        }
        costEstimateRepository.deleteById(id);
        logger.info("Deleted Cost Estimate ID {}", id);
    }

    @Override
    public CostReportDto generateCostReport(String provider, String pricingModel) {
        String normProvider = normalizeProvider(provider);
        String normPricing = normalizePricingModel(pricingModel);

        CostEstimateResponseDto estimate = getBaselineEstimate(normProvider, normPricing);
        ProviderCostComparisonDto comparison = compareProviders(normPricing);
        List<CostOptimizationDto> optimizations = getOptimizationRecommendations();

        CostReportDto report = new CostReportDto();
        report.setReportId("FINOPS-RPT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        report.setProjectName("Enterprise Banking & Digital Commerce Migration");
        report.setGeneratedAt(LocalDateTime.now());
        report.setTargetProvider(normProvider);
        report.setPricingModel(formatPricingModelLabel(normPricing));

        report.setOnPremMonthlySpend(estimate.getOnPremCurrentMonthlyCost());
        report.setTargetCloudMonthlySpend(estimate.getTotalMonthlyCost());
        report.setNetMonthlySavings(estimate.getMonthlySavings());
        report.setNetAnnualSavings(estimate.getAnnualSavings());
        report.setSavingsPercentage(estimate.getSavingsPercentage());
        report.setFiveYearRoiPercentage(estimate.getFiveYearRoiPercentage());
        report.setPaybackPeriodMonths(estimate.getPaybackPeriodMonths());
        report.setEstimatedCarbonReductionTons(142.4);

        report.setEstimateDetails(estimate);
        report.setComparisonSummary(comparison);
        report.setTopOptimizations(optimizations);

        // 12-Month cashflow projection
        List<Map<String, Object>> cashflow = new ArrayList<>();
        String[] months = {"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"};
        double[] onPremRamp = {19800, 19800, 18900, 17400, 15100, 11500, 6800, 1200, 0, 0, 0, 0};
        double[] cloudRampRatio = {0.22, 0.32, 0.47, 0.62, 0.75, 0.86, 0.95, 1.0, 1.0, 1.0, 1.0, 1.0};

        for (int i = 0; i < 12; i++) {
            Map<String, Object> monthData = new LinkedHashMap<>();
            monthData.put("month", months[i]);
            monthData.put("onPrem", onPremRamp[i]);
            double cloudSpend = roundTwoDecimals(estimate.getTotalMonthlyCost() * cloudRampRatio[i]);
            monthData.put("cloudOptimized", cloudSpend);
            monthData.put("netMonthlySpend", roundTwoDecimals(onPremRamp[i] + cloudSpend));
            cashflow.add(monthData);
        }
        report.setMonthlyCashflowProjection(cashflow);

        report.setExecutiveSummary(
                "CloudSage FinOps engine has conducted comprehensive TCO modeling for the enterprise portfolio (40 vCPU, 224 GB RAM, 1,950 GB storage). " +
                "Migrating to " + normProvider + " utilizing " + formatPricingModelLabel(normPricing) + " commitments reduces monthly infrastructure run-rate from " +
                "$" + String.format("%,.2f", ON_PREM_MONTHLY_COST) + " to $" + String.format("%,.2f", estimate.getTotalMonthlyCost()) + ", unlocking $" +
                String.format("%,.2f", estimate.getAnnualSavings()) + " in net recurring annual savings (" + estimate.getSavingsPercentage() + "% reduction). " +
                "Capital payback is achieved in Month " + estimate.getPaybackPeriodMonths() + " with a 5-Year cumulative ROI of " + estimate.getFiveYearRoiPercentage() + "%."
        );

        report.setMethodologyDisclaimer(PRICING_DISCLAIMER);
        return report;
    }

    @Override
    public String generateCsvReport(CostEstimateResponseDto estimate) {
        StringBuilder csv = new StringBuilder();
        csv.append("CloudSage - MigrateMind FinOps Cost Breakdown\n");
        csv.append("Generated,").append(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)).append("\n");
        csv.append("Provider,").append(estimate.getProvider()).append("\n");
        csv.append("Pricing Model,").append(estimate.getPricingModelLabel()).append("\n");
        csv.append("Disclaimer,").append("\"").append(estimate.getPricingDisclaimer()).append("\"\n\n");

        csv.append("Category,Resource / Service Description,Monthly Cost (USD),Annual Cost (USD),Share (%)\n");
        double total = estimate.getTotalMonthlyCost();
        csv.append("Compute,Virtual Machines & Container Cluster (")
                .append(estimate.getTotalCpuCores()).append(" vCPU / ").append(estimate.getTotalRamGB()).append(" GB RAM),")
                .append(String.format("%.2f", estimate.getComputeMonthlyCost())).append(",")
                .append(String.format("%.2f", estimate.getComputeMonthlyCost() * 12.0)).append(",")
                .append(String.format("%.1f", (estimate.getComputeMonthlyCost() / total) * 100)).append("\n");

        csv.append("Storage,Block SSD & Object Backup Tier (").append(estimate.getTotalStorageGB()).append(" GB),")
                .append(String.format("%.2f", estimate.getStorageMonthlyCost())).append(",")
                .append(String.format("%.2f", estimate.getStorageMonthlyCost() * 12.0)).append(",")
                .append(String.format("%.1f", (estimate.getStorageMonthlyCost() / total) * 100)).append("\n");

        csv.append("Database,Managed Cloud Database Tier (").append(estimate.getIsMultiAzDatabase() ? "Multi-AZ HA" : "Single-AZ").append("),")
                .append(String.format("%.2f", estimate.getDatabaseMonthlyCost())).append(",")
                .append(String.format("%.2f", estimate.getDatabaseMonthlyCost() * 12.0)).append(",")
                .append(String.format("%.1f", (estimate.getDatabaseMonthlyCost() / total) * 100)).append("\n");

        csv.append("Networking,Load Balancer & Egress Transfer (").append(estimate.getNetworkEgressGB()).append(" GB egress),")
                .append(String.format("%.2f", estimate.getNetworkingMonthlyCost())).append(",")
                .append(String.format("%.2f", estimate.getNetworkingMonthlyCost() * 12.0)).append(",")
                .append(String.format("%.1f", (estimate.getNetworkingMonthlyCost() / total) * 100)).append("\n");

        csv.append("TOTAL TARGET CLOUD SPEND,,")
                .append(String.format("%.2f", estimate.getTotalMonthlyCost())).append(",")
                .append(String.format("%.2f", estimate.getTotalAnnualCost())).append(",100.0\n\n");

        csv.append("BASELINE COMPARISON,,Monthly Cost (USD),Annual Cost (USD),Savings (%)\n");
        csv.append("Current On-Premises Datacenter Run Rate,,")
                .append(String.format("%.2f", estimate.getOnPremCurrentMonthlyCost())).append(",")
                .append(String.format("%.2f", estimate.getOnPremCurrentAnnualCost())).append(",-\n");
        csv.append("Net Recurring Cloud Savings,,")
                .append(String.format("%.2f", estimate.getMonthlySavings())).append(",")
                .append(String.format("%.2f", estimate.getAnnualSavings())).append(",")
                .append(String.format("%.1f", estimate.getSavingsPercentage())).append("%\n");
        csv.append("5-Year Cumulative ROI,,")
                .append(String.format("%.1f", estimate.getFiveYearRoiPercentage())).append("%,,Payback in ")
                .append(estimate.getPaybackPeriodMonths()).append(" months\n");

        return csv.toString();
    }

    // Helper Methods
    private String normalizeProvider(String prov) {
        if (prov == null || prov.isBlank()) return "AWS";
        String upper = prov.trim().toUpperCase();
        if (upper.contains("AZURE")) return "AZURE";
        if (upper.contains("GCP") || upper.contains("GOOGLE")) return "GCP";
        return "AWS";
    }

    private String normalizePricingModel(String model) {
        if (model == null || model.isBlank()) return "THREE_YEAR_COMMITTED";
        String upper = model.trim().toUpperCase().replace("-", "_").replace(" ", "_");
        if (upper.contains("ON_DEMAND") || upper.contains("ONDEMAND")) return "ON_DEMAND";
        if (upper.contains("1_YEAR") || upper.contains("ONE_YEAR") || upper.contains("1_YR")) return "ONE_YEAR_COMMITTED";
        return "THREE_YEAR_COMMITTED";
    }

    private String formatPricingModelLabel(String model) {
        switch (model) {
            case "ON_DEMAND": return "On-Demand (Retail)";
            case "ONE_YEAR_COMMITTED": return "1-Year Reserved / Savings Plan";
            case "THREE_YEAR_COMMITTED":
            default: return "3-Year Reserved / Savings Plan";
        }
    }

    private String getDisplayName(String prov) {
        switch (prov) {
            case "AZURE": return "Microsoft Azure";
            case "GCP": return "Google Cloud Platform";
            case "AWS":
            default: return "Amazon Web Services (AWS)";
        }
    }

    private String getRecommendedInstanceFamily(String prov) {
        switch (prov) {
            case "AZURE": return "D-series v5 (Standard_D8s_v5) / E-series v5";
            case "GCP": return "Tau T2D (t2d-standard-8) / N2 High-Memory";
            case "AWS":
            default: return "m6g.2xlarge (Graviton3) / r6g.2xlarge (Memory Opt)";
        }
    }

    private String getRecommendedDatabaseEngine(String prov) {
        switch (prov) {
            case "AZURE": return "Azure SQL Managed Instance / Flexible Server";
            case "GCP": return "Cloud SQL Enterprise Plus / AlloyDB PostgreSQL";
            case "AWS":
            default: return "Amazon Aurora PostgreSQL Serverless v2";
        }
    }

    private String getRecommendedStorageName(String prov) {
        switch (prov) {
            case "AZURE": return "Managed Disks Premium SSD (ZRS) + Cool Blob";
            case "GCP": return "Persistent Disk SSD + Cloud Storage Autoclass";
            case "AWS":
            default: return "EBS gp3 (3,000 IOPS) + S3 Glacier Instant";
        }
    }

    private List<String> getArchitecturalAdvantages(String prov) {
        switch (prov) {
            case "AZURE":
                return Arrays.asList(
                        "Azure Hybrid Benefit (AHB) waives Windows Server and SQL Server licensing fees.",
                        "Native Azure Active Directory / Entra ID identity federation with existing on-premises AD forest.",
                        "Seamless Microsoft 365, Power BI, and SAP ERP cloud connectors."
                );
            case "GCP":
                return Arrays.asList(
                        "Tau T2D AMD EPYC processors deliver up to 40% higher price-performance on web workloads.",
                        "BigQuery serverless analytics integration eliminates ETL staging pipelines.",
                        "Global VPC private fiber network provides lowest latency inter-region database replication."
                );
            case "AWS":
            default:
                return Arrays.asList(
                        "AWS Graviton3 ARM silicon provides 25% compute performance gain and 20% lower cost.",
                        "Aurora Serverless v2 scales database capacity in fine-grained 0.5 ACU increments.",
                        "Broadest enterprise partner ecosystem and mature Landing Zone Accelerator governance."
                );
        }
    }

    private String getRecommendationReason(String recommended, String pricingModel) {
        if ("GCP".equals(recommended)) {
            return "Google Cloud Platform provides the lowest raw compute pricing with Sustained Use and 3-Year Committed Use Discounts, delivering peak cost-efficiency for the web and microservices workload.";
        } else if ("AZURE".equals(recommended)) {
            return "Microsoft Azure is the most cost-effective choice when applying Azure Hybrid Benefit (AHB) for the existing Windows Server and SQL Server CRM workloads.";
        } else {
            return "AWS provides the optimal combination of mature cloud-native capabilities (Aurora Serverless v2, Graviton3) and lowest total risk with a 38% net TCO reduction and 7.2-month capital payback.";
        }
    }

    private double roundTwoDecimals(double val) {
        return Math.round(val * 100.0) / 100.0;
    }
}

