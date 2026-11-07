package com.cloudsage.backend.service;

import com.cloudsage.backend.dto.*;
import com.cloudsage.backend.entity.CostEstimate;
import com.cloudsage.backend.entity.Infrastructure;
import com.cloudsage.backend.entity.TargetArchitecture;
import com.cloudsage.backend.repository.CostEstimateRepository;
import com.cloudsage.backend.repository.InfrastructureRepository;
import com.cloudsage.backend.repository.TargetArchitectureRepository;
import com.cloudsage.backend.service.impl.FinOpsCostServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Proxy;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.atomic.AtomicLong;

import static org.junit.jupiter.api.Assertions.*;

public class FinOpsCostServiceTest {

    private Map<Long, CostEstimate> estimateDb;
    private Map<String, TargetArchitecture> archByProvider;
    private List<Infrastructure> infraList;
    private AtomicLong idGen;

    private CostEstimateRepository costEstimateRepository;
    private TargetArchitectureRepository architectureRepository;
    private InfrastructureRepository infrastructureRepository;
    private FinOpsCostService finOpsCostService;

    @BeforeEach
    void setUp() {
        estimateDb = new HashMap<>();
        archByProvider = new HashMap<>();
        infraList = new ArrayList<>();
        idGen = new AtomicLong(100L);

        // Seed 3 sample infrastructure workloads
        Infrastructure s1 = new Infrastructure();
        s1.setId(1L);
        s1.setCpuCores(16);
        s1.setRamGB(64);
        s1.setStorageGB(500);
        infraList.add(s1);

        Infrastructure s2 = new Infrastructure();
        s2.setId(2L);
        s2.setCpuCores(8);
        s2.setRamGB(32);
        s2.setStorageGB(250);
        infraList.add(s2);

        Infrastructure s3 = new Infrastructure();
        s3.setId(3L);
        s3.setCpuCores(16);
        s3.setRamGB(128);
        s3.setStorageGB(1200);
        infraList.add(s3);

        // Seed AWS Target Architecture
        TargetArchitecture awsArch = new TargetArchitecture();
        awsArch.setId(1L);
        awsArch.setProvider("AWS");
        awsArch.setTotalComputeCores(40);
        awsArch.setTotalRamGB(224);
        awsArch.setTotalStorageGB(1950);
        awsArch.setIsMultiRegionDR(false);
        archByProvider.put("AWS", awsArch);

        // Dynamic Proxy for CostEstimateRepository
        costEstimateRepository = (CostEstimateRepository) Proxy.newProxyInstance(
                CostEstimateRepository.class.getClassLoader(),
                new Class<?>[]{CostEstimateRepository.class},
                (proxy, method, args) -> {
                    String name = method.getName();
                    if ("save".equals(name)) {
                        CostEstimate e = (CostEstimate) args[0];
                        if (e.getId() == null) {
                            e.setId(idGen.incrementAndGet());
                        }
                        if (e.getCreatedAt() == null) {
                            e.setCreatedAt(LocalDateTime.now());
                        }
                        estimateDb.put(e.getId(), e);
                        return e;
                    } else if ("findById".equals(name)) {
                        Long id = (Long) args[0];
                        return Optional.ofNullable(estimateDb.get(id));
                    } else if ("findAllByOrderByCreatedAtDesc".equals(name)) {
                        List<CostEstimate> list = new ArrayList<>(estimateDb.values());
                        list.sort((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()));
                        return list;
                    } else if ("count".equals(name)) {
                        return (long) estimateDb.size();
                    } else if ("existsById".equals(name)) {
                        Long id = (Long) args[0];
                        return estimateDb.containsKey(id);
                    } else if ("deleteById".equals(name)) {
                        Long id = (Long) args[0];
                        estimateDb.remove(id);
                        return null;
                    }
                    return null;
                }
        );

        // Dynamic Proxy for TargetArchitectureRepository
        architectureRepository = (TargetArchitectureRepository) Proxy.newProxyInstance(
                TargetArchitectureRepository.class.getClassLoader(),
                new Class<?>[]{TargetArchitectureRepository.class},
                (proxy, method, args) -> {
                    String name = method.getName();
                    if ("findByProvider".equals(name)) {
                        String prov = (String) args[0];
                        return Optional.ofNullable(archByProvider.get(prov));
                    }
                    return null;
                }
        );

        // Dynamic Proxy for InfrastructureRepository
        infrastructureRepository = (InfrastructureRepository) Proxy.newProxyInstance(
                InfrastructureRepository.class.getClassLoader(),
                new Class<?>[]{InfrastructureRepository.class},
                (proxy, method, args) -> {
                    String name = method.getName();
                    if ("findAll".equals(name)) {
                        return infraList;
                    } else if ("count".equals(name)) {
                        return (long) infraList.size();
                    }
                    return null;
                }
        );

        finOpsCostService = new FinOpsCostServiceImpl(
                costEstimateRepository,
                architectureRepository,
                infrastructureRepository
        );
    }

    @Test
    @DisplayName("Should calculate AWS On-Demand cost with zero commitment discount")
    void testCalculateCostEstimateAwsOnDemand() {
        CostEstimateRequestDto req = new CostEstimateRequestDto();
        req.setProvider("AWS");
        req.setPricingModel("ON_DEMAND");
        req.setTotalCpuCores(40);
        req.setTotalRamGB(224);
        req.setTotalStorageGB(1950);
        req.setOperatingHoursPerMonth(730);

        CostEstimateResponseDto res = finOpsCostService.calculateCostEstimate(req);

        assertNotNull(res);
        assertEquals("AWS", res.getProvider());
        assertEquals("ON_DEMAND", res.getPricingModel());
        assertEquals(0.0, res.getCommitmentDiscountPercentage());
        assertTrue(res.getComputeMonthlyCost() > 0, "Compute cost should be positive");
        assertTrue(res.getStorageMonthlyCost() > 0, "Storage cost should be positive");
        assertTrue(res.getDatabaseMonthlyCost() > 0, "Database cost should be positive");
        assertTrue(res.getNetworkingMonthlyCost() > 0, "Networking cost should be positive");
        assertTrue(res.getTotalMonthlyCost() > 0, "Total cost should be positive");
        assertEquals(FinOpsCostServiceImpl.ON_PREM_MONTHLY_COST, res.getOnPremCurrentMonthlyCost());
    }

    @Test
    @DisplayName("Should apply 42% commitment discount for AWS 3-Year Savings Plans")
    void testCalculateCostEstimateAwsThreeYearCommitted() {
        CostEstimateRequestDto req = new CostEstimateRequestDto();
        req.setProvider("AWS");
        req.setPricingModel("THREE_YEAR_COMMITTED");
        req.setTotalCpuCores(40);
        req.setTotalRamGB(224);
        req.setTotalStorageGB(1950);
        req.setOperatingHoursPerMonth(730);

        CostEstimateResponseDto res = finOpsCostService.calculateCostEstimate(req);

        assertNotNull(res);
        assertEquals("THREE_YEAR_COMMITTED", res.getPricingModel());
        assertEquals(42.0, res.getCommitmentDiscountPercentage());
        assertTrue(res.getMonthlySavings() > 0, "Should achieve net monthly savings vs on-prem");
        assertTrue(res.getSavingsPercentage() > 25.0, "Savings percentage should be substantial (>25%)");
        assertTrue(res.getFiveYearRoiPercentage() > 100.0, "5-year ROI should exceed 100%");
        assertTrue(res.getPaybackPeriodMonths() > 0 && res.getPaybackPeriodMonths() < 18.0, "Payback should be within 18 months");
    }

    @Test
    @DisplayName("Should compare AWS, Azure, and GCP side-by-side with recommended provider")
    void testCompareProviders() {
        ProviderCostComparisonDto comparison = finOpsCostService.compareProviders("THREE_YEAR_COMMITTED");

        assertNotNull(comparison);
        assertNotNull(comparison.getProviders());
        assertEquals(3, comparison.getProviders().size(), "Must compare 3 cloud providers");

        boolean hasAws = false, hasAzure = false, hasGcp = false;
        for (ProviderCostComparisonDto.ProviderDetailDto p : comparison.getProviders()) {
            if ("AWS".equals(p.getProvider())) hasAws = true;
            if ("AZURE".equals(p.getProvider())) hasAzure = true;
            if ("GCP".equals(p.getProvider())) hasGcp = true;
            assertTrue(p.getMonthlyTotal() > 0);
            assertNotNull(p.getArchitecturalAdvantages());
            assertFalse(p.getArchitecturalAdvantages().isEmpty());
        }
        assertTrue(hasAws && hasAzure && hasGcp, "Must contain AWS, Azure, and GCP");
        assertNotNull(comparison.getRecommendedProvider());
        assertNotNull(comparison.getRecommendationReason());
        assertNotNull(comparison.getPricingDisclaimer());
    }

    @Test
    @DisplayName("Should generate 7 enterprise cost optimization recommendations")
    void testGetOptimizationRecommendations() {
        List<CostOptimizationDto> recs = finOpsCostService.getOptimizationRecommendations();

        assertNotNull(recs);
        assertEquals(7, recs.size(), "Should have 7 prioritized optimization opportunities");

        boolean hasHighPriority = recs.stream().anyMatch(r -> "HIGH".equals(r.getPriority()));
        boolean hasMediumPriority = recs.stream().anyMatch(r -> "MEDIUM".equals(r.getPriority()));
        boolean hasLowPriority = recs.stream().anyMatch(r -> "LOW".equals(r.getPriority()));

        assertTrue(hasHighPriority, "Should include HIGH priority recommendations");
        assertTrue(hasMediumPriority, "Should include MEDIUM priority recommendations");
        assertTrue(hasLowPriority, "Should include LOW priority recommendations");

        for (CostOptimizationDto r : recs) {
            assertNotNull(r.getId());
            assertNotNull(r.getIdentifiedIssue());
            assertNotNull(r.getSuggestedOptimization());
            assertTrue(r.getExpectedMonthlySavings() > 0);
        }
    }

    @Test
    @DisplayName("Should save, retrieve, and delete a cost estimate in database")
    void testSaveAndRetrieveEstimate() {
        CostEstimateRequestDto saveReq = new CostEstimateRequestDto();
        saveReq.setEstimateName("Custom Banking Production Baseline");
        saveReq.setProvider("AWS");
        saveReq.setPricingModel("THREE_YEAR_COMMITTED");
        saveReq.setTotalCpuCores(40);
        saveReq.setTotalRamGB(224);
        saveReq.setTotalStorageGB(1950);
        saveReq.setNotes("Saved during automated test execution.");

        CostEstimateResponseDto saved = finOpsCostService.saveEstimate(saveReq);
        assertNotNull(saved);
        assertNotNull(saved.getId());

        List<CostEstimateResponseDto> allSaved = finOpsCostService.getAllSavedEstimates();
        assertFalse(allSaved.isEmpty());
        assertEquals("Custom Banking Production Baseline", allSaved.get(0).getEstimateName());

        CostEstimateResponseDto fetched = finOpsCostService.getSavedEstimateById(saved.getId());
        assertEquals(saved.getId(), fetched.getId());

        finOpsCostService.deleteSavedEstimate(saved.getId());
        List<CostEstimateResponseDto> remaining = finOpsCostService.getAllSavedEstimates();
        assertTrue(remaining.isEmpty());
    }

    @Test
    @DisplayName("Should simulate What-If cost with reduced dev/test hours and single-AZ DB")
    void testWhatIfSimulationCustomParameters() {
        CostEstimateRequestDto simReq = new CostEstimateRequestDto();
        simReq.setProvider("AZURE");
        simReq.setPricingModel("ONE_YEAR_COMMITTED");
        simReq.setTotalCpuCores(16);
        simReq.setTotalRamGB(64);
        simReq.setTotalStorageGB(500);
        simReq.setOperatingHoursPerMonth(400); // Dev/Test business hours schedule
        simReq.setIsMultiAzDatabase(false);   // Non-prod single-AZ
        simReq.setStorageType("INTELLIGENT_TIER");

        CostEstimateResponseDto res = finOpsCostService.calculateCostEstimate(simReq);

        assertNotNull(res);
        assertEquals("AZURE", res.getProvider());
        assertEquals(400, res.getOperatingHoursPerMonth());
        assertFalse(res.getIsMultiAzDatabase());
        assertTrue(res.getTotalMonthlyCost() < 5000.0, "Dev/test scaled down costs should be under $5,000/mo");
    }
}

