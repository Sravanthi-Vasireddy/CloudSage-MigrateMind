package com.cloudsage.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "performance_metric_snapshots")
public class PerformanceMetricSnapshot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String workloadName;

    @Column(nullable = false, length = 100)
    private String metricName; // CPU Utilization, Memory Utilization, Storage IOPS, Response Time, Availability

    @Column(nullable = false)
    private Double sourceValue; // On-premises baseline

    @Column(nullable = false)
    private Double targetValue; // Target cloud actual

    @Column(nullable = false, length = 30)
    private String unit; // %, ms, IOPS, etc.

    @Column(nullable = false)
    private Double improvementPercentage; // e.g. +35.2%

    @Column(nullable = false, length = 30)
    private String status = "OPTIMAL"; // OPTIMAL, EQUIVALENT, DEGRADED

    @Column(nullable = false)
    private LocalDateTime recordedAt = LocalDateTime.now();

    public PerformanceMetricSnapshot() {
    }

    public PerformanceMetricSnapshot(String workloadName, String metricName, Double sourceValue,
                                     Double targetValue, String unit, Double improvementPercentage,
                                     String status) {
        this.workloadName = workloadName;
        this.metricName = metricName;
        this.sourceValue = sourceValue;
        this.targetValue = targetValue;
        this.unit = unit;
        this.improvementPercentage = improvementPercentage;
        this.status = status;
        this.recordedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getWorkloadName() {
        return workloadName;
    }

    public void setWorkloadName(String workloadName) {
        this.workloadName = workloadName;
    }

    public String getMetricName() {
        return metricName;
    }

    public void setMetricName(String metricName) {
        this.metricName = metricName;
    }

    public Double getSourceValue() {
        return sourceValue;
    }

    public void setSourceValue(Double sourceValue) {
        this.sourceValue = sourceValue;
    }

    public Double getTargetValue() {
        return targetValue;
    }

    public void setTargetValue(Double targetValue) {
        this.targetValue = targetValue;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public Double getImprovementPercentage() {
        return improvementPercentage;
    }

    public void setImprovementPercentage(Double improvementPercentage) {
        this.improvementPercentage = improvementPercentage;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getRecordedAt() {
        return recordedAt;
    }

    public void setRecordedAt(LocalDateTime recordedAt) {
        this.recordedAt = recordedAt;
    }
}

