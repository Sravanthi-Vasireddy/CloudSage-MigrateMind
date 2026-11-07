package com.cloudsage.backend.config;

import com.cloudsage.backend.dto.CostEstimateRequestDto;
import com.cloudsage.backend.entity.*;
import com.cloudsage.backend.repository.*;
import com.cloudsage.backend.service.FinOpsCostService;
import com.cloudsage.backend.service.MigrationPlanService;
import com.cloudsage.backend.service.TargetArchitectureService;
import com.cloudsage.backend.service.WorkloadAssessmentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class DataLoader implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataLoader.class);

    private final InfrastructureRepository infrastructureRepository;
    private final WorkloadAssessmentRepository assessmentRepository;
    private final WorkloadAssessmentService assessmentService;
    private final TargetArchitectureRepository architectureRepository;
    private final TargetArchitectureService architectureService;
    private final CostEstimateRepository costEstimateRepository;
    private final FinOpsCostService finOpsCostService;
    private final MigrationPlanRepository migrationPlanRepository;
    private final MigrationPlanService migrationPlanService;
    private final MigrationRiskRepository riskRepository;
    private final SecurityAssessmentControlRepository controlRepository;
    private final ComplianceRequirementRepository complianceRepository;
    private final MigrationWorkloadStatusRepository workloadStatusRepository;
    private final WorkloadValidationResultRepository validationResultRepository;
    private final MigrationFailureIncidentRepository failureIncidentRepository;
    private final PerformanceMetricSnapshotRepository metricSnapshotRepository;
    private final MigrationAuditLogRepository auditLogRepository;
    private final MigrationReportRepository reportRepository;

    public DataLoader(InfrastructureRepository infrastructureRepository,
                      WorkloadAssessmentRepository assessmentRepository,
                      WorkloadAssessmentService assessmentService,
                      TargetArchitectureRepository architectureRepository,
                      TargetArchitectureService architectureService,
                      CostEstimateRepository costEstimateRepository,
                      FinOpsCostService finOpsCostService,
                      MigrationPlanRepository migrationPlanRepository,
                      MigrationPlanService migrationPlanService,
                      MigrationRiskRepository riskRepository,
                      SecurityAssessmentControlRepository controlRepository,
                      ComplianceRequirementRepository complianceRepository,
                      MigrationWorkloadStatusRepository workloadStatusRepository,
                      WorkloadValidationResultRepository validationResultRepository,
                      MigrationFailureIncidentRepository failureIncidentRepository,
                      PerformanceMetricSnapshotRepository metricSnapshotRepository,
                      MigrationAuditLogRepository auditLogRepository,
                      MigrationReportRepository reportRepository) {
        this.infrastructureRepository = infrastructureRepository;
        this.assessmentRepository = assessmentRepository;
        this.assessmentService = assessmentService;
        this.architectureRepository = architectureRepository;
        this.architectureService = architectureService;
        this.costEstimateRepository = costEstimateRepository;
        this.finOpsCostService = finOpsCostService;
        this.migrationPlanRepository = migrationPlanRepository;
        this.migrationPlanService = migrationPlanService;
        this.riskRepository = riskRepository;
        this.controlRepository = controlRepository;
        this.complianceRepository = complianceRepository;
        this.workloadStatusRepository = workloadStatusRepository;
        this.validationResultRepository = validationResultRepository;
        this.failureIncidentRepository = failureIncidentRepository;
        this.metricSnapshotRepository = metricSnapshotRepository;
        this.auditLogRepository = auditLogRepository;
        this.reportRepository = reportRepository;
    }

    @Override
    public void run(String... args) {
        if (infrastructureRepository.count() == 0) {
            logger.info("Initializing sample enterprise infrastructure inventory data...");

            Infrastructure bankingServer = new Infrastructure();
            bankingServer.setWorkloadName("Core Banking Engine");
            bankingServer.setApplicationName("FinCore Suite");
            bankingServer.setServerName("prod-fin-app-01.corp.internal");
            bankingServer.setOperatingSystem("Red Hat Enterprise Linux 8.8");
            bankingServer.setCpuCores(16);
            bankingServer.setRamGB(64);
            bankingServer.setStorageGB(500);
            bankingServer.setDatabaseType("Oracle 19c RAC");
            bankingServer.setEnvironment("Production");
            bankingServer.setBusinessCriticality("Mission Critical");
            bankingServer.setDescription("Primary transactional core banking ledger handling account deposits, withdrawals, and wire transfers.");

            Infrastructure ecommerceServer = new Infrastructure();
            ecommerceServer.setWorkloadName("E-Commerce Web Portal");
            ecommerceServer.setApplicationName("ShopSphere Online");
            ecommerceServer.setServerName("prod-shop-web-01.dmz.internal");
            ecommerceServer.setOperatingSystem("Ubuntu Server 22.04 LTS");
            ecommerceServer.setCpuCores(8);
            ecommerceServer.setRamGB(32);
            ecommerceServer.setStorageGB(250);
            ecommerceServer.setDatabaseType("PostgreSQL 15");
            ecommerceServer.setEnvironment("Production");
            ecommerceServer.setBusinessCriticality("High");
            ecommerceServer.setDescription("Customer-facing web tier handling product catalogs, search, shopping cart, and checkout workflows.");

            Infrastructure customerDbServer = new Infrastructure();
            customerDbServer.setWorkloadName("CRM Database Cluster");
            customerDbServer.setApplicationName("Enterprise Client360");
            customerDbServer.setServerName("prod-crm-db-01.corp.internal");
            customerDbServer.setOperatingSystem("Windows Server 2022");
            customerDbServer.setCpuCores(16);
            customerDbServer.setRamGB(128);
            customerDbServer.setStorageGB(1200);
            customerDbServer.setDatabaseType("Microsoft SQL Server 2022");
            customerDbServer.setEnvironment("Production");
            customerDbServer.setBusinessCriticality("High");
            customerDbServer.setDescription("Centralized customer relationship management data store housing enterprise contact records and interactions.");

            infrastructureRepository.saveAll(Arrays.asList(bankingServer, ecommerceServer, customerDbServer));
            logger.info("Successfully seeded 3 enterprise infrastructure workloads.");
        } else {
            logger.info("Database already contains {} infrastructure record(s). Skipping sample data seeding to preserve existing user data.", infrastructureRepository.count());
        }

        // Initialize assessments if none exist yet
        if (assessmentRepository.count() == 0 && infrastructureRepository.count() > 0) {
            logger.info("Running initial 6Rs recommendation engine assessment on available workloads...");
            assessmentService.evaluateAllWorkloads();
            logger.info("Successfully generated 6Rs strategy recommendations for all cataloged workloads.");
        }

        // Initialize target architectures for AWS, Azure, and GCP if none exist yet
        if (architectureRepository.count() == 0) {
            logger.info("Generating baseline Target Cloud Architectures across AWS, Azure, and GCP...");
            architectureService.generateArchitecture("AWS");
            architectureService.generateArchitecture("AZURE");
            architectureService.generateArchitecture("GCP");
            logger.info("Successfully generated multi-cloud target architectures (AWS, Azure, GCP).");
        }

        // Initialize baseline cost estimates if none exist yet
        if (costEstimateRepository.count() == 0) {
            logger.info("Initializing baseline enterprise FinOps cost estimates...");

            CostEstimateRequestDto awsReq = new CostEstimateRequestDto();
            awsReq.setEstimateName("Production Baseline TCO - AWS (3-Yr Savings Plans)");
            awsReq.setProvider("AWS");
            awsReq.setPricingModel("THREE_YEAR_COMMITTED");
            awsReq.setNotes("Baseline production migration estimate based on Graviton3 instances, Aurora PostgreSQL Serverless v2, and S3 Glacier backup tier.");
            finOpsCostService.saveEstimate(awsReq);

            CostEstimateRequestDto azureReq = new CostEstimateRequestDto();
            azureReq.setEstimateName("Production Baseline TCO - Azure (3-Yr Reserved)");
            azureReq.setProvider("AZURE");
            azureReq.setPricingModel("THREE_YEAR_COMMITTED");
            azureReq.setNotes("Azure target estimate leveraging Azure Hybrid Benefit (AHB) for SQL Server CRM database.");
            finOpsCostService.saveEstimate(azureReq);

            CostEstimateRequestDto gcpReq = new CostEstimateRequestDto();
            gcpReq.setEstimateName("Production Baseline TCO - GCP (3-Yr CUD)");
            gcpReq.setProvider("GCP");
            gcpReq.setPricingModel("THREE_YEAR_COMMITTED");
            gcpReq.setNotes("Google Cloud target estimate featuring Tau T2D AMD instances and Cloud SQL Enterprise Plus.");
            finOpsCostService.saveEstimate(gcpReq);

            logger.info("Successfully seeded 3 baseline cloud cost estimates.");
        }

        // Initialize active migration execution plan if none exists yet
        if (migrationPlanRepository.count() == 0) {
            logger.info("Generating baseline enterprise Cloud Migration Execution Plan & 5 Migration Waves...");
            migrationPlanService.generateOrGetActivePlan("AWS");
            logger.info("Successfully seeded active Migration Execution Plan, Waves, and Tasks.");
        }

        // Initialize baseline enterprise migration risks if none exist yet
        if (riskRepository.count() == 0) {
            logger.info("Seeding enterprise Migration Risk Register...");

            MigrationRisk r1 = new MigrationRisk();
            r1.setRiskId("RISK-001");
            r1.setRiskTitle("Database CDC Replication Lag & Transactional Data Loss");
            r1.setDescription("Real-time replication from on-prem Oracle 19c RAC to Aurora PostgreSQL could suffer network throttling, resulting in out-of-sync financial ledgers during cutover.");
            r1.setCategory("DATA_LOSS");
            r1.setAffectedWorkload("Core Banking Engine");
            r1.setProbability(3);
            r1.setImpact(5);
            r1.setOwner("Priya Sharma (DBA)");
            r1.setMitigationPlan("Deploy dedicated AWS DMS replication instance on m6i.2xlarge with Multi-AZ standby and automated cloudwatch alerts for lag > 10ms.");
            r1.setStatus("IN_MITIGATION");
            r1.setMitigationProgress(65);

            MigrationRisk r2 = new MigrationRisk();
            r2.setRiskId("RISK-002");
            r2.setRiskTitle("Extended Production Downtime Beyond 2-Hour Service Maintenance Window");
            r2.setDescription("Large scale schema conversion validation and DNS TTL propagation delays could breach core banking SLA.");
            r2.setCategory("DOWNTIME");
            r2.setAffectedWorkload("Core Banking Engine");
            r2.setProbability(4);
            r2.setImpact(5);
            r2.setOwner("Sai Kumar (Enterprise Lead)");
            r2.setMitigationPlan("Pre-seed DNS TTL to 300 seconds 72 hours prior; conduct 3 weekend dry-run rehearsals in staging.");
            r2.setStatus("IN_MITIGATION");
            r2.setMitigationProgress(50);

            MigrationRisk r3 = new MigrationRisk();
            r3.setRiskId("RISK-003");
            r3.setRiskTitle("Unencrypted Customer PII in Transit Across Hybrid Direct Connect");
            r3.setDescription("CRM Client360 database sync across Direct Connect may send unencrypted plain text if TLS 1.3 is not strictly enforced.");
            r3.setCategory("SECURITY");
            r3.setAffectedWorkload("CRM Database Cluster");
            r3.setProbability(2);
            r3.setImpact(5);
            r3.setOwner("Alex Morgan (Security Eng)");
            r3.setMitigationPlan("Enforce MACsec IEEE 802.1AE link-layer encryption on 10G Direct Connect and rds.force_ssl=1 on target database.");
            r3.setStatus("RESOLVED");
            r3.setMitigationProgress(100);

            MigrationRisk r4 = new MigrationRisk();
            r4.setRiskId("RISK-004");
            r4.setRiskTitle("Direct Connect BGP Route Flapping & Transient Network Latency");
            r4.setDescription("Hybrid interconnect jitter exceeding 25ms will degrade synchronous checkout API call responses.");
            r4.setCategory("NETWORK");
            r4.setAffectedWorkload("Platform Foundation");
            r4.setProbability(3);
            r4.setImpact(4);
            r4.setOwner("David Chen (DevOps / IaC)");
            r4.setMitigationPlan("Provision dual redundant 10 Gbps Direct Connect virtual interfaces across diverse Equinix PoPs with BFD (Bidirectional Forwarding Detection).");
            r4.setStatus("OPEN");
            r4.setMitigationProgress(20);

            MigrationRisk r5 = new MigrationRisk();
            r5.setRiskId("RISK-005");
            r5.setRiskTitle("Monolithic PL/SQL Stored Procedure Compatibility Failure in PostgreSQL");
            r5.setDescription("Complex Oracle analytical window functions and autonomous transaction pragmas do not convert directly via AWS SCT.");
            r5.setCategory("COMPATIBILITY");
            r5.setAffectedWorkload("Core Banking Engine");
            r5.setProbability(3);
            r5.setImpact(4);
            r5.setOwner("Priya Sharma (DBA)");
            r5.setMitigationPlan("Refactor autonomous transactions into separate asynchronous SQS message queues and rewrite custom PL/SQL into native PL/pgSQL routines.");
            r5.setStatus("IN_MITIGATION");
            r5.setMitigationProgress(40);

            riskRepository.saveAll(Arrays.asList(r1, r2, r3, r4, r5));
            logger.info("Successfully seeded 5 baseline migration risks.");
        }

        // Initialize 9 Security Assessment Domains Controls
        if (controlRepository.count() == 0) {
            logger.info("Seeding 9-Domain Security Assessment Controls...");

            SecurityAssessmentControl c1 = new SecurityAssessmentControl();
            c1.setControlId("SEC-IAM-01");
            c1.setDomain("IAM");
            c1.setControlName("Enforce Hardware MFA & SAML 2.0 Single Sign-On");
            c1.setDescription("All administrative console access must require FIDO2 hardware tokens via AWS IAM Identity Center / Entra ID.");
            c1.setTargetCloudService("AWS IAM Identity Center");
            c1.setStatus("PASS");
            c1.setSeverity("HIGH");
            c1.setMissingControl(false);
            c1.setRecommendation("Maintain automated quarterly access review using AWS Identity Center access analyzer.");

            SecurityAssessmentControl c2 = new SecurityAssessmentControl();
            c2.setControlId("SEC-ENC-01");
            c2.setDomain("ENCRYPTION_AT_REST");
            c2.setControlName("Customer Managed KMS Keys (CMK) with Annual Rotation");
            c2.setDescription("All RDS Aurora, EBS volumes, and S3 data lake storage must use customer-managed encryption keys with automatic annual rotation.");
            c2.setTargetCloudService("AWS KMS CMK");
            c2.setStatus("PASS");
            c2.setSeverity("CRITICAL");
            c2.setMissingControl(false);
            c2.setRecommendation("Enforce kms:EnableKeyRotation on all terraform KMS resource definitions.");

            SecurityAssessmentControl c3 = new SecurityAssessmentControl();
            c3.setControlId("SEC-NET-01");
            c3.setDomain("NETWORK_SECURITY");
            c3.setControlName("Zero 0.0.0.0/0 Public Ingress on Database and Compute Subnets");
            c3.setDescription("Database instances and internal application pods must reside in private isolated subnets with no public IPv4 addresses.");
            c3.setTargetCloudService("VPC Isolated Subnets");
            c3.setStatus("PASS");
            c3.setSeverity("CRITICAL");
            c3.setMissingControl(false);
            c3.setRecommendation("Deploy AWS Network Firewall / Azure Firewall for centralized outbound inspection.");

            SecurityAssessmentControl c4 = new SecurityAssessmentControl();
            c4.setControlId("SEC-FW-01");
            c4.setDomain("FIREWALL");
            c4.setControlName("Web Application Firewall (WAF) OWASP Top 10 Rule Enforcement");
            c4.setDescription("Public Application Load Balancers must be protected by AWS WAF v2 managed rule groups for SQLi, XSS, and IP rate limiting.");
            c4.setTargetCloudService("AWS WAF v2");
            c4.setStatus("PASS");
            c4.setSeverity("HIGH");
            c4.setMissingControl(false);
            c4.setRecommendation("Attach AWSManagedRulesCommonRuleSet and AWSManagedRulesKnownBadInputsRuleSet.");

            SecurityAssessmentControl c5 = new SecurityAssessmentControl();
            c5.setControlId("SEC-TLS-01");
            c5.setDomain("ENCRYPTION_IN_TRANSIT");
            c5.setControlName("Strict TLS 1.3 Enforcement for Database and Microservice Communication");
            c5.setDescription("Legacy TLS 1.0, 1.1, and 1.2 ciphers must be disabled across all public listeners and RDS Aurora cluster parameter groups.");
            c5.setTargetCloudService("ALB & Aurora TLS");
            c5.setStatus("WARNING");
            c5.setSeverity("MEDIUM");
            c5.setMissingControl(false);
            c5.setRecommendation("Set ssl_min_protocol_version to TLSv1.3 in Aurora PostgreSQL cluster parameter group.");

            SecurityAssessmentControl c6 = new SecurityAssessmentControl();
            c6.setControlId("SEC-AUD-01");
            c6.setDomain("ACCESS_AUDIT");
            c6.setControlName("Multi-Region CloudTrail Audit Logging & GuardDuty Threat Detection");
            c6.setDescription("Enable AWS CloudTrail with log file validation and integrate with Amazon GuardDuty for anomalous API threat detection.");
            c6.setTargetCloudService("CloudTrail & GuardDuty");
            c6.setStatus("PASS");
            c6.setSeverity("HIGH");
            c6.setMissingControl(false);
            c6.setRecommendation("Export audit logs to immutable S3 Glacier bucket with Object Lock enabled.");

            controlRepository.saveAll(Arrays.asList(c1, c2, c3, c4, c5, c6));
            logger.info("Successfully seeded Security Assessment Controls.");
        }

        // Initialize Compliance Framework Requirements (GDPR, ISO 27001, SOC 2, HIPAA)
        if (complianceRepository.count() == 0) {
            logger.info("Seeding Compliance Framework Checklists (GDPR, ISO 27001, SOC 2, HIPAA)...");

            ComplianceRequirement g1 = new ComplianceRequirement();
            g1.setFramework("GDPR");
            g1.setSectionRef("Article 32");
            g1.setRequirementTitle("Security of Processing & Pseudonymisation");
            g1.setDescription("Implement technical safeguards including AES-256 encryption at rest and in transit for all European personal data.");
            g1.setStatus("COMPLIANT");
            g1.setAffectedWorkload("CRM Database Cluster");
            g1.setAssessmentNotes("KMS CMK encryption enabled on all database storage volumes and backups.");

            ComplianceRequirement g2 = new ComplianceRequirement();
            g2.setFramework("GDPR");
            g2.setSectionRef("Article 44");
            g2.setRequirementTitle("Cross-Border Data Transfer Safeguards");
            g2.setDescription("Ensure personal data is stored within certified regional data boundaries (eu-west-1 / us-east-1 Standard Contractual Clauses).");
            g2.setStatus("NEEDS_REVIEW");
            g2.setAffectedWorkload("E-Commerce Web Portal");
            g2.setComplianceGap("Awaiting legal review of AWS Standard Contractual Clauses (SCCs) for cross-region disaster recovery replication.");
            g2.setSuggestedCorrectiveAction("Restrict DR secondary region to Frankfurt (eu-central-1) for EU customer partitions.");

            ComplianceRequirement i1 = new ComplianceRequirement();
            i1.setFramework("ISO_27001");
            i1.setSectionRef("A.9.2");
            i1.setRequirementTitle("User Access Management & Privilege Restriction");
            i1.setDescription("Formal authorization process for user registration and least privilege role assignment.");
            i1.setStatus("COMPLIANT");
            i1.setAffectedWorkload("Platform Foundation");
            i1.setAssessmentNotes("IAM Identity Center enforces automated joiner/mover/leaver provisioning.");

            ComplianceRequirement s1 = new ComplianceRequirement();
            s1.setFramework("SOC2");
            s1.setSectionRef("CC6.1");
            s1.setRequirementTitle("Logical Access Controls & Perimeter Firewalls");
            s1.setDescription("Restrict infrastructure access to authorized personnel via bastion hosts and AWS SSM Session Manager.");
            s1.setStatus("COMPLIANT");
            s1.setAffectedWorkload("All Workloads");
            s1.setAssessmentNotes("Direct SSH port 22 disabled; all shell access gated through AWS Systems Manager Session Manager.");

            ComplianceRequirement h1 = new ComplianceRequirement();
            h1.setFramework("HIPAA");
            h1.setSectionRef("§164.312(a)(1)");
            h1.setRequirementTitle("Access Control & Automatic Logoff for ePHI Systems");
            h1.setDescription("Implement technical policies and procedures for electronic information systems that maintain ePHI.");
            h1.setStatus("COMPLIANT");
            h1.setAffectedWorkload("Core Banking Engine");
            h1.setAssessmentNotes("Signed AWS Business Associate Addendum (BAA) in place across organization root.");

            complianceRepository.saveAll(Arrays.asList(g1, g2, i1, s1, h1));
            logger.info("Successfully seeded Compliance Requirements.");
        }

        // =====================================================================
        // STAGE 9: MIGRATION MONITORING & VALIDATION SEEDING
        // =====================================================================
        if (workloadStatusRepository.count() == 0) {
            logger.info("Seeding Stage 9 Migration Monitoring Workload Statuses & Telemetry...");

            MigrationWorkloadStatus ws1 = new MigrationWorkloadStatus(
                    "Retail Orders Web Portal", "web-app-01.dc1", "AWS EKS Cluster (v1.30)",
                    1L, "Wave 1 – Pilot Migration", "SUCCESSFUL", 100.0, "HEALTHY",
                    32.5, 48.0, 42.0, 99.98, 45, 185.0);

            MigrationWorkloadStatus ws2 = new MigrationWorkloadStatus(
                    "Payment Processing Gateway", "pay-srv-02.dc1", "AWS EKS Microservices",
                    2L, "Wave 2 – Core Business Applications", "SUCCESSFUL", 100.0, "HEALTHY",
                    46.0, 62.0, 55.0, 99.95, 38, 340.0);

            MigrationWorkloadStatus ws3 = new MigrationWorkloadStatus(
                    "Core Banking Ledger DB", "db-exadata-01.dc1", "AWS Aurora PostgreSQL Multi-AZ",
                    3L, "Wave 3 – Critical Databases", "IN_PROGRESS", 68.0, "DEGRADED",
                    74.0, 81.0, 69.0, 99.50, 125, 512.0);

            MigrationWorkloadStatus ws4 = new MigrationWorkloadStatus(
                    "BI & Financial Reporting Lake", "bi-etl-01.dc1", "AWS Redshift Serverless",
                    4L, "Wave 4 – Analytics & Big Data", "PENDING", 15.0, "HEALTHY",
                    12.0, 24.0, 85.0, 100.0, 85, 45.0);

            MigrationWorkloadStatus ws5 = new MigrationWorkloadStatus(
                    "Customer Loyalty Mobile API", "app-node-03.dc1", "AWS App Runner & DynamoDB",
                    2L, "Wave 2 – Core Business Applications", "FAILED", 45.0, "CRITICAL",
                    92.0, 89.0, 71.0, 94.20, 450, 12.0);

            workloadStatusRepository.saveAll(Arrays.asList(ws1, ws2, ws3, ws4, ws5));
            logger.info("Successfully seeded Migration Workload Statuses.");
        }

        if (validationResultRepository.count() == 0) {
            logger.info("Seeding Workload Validation Results...");

            WorkloadValidationResult v1 = new WorkloadValidationResult(
                    "Application HTTP/HTTPS 200 OK Probe", "Retail Orders Web Portal", 1L,
                    "APPLICATION_AVAILABILITY", "HTTP 200 OK <= 150ms from ingress ALB",
                    "HTTP 200 OK in 38ms from ALB", "PASSED", null);

            WorkloadValidationResult v2 = new WorkloadValidationResult(
                    "Database Connection Pool & Query Handshake", "Payment Processing Gateway", 2L,
                    "DATABASE_CONNECTIVITY", "Active pool >= 10, SELECT 1 <= 10ms",
                    "Pool active (20 conn), SELECT 1 returned in 4ms", "PASSED", null);

            WorkloadValidationResult v3 = new WorkloadValidationResult(
                    "VPC Subnet Peering & Direct Connect Transit", "Core Banking Ledger DB", 3L,
                    "NETWORK_CONNECTIVITY", "Zero packet drop, MTU 9001 support",
                    "Observed 1.8% packet retransmissions on hybrid link during peak load", "WARNING",
                    "MTU mismatch detected between on-prem switch and AWS Direct Connect VIF");

            WorkloadValidationResult v4 = new WorkloadValidationResult(
                    "EBS gp3 Volume IOPS & Throughput Stress", "Core Banking Ledger DB", 3L,
                    "STORAGE_ACCESSIBILITY", "Read IOPS >= 5,000, Write >= 250 MB/s",
                    "Measured 5,600 IOPS and 280 MB/s", "PASSED", null);

            WorkloadValidationResult v5 = new WorkloadValidationResult(
                    "Synthetic Payment Transaction Latency (p99)", "Payment Processing Gateway", 2L,
                    "RESPONSE_TIME", "End-to-end p99 <= 80ms under nominal load",
                    "Observed p99 = 42ms (48% improvement over on-prem baseline)", "PASSED", null);

            WorkloadValidationResult v6 = new WorkloadValidationResult(
                    "Database Authentication & Role Grant", "Customer Loyalty Mobile API", 5L,
                    "DATABASE_CONNECTIVITY", "Successful IAM DB token authentication",
                    "PostgreSQL error: FATAL password authentication failed for user 'loyalty_svc'", "FAILED",
                    "IAM role arn:aws:iam::123456789012:role/loyalty-app lacks rds-db:connect policy grant");

            WorkloadValidationResult v7 = new WorkloadValidationResult(
                    "Secrets Manager & TLS Key Consistency", "Retail Orders Web Portal", 1L,
                    "CONFIG_CONSISTENCY", "All secrets injected, TLS 1.3 cert valid",
                    "Verified 18 environment keys, TLS 1.3 negotiated", "PASSED", null);

            validationResultRepository.saveAll(Arrays.asList(v1, v2, v3, v4, v5, v6, v7));
            logger.info("Successfully seeded Workload Validation Results.");
        }

        if (failureIncidentRepository.count() == 0) {
            logger.info("Seeding Migration Failure Incidents...");

            MigrationFailureIncident f1 = new MigrationFailureIncident(
                    "Customer Loyalty Mobile API", 5L, "Wave 2 – Core Business Applications",
                    "DATABASE_AUTHENTICATION_FAILURE",
                    "RDS Aurora IAM database authentication handshake rejected for service account.",
                    "psql: error: FATAL: PAM authentication failed for user 'loyalty_svc'",
                    "Attach AWS IAM rds-db:connect policy grant to loyalty worker service role and reload pod spec.");

            MigrationFailureIncident f2 = new MigrationFailureIncident(
                    "Legacy CRM Cluster Data Sync", null, "Wave 3 – Critical Databases",
                    "REPLICATION_STREAM_LAG",
                    "Continuous Change Data Capture (CDC) replication lag exceeded SLA threshold of 120 seconds.",
                    "AWS DMS Task Error: Engine timeout on bulk LOB column replication stream.",
                    "Scale DMS replication instance from dms.t3.medium to dms.c6i.xlarge and enable parallel LOB chunking.");
            f2.setRecoveryStatus("RESOLVED");
            f2.setTroubleshootingNotes("Applied dms.c6i.xlarge instance resize. CDC replication lag stabilized at 1.4 seconds.");

            failureIncidentRepository.saveAll(Arrays.asList(f1, f2));
            logger.info("Successfully seeded Migration Failure Incidents.");
        }

        if (metricSnapshotRepository.count() == 0) {
            logger.info("Seeding Performance Metric Comparison Snapshots...");

            PerformanceMetricSnapshot p1 = new PerformanceMetricSnapshot(
                    "Retail Orders Web Portal", "CPU Utilization", 68.0, 32.5, "%", 52.2, "OPTIMAL");
            PerformanceMetricSnapshot p2 = new PerformanceMetricSnapshot(
                    "Retail Orders Web Portal", "Memory Utilization", 76.0, 48.0, "%", 36.8, "OPTIMAL");
            PerformanceMetricSnapshot p3 = new PerformanceMetricSnapshot(
                    "Payment Processing Gateway", "Response Time (p99)", 145.0, 38.0, "ms", 73.8, "OPTIMAL");
            PerformanceMetricSnapshot p4 = new PerformanceMetricSnapshot(
                    "Core Banking Ledger DB", "Storage IOPS", 2100.0, 5600.0, "IOPS", 166.7, "OPTIMAL");
            PerformanceMetricSnapshot p5 = new PerformanceMetricSnapshot(
                    "Core Banking Ledger DB", "Application Availability", 98.2, 99.98, "%", 1.8, "OPTIMAL");

            metricSnapshotRepository.saveAll(Arrays.asList(p1, p2, p3, p4, p5));
            logger.info("Successfully seeded Performance Metric Snapshots.");
        }

        if (auditLogRepository.count() == 0) {
            logger.info("Seeding Migration Audit Logs...");

            MigrationAuditLog a1 = new MigrationAuditLog(
                    "MIGRATION_EXECUTION", "Retail Orders Web Portal",
                    "Cutover completed successfully to AWS EKS Cluster. DNS switched to ALB ingress.",
                    "Automated Validation Engine", "SUCCESS");

            MigrationAuditLog a2 = new MigrationAuditLog(
                    "VALIDATION_RUN", "Payment Processing Gateway",
                    "Executed 7 post-migration validation checks. All health probes returned PASSED.",
                    "Automated Validation Engine", "SUCCESS");

            MigrationAuditLog a3 = new MigrationAuditLog(
                    "FAILURE_RECORDED", "Customer Loyalty Mobile API",
                    "Workload health probe failed: Database connectivity authentication timeout.",
                    "System Health Poller", "FAILURE");

            MigrationAuditLog a4 = new MigrationAuditLog(
                    "INCIDENT_RESOLVED", "Legacy CRM Cluster Data Sync",
                    "Resolved DMS replication stream lag incident. Scaled replication instance to c6i.xlarge.",
                    "David Chen (Release Manager)", "SUCCESS");

            MigrationAuditLog a5 = new MigrationAuditLog(
                    "RETRY_ATTEMPT", "Core Banking Ledger DB",
                    "Retried network connectivity probe after MTU adjustment. Result: PASSED.",
                    "Automated Validation Engine", "SUCCESS");

            MigrationAuditLog a6 = new MigrationAuditLog(
                    "STATUS_CHANGE", "Core Banking Ledger DB",
                    "Migration progress updated to 68% in Wave 3.",
                    "System Poller", "INFO");

            auditLogRepository.saveAll(Arrays.asList(a1, a2, a3, a4, a5, a6));
            logger.info("Successfully seeded Migration Audit Logs.");
        }

        // =====================================================================
        // STAGE 10: FINAL MIGRATION REPORT & ENTERPRISE DOCUMENTATION SEEDING
        // =====================================================================
        if (reportRepository.count() == 0) {
            logger.info("Seeding Stage 10 Enterprise Migration Reports & Master Blueprints...");

            MigrationReport rep1 = new MigrationReport(
                    "Executive Cloud Migration Business Case & TCO Assessment",
                    "EXECUTIVE_SUMMARY",
                    "Acme Retail Enterprise & Global Financial Services",
                    "AWS",
                    "v2.4 Final",
                    "CloudSage MigrateMind Automated Engine",
                    "Enterprise Steering Committee",
                    "APPROVED",
                    "Financial and operational justification for migrating 48 on-premises enterprise workloads to AWS. Forecasts 38.1% ongoing run-rate savings ($90,600 annually) with payback achieved within 7.2 months.",
                    "{}",
                    "",
                    128
            );

            MigrationReport rep2 = new MigrationReport(
                    "Technical Discovery & Cloud Target Architecture Blueprint",
                    "TECHNICAL_ARCHITECTURE",
                    "Acme Retail Enterprise & Global Financial Services",
                    "AWS",
                    "v2.1",
                    "HCLTech Cloud Native Advisory & CloudSage Engine",
                    "Security Architecture Review Board",
                    "APPROVED",
                    "Detailed technical specification covering AWS VPC topology, CIDR allocations, Transit Gateway routing, Amazon EKS Karpenter auto-scaling, and Aurora PostgreSQL database tuning.",
                    "{}",
                    "",
                    196
            );

            MigrationReport rep3 = new MigrationReport(
                    "FinOps Cost Estimation & 5-Year Cloud Financial Dossier",
                    "FINOPS_COST_ANALYSIS",
                    "Acme Retail Enterprise & Global Financial Services",
                    "AWS",
                    "v1.8",
                    "CloudSage FinOps Engine",
                    "Finance & Procurement Governance Board",
                    "APPROVED",
                    "Multi-cloud pricing comparison across AWS, Azure, and GCP. Evaluates compute rightsizing, 3-Year Committed Savings Plans, and EBS storage tiering with 185.4% 5-year cumulative ROI.",
                    "{}",
                    "",
                    145
            );

            MigrationReport rep4 = new MigrationReport(
                    "Enterprise Migration Security, Risk & Compliance Dossier",
                    "SECURITY_COMPLIANCE",
                    "Acme Retail Enterprise & Global Financial Services",
                    "AWS",
                    "v2.0",
                    "Cloud Security Architecture Lead",
                    "Chief Information Security Officer (CISO)",
                    "APPROVED",
                    "Evaluation of 9 security domains against CIS AWS Benchmark v2.0 and regulatory compliance alignment across GDPR, ISO 27001, SOC 2, and HIPAA with 91.7% compliance readiness.",
                    "{}",
                    "",
                    164
            );

            MigrationReport rep5 = new MigrationReport(
                    "Complete Enterprise Cloud Modernization Master Blueprint",
                    "COMPLETE_ENTERPRISE",
                    "Acme Retail Enterprise & Global Financial Services",
                    "AWS",
                    "v3.0 Master Release",
                    "CloudSage MigrateMind Multi-Stage Synthesis Engine",
                    "Board of Directors & Executive Steering Committee",
                    "APPROVED",
                    "End-to-end consolidated dossier uniting Stage 3 Inventory, Stage 4 6Rs Assessment, Stage 5 Architecture, Stage 6 FinOps, Stage 7 Execution Waves, Stage 8 Risk Scoring, and Stage 9 Live Monitoring.",
                    "{}",
                    "",
                    312
            );

            reportRepository.saveAll(Arrays.asList(rep1, rep2, rep3, rep4, rep5));
            logger.info("Successfully seeded Stage 10 Enterprise Migration Reports.");
        }
    }
}
