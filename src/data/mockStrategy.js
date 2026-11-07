export const SIX_R_STRATEGIES = {
  Rehost: {
    name: 'Rehost (Lift & Shift)',
    code: 'rehost',
    color: '#2563eb',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    description: 'Moving applications to the cloud without changes to architecture or code.',
    bestFor: 'Legacy applications, rapid datacenter exit deadlines, COTS software without source access.',
    targetTools: ['AWS Application Migration Service (MGN)', 'AWS VM Import/Export', 'EC2 Auto Scaling'],
    avgEffort: '2 - 4 Weeks',
    typicalCostSavings: '20% - 30%',
    riskProfile: 'Low',
    pros: ['Fastest migration path', 'Minimal code changes', 'Immediate datacenter evacuation'],
    cons: ['Does not leverage cloud-native elasticity', 'Carries existing technical debt into cloud']
  },
  Replatform: {
    name: 'Replatform (Lift & Reshape)',
    code: 'replatform',
    color: '#0ea5e9',
    badgeClass: 'bg-sky-50 text-sky-700 border-sky-200',
    description: 'Modifying a few components to take advantage of cloud-managed services without fundamental core architecture changes.',
    bestFor: 'Moving from self-hosted DBs to Amazon RDS / Aurora, containerizing Spring apps to EKS/ECS, caching in ElastiCache.',
    targetTools: ['Amazon RDS', 'Amazon EKS', 'AWS Elastic Beanstalk', 'Amazon ElastiCache'],
    avgEffort: '4 - 8 Weeks',
    typicalCostSavings: '35% - 45%',
    riskProfile: 'Medium-Low',
    pros: ['Replaces OS and DB admin burden', 'Automated patching and backups', 'Higher availability without rewrite'],
    cons: ['Requires configuration adjustments', 'Minor testing cycle needed']
  },
  Refactor: {
    name: 'Refactor (Re-architect)',
    code: 'refactor',
    color: '#8b5cf6',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
    description: 'Re-imagining and rewriting how an application is architected and developed using cloud-native capabilities.',
    bestFor: 'Core business differentiating workloads needing massive scale, agile CI/CD, and high resilience.',
    targetTools: ['AWS Lambda', 'Amazon EventBridge', 'Amazon DynamoDB', 'Amazon Step Functions', 'AWS Fargate'],
    avgEffort: '8 - 16 Weeks',
    typicalCostSavings: '50% - 70%',
    riskProfile: 'Medium-High',
    pros: ['Maximum agility and elastic scaling', 'Lowest ongoing run cost per transaction', 'High developer velocity'],
    cons: ['Longest delivery timeline', 'Requires code changes and architectural expertise']
  },
  Repurchase: {
    name: 'Repurchase (Drop & Shop)',
    code: 'repurchase',
    color: '#10b981',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    description: 'Transitioning to a modern Software as a Service (SaaS) platform, retiring the legacy self-hosted package entirely.',
    bestFor: 'Standard business support functions like CRM, HR, Service Desk, Marketing Automation.',
    targetTools: ['Salesforce', 'Workday', 'ServiceNow', 'Datadog', 'Snowflake'],
    avgEffort: '6 - 12 Weeks',
    typicalCostSavings: '30% - 50%',
    riskProfile: 'Medium',
    pros: ['Eliminates infrastructure and patch maintenance', 'Vendor handles upgrades and compliance'],
    cons: ['Data migration complexity', 'Change management and user training']
  },
  Retain: {
    name: 'Retain (Keep On-Premises)',
    code: 'retain',
    color: '#f59e0b',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    description: 'Retaining workloads on-premises or in colocation due to strict regulatory compliance, low-latency industrial hardware, or recent heavy CapEx investment.',
    bestFor: 'Mainframes, OT SCADA systems with serial hardware dongles, ultra-low latency factory floor systems.',
    targetTools: ['AWS Direct Connect', 'AWS Outposts', 'VMware Cloud on AWS'],
    avgEffort: '1 - 2 Weeks (Hybrid Integration)',
    typicalCostSavings: '0% (Preserved)',
    riskProfile: 'Low',
    pros: ['Zero disruption to sensitive legacy operations', 'Protects recent CapEx hardware investments'],
    cons: ['Requires maintaining datacenter operations', 'No immediate cloud cost reduction']
  },
  Retire: {
    name: 'Retire (Decommission)',
    code: 'retire',
    color: '#64748b',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
    description: 'Decommissioning or archiving workloads, servers, and storage that are obsolete or no longer add business value.',
    bestFor: 'Deprecated test environments, legacy reporting servers replaced by analytics portals, dormant VMs.',
    targetTools: ['AWS Backup for Archival', 'Amazon S3 Glacier Flexible Retrieval', 'Automated Shutdown Scripts'],
    avgEffort: '1 - 2 Weeks',
    typicalCostSavings: '100% of workload cost',
    riskProfile: 'Very Low',
    pros: ['Instant cost savings', 'Reduces attack surface and audit scope', 'Cleans up CMDB'],
    cons: ['Requires stakeholder confirmation and retention archiving']
  }
};

export const mockStrategyDistribution = [
  { name: 'Rehost', count: 18, percentage: 38, costAnnual: 48000, color: '#2563eb' },
  { name: 'Replatform', count: 14, percentage: 29, costAnnual: 36000, color: '#0ea5e9' },
  { name: 'Refactor', count: 7, percentage: 15, costAnnual: 22000, color: '#8b5cf6' },
  { name: 'Repurchase', count: 4, percentage: 8, costAnnual: 14000, color: '#10b981' },
  { name: 'Retire', count: 3, percentage: 6, costAnnual: 0, color: '#64748b' },
  { name: 'Retain', count: 2, percentage: 4, costAnnual: 9400, color: '#f59e0b' },
];

export const mockStrategyRules = [
  {
    id: 'rule-1',
    ruleName: 'Legacy DB Migration to Cloud Managed',
    condition: 'Workload == Relational Database AND Schema Conversion Compatibility > 80%',
    action: 'Recommend Replatform / Refactor to Amazon Aurora PostgreSQL',
    priority: 'High',
    matchedCount: 8
  },
  {
    id: 'rule-2',
    ruleName: 'Stateless Web & API Tier Containerization',
    condition: 'Workload == Web Application AND Stateless Session == True',
    action: 'Recommend Replatform to AWS EKS with ALB and Auto-Scaling',
    priority: 'High',
    matchedCount: 16
  },
  {
    id: 'rule-3',
    ruleName: 'End-of-Life Operating System Quarantine',
    condition: 'OS == Windows Server 2008/2012 OR CentOS <= 7',
    action: 'Flag Critical Upgrade Alert; Require Refactor or Modern Replatform before Cutover',
    priority: 'Critical',
    matchedCount: 5
  },
  {
    id: 'rule-4',
    ruleName: 'SaaS Candidate Offloading',
    condition: 'Workload Category in [CRM, HRIS, ServiceDesk] AND COTS == True',
    action: 'Recommend Repurchase with SaaS Alternative',
    priority: 'Medium',
    matchedCount: 4
  },
  {
    id: 'rule-5',
    ruleName: 'Dormant Server Decommissioning',
    condition: 'CPU Utilization < 5% for 90 Days AND Network Traffic < 100 MB/mo',
    action: 'Recommend Retire (Decommission & Snapshot to S3 Glacier)',
    priority: 'Medium',
    matchedCount: 3
  }
];

