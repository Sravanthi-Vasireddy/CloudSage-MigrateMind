package com.cloudsage.backend.repository;

import com.cloudsage.backend.entity.Infrastructure;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InfrastructureRepository extends JpaRepository<Infrastructure, Long> {

    List<Infrastructure> findByEnvironmentIgnoreCase(String environment);

    List<Infrastructure> findByBusinessCriticalityIgnoreCase(String businessCriticality);

    boolean existsByServerNameIgnoreCase(String serverName);
}

