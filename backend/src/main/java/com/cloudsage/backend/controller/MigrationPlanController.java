package com.cloudsage.backend.controller;

import com.cloudsage.backend.dto.*;
import com.cloudsage.backend.service.MigrationPlanService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/migration-plans")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class MigrationPlanController {

    private static final Logger logger = LoggerFactory.getLogger(MigrationPlanController.class);

    private final MigrationPlanService migrationPlanService;

    public MigrationPlanController(MigrationPlanService migrationPlanService) {
        this.migrationPlanService = migrationPlanService;
    }

    /**
     * Retrieve the active enterprise migration execution plan
     */
    @GetMapping("/active")
    public ResponseEntity<MigrationPlanDto> getActivePlan() {
        logger.info("REST request to fetch active Migration Execution Plan");
        MigrationPlanDto plan = migrationPlanService.getActivePlan();
        return ResponseEntity.ok(plan);
    }

    /**
     * Generate or regenerate migration execution plan based on Stage 3-6 data
     */
    @PostMapping("/generate")
    public ResponseEntity<MigrationPlanDto> generatePlan(
            @RequestBody(required = false) MigrationPlanGenerateRequestDto request) {
        String provider = request != null && request.getCloudProvider() != null ? request.getCloudProvider() : "AWS";
        logger.info("REST request to generate Migration Execution Plan for provider={}", provider);
        MigrationPlanDto plan = migrationPlanService.generateOrGetActivePlan(provider);
        return new ResponseEntity<>(plan, HttpStatus.CREATED);
    }

    /**
     * Update migration wave details
     */
    @PutMapping("/waves/{id}")
    public ResponseEntity<MigrationWaveDto> updateWave(
            @PathVariable Long id,
            @Valid @RequestBody MigrationWaveUpdateRequestDto request) {
        logger.info("REST request to update Migration Wave ID={}", id);
        MigrationWaveDto wave = migrationPlanService.updateWave(id, request);
        return ResponseEntity.ok(wave);
    }

    /**
     * Reorder migration waves
     */
    @PostMapping("/waves/reorder")
    public ResponseEntity<Void> reorderWaves(@RequestBody List<Long> waveIdsInOrder) {
        logger.info("REST request to reorder waves: {}", waveIdsInOrder);
        migrationPlanService.reorderWaves(waveIdsInOrder);
        return ResponseEntity.ok().build();
    }

    /**
     * Add workload to a migration wave
     */
    @PostMapping("/waves/{id}/workloads")
    public ResponseEntity<MigrationWaveDto> addWorkloadToWave(
            @PathVariable Long id,
            @RequestParam String workloadName) {
        logger.info("REST request to add workload '{}' to Wave ID={}", workloadName, id);
        MigrationWaveDto wave = migrationPlanService.addWorkloadToWave(id, workloadName);
        return ResponseEntity.ok(wave);
    }

    /**
     * Remove workload from a migration wave
     */
    @DeleteMapping("/waves/{id}/workloads")
    public ResponseEntity<MigrationWaveDto> removeWorkloadFromWave(
            @PathVariable Long id,
            @RequestParam String workloadName) {
        logger.info("REST request to remove workload '{}' from Wave ID={}", workloadName, id);
        MigrationWaveDto wave = migrationPlanService.removeWorkloadFromWave(id, workloadName);
        return ResponseEntity.ok(wave);
    }

    /**
     * Create a new migration task
     */
    @PostMapping("/tasks")
    public ResponseEntity<MigrationTaskDto> createTask(
            @Valid @RequestBody MigrationTaskCreateRequestDto request) {
        logger.info("REST request to create Migration Task: '{}'", request.getTaskTitle());
        MigrationTaskDto task = migrationPlanService.createTask(request);
        return new ResponseEntity<>(task, HttpStatus.CREATED);
    }

    /**
     * Update an existing migration task (status, assignedTo, priority, dates, blocker)
     */
    @PutMapping("/tasks/{id}")
    public ResponseEntity<MigrationTaskDto> updateTask(
            @PathVariable Long id,
            @Valid @RequestBody MigrationTaskUpdateRequestDto request) {
        logger.info("REST request to update Migration Task ID={}", id);
        MigrationTaskDto task = migrationPlanService.updateTask(id, request);
        return ResponseEntity.ok(task);
    }

    /**
     * Delete a migration task by ID
     */
    @DeleteMapping("/tasks/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        logger.info("REST request to delete Migration Task ID={}", id);
        migrationPlanService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Get migration progress summary
     */
    @GetMapping("/progress")
    public ResponseEntity<MigrationProgressSummaryDto> getProgressSummary() {
        logger.info("REST request to fetch Migration Progress Summary");
        MigrationProgressSummaryDto summary = migrationPlanService.getProgressSummary();
        return ResponseEntity.ok(summary);
    }

    /**
     * Get risk, dependency, and blocker analysis
     */
    @GetMapping("/risks")
    public ResponseEntity<RiskAndDependencyDto> getRisksAndDependencies() {
        logger.info("REST request to fetch Risks and Dependencies");
        RiskAndDependencyDto risks = migrationPlanService.getRisksAndDependencies();
        return ResponseEntity.ok(risks);
    }

    /**
     * Get team workload distribution and task allocations
     */
    @GetMapping("/team")
    public ResponseEntity<List<TeamWorkloadDto>> getTeamWorkloadDistribution() {
        logger.info("REST request to fetch Team Workload Distribution");
        List<TeamWorkloadDto> team = migrationPlanService.getTeamWorkloadDistribution();
        return ResponseEntity.ok(team);
    }
}

