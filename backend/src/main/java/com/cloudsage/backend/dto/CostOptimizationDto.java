package com.cloudsage.backend.dto;

public class CostOptimizationDto {

    private String id;
    private String category; // COMPUTE, STORAGE, DATABASE, COMMITMENT, SCHEDULE, NETWORKING
    private String title;
    private String identifiedIssue;
    private String suggestedOptimization;
    private Double expectedMonthlySavings;
    private Double expectedAnnualSavings;
    private String priority; // HIGH, MEDIUM, LOW
    private String applicableProvider; // ALL, AWS, AZURE, GCP
    private String affectedResource;
    private Double implementationEffortHours;

    public CostOptimizationDto() {
    }

    public CostOptimizationDto(String id, String category, String title, String identifiedIssue,
                               String suggestedOptimization, Double expectedMonthlySavings,
                               String priority, String applicableProvider, String affectedResource,
                               Double implementationEffortHours) {
        this.id = id;
        this.category = category;
        this.title = title;
        this.identifiedIssue = identifiedIssue;
        this.suggestedOptimization = suggestedOptimization;
        this.expectedMonthlySavings = expectedMonthlySavings;
        this.expectedAnnualSavings = expectedMonthlySavings * 12.0;
        this.priority = priority;
        this.applicableProvider = applicableProvider;
        this.affectedResource = affectedResource;
        this.implementationEffortHours = implementationEffortHours;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getIdentifiedIssue() {
        return identifiedIssue;
    }

    public void setIdentifiedIssue(String identifiedIssue) {
        this.identifiedIssue = identifiedIssue;
    }

    public String getSuggestedOptimization() {
        return suggestedOptimization;
    }

    public void setSuggestedOptimization(String suggestedOptimization) {
        this.suggestedOptimization = suggestedOptimization;
    }

    public Double getExpectedMonthlySavings() {
        return expectedMonthlySavings;
    }

    public void setExpectedMonthlySavings(Double expectedMonthlySavings) {
        this.expectedMonthlySavings = expectedMonthlySavings;
        this.expectedAnnualSavings = expectedMonthlySavings != null ? expectedMonthlySavings * 12.0 : 0.0;
    }

    public Double getExpectedAnnualSavings() {
        return expectedAnnualSavings;
    }

    public void setExpectedAnnualSavings(Double expectedAnnualSavings) {
        this.expectedAnnualSavings = expectedAnnualSavings;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getApplicableProvider() {
        return applicableProvider;
    }

    public void setApplicableProvider(String applicableProvider) {
        this.applicableProvider = applicableProvider;
    }

    public String getAffectedResource() {
        return affectedResource;
    }

    public void setAffectedResource(String affectedResource) {
        this.affectedResource = affectedResource;
    }

    public Double getImplementationEffortHours() {
        return implementationEffortHours;
    }

    public void setImplementationEffortHours(Double implementationEffortHours) {
        this.implementationEffortHours = implementationEffortHours;
    }
}

