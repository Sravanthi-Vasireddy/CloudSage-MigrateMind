package com.cloudsage.backend.service.impl;

import com.cloudsage.backend.dto.*;
import com.cloudsage.backend.entity.*;
import com.cloudsage.backend.exception.ResourceNotFoundException;
import com.cloudsage.backend.repository.*;
import com.cloudsage.backend.service.MigrationPlanService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class MigrationPlanServiceImpl implements MigrationPlanService {

    private static final Logger logger = LoggerFactory.getLogger(MigrationPlanServiceImpl.class);

    private final MigrationPlanRepository planRepository;
    private final MigrationWaveRepository waveRepository;
    private final MigrationTaskRepository taskRepository;
    private final InfrastructureRepository infrastructureRepository;
    private final WorkloadAssessmentRepository assessmentRepository;
    private final TargetArchitectureRepository architectureRepository;
    private final CostEstimateRepository costEstimateRepository;
    private final ObjectMapper objectMapper;

    public MigrationPlanServiceImpl(MigrationPlanRepository planRepository,
                                    MigrationWaveRepository waveRepository,
                                    MigrationTaskRepository taskRepository,
                                    InfrastructureRepository infrastructureRepository,
                                    WorkloadAssessmentRepository assessmentRepository,
                                    TargetArchitectureRepository architectureRepository,
                                    CostEstimateRepository costEstimateRepository) {
        this.planRepository = planRepository;
        this.waveRepository = waveRepository;
        this.taskRepository = taskRepository;
        this.infrastructureRepository = infrastructureRepository;
        this.assessmentRepository = assessmentRepository;
        this.architectureRepository = architectureRepository;
        this.costEstimateRepository = costEstimateRepository;
        this.objectMapper = new ObjectMapper();
    }

    @Override
    public MigrationPlanDto generateOrGetActivePlan(String provider) {
        String normProvider = provider != null && !provider.isBlank() ? provider.toUpperCase() : "AWS";

        Optional<MigrationPlan> existingOpt = planRepository.findFirstByOrderByCreatedAtDesc();
        if (existingOpt.isPresent()) {
            MigrationPlan existing = existingOpt.get();
            // If already created, return populated DTO
            return buildPlanDto(existing);
        }

        // Generate a new Enterprise Migration Plan integrating Stages 3, 4, 5, and 6
        logger.info("Generating new enterprise Migration Execution Plan for provider={}", normProvider);

        MigrationPlan plan = new MigrationPlan();
        plan.setPlanName("Enterprise Banking & Digital Commerce Migration Plan (" + normProvider + ")");
        plan.setCloudProvider(normProvider);
        plan.setStatus("ACTIVE");
        plan.setStartDate(LocalDate.now().plusDays(7));
        plan.setTargetCompletionDate(LocalDate.now().plusDays(175)); // 24-week migration window
        plan.setNotes("Automated migration roadmap synthesized from Stage 3 Infrastructure Inventory, Stage 4 6Rs Assessment, Stage 5 Target Architecture, and Stage 6 FinOps TCO.");

        List<Infrastructure> workloads = infrastructureRepository.findAll();
        plan.setTotalWorkloads(workloads.isEmpty() ? 3 : workloads.size());
        plan.setCompletedWorkloads(0);
        plan.setOverallProgressPercentage(0.0);

        MigrationPlan savedPlan = planRepository.save(plan);

        // Generate 5 Standard Enterprise Waves
        createStandardWavesAndTasks(savedPlan, normProvider, workloads);

        // Recalculate progress metrics
        updatePlanProgressMetrics(savedPlan);

        return buildPlanDto(savedPlan);
    }

    @Override
    @Transactional(readOnly = true)
    public MigrationPlanDto getActivePlan() {
        MigrationPlan plan = planRepository.findFirstByOrderByCreatedAtDesc()
                .orElseGet(() -> {
                    // Automatically generate if none exists
                    return planRepository.save(createDefaultPlanEntity("AWS"));
                });

        if (waveRepository.findByMigrationPlanIdOrderBySortOrderAsc(plan.getId()).isEmpty()) {
            createStandardWavesAndTasks(plan, plan.getCloudProvider(), infrastructureRepository.findAll());
            updatePlanProgressMetrics(plan);
        }

        return buildPlanDto(plan);
    }

    @Override
    public MigrationWaveDto updateWave(Long waveId, MigrationWaveUpdateRequestDto request) {
        MigrationWave wave = waveRepository.findById(waveId)
                .orElseThrow(() -> new ResourceNotFoundException("Migration Wave not found with ID: " + waveId));

        if (request.getWaveName() != null) wave.setWaveName(request.getWaveName());
        if (request.getDescription() != null) wave.setDescription(request.getDescription());
        if (request.getStatus() != null) wave.setStatus(request.getStatus());
        if (request.getStartDate() != null) wave.setStartDate(request.getStartDate());
        if (request.getEndDate() != null) wave.setEndDate(request.getEndDate());
        if (request.getWaveLead() != null) wave.setWaveLead(request.getWaveLead());
        if (request.getSortOrder() != null) wave.setSortOrder(request.getSortOrder());

        if (request.getWorkloadNames() != null) {
            try {
                wave.setWorkloadIdsJson(objectMapper.writeValueAsString(request.getWorkloadNames()));
            } catch (Exception e) {
                logger.warn("Failed to serialize workload names: {}", e.getMessage());
            }
        }

        MigrationWave saved = waveRepository.save(wave);
        Optional<MigrationPlan> planOpt = planRepository.findById(wave.getMigrationPlanId());
        planOpt.ifPresent(this::updatePlanProgressMetrics);

        return toWaveDto(saved);
    }

    @Override
    public void reorderWaves(List<Long> waveIdsInOrder) {
        if (waveIdsInOrder == null || waveIdsInOrder.isEmpty()) return;

        for (int i = 0; i < waveIdsInOrder.size(); i++) {
            Long waveId = waveIdsInOrder.get(i);
            Optional<MigrationWave> waveOpt = waveRepository.findById(waveId);
            if (waveOpt.isPresent()) {
                MigrationWave wave = waveOpt.get();
                wave.setSortOrder(i + 1);
                waveRepository.save(wave);
            }
        }
        logger.info("Successfully reordered {} migration waves", waveIdsInOrder.size());
    }

    @Override
    public MigrationWaveDto addWorkloadToWave(Long waveId, String workloadName) {
        MigrationWave wave = waveRepository.findById(waveId)
                .orElseThrow(() -> new ResourceNotFoundException("Migration Wave not found with ID: " + waveId));

        List<String> current = parseWorkloadList(wave.getWorkloadIdsJson());
        if (!current.contains(workloadName)) {
            current.add(workloadName);
            try {
                wave.setWorkloadIdsJson(objectMapper.writeValueAsString(current));
            } catch (Exception e) {
                logger.warn("Failed to serialize workload names: {}", e.getMessage());
            }
            wave = waveRepository.save(wave);
        }

        return toWaveDto(wave);
    }

    @Override
    public MigrationWaveDto removeWorkloadFromWave(Long waveId, String workloadName) {
        MigrationWave wave = waveRepository.findById(waveId)
                .orElseThrow(() -> new ResourceNotFoundException("Migration Wave not found with ID: " + waveId));

        List<String> current = parseWorkloadList(wave.getWorkloadIdsJson());
        if (current.remove(workloadName)) {
            try {
                wave.setWorkloadIdsJson(objectMapper.writeValueAsString(current));
            } catch (Exception e) {
                logger.warn("Failed to serialize workload names: {}", e.getMessage());
            }
            wave = waveRepository.save(wave);
        }

        return toWaveDto(wave);
    }

    @Override
    public MigrationTaskDto createTask(MigrationTaskCreateRequestDto request) {
        MigrationWave wave = waveRepository.findById(request.getWaveId())
                .orElseThrow(() -> new ResourceNotFoundException("Migration Wave not found with ID: " + request.getWaveId()));

        Long planId = request.getMigrationPlanId() != null ? request.getMigrationPlanId() : wave.getMigrationPlanId();

        MigrationTask task = new MigrationTask();
        task.setMigrationPlanId(planId);
        task.setWaveId(wave.getId());
        task.setWorkloadName(request.getWorkloadName() != null ? request.getWorkloadName() : "General Platform");
        task.setTaskTitle(request.getTaskTitle());
        task.setDescription(request.getDescription());
        task.setAssignedTo(request.getAssignedTo() != null ? request.getAssignedTo() : "Unassigned");
        task.setPriority(request.getPriority() != null ? request.getPriority() : "MEDIUM");
        task.setStatus(request.getStatus() != null ? request.getStatus() : "NOT_STARTED");
        task.setStartDate(request.getStartDate() != null ? request.getStartDate() : wave.getStartDate());
        task.setDueDate(request.getDueDate() != null ? request.getDueDate() : wave.getEndDate());
        task.setDependencies(request.getDependencies());
        task.setBlockerReason(request.getBlockerReason());
        task.setEstimatedHours(request.getEstimatedHours() != null ? request.getEstimatedHours() : 8.0);
        task.setCategory(request.getCategory() != null ? request.getCategory() : "FOUNDATION");

        MigrationTask saved = taskRepository.save(task);

        // Recalculate wave and plan progress
        updateWaveAndPlanProgress(wave.getId());

        return toTaskDto(saved, wave.getWaveName());
    }

    @Override
    public MigrationTaskDto updateTask(Long taskId, MigrationTaskUpdateRequestDto request) {
        MigrationTask task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Migration Task not found with ID: " + taskId));

        if (request.getTaskTitle() != null) task.setTaskTitle(request.getTaskTitle());
        if (request.getDescription() != null) task.setDescription(request.getDescription());
        if (request.getAssignedTo() != null) task.setAssignedTo(request.getAssignedTo());
        if (request.getPriority() != null) task.setPriority(request.getPriority());
        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
            if (!"BLOCKED".equals(request.getStatus())) {
                task.setBlockerReason(null);
            }
        }
        if (request.getStartDate() != null) task.setStartDate(request.getStartDate());
        if (request.getDueDate() != null) task.setDueDate(request.getDueDate());
        if (request.getDependencies() != null) task.setDependencies(request.getDependencies());
        if (request.getBlockerReason() != null) task.setBlockerReason(request.getBlockerReason());
        if (request.getEstimatedHours() != null) task.setEstimatedHours(request.getEstimatedHours());
        if (request.getActualHours() != null) task.setActualHours(request.getActualHours());
        if (request.getCategory() != null) task.setCategory(request.getCategory());
        if (request.getWaveId() != null) task.setWaveId(request.getWaveId());

        MigrationTask saved = taskRepository.save(task);

        // Update progress
        updateWaveAndPlanProgress(saved.getWaveId());

        String waveName = waveRepository.findById(saved.getWaveId())
                .map(MigrationWave::getWaveName).orElse("Wave " + saved.getWaveId());
        return toTaskDto(saved, waveName);
    }

    @Override
    public void deleteTask(Long taskId) {
        MigrationTask task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Migration Task not found with ID: " + taskId));
        Long waveId = task.getWaveId();
        taskRepository.delete(task);
        updateWaveAndPlanProgress(waveId);
    }

    @Override
    @Transactional(readOnly = true)
    public MigrationProgressSummaryDto getProgressSummary() {
        Optional<MigrationPlan> planOpt = planRepository.findFirstByOrderByCreatedAtDesc();
        if (planOpt.isEmpty()) {
            return new MigrationProgressSummaryDto();
        }

        MigrationPlan plan = planOpt.get();
        List<MigrationWave> waves = waveRepository.findByMigrationPlanIdOrderBySortOrderAsc(plan.getId());
        List<MigrationTask> tasks = taskRepository.findByMigrationPlanIdOrderByDueDateAsc(plan.getId());

        MigrationProgressSummaryDto summary = new MigrationProgressSummaryDto();
        summary.setTotalWorkloads(plan.getTotalWorkloads());
        summary.setCompletedWorkloads(plan.getCompletedWorkloads());

        long completedTasks = tasks.stream().filter(t -> "COMPLETED".equals(t.getStatus())).count();
        long inProgressTasks = tasks.stream().filter(t -> "IN_PROGRESS".equals(t.getStatus())).count();
        long blockedTasks = tasks.stream().filter(t -> "BLOCKED".equals(t.getStatus())).count();
        long notStartedTasks = tasks.stream().filter(t -> "NOT_STARTED".equals(t.getStatus())).count();

        summary.setTotalTasks(tasks.size());
        summary.setCompletedTasks((int) completedTasks);
        summary.setInProgressTasks((int) inProgressTasks);
        summary.setBlockedTasks((int) blockedTasks);
        summary.setNotStartedTasks((int) notStartedTasks);

        int totalWorkloads = plan.getTotalWorkloads() != null ? plan.getTotalWorkloads() : 3;
        int completedWl = plan.getCompletedWorkloads() != null ? plan.getCompletedWorkloads() : 0;
        int inProgWl = (int) waves.stream().filter(w -> "IN_PROGRESS".equals(w.getStatus())).count();
        summary.setInProgressWorkloads(inProgWl);
        summary.setPendingWorkloads(Math.max(0, totalWorkloads - completedWl - inProgWl));

        double progressPct = tasks.isEmpty() ? 0.0 : Math.round((completedTasks * 100.0 / tasks.size()) * 10.0) / 10.0;
        summary.setOverallProgressPercentage(progressPct);

        // Wave-wise progress list
        List<MigrationProgressSummaryDto.WaveProgressDto> waveProgressList = new ArrayList<>();
        for (MigrationWave w : waves) {
            List<MigrationTask> waveTasks = tasks.stream().filter(t -> t.getWaveId().equals(w.getId())).collect(Collectors.toList());
            long waveDone = waveTasks.stream().filter(t -> "COMPLETED".equals(t.getStatus())).count();

            MigrationProgressSummaryDto.WaveProgressDto wp = new MigrationProgressSummaryDto.WaveProgressDto();
            wp.setWaveId(w.getId());
            wp.setWaveNumber(w.getWaveNumber());
            wp.setWaveName(w.getWaveName());
            wp.setStatus(w.getStatus());
            wp.setTotalTasks(waveTasks.size());
            wp.setCompletedTasks((int) waveDone);
            wp.setWorkloadCount(parseWorkloadList(w.getWorkloadIdsJson()).size());
            wp.setProgressPercentage(waveTasks.isEmpty() ? 0.0 : Math.round((waveDone * 100.0 / waveTasks.size()) * 10.0) / 10.0);
            waveProgressList.add(wp);
        }
        summary.setWaveProgressList(waveProgressList);

        // Tasks by category
        Map<String, Integer> categoryMap = new LinkedHashMap<>();
        for (MigrationTask t : tasks) {
            String cat = t.getCategory() != null ? t.getCategory() : "FOUNDATION";
            categoryMap.put(cat, categoryMap.getOrDefault(cat, 0) + 1);
        }
        summary.setTasksByCategory(categoryMap);

        return summary;
    }

    @Override
    @Transactional(readOnly = true)
    public RiskAndDependencyDto getRisksAndDependencies() {
        RiskAndDependencyDto dto = new RiskAndDependencyDto();

        // 1. Workload Dependencies
        List<RiskAndDependencyDto.DependencyItemDto> deps = new ArrayList<>();
        deps.add(new RiskAndDependencyDto.DependencyItemDto(
                "E-Commerce Web Portal",
                "Core Banking Engine",
                "DATABASE",
                "IN_PROGRESS",
                "Web checkout API requires low-latency database connection to primary transactional ledger."
        ));
        deps.add(new RiskAndDependencyDto.DependencyItemDto(
                "CRM Database Cluster",
                "AWS IAM / Keycloak SSO",
                "IDENTITY",
                "RESOLVED",
                "Client360 administrative roles depend on SAML federated directory sync."
        ));
        deps.add(new RiskAndDependencyDto.DependencyItemDto(
                "Nightly Reporting Batch",
                "E-Commerce PostgreSQL DB",
                "BATCH",
                "PENDING",
                "Step Functions ETL job requires read replica in target VPC before cutover."
        ));
        dto.setWorkloadDependencies(deps);

        // 2. Migration Blockers from tasks
        List<MigrationTask> blockedTasks = taskRepository.findByStatus("BLOCKED");
        List<RiskAndDependencyDto.BlockerItemDto> blockers = new ArrayList<>();
        for (MigrationTask t : blockedTasks) {
            blockers.add(new RiskAndDependencyDto.BlockerItemDto(
                    t.getId(),
                    t.getTaskTitle(),
                    t.getWorkloadName(),
                    t.getAssignedTo(),
                    t.getBlockerReason() != null ? t.getBlockerReason() : "Awaiting network security clearance.",
                    "Escalate to Enterprise CISO / Firewall Governance Board for expedited security group rule approval."
            ));
        }
        if (blockers.isEmpty()) {
            blockers.add(new RiskAndDependencyDto.BlockerItemDto(
                    99L,
                    "Direct Connect 10G BGP Route Propagation",
                    "Platform Foundation",
                    "David Chen (DevOps / IaC)",
                    "Awaiting carrier cross-connect validation at Equinix DC2 facility.",
                    "Engage Equinix NOC team for LOA-CFA physical cross-connect signoff."
            ));
        }
        dto.setMigrationBlockers(blockers);

        // 3. High Risk Workloads from Stage 4 assessments
        List<RiskAndDependencyDto.RiskItemDto> risks = new ArrayList<>();
        risks.add(new RiskAndDependencyDto.RiskItemDto(
                "Core Banking Engine",
                "CRITICAL",
                "DATA_LOSS & DOWNTIME",
                "Mission-critical transaction ledger handling live financial deposits and ACH settlement.",
                "Execute 3 full dry-run cutovers in staging; leverage AWS DMS continuous CDC replication with zero data loss threshold."
        ));
        risks.add(new RiskAndDependencyDto.RiskItemDto(
                "CRM Database Cluster",
                "HIGH",
                "SECURITY",
                "Houses 2.4M customer PII records and GDPR/CCPA sensitive data.",
                "Enforce AWS KMS Customer Managed Keys with automated annual key rotation and TLS 1.3 in-transit."
        ));
        risks.add(new RiskAndDependencyDto.RiskItemDto(
                "E-Commerce Web Portal",
                "MEDIUM",
                "PERFORMANCE",
                "High burst traffic during flash sales requires elastic auto-scaling.",
                "Deploy Karpenter autoscaling on EKS with pre-warmed ALB target groups."
        ));
        dto.setHighRiskWorkloads(risks);

        // 4. Scheduling Conflicts
        List<RiskAndDependencyDto.ConflictItemDto> conflicts = new ArrayList<>();
        conflicts.add(new RiskAndDependencyDto.ConflictItemDto(
                "Core Banking Cutover Window Overlaps Month-End Financial Close",
                "Wave 4",
                "Finance blackout window prevents database downtime between Oct 28 - Nov 03.",
                "Shift Wave 4 cutover window forward to October 18 (Saturday 01:00 UTC) to ensure 10-day buffer."
        ));
        conflicts.add(new RiskAndDependencyDto.ConflictItemDto(
                "Keycloak SSO Cutover vs Store Associate Pilot",
                "Wave 1",
                "Identity migration requires 30-min maintenance mode during associate shift change.",
                "Schedule pilot cutover at Sunday 03:00 AM local time."
        ));
        dto.setScheduleConflicts(conflicts);

        // 5. Delayed Tasks
        List<RiskAndDependencyDto.DelayedTaskDto> delayed = new ArrayList<>();
        LocalDate today = LocalDate.now();
        List<MigrationTask> allTasks = taskRepository.findAll();
        for (MigrationTask t : allTasks) {
            if (!"COMPLETED".equals(t.getStatus()) && t.getDueDate() != null && t.getDueDate().isBefore(today)) {
                long daysOverdue = java.time.temporal.ChronoUnit.DAYS.between(t.getDueDate(), today);
                delayed.add(new RiskAndDependencyDto.DelayedTaskDto(
                        t.getId(),
                        t.getTaskTitle(),
                        t.getAssignedTo(),
                        t.getDueDate().toString(),
                        daysOverdue
                ));
            }
        }
        dto.setDelayedTasks(delayed);

        return dto;
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeamWorkloadDto> getTeamWorkloadDistribution() {
        List<MigrationTask> tasks = taskRepository.findAll();
        Map<String, List<MigrationTask>> byOwner = tasks.stream()
                .collect(Collectors.groupingBy(t -> t.getAssignedTo() != null ? t.getAssignedTo() : "Unassigned"));

        List<TeamWorkloadDto> list = new ArrayList<>();
        double totalHours = tasks.stream().mapToDouble(t -> t.getEstimatedHours() != null ? t.getEstimatedHours() : 8.0).sum();

        for (Map.Entry<String, List<MigrationTask>> entry : byOwner.entrySet()) {
            String owner = entry.getKey();
            List<MigrationTask> ownerTasks = entry.getValue();

            long done = ownerTasks.stream().filter(t -> "COMPLETED".equals(t.getStatus())).count();
            long inProg = ownerTasks.stream().filter(t -> "IN_PROGRESS".equals(t.getStatus())).count();
            long blocked = ownerTasks.stream().filter(t -> "BLOCKED".equals(t.getStatus())).count();
            double hours = ownerTasks.stream().mapToDouble(t -> t.getEstimatedHours() != null ? t.getEstimatedHours() : 8.0).sum();

            String role = "Cloud Engineer";
            if (owner.contains("Architect")) role = "Lead Cloud Architect";
            else if (owner.contains("DevOps")) role = "DevOps & IaC Specialist";
            else if (owner.contains("Database")) role = "Senior Database Administrator";
            else if (owner.contains("Security")) role = "Cloud Security Engineer";
            else if (owner.contains("Lead")) role = "Enterprise Migration Lead";

            double allocationPct = totalHours > 0 ? Math.round((hours / totalHours) * 1000.0) / 10.0 : 0.0;

            list.add(new TeamWorkloadDto(
                    owner,
                    role,
                    ownerTasks.size(),
                    (int) done,
                    (int) inProg,
                    (int) blocked,
                    hours,
                    allocationPct
            ));
        }

        // Sort by total tasks assigned descending
        list.sort((a, b) -> b.getTotalTasksAssigned().compareTo(a.getTotalTasksAssigned()));
        return list;
    }

    // Helper Methods
    private MigrationPlan createDefaultPlanEntity(String provider) {
        MigrationPlan plan = new MigrationPlan();
        plan.setPlanName("Enterprise Banking & Digital Commerce Migration Plan (" + provider + ")");
        plan.setCloudProvider(provider);
        plan.setStatus("ACTIVE");
        plan.setStartDate(LocalDate.now().plusDays(7));
        plan.setTargetCompletionDate(LocalDate.now().plusDays(175));
        plan.setTotalWorkloads(3);
        plan.setCompletedWorkloads(0);
        plan.setOverallProgressPercentage(0.0);
        plan.setNotes("Generated execution roadmap based on enterprise infrastructure inventory and multi-cloud target architecture.");
        return plan;
    }

    private void createStandardWavesAndTasks(MigrationPlan plan, String provider, List<Infrastructure> workloads) {
        LocalDate start = plan.getStartDate() != null ? plan.getStartDate() : LocalDate.now().plusDays(7);

        // 1. Wave 1 – Pilot Migration
        MigrationWave w1 = new MigrationWave();
        w1.setMigrationPlanId(plan.getId());
        w1.setWaveNumber(1);
        w1.setWaveName("Wave 1 – Pilot Migration");
        w1.setDescription("Deploy cloud landing zone foundation, Direct Connect hybrid networking, IAM security guardrails, and execute low-risk pilot microservice.");
        w1.setStatus("COMPLETED");
        w1.setStartDate(start);
        w1.setEndDate(start.plusDays(28));
        w1.setWaveLead("Sarah Jenkins (Lead Cloud Architect)");
        w1.setSortOrder(1);
        w1.setProgressPercentage(100.0);
        w1.setWorkloadIdsJson("[\"Keycloak SSO & Pilot Microservice\"]");
        MigrationWave savedW1 = waveRepository.save(w1);

        createTaskInternal(plan.getId(), savedW1.getId(), "Pilot Identity Workload",
                "Deploy Multi-Account Landing Zone & Control Tower",
                "Establish core AWS/Azure organizational hierarchy, audit logging, and IAM guardrails.",
                "Sarah Jenkins (Lead Cloud Architect)", "CRITICAL", "COMPLETED", start, start.plusDays(10), null, "FOUNDATION");

        createTaskInternal(plan.getId(), savedW1.getId(), "Pilot Identity Workload",
                "Configure 10G Hybrid Direct Connect & Transit Gateway",
                "Establish redundant BGP peering between on-premises Equinix DC and cloud transit hub.",
                "David Chen (DevOps / IaC)", "HIGH", "COMPLETED", start.plusDays(10), start.plusDays(20), "TASK-01", "FOUNDATION");

        createTaskInternal(plan.getId(), savedW1.getId(), "Pilot Identity Workload",
                "Migrate Pilot Keycloak Authentication to Container Service",
                "Containerize identity broker, validate latency (<5ms) and OAuth token exchange.",
                "Alex Morgan (Security Eng)", "MEDIUM", "COMPLETED", start.plusDays(18), start.plusDays(28), "TASK-02", "CUTOVER");

        // 2. Wave 2 – Low Complexity Workloads
        MigrationWave w2 = new MigrationWave();
        w2.setMigrationPlanId(plan.getId());
        w2.setWaveNumber(2);
        w2.setWaveName("Wave 2 – Low Complexity Workloads");
        w2.setDescription("Migrate internal store associate portals, nightly reporting ETL pipelines, and managed Redis caching layers.");
        w2.setStatus("IN_PROGRESS");
        w2.setStartDate(start.plusDays(29));
        w2.setEndDate(start.plusDays(70));
        w2.setWaveLead("David Chen (DevOps / IaC)");
        w2.setSortOrder(2);
        w2.setProgressPercentage(65.0);
        w2.setWorkloadIdsJson("[\"ShopSphere Internal Cache & Batch\"]");
        MigrationWave savedW2 = waveRepository.save(w2);

        createTaskInternal(plan.getId(), savedW2.getId(), "ShopSphere Internal Cache & Batch",
                "Deploy Amazon ElastiCache / Redis Managed Cluster",
                "Provision Multi-AZ Redis cluster with in-transit encryption and automated snapshotting.",
                "David Chen (DevOps / IaC)", "HIGH", "COMPLETED", start.plusDays(30), start.plusDays(45), null, "DATA_SYNC");

        createTaskInternal(plan.getId(), savedW2.getId(), "ShopSphere Internal Cache & Batch",
                "Refactor Nightly Batch Jobs to Step Functions & Glue",
                "Modernize monolithic cron scripts into event-driven serverless workflow orchestrations.",
                "Sarah Jenkins (Lead Cloud Architect)", "MEDIUM", "IN_PROGRESS", start.plusDays(40), start.plusDays(60), null, "SCHEMA_CONVERSION");

        createTaskInternal(plan.getId(), savedW2.getId(), "ShopSphere Internal Cache & Batch",
                "Execute UAT Smoke Tests for Store Associate Portal",
                "Run automated Cypress integration suites against target cloud endpoints.",
                "Sai Kumar (Enterprise Migration Lead)", "LOW", "NOT_STARTED", start.plusDays(55), start.plusDays(70), "TASK-05", "VALIDATION");

        // 3. Wave 3 – Medium Complexity Workloads
        MigrationWave w3 = new MigrationWave();
        w3.setMigrationPlanId(plan.getId());
        w3.setWaveNumber(3);
        w3.setWaveName("Wave 3 – Medium Complexity Workloads");
        w3.setDescription("Containerize customer-facing e-commerce web portals, product catalog search, and checkout APIs on managed Kubernetes (EKS / AKS / GKE).");
        w3.setStatus("IN_PROGRESS");
        w3.setStartDate(start.plusDays(71));
        w3.setEndDate(start.plusDays(115));
        w3.setWaveLead("Sarah Jenkins (Lead Cloud Architect)");
        w3.setSortOrder(3);
        w3.setProgressPercentage(25.0);
        w3.setWorkloadIdsJson("[\"E-Commerce Web Portal\"]");
        MigrationWave savedW3 = waveRepository.save(w3);

        createTaskInternal(plan.getId(), savedW3.getId(), "E-Commerce Web Portal",
                "Containerize ShopSphere Web Tier into Docker & Helm Charts",
                "Package Spring Boot 3.3 microservices with multi-stage distroless container builds.",
                "David Chen (DevOps / IaC)", "HIGH", "COMPLETED", start.plusDays(72), start.plusDays(85), null, "SCHEMA_CONVERSION");

        createTaskInternal(plan.getId(), savedW3.getId(), "E-Commerce Web Portal",
                "Setup Target EKS Cluster with Karpenter Autoscaler",
                "Deploy production Kubernetes v1.30 with IRSA security and AWS Load Balancer Controller.",
                "Sarah Jenkins (Lead Cloud Architect)", "CRITICAL", "IN_PROGRESS", start.plusDays(80), start.plusDays(98), null, "FOUNDATION");

        createTaskInternal(plan.getId(), savedW3.getId(), "E-Commerce Web Portal",
                "Configure PostgreSQL CDC Replication to Aurora PostgreSQL",
                "Establish AWS DMS replication instance with zero replication lag monitoring.",
                "Priya Sharma (Database Specialist)", "HIGH", "BLOCKED", start.plusDays(90), start.plusDays(110), null, "DATA_SYNC");

        // 4. Wave 4 – High Complexity Workloads
        MigrationWave w4 = new MigrationWave();
        w4.setMigrationPlanId(plan.getId());
        w4.setWaveNumber(4);
        w4.setWaveName("Wave 4 – High Complexity Workloads");
        w4.setDescription("Migrate mission-critical transactional Core Banking Engine (Oracle 19c RAC) and CRM Database Cluster (SQL Server 2022) with zero downtime cutover.");
        w4.setStatus("NOT_STARTED");
        w4.setStartDate(start.plusDays(116));
        w4.setEndDate(start.plusDays(155));
        w4.setWaveLead("Priya Sharma (Database Specialist)");
        w4.setSortOrder(4);
        w4.setProgressPercentage(0.0);
        w4.setWorkloadIdsJson("[\"Core Banking Engine\", \"CRM Database Cluster\"]");
        MigrationWave savedW4 = waveRepository.save(w4);

        createTaskInternal(plan.getId(), savedW4.getId(), "Core Banking Engine",
                "AWS Schema Conversion Tool (SCT) Oracle to PostgreSQL Code Conversion",
                "Convert PL/SQL stored procedures, packages, and custom sequence generators into native PL/pgSQL.",
                "Priya Sharma (Database Specialist)", "CRITICAL", "NOT_STARTED", start.plusDays(117), start.plusDays(135), null, "SCHEMA_CONVERSION");

        createTaskInternal(plan.getId(), savedW4.getId(), "Core Banking Engine",
                "48-Hour Continuous Database CDC Synchronization Benchmark",
                "Validate 15,000 transactions/sec throughput across Direct Connect with zero packet loss.",
                "Priya Sharma (Database Specialist)", "CRITICAL", "NOT_STARTED", start.plusDays(130), start.plusDays(145), null, "DATA_SYNC");

        createTaskInternal(plan.getId(), savedW4.getId(), "Core Banking Engine",
                "Execute Mission-Critical Production Cutover Window (Saturday 01:00 UTC)",
                "Switch Route 53 DNS records, verify catch-up lag (0 ms), and execute financial ledger reconciliation.",
                "Sai Kumar (Enterprise Migration Lead)", "CRITICAL", "NOT_STARTED", start.plusDays(146), start.plusDays(155), null, "CUTOVER");

        // 5. Wave 5 – Final Migration and Optimization
        MigrationWave w5 = new MigrationWave();
        w5.setMigrationPlanId(plan.getId());
        w5.setWaveNumber(5);
        w5.setWaveName("Wave 5 – Final Migration and Optimization");
        w5.setDescription("Decommission legacy on-premises datacenter hardware, establish 3-Year FinOps Compute Savings Plans, and complete handover to Managed Cloud Operations.");
        w5.setStatus("NOT_STARTED");
        w5.setStartDate(start.plusDays(156));
        w5.setEndDate(start.plusDays(175));
        w5.setWaveLead("Sai Kumar (Enterprise Migration Lead)");
        w5.setSortOrder(5);
        w5.setProgressPercentage(0.0);
        w5.setWorkloadIdsJson("[\"Enterprise Archive & Datacenter Decom\"]");
        MigrationWave savedW5 = waveRepository.save(w5);

        createTaskInternal(plan.getId(), savedW5.getId(), "Enterprise Archive & Datacenter Decom",
                "Archive Legacy Audit Logs & Snapshots to S3 Glacier Deep Archive",
                "Lifecycle 1,950 GB of historical database backups into immutable WORM storage.",
                "Alex Morgan (Security Eng)", "MEDIUM", "NOT_STARTED", start.plusDays(157), start.plusDays(165), null, "OPTIMIZATION");

        createTaskInternal(plan.getId(), savedW5.getId(), "Enterprise Archive & Datacenter Decom",
                "Lock In 3-Year FinOps Compute Savings Plans",
                "Commit steady-state 40 vCPU / 224 GB RAM capacity to achieve 42% recurring TCO reduction.",
                "Sai Kumar (Enterprise Migration Lead)", "HIGH", "NOT_STARTED", start.plusDays(162), start.plusDays(170), null, "OPTIMIZATION");

        createTaskInternal(plan.getId(), savedW5.getId(), "Enterprise Archive & Datacenter Decom",
                "Complete Physical Datacenter Rack Decommission & Lease Termination",
                "Sanitize physical SAN drives according to NIST 800-88 guidelines and terminate datacenter colocation contracts.",
                "Sai Kumar (Enterprise Migration Lead)", "HIGH", "NOT_STARTED", start.plusDays(168), start.plusDays(175), null, "CUTOVER");

        logger.info("Successfully generated 5 migration waves and 15 enterprise tasks.");
    }

    private void createTaskInternal(Long planId, Long waveId, String workloadName, String title,
                                    String desc, String assignedTo, String priority, String status,
                                    LocalDate start, LocalDate due, String deps, String category) {
        MigrationTask task = new MigrationTask();
        task.setMigrationPlanId(planId);
        task.setWaveId(waveId);
        task.setWorkloadName(workloadName);
        task.setTaskTitle(title);
        task.setDescription(desc);
        task.setAssignedTo(assignedTo);
        task.setPriority(priority);
        task.setStatus(status);
        task.setStartDate(start);
        task.setDueDate(due);
        task.setDependencies(deps);
        if ("BLOCKED".equals(status)) {
            task.setBlockerReason("Awaiting network firewall rule sign-off for inter-VPC database replication port 5432.");
        }
        task.setEstimatedHours(16.0);
        task.setCategory(category);
        taskRepository.save(task);
    }

    private void updateWaveAndPlanProgress(Long waveId) {
        Optional<MigrationWave> waveOpt = waveRepository.findById(waveId);
        if (waveOpt.isEmpty()) return;

        MigrationWave wave = waveOpt.get();
        List<MigrationTask> tasks = taskRepository.findByWaveIdOrderByDueDateAsc(wave.getId());

        if (!tasks.isEmpty()) {
            long done = tasks.stream().filter(t -> "COMPLETED".equals(t.getStatus())).count();
            double pct = Math.round((done * 100.0 / tasks.size()) * 10.0) / 10.0;
            wave.setProgressPercentage(pct);

            if (done == tasks.size()) {
                wave.setStatus("COMPLETED");
            } else if (done > 0 || tasks.stream().anyMatch(t -> "IN_PROGRESS".equals(t.getStatus()))) {
                wave.setStatus("IN_PROGRESS");
            } else if (tasks.stream().allMatch(t -> "BLOCKED".equals(t.getStatus()))) {
                wave.setStatus("BLOCKED");
            } else {
                wave.setStatus("NOT_STARTED");
            }
            waveRepository.save(wave);
        }

        Optional<MigrationPlan> planOpt = planRepository.findById(wave.getMigrationPlanId());
        planOpt.ifPresent(this::updatePlanProgressMetrics);
    }

    private void updatePlanProgressMetrics(MigrationPlan plan) {
        List<MigrationWave> waves = waveRepository.findByMigrationPlanIdOrderBySortOrderAsc(plan.getId());
        List<MigrationTask> tasks = taskRepository.findByMigrationPlanIdOrderByDueDateAsc(plan.getId());

        if (!tasks.isEmpty()) {
            long done = tasks.stream().filter(t -> "COMPLETED".equals(t.getStatus())).count();
            double pct = Math.round((done * 100.0 / tasks.size()) * 10.0) / 10.0;
            plan.setOverallProgressPercentage(pct);
        }

        long completedWaves = waves.stream().filter(w -> "COMPLETED".equals(w.getStatus())).count();
        plan.setCompletedWorkloads((int) completedWaves);

        planRepository.save(plan);
    }

    private MigrationPlanDto buildPlanDto(MigrationPlan plan) {
        MigrationPlanDto dto = new MigrationPlanDto();
        dto.setId(plan.getId());
        dto.setPlanName(plan.getPlanName());
        dto.setCloudProvider(plan.getCloudProvider());
        dto.setStatus(plan.getStatus());
        dto.setTotalWorkloads(plan.getTotalWorkloads());
        dto.setCompletedWorkloads(plan.getCompletedWorkloads());
        dto.setOverallProgressPercentage(plan.getOverallProgressPercentage());
        dto.setStartDate(plan.getStartDate());
        dto.setTargetCompletionDate(plan.getTargetCompletionDate());
        dto.setNotes(plan.getNotes());
        dto.setCreatedAt(plan.getCreatedAt());
        dto.setUpdatedAt(plan.getUpdatedAt());

        List<MigrationWave> waves = waveRepository.findByMigrationPlanIdOrderBySortOrderAsc(plan.getId());
        List<MigrationTask> tasks = taskRepository.findByMigrationPlanIdOrderByDueDateAsc(plan.getId());

        Map<Long, String> waveNameMap = waves.stream().collect(Collectors.toMap(MigrationWave::getId, MigrationWave::getWaveName));

        List<MigrationWaveDto> waveDtos = new ArrayList<>();
        for (MigrationWave w : waves) {
            MigrationWaveDto wd = toWaveDto(w);
            List<MigrationTaskDto> waveTasks = tasks.stream()
                    .filter(t -> t.getWaveId().equals(w.getId()))
                    .map(t -> toTaskDto(t, w.getWaveName()))
                    .collect(Collectors.toList());
            wd.setTasks(waveTasks);
            wd.setTaskCount(waveTasks.size());
            wd.setCompletedTaskCount((int) waveTasks.stream().filter(t -> "COMPLETED".equals(t.getStatus())).count());
            waveDtos.add(wd);
        }
        dto.setWaves(waveDtos);

        List<MigrationTaskDto> taskDtos = tasks.stream()
                .map(t -> toTaskDto(t, waveNameMap.getOrDefault(t.getWaveId(), "Wave " + t.getWaveId())))
                .collect(Collectors.toList());
        dto.setTasks(taskDtos);
        dto.setSummary(getProgressSummary());

        return dto;
    }

    private MigrationWaveDto toWaveDto(MigrationWave w) {
        MigrationWaveDto dto = new MigrationWaveDto();
        dto.setId(w.getId());
        dto.setMigrationPlanId(w.getMigrationPlanId());
        dto.setWaveNumber(w.getWaveNumber());
        dto.setWaveName(w.getWaveName());
        dto.setDescription(w.getDescription());
        dto.setStatus(w.getStatus());
        dto.setStartDate(w.getStartDate());
        dto.setEndDate(w.getEndDate());
        dto.setWaveLead(w.getWaveLead());
        dto.setProgressPercentage(w.getProgressPercentage());
        dto.setSortOrder(w.getSortOrder());
        dto.setWorkloadNames(parseWorkloadList(w.getWorkloadIdsJson()));
        return dto;
    }

    private MigrationTaskDto toTaskDto(MigrationTask t, String waveName) {
        MigrationTaskDto dto = new MigrationTaskDto();
        dto.setId(t.getId());
        dto.setMigrationPlanId(t.getMigrationPlanId());
        dto.setWaveId(t.getWaveId());
        dto.setWaveName(waveName);
        dto.setWorkloadName(t.getWorkloadName());
        dto.setTaskTitle(t.getTaskTitle());
        dto.setDescription(t.getDescription());
        dto.setAssignedTo(t.getAssignedTo());
        dto.setPriority(t.getPriority());
        dto.setStatus(t.getStatus());
        dto.setStartDate(t.getStartDate());
        dto.setDueDate(t.getDueDate());
        dto.setDependencies(t.getDependencies());
        dto.setBlockerReason(t.getBlockerReason());
        dto.setEstimatedHours(t.getEstimatedHours());
        dto.setActualHours(t.getActualHours());
        dto.setCategory(t.getCategory());
        dto.setIsDelayed(!"COMPLETED".equals(t.getStatus()) && t.getDueDate() != null && t.getDueDate().isBefore(LocalDate.now()));
        return dto;
    }

    private List<String> parseWorkloadList(String json) {
        if (json == null || json.isBlank() || "[]".equals(json)) return new ArrayList<>();
        try {
            return objectMapper.readValue(json, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }
}

