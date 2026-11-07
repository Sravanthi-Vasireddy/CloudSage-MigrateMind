package com.cloudsage.backend.service;

import com.cloudsage.backend.dto.*;

import java.util.List;

public interface MigrationPlanService {

    MigrationPlanDto generateOrGetActivePlan(String provider);

    MigrationPlanDto getActivePlan();

    MigrationWaveDto updateWave(Long waveId, MigrationWaveUpdateRequestDto request);

    void reorderWaves(List<Long> waveIdsInOrder);

    MigrationWaveDto addWorkloadToWave(Long waveId, String workloadName);

    MigrationWaveDto removeWorkloadFromWave(Long waveId, String workloadName);

    MigrationTaskDto createTask(MigrationTaskCreateRequestDto request);

    MigrationTaskDto updateTask(Long taskId, MigrationTaskUpdateRequestDto request);

    void deleteTask(Long taskId);

    MigrationProgressSummaryDto getProgressSummary();

    RiskAndDependencyDto getRisksAndDependencies();

    List<TeamWorkloadDto> getTeamWorkloadDistribution();
}

