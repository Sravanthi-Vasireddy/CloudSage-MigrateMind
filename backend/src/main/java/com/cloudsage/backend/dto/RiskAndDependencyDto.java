package com.cloudsage.backend.dto;

import java.util.List;

public class RiskAndDependencyDto {

    private List<DependencyItemDto> workloadDependencies;
    private List<BlockerItemDto> migrationBlockers;
    private List<RiskItemDto> highRiskWorkloads;
    private List<ConflictItemDto> scheduleConflicts;
    private List<DelayedTaskDto> delayedTasks;

    public RiskAndDependencyDto() {
    }

    public static class DependencyItemDto {
        private String sourceWorkload;
        private String dependsOnWorkload;
        private String dependencyType; // DATABASE, NETWORK, IDENTITY, BATCH
        private String status; // RESOLVED, IN_PROGRESS, PENDING
        private String description;

        public DependencyItemDto() {
        }

        public DependencyItemDto(String sourceWorkload, String dependsOnWorkload, String dependencyType, String status, String description) {
            this.sourceWorkload = sourceWorkload;
            this.dependsOnWorkload = dependsOnWorkload;
            this.dependencyType = dependencyType;
            this.status = status;
            this.description = description;
        }

        public String getSourceWorkload() {
            return sourceWorkload;
        }

        public void setSourceWorkload(String sourceWorkload) {
            this.sourceWorkload = sourceWorkload;
        }

        public String getDependsOnWorkload() {
            return dependsOnWorkload;
        }

        public void setDependsOnWorkload(String dependsOnWorkload) {
            this.dependsOnWorkload = dependsOnWorkload;
        }

        public String getDependencyType() {
            return dependencyType;
        }

        public void setDependencyType(String dependencyType) {
            this.dependencyType = dependencyType;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }
    }

    public static class BlockerItemDto {
        private Long taskId;
        private String taskTitle;
        private String workloadName;
        private String assignedTo;
        private String blockerReason;
        private String suggestedCorrectiveAction;

        public BlockerItemDto() {
        }

        public BlockerItemDto(Long taskId, String taskTitle, String workloadName, String assignedTo, String blockerReason, String suggestedCorrectiveAction) {
            this.taskId = taskId;
            this.taskTitle = taskTitle;
            this.workloadName = workloadName;
            this.assignedTo = assignedTo;
            this.blockerReason = blockerReason;
            this.suggestedCorrectiveAction = suggestedCorrectiveAction;
        }

        public Long getTaskId() {
            return taskId;
        }

        public void setTaskId(Long taskId) {
            this.taskId = taskId;
        }

        public String getTaskTitle() {
            return taskTitle;
        }

        public void setTaskTitle(String taskTitle) {
            this.taskTitle = taskTitle;
        }

        public String getWorkloadName() {
            return workloadName;
        }

        public void setWorkloadName(String workloadName) {
            this.workloadName = workloadName;
        }

        public String getAssignedTo() {
            return assignedTo;
        }

        public void setAssignedTo(String assignedTo) {
            this.assignedTo = assignedTo;
        }

        public String getBlockerReason() {
            return blockerReason;
        }

        public void setBlockerReason(String blockerReason) {
            this.blockerReason = blockerReason;
        }

        public String getSuggestedCorrectiveAction() {
            return suggestedCorrectiveAction;
        }

        public void setSuggestedCorrectiveAction(String suggestedCorrectiveAction) {
            this.suggestedCorrectiveAction = suggestedCorrectiveAction;
        }
    }

    public static class RiskItemDto {
        private String workloadName;
        private String riskLevel; // CRITICAL, HIGH, MEDIUM, LOW
        private String riskCategory; // DATA_LOSS, DOWNTIME, PERFORMANCE, SECURITY
        private String description;
        private String mitigationStrategy;

        public RiskItemDto() {
        }

        public RiskItemDto(String workloadName, String riskLevel, String riskCategory, String description, String mitigationStrategy) {
            this.workloadName = workloadName;
            this.riskLevel = riskLevel;
            this.riskCategory = riskCategory;
            this.description = description;
            this.mitigationStrategy = mitigationStrategy;
        }

        public String getWorkloadName() {
            return workloadName;
        }

        public void setWorkloadName(String workloadName) {
            this.workloadName = workloadName;
        }

        public String getRiskLevel() {
            return riskLevel;
        }

        public void setRiskLevel(String riskLevel) {
            this.riskLevel = riskLevel;
        }

        public String getRiskCategory() {
            return riskCategory;
        }

        public void setRiskCategory(String riskCategory) {
            this.riskCategory = riskCategory;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public String getMitigationStrategy() {
            return mitigationStrategy;
        }

        public void setMitigationStrategy(String mitigationStrategy) {
            this.mitigationStrategy = mitigationStrategy;
        }
    }

    public static class ConflictItemDto {
        private String conflictTitle;
        private String affectedWave;
        private String details;
        private String recommendedResolution;

        public ConflictItemDto() {
        }

        public ConflictItemDto(String conflictTitle, String affectedWave, String details, String recommendedResolution) {
            this.conflictTitle = conflictTitle;
            this.affectedWave = affectedWave;
            this.details = details;
            this.recommendedResolution = recommendedResolution;
        }

        public String getConflictTitle() {
            return conflictTitle;
        }

        public void setConflictTitle(String conflictTitle) {
            this.conflictTitle = conflictTitle;
        }

        public String getAffectedWave() {
            return affectedWave;
        }

        public void setAffectedWave(String affectedWave) {
            this.affectedWave = affectedWave;
        }

        public String getDetails() {
            return details;
        }

        public void setDetails(String details) {
            this.details = details;
        }

        public String getRecommendedResolution() {
            return recommendedResolution;
        }

        public void setRecommendedResolution(String recommendedResolution) {
            this.recommendedResolution = recommendedResolution;
        }
    }

    public static class DelayedTaskDto {
        private Long taskId;
        private String taskTitle;
        private String assignedTo;
        private String dueDate;
        private Long daysOverdue;

        public DelayedTaskDto() {
        }

        public DelayedTaskDto(Long taskId, String taskTitle, String assignedTo, String dueDate, Long daysOverdue) {
            this.taskId = taskId;
            this.taskTitle = taskTitle;
            this.assignedTo = assignedTo;
            this.dueDate = dueDate;
            this.daysOverdue = daysOverdue;
        }

        public Long getTaskId() {
            return taskId;
        }

        public void setTaskId(Long taskId) {
            this.taskId = taskId;
        }

        public String getTaskTitle() {
            return taskTitle;
        }

        public void setTaskTitle(String taskTitle) {
            this.taskTitle = taskTitle;
        }

        public String getAssignedTo() {
            return assignedTo;
        }

        public void setAssignedTo(String assignedTo) {
            this.assignedTo = assignedTo;
        }

        public String getDueDate() {
            return dueDate;
        }

        public void setDueDate(String dueDate) {
            this.dueDate = dueDate;
        }

        public Long getDaysOverdue() {
            return daysOverdue;
        }

        public void setDaysOverdue(Long daysOverdue) {
            this.daysOverdue = daysOverdue;
        }
    }

    public List<DependencyItemDto> getWorkloadDependencies() {
        return workloadDependencies;
    }

    public void setWorkloadDependencies(List<DependencyItemDto> workloadDependencies) {
        this.workloadDependencies = workloadDependencies;
    }

    public List<BlockerItemDto> getMigrationBlockers() {
        return migrationBlockers;
    }

    public void setMigrationBlockers(List<BlockerItemDto> migrationBlockers) {
        this.migrationBlockers = migrationBlockers;
    }

    public List<RiskItemDto> getHighRiskWorkloads() {
        return highRiskWorkloads;
    }

    public void setHighRiskWorkloads(List<RiskItemDto> highRiskWorkloads) {
        this.highRiskWorkloads = highRiskWorkloads;
    }

    public List<ConflictItemDto> getScheduleConflicts() {
        return scheduleConflicts;
    }

    public void setScheduleConflicts(List<ConflictItemDto> scheduleConflicts) {
        this.scheduleConflicts = scheduleConflicts;
    }

    public List<DelayedTaskDto> getDelayedTasks() {
        return delayedTasks;
    }

    public void setDelayedTasks(List<DelayedTaskDto> delayedTasks) {
        this.delayedTasks = delayedTasks;
    }
}

