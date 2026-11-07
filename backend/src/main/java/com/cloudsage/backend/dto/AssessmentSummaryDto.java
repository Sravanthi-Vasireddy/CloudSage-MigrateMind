package com.cloudsage.backend.dto;

import java.util.HashMap;
import java.util.Map;

public class AssessmentSummaryDto {

    private long totalWorkloads;
    private long assessedWorkloads;
    private Map<String, Long> strategyDistribution = new HashMap<>();
    private Map<String, Long> complexityDistribution = new HashMap<>();
    private double averageReadinessScore;
    private long overriddenCount;

    public AssessmentSummaryDto() {
    }

    public AssessmentSummaryDto(long totalWorkloads, long assessedWorkloads,
                                Map<String, Long> strategyDistribution,
                                Map<String, Long> complexityDistribution,
                                double averageReadinessScore, long overriddenCount) {
        this.totalWorkloads = totalWorkloads;
        this.assessedWorkloads = assessedWorkloads;
        this.strategyDistribution = strategyDistribution;
        this.complexityDistribution = complexityDistribution;
        this.averageReadinessScore = averageReadinessScore;
        this.overriddenCount = overriddenCount;
    }

    public long getTotalWorkloads() {
        return totalWorkloads;
    }

    public void setTotalWorkloads(long totalWorkloads) {
        this.totalWorkloads = totalWorkloads;
    }

    public long getAssessedWorkloads() {
        return assessedWorkloads;
    }

    public void setAssessedWorkloads(long assessedWorkloads) {
        this.assessedWorkloads = assessedWorkloads;
    }

    public Map<String, Long> getStrategyDistribution() {
        return strategyDistribution;
    }

    public void setStrategyDistribution(Map<String, Long> strategyDistribution) {
        this.strategyDistribution = strategyDistribution;
    }

    public Map<String, Long> getComplexityDistribution() {
        return complexityDistribution;
    }

    public void setComplexityDistribution(Map<String, Long> complexityDistribution) {
        this.complexityDistribution = complexityDistribution;
    }

    public double getAverageReadinessScore() {
        return averageReadinessScore;
    }

    public void setAverageReadinessScore(double averageReadinessScore) {
        this.averageReadinessScore = averageReadinessScore;
    }

    public long getOverriddenCount() {
        return overriddenCount;
    }

    public void setOverriddenCount(long overriddenCount) {
        this.overriddenCount = overriddenCount;
    }
}

