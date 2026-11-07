package com.cloudsage.backend.repository;

import com.cloudsage.backend.entity.TargetArchitecture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TargetArchitectureRepository extends JpaRepository<TargetArchitecture, Long> {

    Optional<TargetArchitecture> findByProvider(String provider);

    List<TargetArchitecture> findAllByOrderByCreatedAtDesc();

    boolean existsByProvider(String provider);
}

