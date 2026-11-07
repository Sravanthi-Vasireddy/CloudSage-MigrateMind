package com.cloudsage.backend.service;

import com.cloudsage.backend.dto.AssessmentOverrideDto;
import com.cloudsage.backend.dto.AssessmentResponseDto;
import com.cloudsage.backend.dto.AssessmentSummaryDto;
import com.cloudsage.backend.entity.Infrastructure;
import com.cloudsage.backend.entity.WorkloadAssessment;
import com.cloudsage.backend.repository.InfrastructureRepository;
import com.cloudsage.backend.repository.WorkloadAssessmentRepository;
import com.cloudsage.backend.service.impl.WorkloadAssessmentServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Proxy;
import java.util.*;
import java.util.concurrent.atomic.AtomicLong;

import static org.junit.jupiter.api.Assertions.*;

public class WorkloadAssessmentServiceTest {

    private Map<Long, Infrastructure> infraDb;
    private Map<Long, WorkloadAssessment> assessDb;
    private AtomicLong assessIdGen;

    private InfrastructureRepository infrastructureRepository;
    private WorkloadAssessmentRepository assessmentRepository;
    private WorkloadAssessmentService assessmentService;

    @BeforeEach
    void setUp() {
        infraDb = new HashMap<>();
        assessDb = new HashMap<>();
        assessIdGen = new AtomicLong(100L);

        // Lightweight proxy for InfrastructureRepository (avoids bytebuddy named pipe IPC in sandbox)
        infrastructureRepository = (InfrastructureRepository) Proxy.newProxyInstance(
                InfrastructureRepository.class.getClassLoader(),
                new Class<?>[]{InfrastructureRepository.class},
                (proxy, method, args) -> {
                    String name = method.getName();
                    if ("findById".equals(name)) {
                        Long id = (Long) args[0];
                        return Optional.ofNullable(infraDb.get(id));
                    } else if ("count".equals(name)) {
                        return (long) infraDb.size();
                    } else if ("findAll".equals(name)) {
                        return new ArrayList<>(infraDb.values());
                    }
                    return null;
                }
        );

        // Lightweight proxy for WorkloadAssessmentRepository
        assessmentRepository = (WorkloadAssessmentRepository) Proxy.newProxyInstance(
                WorkloadAssessmentRepository.class.getClassLoader(),
                new Class<?>[]{WorkloadAssessmentRepository.class},
                (proxy, method, args) -> {
                    String name = method.getName();
                    if ("findByInfrastructureId".equals(name)) {
                        Long infraId = (Long) args[0];
                        return assessDb.values().stream()
                                .filter(a -> infraId.equals(a.getInfrastructureId()))
                                .findFirst();
                    } else if ("findById".equals(name)) {
                        Long id = (Long) args[0];
                        return Optional.ofNullable(assessDb.get(id));
                    } else if ("save".equals(name)) {
                        WorkloadAssessment entity = (WorkloadAssessment) args[0];
                        if (entity.getId() == null) {
                            entity.setId(assessIdGen.incrementAndGet());
                        }
                        assessDb.put(entity.getId(), entity);
                        return entity;
                    } else if ("findAll".equals(name)) {
                        return new ArrayList<>(assessDb.values());
                    } else if ("count".equals(name)) {
                        return (long) assessDb.size();
                    } else if ("delete".equals(name)) {
                        WorkloadAssessment entity = (WorkloadAssessment) args[0];
                        assessDb.remove(entity.getId());
                        return null;
                    }
                    return null;
                }
        );

        assessmentService = new WorkloadAssessmentServiceImpl(assessmentRepository, infrastructureRepository);

        // Seed sample workloads
        Infrastructure bankingServer = new Infrastructure();
        bankingServer.setId(1L);
        bankingServer.setWorkloadName("Core Banking Engine");
        bankingServer.setApplicationName("FinCore Suite");
        bankingServer.setServerName("prod-fin-app-01.corp.internal");
        bankingServer.setOperatingSystem("Red Hat Enterprise Linux 8.8");
        bankingServer.setCpuCores(16);
        bankingServer.setRamGB(64);
        bankingServer.setStorageGB(500);
        bankingServer.setDatabaseType("Oracle 19c RAC");
        bankingServer.setEnvironment("Production");
        bankingServer.setBusinessCriticality("Mission Critical");
        bankingServer.setDescription("Primary transactional core banking ledger handling account deposits, withdrawals, and wire transfers.");
        infraDb.put(1L, bankingServer);

        Infrastructure ecommerceServer = new Infrastructure();
        ecommerceServer.setId(2L);
        ecommerceServer.setWorkloadName("E-Commerce Web Portal");
        ecommerceServer.setApplicationName("ShopSphere Online");
        ecommerceServer.setServerName("prod-shop-web-01.dmz.internal");
        ecommerceServer.setOperatingSystem("Ubuntu Server 22.04 LTS");
        ecommerceServer.setCpuCores(8);
        ecommerceServer.setRamGB(32);
        ecommerceServer.setStorageGB(250);
        ecommerceServer.setDatabaseType("PostgreSQL 15");
        ecommerceServer.setEnvironment("Production");
        ecommerceServer.setBusinessCriticality("High");
        ecommerceServer.setDescription("Customer-facing web tier handling product catalogs, search, shopping cart, and checkout workflows.");
        infraDb.put(2L, ecommerceServer);

        Infrastructure crmServer = new Infrastructure();
        crmServer.setId(3L);
        crmServer.setWorkloadName("CRM Database Cluster");
        crmServer.setApplicationName("Enterprise Client360");
        crmServer.setServerName("prod-crm-db-01.corp.internal");
        crmServer.setOperatingSystem("Windows Server 2022");
        crmServer.setCpuCores(16);
        crmServer.setRamGB(128);
        crmServer.setStorageGB(1200);
        crmServer.setDatabaseType("Microsoft SQL Server 2022");
        crmServer.setEnvironment("Production");
        crmServer.setBusinessCriticality("High");
        crmServer.setDescription("Centralized customer relationship management data store housing enterprise contact records and interactions.");
        infraDb.put(3L, crmServer);
    }

    @Test
    @DisplayName("Evaluate Core Banking Server recommends Replatform due to Oracle DB tier")
    void testEvaluateCoreBankingRecommendsReplatform() {
        AssessmentResponseDto response = assessmentService.evaluateInfrastructureWorkload(1L);

        assertNotNull(response);
        assertEquals("Replatform", response.getRecommendedStrategy());
        assertEquals("Replatform", response.getSelectedStrategy());
        assertEquals("High", response.getMigrationComplexity());
        assertFalse(response.getIsOverridden());
        assertTrue(response.getRecommendationRationale().contains("Amazon RDS"));
    }

    @Test
    @DisplayName("Evaluate E-Commerce Web Portal recommends Refactor for cloud-native microservices")
    void testEvaluateEcommerceRecommendsRefactor() {
        AssessmentResponseDto response = assessmentService.evaluateInfrastructureWorkload(2L);

        assertNotNull(response);
        assertEquals("Refactor", response.getRecommendedStrategy());
        assertEquals("Refactor", response.getSelectedStrategy());
        assertEquals("High", response.getMigrationComplexity());
        assertTrue(response.getReadinessScore() >= 80);
    }

    @Test
    @DisplayName("Evaluate CRM Application recommends Repurchase for modern SaaS migration")
    void testEvaluateCrmRecommendsRepurchase() {
        AssessmentResponseDto response = assessmentService.evaluateInfrastructureWorkload(3L);

        assertNotNull(response);
        assertEquals("Repurchase", response.getRecommendedStrategy());
        assertEquals("Repurchase", response.getSelectedStrategy());
    }

    @Test
    @DisplayName("Manual override successfully modifies selected 6R strategy and records reason")
    void testManualOverrideStrategy() {
        AssessmentResponseDto initial = assessmentService.evaluateInfrastructureWorkload(1L);
        Long assessmentId = initial.getId();

        AssessmentOverrideDto overrideDto = new AssessmentOverrideDto(
                "Refactor",
                "Client requested full cloud-native rewrite for next-gen core banking"
        );
        AssessmentResponseDto result = assessmentService.overrideStrategy(assessmentId, overrideDto);

        assertNotNull(result);
        assertEquals("Replatform", result.getRecommendedStrategy()); // Original recommendation preserved
        assertEquals("Refactor", result.getSelectedStrategy()); // Selected strategy updated
        assertTrue(result.getIsOverridden());
        assertEquals("Client requested full cloud-native rewrite for next-gen core banking", result.getOverrideReason());
    }

    @Test
    @DisplayName("Assessment summary aggregates 6Rs distribution correctly")
    void testGetAssessmentSummary() {
        assessmentService.evaluateAllWorkloads();

        AssessmentSummaryDto summary = assessmentService.getAssessmentSummary();

        assertNotNull(summary);
        assertEquals(3L, summary.getTotalWorkloads());
        assertEquals(3L, summary.getAssessedWorkloads());
        assertEquals(1L, summary.getStrategyDistribution().get("Replatform"));
        assertEquals(1L, summary.getStrategyDistribution().get("Refactor"));
        assertEquals(1L, summary.getStrategyDistribution().get("Repurchase"));
        assertTrue(summary.getAverageReadinessScore() > 80.0);
        assertEquals(0L, summary.getOverriddenCount());
    }
}
