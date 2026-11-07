/**
 * CloudSage - MigrateMind
 * Cloud Migration Execution Planner REST API Client
 * Connects React frontend to Spring Boot backend (/api/migration-plans)
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const RESOURCE_URL = `${API_BASE_URL}/api/migration-plans`;

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

// Fallback Local Mock Engine for offline or standalone demo mode
const LOCAL_STORAGE_KEY = 'cloudsage_migration_plan';

function getLocalMockPlan(provider = 'AWS') {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      // ignore
    }
  }

  const now = new Date();
  const addDays = (d, days) => {
    const res = new Date(d);
    res.setDate(res.getDate() + days);
    return res.toISOString().split('T')[0];
  };

  const plan = {
    id: 1,
    planName: `Enterprise Banking & Digital Commerce Migration Plan (${provider})`,
    cloudProvider: provider,
    status: 'ACTIVE',
    totalWorkloads: 3,
    completedWorkloads: 1,
    overallProgressPercentage: 46.7,
    startDate: addDays(now, 7),
    targetCompletionDate: addDays(now, 175),
    notes: 'Automated migration roadmap synthesized from Stage 3 Infrastructure Inventory, Stage 4 6Rs Assessment, Stage 5 Target Architecture, and Stage 6 FinOps TCO.',
    waves: [
      {
        id: 1,
        migrationPlanId: 1,
        waveNumber: 1,
        waveName: 'Wave 1 – Pilot Migration',
        description: 'Deploy cloud landing zone foundation, Direct Connect hybrid networking, IAM security guardrails, and execute low-risk pilot microservice.',
        status: 'COMPLETED',
        startDate: addDays(now, 7),
        endDate: addDays(now, 35),
        waveLead: 'Sarah Jenkins (Lead Cloud Architect)',
        progressPercentage: 100.0,
        sortOrder: 1,
        workloadNames: ['Keycloak SSO & Pilot Microservice'],
        taskCount: 3,
        completedTaskCount: 3,
        tasks: [
          {
            id: 101,
            waveId: 1,
            waveName: 'Wave 1 – Pilot Migration',
            workloadName: 'Pilot Identity Workload',
            taskTitle: 'Deploy Multi-Account Landing Zone & Control Tower',
            description: 'Establish core organizational hierarchy, audit logging, and IAM guardrails.',
            assignedTo: 'Sarah Jenkins (Lead Cloud Architect)',
            priority: 'CRITICAL',
            status: 'COMPLETED',
            startDate: addDays(now, 7),
            dueDate: addDays(now, 17),
            dependencies: null,
            estimatedHours: 24.0,
            actualHours: 22.0,
            category: 'FOUNDATION',
            isDelayed: false
          },
          {
            id: 102,
            waveId: 1,
            waveName: 'Wave 1 – Pilot Migration',
            workloadName: 'Pilot Identity Workload',
            taskTitle: 'Configure 10G Hybrid Direct Connect & Transit Gateway',
            description: 'Establish redundant BGP peering between on-premises Equinix DC and cloud transit hub.',
            assignedTo: 'David Chen (DevOps / IaC)',
            priority: 'HIGH',
            status: 'COMPLETED',
            startDate: addDays(now, 17),
            dueDate: addDays(now, 27),
            dependencies: 'Deploy Multi-Account Landing Zone',
            estimatedHours: 32.0,
            actualHours: 30.0,
            category: 'FOUNDATION',
            isDelayed: false
          },
          {
            id: 103,
            waveId: 1,
            waveName: 'Wave 1 – Pilot Migration',
            workloadName: 'Pilot Identity Workload',
            taskTitle: 'Migrate Pilot Keycloak Authentication to Container Service',
            description: 'Containerize identity broker, validate latency (<5ms) and OAuth token exchange.',
            assignedTo: 'Alex Morgan (Security Eng)',
            priority: 'MEDIUM',
            status: 'COMPLETED',
            startDate: addDays(now, 25),
            dueDate: addDays(now, 35),
            dependencies: 'Configure 10G Hybrid Direct Connect',
            estimatedHours: 16.0,
            actualHours: 16.0,
            category: 'CUTOVER',
            isDelayed: false
          }
        ]
      },
      {
        id: 2,
        migrationPlanId: 1,
        waveNumber: 2,
        waveName: 'Wave 2 – Low Complexity Workloads',
        description: 'Migrate internal store associate portals, nightly reporting ETL pipelines, and managed Redis caching layers.',
        status: 'IN_PROGRESS',
        startDate: addDays(now, 36),
        endDate: addDays(now, 77),
        waveLead: 'David Chen (DevOps / IaC)',
        progressPercentage: 66.7,
        sortOrder: 2,
        workloadNames: ['ShopSphere Internal Cache & Batch'],
        taskCount: 3,
        completedTaskCount: 2,
        tasks: [
          {
            id: 201,
            waveId: 2,
            waveName: 'Wave 2 – Low Complexity Workloads',
            workloadName: 'ShopSphere Internal Cache & Batch',
            taskTitle: 'Deploy Amazon ElastiCache / Redis Managed Cluster',
            description: 'Provision Multi-AZ Redis cluster with in-transit encryption and automated snapshotting.',
            assignedTo: 'David Chen (DevOps / IaC)',
            priority: 'HIGH',
            status: 'COMPLETED',
            startDate: addDays(now, 37),
            dueDate: addDays(now, 52),
            dependencies: null,
            estimatedHours: 16.0,
            actualHours: 14.0,
            category: 'DATA_SYNC',
            isDelayed: false
          },
          {
            id: 202,
            waveId: 2,
            waveName: 'Wave 2 – Low Complexity Workloads',
            workloadName: 'ShopSphere Internal Cache & Batch',
            taskTitle: 'Refactor Nightly Batch Jobs to Step Functions & Glue',
            description: 'Modernize monolithic cron scripts into event-driven serverless workflow orchestrations.',
            assignedTo: 'Sarah Jenkins (Lead Cloud Architect)',
            priority: 'MEDIUM',
            status: 'IN_PROGRESS',
            startDate: addDays(now, 47),
            dueDate: addDays(now, 67),
            dependencies: null,
            estimatedHours: 24.0,
            actualHours: 12.0,
            category: 'SCHEMA_CONVERSION',
            isDelayed: false
          },
          {
            id: 203,
            waveId: 2,
            waveName: 'Wave 2 – Low Complexity Workloads',
            workloadName: 'ShopSphere Internal Cache & Batch',
            taskTitle: 'Execute UAT Smoke Tests for Store Associate Portal',
            description: 'Run automated Cypress integration suites against target cloud endpoints.',
            assignedTo: 'Sai Kumar (Enterprise Migration Lead)',
            priority: 'LOW',
            status: 'COMPLETED',
            startDate: addDays(now, 62),
            dueDate: addDays(now, 77),
            dependencies: 'Deploy Amazon ElastiCache',
            estimatedHours: 12.0,
            actualHours: 10.0,
            category: 'VALIDATION',
            isDelayed: false
          }
        ]
      },
      {
        id: 3,
        migrationPlanId: 1,
        waveNumber: 3,
        waveName: 'Wave 3 – Medium Complexity Workloads',
        description: 'Containerize customer-facing e-commerce web portals, product catalog search, and checkout APIs on managed Kubernetes (EKS / AKS / GKE).',
        status: 'IN_PROGRESS',
        startDate: addDays(now, 78),
        endDate: addDays(now, 122),
        waveLead: 'Sarah Jenkins (Lead Cloud Architect)',
        progressPercentage: 33.3,
        sortOrder: 3,
        workloadNames: ['E-Commerce Web Portal'],
        taskCount: 3,
        completedTaskCount: 1,
        tasks: [
          {
            id: 301,
            waveId: 3,
            waveName: 'Wave 3 – Medium Complexity Workloads',
            workloadName: 'E-Commerce Web Portal',
            taskTitle: 'Containerize ShopSphere Web Tier into Docker & Helm Charts',
            description: 'Package Spring Boot 3.3 microservices with multi-stage distroless container builds.',
            assignedTo: 'David Chen (DevOps / IaC)',
            priority: 'HIGH',
            status: 'COMPLETED',
            startDate: addDays(now, 79),
            dueDate: addDays(now, 92),
            dependencies: null,
            estimatedHours: 20.0,
            actualHours: 18.0,
            category: 'SCHEMA_CONVERSION',
            isDelayed: false
          },
          {
            id: 302,
            waveId: 3,
            waveName: 'Wave 3 – Medium Complexity Workloads',
            workloadName: 'E-Commerce Web Portal',
            taskTitle: 'Setup Target EKS Cluster with Karpenter Autoscaler',
            description: 'Deploy production Kubernetes v1.30 with IRSA security and AWS Load Balancer Controller.',
            assignedTo: 'Sarah Jenkins (Lead Cloud Architect)',
            priority: 'CRITICAL',
            status: 'IN_PROGRESS',
            startDate: addDays(now, 87),
            dueDate: addDays(now, 105),
            dependencies: null,
            estimatedHours: 32.0,
            actualHours: 16.0,
            category: 'FOUNDATION',
            isDelayed: false
          },
          {
            id: 303,
            waveId: 3,
            waveName: 'Wave 3 – Medium Complexity Workloads',
            workloadName: 'E-Commerce Web Portal',
            taskTitle: 'Configure PostgreSQL CDC Replication to Aurora PostgreSQL',
            description: 'Establish AWS DMS replication instance with zero replication lag monitoring.',
            assignedTo: 'Priya Sharma (Database Specialist)',
            priority: 'HIGH',
            status: 'BLOCKED',
            startDate: addDays(now, 97),
            dueDate: addDays(now, 117),
            dependencies: 'Setup Target EKS Cluster',
            blockerReason: 'Awaiting network firewall rule sign-off for inter-VPC database replication port 5432.',
            estimatedHours: 28.0,
            actualHours: 4.0,
            category: 'DATA_SYNC',
            isDelayed: false
          }
        ]
      },
      {
        id: 4,
        migrationPlanId: 1,
        waveNumber: 4,
        waveName: 'Wave 4 – High Complexity Workloads',
        description: 'Migrate mission-critical transactional Core Banking Engine (Oracle 19c RAC) and CRM Database Cluster (SQL Server 2022) with zero downtime cutover.',
        status: 'NOT_STARTED',
        startDate: addDays(now, 123),
        endDate: addDays(now, 162),
        waveLead: 'Priya Sharma (Database Specialist)',
        progressPercentage: 0.0,
        sortOrder: 4,
        workloadNames: ['Core Banking Engine', 'CRM Database Cluster'],
        taskCount: 3,
        completedTaskCount: 0,
        tasks: [
          {
            id: 401,
            waveId: 4,
            waveName: 'Wave 4 – High Complexity Workloads',
            workloadName: 'Core Banking Engine',
            taskTitle: 'AWS Schema Conversion Tool (SCT) Oracle to PostgreSQL Code Conversion',
            description: 'Convert PL/SQL stored procedures, packages, and custom sequence generators into native PL/pgSQL.',
            assignedTo: 'Priya Sharma (Database Specialist)',
            priority: 'CRITICAL',
            status: 'NOT_STARTED',
            startDate: addDays(now, 124),
            dueDate: addDays(now, 142),
            dependencies: null,
            estimatedHours: 40.0,
            actualHours: 0.0,
            category: 'SCHEMA_CONVERSION',
            isDelayed: false
          },
          {
            id: 402,
            waveId: 4,
            waveName: 'Wave 4 – High Complexity Workloads',
            workloadName: 'Core Banking Engine',
            taskTitle: '48-Hour Continuous Database CDC Synchronization Benchmark',
            description: 'Validate 15,000 transactions/sec throughput across Direct Connect with zero packet loss.',
            assignedTo: 'Priya Sharma (Database Specialist)',
            priority: 'CRITICAL',
            status: 'NOT_STARTED',
            startDate: addDays(now, 137),
            dueDate: addDays(now, 152),
            dependencies: 'AWS Schema Conversion Tool',
            estimatedHours: 32.0,
            actualHours: 0.0,
            category: 'DATA_SYNC',
            isDelayed: false
          },
          {
            id: 403,
            waveId: 4,
            waveName: 'Wave 4 – High Complexity Workloads',
            workloadName: 'Core Banking Engine',
            taskTitle: 'Execute Mission-Critical Production Cutover Window (Saturday 01:00 UTC)',
            description: 'Switch Route 53 DNS records, verify catch-up lag (0 ms), and execute financial ledger reconciliation.',
            assignedTo: 'Sai Kumar (Enterprise Migration Lead)',
            priority: 'CRITICAL',
            status: 'NOT_STARTED',
            startDate: addDays(now, 153),
            dueDate: addDays(now, 162),
            dependencies: '48-Hour Continuous Database CDC Synchronization Benchmark',
            estimatedHours: 24.0,
            actualHours: 0.0,
            category: 'CUTOVER',
            isDelayed: false
          }
        ]
      },
      {
        id: 5,
        migrationPlanId: 1,
        waveNumber: 5,
        waveName: 'Wave 5 – Final Migration and Optimization',
        description: 'Decommission legacy on-premises datacenter hardware, establish 3-Year FinOps Compute Savings Plans, and complete handover to Managed Cloud Operations.',
        status: 'NOT_STARTED',
        startDate: addDays(now, 163),
        endDate: addDays(now, 182),
        waveLead: 'Sai Kumar (Enterprise Migration Lead)',
        progressPercentage: 0.0,
        sortOrder: 5,
        workloadNames: ['Enterprise Archive & Datacenter Decom'],
        taskCount: 3,
        completedTaskCount: 0,
        tasks: [
          {
            id: 501,
            waveId: 5,
            waveName: 'Wave 5 – Final Migration and Optimization',
            workloadName: 'Enterprise Archive & Datacenter Decom',
            taskTitle: 'Archive Legacy Audit Logs & Snapshots to S3 Glacier Deep Archive',
            description: 'Lifecycle 1,950 GB of historical database backups into immutable WORM storage.',
            assignedTo: 'Alex Morgan (Security Eng)',
            priority: 'MEDIUM',
            status: 'NOT_STARTED',
            startDate: addDays(now, 164),
            dueDate: addDays(now, 172),
            dependencies: null,
            estimatedHours: 16.0,
            actualHours: 0.0,
            category: 'OPTIMIZATION',
            isDelayed: false
          },
          {
            id: 502,
            waveId: 5,
            waveName: 'Wave 5 – Final Migration and Optimization',
            workloadName: 'Enterprise Archive & Datacenter Decom',
            taskTitle: 'Lock In 3-Year FinOps Compute Savings Plans',
            description: 'Commit steady-state 40 vCPU / 224 GB RAM capacity to achieve 42% recurring TCO reduction.',
            assignedTo: 'Sai Kumar (Enterprise Migration Lead)',
            priority: 'HIGH',
            status: 'NOT_STARTED',
            startDate: addDays(now, 169),
            dueDate: addDays(now, 177),
            dependencies: null,
            estimatedHours: 8.0,
            actualHours: 0.0,
            category: 'OPTIMIZATION',
            isDelayed: false
          },
          {
            id: 503,
            waveId: 5,
            waveName: 'Wave 5 – Final Migration and Optimization',
            workloadName: 'Enterprise Archive & Datacenter Decom',
            taskTitle: 'Complete Physical Datacenter Rack Decommission & Lease Termination',
            description: 'Sanitize physical SAN drives according to NIST 800-88 guidelines and terminate datacenter colocation contracts.',
            assignedTo: 'Sai Kumar (Enterprise Migration Lead)',
            priority: 'HIGH',
            status: 'NOT_STARTED',
            startDate: addDays(now, 175),
            dueDate: addDays(now, 182),
            dependencies: 'Archive Legacy Audit Logs',
            estimatedHours: 32.0,
            actualHours: 0.0,
            category: 'CUTOVER',
            isDelayed: false
          }
        ]
      }
    ]
  };

  const allTasks = plan.waves.flatMap(w => w.tasks);
  plan.tasks = allTasks;

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(plan));
  return plan;
}

export const migrationPlanApi = {
  /**
   * Retrieve active migration plan
   */
  async getActivePlan() {
    try {
      const response = await fetch(`${RESOURCE_URL}/active`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
      return await handleResponse(response);
    } catch (err) {
      console.warn('MigrationPlan API getActivePlan fallback to local mock:', err.message);
      return getLocalMockPlan();
    }
  },

  /**
   * Generate or regenerate migration execution plan
   */
  async generatePlan(cloudProvider = 'AWS') {
    try {
      const response = await fetch(`${RESOURCE_URL}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ cloudProvider }),
      });
      return await handleResponse(response);
    } catch (err) {
      console.warn('MigrationPlan API generatePlan fallback:', err.message);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      return getLocalMockPlan(cloudProvider);
    }
  },

  /**
   * Update wave details
   */
  async updateWave(waveId, waveData) {
    try {
      const response = await fetch(`${RESOURCE_URL}/waves/${waveId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(waveData),
      });
      return await handleResponse(response);
    } catch (err) {
      console.warn('MigrationPlan API updateWave fallback:', err.message);
      const plan = getLocalMockPlan();
      const wave = plan.waves.find(w => w.id === waveId);
      if (wave) {
        Object.assign(wave, waveData);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(plan));
        return wave;
      }
      return waveData;
    }
  },

  /**
   * Reorder migration waves
   */
  async reorderWaves(waveIdsInOrder) {
    try {
      const response = await fetch(`${RESOURCE_URL}/waves/reorder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(waveIdsInOrder),
      });
      return await handleResponse(response);
    } catch (err) {
      console.warn('MigrationPlan API reorderWaves fallback:', err.message);
      const plan = getLocalMockPlan();
      plan.waves.sort((a, b) => waveIdsInOrder.indexOf(a.id) - waveIdsInOrder.indexOf(b.id));
      plan.waves.forEach((w, idx) => { w.sortOrder = idx + 1; });
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(plan));
      return true;
    }
  },

  /**
   * Add workload to wave
   */
  async addWorkloadToWave(waveId, workloadName) {
    try {
      const response = await fetch(`${RESOURCE_URL}/waves/${waveId}/workloads?workloadName=${encodeURIComponent(workloadName)}`, {
        method: 'POST',
        headers: { Accept: 'application/json' },
      });
      return await handleResponse(response);
    } catch (err) {
      console.warn('MigrationPlan API addWorkload fallback:', err.message);
      const plan = getLocalMockPlan();
      const wave = plan.waves.find(w => w.id === waveId);
      if (wave) {
        if (!wave.workloadNames.includes(workloadName)) wave.workloadNames.push(workloadName);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(plan));
        return wave;
      }
      return null;
    }
  },

  /**
   * Remove workload from wave
   */
  async removeWorkloadFromWave(waveId, workloadName) {
    try {
      const response = await fetch(`${RESOURCE_URL}/waves/${waveId}/workloads?workloadName=${encodeURIComponent(workloadName)}`, {
        method: 'DELETE',
        headers: { Accept: 'application/json' },
      });
      return await handleResponse(response);
    } catch (err) {
      console.warn('MigrationPlan API removeWorkload fallback:', err.message);
      const plan = getLocalMockPlan();
      const wave = plan.waves.find(w => w.id === waveId);
      if (wave) {
        wave.workloadNames = wave.workloadNames.filter(n => n !== workloadName);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(plan));
        return wave;
      }
      return null;
    }
  },

  /**
   * Create new migration task
   */
  async createTask(taskData) {
    try {
      const response = await fetch(`${RESOURCE_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(taskData),
      });
      return await handleResponse(response);
    } catch (err) {
      console.warn('MigrationPlan API createTask fallback:', err.message);
      const plan = getLocalMockPlan();
      const wave = plan.waves.find(w => w.id === taskData.waveId) || plan.waves[0];
      const newTask = {
        ...taskData,
        id: Date.now(),
        waveId: wave.id,
        waveName: wave.waveName,
        status: taskData.status || 'NOT_STARTED',
        isDelayed: false
      };
      wave.tasks = wave.tasks || [];
      wave.tasks.push(newTask);
      plan.tasks.push(newTask);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(plan));
      return newTask;
    }
  },

  /**
   * Update existing task
   */
  async updateTask(taskId, taskData) {
    try {
      const response = await fetch(`${RESOURCE_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(taskData),
      });
      return await handleResponse(response);
    } catch (err) {
      console.warn('MigrationPlan API updateTask fallback:', err.message);
      const plan = getLocalMockPlan();
      for (const wave of plan.waves) {
        const t = wave.tasks?.find(item => item.id === taskId);
        if (t) {
          Object.assign(t, taskData);
          if (taskData.status !== 'BLOCKED') t.blockerReason = null;
          break;
        }
      }
      const tInAll = plan.tasks.find(item => item.id === taskId);
      if (tInAll) {
        Object.assign(tInAll, taskData);
        if (taskData.status !== 'BLOCKED') tInAll.blockerReason = null;
      }
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(plan));
      return taskData;
    }
  },

  /**
   * Delete task
   */
  async deleteTask(taskId) {
    try {
      const response = await fetch(`${RESOURCE_URL}/tasks/${taskId}`, {
        method: 'DELETE',
      });
      return await handleResponse(response);
    } catch (err) {
      console.warn('MigrationPlan API deleteTask fallback:', err.message);
      const plan = getLocalMockPlan();
      plan.waves.forEach(w => {
        if (w.tasks) w.tasks = w.tasks.filter(t => t.id !== taskId);
      });
      plan.tasks = plan.tasks.filter(t => t.id !== taskId);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(plan));
      return true;
    }
  },

  /**
   * Get progress summary
   */
  async getProgressSummary() {
    try {
      const response = await fetch(`${RESOURCE_URL}/progress`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
      return await handleResponse(response);
    } catch (err) {
      console.warn('MigrationPlan API getProgressSummary fallback:', err.message);
      return {
        totalWorkloads: 3,
        completedWorkloads: 1,
        inProgressWorkloads: 2,
        pendingWorkloads: 0,
        totalTasks: 15,
        completedTasks: 7,
        inProgressTasks: 3,
        notStartedTasks: 4,
        blockedTasks: 1,
        overallProgressPercentage: 46.7,
        waveProgressList: [
          { waveId: 1, waveNumber: 1, waveName: 'Wave 1 – Pilot Migration', status: 'COMPLETED', progressPercentage: 100.0, totalTasks: 3, completedTasks: 3, workloadCount: 1 },
          { waveId: 2, waveNumber: 2, waveName: 'Wave 2 – Low Complexity Workloads', status: 'IN_PROGRESS', progressPercentage: 66.7, totalTasks: 3, completedTasks: 2, workloadCount: 1 },
          { waveId: 3, waveNumber: 3, waveName: 'Wave 3 – Medium Complexity Workloads', status: 'IN_PROGRESS', progressPercentage: 33.3, totalTasks: 3, completedTasks: 1, workloadCount: 1 },
          { waveId: 4, waveNumber: 4, waveName: 'Wave 4 – High Complexity Workloads', status: 'NOT_STARTED', progressPercentage: 0.0, totalTasks: 3, completedTasks: 0, workloadCount: 2 },
          { waveId: 5, waveNumber: 5, waveName: 'Wave 5 – Final Migration and Optimization', status: 'NOT_STARTED', progressPercentage: 0.0, totalTasks: 3, completedTasks: 0, workloadCount: 1 }
        ],
        tasksByCategory: {
          FOUNDATION: 3,
          DATA_SYNC: 3,
          SCHEMA_CONVERSION: 3,
          CUTOVER: 3,
          VALIDATION: 1,
          OPTIMIZATION: 2
        }
      };
    }
  },

  /**
   * Get risks, blockers, and dependencies
   */
  async getRisksAndDependencies() {
    try {
      const response = await fetch(`${RESOURCE_URL}/risks`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
      return await handleResponse(response);
    } catch (err) {
      console.warn('MigrationPlan API getRisks fallback:', err.message);
      return {
        workloadDependencies: [
          {
            sourceWorkload: 'E-Commerce Web Portal',
            dependsOnWorkload: 'Core Banking Engine',
            dependencyType: 'DATABASE',
            status: 'IN_PROGRESS',
            description: 'Web checkout API requires low-latency database connection to primary transactional ledger.'
          },
          {
            sourceWorkload: 'CRM Database Cluster',
            dependsOnWorkload: 'AWS IAM / Keycloak SSO',
            dependencyType: 'IDENTITY',
            status: 'RESOLVED',
            description: 'Client360 administrative roles depend on SAML federated directory sync.'
          },
          {
            sourceWorkload: 'Nightly Reporting Batch',
            dependsOnWorkload: 'E-Commerce PostgreSQL DB',
            dependencyType: 'BATCH',
            status: 'PENDING',
            description: 'Step Functions ETL job requires read replica in target VPC before cutover.'
          }
        ],
        migrationBlockers: [
          {
            taskId: 303,
            taskTitle: 'Configure PostgreSQL CDC Replication to Aurora PostgreSQL',
            workloadName: 'E-Commerce Web Portal',
            assignedTo: 'Priya Sharma (Database Specialist)',
            blockerReason: 'Awaiting network firewall rule sign-off for inter-VPC database replication port 5432.',
            suggestedCorrectiveAction: 'Escalate to Enterprise CISO / Firewall Governance Board for expedited security group rule approval.'
          }
        ],
        highRiskWorkloads: [
          {
            workloadName: 'Core Banking Engine',
            riskLevel: 'CRITICAL',
            riskCategory: 'DATA_LOSS & DOWNTIME',
            description: 'Mission-critical transaction ledger handling live financial deposits and ACH settlement.',
            mitigationStrategy: 'Execute 3 full dry-run cutovers in staging; leverage AWS DMS continuous CDC replication with zero data loss threshold.'
          },
          {
            workloadName: 'CRM Database Cluster',
            riskLevel: 'HIGH',
            riskCategory: 'SECURITY',
            description: 'Houses 2.4M customer PII records and GDPR/CCPA sensitive data.',
            mitigationStrategy: 'Enforce AWS KMS Customer Managed Keys with automated annual key rotation and TLS 1.3 in-transit.'
          },
          {
            workloadName: 'E-Commerce Web Portal',
            riskLevel: 'MEDIUM',
            riskCategory: 'PERFORMANCE',
            description: 'High burst traffic during flash sales requires elastic auto-scaling.',
            mitigationStrategy: 'Deploy Karpenter autoscaling on EKS with pre-warmed ALB target groups.'
          }
        ],
        scheduleConflicts: [
          {
            conflictTitle: 'Core Banking Cutover Window Overlaps Month-End Financial Close',
            affectedWave: 'Wave 4',
            details: 'Finance blackout window prevents database downtime between Oct 28 - Nov 03.',
            recommendedResolution: 'Shift Wave 4 cutover window forward to October 18 (Saturday 01:00 UTC) to ensure 10-day buffer.'
          }
        ],
        delayedTasks: []
      };
    }
  },

  /**
   * Get team workload distribution
   */
  async getTeamWorkloadDistribution() {
    try {
      const response = await fetch(`${RESOURCE_URL}/team`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
      return await handleResponse(response);
    } catch (err) {
      console.warn('MigrationPlan API getTeam fallback:', err.message);
      return [
        {
          memberName: 'Sarah Jenkins (Lead Cloud Architect)',
          role: 'Lead Cloud Architect',
          totalTasksAssigned: 4,
          completedTasks: 2,
          inProgressTasks: 2,
          blockedTasks: 0,
          totalEstimatedHours: 112.0,
          allocationPercentage: 30.5
        },
        {
          memberName: 'David Chen (DevOps / IaC)',
          role: 'DevOps & IaC Specialist',
          totalTasksAssigned: 4,
          completedTasks: 3,
          inProgressTasks: 1,
          blockedTasks: 0,
          totalEstimatedHours: 100.0,
          allocationPercentage: 27.2
        },
        {
          memberName: 'Priya Sharma (Database Specialist)',
          role: 'Senior Database Administrator',
          totalTasksAssigned: 4,
          completedTasks: 0,
          inProgressTasks: 0,
          blockedTasks: 1,
          totalEstimatedHours: 100.0,
          allocationPercentage: 27.2
        },
        {
          memberName: 'Alex Morgan (Security Eng)',
          role: 'Cloud Security Engineer',
          totalTasksAssigned: 2,
          completedTasks: 1,
          inProgressTasks: 0,
          blockedTasks: 0,
          totalEstimatedHours: 32.0,
          allocationPercentage: 8.7
        },
        {
          memberName: 'Sai Kumar (Enterprise Migration Lead)',
          role: 'Enterprise Migration Lead',
          totalTasksAssigned: 4,
          completedTasks: 1,
          inProgressTasks: 0,
          blockedTasks: 0,
          totalEstimatedHours: 76.0,
          allocationPercentage: 20.7
        }
      ];
    }
  }
};

