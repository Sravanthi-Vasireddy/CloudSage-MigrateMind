package com.cloudsage.backend.dto;

public class TeamWorkloadDto {

    private String memberName;
    private String role;
    private Integer totalTasksAssigned;
    private Integer completedTasks;
    private Integer inProgressTasks;
    private Integer blockedTasks;
    private Double totalEstimatedHours;
    private Double allocationPercentage;

    public TeamWorkloadDto() {
    }

    public TeamWorkloadDto(String memberName, String role, Integer totalTasksAssigned, Integer completedTasks,
                           Integer inProgressTasks, Integer blockedTasks, Double totalEstimatedHours, Double allocationPercentage) {
        this.memberName = memberName;
        this.role = role;
        this.totalTasksAssigned = totalTasksAssigned;
        this.completedTasks = completedTasks;
        this.inProgressTasks = inProgressTasks;
        this.blockedTasks = blockedTasks;
        this.totalEstimatedHours = totalEstimatedHours;
        this.allocationPercentage = allocationPercentage;
    }

    public String getMemberName() {
        return memberName;
    }

    public void setMemberName(String memberName) {
        this.memberName = memberName;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Integer getTotalTasksAssigned() {
        return totalTasksAssigned;
    }

    public void setTotalTasksAssigned(Integer totalTasksAssigned) {
        this.totalTasksAssigned = totalTasksAssigned;
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

    public Integer getBlockedTasks() {
        return blockedTasks;
    }

    public void setBlockedTasks(Integer blockedTasks) {
        this.blockedTasks = blockedTasks;
    }

    public Double getTotalEstimatedHours() {
        return totalEstimatedHours;
    }

    public void setTotalEstimatedHours(Double totalEstimatedHours) {
        this.totalEstimatedHours = totalEstimatedHours;
    }

    public Double getAllocationPercentage() {
        return allocationPercentage;
    }

    public void setAllocationPercentage(Double allocationPercentage) {
        this.allocationPercentage = allocationPercentage;
    }
}

