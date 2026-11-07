package com.cloudsage.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class ComplianceUpdateRequestDto {

    @NotBlank(message = "Status is required (COMPLIANT, NON_COMPLIANT, NEEDS_REVIEW)")
    private String status;

    private String assessmentNotes;

    private String complianceGap;

    private String suggestedCorrectiveAction;

    public ComplianceUpdateRequestDto() {
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getAssessmentNotes() {
        return assessmentNotes;
    }

    public void setAssessmentNotes(String assessmentNotes) {
        this.assessmentNotes = assessmentNotes;
    }

    public String getComplianceGap() {
        return complianceGap;
    }

    public void setComplianceGap(String complianceGap) {
        this.complianceGap = complianceGap;
    }

    public String getSuggestedCorrectiveAction() {
        return suggestedCorrectiveAction;
    }

    public void setSuggestedCorrectiveAction(String suggestedCorrectiveAction) {
        this.suggestedCorrectiveAction = suggestedCorrectiveAction;
    }
}

