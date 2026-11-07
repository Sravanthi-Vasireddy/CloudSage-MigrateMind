export const terraformModules = [
  {
    id: 'vpc',
    name: 'VPC & Hybrid Network',
    category: 'Networking',
    icon: 'Network',
    description: 'Multi-AZ Virtual Private Cloud with Public, Private, and Database isolated subnets, NAT Gateways, and Transit Gateway attachment.',
    resourceCount: 14,
    complexity: 'Moderate',
    complianceStandard: 'CIS AWS Benchmark 5.1 compliant',
    defaultEnabled: true,
    variables: [
      { key: 'vpc_cidr', name: 'VPC CIDR Block', type: 'string', default: '10.100.0.0/16' },
      { key: 'availability_zones', name: 'Availability Zones', type: 'list', default: '["us-east-1a", "us-east-1b"]' },
      { key: 'enable_nat_gateway', name: 'Enable NAT Gateway', type: 'boolean', default: 'true' },
      { key: 'single_nat_gateway', name: 'Single NAT Gateway (Cost Optimization)', type: 'boolean', default: 'false' },
    ]
  },
  {
    id: 'eks',
    name: 'Amazon EKS Container Cluster',
    category: 'Compute',
    icon: 'Boxes',
    description: 'Managed Kubernetes Cluster v1.30 with managed node groups, AWS VPC CNI, EBS CSI driver, IRSA, and KMS secret encryption.',
    resourceCount: 18,
    complexity: 'High',
    complianceStandard: 'PCI-DSS & CIS Kubernetes v1.8',
    defaultEnabled: true,
    variables: [
      { key: 'cluster_name', name: 'EKS Cluster Name', type: 'string', default: 'cloudsage-prod-eks' },
      { key: 'kubernetes_version', name: 'Kubernetes Version', type: 'string', default: '1.30' },
      { key: 'node_instance_types', name: 'Worker Instance Types', type: 'list', default: '["m6i.xlarge", "m6a.xlarge"]' },
      { key: 'min_nodes', name: 'Minimum Nodes', type: 'number', default: '3' },
      { key: 'max_nodes', name: 'Maximum Nodes', type: 'number', default: '12' },
    ]
  },
  {
    id: 'aurora',
    name: 'Amazon Aurora PostgreSQL Cluster',
    category: 'Database',
    icon: 'Database',
    description: 'Multi-AZ Aurora PostgreSQL cluster with automated backups, encryption at rest via customer-managed KMS key, Performance Insights, and IAM database authentication.',
    resourceCount: 9,
    complexity: 'High',
    complianceStandard: 'SOC 2 & HIPAA Cryptographic Storage',
    defaultEnabled: true,
    variables: [
      { key: 'cluster_identifier', name: 'Cluster Identifier', type: 'string', default: 'cloudsage-orders-pg' },
      { key: 'engine_version', name: 'PostgreSQL Version', type: 'string', default: '16.2' },
      { key: 'instance_class', name: 'DB Instance Class', type: 'string', default: 'db.r6g.2xlarge' },
      { key: 'backup_retention_days', name: 'Backup Retention (Days)', type: 'number', default: '35' },
      { key: 'deletion_protection', name: 'Enable Deletion Protection', type: 'boolean', default: 'true' },
    ]
  },
  {
    id: 'iam_security',
    name: 'IAM Roles & Zero Trust Security',
    category: 'Security',
    icon: 'ShieldCheck',
    description: 'Least-privilege IAM roles, KMS Customer Managed Keys with automatic rotation, Security Groups with zero open 0.0.0.0/0 ingress.',
    resourceCount: 12,
    complexity: 'Moderate',
    complianceStandard: 'NIST 800-53 & CIS AWS Benchmark 1.1-1.22',
    defaultEnabled: true,
    variables: [
      { key: 'enable_kms_rotation', name: 'Enable KMS Key Rotation', type: 'boolean', default: 'true' },
      { key: 'enforce_mfa_roles', name: 'Enforce MFA on AssumeRole', type: 'boolean', default: 'true' },
    ]
  },
  {
    id: 's3_storage',
    name: 'Secure S3 Data Lake & Archival',
    category: 'Storage',
    icon: 'HardDrive',
    description: 'Encrypted Amazon S3 buckets with Public Access Block, bucket policies, lifecycle rules transitioning to Glacier, and CloudTrail object logging.',
    resourceCount: 6,
    complexity: 'Low',
    complianceStandard: 'CIS AWS Benchmark 2.1-2.4',
    defaultEnabled: false,
    variables: [
      { key: 'bucket_prefix', name: 'Bucket Prefix', type: 'string', default: 'cloudsage-enterprise-lake' },
      { key: 'enable_versioning', name: 'Enable Object Versioning', type: 'boolean', default: 'true' },
      { key: 'transition_to_glacier_days', name: 'Glacier Archival (Days)', type: 'number', default: '90' },
    ]
  }
];

export const generateTerraformCode = (selectedModules, variables) => {
  const isVpc = selectedModules.includes('vpc');
  const isEks = selectedModules.includes('eks');
  const isAurora = selectedModules.includes('aurora');
  const isIam = selectedModules.includes('iam_security');
  const isS3 = selectedModules.includes('s3_storage');

  const mainTf = `# ==============================================================================
# CloudSage - MigrateMind Generated Infrastructure as Code
# Target Platform: Amazon Web Services (AWS)
# Generator Version: v2.4 Enterprise Edition
# Generated for: Global Retail Core Modernization (HCLTech Cloud Native CoE)
# Date: 2026-11-07
# ==============================================================================

terraform {
  required_version = ">= 1.7.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.50"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.30"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "CloudSage-MigrateMind"
      Consultant  = "HCLTech"
      Compliance  = "CIS-AWS-Benchmark-v2"
    }
  }
}

${isVpc ? `# ------------------------------------------------------------------------------
# 1. NETWORKING: Amazon VPC Multi-AZ with Isolated Tiers
# ------------------------------------------------------------------------------
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.8.1"

  name = "\${var.project_name}-\${var.environment}-vpc"
  cidr = var.vpc_cidr

  azs             = var.availability_zones
  public_subnets  = ["10.100.1.0/24", "10.100.2.0/24"]
  private_subnets = ["10.100.11.0/24", "10.100.12.0/24"]
  database_subnets = ["10.100.21.0/24", "10.100.22.0/24"]

  enable_nat_gateway     = var.enable_nat_gateway
  single_nat_gateway     = var.single_nat_gateway
  one_nat_gateway_per_az = !var.single_nat_gateway

  enable_dns_hostnames = true
  enable_dns_support   = true

  create_database_subnet_group       = true
  create_database_subnet_route_table = true

  public_subnet_tags = {
    "kubernetes.io/role/elb" = 1
  }

  private_subnet_tags = {
    "kubernetes.io/role/internal-elb" = 1
    "karpenter.sh/discovery"         = var.cluster_name
  }
}
` : ''}

${isIam ? `# ------------------------------------------------------------------------------
# 2. SECURITY: KMS Customer Managed Keys & Zero-Trust IAM
# ------------------------------------------------------------------------------
resource "aws_kms_key" "cloudsage_cmk" {
  description             = "CloudSage Multi-Service CMK Encryption Key"
  deletion_window_in_days = 30
  enable_key_rotation     = var.enable_kms_rotation

  tags = {
    Name = "\${var.project_name}-cmk"
  }
}

resource "aws_kms_alias" "cloudsage_cmk_alias" {
  name          = "alias/\${var.project_name}-master-key"
  target_key_id = aws_kms_key.cloudsage_cmk.key_id
}

# Strict Security Group: Application Tier
resource "aws_security_group" "app_tier_sg" {
  name        = "\${var.project_name}-app-sg"
  description = "Security Group for EKS Container Workloads"
  vpc_id      = ${isVpc ? 'module.vpc.vpc_id' : 'var.existing_vpc_id'}

  ingress {
    description = "Allow HTTPS from Ingress ALB"
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["10.100.1.0/24", "10.100.2.0/24"]
  }

  egress {
    description = "Outbound HTTPS to AWS APIs"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
` : ''}

${isEks ? `# ------------------------------------------------------------------------------
# 3. COMPUTE: Amazon EKS Kubernetes Cluster
# ------------------------------------------------------------------------------
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "20.10.0"

  cluster_name    = var.cluster_name
  cluster_version = var.kubernetes_version

  cluster_endpoint_public_access  = true
  cluster_endpoint_private_access = true

  vpc_id     = ${isVpc ? 'module.vpc.vpc_id' : 'var.existing_vpc_id'}
  subnet_ids = ${isVpc ? 'module.vpc.private_subnets' : 'var.app_subnet_ids'}

  cluster_encryption_config = {
    provider_key_arn = ${isIam ? 'aws_kms_key.cloudsage_cmk.arn' : 'var.kms_key_arn'}
    resources        = ["secrets"]
  }

  eks_managed_node_groups = {
    general = {
      min_size     = var.min_nodes
      max_size     = var.max_nodes
      desired_size = 4

      instance_types = var.node_instance_types
      capacity_type  = "ON_DEMAND"

      labels = {
        Environment = var.environment
        Workload    = "Production-Core"
      }
    }
  }
}
` : ''}

${isAurora ? `# ------------------------------------------------------------------------------
# 4. DATABASE: Amazon Aurora PostgreSQL Multi-AZ Cluster
# ------------------------------------------------------------------------------
module "aurora_postgresql" {
  source  = "terraform-aws-modules/rds-aurora/aws"
  version = "9.4.0"

  name           = var.cluster_identifier
  engine         = "aurora-postgresql"
  engine_version = var.engine_version
  instance_class = var.instance_class

  instances = {
    1 = { instance_class = var.instance_class, publicly_accessible = false }
    2 = { instance_class = var.instance_class, publicly_accessible = false }
  }

  vpc_id  = ${isVpc ? 'module.vpc.vpc_id' : 'var.existing_vpc_id'}
  subnets = ${isVpc ? 'module.vpc.database_subnets' : 'var.db_subnet_ids'}

  storage_encrypted   = true
  kms_key_id          = ${isIam ? 'aws_kms_key.cloudsage_cmk.arn' : 'var.kms_key_arn'}
  deletion_protection = var.deletion_protection

  backup_retention_period = var.backup_retention_days
  preferred_backup_window = "02:00-03:00"

  enabled_cloudwatch_logs_exports = ["postgresql"]
  performance_insights_enabled    = true
}
` : ''}

${isS3 ? `# ------------------------------------------------------------------------------
# 5. STORAGE: Amazon S3 Encrypted Data Lake & Lifecycle Archival
# ------------------------------------------------------------------------------
resource "aws_s3_bucket" "datalake" {
  bucket        = "\${var.bucket_prefix}-\${var.environment}-\${var.aws_region}"
  force_destroy = false
}

resource "aws_s3_bucket_server_side_encryption_configuration" "datalake_crypto" {
  bucket = aws_s3_bucket.datalake.id

  rule {
    apply_server_side_encryption_by_default {
      kms_master_key_id = ${isIam ? 'aws_kms_key.cloudsage_cmk.arn' : 'var.kms_key_arn'}
      sse_algorithm     = "aws:kms"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "datalake_block" {
  bucket = aws_s3_bucket.datalake.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
` : ''}`;

  const variablesTf = `# ==============================================================================
# CloudSage - MigrateMind Variable Definitions
# ==============================================================================

variable "aws_region" {
  description = "Target AWS Region for migration deployment"
  type        = string
  default     = "${variables.aws_region || 'us-east-1'}"
}

variable "project_name" {
  description = "Name identifier of the migration initiative"
  type        = string
  default     = "cloudsage-retail"
}

variable "environment" {
  description = "Target deployment lifecycle environment"
  type        = string
  default     = "${variables.environment || 'production'}"
}

variable "vpc_cidr" {
  description = "CIDR block for the core multi-AZ VPC"
  type        = string
  default     = "${variables.vpc_cidr || '10.100.0.0/16'}"
}

variable "availability_zones" {
  description = "AZ list for high availability placement"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b"]
}

variable "enable_nat_gateway" {
  description = "Provision NAT Gateways for outbound internet routing"
  type        = bool
  default     = true
}

variable "single_nat_gateway" {
  description = "Use single NAT gateway across all AZs (cost savings for dev)"
  type        = bool
  default     = false
}

variable "cluster_name" {
  description = "Name for the Amazon EKS cluster"
  type        = string
  default     = "${variables.cluster_name || 'cloudsage-prod-eks'}"
}

variable "kubernetes_version" {
  description = "Kubernetes control plane version"
  type        = string
  default     = "1.30"
}

variable "node_instance_types" {
  description = "EC2 instance types for EKS managed node group"
  type        = list(string)
  default     = ["m6i.xlarge", "m6a.xlarge"]
}

variable "min_nodes" {
  description = "Minimum auto-scaling nodes"
  type        = number
  default     = 3
}

variable "max_nodes" {
  description = "Maximum auto-scaling nodes"
  type        = number
  default     = 12
}

variable "cluster_identifier" {
  description = "Aurora database cluster identifier"
  type        = string
  default     = "cloudsage-orders-pg"
}

variable "engine_version" {
  description = "Aurora PostgreSQL database engine version"
  type        = string
  default     = "16.2"
}

variable "instance_class" {
  description = "Aurora DB compute instance sizing"
  type        = string
  default     = "db.r6g.2xlarge"
}

variable "backup_retention_days" {
  description = "Automated backup retention in days"
  type        = number
  default     = 35
}

variable "deletion_protection" {
  description = "Prevent accidental RDS cluster deletion"
  type        = bool
  default     = true
}

variable "enable_kms_rotation" {
  description = "Enable automatic yearly rotation of customer KMS key"
  type        = bool
  default     = true
}

variable "bucket_prefix" {
  description = "Unique global name prefix for S3 Lakehouse bucket"
  type        = string
  default     = "cloudsage-enterprise-lake"
}`;

  const outputsTf = `# ==============================================================================
# CloudSage - MigrateMind Generated Outputs
# ==============================================================================

${isVpc ? `output "vpc_id" {
  description = "ID of the provisioned migration VPC"
  value       = module.vpc.vpc_id
}

output "private_subnets" {
  description = "List of private application subnets"
  value       = module.vpc.private_subnets
}

output "database_subnets" {
  description = "List of isolated database subnets"
  value       = module.vpc.database_subnets
}
` : ''}

${isEks ? `output "eks_cluster_id" {
  description = "Amazon EKS Cluster Identifier"
  value       = module.eks.cluster_id
}

output "eks_cluster_endpoint" {
  description = "Kubernetes API server endpoint for kubectl config"
  value       = module.eks.cluster_endpoint
}
` : ''}

${isAurora ? `output "aurora_cluster_endpoint" {
  description = "Primary writer endpoint for PostgreSQL database"
  value       = module.aurora_postgresql.cluster_endpoint
}

output "aurora_reader_endpoint" {
  description = "Load-balanced read replica endpoint"
  value       = module.aurora_postgresql.cluster_reader_endpoint
}
` : ''}

${isIam ? `output "kms_key_arn" {
  description = "ARN of customer-managed KMS key for encryption"
  value       = aws_kms_key.cloudsage_cmk.arn
}
` : ''}`;

  const tfvars = `# terraform.tfvars
aws_region          = "${variables.aws_region || 'us-east-1'}"
environment         = "${variables.environment || 'production'}"
vpc_cidr            = "${variables.vpc_cidr || '10.100.0.0/16'}"
cluster_name        = "${variables.cluster_name || 'cloudsage-prod-eks'}"
cluster_identifier  = "cloudsage-orders-pg"
backup_retention_days = 35
deletion_protection = true
enable_kms_rotation = true
`;

  const backendTf = `# backend.tf
terraform {
  backend "s3" {
    bucket         = "cloudsage-terraform-state-us-east-1"
    key            = "projects/retail-modernization/production.tfstate"
    region         = "us-east-1"
    dynamodb_table = "cloudsage-terraform-locks"
    encrypt        = true
  }
}
`;

  return {
    'main.tf': mainTf,
    'variables.tf': variablesTf,
    'outputs.tf': outputsTf,
    'terraform.tfvars': tfvars,
    'backend.tf': backendTf,
  };
};

export const mockPlanOutput = `Terraform used the selected providers to generate the following execution plan.
Resource actions are indicated with the following symbols:
  + create

Terraform will perform the following actions:

  # module.vpc.aws_vpc.this[0] will be created
  + resource "aws_vpc" "this" {
      + arn                                  = (known after apply)
      + cidr_block                           = "10.100.0.0/16"
      + enable_dns_hostnames                 = true
      + enable_dns_support                   = true
      + id                                   = (known after apply)
      + tags                                 = {
          + "Environment" = "production"
          + "ManagedBy"   = "CloudSage-MigrateMind"
          + "Name"        = "cloudsage-retail-production-vpc"
        }
    }

  # module.eks.aws_eks_cluster.this[0] will be created
  + resource "aws_eks_cluster" "this" {
      + arn                   = (known after apply)
      + endpoint              = (known after apply)
      + name                  = "cloudsage-prod-eks"
      + version               = "1.30"
    }

  # module.aurora_postgresql.aws_rds_cluster.this[0] will be created
  + resource "aws_rds_cluster" "this" {
      + cluster_identifier              = "cloudsage-orders-pg"
      + engine                          = "aurora-postgresql"
      + engine_version                  = "16.2"
      + storage_encrypted               = true
      + backup_retention_period         = 35
    }

Plan: 38 to add, 0 to change, 0 to destroy.
`;

export const mockSecurityScanResults = [
  { id: 'CKV_AWS_144', severity: 'Passed', title: 'Ensure S3 bucket has cross-region replication enabled', resource: 'aws_s3_bucket.datalake' },
  { id: 'CKV_AWS_19', severity: 'Passed', title: 'Ensure all data stored in S3 is encrypted at rest using KMS CMK', resource: 'aws_s3_bucket_server_side_encryption' },
  { id: 'CKV_AWS_118', severity: 'Passed', title: 'Ensure that Aurora cluster has deletion protection enabled', resource: 'module.aurora_postgresql' },
  { id: 'CKV_AWS_260', severity: 'Passed', title: 'Ensure no security groups allow ingress from 0.0.0.0/0 to port 22/3389', resource: 'aws_security_group.app_tier_sg' },
  { id: 'CKV_AWS_158', severity: 'Info', title: 'Consider enabling AWS WAF WebACL CloudWatch detailed sampled metrics', resource: 'aws_wafv2_web_acl' },
];

