package com.cloudsage.backend.dto;

public class ArchitectureModificationDto {

    private Boolean isMultiRegionDR;
    private String secondaryRegion;
    private String nodesJson;
    private String edgesJson;
    private String description;

    public ArchitectureModificationDto() {
    }

    public Boolean getIsMultiRegionDR() {
        return isMultiRegionDR;
    }

    public void setIsMultiRegionDR(Boolean isMultiRegionDR) {
        this.isMultiRegionDR = isMultiRegionDR;
    }

    public String getSecondaryRegion() {
        return secondaryRegion;
    }

    public void setSecondaryRegion(String secondaryRegion) {
        this.secondaryRegion = secondaryRegion;
    }

    public String getNodesJson() {
        return nodesJson;
    }

    public void setNodesJson(String nodesJson) {
        this.nodesJson = nodesJson;
    }

    public String getEdgesJson() {
        return edgesJson;
    }

    public void setEdgesJson(String edgesJson) {
        this.edgesJson = edgesJson;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}

