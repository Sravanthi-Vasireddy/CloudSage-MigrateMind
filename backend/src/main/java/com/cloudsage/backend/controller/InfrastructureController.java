package com.cloudsage.backend.controller;

import com.cloudsage.backend.dto.InfrastructureRequestDto;
import com.cloudsage.backend.dto.InfrastructureResponseDto;
import com.cloudsage.backend.service.InfrastructureService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/infrastructure")
public class InfrastructureController {

    private final InfrastructureService infrastructureService;

    public InfrastructureController(InfrastructureService infrastructureService) {
        this.infrastructureService = infrastructureService;
    }

    @GetMapping
    public ResponseEntity<List<InfrastructureResponseDto>> getAllInfrastructure() {
        List<InfrastructureResponseDto> list = infrastructureService.getAllInfrastructure();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<InfrastructureResponseDto> getInfrastructureById(@PathVariable Long id) {
        InfrastructureResponseDto dto = infrastructureService.getInfrastructureById(id);
        return ResponseEntity.ok(dto);
    }

    @PostMapping
    public ResponseEntity<InfrastructureResponseDto> createInfrastructure(
            @Valid @RequestBody InfrastructureRequestDto requestDto) {
        InfrastructureResponseDto created = infrastructureService.createInfrastructure(requestDto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<InfrastructureResponseDto> updateInfrastructure(
            @PathVariable Long id,
            @Valid @RequestBody InfrastructureRequestDto requestDto) {
        InfrastructureResponseDto updated = infrastructureService.updateInfrastructure(id, requestDto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInfrastructure(@PathVariable Long id) {
        infrastructureService.deleteInfrastructure(id);
        return ResponseEntity.noContent().build();
    }
}

