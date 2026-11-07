package com.cloudsage.backend.dto;

import java.util.List;

public class ValidationExecuteRequestDto {

    private String workloadName;
    private List<String> validationTypes;

    public ValidationExecuteRequestDto() {
    }

    public ValidationExecuteRequestDto(String workloadName, List<String> validationTypes) {
        this.workloadName = workloadName;
        this.validationTypes = validationTypes;
    }

    public String getWorkloadName() {
        return workloadName;
    }

    public void setWorkloadName(String workloadName) {
        this.workloadName = workloadName;
    }

    public List<String> getValidationTypes() {
        return validationTypes;
    }

    public void setValidationTypes(List<String> validationTypes) {
        this.validationTypes = validationTypes;
    }
}

