package com.cloudsage.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Entity
@Table(name = "compliance_requirements")
public class ComplianceRequirement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(name = "framework", nullable = false, length = 30)
    private String framework; // GDPR, ISO_27001, SOC2, HIPAA

    @NotBlank
    @Column(name = "section_ref", nullable = false, length = 50)
    private String sectionRef; // e.g. Article 32, A.10.1, CC6.1, §164.312(a)(1)

    @NotBlank
    @Column(name = "requirement_title", nullable = false, length = 200)
    private String requirementTitle;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "status", nullable = false, length = 30)
    private String status = "COMPLIANT"; // COMPLIANT, NON_COMPLIANT, NEEDS_REVIEW

    @Column(name = "assessment_notes", columnDefinition = "TEXT")
    private String assessmentNotes;

    @Column(name = "compliance_gap", columnDefinition = "TEXT")
    private String complianceGap;

    @Column(name = "suggested_corrective_action", columnDefinition = "TEXT")
    private String suggestedCorrectiveAction;

    @Column(name = "affected_workload", length = 150)
    private String affectedWorkload;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public ComplianceRequirement() {
    }

    @PrePersist
    @PreUpdate
    protected void onSave() {
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = "COMPLIANT";
        }
    }

    // Getters and Setters
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

