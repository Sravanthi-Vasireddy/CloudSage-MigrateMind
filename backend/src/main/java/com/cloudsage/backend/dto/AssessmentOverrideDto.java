package com.cloudsage.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class AssessmentOverrideDto {

    @NotBlank(message = "Selected 6R migration strategy is required")
    @Pattern(
        regexp = "Rehost|Replatform|Refactor|Repurchase|Retain|Retire",
        message = "Strategy must be one of: Rehost, Replatform, Refactor, Repurchase, Retain, Retire"
    )
    private String selectedStrategy;

    @NotBlank(message = "Override justification / rationale is required")
    private String overrideReason;

    public AssessmentOverrideDto() {
    }

    public AssessmentOverrideDto(String selectedStrategy, String overrideReason) {
        this.selectedStrategy = selectedStrategy;
        this.overrideReason = overrideReason;
    }

    public String getSelectedStrategy() {
        return selectedStrategy;
    }

    public void setSelectedStrategy(String selectedStrategy) {
        this.selectedStrategy = selectedStrategy;
    }

    public String getOverrideReason() {
        return overrideReason;
    }

    public void setOverrideReason(String overrideReason) {
        this.overrideReason = overrideReason;
    }
}

