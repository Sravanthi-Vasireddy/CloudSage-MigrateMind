package com.cloudsage.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class FailureResolveRequestDto {

    @NotBlank(message = "Troubleshooting notes are required")
    private String troubleshootingNotes;

    private String recoveryStatus = "RESOLVED";

    public FailureResolveRequestDto() {
    }

    public FailureResolveRequestDto(String troubleshootingNotes, String recoveryStatus) {
        this.troubleshootingNotes = troubleshootingNotes;
        this.recoveryStatus = recoveryStatus;
    }

    public String getTroubleshootingNotes() {
        return troubleshootingNotes;
    }

    public void setTroubleshootingNotes(String troubleshootingNotes) {
        this.troubleshootingNotes = troubleshootingNotes;
    }

    public String getRecoveryStatus() {
        return recoveryStatus;
    }

    public void setRecoveryStatus(String recoveryStatus) {
        this.recoveryStatus = recoveryStatus;
    }
}

