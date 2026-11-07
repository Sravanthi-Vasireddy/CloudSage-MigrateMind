package com.cloudsage.backend.controller;

import com.cloudsage.backend.dto.AssessmentOverrideDto;
import com.cloudsage.backend.dto.AssessmentResponseDto;
import com.cloudsage.backend.dto.AssessmentSummaryDto;
import com.cloudsage.backend.service.WorkloadAssessmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assessments")
public class WorkloadAssessmentController {

    private final WorkloadAssessmentService assessmentService;

    public WorkloadAssessmentController(WorkloadAssessmentService assessmentService) {
        this.assessmentService = assessmentService;
    }

    @GetMapping
    public ResponseEntity<List<AssessmentResponseDto>> getAllAssessments() {
        List<AssessmentResponseDto> list = assessmentService.getAllAssessments();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AssessmentResponseDto> getAssessmentById(@PathVariable Long id) {
        AssessmentResponseDto dto = assessmentService.getAssessmentById(id);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/infrastructure/{infrastructureId}")
    public ResponseEntity<AssessmentResponseDto> getAssessmentByInfrastructureId(
            @PathVariable Long infrastructureId) {
        AssessmentResponseDto dto = assessmentService.getAssessmentByInfrastructureId(infrastructureId);
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/evaluate/{infrastructureId}")
    public ResponseEntity<AssessmentResponseDto> evaluateWorkload(
            @PathVariable Long infrastructureId) {
        AssessmentResponseDto dto = assessmentService.evaluateInfrastructureWorkload(infrastructureId);
        return new ResponseEntity<>(dto, HttpStatus.CREATED);
    }

    @PostMapping("/evaluate-all")
    public ResponseEntity<List<AssessmentResponseDto>> evaluateAllWorkloads() {
        List<AssessmentResponseDto> list = assessmentService.evaluateAllWorkloads();
        return ResponseEntity.ok(list);
    }

    @PutMapping("/{id}/override")
    public ResponseEntity<AssessmentResponseDto> overrideStrategy(
            @PathVariable Long id,
            @Valid @RequestBody AssessmentOverrideDto overrideDto) {
        AssessmentResponseDto updated = assessmentService.overrideStrategy(id, overrideDto);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/summary")
    public ResponseEntity<AssessmentSummaryDto> getAssessmentSummary() {
        AssessmentSummaryDto summary = assessmentService.getAssessmentSummary();
        return ResponseEntity.ok(summary);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAssessment(@PathVariable Long id) {
        assessmentService.deleteAssessment(id);
        return ResponseEntity.noContent().build();
    }
}

