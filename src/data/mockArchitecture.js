export const initialArchitectureNodes = [
  {
    id: 'user-traffic',
    type: 'cloudNode',
    position: { x: 50, y: 180 },
    data: {
      title: 'Global End Users',
      category: 'Edge Network',
      subtitle: 'Public HTTPS Clients & Mobile Apps',
      status: 'active',
      icon: 'Users',
      color: '#3b82f6',
      details: {
        protocol: 'TLS 1.3 / HTTPS',
        dns: 'Amazon Route 53 Geolocation Routing',
        latency: '< 45ms P95',
        ddosProtection: 'AWS Shield Standard Enabled'
      }
    }
  },
  {
    id: 'onprem-dc',
    type: 'cloudNode',
    position: { x: 50, y: 380 },
    data: {
      title: 'On-Premises Datacenter',
      category: 'Hybrid Connectivity',
      subtitle: 'Equinix CH1 Chicago & HQ',
      status: 'active',
      icon: 'Building2',
      color: '#f59e0b',
      details: {
        connection: 'AWS Direct Connect (10 Gbps Dedicated)',
        backup: 'IPsec VPN Fallback Tunnel (BGP)',
        asn: '65000',
        mtu: '9001 Jumbo Frames'
      }
    }
  },
  {
    id: 'transit-gw',
    type: 'cloudNode',
    position: { x: 300, y: 280 },
    data: {
      title: 'AWS Transit Gateway',
      category: 'Network Backbone',
      subtitle: 'Hub & Spoke Router (tgw-08a9f2)',
      status: 'active',
      icon: 'Network',
      color: '#6366f1',
      details: {
        tgwId: 'tgw-08a9f2bc10432',
        asn: '64512',
        vpcAttachments: 4,
        directConnectGateway: 'dcgw-9912aa',
        monthlyCost: 216.00
      }
    }
  },
  {
    id: 'aws-waf-alb',
    type: 'cloudNode',
    position: { x: 550, y: 150 },
    data: {
      title: 'AWS WAF v2 + Public ALB',
      category: 'Public Ingress Tier',
      subtitle: 'Dual-AZ Ingress (10.100.1.0/24)',
      status: 'active',
      icon: 'ShieldCheck',
      color: '#10b981',
      details: {
        scheme: 'internet-facing',
        subnets: ['subnet-pub-1a (10.100.1.0/24)', 'subnet-pub-1b (10.100.2.0/24)'],
        wafRules: ['OWASP Top 10 Core RuleSet', 'Amazon IP Reputation', 'Rate Limit 2000/5m'],
        sslCert: 'ACM Managed Wildcard *.acmeretail.com',
        monthlyCost: 94.50
      }
    }
  },
  {
    id: 'eks-cluster',
    type: 'cloudNode',
    position: { x: 820, y: 150 },
    data: {
      title: 'Amazon EKS Modernized App Tier',
      category: 'Compute & Containers',
      subtitle: 'Kubernetes v1.30 (m6i.xlarge)',
      status: 'active',
      icon: 'Boxes',
      color: '#0284c7',
      details: {
        clusterName: 'cloudsage-prod-eks-01',
        nodeGroups: 'Managed Node Group (3-12 nodes)',
        instanceType: 'm6i.xlarge (4 vCPU / 16GB)',
        cni: 'AWS VPC CNI with IRSA',
        autoscaler: 'Karpenter v0.35 with Spot optimization',
        monthlyCost: 980.00
      }
    }
  },
  {
    id: 'aurora-pg',
    type: 'cloudNode',
    position: { x: 1100, y: 150 },
    data: {
      title: 'Amazon Aurora PostgreSQL Multi-AZ',
      category: 'Database Tier (Isolated Subnet)',
      subtitle: 'Engine v16.2 (db.r6g.2xlarge)',
      status: 'active',
      icon: 'Database',
      color: '#7c3aed',
      details: {
        dbIdentifier: 'cloudsage-orders-aurora-cluster',
        engine: 'Aurora PostgreSQL 16.2',
        instances: '1 Primary (us-east-1a) + 1 Read Replica (us-east-1b)',
        storage: 'Auto-scaling Serverless Storage (up to 128 TiB)',
        encryption: 'AWS KMS CMK (key/aurora-prod-key)',
        backupRetention: '35 Days Automated Point-in-time',
        monthlyCost: 1120.00
      }
    }
  },
  {
    id: 'elasticache',
    type: 'cloudNode',
    position: { x: 820, y: 350 },
    data: {
      title: 'Amazon ElastiCache Redis',
      category: 'Caching Tier',
      subtitle: 'Redis Cluster 7.1 Multi-AZ',
      status: 'active',
      icon: 'Cpu',
      color: '#ea580c',
      details: {
        nodeType: 'cache.r6g.large (2 vCPU / 13GB)',
        shards: '2 Shards x 2 Replicas',
        inTransitEncryption: 'Enabled with Auth Token',
        monthlyCost: 228.00
      }
    }
  },
  {
    id: 's3-datalake',
    type: 'cloudNode',
    position: { x: 1100, y: 350 },
    data: {
      title: 'Amazon S3 Lakehouse & Glacier',
      category: 'Object Storage & Archival',
      subtitle: 'S3 Standard + Intelligent Tiering',
      status: 'active',
      icon: 'HardDrive',
      color: '#16a34a',
      details: {
        bucketName: 'acme-corp-datalake-us-east-1-prod',
        lifecycle: 'Transition to Glacier Instant Retrieval after 90 days',
        encryption: 'SSE-KMS AWS Managed Key',
        bucketVersioning: 'Enabled with MFA Delete',
        monthlyCost: 340.00
      }
    }
  },
  {
    id: 'security-governance',
    type: 'cloudNode',
    position: { x: 550, y: 380 },
    data: {
      title: 'Security & Governance Hub',
      category: 'Management & Auditing',
      subtitle: 'CloudTrail, KMS, GuardDuty',
      status: 'active',
      icon: 'Lock',
      color: '#0f766e',
      details: {
        services: ['AWS CloudTrail Multi-Region', 'Amazon GuardDuty', 'AWS Security Hub', 'AWS KMS CMK'],
        compliance: 'CIS AWS Benchmark Level 2',
        monthlyCost: 165.00
      }
    }
  }
];

export const initialArchitectureEdges = [
  { id: 'e1-2', source: 'user-traffic', target: 'aws-waf-alb', animated: true, label: 'HTTPS 443' },
  { id: 'e2-3', source: 'onprem-dc', target: 'transit-gw', animated: true, label: 'Direct Connect BGP' },
  { id: 'e3-4', source: 'transit-gw', target: 'aws-waf-alb', animated: false, label: 'VPC Peering/Attach' },
  { id: 'e4-5', source: 'aws-waf-alb', target: 'eks-cluster', animated: true, label: 'Target Group Port 8080' },
  { id: 'e5-6', source: 'eks-cluster', target: 'aurora-pg', animated: true, label: 'Postgres Port 5432' },
  { id: 'e5-7', source: 'eks-cluster', target: 'elasticache', animated: true, label: 'Redis Port 6379' },
  { id: 'e5-8', source: 'eks-cluster', target: 's3-datalake', animated: false, label: 'IAM S3 Endpoint' },
  { id: 'e6-9', source: 'security-governance', target: 'eks-cluster', animated: false, label: 'KMS & Audit' },
  { id: 'e6-10', source: 'security-governance', target: 'aurora-pg', animated: false, label: 'KMS CMK' }
];

export const architectureSpecs = {
  vpcCidr: '10.100.0.0/16',
  region: 'us-east-1',
  secondaryRegion: 'us-west-2 (Disaster Recovery Pilot Light)',
  availabilityZones: ['us-east-1a', 'us-east-1b', 'us-east-1c'],
  subnets: {
    public: ['10.100.1.0/24', '10.100.2.0/24'],
    privateApp: ['10.100.11.0/24', '10.100.12.0/24'],
    isolatedDb: ['10.100.21.0/24', '10.100.22.0/24'],
  },
  totalEstimatedMonthlyCost: 3244.00,
  targetSLA: '99.99% Availability Multi-AZ',
  rpo: '< 1 Minute (Aurora Synchronous Storage)',
  rto: '< 15 Minutes'
};

