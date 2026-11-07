package com.cloudsage.backend.controller;

import com.cloudsage.backend.dto.ArchitectureComparisonDto;
import com.cloudsage.backend.dto.ArchitectureModificationDto;
import com.cloudsage.backend.dto.ArchitectureResponseDto;
import com.cloudsage.backend.service.TargetArchitectureService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/architectures")
public class TargetArchitectureController {

    private final TargetArchitectureService architectureService;

    public TargetArchitectureController(TargetArchitectureService architectureService) {
        this.architectureService = architectureService;
    }

    @PostMapping("/generate/{provider}")
    public ResponseEntity<ArchitectureResponseDto> generateArchitecture(@PathVariable String provider) {
        ArchitectureResponseDto dto = architectureService.generateArchitecture(provider);
        return new ResponseEntity<>(dto, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ArchitectureResponseDto>> getAllArchitectures() {
        List<ArchitectureResponseDto> list = architectureService.getAllArchitectures();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ArchitectureResponseDto> getArchitectureById(@PathVariable Long id) {
        ArchitectureResponseDto dto = architectureService.getArchitectureById(id);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/provider/{provider}")
    public ResponseEntity<ArchitectureResponseDto> getArchitectureByProvider(@PathVariable String provider) {
        ArchitectureResponseDto dto = architectureService.getArchitectureByProvider(provider);
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ArchitectureResponseDto> updateArchitecture(
            @PathVariable Long id,
            @RequestBody ArchitectureModificationDto modificationDto) {
        ArchitectureResponseDto updated = architectureService.updateArchitecture(id, modificationDto);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/compare")
    public ResponseEntity<ArchitectureComparisonDto> getArchitectureComparison() {
        ArchitectureComparisonDto comparison = architectureService.getArchitectureComparison();
        return ResponseEntity.ok(comparison);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteArchitecture(@PathVariable Long id) {
        architectureService.deleteArchitecture(id);
        return ResponseEntity.noContent().build();
    }
}

