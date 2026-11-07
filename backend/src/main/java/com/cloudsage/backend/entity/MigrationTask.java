package com.cloudsage.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "migration_tasks")
public class MigrationTask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "migration_plan_id", nullable = false)
    private Long migrationPlanId;

    @NotNull
    @Column(name = "wave_id", nullable = false)
    private Long waveId;

    @Column(name = "workload_name", length = 150)
    private String workloadName;

    @NotBlank(message = "Task title is required")
    @Column(name = "task_title", nullable = false, length = 200)
    private String taskTitle;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "assigned_to", length = 100)
    private String assignedTo;

    @Column(name = "priority", nullable = false, length = 20)
    private String priority = "MEDIUM"; // CRITICAL, HIGH, MEDIUM, LOW

    @Column(name = "status", nullable = false, length = 30)
    private String status = "NOT_STARTED"; // NOT_STARTED, IN_PROGRESS, COMPLETED, BLOCKED

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "dependencies", length = 255)
    private String dependencies;

    @Column(name = "blocker_reason", columnDefinition = "TEXT")
    private String blockerReason;

    @Column(name = "estimated_hours")
    private Double estimatedHours = 8.0;

    @Column(name = "actual_hours")
    private Double actualHours = 0.0;

    @Column(name = "category", length = 50)
    private String category = "FOUNDATION"; // DISCOVERY, FOUNDATION, DATA_SYNC, SCHEMA_CONVERSION, CUTOVER, VALIDATION, OPTIMIZATION

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public MigrationTask() {
    }

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = "NOT_STARTED";
        }
        if (this.priority == null) {
            this.priority = "MEDIUM";
        }
        if (this.estimatedHours == null) {
            this.estimatedHours = 8.0;
        }
        if (this.actualHours == null) {
            this.actualHours = 0.0;
        }
        if (this.category == null) {
            this.category = "FOUNDATION";
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

    public Long getMigrationPlanId() {
        return migrationPlanId;
    }

    public void setMigrationPlanId(Long migrationPlanId) {
        this.migrationPlanId = migrationPlanId;
    }

    public Long getWaveId() {
        return waveId;
    }

    public void setWaveId(Long waveId) {
        this.waveId = waveId;
    }

    public String getWorkloadName() {
        return workloadName;
    }

    public void setWorkloadName(String workloadName) {
        this.workloadName = workloadName;
    }

    public String getTaskTitle() {
        return taskTitle;
    }

    public void setTaskTitle(String taskTitle) {
        this.taskTitle = taskTitle;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAssignedTo() {
        return assignedTo;
    }

    public void setAssignedTo(String assignedTo) {
        this.assignedTo = assignedTo;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public String getDependencies() {
        return dependencies;
    }

    public void setDependencies(String dependencies) {
        this.dependencies = dependencies;
    }

    public String getBlockerReason() {
        return blockerReason;
    }

    public void setBlockerReason(String blockerReason) {
        this.blockerReason = blockerReason;
    }

    public Double getEstimatedHours() {
        return estimatedHours;
    }

    public void setEstimatedHours(Double estimatedHours) {
        this.estimatedHours = estimatedHours;
    }

    public Double getActualHours() {
        return actualHours;
    }

    public void setActualHours(Double actualHours) {
        this.actualHours = actualHours;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
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

