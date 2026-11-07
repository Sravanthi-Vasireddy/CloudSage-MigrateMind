export const mockMigrationWaves = [
  {
    id: 'wave-0',
    title: 'Wave 0: Cloud Foundation & Landing Zone',
    duration: 'Weeks 1 - 4',
    status: 'Completed',
    progress: 100,
    serverCount: 8,
    lead: 'Sai Kumar',
    description: 'Establish AWS Organizations, Control Tower, Multi-AZ VPC networking, Transit Gateway, Direct Connect BGP, and IAM Identity Center.',
    tasks: [
      { name: 'AWS Control Tower multi-account setup', status: 'Done', date: '2026-03-05' },
      { name: '10 Gbps AWS Direct Connect BGP peering', status: 'Done', date: '2026-03-14' },
      { name: 'Core Landing Zone Terraform pipelines', status: 'Done', date: '2026-03-22' },
      { name: 'CloudTrail & Security Hub baseline enforcement', status: 'Done', date: '2026-03-28' },
    ]
  },
  {
    id: 'wave-1',
    title: 'Wave 1: Pilot & Security/Identity Workloads',
    duration: 'Weeks 5 - 8',
    status: 'Completed',
    progress: 100,
    serverCount: 12,
    lead: 'David Chen',
    description: 'Migrate Keycloak SSO, Dev/Test non-critical microservices, and ElastiCache clusters to validate network latency and observability.',
    tasks: [
      { name: 'Deploy Amazon EKS Pilot Cluster (v1.30)', status: 'Done', date: '2026-04-10' },
      { name: 'Migrate Keycloak Auth to ECS Fargate', status: 'Done', date: '2026-04-20' },
      { name: 'ElastiCache Redis Multi-AZ cutover', status: 'Done', date: '2026-04-26' },
    ]
  },
  {
    id: 'wave-2',
    title: 'Wave 2: Internal Enterprise Apps & Batch Processing',
    duration: 'Weeks 9 - 16',
    status: 'In Progress',
    progress: 65,
    serverCount: 16,
    lead: 'Alex Turner',
    description: 'Migrate inventory sync middleware, ETL batch pipelines, and containerize internal store associate portals.',
    tasks: [
      { name: 'AWS MGN agent deployment to batch VMs', status: 'Done', date: '2026-06-04' },
      { name: 'Refactor nightly reporting to AWS Step Functions & Glue', status: 'In Progress', date: '2026-06-25' },
      { name: 'UAT testing for ERP Bridge API', status: 'Planned', date: '2026-07-28' },
    ]
  },
  {
    id: 'wave-3',
    title: 'Wave 3: Core eCommerce API & Oracle DB Cutover',
    duration: 'Weeks 17 - 24',
    status: 'Planned',
    progress: 10,
    serverCount: 12,
    lead: 'Sai Kumar',
    description: 'Production migration of customer checkout API, Spring Boot services, and Oracle 19c conversion to Aurora PostgreSQL.',
    tasks: [
      { name: 'AWS SCT Schema final review & unit tests', status: 'In Progress', date: '2026-08-15' },
      { name: 'Dry-run 48-hour data synchronization benchmark', status: 'Planned', date: '2026-09-02' },
      { name: 'Go-Live Cutover Window (Saturday 01:00 UTC)', status: 'Planned', date: '2026-10-04' },
    ]
  }
];

export const mockCutoverRunbook = [
  { step: 1, phase: 'T-72 Hours', title: 'Freeze Configuration & Pre-Seed DMS Replication', owner: 'DBA Team', status: 'Completed', duration: '2 Hours' },
  { step: 2, phase: 'T-24 Hours', title: 'Drop DNS TTL to 300 Seconds on Route 53', owner: 'Network Team', status: 'Completed', duration: '15 Mins' },
  { step: 3, phase: 'T-6 Hours', title: 'Executive Go/No-Go Decision Gate with HCLTech Leadership', owner: 'Sai Kumar & Acme CIO', status: 'Ready', duration: '30 Mins' },
  { step: 4, phase: 'T-0 Hours (Cutover)', title: 'Place On-Prem Web Store into Maintenance Mode', owner: 'DevOps Lead', status: 'Pending', duration: '5 Mins' },
  { step: 5, phase: 'T+30 Mins', title: 'Verify Aurora PostgreSQL Catch-up Lag (0 ms)', owner: 'Data Architect', status: 'Pending', duration: '15 Mins' },
  { step: 6, phase: 'T+45 Mins', title: 'Switch Route 53 Alias Record to AWS Public ALB', owner: 'Network Team', status: 'Pending', duration: '10 Mins' },
  { step: 7, phase: 'T+60 Mins', title: 'Execute End-to-End Synthetic Checkout Smoke Tests', owner: 'QA Lead', status: 'Pending', duration: '20 Mins' },
  { step: 8, phase: 'T+90 Mins', title: 'Lift Maintenance Page & Announce Cutover Success', owner: 'Incident Commander', status: 'Pending', duration: '5 Mins' },
];

