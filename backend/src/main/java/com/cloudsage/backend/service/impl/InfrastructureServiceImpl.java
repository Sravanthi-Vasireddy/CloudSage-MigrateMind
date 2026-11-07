package com.cloudsage.backend.service.impl;

import com.cloudsage.backend.dto.InfrastructureRequestDto;
import com.cloudsage.backend.dto.InfrastructureResponseDto;
import com.cloudsage.backend.entity.Infrastructure;
import com.cloudsage.backend.exception.ResourceNotFoundException;
import com.cloudsage.backend.repository.InfrastructureRepository;
import com.cloudsage.backend.service.InfrastructureService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class InfrastructureServiceImpl implements InfrastructureService {

    private final InfrastructureRepository repository;

    public InfrastructureServiceImpl(InfrastructureRepository repository) {
        this.repository = repository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<InfrastructureResponseDto> getAllInfrastructure() {
        return repository.findAll()
                .stream()
                .map(InfrastructureResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public InfrastructureResponseDto getInfrastructureById(Long id) {
        Infrastructure entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Infrastructure", "id", id));
        return InfrastructureResponseDto.fromEntity(entity);
    }

    @Override
    public InfrastructureResponseDto createInfrastructure(InfrastructureRequestDto requestDto) {
        Infrastructure entity = new Infrastructure();
        copyDtoToEntity(requestDto, entity);

        Infrastructure savedEntity = repository.save(entity);
        return InfrastructureResponseDto.fromEntity(savedEntity);
    }

    @Override
    public InfrastructureResponseDto updateInfrastructure(Long id, InfrastructureRequestDto requestDto) {
        Infrastructure entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Infrastructure", "id", id));

        copyDtoToEntity(requestDto, entity);

        Infrastructure updatedEntity = repository.save(entity);
        return InfrastructureResponseDto.fromEntity(updatedEntity);
    }

    @Override
    public void deleteInfrastructure(Long id) {
        Infrastructure entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Infrastructure", "id", id));
        repository.delete(entity);
    }

    private void copyDtoToEntity(InfrastructureRequestDto dto, Infrastructure entity) {
        entity.setWorkloadName(dto.getWorkloadName());
        entity.setApplicationName(dto.getApplicationName());
        entity.setServerName(dto.getServerName());
        entity.setOperatingSystem(dto.getOperatingSystem());
        entity.setCpuCores(dto.getCpuCores());
        entity.setRamGB(dto.getRamGB());
        entity.setStorageGB(dto.getStorageGB());
        entity.setDatabaseType(dto.getDatabaseType());
        entity.setEnvironment(dto.getEnvironment());
        entity.setBusinessCriticality(dto.getBusinessCriticality());
        entity.setDescription(dto.getDescription());
    }
}

