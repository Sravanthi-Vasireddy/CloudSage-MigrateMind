package com.cloudsage.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "migration_plans")
public class MigrationPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Plan name is required")
    @Column(name = "plan_name", nullable = false, length = 150)
    private String planName;

    @NotBlank(message = "Cloud provider is required")
    @Column(name = "cloud_provider", nullable = false, length = 20)
    private String cloudProvider; // AWS, AZURE, GCP

    @Column(name = "status", nullable = false, length = 30)
    private String status = "ACTIVE"; // ACTIVE, DRAFT, ARCHIVED

    @Column(name = "total_workloads")
    private Integer totalWorkloads = 0;

    @Column(name = "completed_workloads")
    private Integer completedWorkloads = 0;

    @Column(name = "overall_progress_percentage")
    private Double overallProgressPercentage = 0.0;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "target_completion_date")
    private LocalDate targetCompletionDate;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public MigrationPlan() {
    }

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = "ACTIVE";
        }
        if (this.totalWorkloads == null) {
            this.totalWorkloads = 0;
        }
        if (this.completedWorkloads == null) {
            this.completedWorkloads = 0;
        }
        if (this.overallProgressPercentage == null) {
            this.overallProgressPercentage = 0.0;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getTotalWorkloads() {
        return totalWorkloads;
    }

    public void setTotalWorkloads(Integer totalWorkloads) {
        this.totalWorkloads = totalWorkloads;
    }

    public Integer getCompletedWorkloads() {
        return completedWorkloads;
    }

    public void setCompletedWorkloads(Integer completedWorkloads) {
        this.completedWorkloads = completedWorkloads;
    }

    public Double getOverallProgressPercentage() {
        return overallProgressPercentage;
    }

    public void setOverallProgressPercentage(Double overallProgressPercentage) {
        this.overallProgressPercentage = overallProgressPercentage;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getTargetCompletionDate() {
        return targetCompletionDate;
    }

    public void setTargetCompletionDate(LocalDate targetCompletionDate) {
        this.targetCompletionDate = targetCompletionDate;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}

