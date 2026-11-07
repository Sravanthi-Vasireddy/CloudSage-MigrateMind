package com.cloudsage.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "migration_waves")
public class MigrationWave {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "migration_plan_id", nullable = false)
    private Long migrationPlanId;

    @NotNull
    @Column(name = "wave_number", nullable = false)
    private Integer waveNumber; // 1, 2, 3, 4, 5

    @NotBlank(message = "Wave name is required")
    @Column(name = "wave_name", nullable = false, length = 100)
    private String waveName;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "status", nullable = false, length = 30)
    private String status = "NOT_STARTED"; // NOT_STARTED, IN_PROGRESS, COMPLETED, BLOCKED

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "wave_lead", length = 100)
    private String waveLead;

    @Lob
    @Column(name = "workload_ids_json", columnDefinition = "LONGTEXT")
    private String workloadIdsJson; // e.g. ["Core Banking Engine", "ShopSphere"] or IDs

    @Column(name = "progress_percentage")
    private Double progressPercentage = 0.0;

    @Column(name = "sort_order")
    private Integer sortOrder = 1;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public MigrationWave() {
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
        if (this.progressPercentage == null) {
            this.progressPercentage = 0.0;
        }
        if (this.workloadIdsJson == null) {
            this.workloadIdsJson = "[]";
        }
        if (this.sortOrder == null) {
            this.sortOrder = this.waveNumber != null ? this.waveNumber : 1;
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

    public Integer getWaveNumber() {
        return waveNumber;
    }

    public void setWaveNumber(Integer waveNumber) {
        this.waveNumber = waveNumber;
    }

    public String getWaveName() {
        return waveName;
    }

    public void setWaveName(String waveName) {
        this.waveName = waveName;
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

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public String getWaveLead() {
        return waveLead;
    }

    public void setWaveLead(String waveLead) {
        this.waveLead = waveLead;
    }

    public String getWorkloadIdsJson() {
        return workloadIdsJson;
    }

    public void setWorkloadIdsJson(String workloadIdsJson) {
        this.workloadIdsJson = workloadIdsJson;
    }

    public Double getProgressPercentage() {
        return progressPercentage;
    }

    public void setProgressPercentage(Double progressPercentage) {
        this.progressPercentage = progressPercentage;
    }

    public Integer getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(Integer sortOrder) {
        this.sortOrder = sortOrder;
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

