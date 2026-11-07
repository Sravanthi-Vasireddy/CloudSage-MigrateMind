package com.cloudsage.backend.dto;

import java.util.List;
import java.util.Map;

public class MigrationProgressSummaryDto {

    private Integer totalWorkloads;
    private Integer completedWorkloads;
    private Integer inProgressWorkloads;
    private Integer pendingWorkloads;

    private Integer totalTasks;
    private Integer completedTasks;
    private Integer inProgressTasks;
    private Integer notStartedTasks;
    private Integer blockedTasks;

    private Double overallProgressPercentage;
    private List<WaveProgressDto> waveProgressList;
    private Map<String, Integer> tasksByCategory;

    public MigrationProgressSummaryDto() {
    }

    public static class WaveProgressDto {
        private Long waveId;
        private Integer waveNumber;
        private String waveName;
        private String status;
        private Double progressPercentage;
        private Integer totalTasks;
        private Integer completedTasks;
        private Integer workloadCount;

        public WaveProgressDto() {
        }

        public Long getWaveId() {
            return waveId;
        }

        public void setWaveId(Long waveId) {
            this.waveId = waveId;
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

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public Double getProgressPercentage() {
            return progressPercentage;
        }

        public void setProgressPercentage(Double progressPercentage) {
            this.progressPercentage = progressPercentage;
        }

        public Integer getTotalTasks() {
            return totalTasks;
        }

        public void setTotalTasks(Integer totalTasks) {
            this.totalTasks = totalTasks;
        }

        public Integer getCompletedTasks() {
            return completedTasks;
        }

        public void setCompletedTasks(Integer completedTasks) {
            this.completedTasks = completedTasks;
        }

        public Integer getWorkloadCount() {
            return workloadCount;
        }

        public void setWorkloadCount(Integer workloadCount) {
            this.workloadCount = workloadCount;
        }
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

    public Integer getInProgressWorkloads() {
        return inProgressWorkloads;
    }

    public void setInProgressWorkloads(Integer inProgressWorkloads) {
        this.inProgressWorkloads = inProgressWorkloads;
    }

    public Integer getPendingWorkloads() {
        return pendingWorkloads;
    }

    public void setPendingWorkloads(Integer pendingWorkloads) {
        this.pendingWorkloads = pendingWorkloads;
    }

    public Integer getTotalTasks() {
        return totalTasks;
    }

    public void setTotalTasks(Integer totalTasks) {
        this.totalTasks = totalTasks;
    }

    public Integer getCompletedTasks() {
        return completedTasks;
    }

    public void setCompletedTasks(Integer completedTasks) {
        this.completedTasks = completedTasks;
    }

    public Integer getInProgressTasks() {
        return inProgressTasks;
    }

    public void setInProgressTasks(Integer inProgressTasks) {
        this.inProgressTasks = inProgressTasks;
    }

    public Integer getNotStartedTasks() {
        return notStartedTasks;
    }

    public void setNotStartedTasks(Integer notStartedTasks) {
        this.notStartedTasks = notStartedTasks;
    }

    public Integer getBlockedTasks() {
        return blockedTasks;
    }

    public void setBlockedTasks(Integer blockedTasks) {
        this.blockedTasks = blockedTasks;
    }

    public Double getOverallProgressPercentage() {
        return overallProgressPercentage;
    }

    public void setOverallProgressPercentage(Double overallProgressPercentage) {
        this.overallProgressPercentage = overallProgressPercentage;
    }

    public List<WaveProgressDto> getWaveProgressList() {
        return waveProgressList;
    }

    public void setWaveProgressList(List<WaveProgressDto> waveProgressList) {
        this.waveProgressList = waveProgressList;
    }

    public Map<String, Integer> getTasksByCategory() {
        return tasksByCategory;
    }

    public void setTasksByCategory(Map<String, Integer> tasksByCategory) {
        this.tasksByCategory = tasksByCategory;
    }
}

