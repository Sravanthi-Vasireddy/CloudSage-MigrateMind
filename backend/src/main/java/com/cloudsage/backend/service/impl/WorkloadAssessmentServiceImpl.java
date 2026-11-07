package com.cloudsage.backend.service.impl;

import com.cloudsage.backend.dto.AssessmentOverrideDto;
import com.cloudsage.backend.dto.AssessmentResponseDto;
import com.cloudsage.backend.dto.AssessmentSummaryDto;
import com.cloudsage.backend.entity.Infrastructure;
import com.cloudsage.backend.entity.WorkloadAssessment;
import com.cloudsage.backend.exception.ResourceNotFoundException;
import com.cloudsage.backend.repository.InfrastructureRepository;
import com.cloudsage.backend.repository.WorkloadAssessmentRepository;
import com.cloudsage.backend.service.WorkloadAssessmentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class WorkloadAssessmentServiceImpl implements WorkloadAssessmentService {

    private final WorkloadAssessmentRepository assessmentRepository;
    private final InfrastructureRepository infrastructureRepository;

    public WorkloadAssessmentServiceImpl(WorkloadAssessmentRepository assessmentRepository,
                                        InfrastructureRepository infrastructureRepository) {
        this.assessmentRepository = assessmentRepository;
        this.infrastructureRepository = infrastructureRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<AssessmentResponseDto> getAllAssessments() {
        return assessmentRepository.findAll()
                .stream()
                .map(AssessmentResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public AssessmentResponseDto getAssessmentById(Long id) {
        WorkloadAssessment assessment = assessmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("WorkloadAssessment", "id", id));
        return AssessmentResponseDto.fromEntity(assessment);
    }

    @Override
    @Transactional(readOnly = true)
    public AssessmentResponseDto getAssessmentByInfrastructureId(Long infrastructureId) {
        WorkloadAssessment assessment = assessmentRepository.findByInfrastructureId(infrastructureId)
                .orElseThrow(() -> new ResourceNotFoundException("WorkloadAssessment", "infrastructureId", infrastructureId));
        return AssessmentResponseDto.fromEntity(assessment);
    }

    @Override
    public AssessmentResponseDto evaluateInfrastructureWorkload(Long infrastructureId) {
        Infrastructure infra = infrastructureRepository.findById(infrastructureId)
                .orElseThrow(() -> new ResourceNotFoundException("Infrastructure", "id", infrastructureId));

        WorkloadAssessment assessment = assessmentRepository.findByInfrastructureId(infrastructureId)
                .orElse(new WorkloadAssessment());

        evaluateWorkloadInternal(infra, assessment);

        WorkloadAssessment saved = assessmentRepository.save(assessment);
        return AssessmentResponseDto.fromEntity(saved);
    }

    @Override
    public List<AssessmentResponseDto> evaluateAllWorkloads() {
        List<Infrastructure> allInfra = infrastructureRepository.findAll();
        List<WorkloadAssessment> results = new ArrayList<>();

        for (Infrastructure infra : allInfra) {
            WorkloadAssessment assessment = assessmentRepository.findByInfrastructureId(infra.getId())
                    .orElse(new WorkloadAssessment());

            evaluateWorkloadInternal(infra, assessment);
            results.add(assessmentRepository.save(assessment));
        }

        return results.stream()
                .map(AssessmentResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public AssessmentResponseDto overrideStrategy(Long id, AssessmentOverrideDto overrideDto) {
        WorkloadAssessment assessment = assessmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("WorkloadAssessment", "id", id));

        assessment.setSelectedStrategy(overrideDto.getSelectedStrategy());
        assessment.setIsOverridden(true);
        assessment.setOverrideReason(overrideDto.getOverrideReason());

        WorkloadAssessment saved = assessmentRepository.save(assessment);
        return AssessmentResponseDto.fromEntity(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public AssessmentSummaryDto getAssessmentSummary() {
        long totalWorkloads = infrastructureRepository.count();
        List<WorkloadAssessment> assessments = assessmentRepository.findAll();
        long assessedWorkloads = assessments.size();

        Map<String, Long> strategyDistribution = new HashMap<>();
        strategyDistribution.put("Rehost", 0L);
        strategyDistribution.put("Replatform", 0L);
        strategyDistribution.put("Refactor", 0L);
        strategyDistribution.put("Repurchase", 0L);
        strategyDistribution.put("Retain", 0L);
        strategyDistribution.put("Retire", 0L);

        Map<String, Long> complexityDistribution = new HashMap<>();
        complexityDistribution.put("Low", 0L);
        complexityDistribution.put("Medium", 0L);
        complexityDistribution.put("High", 0L);

        double totalReadiness = 0.0;
        long overriddenCount = 0;

        for (WorkloadAssessment a : assessments) {
            String strat = a.getSelectedStrategy() != null ? a.getSelectedStrategy() : a.getRecommendedStrategy();
            strategyDistribution.put(strat, strategyDistribution.getOrDefault(strat, 0L) + 1L);

            String comp = a.getMigrationComplexity();
            complexityDistribution.put(comp, complexityDistribution.getOrDefault(comp, 0L) + 1L);

            totalReadiness += a.getReadinessScore() != null ? a.getReadinessScore() : 0;
            if (Boolean.TRUE.equals(a.getIsOverridden())) {
                overriddenCount++;
            }
        }

        double avgReadiness = assessedWorkloads > 0 ? Math.round((totalReadiness / assessedWorkloads) * 10.0) / 10.0 : 0.0;

        return new AssessmentSummaryDto(
                totalWorkloads,
                assessedWorkloads,
                strategyDistribution,
                complexityDistribution,
                avgReadiness,
                overriddenCount
        );
    }

    @Override
    public void deleteAssessment(Long id) {
        WorkloadAssessment assessment = assessmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("WorkloadAssessment", "id", id));
        assessmentRepository.delete(assessment);
    }

    /**
     * 6Rs Decision Engine Rule Evaluator
     */
    private void evaluateWorkloadInternal(Infrastructure infra, WorkloadAssessment assessment) {
        assessment.setInfrastructureId(infra.getId());
        assessment.setWorkloadName(infra.getWorkloadName());
        assessment.setApplicationName(infra.getApplicationName());
        assessment.setServerName(infra.getServerName());
        assessment.setOperatingSystem(infra.getOperatingSystem());
        assessment.setCpuCores(infra.getCpuCores());
        assessment.setRamGB(infra.getRamGB());
        assessment.setStorageGB(infra.getStorageGB());
        assessment.setDatabaseType(infra.getDatabaseType());
        assessment.setEnvironment(infra.getEnvironment());
        assessment.setBusinessCriticality(infra.getBusinessCriticality());

        String os = infra.getOperatingSystem() != null ? infra.getOperatingSystem().toLowerCase() : "";
        String desc = infra.getDescription() != null ? infra.getDescription().toLowerCase() : "";
        String name = (infra.getWorkloadName() + " " + infra.getApplicationName()).toLowerCase();
        String db = infra.getDatabaseType() != null ? infra.getDatabaseType().toLowerCase() : "";
        boolean hasDb = infra.getDatabaseType() != null && !infra.getDatabaseType().trim().isEmpty() && !infra.getDatabaseType().equalsIgnoreCase("none");
        boolean isMissionCritical = "Mission Critical".equalsIgnoreCase(infra.getBusinessCriticality());
        boolean isHighCritical = "High".equalsIgnoreCase(infra.getBusinessCriticality());

        // 1. Performance & Scalability Sizing
        if (infra.getCpuCores() >= 16 || infra.getRamGB() >= 64 || infra.getStorageGB() >= 1000) {
            assessment.setPerformanceRequirements("Extreme Throughput (< 5ms SLA)");
            assessment.setScalabilityRequirements("Dynamic Auto-scale (High-Burst Elasticity)");
        } else if (infra.getCpuCores() >= 8 || infra.getRamGB() >= 32) {
            assessment.setPerformanceRequirements("High Performance (Tier-1 Enterprise)");
            assessment.setScalabilityRequirements("Predictable Horizontal Scaling");
        } else {
            assessment.setPerformanceRequirements("Standard SLA Performance");
            assessment.setScalabilityRequirements("Standard Scheduled Scale");
        }

        // 2. Security Requirements
        if (isMissionCritical) {
            assessment.setSecurityRequirements("PCI-DSS / ISO27001, AWS KMS HSM, Private Subnets, Multi-AZ Failover");
        } else if (isHighCritical) {
            assessment.setSecurityRequirements("Enterprise Strict Compliance, IAM RBAC, TLS 1.3, Encrypted EBS/RDS");
        } else {
            assessment.setSecurityRequirements("Standard Enterprise GuardDuty, Security Groups, WAF Protection");
        }

        // 3. Infrastructure Complexity Score (1-100)
        int compScore = 20;
        compScore += Math.min(30, (int) (infra.getCpuCores() * 1.5 + infra.getRamGB() / 4.0));
        compScore += Math.min(20, infra.getStorageGB() / 50);
        if (hasDb) compScore += 18;
        if (isMissionCritical) compScore += 12;
        compScore = Math.max(15, Math.min(98, compScore));
        assessment.setInfrastructureComplexity(compScore);

        // 4. Application Dependencies Count
        int depCount = 2;
        if (hasDb) depCount += 2;
        if (isMissionCritical) depCount += 4;
        else if (isHighCritical) depCount += 2;
        if (desc.contains("cluster") || desc.contains("portal") || desc.contains("distributed")) depCount += 2;
        assessment.setApplicationDependencies(depCount);

        // 5. 6Rs Migration Strategy Decision Tree
        String recommended;
        String rationale;
        String complexity;
        String risks;
        String dependencies;
        String actions;
        int readiness;
        int effortWeeks;

        // Rule A: Retire
        if (desc.contains("archive") || desc.contains("deprecated") || desc.contains("decommission") ||
                desc.contains("obsolete") || desc.contains("sunsetting") ||
                (infra.getCpuCores() <= 2 && "Low".equalsIgnoreCase(infra.getBusinessCriticality()) && depCount <= 2)) {
            recommended = "Retire";
            complexity = "Low";
            effortWeeks = 2;
            readiness = 98;
            rationale = "Workload has been analyzed as low utilization or legacy archive. Retiring it reduces on-premises footprint, eliminates software maintenance fees, and avoids unnecessary cloud compute expenditure.";
            risks = "Minimal operational risk. Potential archival data retention compliance requirements.";
            dependencies = "Historical cold-storage backup; Data retention policy sign-off.";
            actions = "Export historical tables to AWS S3 Glacier Deep Archive; Terminate hypervisor VM and update CMDB records.";
        }
        // Rule B: Repurchase
        else if (name.contains("crm") || name.contains("client360") || name.contains("helpdesk") ||
                name.contains("ticketing") || name.contains("hr") || name.contains("payroll") ||
                name.contains("billing") || name.contains("salesforce") || desc.contains("cots") ||
                (name.contains("customer") && !isMissionCritical && !name.contains("engine"))) {
            recommended = "Repurchase";
            complexity = "Medium";
            effortWeeks = 6;
            readiness = 82;
            rationale = "Commercial off-the-shelf (COTS) business application. High total cost of ownership (TCO) for custom infrastructure hosting; recommended to repurchase as modern SaaS solution (e.g., Salesforce, Workday, or modern SaaS CRM) to eliminate infrastructure maintenance.";
            risks = "Data migration schema mapping; Integration connector rebuild with corporate LDAP/SSO.";
            dependencies = "SaaS vendor procurement; Okta / Azure AD SAML 2.0 Identity Provider; ETL connector pipelines.";
            actions = "Perform SaaS feature-parity matrix; Build REST API connectors; Stage data migration using AWS Glue ETL.";
        }
        // Rule C: Retain
        else if (os.contains("solaris") || os.contains("aix") || os.contains("hp-ux") || os.contains("2003") ||
                desc.contains("air-gapped") || desc.contains("hardware dongle") || desc.contains("regulatory restricted")) {
            recommended = "Retain";
            complexity = "High";
            effortWeeks = 0;
            readiness = 42;
            rationale = "Workload utilizes non-x86 hardware, unsupported legacy kernels, or has strict air-gapped physical compliance mandates. Retaining on-premises prevents high-risk migration failure while a modernization pathway is architected.";
            risks = "Continued on-premises datacenter hosting expense; Aging physical server hardware failure.";
            dependencies = "Dedicated physical SAN storage; Legacy hardware hypervisors.";
            actions = "Keep workload in Chicago Equinix DC-1; Isolate VLAN network perimeter; Plan future container re-write in Wave 4.";
        }
        // Rule D: Replatform (Database-centric or proprietary DB clusters like Oracle RAC, SQL Server, etc.)
        else if (hasDb && (db.contains("oracle") || db.contains("rac") || db.contains("sql server") || db.contains("sybase") || db.contains("db2") || name.contains("database"))) {
            recommended = "Replatform";
            complexity = "High";
            effortWeeks = 8;
            readiness = 86;
            rationale = "Database-centric enterprise service tier with proprietary clustering. Replatforming database layers to managed Amazon RDS Custom / Amazon Aurora and shifting app compute to managed PaaS achieves high availability with zero core application rewrite.";
            risks = "Database schema conversion for proprietary stored procedures; Cutover downtime window; Multi-site data replication lag.";
            dependencies = "AWS Database Migration Service (AWS DMS); AWS Schema Conversion Tool (SCT); Direct Connect / Site-to-Site VPN.";
            actions = "Run AWS SCT automated schema assessment; Deploy Amazon RDS Multi-AZ instance; Set up AWS DMS ongoing CDC replication.";
        }
        // Rule E: Refactor (Cloud-Native Web, Portal, API, Microservices)
        else if ((isMissionCritical || isHighCritical) &&
                (os.contains("linux") || os.contains("ubuntu") || os.contains("debian") || os.contains("rhel 9")) &&
                (name.contains("web") || name.contains("portal") || name.contains("api") || name.contains("ecommerce") || name.contains("sphere"))) {
            recommended = "Refactor";
            complexity = "High";
            effortWeeks = 12;
            readiness = 89;
            rationale = "High-value business application with modern Linux runtime. Re-architecting for cloud-native microservices will unlock auto-scaling elasticity, high availability across multi-AZs, and continuous deployment.";
            risks = "Application code refactoring timeline; Distributed microservice state management; Eventual consistency design.";
            dependencies = "CI/CD automated pipeline (GitHub Actions); AWS EKS Kubernetes Cluster; Amazon Aurora Multi-Region.";
            actions = "Containerize using Docker; Deploy on AWS EKS with Karpenter auto-scaler; Decouple synchronous API calls using Amazon SQS/SNS.";
        }
        // Rule F: Replatform (General PaaS / Managed DB migration)
        else if (hasDb || desc.contains("transactional") || desc.contains("sql")) {
            recommended = "Replatform";
            complexity = "Medium";
            effortWeeks = 6;
            readiness = 88;
            rationale = "Workload utilizes relational database storage. Replatforming data tiers to managed Amazon RDS / Aurora simplifies operational administration and backup policies.";
            risks = "Database version compatibility; Parameter group tuning in cloud.";
            dependencies = "AWS DMS; Amazon RDS PostgreSQL/MySQL.";
            actions = "Set up Amazon RDS managed database; Point connection strings to cloud endpoint.";
        }
        // Rule F: Rehost (Default Lift and Shift)
        else {
            recommended = "Rehost";
            complexity = "Low";
            effortWeeks = 4;
            readiness = 92;
            rationale = "Standard virtualized server workload suitable for automated lift-and-shift using AWS Application Migration Service (AWS MGN). Provides fastest migration velocity and lowest risk without modifying application binaries.";
            risks = "Carries technical debt to cloud; Cloud compute costs will remain equivalent to on-premise footprint.";
            dependencies = "AWS MGN replication agent; AWS Systems Manager; Amazon VPC subnets.";
            actions = "Install AWS MGN replication agent; Initiate block-level background sync; Perform test cutover in staging subnet.";
        }

        assessment.setRecommendedStrategy(recommended);
        // Only set selected strategy if not previously overridden
        if (!Boolean.TRUE.equals(assessment.getIsOverridden())) {
            assessment.setSelectedStrategy(recommended);
            assessment.setIsOverridden(false);
            assessment.setOverrideReason(null);
        }

        assessment.setMigrationComplexity(complexity);
        assessment.setRecommendationRationale(rationale);
        assessment.setRisks(risks);
        assessment.setDependencies(dependencies);
        assessment.setSuggestedActions(actions);
        assessment.setReadinessScore(readiness);
        assessment.setEstimatedEffortWeeks(effortWeeks);
    }
}
