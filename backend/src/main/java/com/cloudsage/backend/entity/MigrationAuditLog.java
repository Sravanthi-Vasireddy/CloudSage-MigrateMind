package com.cloudsage.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "migration_audit_logs")
public class MigrationAuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 80)
    private String activityType; // MIGRATION_EXECUTION, VALIDATION_RUN, RETRY_ATTEMPT, STATUS_CHANGE, FAILURE_RECORDED, INCIDENT_RESOLVED, USER_ACTION

    @Column(length = 150)
    private String workloadName;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String actionDescription;

    @Column(nullable = false, length = 100)
    private String performedBy = "Automated Validation Engine";

    @Column(nullable = false, length = 30)
    private String resultStatus = "SUCCESS"; // SUCCESS, FAILURE, WARNING, INFO

    @Column(nullable = false)
    private LocalDateTime timestamp = LocalDateTime.now();

    public MigrationAuditLog() {
    }

    public MigrationAuditLog(String activityType, String workloadName, String actionDescription,
                             String performedBy, String resultStatus) {
        this.activityType = activityType;
        this.workloadName = workloadName;
        this.actionDescription = actionDescription;
        this.performedBy = performedBy;
        this.resultStatus = resultStatus;
        this.timestamp = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getActivityType() {
        return activityType;
    }

    public void setActivityType(String activityType) {
        this.activityType = activityType;
    }

    public String getWorkloadName() {
        return workloadName;
    }

    public void setWorkloadName(String workloadName) {
        this.workloadName = workloadName;
    }

    public String getActionDescription() {
        return actionDescription;
    }

    public void setActionDescription(String actionDescription) {
        this.actionDescription = actionDescription;
    }

    public String getPerformedBy() {
        return performedBy;
    }

    public void setPerformedBy(String performedBy) {
        this.performedBy = performedBy;
    }

    public String getResultStatus() {
        return resultStatus;
    }

    public void setResultStatus(String resultStatus) {
        this.resultStatus = resultStatus;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}

