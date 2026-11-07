package com.cloudsage.backend.service;

import com.cloudsage.backend.dto.ArchitectureComparisonDto;
import com.cloudsage.backend.dto.ArchitectureModificationDto;
import com.cloudsage.backend.dto.ArchitectureResponseDto;

import java.util.List;

public interface TargetArchitectureService {

    ArchitectureResponseDto generateArchitecture(String provider);

    List<ArchitectureResponseDto> getAllArchitectures();

    ArchitectureResponseDto getArchitectureById(Long id);

    ArchitectureResponseDto getArchitectureByProvider(String provider);

    ArchitectureResponseDto updateArchitecture(Long id, ArchitectureModificationDto modificationDto);

    ArchitectureComparisonDto getArchitectureComparison();

    void deleteArchitecture(Long id);
}

