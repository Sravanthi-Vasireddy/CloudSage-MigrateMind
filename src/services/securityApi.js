/**
 * CloudSage - MigrateMind
 * Migration Risk, Security & Compliance Management REST API Client
 * Connects React frontend to Spring Boot backend (/api/security)
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const RESOURCE_URL = `${API_BASE_URL}/api/security`;

async function handleResponse(response) {
  if (!response.ok) {
    let errorDetail = `HTTP ${response.status} ${response.statusText}`;
    try {
      const errorJson = await response.json();
      if (errorJson.message) {
        errorDetail = errorJson.message;
      }
    } catch {
      // Non-JSON error body
    }
    const error = new Error(errorDetail);
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

// Local simulation fallback store keys
const STORAGE_KEYS = {
  RISKS: 'cloudsage_security_risks',
  CONTROLS: 'cloudsage_security_controls',
  COMPLIANCE: 'cloudsage_security_compliance',
  MITIGATIONS: 'cloudsage_security_mitigations'
};

const DEFAULT_RISKS = [
  {
    id: 1,
    riskId: 'RISK-001',
    riskTitle: 'Oracle Exadata Stored Procedures & Proprietary PL/SQL Incompatibility',
    category: 'Compatibility / Data Loss',
    affectedWorkload: 'Core Banking Ledger & Settlement DB',
    probability: 4,
    impact: 5,
    riskScore: 20,
    severity: 'CRITICAL',
    owner: 'Dr. Sarah Lin (Lead Data Architect)',
    mitigationPlan: 'Utilize AWS SCT (Schema Conversion Tool) to convert 82% of syntax, refactor remaining custom PL/SQL packages into Python microservices before cutover.',
    status: 'IN_PROGRESS',
    mitigationProgress: 45,
    createdAt: '2026-11-01T10:00:00',
    updatedAt: '2026-11-07T14:30:00'
  },
  {
    id: 2,
    riskId: 'RISK-002',
    riskTitle: 'Real-time Payment Gateway Latency Spike During Hybrid Transit',
    category: 'Performance Degradation',
    affectedWorkload: 'Payment Processing Microservices',
    probability: 3,
    impact: 4,
    riskScore: 12,
    severity: 'HIGH',
    owner: 'Marcus Vance (Principal Network Engineer)',
    mitigationPlan: 'Provision 10 Gbps AWS Direct Connect Dedicated Interconnect with failover VPN and deploy Redis caching layer close to ingress API gateway.',
    status: 'IN_PROGRESS',
    mitigationProgress: 60,
    createdAt: '2026-11-02T11:15:00',
    updatedAt: '2026-11-07T14:30:00'
  },
  {
    id: 3,
    riskId: 'RISK-003',
    riskTitle: 'Over-Privileged IAM Role Escalation in Terraform Target Modules',
    category: 'Security & Access Control',
    affectedWorkload: 'Landing Zone Foundation & IAM Modules',
    probability: 2,
    impact: 4,
    riskScore: 8,
    severity: 'MEDIUM',
    owner: 'Elena Rostova (SecOps Lead)',
    mitigationPlan: 'Run tfsec and Checkov static analysis in CI/CD pipelines; enforce AWS Permission Boundaries and automated least-privilege IAM policies via IAM Access Analyzer.',
    status: 'MITIGATED',
    mitigationProgress: 100,
    createdAt: '2026-11-03T09:30:00',
    updatedAt: '2026-11-07T14:30:00'
  },
  {
    id: 4,
    riskId: 'RISK-004',
    riskTitle: 'Extended Maintenance Window Downtime on Core Banking Batch Jobs',
    category: 'Application Downtime',
    affectedWorkload: 'Nightly Settlement & Clearance Batch System',
    probability: 4,
    impact: 4,
    riskScore: 16,
    severity: 'CRITICAL',
    owner: 'David Chen (Release Engineering Manager)',
    mitigationPlan: 'Execute two end-to-end dry-run dress rehearsals in isolated staging VPC; implement Blue/Green deployment DNS switch with 60-second TTL rollback.',
    status: 'OPEN',
    mitigationProgress: 25,
    createdAt: '2026-11-04T14:00:00',
    updatedAt: '2026-11-07T14:30:00'
  },
  {
    id: 5,
    riskId: 'RISK-005',
    riskTitle: 'Unexpected Cross-Region Egress Cost Overrun During Continuous DB Replication',
    category: 'Unexpected Migration Costs',
    affectedWorkload: 'Multi-AZ Database Backup & DR Sync',
    probability: 3,
    impact: 3,
    riskScore: 9,
    severity: 'MEDIUM',
    owner: 'FinOps Governance Board',
    mitigationPlan: 'Configure AWS Budgets alert threshold at $1,500/month; leverage VPC Peering compression and schedule initial bulk seeding via AWS Snowball Edge device.',
    status: 'OPEN',
    mitigationProgress: 30,
    createdAt: '2026-11-05T08:45:00',
    updatedAt: '2026-11-07T14:30:00'
  },
  {
    id: 6,
    riskId: 'RISK-006',
    riskTitle: 'Active Directory Kerberos Token Incompatibility on Legacy CRM Cluster',
    category: 'Dependency Bottlenecks',
    affectedWorkload: 'Customer Relationship Portal (v12.4)',
    probability: 2,
    impact: 3,
    riskScore: 6,
    severity: 'MEDIUM',
    owner: 'Priya Sharma (Enterprise Identity Architect)',
    mitigationPlan: 'Deploy AWS Managed Microsoft AD connector with two-way trust relationship to on-premises domain controllers before workload migration.',
    status: 'IN_PROGRESS',
    mitigationProgress: 50,
    createdAt: '2026-11-06T13:20:00',
    updatedAt: '2026-11-07T14:30:00'
  }
];

const DEFAULT_CONTROLS = [
  {
    id: 1,
    controlId: 'IAM-01',
    domain: 'Identity & Access Management (IAM)',
    controlTitle: 'Multi-Factor Authentication & Identity Federation',
    description: 'Enforce MFA for all privileged console access and federate enterprise directory via SAML 2.0 / OIDC.',
    status: 'PASS',
    severity: 'CRITICAL',
    missingControl: 'Root account MFA was missing on secondary staging account.',
    recommendation: 'Attach hardware FIDO2 tokens for root credentials and mandate Okta/Azure AD SSO with MFA for all IAM Identity Center users.',
    terraformSnippet: `resource "aws_iam_account_password_policy" "strict" {
  minimum_password_length        = 16
  require_lowercase_characters   = true
  require_numbers                = true
  require_uppercase_characters   = true
  require_symbols                = true
  allow_users_to_change_password = true
  max_password_age               = 90
  password_reuse_prevention      = 12
}`
  },
  {
    id: 2,
    controlId: 'RBAC-01',
    domain: 'Role-Based Access Control (RBAC)',
    controlTitle: 'Granular Least-Privilege IAM Roles & Scoped Policies',
    description: 'Eliminate wildcard actions ("*") in IAM policies and attach role-based permissions strictly bounded by environment.',
    status: 'FAIL',
    severity: 'HIGH',
    missingControl: 'Batch worker node roles contain AdministratorAccess policy attachment in current migration draft.',
    recommendation: 'Replace AdministratorAccess with custom scoped policies limited strictly to S3 bucket read/write and SQS enqueue/dequeue.',
    terraformSnippet: `resource "aws_iam_role_policy" "least_privilege_batch" {
  name = "batch-worker-tight-policy"
  role = aws_iam_role.batch_worker.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Allow"
      Action   = ["s3:GetObject", "s3:PutObject"]
      Resource = ["\${aws_s3_bucket.data_landing.arn}/*"]
    }]
  })
}`
  },
  {
    id: 3,
    controlId: 'ENC-01',
    domain: 'Encryption at Rest',
    controlTitle: 'KMS Customer-Managed Keys (CMK) with Automatic Rotation',
    description: 'All persistent data volumes (EBS, S3, Aurora RDS, DynamoDB) must be encrypted using customer-managed KMS keys with 365-day rotation.',
    status: 'PASS',
    severity: 'CRITICAL',
    missingControl: 'None. All target architecture storage templates specify KMS key ARN.',
    recommendation: 'Maintain KMS alias naming convention and restrict KMS Decrypt permission to authorized application roles only.',
    terraformSnippet: `resource "aws_kms_key" "app_encryption_key" {
  description             = "CloudSage customer-managed key for enterprise storage encryption"
  deletion_window_in_days = 30
  enable_key_rotation     = true
  tags = { Environment = "Production", Compliance = "SOC2-PCI" }
}`
  },
  {
    id: 4,
    controlId: 'ENC-02',
    domain: 'Encryption in Transit',
    controlTitle: 'Strict TLS 1.3 Protocol Enforcement on Load Balancers & APIs',
    description: 'Enforce minimum TLS 1.3 cryptographic protocols with perfect forward secrecy on all public ingress ALBs and CloudFront CDNs.',
    status: 'PASS',
    severity: 'HIGH',
    missingControl: 'Legacy TLS 1.0/1.1 accepted on internal staging port 8443.',
    recommendation: 'Apply ELBSecurityPolicy-TLS13-1-2-2021-06 security policy to all ALB HTTPS listeners.',
    terraformSnippet: `resource "aws_lb_listener" "https_secure" {
  load_balancer_arn = aws_lb.main.arn
  port              = "443"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-2021-06"
  certificate_arn   = aws_acm_certificate.wildcard.arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app.arn
  }
}`
  },
  {
    id: 5,
    controlId: 'NET-01',
    domain: 'Network Security',
    controlTitle: 'VPC Subnet Isolation & Private Endpoints',
    description: 'Isolate compute instances in private subnets with NAT Gateways; route AWS service traffic via VPC Interface Endpoints (Privatelink).',
    status: 'PASS',
    severity: 'HIGH',
    missingControl: 'S3 traffic in database VPC was traversing public internet NAT gateway.',
    recommendation: 'Deploy AWS VPC Gateway Endpoint for S3 and DynamoDB to route traffic through AWS private backbone.',
    terraformSnippet: `resource "aws_vpc_endpoint" "s3" {
  vpc_id       = aws_vpc.main.id
  service_name = "com.amazonaws.us-east-1.s3"
  route_table_ids = aws_route_table.private[*].id
}`
  },
  {
    id: 6,
    controlId: 'FW-01',
    domain: 'Firewall Configurations',
    controlTitle: 'AWS WAF Application Gateway Protection with Managed Rule Sets',
    description: 'Deploy AWS WAF v2 web ACLs with CRS (Common Rule Set), SQLi protection, and rate limiting against brute force attacks.',
    status: 'NEEDS_REVIEW',
    severity: 'HIGH',
    missingControl: 'WAF WebACL is currently associated with production ALB but missing Geo-restriction and IP rate-limiting rules.',
    recommendation: 'Attach AWS Managed Rules (Core rule set, SQLi rule set, Known Bad Inputs) and rate limit IP requests to 2,000 per 5 minutes.',
    terraformSnippet: `resource "aws_wafv2_web_acl" "api_protection" {
  name        = "cloudsage-waf-ruleset"
  scope       = "REGIONAL"
  description = "OWASP Top 10 protection for ingress API gateway"

  default_action {
    allow {}
  }
  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "CloudSageWafMetrics"
    sampled_requests_enabled   = true
  }
}`
  },
  {
    id: 7,
    controlId: 'SEC-GRP-01',
    domain: 'Security Groups & Network ACLs',
    controlTitle: 'Zero-Trust Default-Deny Security Groups',
    description: 'Disallow 0.0.0.0/0 ingress on all security groups except public ALB ports 80/443; reference security group IDs for microservice communication.',
    status: 'PASS',
    severity: 'CRITICAL',
    missingControl: 'Port 22 (SSH) open to 0.0.0.0/0 on one developer bastion prototype.',
    recommendation: 'Remove SSH port 22 access entirely and mandate AWS Systems Manager (SSM) Session Manager for zero-port bastion access.',
    terraformSnippet: `resource "aws_security_group_rule" "db_from_app" {
  type                     = "ingress"
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.app_tier.id
  security_group_id        = aws_security_group.db_tier.id
}`
  },
  {
    id: 8,
    controlId: 'DR-01',
    domain: 'Backup and Disaster Recovery',
    controlTitle: 'Cross-Region Automated Snapshot Replication (RPO < 15m, RTO < 4h)',
    description: 'Enable automated daily backups with point-in-time recovery (PITR) for databases and replicate snapshots to secondary cloud region.',
    status: 'PASS',
    severity: 'HIGH',
    missingControl: 'None. AWS Backup vault policy configured with cross-region replication to us-west-2.',
    recommendation: 'Perform quarterly automated restore testing using Terraform ephemeral test environment.',
    terraformSnippet: `resource "aws_backup_plan" "enterprise_dr" {
  name = "cloudsage-cross-region-dr-plan"

  rule {
    rule_name         = "daily-replicated-backup"
    target_vault_name = aws_backup_vault.primary.name
    schedule          = "cron(0 2 * * ? *)"

    copy_action {
      destination_vault_arn = aws_backup_vault.secondary_dr.arn
      lifecycle {
        delete_after = 90
      }
    }
  }
}`
  },
  {
    id: 9,
    controlId: 'AUD-01',
    domain: 'Access Control and Audit Policies',
    controlTitle: 'Multi-Region CloudTrail Audit Logging & AWS Config Rules',
    description: 'Enable organization-wide CloudTrail with log file validation and send logs to a dedicated, write-once (S3 Object Lock) audit bucket.',
    status: 'PASS',
    severity: 'CRITICAL',
    missingControl: 'CloudTrail log file integrity validation was disabled in draft sandbox template.',
    recommendation: 'Enable enable_log_file_validation = true and forward audit logs to central Amazon OpenSearch / Splunk SIEM for real-time alerting.',
    terraformSnippet: `resource "aws_cloudtrail" "audit_trail" {
  name                          = "cloudsage-enterprise-audit-trail"
  s3_bucket_name                = aws_s3_bucket.central_audit_logs.id
  include_global_service_events = true
  is_multi_region_trail         = true
  enable_log_file_validation    = true
}`
  }
];

const DEFAULT_COMPLIANCE = [
  // GDPR
  {
    id: 1,
    framework: 'GDPR',
    frameworkSection: 'Article 25',
    title: 'Data Protection by Design & Default',
    description: 'Implement appropriate technical and organizational measures to ensure only personal data necessary for each specific purpose is processed.',
    status: 'COMPLIANT',
    complianceGap: 'None. Architecture enforces pseudonymization and column-level database masking.',
    suggestedCorrectiveAction: 'Maintain periodic privacy impact assessments (DPIA) on customer data ingestion pipelines.',
    assessmentNotes: 'Evaluated against Stage 5 Target Cloud Architecture. Data stores segregated with fine-grained access control.'
  },
  {
    id: 2,
    framework: 'GDPR',
    frameworkSection: 'Article 32',
    title: 'Security of Processing & Pseudonymization',
    description: 'State-of-the-art encryption of personal data in transit and at rest, confidentiality, integrity, availability, and resilience of systems.',
    status: 'COMPLIANT',
    complianceGap: 'None. AES-256 KMS encryption enabled across all Aurora RDS and EBS volumes.',
    suggestedCorrectiveAction: 'Configure annual automated key rotation on all customer-managed KMS keys.',
    assessmentNotes: 'Both compute and persistent storage utilize hardware-accelerated encryption modules.'
  },
  {
    id: 3,
    framework: 'GDPR',
    frameworkSection: 'Article 44',
    title: 'Cross-Border Data Transfer Safeguards',
    description: 'Ensure transfers of personal data to third countries or international organizations adhere to EU adequacy decisions or Standard Contractual Clauses (SCCs).',
    status: 'NEEDS_REVIEW',
    complianceGap: 'Secondary disaster recovery region must be strictly confined to European economic area (eu-central-1 Frankfurt) if processing EU residents.',
    suggestedCorrectiveAction: 'Update target architecture multi-region DR parameter to restrict replication to EU zones exclusively.',
    assessmentNotes: 'Initial draft permitted replication to us-east-1. Flagged for legal and compliance review.'
  },
  // ISO 27001
  {
    id: 4,
    framework: 'ISO 27001',
    frameworkSection: 'Control A.9.1',
    title: 'Business Requirements for Access Control',
    description: 'Establish and document an access control policy based on business and information security requirements.',
    status: 'COMPLIANT',
    complianceGap: 'None. Enterprise identity federation with SSO and MFA configured.',
    suggestedCorrectiveAction: 'Schedule bi-annual automated privileged account audit and access certification.',
    assessmentNotes: 'IAM Identity Center handles all access with centralized audit logging in CloudTrail.'
  },
  {
    id: 5,
    framework: 'ISO 27001',
    frameworkSection: 'Control A.10.1',
    title: 'Cryptographic Controls & Key Management',
    description: 'Develop and implement a policy on the use, protection, and lifetime of cryptographic keys through their lifecycle.',
    status: 'COMPLIANT',
    complianceGap: 'None. AWS KMS manages cryptographic lifecycle with automated rotation.',
    suggestedCorrectiveAction: 'Document key revocation procedures in enterprise runbook.',
    assessmentNotes: 'Verified key lifecycle parameters in generated Terraform module.'
  },
  {
    id: 6,
    framework: 'ISO 27001',
    frameworkSection: 'Control A.12.1',
    title: 'Operational Procedures & Responsibilities',
    description: 'Operating procedures shall be documented and made available to all users who need them; change management controls applied.',
    status: 'NON_COMPLIANT',
    complianceGap: 'Formal change control runbook for emergency hotfix rollbacks in cloud environment is not finalized.',
    suggestedCorrectiveAction: 'Draft and approve Stage 7 Cloud Cutover Standard Operating Procedure (SOP) before Wave 2 execution.',
    assessmentNotes: 'Documentation gap identified during readiness review.'
  },
  // SOC 2
  {
    id: 7,
    framework: 'SOC 2',
    frameworkSection: 'CC6.1',
    title: 'Logical Access Controls & Boundary Defense',
    description: 'The entity implements logical access security software, infrastructure, and architectures over protected information assets.',
    status: 'COMPLIANT',
    complianceGap: 'None. Zero-trust security groups and private VPC subnets prevent direct public ingress.',
    suggestedCorrectiveAction: 'Maintain quarterly automated vulnerability scans with AWS Inspector v2.',
    assessmentNotes: 'Target architecture includes WAF and Network ACL defenses.'
  },
  {
    id: 8,
    framework: 'SOC 2',
    frameworkSection: 'CC6.6',
    title: 'Boundary Defense & Perimeter Security',
    description: 'The entity implements logical boundaries to restrict access to systems and applications, preventing unauthorized external traffic.',
    status: 'COMPLIANT',
    complianceGap: 'None. Load balancers and WAF shield all internal workloads.',
    suggestedCorrectiveAction: 'Review AWS Shield Advanced activation for DDoS mitigation on payment endpoints.',
    assessmentNotes: 'Subnet routing tables verified to route internet traffic exclusively through NAT and WAF.'
  },
  {
    id: 9,
    framework: 'SOC 2',
    frameworkSection: 'CC7.2',
    title: 'System Monitoring & Incident Detection',
    description: 'The entity monitors system components and the operation of those components for anomalies that are indicative of malicious acts.',
    status: 'COMPLIANT',
    complianceGap: 'None. Amazon GuardDuty, AWS Security Hub, and CloudWatch Alarms configured.',
    suggestedCorrectiveAction: 'Hook GuardDuty findings to PagerDuty / Slack SecOps channel for instant on-call escalation.',
    assessmentNotes: 'Real-time threat detection active across all cloud accounts.'
  },
  // HIPAA
  {
    id: 10,
    framework: 'HIPAA',
    frameworkSection: '§ 164.312(a)(1)',
    title: 'Access Control (Required Specification)',
    description: 'Implement technical policies and procedures for electronic information systems that maintain ePHI to allow access only to authorized persons.',
    status: 'COMPLIANT',
    complianceGap: 'None. Unique user identification and emergency access procedure (break-glass role) enabled.',
    suggestedCorrectiveAction: 'Enforce automatic logoff timer of 15 minutes of inactivity on all management sessions.',
    assessmentNotes: 'Session timeout rules enforced via AWS IAM Identity Center session policy.'
  },
  {
    id: 11,
    framework: 'HIPAA',
    frameworkSection: '§ 164.312(a)(2)(iv)',
    title: 'Encryption and Decryption (Addressable Specification)',
    description: 'Implement a mechanism to encrypt and decrypt electronic protected health information (ePHI) in rest and transit.',
    status: 'COMPLIANT',
    complianceGap: 'None. AWS KMS customer-managed encryption active for RDS, S3, and EBS; TLS 1.3 in transit.',
    suggestedCorrectiveAction: 'Execute AWS Business Associate Addendum (BAA) contract before migrating production medical record workloads.',
    assessmentNotes: 'AWS provides HIPAA compliance eligibility under the AWS BAA.'
  },
  {
    id: 12,
    framework: 'HIPAA',
    frameworkSection: '§ 164.308(a)(7)',
    title: 'Contingency Plan (Data Backup & Disaster Recovery)',
    description: 'Establish and implement procedures for creating and maintaining retrievable exact copies of electronic protected health information.',
    status: 'COMPLIANT',
    complianceGap: 'None. Cross-region automated backup snapshots with point-in-time recovery meet all statutory requirements.',
    suggestedCorrectiveAction: 'Perform dry-run backup restoration test twice annually and archive recovery validation certificates.',
    assessmentNotes: 'RPO is configured at 15 minutes and RTO at 4 hours.'
  }
];

const DEFAULT_MITIGATIONS = [
  {
    id: 1,
    riskId: 1,
    actionTitle: 'Deploy AWS Schema Conversion Tool (SCT) and execute automated code translation',
    assignedOwner: 'Dr. Sarah Lin',
    targetDate: '2026-11-20',
    status: 'IN_PROGRESS',
    progressPercentage: 55,
    linkedMigrationTaskId: 8,
    resolutionNotes: 'Completed baseline schema extraction. 320 of 390 stored procedures parsed cleanly; remaining 70 flagged for manual Python Lambda adaptation.'
  },
  {
    id: 2,
    riskId: 2,
    actionTitle: 'Commission AWS Direct Connect 10Gbps dedicated link with IPsec backup',
    assignedOwner: 'Marcus Vance',
    targetDate: '2026-11-25',
    status: 'IN_PROGRESS',
    progressPercentage: 70,
    linkedMigrationTaskId: 1,
    resolutionNotes: 'Physical cross-connect established in Equinix NY4 facility. BGP peering testing currently in progress.'
  },
  {
    id: 3,
    riskId: 3,
    actionTitle: 'Integrate tfsec & Checkov security gates into GitHub Actions CI pipeline',
    assignedOwner: 'Elena Rostova',
    targetDate: '2026-11-10',
    status: 'COMPLETED',
    progressPercentage: 100,
    linkedMigrationTaskId: 2,
    resolutionNotes: 'Pipeline blocking builds on any HIGH or CRITICAL policy violations. Zero wildcards allowed in target Terraform modules.'
  },
  {
    id: 4,
    riskId: 4,
    actionTitle: 'Run isolated cutover simulation in Staging environment with synthetic bank batch workload',
    assignedOwner: 'David Chen',
    targetDate: '2026-12-05',
    status: 'NOT_STARTED',
    progressPercentage: 10,
    linkedMigrationTaskId: 9,
    resolutionNotes: 'Target staging environment architecture provisioned. Synthetic transaction generator script being prepared.'
  }
];

// Helper to compute local summary
function computeLocalSummary(risks, controls, compliance) {
  const totalRisks = risks.length;
  const criticalRisks = risks.filter(r => r.severity === 'CRITICAL').length;
  const highRisks = risks.filter(r => r.severity === 'HIGH').length;
  const mediumRisks = risks.filter(r => r.severity === 'MEDIUM').length;
  const lowRisks = risks.filter(r => r.severity === 'LOW').length;

  const openRisks = risks.filter(r => r.status === 'OPEN').length;
  const inProgressRisks = risks.filter(r => r.status === 'IN_PROGRESS').length;
  const mitigatedRisks = risks.filter(r => r.status === 'MITIGATED').length;
  const acceptedRisks = risks.filter(r => r.status === 'ACCEPTED').length;

  const totalControls = controls.length;
  const passedControls = controls.filter(c => c.status === 'PASS').length;
  const failedControls = controls.filter(c => c.status === 'FAIL').length;
  const reviewControls = controls.filter(c => c.status === 'NEEDS_REVIEW').length;

  const totalComplianceReqs = compliance.length;
  const compliantCount = compliance.filter(c => c.status === 'COMPLIANT').length;
  const nonCompliantCount = compliance.filter(c => c.status === 'NON_COMPLIANT').length;
  const needsReviewCount = compliance.filter(c => c.status === 'NEEDS_REVIEW').length;

  const overallCompliancePercentage = totalComplianceReqs > 0
    ? Math.round((compliantCount / totalComplianceReqs) * 1000) / 10
    : 0;

  let overallPosture = 'EXCELLENT';
  if (criticalRisks > 0 || failedControls > 1) {
    overallPosture = 'ELEVATED_RISK';
  } else if (highRisks > 2 || failedControls > 0) {
    overallPosture = 'MODERATE';
  } else if (overallCompliancePercentage >= 90) {
    overallPosture = 'HEALTHY';
  }

  return {
    totalRisksIdentified: totalRisks,
    criticalRisks,
    highRisks,
    mediumRisks,
    lowRisks,
    openRisks,
    inProgressRisks,
    mitigatedRisks,
    acceptedRisks,
    totalSecurityControls: totalControls,
    passedSecurityControls: passedControls,
    failedSecurityControls: failedControls,
    reviewSecurityControls: reviewControls,
    overallCompliancePercentage,
    compliantRequirements: compliantCount,
    nonCompliantRequirements: nonCompliantCount,
    needsReviewRequirements: needsReviewCount,
    overallPosture,
    complianceDisclaimer: "This module provides assessment guidance and does not claim to provide official certification or legal compliance validation."
  };
}

// Local storage management helpers
function getStored(key, defaultValue) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStored(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage quota or private browsing
  }
}

export const securityApi = {
  /**
   * Fetch executive dashboard summary metrics
   */
  async getDashboardSummary() {
    try {
      const response = await fetch(`${RESOURCE_URL}/dashboard`);
      return await handleResponse(response);
    } catch (err) {
      console.warn('Backend unavailable, using local security dashboard metrics:', err.message);
      const risks = getStored(STORAGE_KEYS.RISKS, DEFAULT_RISKS);
      const controls = getStored(STORAGE_KEYS.CONTROLS, DEFAULT_CONTROLS);
      const compliance = getStored(STORAGE_KEYS.COMPLIANCE, DEFAULT_COMPLIANCE);
      return computeLocalSummary(risks, controls, compliance);
    }
  },

  /**
   * Fetch all migration risks in risk register
   */
  async getAllRisks() {
    try {
      const response = await fetch(`${RESOURCE_URL}/risks`);
      return await handleResponse(response);
    } catch (err) {
      console.warn('Backend unavailable, using local risk register:', err.message);
      return getStored(STORAGE_KEYS.RISKS, DEFAULT_RISKS);
    }
  },

  /**
   * Fetch single risk by ID
   */
  async getRiskById(id) {
    try {
      const response = await fetch(`${RESOURCE_URL}/risks/${id}`);
      return await handleResponse(response);
    } catch (err) {
      const risks = getStored(STORAGE_KEYS.RISKS, DEFAULT_RISKS);
      const found = risks.find(r => r.id === Number(id));
      if (!found) throw new Error(`Risk with ID ${id} not found`);
      return found;
    }
  },

  /**
   * Create new migration risk
   */
  async createRisk(data) {
    try {
      const response = await fetch(`${RESOURCE_URL}/risks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await handleResponse(response);
    } catch (err) {
      console.warn('Backend unavailable, creating risk locally:', err.message);
      const risks = getStored(STORAGE_KEYS.RISKS, DEFAULT_RISKS);
      const prob = Number(data.probability) || 3;
      const imp = Number(data.impact) || 3;
      const score = prob * imp;
      let sev = 'LOW';
      if (score >= 16) sev = 'CRITICAL';
      else if (score >= 10) sev = 'HIGH';
      else if (score >= 5) sev = 'MEDIUM';

      const newId = risks.length > 0 ? Math.max(...risks.map(r => r.id)) + 1 : 1;
      const newRisk = {
        id: newId,
        riskId: data.riskId || `RISK-00${newId}`,
        riskTitle: data.riskTitle,
        category: data.category || 'General Risk',
        affectedWorkload: data.affectedWorkload || 'All Workloads',
        probability: prob,
        impact: imp,
        riskScore: score,
        severity: sev,
        owner: data.owner || 'Unassigned',
        mitigationPlan: data.mitigationPlan || '',
        status: data.status || 'OPEN',
        mitigationProgress: Number(data.mitigationProgress) || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      const updated = [newRisk, ...risks];
      setStored(STORAGE_KEYS.RISKS, updated);
      return newRisk;
    }
  },

  /**
   * Update existing migration risk
   */
  async updateRisk(id, data) {
    try {
      const response = await fetch(`${RESOURCE_URL}/risks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await handleResponse(response);
    } catch (err) {
      console.warn('Backend unavailable, updating risk locally:', err.message);
      const risks = getStored(STORAGE_KEYS.RISKS, DEFAULT_RISKS);
      const prob = Number(data.probability) || 3;
      const imp = Number(data.impact) || 3;
      const score = prob * imp;
      let sev = 'LOW';
      if (score >= 16) sev = 'CRITICAL';
      else if (score >= 10) sev = 'HIGH';
      else if (score >= 5) sev = 'MEDIUM';

      const updated = risks.map(r => {
        if (r.id === Number(id)) {
          return {
            ...r,
            riskTitle: data.riskTitle !== undefined ? data.riskTitle : r.riskTitle,
            category: data.category !== undefined ? data.category : r.category,
            affectedWorkload: data.affectedWorkload !== undefined ? data.affectedWorkload : r.affectedWorkload,
            probability: prob,
            impact: imp,
            riskScore: score,
            severity: sev,
            owner: data.owner !== undefined ? data.owner : r.owner,
            mitigationPlan: data.mitigationPlan !== undefined ? data.mitigationPlan : r.mitigationPlan,
            status: data.status !== undefined ? data.status : r.status,
            mitigationProgress: data.mitigationProgress !== undefined ? Number(data.mitigationProgress) : r.mitigationProgress,
            updatedAt: new Date().toISOString()
          };
        }
        return r;
      });
      setStored(STORAGE_KEYS.RISKS, updated);
      return updated.find(r => r.id === Number(id));
    }
  },

  /**
   * Delete migration risk
   */
  async deleteRisk(id) {
    try {
      const response = await fetch(`${RESOURCE_URL}/risks/${id}`, {
        method: 'DELETE'
      });
      return await handleResponse(response);
    } catch (err) {
      console.warn('Backend unavailable, deleting risk locally:', err.message);
      const risks = getStored(STORAGE_KEYS.RISKS, DEFAULT_RISKS);
      const filtered = risks.filter(r => r.id !== Number(id));
      setStored(STORAGE_KEYS.RISKS, filtered);
      return null;
    }
  },

  /**
   * Add a mitigation action to a risk
   */
  async addMitigationAction(riskId, data) {
    try {
      const response = await fetch(`${RESOURCE_URL}/risks/${riskId}/mitigations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await handleResponse(response);
    } catch (err) {
      console.warn('Backend unavailable, adding mitigation action locally:', err.message);
      const mitigations = getStored(STORAGE_KEYS.MITIGATIONS, DEFAULT_MITIGATIONS);
      const newId = mitigations.length > 0 ? Math.max(...mitigations.map(m => m.id)) + 1 : 1;
      const newAction = {
        id: newId,
        riskId: Number(riskId),
        actionTitle: data.actionTitle,
        assignedOwner: data.assignedOwner || 'Unassigned',
        targetDate: data.targetDate || new Date().toISOString().split('T')[0],
        status: data.status || 'NOT_STARTED',
        progressPercentage: Number(data.progressPercentage) || 0,
        linkedMigrationTaskId: data.linkedMigrationTaskId ? Number(data.linkedMigrationTaskId) : null,
        resolutionNotes: data.resolutionNotes || ''
      };
      setStored(STORAGE_KEYS.MITIGATIONS, [...mitigations, newAction]);
      return newAction;
    }
  },

  /**
   * Update mitigation action
   */
  async updateMitigationAction(actionId, { status, progress, resolution }) {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (progress !== undefined) params.append('progress', progress);
    if (resolution) params.append('resolution', resolution);

    try {
      const response = await fetch(`${RESOURCE_URL}/mitigations/${actionId}?${params.toString()}`, {
        method: 'PUT'
      });
      return await handleResponse(response);
    } catch (err) {
      console.warn('Backend unavailable, updating mitigation action locally:', err.message);
      const mitigations = getStored(STORAGE_KEYS.MITIGATIONS, DEFAULT_MITIGATIONS);
      const updated = mitigations.map(m => {
        if (m.id === Number(actionId)) {
          return {
            ...m,
            status: status || m.status,
            progressPercentage: progress !== undefined ? Number(progress) : m.progressPercentage,
            resolutionNotes: resolution || m.resolutionNotes
          };
        }
        return m;
      });
      setStored(STORAGE_KEYS.MITIGATIONS, updated);
      return updated.find(m => m.id === Number(actionId));
    }
  },

  /**
   * Delete mitigation action
   */
  async deleteMitigationAction(actionId) {
    try {
      const response = await fetch(`${RESOURCE_URL}/mitigations/${actionId}`, {
        method: 'DELETE'
      });
      return await handleResponse(response);
    } catch (err) {
      const mitigations = getStored(STORAGE_KEYS.MITIGATIONS, DEFAULT_MITIGATIONS);
      setStored(STORAGE_KEYS.MITIGATIONS, mitigations.filter(m => m.id !== Number(actionId)));
      return null;
    }
  },

  /**
   * Fetch all 9 security assessment domain controls
   */
  async getSecurityControls(domain = 'ALL') {
    try {
      const response = await fetch(`${RESOURCE_URL}/controls?domain=${encodeURIComponent(domain)}`);
      return await handleResponse(response);
    } catch (err) {
      console.warn('Backend unavailable, using local security controls:', err.message);
      const controls = getStored(STORAGE_KEYS.CONTROLS, DEFAULT_CONTROLS);
      if (domain && domain !== 'ALL') {
        return controls.filter(c => c.domain.toLowerCase().includes(domain.toLowerCase()));
      }
      return controls;
    }
  },

  /**
   * Update security control status or recommendation
   */
  async updateSecurityControl(id, { status, recommendation }) {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (recommendation) params.append('recommendation', recommendation);

    try {
      const response = await fetch(`${RESOURCE_URL}/controls/${id}?${params.toString()}`, {
        method: 'PUT'
      });
      return await handleResponse(response);
    } catch (err) {
      console.warn('Backend unavailable, updating security control locally:', err.message);
      const controls = getStored(STORAGE_KEYS.CONTROLS, DEFAULT_CONTROLS);
      const updated = controls.map(c => {
        if (c.id === Number(id)) {
          return {
            ...c,
            status: status || c.status,
            recommendation: recommendation !== undefined ? recommendation : c.recommendation
          };
        }
        return c;
      });
      setStored(STORAGE_KEYS.CONTROLS, updated);
      return updated.find(c => c.id === Number(id));
    }
  },

  /**
   * Fetch compliance requirements for GDPR, ISO 27001, SOC 2, HIPAA
   */
  async getComplianceRequirements(framework = 'ALL') {
    try {
      const response = await fetch(`${RESOURCE_URL}/compliance/requirements?framework=${encodeURIComponent(framework)}`);
      return await handleResponse(response);
    } catch (err) {
      console.warn('Backend unavailable, using local compliance requirements:', err.message);
      const reqs = getStored(STORAGE_KEYS.COMPLIANCE, DEFAULT_COMPLIANCE);
      if (framework && framework !== 'ALL') {
        return reqs.filter(r => r.framework.toUpperCase() === framework.toUpperCase());
      }
      return reqs;
    }
  },

  /**
   * Update compliance requirement status, notes, or gap
   */
  async updateComplianceRequirement(id, data) {
    try {
      const response = await fetch(`${RESOURCE_URL}/compliance/requirements/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await handleResponse(response);
    } catch (err) {
      console.warn('Backend unavailable, updating compliance requirement locally:', err.message);
      const reqs = getStored(STORAGE_KEYS.COMPLIANCE, DEFAULT_COMPLIANCE);
      const updated = reqs.map(r => {
        if (r.id === Number(id)) {
          return {
            ...r,
            status: data.status || r.status,
            assessmentNotes: data.assessmentNotes !== undefined ? data.assessmentNotes : r.assessmentNotes,
            complianceGap: data.complianceGap !== undefined ? data.complianceGap : r.complianceGap,
            suggestedCorrectiveAction: data.suggestedCorrectiveAction !== undefined ? data.suggestedCorrectiveAction : r.suggestedCorrectiveAction
          };
        }
        return r;
      });
      setStored(STORAGE_KEYS.COMPLIANCE, updated);
      return updated.find(r => r.id === Number(id));
    }
  },

  /**
   * Fetch summary readiness percentages for each of the 4 frameworks
   */
  async getComplianceFrameworkSummaries() {
    try {
      const response = await fetch(`${RESOURCE_URL}/compliance/summaries`);
      return await handleResponse(response);
    } catch (err) {
      console.warn('Backend unavailable, calculating compliance summaries locally:', err.message);
      const reqs = getStored(STORAGE_KEYS.COMPLIANCE, DEFAULT_COMPLIANCE);
      const frameworks = ['GDPR', 'ISO 27001', 'SOC 2', 'HIPAA'];
      return frameworks.map(fw => {
        const matching = reqs.filter(r => r.framework.toUpperCase() === fw.toUpperCase());
        const total = matching.length;
        const compliant = matching.filter(r => r.status === 'COMPLIANT').length;
        const nonCompliant = matching.filter(r => r.status === 'NON_COMPLIANT').length;
        const needsReview = matching.filter(r => r.status === 'NEEDS_REVIEW').length;
        const pct = total > 0 ? Math.round((compliant / total) * 1000) / 10 : 0.0;
        return {
          frameworkName: fw,
          totalRequirements: total,
          compliantCount: compliant,
          nonCompliantCount: nonCompliant,
          needsReviewCount: needsReview,
          compliancePercentage: pct
        };
      });
    }
  },

  /**
   * Fetch local mitigations list
   */
  async getMitigationActions() {
    return getStored(STORAGE_KEYS.MITIGATIONS, DEFAULT_MITIGATIONS);
  }
};

