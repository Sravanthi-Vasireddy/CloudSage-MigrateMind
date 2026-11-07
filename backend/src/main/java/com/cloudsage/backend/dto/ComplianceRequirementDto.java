package com.cloudsage.backend.dto;

import java.time.LocalDateTime;

public class ComplianceRequirementDto {

    private Long id;
    private String framework;
    private String sectionRef;
    private String requirementTitle;
    private String description;
    private String status; // COMPLIANT, NON_COMPLIANT, NEEDS_REVIEW
    private String assessmentNotes;
    private String complianceGap;
    private String suggestedCorrectiveAction;
    private String affectedWorkload;
    private LocalDateTime updatedAt;

    public ComplianceRequirementDto() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFramework() {
        return framework;
    }

    public void setFramework(String framework) {
        this.framework = framework;
    }

    public String getSectionRef() {
        return sectionRef;
    }

    public void setSectionRef(String sectionRef) {
        this.sectionRef = sectionRef;
    }

    public String getRequirementTitle() {
        return requirementTitle;
    }

    public void setRequirementTitle(String requirementTitle) {
        this.requirementTitle = requirementTitle;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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

    public String getAffectedWorkload() {
        return affectedWorkload;
    }

    public void setAffectedWorkload(String affectedWorkload) {
        this.affectedWorkload = affectedWorkload;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}

