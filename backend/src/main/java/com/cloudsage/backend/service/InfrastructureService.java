package com.cloudsage.backend.service;

import com.cloudsage.backend.dto.InfrastructureRequestDto;
import com.cloudsage.backend.dto.InfrastructureResponseDto;

import java.util.List;

public interface InfrastructureService {

    List<InfrastructureResponseDto> getAllInfrastructure();

    InfrastructureResponseDto getInfrastructureById(Long id);

    InfrastructureResponseDto createInfrastructure(InfrastructureRequestDto requestDto);

    InfrastructureResponseDto updateInfrastructure(Long id, InfrastructureRequestDto requestDto);

    void deleteInfrastructure(Long id);
}

