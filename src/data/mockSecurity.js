export const mockComplianceFrameworks = [
  {
    id: 'cis-aws',
    name: 'CIS AWS Foundations Benchmark',
    version: 'v2.0.0 Level 2',
    score: 94,
    passedChecks: 47,
    totalChecks: 50,
    status: 'Compliant',
    badgeColor: 'emerald',
    description: 'Industry standard security baseline for configuring AWS foundational identity, logging, and network services.'
  },
  {
    id: 'soc2',
    name: 'SOC 2 Type II Cloud Readiness',
    version: 'Trust Services Criteria 2026',
    score: 91,
    passedChecks: 32,
    totalChecks: 35,
    status: 'Compliant',
    badgeColor: 'emerald',
    description: 'Security, Availability, and Confidentiality controls across compute, storage, and IAM.'
  },
  {
    id: 'pci-dss',
    name: 'PCI-DSS Compliance',
    version: 'v4.0 Cardholder Environment',
    score: 96,
    passedChecks: 27,
    totalChecks: 28,
    status: 'Compliant',
    badgeColor: 'emerald',
    description: 'Protection of customer cardholder data in transit and at rest with hardware-backed encryption keys.'
  },
  {
    id: 'hipaa',
    name: 'HIPAA Security Rule',
    version: 'ePHI Safeguards & BAA',
    score: 88,
    passedChecks: 22,
    totalChecks: 25,
    status: 'Minor Gaps',
    badgeColor: 'amber',
    description: 'Administrative, physical, and technical safeguards for electronic Protected Health Information.'
  }
];

export const mockSecurityFindings = [
  {
    id: 'SEC-101',
    severity: 'Medium',
    framework: 'CIS AWS Benchmark 1.14',
    title: 'Ensure hardware MFA is enabled for the root account',
    resource: 'AWS Organization Root',
    category: 'Identity & Access Management',
    status: 'Remediated',
    impact: 'Prevents unauthorized takeover of master billing account.',
    remediation: 'Attach YubiKey FIDO2 hardware token to root user profile.',
    terraformRemediation: '# Root account is managed outside Terraform via AWS Organizations SCP'
  },
  {
    id: 'SEC-102',
    severity: 'Low',
    framework: 'CIS AWS Benchmark 2.1.1',
    title: 'Ensure S3 Bucket MFA Delete is enabled on critical audit buckets',
    resource: 'aws_s3_bucket.cloudtrail_audit_logs',
    category: 'Storage Protection',
    status: 'Open',
    impact: 'Prevents rogue insider or compromised credentials from wiping audit trails.',
    remediation: 'Enable versioning and MFA Delete via AWS CLI with root credentials.',
    terraformRemediation: `resource "aws_s3_bucket_versioning" "audit_ver" {
  bucket = aws_s3_bucket.audit.id
  versioning_configuration {
    status     = "Enabled"
    mfa_delete = "Enabled"
  }
}`
  },
  {
    id: 'SEC-103',
    severity: 'Medium',
    framework: 'PCI-DSS 3.4.1',
    title: 'Database connection string does not enforce TLS 1.3 only',
    resource: 'module.aurora_postgresql (db_cluster_parameter_group)',
    category: 'Data in Transit Encryption',
    status: 'Open',
    impact: 'Legacy TLS 1.1 or 1.2 cipher suites could be vulnerable to downgrade attacks.',
    remediation: 'Configure rds.force_ssl = 1 and set ssl_min_protocol_version to TLSv1.3 in Aurora parameter group.',
    terraformRemediation: `resource "aws_rds_cluster_parameter_group" "pg_tls" {
  name   = "cloudsage-aurora-pg16"
  family = "aurora-postgresql16"

  parameter {
    name  = "rds.force_ssl"
    value = "1"
  }
}`
  },
  {
    id: 'SEC-104',
    severity: 'Passed',
    framework: 'CIS AWS Benchmark 4.1',
    title: 'Ensure no security groups allow unrestricted ingress 0.0.0.0/0 to administrative ports',
    resource: 'aws_security_group.app_tier_sg',
    category: 'Network Security',
    status: 'Passed',
    impact: 'Shields internal workloads from automated public internet brute-force port scans.',
    remediation: 'All administrative access routed via AWS SSM Session Manager or VPN Bastion.',
    terraformRemediation: '# Validated: Zero ingress from 0.0.0.0/0 in generated Terraform'
  }
];

export const mockSecurityStats = {
  overallPosture: 92,
  criticalIssues: 0,
  highIssues: 0,
  mediumIssues: 2,
  lowIssues: 1,
  passedChecks: 128,
  lastScanTime: 'Today at 16:42 UTC',
  scannerEngine: 'CloudSage Security Intelligence (CIS Benchmark v2.0 Engine)'
};

