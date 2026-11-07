package com.cloudsage.backend.service;

import com.cloudsage.backend.dto.AssessmentOverrideDto;
import com.cloudsage.backend.dto.AssessmentResponseDto;
import com.cloudsage.backend.dto.AssessmentSummaryDto;

import java.util.List;

public interface WorkloadAssessmentService {

    List<AssessmentResponseDto> getAllAssessments();

    AssessmentResponseDto getAssessmentById(Long id);

    AssessmentResponseDto getAssessmentByInfrastructureId(Long infrastructureId);

    AssessmentResponseDto evaluateInfrastructureWorkload(Long infrastructureId);

    List<AssessmentResponseDto> evaluateAllWorkloads();

    AssessmentResponseDto overrideStrategy(Long id, AssessmentOverrideDto overrideDto);

    AssessmentSummaryDto getAssessmentSummary();

    void deleteAssessment(Long id);
}

