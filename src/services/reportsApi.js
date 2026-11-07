/**
 * CloudSage - MigrateMind
 * Enterprise Cloud Migration Reporting & Documentation REST API Client
 * Connects React frontend to Spring Boot backend (/api/reports)
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const RESOURCE_URL = `${API_BASE_URL}/api/reports`;

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

const STORAGE_KEYS = {
  REPORTS: 'cloudsage_migration_reports',
  STATS: 'cloudsage_project_stats'
};

const DEFAULT_REPORTS = [
  {
    id: 1,
    reportTitle: 'Executive Cloud Migration Business Case & TCO Assessment',
    reportType: 'EXECUTIVE_SUMMARY',
    organizationName: 'Acme Retail Enterprise & Global Financial Services',
    selectedCloudProvider: 'AWS',
    version: 'v2.4 Final',
    author: 'Sai Kumar, Lead Cloud Architect (HCLTech)',
    reviewer: 'Marcus Vance, Enterprise VP Infrastructure (Acme Retail)',
    approvalStatus: 'APPROVED',
    generatedAt: '2026-11-05T10:00:00',
    fileSizeKb: 128
  },
  {
    id: 2,
    reportTitle: 'Technical Discovery & Cloud Target Architecture Blueprint',
    reportType: 'TECHNICAL_ARCHITECTURE',
    organizationName: 'Acme Retail Enterprise & Global Financial Services',
    selectedCloudProvider: 'AWS',
    version: 'v2.1',
    author: 'HCLTech Cloud Native Advisory & CloudSage Engine',
    reviewer: 'Security Architecture Review Board',
    approvalStatus: 'APPROVED',
    generatedAt: '2026-10-28T14:30:00',
    fileSizeKb: 196
  },
  {
    id: 3,
    reportTitle: 'FinOps Cost Estimation & 5-Year Cloud Financial Dossier',
    reportType: 'FINOPS_COST_ANALYSIS',
    organizationName: 'Acme Retail Enterprise & Global Financial Services',
    selectedCloudProvider: 'AWS',
    version: 'v1.8',
    author: 'CloudSage FinOps Engine',
    reviewer: 'Finance & Procurement Governance Board',
    approvalStatus: 'APPROVED',
    generatedAt: '2026-11-02T09:15:00',
    fileSizeKb: 145
  },
  {
    id: 4,
    reportTitle: 'Enterprise Migration Security, Risk & Compliance Dossier',
    reportType: 'SECURITY_COMPLIANCE',
    organizationName: 'Acme Retail Enterprise & Global Financial Services',
    selectedCloudProvider: 'AWS',
    version: 'v2.0',
    author: 'Cloud Security Architecture Lead',
    reviewer: 'Chief Information Security Officer (CISO)',
    approvalStatus: 'APPROVED',
    generatedAt: '2026-11-04T16:00:00',
    fileSizeKb: 164
  },
  {
    id: 5,
    reportTitle: 'Complete Enterprise Cloud Modernization Master Blueprint',
    reportType: 'COMPLETE_ENTERPRISE',
    organizationName: 'Acme Retail Enterprise & Global Financial Services',
    selectedCloudProvider: 'AWS',
    version: 'v3.0 Master Release',
    author: 'CloudSage MigrateMind Multi-Stage Synthesis Engine',
    reviewer: 'Board of Directors & Executive Steering Committee',
    approvalStatus: 'APPROVED',
    generatedAt: '2026-11-07T12:00:00',
    fileSizeKb: 312
  }
];

const DEFAULT_PROJECT_STATS = {
  projectName: 'Enterprise Banking & Digital Commerce Migration',
  clientName: 'Acme Retail Group & Global Financial Services',
  selectedProvider: 'AWS',
  totalServersCount: 48,
  totalCpuCores: 192,
  totalRamGB: 768,
  totalStorageGB: 12400,
  totalDatabasesCount: 14,
  totalWorkloadsAssessed: 36,
  rehostCount: 16,
  replatformCount: 12,
  refactorCount: 5,
  repurchaseCount: 3,
  retireCount: 2,
  retainCount: 2,
  architectureReady: true,
  targetVpcCidr: '10.100.0.0/16',
  primaryComputePlatform: 'Amazon EKS (Kubernetes v1.30)',
  primaryDatabasePlatform: 'Amazon Aurora PostgreSQL Multi-AZ',
  onPremisesMonthlyCost: 19800.0,
  estimatedCloudMonthlyCost: 12250.0,
  estimatedAnnualSavings: 90600.0,
  savingsPercentage: 38.1,
  fiveYearRoiPercentage: 185.4,
  paybackPeriodMonths: 7.2,
  totalWaves: 5,
  totalTasks: 15,
  migrationProgressPercentage: 46.7,
  plannedDuration: '24 Weeks (6 Months)',
  totalRisksIdentified: 6,
  criticalRisksCount: 2,
  highRisksCount: 1,
  complianceReadinessPercentage: 91.7,
  passedSecurityControlsCount: 7,
  totalSecurityControlsCount: 9,
  passedValidationsCount: 6,
  failedValidationsCount: 1,
  activeFailureIncidentsCount: 1,
  overallMigrationHealth: 'HEALTHY',
  overallProjectReadinessScore: 88.5
};

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

export const reportsApi = {
  /**
   * Fetch final consolidated project dashboard statistics across all 10 stages
   */
  async getProjectStatistics() {
    try {
      const response = await fetch(`${RESOURCE_URL}/project-statistics`);
      return await handleResponse(response);
    } catch (err) {
      console.warn('Backend unavailable, using local project statistics:', err.message);
      return getStored(STORAGE_KEYS.STATS, DEFAULT_PROJECT_STATS);
    }
  },

  /**
   * Fetch live executive summary
   */
  async getExecutiveSummary(provider = 'AWS') {
    try {
      const response = await fetch(`${RESOURCE_URL}/executive-summary?provider=${encodeURIComponent(provider)}`);
      return await handleResponse(response);
    } catch (err) {
      console.warn('Backend unavailable, generating local executive summary:', err.message);
      const stats = getStored(STORAGE_KEYS.STATS, DEFAULT_PROJECT_STATS);
      return {
        projectName: stats.projectName,
        organizationName: stats.clientName,
        selectedCloudProvider: provider,
        totalResourcesAssessed: stats.totalServersCount + stats.totalDatabasesCount,
        totalWorkloadsCount: stats.totalWorkloadsAssessed,
        migrationStrategyDistribution: {
          Rehost: stats.rehostCount,
          Replatform: stats.replatformCount,
          Refactor: stats.refactorCount,
          Repurchase: stats.repurchaseCount,
          Retire: stats.retireCount,
          Retain: stats.retainCount
        },
        estimatedMonthlyCost: stats.estimatedCloudMonthlyCost,
        estimatedAnnualCost: stats.estimatedCloudMonthlyCost * 12,
        estimatedAnnualSavings: stats.estimatedAnnualSavings,
        migrationTimelineDuration: stats.plannedDuration,
        migrationCompletionPercentage: stats.migrationProgressPercentage,
        overallMigrationHealth: stats.overallMigrationHealth,
        majorRisks: [
          'Oracle Exadata schema conversion complexity and legacy PL/SQL stored procedures in Core Banking.',
          'Real-time Payment Gateway hybrid cutover latency across Direct Connect / ExpressRoute interconnects.',
          'Regulatory compliance boundary constraints under GDPR Article 44 requiring strict EU data residency.'
        ],
        executiveRecommendations: [
          'Proceed with Wave 2 execution prioritizing containerized microservices to Amazon EKS.',
          'Leverage AWS SCT (Schema Conversion Tool) to convert 82% of legacy database objects automatically.',
          'Enforce 3-Year Committed Use Savings Plans to capture maximum 42% cloud infrastructure discounts.',
          'Maintain continuous static security gates via tfsec and CIS benchmark automated monitoring.'
        ],
        generatedDate: new Date().toISOString().slice(0, 10)
      };
    }
  },

  /**
   * Fetch complete enterprise migration report
   */
  async getCompleteMigrationReport(provider = 'AWS') {
    try {
      const response = await fetch(`${RESOURCE_URL}/complete?provider=${encodeURIComponent(provider)}`);
      return await handleResponse(response);
    } catch (err) {
      console.warn('Backend unavailable, compiling local complete migration report:', err.message);
      const stats = getStored(STORAGE_KEYS.STATS, DEFAULT_PROJECT_STATS);
      const exec = await this.getExecutiveSummary(provider);

      return {
        id: 1,
        reportTitle: 'Enterprise Cloud Modernization & Migration Master Blueprint',
        reportType: 'COMPLETE_ENTERPRISE',
        organizationName: stats.clientName,
        selectedCloudProvider: provider,
        version: 'v3.0 Master Release',
        author: 'CloudSage MigrateMind Automated Engine & HCLTech CoE',
        reviewer: 'Enterprise Steering Committee & Cloud Governance Board',
        approvalStatus: 'APPROVED',
        generatedAt: new Date().toISOString().slice(0, 10),
        executiveSummary: exec,
        infrastructureSection: {
          totalServers: stats.totalServersCount,
          totalCpuCores: stats.totalCpuCores,
          totalRamGB: stats.totalRamGB,
          totalStorageGB: stats.totalStorageGB,
          totalDatabases: stats.totalDatabasesCount,
          operatingSystems: ['Red Hat Enterprise Linux 8.8', 'Ubuntu 22.04 LTS', 'Windows Server 2019']
        },
        strategySection: {
          totalAssessed: stats.totalWorkloadsAssessed,
          strategyDistribution: exec.migrationStrategyDistribution,
          readinessIndex: `${stats.overallProjectReadinessScore}%`
        },
        architectureSection: {
          selectedProvider: provider,
          targetVpcCidr: stats.targetVpcCidr,
          computePlatform: stats.primaryComputePlatform,
          databasePlatform: stats.primaryDatabasePlatform,
          networkingDesign: 'Multi-AZ Hub & Spoke with Transit Gateway & Private Subnets'
        },
        costSection: {
          onPremisesMonthly: stats.onPremisesMonthlyCost,
          cloudMonthly: stats.estimatedCloudMonthlyCost,
          annualSavings: stats.estimatedAnnualSavings,
          savingsPercentage: `${stats.savingsPercentage}%`,
          fiveYearRoi: `${stats.fiveYearRoiPercentage}%`,
          paybackMonths: `${stats.paybackPeriodMonths} Months`,
          pricingAssumptions: 'Calculated based on 3-Year Committed Use with Multi-AZ redundancy'
        },
        executionSection: {
          totalWaves: stats.totalWaves,
          totalTasks: stats.totalTasks,
          plannedDuration: stats.plannedDuration,
          progressPercentage: `${stats.migrationProgressPercentage}%`
        },
        securitySection: {
          totalRisks: stats.totalRisksIdentified,
          criticalRisks: stats.criticalRisksCount,
          highRisks: stats.highRisksCount,
          complianceScore: `${stats.complianceReadinessPercentage}%`,
          frameworksAudited: ['GDPR', 'ISO 27001', 'SOC 2', 'HIPAA']
        },
        validationSection: {
          passedProbes: stats.passedValidationsCount,
          failedProbes: stats.failedValidationsCount,
          telemetryMode: 'Polling & Scheduled Refresh (Simulated Provider Telemetry)'
        },
        statutoryDisclaimer: 'Notice: This documentation and assessment report constitutes technical migration guidance and does not provide official regulatory certification or legal compliance validation.'
      };
    }
  },

  /**
   * Fetch report history list
   */
  async getReportHistory() {
    try {
      const response = await fetch(`${RESOURCE_URL}/history`);
      return await handleResponse(response);
    } catch (err) {
      console.warn('Backend unavailable, using local report history:', err.message);
      return getStored(STORAGE_KEYS.REPORTS, DEFAULT_REPORTS);
    }
  },

  /**
   * Fetch single report by ID
   */
  async getReportById(id) {
    try {
      const response = await fetch(`${RESOURCE_URL}/${id}`);
      return await handleResponse(response);
    } catch (err) {
      return this.getCompleteMigrationReport('AWS');
    }
  },

  /**
   * Generate and persist a new report
   */
  async generateReport(data) {
    try {
      const response = await fetch(`${RESOURCE_URL}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await handleResponse(response);
    } catch (err) {
      console.warn('Backend unavailable, saving report locally:', err.message);
      const reports = getStored(STORAGE_KEYS.REPORTS, DEFAULT_REPORTS);
      const newReport = {
        id: reports.length + 1,
        reportTitle: data.reportTitle,
        reportType: data.reportType,
        organizationName: data.organizationName || 'Acme Retail Enterprise',
        selectedCloudProvider: data.selectedCloudProvider || 'AWS',
        version: data.version || 'v2.4 Final',
        author: data.author || 'CloudSage MigrateMind Automated Engine',
        reviewer: data.reviewer || 'Enterprise Steering Committee',
        approvalStatus: 'APPROVED',
        generatedAt: new Date().toISOString(),
        fileSizeKb: 148
      };
      setStored(STORAGE_KEYS.REPORTS, [newReport, ...reports]);
      return newReport;
    }
  },

  /**
   * Delete report by ID
   */
  async deleteReport(id) {
    try {
      const response = await fetch(`${RESOURCE_URL}/${id}`, {
        method: 'DELETE'
      });
      return await handleResponse(response);
    } catch (err) {
      console.warn('Backend unavailable, deleting report locally:', err.message);
      const reports = getStored(STORAGE_KEYS.REPORTS, DEFAULT_REPORTS);
      setStored(STORAGE_KEYS.REPORTS, reports.filter(r => r.id !== Number(id)));
      return null;
    }
  },

  /**
   * Download Genuine PDF Report
   */
  async downloadPdf(id = 1, title = 'CloudSage_Migration_Report') {
    try {
      const response = await fetch(`${RESOURCE_URL}/${id}/pdf`);
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title.replace(/\s+/g, '_')}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        return true;
      }
    } catch (e) {
      console.warn('Backend PDF endpoint error, using browser print dialog:', e.message);
    }
    window.print();
    return true;
  },

  /**
   * Download Structured CSV Data
   */
  async downloadCsv(id = 1, title = 'CloudSage_Migration_Data') {
    try {
      const response = await fetch(`${RESOURCE_URL}/${id}/csv`);
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title.replace(/\s+/g, '_')}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        return true;
      }
    } catch (e) {
      console.warn('Backend CSV endpoint error, generating client CSV:', e.message);
    }

    // Local client CSV fallback
    const stats = getStored(STORAGE_KEYS.STATS, DEFAULT_PROJECT_STATS);
    const rows = [
      ['Section', 'Metric Name', 'Value', 'Unit'],
      ['Executive', 'Project Name', stats.projectName, 'Text'],
      ['Executive', 'Readiness Score', stats.overallProjectReadinessScore, '%'],
      ['Infrastructure', 'Total Servers', stats.totalServersCount, 'Count'],
      ['Infrastructure', 'Total CPU Cores', stats.totalCpuCores, 'Cores'],
      ['Strategy', 'Assessed Workloads', stats.totalWorkloadsAssessed, 'Count'],
      ['FinOps', 'Annual Savings', stats.estimatedAnnualSavings, 'USD'],
      ['Security', 'Compliance Readiness', stats.complianceReadinessPercentage, '%'],
      ['Execution', 'Migration Progress', stats.migrationProgressPercentage, '%']
    ];
    const csvContent = rows.map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return true;
  }
};

