package com.cloudsage.backend.dto;

import java.time.LocalDate;
import java.util.List;

public class MigrationWaveUpdateRequestDto {

    private String waveName;
    private String description;
    private String status;
    private LocalDate startDate;
    private LocalDate endDate;
    private String waveLead;
    private List<String> workloadNames;
    private Integer sortOrder;

    public MigrationWaveUpdateRequestDto() {
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

    public List<String> getWorkloadNames() {
        return workloadNames;
    }

    public void setWorkloadNames(List<String> workloadNames) {
        this.workloadNames = workloadNames;
    }

    public Integer getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(Integer sortOrder) {
        this.sortOrder = sortOrder;
    }
}

