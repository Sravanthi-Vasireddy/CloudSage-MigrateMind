// Dashboard sample data strictly adhering to Task 3 requirements

export const dashboardSummaryCards = [
  {
    id: 'total-workloads',
    title: 'Total Workloads',
    value: 48,
    unit: 'Workloads',
    subtext: 'Discovered in CMDB & Hypervisors',
    trend: '+4 this month',
    trendDirection: 'up',
    color: 'blue',
  },
  {
    id: 'assessed-workloads',
    title: 'Assessed Workloads',
    value: 36,
    unit: 'Workloads',
    subtext: '75% of total catalog assessed',
    trend: '12 pending review',
    trendDirection: 'neutral',
    color: 'purple',
  },
  {
    id: 'monthly-cloud-cost',
    title: 'Estimated Monthly Cloud Cost',
    value: 12450,
    formattedValue: '$12,450',
    subtext: 'Projected AWS Run Rate (Optimized)',
    trend: '38% savings vs on-prem',
    trendDirection: 'up',
    color: 'emerald',
  },
  {
    id: 'migration-progress',
    title: 'Migration Progress',
    value: 65,
    formattedValue: '65%',
    subtext: 'Wave 2 Execution in progress',
    trend: 'On schedule',
    trendDirection: 'up',
    color: 'amber',
  },
];

// Workload 6R Distribution Chart Data
export const workload6RDistribution = [
  { name: 'Rehost', count: 18, percentage: 38, color: '#2563eb', description: 'Lift & Shift to AWS EC2 via MGN' },
  { name: 'Replatform', count: 14, percentage: 29, color: '#0ea5e9', description: 'Lift & Reshape to RDS & EKS' },
  { name: 'Refactor', count: 7, percentage: 15, color: '#8b5cf6', description: 'Cloud-native re-architecting (Aurora/Lambda)' },
  { name: 'Repurchase', count: 4, percentage: 8, color: '#10b981', description: 'Drop & shop SaaS migration (Salesforce/Workday)' },
  { name: 'Retire', count: 3, percentage: 6, color: '#64748b', description: 'Decommission obsolete workloads' },
  { name: 'Retain', count: 2, percentage: 4, color: '#f59e0b', description: 'Retain on-premises due to hardware lock-in' },
];

// Cloud Cost Overview Chart (Sample Monthly Costs)
export const monthlyCloudCostTrend = [
  { month: 'Jan', onPremSpend: 19800, cloudSpend: 3200, optimizedSpend: 2800 },
  { month: 'Feb', onPremSpend: 19800, cloudSpend: 4600, optimizedSpend: 4100 },
  { month: 'Mar', onPremSpend: 18900, cloudSpend: 6800, optimizedSpend: 5900 },
  { month: 'Apr', onPremSpend: 17400, cloudSpend: 8900, optimizedSpend: 7800 },
  { month: 'May', onPremSpend: 15100, cloudSpend: 10800, optimizedSpend: 9400 },
  { month: 'Jun', onPremSpend: 11500, cloudSpend: 12200, optimizedSpend: 10800 },
  { month: 'Jul', onPremSpend: 6800, cloudSpend: 13500, optimizedSpend: 11900 },
  { month: 'Aug', onPremSpend: 1200, cloudSpend: 14200, optimizedSpend: 12450 },
  { month: 'Sep (Est)', onPremSpend: 0, cloudSpend: 14200, optimizedSpend: 12450 },
  { month: 'Oct (Est)', onPremSpend: 0, cloudSpend: 14200, optimizedSpend: 12450 },
  { month: 'Nov (Est)', onPremSpend: 0, cloudSpend: 14200, optimizedSpend: 12450 },
  { month: 'Dec (Est)', onPremSpend: 0, cloudSpend: 14200, optimizedSpend: 12450 },
];

// Recent Migration Projects Table Data
export const recentMigrationProjects = [
  {
    id: 'proj-01',
    projectName: 'Global Retail Core Modernization',
    client: 'Acme Retail Group',
    workloadsCount: 18,
    status: 'In Progress',
    statusVariant: 'blue',
    progress: 72,
    targetCloud: 'AWS (us-east-1)',
    lastUpdated: '12 mins ago',
    leadArchitect: 'Sai Kumar',
  },
  {
    id: 'proj-02',
    projectName: 'FinServe Banking Transaction Engine',
    client: 'Meridian Capital',
    workloadsCount: 14,
    status: 'Assessment',
    statusVariant: 'purple',
    progress: 45,
    targetCloud: 'AWS GovCloud',
    lastUpdated: '2 hours ago',
    leadArchitect: 'Priya Sharma',
  },
  {
    id: 'proj-03',
    projectName: 'Healthcare Patient Portal & EHR',
    client: 'St. Jude Health Network',
    workloadsCount: 10,
    status: 'Wave 1 Done',
    statusVariant: 'emerald',
    progress: 88,
    targetCloud: 'AWS (us-east-1)',
    lastUpdated: '1 day ago',
    leadArchitect: 'David Chen',
  },
  {
    id: 'proj-04',
    projectName: 'Global Logistics & Supply Chain SAP',
    client: 'TransGlobal Freightways',
    workloadsCount: 6,
    status: 'Discovery',
    statusVariant: 'amber',
    progress: 25,
    targetCloud: 'AWS (eu-west-1)',
    lastUpdated: '3 days ago',
    leadArchitect: 'Sarah Jenkins',
  },
];

// Recent Activity Section Data
export const recentActivityFeed = [
  {
    id: 'act-01',
    timestamp: '14 minutes ago',
    title: 'Terraform IaC Bundle Generated',
    description: 'Multi-AZ VPC and Amazon EKS v1.30 HCL configuration bundle compiled with 0 policy violations.',
    user: 'Sai Kumar (Lead Architect)',
    category: 'IaC Generator',
    type: 'success',
  },
  {
    id: 'act-02',
    timestamp: '1 hour ago',
    title: 'Strategy Override Applied',
    description: 'Workload "Customer Order DB (Oracle 19c)" strategy updated from Rehost to Refactor (Amazon Aurora PostgreSQL).',
    user: 'Sai Kumar (Lead Architect)',
    category: '6R Strategy',
    type: 'info',
  },
  {
    id: 'act-03',
    timestamp: '3 hours ago',
    title: 'Security Compliance Audit Completed',
    description: 'CIS AWS Foundations Benchmark scan completed with a 94% compliance score (47/50 checks passed).',
    user: 'Security Engine (HCLTech)',
    category: 'Compliance',
    type: 'success',
  },
  {
    id: 'act-04',
    timestamp: '5 hours ago',
    title: 'Discovery Connector Synchronized',
    description: 'RVTools vCenter data sync imported 4 new virtual machines from Chicago DC-1 cluster.',
    user: 'System Agent',
    category: 'Discovery',
    type: 'neutral',
  },
  {
    id: 'act-05',
    timestamp: 'Yesterday at 17:30',
    title: 'Wave 2 Migration Milestone Reached',
    description: 'AWS MGN continuous block-level replication validated for 12 non-production batch service VMs.',
    user: 'Alex Turner (Platform Eng)',
    category: 'Migration',
    type: 'info',
  },
];

