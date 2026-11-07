package com.cloudsage.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "workload_validation_results")
public class WorkloadValidationResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String validationName;

    @Column(nullable = false, length = 150)
    private String workloadName;

    private Long workloadId;

    @Column(nullable = false, length = 50)
    private String validationType; // APPLICATION_AVAILABILITY, DATABASE_CONNECTIVITY, NETWORK_CONNECTIVITY, STORAGE_ACCESSIBILITY, RESPONSE_TIME, RESOURCE_ALLOCATION, CONFIG_CONSISTENCY

    @Column(columnDefinition = "TEXT")
    private String expectedResult;

    @Column(columnDefinition = "TEXT")
    private String actualResult;

    @Column(nullable = false, length = 30)
    private String validationStatus; // PASSED, FAILED, WARNING, IN_PROGRESS

    @Column(columnDefinition = "TEXT")
    private String errorDetails;

    @Column(nullable = false)
    private LocalDateTime executedAt = LocalDateTime.now();

    @Column(nullable = false)
    private Integer retryCount = 0;

    public WorkloadValidationResult() {
    }

    public WorkloadValidationResult(String validationName, String workloadName, Long workloadId,
                                    String validationType, String expectedResult, String actualResult,
                                    String validationStatus, String errorDetails) {
        this.validationName = validationName;
        this.workloadName = workloadName;
        this.workloadId = workloadId;
        this.validationType = validationType;
        this.expectedResult = expectedResult;
        this.actualResult = actualResult;
        this.validationStatus = validationStatus;
        this.errorDetails = errorDetails;
        this.executedAt = LocalDateTime.now();
        this.retryCount = 0;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getValidationName() {
        return validationName;
    }

    public void setValidationName(String validationName) {
        this.validationName = validationName;
    }

    public String getWorkloadName() {
        return workloadName;
    }

    public void setWorkloadName(String workloadName) {
        this.workloadName = workloadName;
    }

    public Long getWorkloadId() {
        return workloadId;
    }

    public void setWorkloadId(Long workloadId) {
        this.workloadId = workloadId;
    }

    public String getValidationType() {
        return validationType;
    }

    public void setValidationType(String validationType) {
        this.validationType = validationType;
    }

    public String getExpectedResult() {
        return expectedResult;
    }

    public void setExpectedResult(String expectedResult) {
        this.expectedResult = expectedResult;
    }

    public String getActualResult() {
        return actualResult;
    }

    public void setActualResult(String actualResult) {
        this.actualResult = actualResult;
    }

    public String getValidationStatus() {
        return validationStatus;
    }

    public void setValidationStatus(String validationStatus) {
        this.validationStatus = validationStatus;
    }

    public String getErrorDetails() {
        return errorDetails;
    }

    public void setErrorDetails(String errorDetails) {
        this.errorDetails = errorDetails;
    }

    public LocalDateTime getExecutedAt() {
        return executedAt;
    }

    public void setExecutedAt(LocalDateTime executedAt) {
        this.executedAt = executedAt;
    }

    public Integer getRetryCount() {
        return retryCount;
    }

    public void setRetryCount(Integer retryCount) {
        this.retryCount = retryCount;
    }
}

