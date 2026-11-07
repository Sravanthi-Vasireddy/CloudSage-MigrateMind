package com.cloudsage.backend.service;

import com.cloudsage.backend.dto.*;
import com.cloudsage.backend.entity.*;
import com.cloudsage.backend.repository.*;
import com.cloudsage.backend.service.impl.MigrationPlanServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Proxy;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.atomic.AtomicLong;

import static org.junit.jupiter.api.Assertions.*;

public class MigrationPlanServiceTest {

    private Map<Long, MigrationPlan> planDb;
    private Map<Long, MigrationWave> waveDb;
    private Map<Long, MigrationTask> taskDb;
    private List<Infrastructure> infraList;
    private AtomicLong idGen;

    private MigrationPlanRepository planRepository;
    private MigrationWaveRepository waveRepository;
    private MigrationTaskRepository taskRepository;
    private InfrastructureRepository infrastructureRepository;
    private WorkloadAssessmentRepository assessmentRepository;
    private TargetArchitectureRepository architectureRepository;
    private CostEstimateRepository costEstimateRepository;
    private MigrationPlanService migrationPlanService;

    @BeforeEach
    void setUp() {
        planDb = new HashMap<>();
        waveDb = new HashMap<>();
        taskDb = new HashMap<>();
        infraList = new ArrayList<>();
        idGen = new AtomicLong(200L);

        // Seed 3 sample infrastructure workloads
        Infrastructure s1 = new Infrastructure();
        s1.setId(1L);
        s1.setWorkloadName("Core Banking Engine");
        s1.setCpuCores(16);
        infraList.add(s1);

        Infrastructure s2 = new Infrastructure();
        s2.setId(2L);
        s2.setWorkloadName("E-Commerce Web Portal");
        s2.setCpuCores(8);
        infraList.add(s2);

        Infrastructure s3 = new Infrastructure();
        s3.setId(3L);
        s3.setWorkloadName("CRM Database Cluster");
        s3.setCpuCores(16);
        infraList.add(s3);

        // Dynamic Proxy for MigrationPlanRepository
        planRepository = (MigrationPlanRepository) Proxy.newProxyInstance(
                MigrationPlanRepository.class.getClassLoader(),
                new Class<?>[]{MigrationPlanRepository.class},
                (proxy, method, args) -> {
                    String name = method.getName();
                    if ("save".equals(name)) {
                        MigrationPlan p = (MigrationPlan) args[0];
                        if (p.getId() == null) p.setId(idGen.incrementAndGet());
                        if (p.getCreatedAt() == null) p.setCreatedAt(LocalDateTime.now());
                        planDb.put(p.getId(), p);
                        return p;
                    } else if ("findById".equals(name)) {
                        Long id = (Long) args[0];
                        return Optional.ofNullable(planDb.get(id));
                    } else if ("findFirstByOrderByCreatedAtDesc".equals(name)) {
                        return planDb.values().stream().findFirst();
                    } else if ("count".equals(name)) {
                        return (long) planDb.size();
                    }
                    return null;
                }
        );

        // Dynamic Proxy for MigrationWaveRepository
        waveRepository = (MigrationWaveRepository) Proxy.newProxyInstance(
                MigrationWaveRepository.class.getClassLoader(),
                new Class<?>[]{MigrationWaveRepository.class},
                (proxy, method, args) -> {
                    String name = method.getName();
                    if ("save".equals(name)) {
                        MigrationWave w = (MigrationWave) args[0];
                        if (w.getId() == null) w.setId(idGen.incrementAndGet());
                        if (w.getCreatedAt() == null) w.setCreatedAt(LocalDateTime.now());
                        waveDb.put(w.getId(), w);
                        return w;
                    } else if ("findById".equals(name)) {
                        Long id = (Long) args[0];
                        return Optional.ofNullable(waveDb.get(id));
                    } else if ("findByMigrationPlanIdOrderBySortOrderAsc".equals(name)) {
                        List<MigrationWave> list = new ArrayList<>(waveDb.values());
                        list.sort(Comparator.comparing(w -> w.getSortOrder() != null ? w.getSortOrder() : 0));
                        return list;
                    } else if ("count".equals(name)) {
                        return (long) waveDb.size();
                    }
                    return null;
                }
        );

        // Dynamic Proxy for MigrationTaskRepository
        taskRepository = (MigrationTaskRepository) Proxy.newProxyInstance(
                MigrationTaskRepository.class.getClassLoader(),
                new Class<?>[]{MigrationTaskRepository.class},
                (proxy, method, args) -> {
                    String name = method.getName();
                    if ("save".equals(name)) {
                        MigrationTask t = (MigrationTask) args[0];
                        if (t.getId() == null) t.setId(idGen.incrementAndGet());
                        if (t.getCreatedAt() == null) t.setCreatedAt(LocalDateTime.now());
                        taskDb.put(t.getId(), t);
                        return t;
                    } else if ("findById".equals(name)) {
                        Long id = (Long) args[0];
                        return Optional.ofNullable(taskDb.get(id));
                    } else if ("findByMigrationPlanIdOrderByDueDateAsc".equals(name)) {
                        List<MigrationTask> list = new ArrayList<>(taskDb.values());
                        list.sort(Comparator.comparing(t -> t.getDueDate() != null ? t.getDueDate() : LocalDate.now()));
                        return list;
                    } else if ("findByWaveIdOrderByDueDateAsc".equals(name)) {
                        Long wId = (Long) args[0];
                        List<MigrationTask> list = new ArrayList<>();
                        for (MigrationTask t : taskDb.values()) {
                            if (wId.equals(t.getWaveId())) list.add(t);
                        }
                        return list;
                    } else if ("findByStatus".equals(name)) {
                        String st = (String) args[0];
                        List<MigrationTask> list = new ArrayList<>();
                        for (MigrationTask t : taskDb.values()) {
                            if (st.equals(t.getStatus())) list.add(t);
                        }
                        return list;
                    } else if ("findAll".equals(name)) {
                        return new ArrayList<>(taskDb.values());
                    } else if ("delete".equals(name)) {
                        MigrationTask t = (MigrationTask) args[0];
                        taskDb.remove(t.getId());
                        return null;
                    }
                    return null;
                }
        );

        // Stubs for remaining repos
        infrastructureRepository = (InfrastructureRepository) Proxy.newProxyInstance(
                InfrastructureRepository.class.getClassLoader(),
                new Class<?>[]{InfrastructureRepository.class},
                (p, m, a) -> "findAll".equals(m.getName()) ? infraList : null
        );

        assessmentRepository = (WorkloadAssessmentRepository) Proxy.newProxyInstance(
                WorkloadAssessmentRepository.class.getClassLoader(),
                new Class<?>[]{WorkloadAssessmentRepository.class},
                (p, m, a) -> Collections.emptyList()
        );

        architectureRepository = (TargetArchitectureRepository) Proxy.newProxyInstance(
                TargetArchitectureRepository.class.getClassLoader(),
                new Class<?>[]{TargetArchitectureRepository.class},
                (p, m, a) -> Optional.empty()
        );

        costEstimateRepository = (CostEstimateRepository) Proxy.newProxyInstance(
                CostEstimateRepository.class.getClassLoader(),
                new Class<?>[]{CostEstimateRepository.class},
                (p, m, a) -> Collections.emptyList()
        );

        migrationPlanService = new MigrationPlanServiceImpl(
                planRepository,
                waveRepository,
                taskRepository,
                infrastructureRepository,
                assessmentRepository,
                architectureRepository,
                costEstimateRepository
        );
    }

    @Test
    @DisplayName("Should generate migration plan with 5 waves and enterprise tasks")
    void testGenerateOrGetActivePlan() {
        MigrationPlanDto plan = migrationPlanService.generateOrGetActivePlan("AWS");

        assertNotNull(plan);
        assertEquals("AWS", plan.getCloudProvider());
        assertNotNull(plan.getWaves());
        assertEquals(5, plan.getWaves().size(), "Plan must contain exactly 5 standard migration waves");

        // Verify the 5 standard waves
        assertEquals("Wave 1 – Pilot Migration", plan.getWaves().get(0).getWaveName());
        assertEquals("Wave 2 – Low Complexity Workloads", plan.getWaves().get(1).getWaveName());
        assertEquals("Wave 3 – Medium Complexity Workloads", plan.getWaves().get(2).getWaveName());
        assertEquals("Wave 4 – High Complexity Workloads", plan.getWaves().get(3).getWaveName());
        assertEquals("Wave 5 – Final Migration and Optimization", plan.getWaves().get(4).getWaveName());

        assertNotNull(plan.getTasks());
        assertFalse(plan.getTasks().isEmpty(), "Tasks should be generated across waves");
    }

    @Test
    @DisplayName("Should update migration wave details and workload assignments")
    void testUpdateWave() {
        MigrationPlanDto plan = migrationPlanService.generateOrGetActivePlan("AWS");
        Long wave1Id = plan.getWaves().get(0).getId();

        MigrationWaveUpdateRequestDto updateReq = new MigrationWaveUpdateRequestDto();
        updateReq.setWaveName("Wave 1 – Pilot & Security Foundation");
        updateReq.setDescription("Updated wave description for pilot test.");
        updateReq.setWaveLead("David Chen (DevOps / IaC)");
        updateReq.setWorkloadNames(Arrays.asList("Keycloak SSO", "Store Associate Portal"));

        MigrationWaveDto updated = migrationPlanService.updateWave(wave1Id, updateReq);

        assertNotNull(updated);
        assertEquals("Wave 1 – Pilot & Security Foundation", updated.getWaveName());
        assertEquals("David Chen (DevOps / IaC)", updated.getWaveLead());
        assertTrue(updated.getWorkloadNames().contains("Store Associate Portal"));
    }

    @Test
    @DisplayName("Should reorder migration waves")
    void testReorderWaves() {
        MigrationPlanDto plan = migrationPlanService.generateOrGetActivePlan("AWS");
        Long w1 = plan.getWaves().get(0).getId();
        Long w2 = plan.getWaves().get(1).getId();
        Long w3 = plan.getWaves().get(2).getId();

        // Reverse order of first 3 waves
        migrationPlanService.reorderWaves(Arrays.asList(w3, w2, w1));

        MigrationPlanDto refreshed = migrationPlanService.getActivePlan();
        assertEquals(w3, refreshed.getWaves().get(0).getId());
        assertEquals(w2, refreshed.getWaves().get(1).getId());
        assertEquals(w1, refreshed.getWaves().get(2).getId());
    }

    @Test
    @DisplayName("Should create task, update status to COMPLETED, and recalculate progress")
    void testTaskCrudAndProgressCalculation() {
        MigrationPlanDto plan = migrationPlanService.generateOrGetActivePlan("AWS");
        Long wave4Id = plan.getWaves().get(3).getId();

        MigrationTaskCreateRequestDto createReq = new MigrationTaskCreateRequestDto();
        createReq.setWaveId(wave4Id);
        createReq.setWorkloadName("Core Banking Engine");
        createReq.setTaskTitle("Test Failover Simulation to Secondary AWS Region");
        createReq.setDescription("Simulate RDS Aurora automated failover within 30 seconds.");
        createReq.setAssignedTo("Priya Sharma (Database Specialist)");
        createReq.setPriority("CRITICAL");
        createReq.setStatus("NOT_STARTED");
        createReq.setEstimatedHours(12.0);

        MigrationTaskDto created = migrationPlanService.createTask(createReq);
        assertNotNull(created);
        assertNotNull(created.getId());
        assertEquals("NOT_STARTED", created.getStatus());

        // Update task to COMPLETED
        MigrationTaskUpdateRequestDto updateReq = new MigrationTaskUpdateRequestDto();
        updateReq.setStatus("COMPLETED");
        MigrationTaskDto updated = migrationPlanService.updateTask(created.getId(), updateReq);
        assertEquals("COMPLETED", updated.getStatus());

        // Check progress summary
        MigrationProgressSummaryDto summary = migrationPlanService.getProgressSummary();
        assertTrue(summary.getCompletedTasks() > 0);
        assertTrue(summary.getOverallProgressPercentage() > 0.0);
    }

    @Test
    @DisplayName("Should retrieve progress summary with wave breakdown and categories")
    void testGetProgressSummary() {
        migrationPlanService.generateOrGetActivePlan("AWS");
        MigrationProgressSummaryDto summary = migrationPlanService.getProgressSummary();

        assertNotNull(summary);
        assertTrue(summary.getTotalTasks() > 0);
        assertNotNull(summary.getWaveProgressList());
        assertEquals(5, summary.getWaveProgressList().size());
        assertNotNull(summary.getTasksByCategory());
        assertTrue(summary.getTasksByCategory().containsKey("FOUNDATION"));
    }

    @Test
    @DisplayName("Should identify risks, blockers, and dependencies with mitigation actions")
    void testGetRisksAndDependencies() {
        migrationPlanService.generateOrGetActivePlan("AWS");
        RiskAndDependencyDto risks = migrationPlanService.getRisksAndDependencies();

        assertNotNull(risks);
        assertNotNull(risks.getWorkloadDependencies());
        assertFalse(risks.getWorkloadDependencies().isEmpty());
        assertNotNull(risks.getHighRiskWorkloads());
        assertFalse(risks.getHighRiskWorkloads().isEmpty());
        assertNotNull(risks.getMigrationBlockers());
        assertFalse(risks.getMigrationBlockers().isEmpty());
        assertNotNull(risks.getScheduleConflicts());
    }
}

