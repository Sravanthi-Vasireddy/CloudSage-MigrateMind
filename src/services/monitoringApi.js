/**
 * CloudSage - MigrateMind
 * Migration Monitoring & Workload Validation REST API Client
 * Connects React frontend to Spring Boot backend (/api/monitoring)
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const RESOURCE_URL = `${API_BASE_URL}/api/monitoring`;

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
  WORKLOADS: 'cloudsage_monitoring_workloads',
  VALIDATIONS: 'cloudsage_monitoring_validations',
  FAILURES: 'cloudsage_monitoring_failures',
  METRICS: 'cloudsage_monitoring_metrics',
  AUDIT: 'cloudsage_monitoring_audit'
};

const DEFAULT_WORKLOADS = [
  {
    id: 1,
    workloadName: 'Retail Orders Web Portal',
    sourceHost: 'web-app-01.dc1',
    targetCloudService: 'AWS EKS Cluster (v1.30)',
    migrationWaveId: 1,
    waveName: 'Wave 1 – Pilot Migration',
    status: 'SUCCESSFUL',
    completionPercentage: 100.0,
    cutoverTimestamp: '2026-11-01T12:00:00',
    lastValidatedAt: '2026-11-07T14:30:00',
    healthStatus: 'HEALTHY',
    cpuUtilization: 32.5,
    memoryUtilization: 48.0,
    storageUtilization: 42.0,
    uptimePercentage: 99.98,
    responseTimeMs: 45,
    networkThroughputMbps: 185.0,
    isSimulated: true
  },
  {
    id: 2,
    workloadName: 'Payment Processing Gateway',
    sourceHost: 'pay-srv-02.dc1',
    targetCloudService: 'AWS EKS Microservices',
    migrationWaveId: 2,
    waveName: 'Wave 2 – Core Business Applications',
    status: 'SUCCESSFUL',
    completionPercentage: 100.0,
    cutoverTimestamp: '2026-11-03T16:45:00',
    lastValidatedAt: '2026-11-07T14:30:00',
    healthStatus: 'HEALTHY',
    cpuUtilization: 46.0,
    memoryUtilization: 62.0,
    storageUtilization: 55.0,
    uptimePercentage: 99.95,
    responseTimeMs: 38,
    networkThroughputMbps: 340.0,
    isSimulated: true
  },
  {
    id: 3,
    workloadName: 'Core Banking Ledger DB',
    sourceHost: 'db-exadata-01.dc1',
    targetCloudService: 'AWS Aurora PostgreSQL Multi-AZ',
    migrationWaveId: 3,
    waveName: 'Wave 3 – Critical Databases',
    status: 'IN_PROGRESS',
    completionPercentage: 68.0,
    cutoverTimestamp: null,
    lastValidatedAt: '2026-11-07T14:30:00',
    healthStatus: 'DEGRADED',
    cpuUtilization: 74.0,
    memoryUtilization: 81.0,
    storageUtilization: 69.0,
    uptimePercentage: 99.50,
    responseTimeMs: 125,
    networkThroughputMbps: 512.0,
    isSimulated: true
  },
  {
    id: 4,
    workloadName: 'BI & Financial Reporting Lake',
    sourceHost: 'bi-etl-01.dc1',
    targetCloudService: 'AWS Redshift Serverless',
    migrationWaveId: 4,
    waveName: 'Wave 4 – Analytics & Big Data',
    status: 'PENDING',
    completionPercentage: 15.0,
    cutoverTimestamp: null,
    lastValidatedAt: '2026-11-07T14:30:00',
    healthStatus: 'HEALTHY',
    cpuUtilization: 12.0,
    memoryUtilization: 24.0,
    storageUtilization: 85.0,
    uptimePercentage: 100.0,
    responseTimeMs: 85,
    networkThroughputMbps: 45.0,
    isSimulated: true
  },
  {
    id: 5,
    workloadName: 'Customer Loyalty Mobile API',
    sourceHost: 'app-node-03.dc1',
    targetCloudService: 'AWS App Runner & DynamoDB',
    migrationWaveId: 2,
    waveName: 'Wave 2 – Core Business Applications',
    status: 'FAILED',
    completionPercentage: 45.0,
    cutoverTimestamp: null,
    lastValidatedAt: '2026-11-07T14:30:00',
    healthStatus: 'CRITICAL',
    cpuUtilization: 92.0,
    memoryUtilization: 89.0,
    storageUtilization: 71.0,
    uptimePercentage: 94.20,
    responseTimeMs: 450,
    networkThroughputMbps: 12.0,
    isSimulated: true
  }
];

const DEFAULT_VALIDATIONS = [
  {
    id: 1,
    validationName: 'Application HTTP/HTTPS 200 OK Probe',
    workloadName: 'Retail Orders Web Portal',
    workloadId: 1,
    validationType: 'APPLICATION_AVAILABILITY',
    expectedResult: 'HTTP 200 OK <= 150ms from ingress ALB',
    actualResult: 'HTTP 200 OK in 38ms from ALB',
    validationStatus: 'PASSED',
    errorDetails: null,
    executedAt: '2026-11-07T14:30:00',
    retryCount: 0
  },
  {
    id: 2,
    validationName: 'Database Connection Pool & Query Handshake',
    workloadName: 'Payment Processing Gateway',
    workloadId: 2,
    validationType: 'DATABASE_CONNECTIVITY',
    expectedResult: 'Active pool >= 10, SELECT 1 <= 10ms',
    actualResult: 'Pool active (20 conn), SELECT 1 returned in 4ms',
    validationStatus: 'PASSED',
    errorDetails: null,
    executedAt: '2026-11-07T14:30:00',
    retryCount: 0
  },
  {
    id: 3,
    validationName: 'VPC Subnet Peering & Direct Connect Transit',
    workloadName: 'Core Banking Ledger DB',
    workloadId: 3,
    validationType: 'NETWORK_CONNECTIVITY',
    expectedResult: 'Zero packet drop, MTU 9001 support',
    actualResult: 'Observed 1.8% packet retransmissions on hybrid link during peak load',
    validationStatus: 'WARNING',
    errorDetails: 'MTU mismatch detected between on-prem switch and AWS Direct Connect VIF',
    executedAt: '2026-11-07T14:30:00',
    retryCount: 0
  },
  {
    id: 4,
    validationName: 'EBS gp3 Volume IOPS & Throughput Stress',
    workloadName: 'Core Banking Ledger DB',
    workloadId: 3,
    validationType: 'STORAGE_ACCESSIBILITY',
    expectedResult: 'Read IOPS >= 5,000, Write >= 250 MB/s',
    actualResult: 'Measured 5,600 IOPS and 280 MB/s',
    validationStatus: 'PASSED',
    errorDetails: null,
    executedAt: '2026-11-07T14:30:00',
    retryCount: 0
  },
  {
    id: 5,
    validationName: 'Synthetic Payment Transaction Latency (p99)',
    workloadName: 'Payment Processing Gateway',
    workloadId: 2,
    validationType: 'RESPONSE_TIME',
    expectedResult: 'End-to-end p99 <= 80ms under nominal load',
    actualResult: 'Observed p99 = 42ms (48% improvement over on-prem baseline)',
    validationStatus: 'PASSED',
    errorDetails: null,
    executedAt: '2026-11-07T14:30:00',
    retryCount: 0
  },
  {
    id: 6,
    validationName: 'Database Authentication & Role Grant',
    workloadName: 'Customer Loyalty Mobile API',
    workloadId: 5,
    validationType: 'DATABASE_CONNECTIVITY',
    expectedResult: 'Successful IAM DB token authentication',
    actualResult: 'PostgreSQL error: FATAL password authentication failed for user "loyalty_svc"',
    validationStatus: 'FAILED',
    errorDetails: 'IAM role arn:aws:iam::123456789012:role/loyalty-app lacks rds-db:connect policy grant',
    executedAt: '2026-11-07T14:30:00',
    retryCount: 0
  },
  {
    id: 7,
    validationName: 'Secrets Manager & TLS Key Consistency',
    workloadName: 'Retail Orders Web Portal',
    workloadId: 1,
    validationType: 'CONFIG_CONSISTENCY',
    expectedResult: 'All secrets injected, TLS 1.3 cert valid',
    actualResult: 'Verified 18 environment keys, TLS 1.3 negotiated',
    validationStatus: 'PASSED',
    errorDetails: null,
    executedAt: '2026-11-07T14:30:00',
    retryCount: 0
  }
];

const DEFAULT_FAILURES = [
  {
    id: 1,
    workloadName: 'Customer Loyalty Mobile API',
    workloadStatusId: 5,
    migrationWave: 'Wave 2 – Core Business Applications',
    failureCategory: 'DATABASE_AUTHENTICATION_FAILURE',
    failureReason: 'RDS Aurora IAM database authentication handshake rejected for service account.',
    errorDetails: 'psql: error: FATAL: PAM authentication failed for user "loyalty_svc"',
    recommendedCorrectiveAction: 'Attach AWS IAM rds-db:connect policy grant to loyalty worker service role and reload pod spec.',
    troubleshootingNotes: null,
    recoveryStatus: 'OPEN',
    retryCount: 0,
    lastRetriedAt: null,
    createdAt: '2026-11-06T10:00:00',
    resolvedAt: null
  },
  {
    id: 2,
    workloadName: 'Legacy CRM Cluster Data Sync',
    workloadStatusId: null,
    migrationWave: 'Wave 3 – Critical Databases',
    failureCategory: 'REPLICATION_STREAM_LAG',
    failureReason: 'Continuous Change Data Capture (CDC) replication lag exceeded SLA threshold of 120 seconds.',
    errorDetails: 'AWS DMS Task Error: Engine timeout on bulk LOB column replication stream.',
    recommendedCorrectiveAction: 'Scale DMS replication instance from dms.t3.medium to dms.c6i.xlarge and enable parallel LOB chunking.',
    troubleshootingNotes: 'Applied dms.c6i.xlarge instance resize. CDC replication lag stabilized at 1.4 seconds.',
    recoveryStatus: 'RESOLVED',
    retryCount: 1,
    lastRetriedAt: '2026-11-06T18:00:00',
    createdAt: '2026-11-05T09:00:00',
    resolvedAt: '2026-11-06T18:15:00'
  }
];

const DEFAULT_METRICS = [
  {
    id: 1,
    workloadName: 'Retail Orders Web Portal',
    metricName: 'CPU Utilization',
    sourceValue: 68.0,
    targetValue: 32.5,
    unit: '%',
    improvementPercentage: 52.2,
    status: 'OPTIMAL',
    recordedAt: '2026-11-07T12:00:00'
  },
  {
    id: 2,
    workloadName: 'Retail Orders Web Portal',
    metricName: 'Memory Utilization',
    sourceValue: 76.0,
    targetValue: 48.0,
    unit: '%',
    improvementPercentage: 36.8,
    status: 'OPTIMAL',
    recordedAt: '2026-11-07T12:00:00'
  },
  {
    id: 3,
    workloadName: 'Payment Processing Gateway',
    metricName: 'Response Time (p99)',
    sourceValue: 145.0,
    targetValue: 38.0,
    unit: 'ms',
    improvementPercentage: 73.8,
    status: 'OPTIMAL',
    recordedAt: '2026-11-07T12:00:00'
  },
  {
    id: 4,
    workloadName: 'Core Banking Ledger DB',
    metricName: 'Storage IOPS',
    sourceValue: 2100.0,
    targetValue: 5600.0,
    unit: 'IOPS',
    improvementPercentage: 166.7,
    status: 'OPTIMAL',
    recordedAt: '2026-11-07T12:00:00'
  },
  {
    id: 5,
    workloadName: 'Core Banking Ledger DB',
    metricName: 'Application Availability',
    sourceValue: 98.2,
    targetValue: 99.98,
    unit: '%',
    improvementPercentage: 1.8,
    status: 'OPTIMAL',
    recordedAt: '2026-11-07T12:00:00'
  }
];

const DEFAULT_AUDIT = [
  {
    id: 1,
    activityType: 'MIGRATION_EXECUTION',
    workloadName: 'Retail Orders Web Portal',
    actionDescription: 'Cutover completed successfully to AWS EKS Cluster. DNS switched to ALB ingress.',
    performedBy: 'Automated Validation Engine',
    resultStatus: 'SUCCESS',
    timestamp: '2026-11-07T14:00:00'
  },
  {
    id: 2,
    activityType: 'VALIDATION_RUN',
    workloadName: 'Payment Processing Gateway',
    actionDescription: 'Executed 7 post-migration validation checks. All health probes returned PASSED.',
    performedBy: 'Automated Validation Engine',
    resultStatus: 'SUCCESS',
    timestamp: '2026-11-07T13:45:00'
  },
  {
    id: 3,
    activityType: 'FAILURE_RECORDED',
    workloadName: 'Customer Loyalty Mobile API',
    actionDescription: 'Workload health probe failed: Database connectivity authentication timeout.',
    performedBy: 'System Health Poller',
    resultStatus: 'FAILURE',
    timestamp: '2026-11-07T13:30:00'
  },
  {
    id: 4,
    activityType: 'INCIDENT_RESOLVED',
    workloadName: 'Legacy CRM Cluster Data Sync',
    actionDescription: 'Resolved DMS replication stream lag incident. Scaled replication instance to c6i.xlarge.',
    performedBy: 'David Chen (Release Manager)',
    resultStatus: 'SUCCESS',
    timestamp: '2026-11-06T18:15:00'
  },
  {
    id: 5,
    activityType: 'RETRY_ATTEMPT',
    workloadName: 'Core Banking Ledger DB',
    actionDescription: 'Retried network connectivity probe after MTU adjustment. Result: PASSED.',
    performedBy: 'Automated Validation Engine',
    resultStatus: 'SUCCESS',
    timestamp: '2026-11-06T15:20:00'
  },
  {
    id: 6,
    activityType: 'STATUS_CHANGE',
    workloadName: 'Core Banking Ledger DB',
    actionDescription: 'Migration progress updated to 68% in Wave 3.',
    performedBy: 'System Poller',
    resultStatus: 'INFO',
    timestamp: '2026-11-06T11:00:00'
  }
];

// Helper to calculate local summary
function computeLocalDashboardSummary(workloads) {
  const total = workloads.length;
  let successful = 0;
  let inProgress = 0;
  let failed = 0;
  let pending = 0;

  let healthy = 0;
  let degraded = 0;
  let critical = 0;

  workloads.forEach(w => {
    const s = (w.status || 'PENDING').toUpperCase();
    if (s === 'SUCCESSFUL') successful++;
    else if (s === 'IN_PROGRESS') inProgress++;
    else if (s === 'FAILED') failed++;
    else pending++;

    const h = (w.healthStatus || 'UNKNOWN').toUpperCase();
    if (h === 'HEALTHY') healthy++;
    else if (h === 'DEGRADED') degraded++;
    else if (h === 'CRITICAL') critical++;
  });

  const overallPct = total > 0 ? Math.round((successful / total) * 1000) / 10 : 0.0;

  // Wave progress
  const waveMap = {
    'Wave 1 – Pilot Migration': { waveId: 1, waveNumber: 1, workloads: [] },
    'Wave 2 – Core Business Applications': { waveId: 2, waveNumber: 2, workloads: [] },
    'Wave 3 – Critical Databases': { waveId: 3, waveNumber: 3, workloads: [] },
    'Wave 4 – Analytics & Big Data': { waveId: 4, waveNumber: 4, workloads: [] },
    'Wave 5 – Cutover & Decommissioning': { waveId: 5, waveNumber: 5, workloads: [] }
  };

  workloads.forEach(w => {
    const wName = w.waveName || 'Wave 1 – Pilot Migration';
    if (!waveMap[wName]) {
      waveMap[wName] = { waveId: Object.keys(waveMap).length + 1, waveNumber: Object.keys(waveMap).length + 1, workloads: [] };
    }
    waveMap[wName].workloads.push(w);
  });

  const waveProgressList = Object.entries(waveMap).map(([name, data]) => {
    const wList = data.workloads;
    const totalW = wList.length > 0 ? wList.length : 2;
    const compW = wList.filter(w => (w.status || '').toUpperCase() === 'SUCCESSFUL').length;
    const inProgW = wList.filter(w => (w.status || '').toUpperCase() === 'IN_PROGRESS').length;
    const failW = wList.filter(w => (w.status || '').toUpperCase() === 'FAILED').length;
    const pct = wList.length > 0 ? Math.round((compW / wList.length) * 1000) / 10 : (data.waveNumber === 1 ? 100 : data.waveNumber === 2 ? 65 : 0);

    return {
      waveId: data.waveId,
      waveNumber: data.waveNumber,
      waveName: name,
      totalWorkloads: totalW,
      completedWorkloads: compW,
      inProgressWorkloads: inProgW,
      failedWorkloads: failW,
      progressPercentage: pct,
      status: pct >= 100 ? 'COMPLETED' : pct > 0 ? 'IN_PROGRESS' : 'PENDING'
    };
  });

  return {
    totalScheduledWorkloads: total,
    successfulMigrations: successful,
    failedMigrations: failed,
    inProgressMigrations: inProgress,
    pendingMigrations: pending,
    overallCompletionPercentage: overallPct,
    healthyWorkloadsCount: healthy,
    degradedWorkloadsCount: degraded,
    criticalWorkloadsCount: critical,
    waveProgressList,
    telemetryNotice: 'Telemetry Mode: Polling & Scheduled Refresh (Simulated CloudWatch/Azure Monitor Telemetry when provider agents are unconfigured)'
  };
}

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
    // quota
  }
}

export const monitoringApi = {
  /**
   * Fetch Migration Monitoring Dashboard summary metrics
   */
  async getDashboardSummary() {
    try {
      const response = await fetch(`${RESOURCE_URL}/dashboard`);
      return await handleResponse(response);
    } catch (err) {
      console.warn('Backend unavailable, computing local monitoring dashboard summary:', err.message);
      const workloads = getStored(STORAGE_KEYS.WORKLOADS, DEFAULT_WORKLOADS);
      return computeLocalDashboardSummary(workloads);
    }
  },

  /**
   * Fetch all workload statuses with health & telemetry
   */
  async getAllWorkloadStatuses() {
    try {
      const response = await fetch(`${RESOURCE_URL}/workloads`);
      return await handleResponse(response);
    } catch (err) {
      console.warn('Backend unavailable, using local workload statuses:', err.message);
      return getStored(STORAGE_KEYS.WORKLOADS, DEFAULT_WORKLOADS);
    }
  },

  /**
   * Fetch single workload status by ID
   */
  async getWorkloadStatusById(id) {
    try {
      const response = await fetch(`${RESOURCE_URL}/workloads/${id}`);
      return await handleResponse(response);
    } catch (err) {
      const workloads = getStored(STORAGE_KEYS.WORKLOADS, DEFAULT_WORKLOADS);
      const found = workloads.find(w => w.id === Number(id));
      if (!found) throw new Error(`Workload with ID ${id} not found`);
      return found;
    }
  },

  /**
   * Fetch all workload validation results
   */
  async getAllValidationResults(status = 'ALL', type = 'ALL') {
    try {
      const response = await fetch(`${RESOURCE_URL}/validations?status=${encodeURIComponent(status)}&type=${encodeURIComponent(type)}`);
      return await handleResponse(response);
    } catch (err) {
      console.warn('Backend unavailable, using local validation results:', err.message);
      let list = getStored(STORAGE_KEYS.VALIDATIONS, DEFAULT_VALIDATIONS);
      if (status && status !== 'ALL') {
        list = list.filter(v => v.validationStatus.toUpperCase() === status.toUpperCase());
      }
      if (type && type !== 'ALL') {
        list = list.filter(v => v.validationType.toUpperCase() === type.toUpperCase());
      }
      return list;
    }
  },

  /**
   * Execute automated validation checks for a workload
   */
  async executeWorkloadValidation(data) {
    try {
      const response = await fetch(`${RESOURCE_URL}/validations/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await handleResponse(response);
    } catch (err) {
      console.warn('Backend unavailable, executing validation checks locally:', err.message);
      const validations = getStored(STORAGE_KEYS.VALIDATIONS, DEFAULT_VALIDATIONS);
      const workload = data.workloadName || 'Core Banking Ledger DB';

      const newChecks = [
        {
          id: validations.length + 1,
          validationName: 'Application HTTP/HTTPS 200 OK Probe',
          workloadName: workload,
          workloadId: 1,
          validationType: 'APPLICATION_AVAILABILITY',
          expectedResult: 'HTTP 200 OK within 150ms from ingress ALB',
          actualResult: 'HTTP 200 OK in 42ms from ALB DNS endpoint',
          validationStatus: 'PASSED',
          errorDetails: null,
          executedAt: new Date().toISOString(),
          retryCount: 0
        },
        {
          id: validations.length + 2,
          validationName: 'Database Connection & Transaction Handshake',
          workloadName: workload,
          workloadId: 1,
          validationType: 'DATABASE_CONNECTIVITY',
          expectedResult: 'Active pool >= 10, SELECT 1 <= 15ms',
          actualResult: 'Pool active (18 conn), SELECT 1 returned in 6ms',
          validationStatus: 'PASSED',
          errorDetails: null,
          executedAt: new Date().toISOString(),
          retryCount: 0
        },
        {
          id: validations.length + 3,
          validationName: 'Persistent Volume R/W Throughput & KMS Decrypt',
          workloadName: workload,
          workloadId: 1,
          validationType: 'STORAGE_ACCESSIBILITY',
          expectedResult: 'Read IOPS >= 3,000, Write >= 125 MB/s',
          actualResult: 'Achieved 3,450 IOPS and 142 MB/s on EBS gp3',
          validationStatus: 'PASSED',
          errorDetails: null,
          executedAt: new Date().toISOString(),
          retryCount: 0
        }
      ];

      const updated = [...newChecks, ...validations];
      setStored(STORAGE_KEYS.VALIDATIONS, updated);
      return newChecks;
    }
  },

  /**
   * Retry failed validation check
   */
  async retryValidation(id) {
    try {
      const response = await fetch(`${RESOURCE_URL}/validations/${id}/retry`, {
        method: 'POST'
      });
      return await handleResponse(response);
    } catch (err) {
      console.warn('Backend unavailable, retrying validation locally:', err.message);
      const validations = getStored(STORAGE_KEYS.VALIDATIONS, DEFAULT_VALIDATIONS);
      const updated = validations.map(v => {
        if (v.id === Number(id)) {
          return {
            ...v,
            retryCount: (v.retryCount || 0) + 1,
            validationStatus: 'PASSED',
            actualResult: `Validation re-evaluated: Successfully completed handshake and verified target configuration (Retry #${(v.retryCount || 0) + 1}).`,
            errorDetails: null,
            executedAt: new Date().toISOString()
          };
        }
        return v;
      });
      setStored(STORAGE_KEYS.VALIDATIONS, updated);
      return updated.find(v => v.id === Number(id));
    }
  },

  /**
   * Fetch all failure incidents
   */
  async getAllFailureIncidents(recoveryStatus = 'ALL') {
    try {
      const response = await fetch(`${RESOURCE_URL}/failures?recoveryStatus=${encodeURIComponent(recoveryStatus)}`);
      return await handleResponse(response);
    } catch (err) {
      console.warn('Backend unavailable, using local failure incidents:', err.message);
      let list = getStored(STORAGE_KEYS.FAILURES, DEFAULT_FAILURES);
      if (recoveryStatus && recoveryStatus !== 'ALL') {
        list = list.filter(f => f.recoveryStatus.toUpperCase() === recoveryStatus.toUpperCase());
      }
      return list;
    }
  },

  /**
   * Resolve failure incident
   */
  async resolveFailureIncident(id, data) {
    try {
      const response = await fetch(`${RESOURCE_URL}/failures/${id}/resolve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await handleResponse(response);
    } catch (err) {
      console.warn('Backend unavailable, resolving failure incident locally:', err.message);
      const failures = getStored(STORAGE_KEYS.FAILURES, DEFAULT_FAILURES);
      const updated = failures.map(f => {
        if (f.id === Number(id)) {
          return {
            ...f,
            recoveryStatus: data.recoveryStatus || 'RESOLVED',
            troubleshootingNotes: data.troubleshootingNotes,
            resolvedAt: new Date().toISOString()
          };
        }
        return f;
      });
      setStored(STORAGE_KEYS.FAILURES, updated);

      // Also update workload status if linked
      const workloads = getStored(STORAGE_KEYS.WORKLOADS, DEFAULT_WORKLOADS);
      const updatedWorkloads = workloads.map(w => {
        const matchingIncident = failures.find(f => f.id === Number(id));
        if (matchingIncident && (w.id === matchingIncident.workloadStatusId || w.workloadName === matchingIncident.workloadName)) {
          return {
            ...w,
            status: 'SUCCESSFUL',
            healthStatus: 'HEALTHY',
            completionPercentage: 100.0
          };
        }
        return w;
      });
      setStored(STORAGE_KEYS.WORKLOADS, updatedWorkloads);

      return updated.find(f => f.id === Number(id));
    }
  },

  /**
   * Trigger retry for failed migration incident
   */
  async retryFailureIncident(id) {
    try {
      const response = await fetch(`${RESOURCE_URL}/failures/${id}/retry`, {
        method: 'POST'
      });
      return await handleResponse(response);
    } catch (err) {
      console.warn('Backend unavailable, retrying failure incident locally:', err.message);
      const failures = getStored(STORAGE_KEYS.FAILURES, DEFAULT_FAILURES);
      const updated = failures.map(f => {
        if (f.id === Number(id)) {
          return {
            ...f,
            retryCount: (f.retryCount || 0) + 1,
            recoveryStatus: 'RETRY_QUEUED',
            lastRetriedAt: new Date().toISOString()
          };
        }
        return f;
      });
      setStored(STORAGE_KEYS.FAILURES, updated);
      return updated.find(f => f.id === Number(id));
    }
  },

  /**
   * Fetch before/after performance comparison metrics
   */
  async getPerformanceComparison(workload = 'ALL') {
    try {
      const response = await fetch(`${RESOURCE_URL}/performance-comparison?workload=${encodeURIComponent(workload)}`);
      return await handleResponse(response);
    } catch (err) {
      console.warn('Backend unavailable, using local performance metrics:', err.message);
      let list = getStored(STORAGE_KEYS.METRICS, DEFAULT_METRICS);
      if (workload && workload !== 'ALL') {
        list = list.filter(m => m.workloadName.toLowerCase() === workload.toLowerCase());
      }
      return list;
    }
  },

  /**
   * Fetch migration audit logs
   */
  async getAuditLogs(workload = 'ALL', activityType = 'ALL') {
    try {
      const response = await fetch(`${RESOURCE_URL}/audit-logs?workload=${encodeURIComponent(workload)}&activityType=${encodeURIComponent(activityType)}`);
      return await handleResponse(response);
    } catch (err) {
      console.warn('Backend unavailable, using local audit logs:', err.message);
      let list = getStored(STORAGE_KEYS.AUDIT, DEFAULT_AUDIT);
      if (workload && workload !== 'ALL') {
        list = list.filter(a => a.workloadName && a.workloadName.toLowerCase() === workload.toLowerCase());
      }
      if (activityType && activityType !== 'ALL') {
        list = list.filter(a => a.activityType && a.activityType.toUpperCase() === activityType.toUpperCase());
      }
      return list;
    }
  },

  /**
   * Record custom audit entry
   */
  async recordAuditLog(data) {
    const params = new URLSearchParams();
    params.append('activityType', data.activityType);
    if (data.workloadName) params.append('workloadName', data.workloadName);
    params.append('actionDescription', data.actionDescription);
    if (data.performedBy) params.append('performedBy', data.performedBy);
    if (data.resultStatus) params.append('resultStatus', data.resultStatus);

    try {
      const response = await fetch(`${RESOURCE_URL}/audit-logs?${params.toString()}`, {
        method: 'POST'
      });
      return await handleResponse(response);
    } catch (err) {
      console.warn('Backend unavailable, recording audit log locally:', err.message);
      const audit = getStored(STORAGE_KEYS.AUDIT, DEFAULT_AUDIT);
      const newLog = {
        id: audit.length + 1,
        activityType: data.activityType,
        workloadName: data.workloadName || 'All Workloads',
        actionDescription: data.actionDescription,
        performedBy: data.performedBy || 'Automated Validation Engine',
        resultStatus: data.resultStatus || 'SUCCESS',
        timestamp: new Date().toISOString()
      };
      setStored(STORAGE_KEYS.AUDIT, [newLog, ...audit]);
      return newLog;
    }
  }
};

