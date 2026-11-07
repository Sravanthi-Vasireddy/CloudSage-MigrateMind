package com.cloudsage.backend.dto;

public class MigrationPlanGenerateRequestDto {

    private String planName;
    private String cloudProvider = "AWS"; // AWS, AZURE, GCP

    public MigrationPlanGenerateRequestDto() {
    }

    public String getPlanName() {
        return planName;
    }

    public void setPlanName(String planName) {
        this.planName = planName;
    }

    public String getCloudProvider() {
        return cloudProvider;
    }

    public void setCloudProvider(String cloudProvider) {
        this.cloudProvider = cloudProvider;
    }
}

