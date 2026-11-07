package com.cloudsage.backend.dto;

public class WaveMigrationProgressDto {

    private Long waveId;
    private Integer waveNumber;
    private String waveName;
    private Integer totalWorkloads;
    private Integer completedWorkloads;
    private Integer inProgressWorkloads;
    private Integer failedWorkloads;
    private Double progressPercentage;
    private String status;

    public WaveMigrationProgressDto() {
    }

    public WaveMigrationProgressDto(Long waveId, Integer waveNumber, String waveName,
                                    Integer totalWorkloads, Integer completedWorkloads,
                                    Integer inProgressWorkloads, Integer failedWorkloads,
                                    Double progressPercentage, String status) {
        this.waveId = waveId;
        this.waveNumber = waveNumber;
        this.waveName = waveName;
        this.totalWorkloads = totalWorkloads;
        this.completedWorkloads = completedWorkloads;
        this.inProgressWorkloads = inProgressWorkloads;
        this.failedWorkloads = failedWorkloads;
        this.progressPercentage = progressPercentage;
        this.status = status;
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

    public Integer getFailedWorkloads() {
        return failedWorkloads;
    }

    public void setFailedWorkloads(Integer failedWorkloads) {
        this.failedWorkloads = failedWorkloads;
    }

    public Double getProgressPercentage() {
        return progressPercentage;
    }

    public void setProgressPercentage(Double progressPercentage) {
        this.progressPercentage = progressPercentage;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}

