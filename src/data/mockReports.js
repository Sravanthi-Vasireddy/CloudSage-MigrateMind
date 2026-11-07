export const mockReports = [
  {
    id: 'rep-01',
    title: 'Executive Cloud Migration Business Case & TCO Assessment',
    category: 'Executive & Strategy',
    version: 'v2.4 Final',
    date: '2026-11-05',
    author: 'Sai Kumar, Lead Cloud Architect (HCLTech)',
    reviewer: 'Marcus Vance, Enterprise VP Infrastructure (Acme Retail)',
    approvalStatus: 'Approved by Steering Committee',
    summary: 'Financial and operational justification for migrating 48 on-premises enterprise workloads to AWS. Forecasts 38% ongoing run-rate savings ($88,200 annually) with payback achieved within 7.2 months.',
    pages: 28,
    sections: [
      {
        heading: '1. Executive Summary & Strategic Rationale',
        content: `Acme Retail Group faces hardware refresh cycles across its Chicago datacenter, coupled with licensing overhead on legacy Oracle Database EE and Windows Server. In collaboration with HCLTech Cloud Native Advisory, CloudSage – MigrateMind has executed an automated discovery and 6R strategy assessment across 48 workloads.

Migrating to Amazon Web Services (AWS) using an enterprise Landing Zone (AWS Control Tower, Amazon EKS, and Amazon Aurora PostgreSQL) delivers:
- $88,200 net annual operational savings (38% reduction).
- 99.99% high availability with multi-AZ zero-downtime failover.
- Rapid deployment cycles reduced from 6 weeks to 4 hours.
- 48% reduction in carbon emissions (142.4 MT CO2e saved annually).`
      },
      {
        heading: '2. 6R Strategy Portfolio Formulation',
        content: `CloudSage applied heuristics based on CPU utilization, database schema complexity, and 12-factor application traits:
- Rehost (38% / 18 workloads): Lift-and-shift via AWS MGN for batch and utility servers.
- Replatform (29% / 14 workloads): Transitioning Spring apps to Amazon EKS and caching to Amazon ElastiCache.
- Refactor (15% / 7 workloads): Modernizing core transactional Oracle databases to Amazon Aurora PostgreSQL Multi-AZ.
- Repurchase (8% / 4 workloads): Offloading custom legacy CRM to Salesforce Enterprise SaaS.
- Retire (6% / 3 workloads): Decommissioning deprecated Nagios and staging test boxes.
- Retain (4% / 2 workloads): Keeping factory-floor SCADA dongle servers on-premise with AWS Direct Connect hybrid peering.`
      }
    ],
    kpis: [
      { label: 'Total Workloads', value: '48 Workloads' },
      { label: 'Assessed Workloads', value: '36 Assessed' },
      { label: 'Payback Period', value: '7.2 Months' },
      { label: 'Readiness Index', value: '88% Ready' },
    ]
  },
  {
    id: 'rep-02',
    title: 'Technical Discovery & Cloud Target Architecture Blueprint',
    category: 'Architecture & Engineering',
    version: 'v2.1',
    date: '2026-10-28',
    author: 'CloudSage Automated IaC Engine & HCLTech CoE',
    reviewer: 'Security Architecture Review Board',
    approvalStatus: 'Architectural Approval Granted',
    summary: 'Detailed technical specification covering AWS VPC topology, CIDR allocations, Transit Gateway routing, Amazon EKS Karpenter auto-scaling, and Aurora PostgreSQL database tuning.',
    pages: 42,
    sections: [
      {
        heading: '1. Target Network Topology (Hub & Spoke)',
        content: `The landing zone implements a dual-AZ VPC architecture across us-east-1a and us-east-1b with 10.100.0.0/16 address space. Ingress traffic is inspected via AWS WAF v2 attached to Public Application Load Balancers. Application compute is strictly isolated inside private subnets (10.100.11.0/24), with all database traffic contained inside non-routable isolated subnets (10.100.21.0/24).`
      }
    ],
    kpis: [
      { label: 'VPC CIDR', value: '10.100.0.0/16' },
      { label: 'Kubernetes Version', value: 'v1.30' },
      { label: 'Target SLA', value: '99.99%' },
      { label: 'Security Group Count', value: '12 Groups' },
    ]
  }
];

