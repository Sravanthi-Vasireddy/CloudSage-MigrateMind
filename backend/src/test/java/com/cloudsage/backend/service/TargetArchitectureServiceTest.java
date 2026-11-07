package com.cloudsage.backend.service;

import com.cloudsage.backend.dto.ArchitectureComparisonDto;
import com.cloudsage.backend.dto.ArchitectureModificationDto;
import com.cloudsage.backend.dto.ArchitectureResponseDto;
import com.cloudsage.backend.entity.Infrastructure;
import com.cloudsage.backend.entity.TargetArchitecture;
import com.cloudsage.backend.repository.InfrastructureRepository;
import com.cloudsage.backend.repository.TargetArchitectureRepository;
import com.cloudsage.backend.repository.WorkloadAssessmentRepository;
import com.cloudsage.backend.service.impl.TargetArchitectureServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Proxy;
import java.util.*;
import java.util.concurrent.atomic.AtomicLong;

import static org.junit.jupiter.api.Assertions.*;

public class TargetArchitectureServiceTest {

    private Map<Long, TargetArchitecture> archDb;
    private Map<String, TargetArchitecture> archByProvider;
    private List<Infrastructure> infraList;
    private AtomicLong idGen;

    private TargetArchitectureRepository architectureRepository;
    private InfrastructureRepository infrastructureRepository;
    private WorkloadAssessmentRepository assessmentRepository;
    private TargetArchitectureService architectureService;

    @BeforeEach
    void setUp() {
        archDb = new HashMap<>();
        archByProvider = new HashMap<>();
        infraList = new ArrayList<>();
        idGen = new AtomicLong(50L);

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

        // Dynamic Proxy for TargetArchitectureRepository
        architectureRepository = (TargetArchitectureRepository) Proxy.newProxyInstance(
                TargetArchitectureRepository.class.getClassLoader(),
                new Class<?>[]{TargetArchitectureRepository.class},
                (proxy, method, args) -> {
                    String name = method.getName();
                    if ("findByProvider".equals(name)) {
                        String prov = (String) args[0];
                        return Optional.ofNullable(archByProvider.get(prov));
                    } else if ("findById".equals(name)) {
                        Long id = (Long) args[0];
                        return Optional.ofNullable(archDb.get(id));
                    } else if ("save".equals(name)) {
                        TargetArchitecture entity = (TargetArchitecture) args[0];
                        if (entity.getId() == null) {
                            entity.setId(idGen.incrementAndGet());
                        }
                        archDb.put(entity.getId(), entity);
                        archByProvider.put(entity.getProvider(), entity);
                        return entity;
                    } else if ("findAllByOrderByCreatedAtDesc".equals(name)) {
                        return new ArrayList<>(archDb.values());
                    } else if ("count".equals(name)) {
                        return (long) archDb.size();
                    } else if ("delete".equals(name)) {
                        TargetArchitecture entity = (TargetArchitecture) args[0];
                        archDb.remove(entity.getId());
                        archByProvider.remove(entity.getProvider());
                        return null;
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

        // Dynamic Proxy for WorkloadAssessmentRepository
        assessmentRepository = (WorkloadAssessmentRepository) Proxy.newProxyInstance(
                WorkloadAssessmentRepository.class.getClassLoader(),
                new Class<?>[]{WorkloadAssessmentRepository.class},
                (proxy, method, args) -> Collections.emptyList()
        );

        architectureService = new TargetArchitectureServiceImpl(
                architectureRepository,
                infrastructureRepository,
                assessmentRepository
        );
    }

    @Test
    @DisplayName("Generate AWS Target Architecture maps correctly to Amazon EKS and Aurora PostgreSQL")
    void testGenerateAwsArchitecture() {
        ArchitectureResponseDto awsArch = architectureService.generateArchitecture("AWS");

        assertNotNull(awsArch);
        assertEquals("AWS", awsArch.getProvider());
        assertTrue(awsArch.getArchitectureName().contains("AWS Enterprise Multi-AZ"));
        assertEquals("us-east-1 (N. Virginia)", awsArch.getPrimaryRegion());
        assertEquals("us-west-2 (Oregon)", awsArch.getSecondaryRegion());
        assertEquals(40, awsArch.getTotalComputeCores()); // 16 + 8 + 16
        assertEquals(224, awsArch.getTotalRamGB()); // 64 + 32 + 128
        assertEquals(1950, awsArch.getTotalStorageGB()); // 500 + 250 + 1200
        assertTrue(awsArch.getPrimaryComputeService().contains("EKS"));
        assertTrue(awsArch.getPrimaryDatabaseService().contains("Aurora"));
        assertTrue(awsArch.getPrimaryStorageService().contains("S3"));
        assertTrue(awsArch.getNodesJson().contains("Amazon EKS"));
    }

    @Test
    @DisplayName("Generate Azure Target Architecture maps correctly to AKS and Azure SQL")
    void testGenerateAzureArchitecture() {
        ArchitectureResponseDto azureArch = architectureService.generateArchitecture("AZURE");

        assertNotNull(azureArch);
        assertEquals("AZURE", azureArch.getProvider());
        assertTrue(azureArch.getArchitectureName().contains("Azure Enterprise"));
        assertEquals("eastus (East US)", azureArch.getPrimaryRegion());
        assertTrue(azureArch.getPrimaryComputeService().contains("AKS"));
        assertTrue(azureArch.getPrimaryDatabaseService().contains("Azure SQL"));
        assertTrue(azureArch.getPrimaryStorageService().contains("Blob Storage"));
        assertTrue(awsArchNodesJson(azureArch.getNodesJson(), "Azure Kubernetes Service"));
    }

    @Test
    @DisplayName("Generate GCP Target Architecture maps correctly to GKE Autopilot and Cloud SQL")
    void testGenerateGcpArchitecture() {
        ArchitectureResponseDto gcpArch = architectureService.generateArchitecture("GCP");

        assertNotNull(gcpArch);
        assertEquals("GCP", gcpArch.getProvider());
        assertTrue(gcpArch.getArchitectureName().contains("Google Cloud"));
        assertEquals("us-central1 (Iowa)", gcpArch.getPrimaryRegion());
        assertTrue(gcpArch.getPrimaryComputeService().contains("GKE"));
        assertTrue(gcpArch.getPrimaryDatabaseService().contains("Cloud SQL"));
        assertTrue(gcpArch.getPrimaryStorageService().contains("Cloud Storage"));
    }

    @Test
    @DisplayName("Multi-Cloud Architecture Comparison matrix contains AWS, Azure, and GCP")
    void testArchitectureComparison() {
        ArchitectureComparisonDto comparison = architectureService.getArchitectureComparison();

        assertNotNull(comparison);
        assertEquals(7, comparison.getServiceMappings().size());
        assertEquals(3, comparison.getProviderSummaries().size());

        // Check providers in summary
        List<String> providers = comparison.getProviderSummaries().stream()
                .map(ArchitectureComparisonDto.ProviderSummaryItem::getProvider)
                .toList();
        assertTrue(providers.contains("AWS"));
        assertTrue(providers.contains("Azure"));
        assertTrue(providers.contains("GCP"));
    }

    @Test
    @DisplayName("Update Architecture toggles Disaster Recovery multi-region")
    void testUpdateArchitectureDR() {
        ArchitectureResponseDto initial = architectureService.generateArchitecture("AWS");
        Long archId = initial.getId();

        ArchitectureModificationDto mod = new ArchitectureModificationDto();
        mod.setIsMultiRegionDR(true);
        mod.setSecondaryRegion("us-west-2 (Oregon Pilot Light)");
        mod.setDescription("Updated with Active-Passive pilot light secondary DR region.");

        ArchitectureResponseDto updated = architectureService.updateArchitecture(archId, mod);

        assertNotNull(updated);
        assertTrue(updated.getIsMultiRegionDR());
        assertEquals("us-west-2 (Oregon Pilot Light)", updated.getSecondaryRegion());
    }

    private boolean awsArchNodesJson(String json, String substring) {
        return json != null && json.contains(substring);
    }
}

