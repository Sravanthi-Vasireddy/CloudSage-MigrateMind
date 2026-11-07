package com.cloudsage.backend.repository;

import com.cloudsage.backend.entity.SecurityAssessmentControl;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SecurityAssessmentControlRepository extends JpaRepository<SecurityAssessmentControl, Long> {
    List<SecurityAssessmentControl> findByDomainOrderByIdAsc(String domain);
    List<SecurityAssessmentControl> findByStatus(String status);
    List<SecurityAssessmentControl> findByMissingControlTrue();
    Optional<SecurityAssessmentControl> findByControlId(String controlId);
}

