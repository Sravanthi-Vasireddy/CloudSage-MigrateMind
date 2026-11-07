export const mockFinOpsOverview = {
  currentOnPremAnnual: 237600,
  currentOnPremMonthly: 19800,
  projectedCloudOnDemandAnnual: 170400,
  projectedCloudOnDemandMonthly: 14200,
  projectedCloudOptimizedAnnual: 149400,
  projectedCloudOptimizedMonthly: 12450,
  annualSavings: 88200,
  savingsPercentage: 38,
  fiveYearRoiPercentage: 312,
  paybackPeriodMonths: 7.2,
  carbonReductionTons: 142.4,
  carbonReductionPct: 48
};

export const mockMonthlyCostTrend = [
  { month: 'Jan', onPrem: 19800, cloudOnDemand: 3200, cloudOptimized: 2800 },
  { month: 'Feb', onPrem: 19800, cloudOnDemand: 4600, cloudOptimized: 4100 },
  { month: 'Mar', onPrem: 18900, cloudOnDemand: 6800, cloudOptimized: 5900 },
  { month: 'Apr', onPrem: 17400, cloudOnDemand: 8900, cloudOptimized: 7800 },
  { month: 'May', onPrem: 15100, cloudOnDemand: 10800, cloudOptimized: 9400 },
  { month: 'Jun', onPrem: 11500, cloudOnDemand: 12200, cloudOptimized: 10800 },
  { month: 'Jul', onPrem: 6800, cloudOnDemand: 13500, cloudOptimized: 11900 },
  { month: 'Aug', onPrem: 1200, cloudOnDemand: 14200, cloudOptimized: 12450 },
  { month: 'Sep', onPrem: 0, cloudOnDemand: 14200, cloudOptimized: 12450 },
  { month: 'Oct', onPrem: 0, cloudOnDemand: 14200, cloudOptimized: 12450 },
  { month: 'Nov', onPrem: 0, cloudOnDemand: 14200, cloudOptimized: 12450 },
  { month: 'Dec', onPrem: 0, cloudOnDemand: 14200, cloudOptimized: 12450 },
];

export const mockServiceCostBreakdown = [
  { service: 'Compute (EC2 / EKS / Fargate)', onDemand: 5800, optimized: 5100, color: '#2563eb', share: 41 },
  { service: 'Database (Aurora PostgreSQL / RDS)', onDemand: 4200, optimized: 3850, color: '#8b5cf6', share: 31 },
  { service: 'Storage (EBS / EFS / S3 Glacier)', onDemand: 2100, optimized: 1650, color: '#10b981', share: 13 },
  { service: 'Networking & Data Transfer (ALB, NAT, DX)', onDemand: 1300, optimized: 1150, color: '#f59e0b', share: 10 },
  { service: 'Enterprise Governance Hub', onDemand: 800, optimized: 700, color: '#06b6d4', share: 5 },
];

export const mockRightSizingRecommendations = [
  {
    id: 'RS-01',
    server: 'ord-prod-app01.acme.corp',
    currentSpec: '8 vCPU / 32 GB (Avg CPU: 42%)',
    currentCost: 310.00,
    recommendedSpec: 'AWS m6i.xlarge (4 vCPU / 16 GB)',
    targetCost: 142.80,
    monthlySavings: 167.20,
    savingsPct: 54,
    rationale: 'Overprovisioned RAM and CPU headroom. Auto-scaling handles traffic bursts elastically.'
  },
  {
    id: 'RS-02',
    server: 'ord-prod-db01.acme.corp',
    currentSpec: '32 vCPU / 128 GB Oracle Enterprise',
    currentCost: 2850.00,
    recommendedSpec: 'Aurora PostgreSQL db.r6g.2xlarge (8 vCPU / 64 GB)',
    targetCost: 1120.00,
    monthlySavings: 1730.00,
    savingsPct: 61,
    rationale: 'Aurora multi-threaded storage offload delivers 3x throughput compared to standard PostgreSQL.'
  },
  {
    id: 'RS-03',
    server: 'ord-prod-redis01.acme.corp',
    currentSpec: '4 vCPU / 32 GB Dedicated VM',
    currentCost: 240.00,
    recommendedSpec: 'Amazon ElastiCache cache.r6g.large',
    targetCost: 114.00,
    monthlySavings: 126.00,
    savingsPct: 53,
    rationale: 'Managed ElastiCache eliminates manual Redis clustering and standby server cost.'
  }
];

