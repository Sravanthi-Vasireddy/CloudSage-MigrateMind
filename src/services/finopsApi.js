/**
 * CloudSage - MigrateMind
 * FinOps Cost Analysis & Cloud Cost Estimator REST API Client
 * Connects React frontend to Java Spring Boot backend (/api/finops)
 */

import {
  mockFinOpsOverview,
  mockMonthlyCostTrend,
  mockServiceCostBreakdown,
  mockRightSizingRecommendations
} from '../data/mockFinOps';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const RESOURCE_URL = `${API_BASE_URL}/api/finops`;

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

// Local simulation fallback engine for offline or standalone demo mode
function calculateLocalEstimate(params) {
  const provider = (params.provider || 'AWS').toUpperCase();
  const pricingModel = params.pricingModel || 'THREE_YEAR_COMMITTED';
  const cpuCores = params.totalCpuCores || 40;
  const ramGB = params.totalRamGB || 224;
  const storageGB = params.totalStorageGB || 1950;
  const hours = params.operatingHoursPerMonth || 730;
  const storageType = params.storageType || 'STANDARD_SSD';
  const isMultiAz = params.isMultiAzDatabase !== undefined ? params.isMultiAzDatabase : true;
  const egressGB = params.networkEgressGB || 500;

  let cpuRate = 0.0416;
  let ramRate = 0.0052;
  let discountPct = pricingModel === 'THREE_YEAR_COMMITTED' ? 0.42 : pricingModel === 'ONE_YEAR_COMMITTED' ? 0.28 : 0.0;

  if (provider === 'AZURE') {
    cpuRate = 0.0400;
    ramRate = 0.0050;
    discountPct = pricingModel === 'THREE_YEAR_COMMITTED' ? 0.43 : pricingModel === 'ONE_YEAR_COMMITTED' ? 0.29 : 0.0;
  } else if (provider === 'GCP') {
    cpuRate = 0.0385;
    ramRate = 0.0048;
    discountPct = pricingModel === 'THREE_YEAR_COMMITTED' ? 0.45 : pricingModel === 'ONE_YEAR_COMMITTED' ? 0.30 : 0.0;
  }

  const appCores = Math.max(2, Math.round(cpuCores * 0.6));
  const appRamGB = Math.max(4, Math.round(ramGB * 0.6));
  const dbCores = Math.max(2, cpuCores - appCores);
  const dbRamGB = Math.max(4, ramGB - appRamGB);

  const computeMonthly = ((appCores * cpuRate) + (appRamGB * ramRate)) * hours * (1 - discountPct);

  let storageRate = 0.080;
  if (storageType === 'PREMIUM_SSD') storageRate = 0.125;
  if (storageType === 'INTELLIGENT_TIER') storageRate = 0.023;
  const storageMonthly = (storageGB * storageRate) + (storageGB * 0.5 * 0.023);

  const dbHourlyRate = provider === 'GCP' ? 0.110 : provider === 'AZURE' ? 0.115 : 0.120;
  const multiAzMultiplier = isMultiAz ? (provider === 'AZURE' ? 1.9 : provider === 'GCP' ? 1.8 : 1.85) : 1.0;
  const dbDiscount = pricingModel === 'THREE_YEAR_COMMITTED' ? 0.35 : pricingModel === 'ONE_YEAR_COMMITTED' ? 0.22 : 0.0;
  const databaseMonthly = ((dbCores * dbHourlyRate) + (dbRamGB * 0.015)) * hours * multiAzMultiplier * (1 - dbDiscount);

  const egressRate = provider === 'GCP' ? 0.085 : provider === 'AZURE' ? 0.087 : 0.090;
  const networkingMonthly = (egressGB * egressRate) + 18.25 + 32.85 + 35.0;

  const totalMonthly = Math.round((computeMonthly + storageMonthly + databaseMonthly + networkingMonthly) * 100) / 100;
  const totalAnnual = Math.round(totalMonthly * 12 * 100) / 100;

  const onPremMonthly = 19800.0;
  const onPremAnnual = onPremMonthly * 12;
  const monthlySavings = Math.round((onPremMonthly - totalMonthly) * 100) / 100;
  const annualSavings = Math.round(monthlySavings * 12 * 100) / 100;
  const savingsPct = Math.round((monthlySavings / onPremMonthly) * 1000) / 10;

  const capex = 65000.0;
  const cumulative5YrNet = (5 * onPremAnnual) - (5 * totalAnnual) - capex;
  const fiveYearRoi = Math.round(Math.max(0, (cumulative5YrNet / capex) * 100) * 10) / 10;
  const paybackMonths = monthlySavings > 0 ? Math.round((capex / monthlySavings) * 10) / 10 : 0.0;

  return {
    id: params.id || null,
    estimateName: params.estimateName || `Target Cloud Baseline (${provider})`,
    provider,
    pricingModel,
    pricingModelLabel: pricingModel === 'ON_DEMAND' ? 'On-Demand (Retail)' :
                       pricingModel === 'ONE_YEAR_COMMITTED' ? '1-Year Reserved / Savings Plan' : '3-Year Reserved / Savings Plan',
    vmCount: params.vmCount || 3,
    totalCpuCores: cpuCores,
    totalRamGB: ramGB,
    totalStorageGB: storageGB,
    operatingHoursPerMonth: hours,
    storageType,
    isMultiAzDatabase: isMultiAz,
    networkEgressGB: egressGB,
    computeMonthlyCost: Math.round(computeMonthly * 100) / 100,
    storageMonthlyCost: Math.round(storageMonthly * 100) / 100,
    databaseMonthlyCost: Math.round(databaseMonthly * 100) / 100,
    networkingMonthlyCost: Math.round(networkingMonthly * 100) / 100,
    totalMonthlyCost: totalMonthly,
    totalAnnualCost: totalAnnual,
    onPremCurrentMonthlyCost: onPremMonthly,
    onPremCurrentAnnualCost: onPremAnnual,
    monthlySavings,
    annualSavings,
    savingsPercentage: savingsPct,
    fiveYearRoiPercentage: fiveYearRoi,
    paybackPeriodMonths: paybackMonths,
    commitmentDiscountPercentage: Math.round(discountPct * 100),
    componentBreakdown: {
      computeInstanceHours: hours,
      appTierCores: appCores,
      appTierRamGB: appRamGB,
      databaseCores: dbCores,
      databaseRamGB: dbRamGB,
      storageGB,
      networkEgressGB: egressGB,
      computeDiscountApplied: `${Math.round(discountPct * 100)}%`
    },
    notes: params.notes || '',
    pricingDisclaimer: 'Pricing estimates are calculated using standard benchmark rates (US-East regional catalog) for illustrative cloud migration capacity planning. Actual invoiced billing may vary based on negotiated enterprise discount agreements (EDP/MCA) and real-time consumption.',
    createdAt: new Date().toISOString()
  };
}

export const finOpsApi = {
  /**
   * Get baseline cost estimation for a given provider and pricing model
   */
  async getBaselineEstimate(provider = 'AWS', pricingModel = 'THREE_YEAR_COMMITTED') {
    try {
      const response = await fetch(`${RESOURCE_URL}/baseline?provider=${provider}&pricingModel=${pricingModel}`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
      return await handleResponse(response);
    } catch (err) {
      console.warn('FinOps API baseline fetch fallback to simulated engine:', err.message);
      return calculateLocalEstimate({ provider, pricingModel });
    }
  },

  /**
   * Compare cloud costs across AWS, Microsoft Azure, and GCP
   */
  async compareProviders(pricingModel = 'THREE_YEAR_COMMITTED') {
    try {
      const response = await fetch(`${RESOURCE_URL}/compare?pricingModel=${pricingModel}`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
      return await handleResponse(response);
    } catch (err) {
      console.warn('FinOps API provider comparison fallback:', err.message);
      const awsEst = calculateLocalEstimate({ provider: 'AWS', pricingModel });
      const azureEst = calculateLocalEstimate({ provider: 'AZURE', pricingModel });
      const gcpEst = calculateLocalEstimate({ provider: 'GCP', pricingModel });

      return {
        pricingModel,
        pricingModelLabel: awsEst.pricingModelLabel,
        onPremMonthlyCost: 19800.0,
        onPremAnnualCost: 237600.0,
        recommendedProvider: 'AWS',
        recommendationReason: 'AWS provides the optimal combination of mature cloud-native capabilities (Aurora Serverless v2, Graviton3) and lowest total risk with a 38% net TCO reduction and 7.2-month capital payback.',
        pricingDisclaimer: awsEst.pricingDisclaimer,
        totalCpuCores: 40,
        totalRamGB: 224,
        totalStorageGB: 1950,
        vmCount: 3,
        providers: [
          {
            provider: 'AWS',
            displayName: 'Amazon Web Services (AWS)',
            monthlyTotal: awsEst.totalMonthlyCost,
            annualTotal: awsEst.totalAnnualCost,
            computeCost: awsEst.computeMonthlyCost,
            storageCost: awsEst.storageMonthlyCost,
            databaseCost: awsEst.databaseMonthlyCost,
            networkingCost: awsEst.networkingMonthlyCost,
            monthlySavings: awsEst.monthlySavings,
            annualSavings: awsEst.annualSavings,
            savingsPercentage: awsEst.savingsPercentage,
            fiveYearRoiPercentage: awsEst.fiveYearRoiPercentage,
            paybackMonths: awsEst.paybackPeriodMonths,
            recommendedComputeType: 'm6g.2xlarge (Graviton3) / r6g.2xlarge',
            recommendedDatabaseType: 'Amazon Aurora PostgreSQL Serverless v2',
            recommendedStorageType: 'EBS gp3 (3,000 IOPS) + S3 Glacier Instant',
            architecturalAdvantages: [
              'AWS Graviton3 ARM silicon provides 25% compute performance gain and 20% lower cost.',
              'Aurora Serverless v2 scales database capacity in fine-grained 0.5 ACU increments.',
              'Broadest enterprise partner ecosystem and mature Landing Zone Accelerator governance.'
            ],
            isRecommended: true
          },
          {
            provider: 'AZURE',
            displayName: 'Microsoft Azure',
            monthlyTotal: azureEst.totalMonthlyCost,
            annualTotal: azureEst.totalAnnualCost,
            computeCost: azureEst.computeMonthlyCost,
            storageCost: azureEst.storageMonthlyCost,
            databaseCost: azureEst.databaseMonthlyCost,
            networkingCost: azureEst.networkingMonthlyCost,
            monthlySavings: azureEst.monthlySavings,
            annualSavings: azureEst.annualSavings,
            savingsPercentage: azureEst.savingsPercentage,
            fiveYearRoiPercentage: azureEst.fiveYearRoiPercentage,
            paybackMonths: azureEst.paybackPeriodMonths,
            recommendedComputeType: 'D-series v5 (Standard_D8s_v5) / E-series v5',
            recommendedDatabaseType: 'Azure SQL Managed Instance / Flexible Server',
            recommendedStorageType: 'Managed Disks Premium SSD (ZRS) + Cool Blob',
            architecturalAdvantages: [
              'Azure Hybrid Benefit (AHB) waives Windows Server and SQL Server licensing fees.',
              'Native Azure Active Directory / Entra ID identity federation with existing on-premises AD forest.',
              'Seamless Microsoft 365, Power BI, and SAP ERP cloud connectors.'
            ],
            isRecommended: false
          },
          {
            provider: 'GCP',
            displayName: 'Google Cloud Platform',
            monthlyTotal: gcpEst.totalMonthlyCost,
            annualTotal: gcpEst.totalAnnualCost,
            computeCost: gcpEst.computeMonthlyCost,
            storageCost: gcpEst.storageMonthlyCost,
            databaseCost: gcpEst.databaseMonthlyCost,
            networkingCost: gcpEst.networkingMonthlyCost,
            monthlySavings: gcpEst.monthlySavings,
            annualSavings: gcpEst.annualSavings,
            savingsPercentage: gcpEst.savingsPercentage,
            fiveYearRoiPercentage: gcpEst.fiveYearRoiPercentage,
            paybackMonths: gcpEst.paybackPeriodMonths,
            recommendedComputeType: 'Tau T2D (t2d-standard-8) / N2 High-Memory',
            recommendedDatabaseType: 'Cloud SQL Enterprise Plus / AlloyDB PostgreSQL',
            recommendedStorageType: 'Persistent Disk SSD + Cloud Storage Autoclass',
            architecturalAdvantages: [
              'Tau T2D AMD EPYC processors deliver up to 40% higher price-performance on web workloads.',
              'BigQuery serverless analytics integration eliminates ETL staging pipelines.',
              'Global VPC private fiber network provides lowest latency inter-region database replication.'
            ],
            isRecommended: false
          }
        ]
      };
    }
  },

  /**
   * Retrieve prioritized cost optimization opportunities
   */
  async getOptimizationRecommendations() {
    try {
      const response = await fetch(`${RESOURCE_URL}/optimizations`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
      return await handleResponse(response);
    } catch (err) {
      console.warn('FinOps API optimizations fetch fallback:', err.message);
      return [
        {
          id: 'OPT-01',
          category: 'COMPUTE',
          title: 'Downsize Overprovisioned Web & App Tier Virtual Machines',
          identifiedIssue: 'ShopSphere E-Commerce web instances average 38% CPU peak utilization with 62% idle headroom.',
          suggestedOptimization: 'Right-size from 8 vCPU / 32 GB to 4 vCPU / 16 GB Graviton3 / D4s_v5 with targeted Auto Scaling Policies.',
          expectedMonthlySavings: 167.20,
          expectedAnnualSavings: 2006.40,
          priority: 'HIGH',
          applicableProvider: 'ALL',
          affectedResource: 'prod-shop-web-01.dmz.internal',
          implementationEffortHours: 4.0
        },
        {
          id: 'OPT-02',
          category: 'DATABASE',
          title: 'Modernize Core Banking Oracle RAC to Cloud-Native Managed Database',
          identifiedIssue: 'Legacy on-premises Oracle 19c RAC carries substantial database license fees ($1,750/core) and dedicated hardware standby overhead.',
          suggestedOptimization: 'Migrate to Aurora PostgreSQL Serverless v2 or Azure SQL Managed Instance with elastic auto-scaling compute.',
          expectedMonthlySavings: 1730.00,
          expectedAnnualSavings: 20760.00,
          priority: 'HIGH',
          applicableProvider: 'ALL',
          affectedResource: 'prod-fin-app-01.corp.internal (Oracle 19c)',
          implementationEffortHours: 40.0
        },
        {
          id: 'OPT-03',
          category: 'COMMITMENT',
          title: 'Adopt 3-Year Compute Savings Plans & Committed Use Discounts',
          identifiedIssue: 'Baseline steady-state workloads run continuously 24x7x365 on high-margin On-Demand retail billing rates.',
          suggestedOptimization: 'Purchase 3-Year Compute Savings Plans / Azure Savings Plans / GCP CUD to lock in 42% - 45% discount on steady-state cores.',
          expectedMonthlySavings: 2180.00,
          expectedAnnualSavings: 26160.00,
          priority: 'HIGH',
          applicableProvider: 'ALL',
          affectedResource: 'Enterprise Compute Baseline (40 vCPU / 224 GB RAM)',
          implementationEffortHours: 2.0
        },
        {
          id: 'OPT-04',
          category: 'STORAGE',
          title: 'Implement Automated Object Lifecycle & Cold Tiering',
          identifiedIssue: '1,200 GB of CRM customer history and database backups reside on expensive Block SSD storage despite <5% monthly access rate.',
          suggestedOptimization: 'Transition historical records and transaction backups to S3 Glacier Instant Retrieval / Azure Blob Cool / GCP Coldline.',
          expectedMonthlySavings: 112.50,
          expectedAnnualSavings: 1350.00,
          priority: 'MEDIUM',
          applicableProvider: 'ALL',
          affectedResource: 'prod-crm-db-01.corp.internal (1,200 GB Storage)',
          implementationEffortHours: 8.0
        },
        {
          id: 'OPT-05',
          category: 'SCHEDULE',
          title: 'Non-Production Dev/QA Scheduled Off-Hours Auto-Shutdown',
          identifiedIssue: 'Development and staging servers run 24x7 despite engineering teams working 45 hours weekly.',
          suggestedOptimization: 'Deploy AWS Instance Scheduler / Azure Automation Runbooks to stop non-prod workloads on nights and weekends (saving 65% runtime).',
          expectedMonthlySavings: 380.00,
          expectedAnnualSavings: 4560.00,
          priority: 'MEDIUM',
          applicableProvider: 'ALL',
          affectedResource: 'Non-Production & Staging Environments (400 hrs/mo)',
          implementationEffortHours: 6.0
        },
        {
          id: 'OPT-06',
          category: 'DATABASE',
          title: 'Offload Session State to Managed Redis Cache',
          identifiedIssue: 'Dedicated relational database CPU cycles are spent processing read-heavy user sessions and shopping cart tokens.',
          suggestedOptimization: 'Implement Amazon ElastiCache / Azure Managed Redis / GCP Memorystore to offload 40% of database read queries.',
          expectedMonthlySavings: 126.00,
          expectedAnnualSavings: 1512.00,
          priority: 'MEDIUM',
          applicableProvider: 'ALL',
          affectedResource: 'ShopSphere Session State Layer',
          implementationEffortHours: 12.0
        },
        {
          id: 'OPT-07',
          category: 'NETWORKING',
          title: 'Consolidate Multi-AZ NAT Gateways via Centralized Transit VPC',
          identifiedIssue: 'Redundant per-AZ NAT Gateways generate fixed base charges ($32.85/mo per gateway) and inter-AZ data transfer fees.',
          suggestedOptimization: 'Consolidate outbound internet egress into centralized egress VPC with Transit Gateway route tables.',
          expectedMonthlySavings: 98.00,
          expectedAnnualSavings: 1176.00,
          priority: 'LOW',
          applicableProvider: 'AWS',
          affectedResource: 'Regional VPC NAT Gateways',
          implementationEffortHours: 8.0
        }
      ];
    }
  },

  /**
   * Simulate What-If cost scenario dynamically
   */
  async simulateCost(params) {
    try {
      const response = await fetch(`${RESOURCE_URL}/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(params),
      });
      return await handleResponse(response);
    } catch (err) {
      console.warn('FinOps API simulation fallback:', err.message);
      return calculateLocalEstimate(params);
    }
  },

  /**
   * Save a cost estimation scenario to database
   */
  async saveEstimate(params) {
    try {
      const response = await fetch(`${RESOURCE_URL}/saved`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(params),
      });
      return await handleResponse(response);
    } catch (err) {
      console.warn('FinOps API save fallback:', err.message);
      const est = calculateLocalEstimate(params);
      est.id = Date.now();
      const existing = JSON.parse(localStorage.getItem('cloudsage_saved_estimates') || '[]');
      existing.unshift(est);
      localStorage.setItem('cloudsage_saved_estimates', JSON.stringify(existing));
      return est;
    }
  },

  /**
   * Retrieve all saved estimates
   */
  async getAllSavedEstimates() {
    try {
      const response = await fetch(`${RESOURCE_URL}/saved`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
      return await handleResponse(response);
    } catch (err) {
      console.warn('FinOps API saved estimates fallback:', err.message);
      const stored = localStorage.getItem('cloudsage_saved_estimates');
      if (stored) {
        return JSON.parse(stored);
      }
      return [
        calculateLocalEstimate({
          id: 1,
          estimateName: 'Production Baseline TCO - AWS (3-Yr Savings Plans)',
          provider: 'AWS',
          pricingModel: 'THREE_YEAR_COMMITTED',
          notes: 'Baseline production migration estimate based on Graviton3 instances, Aurora PostgreSQL Serverless v2, and S3 Glacier backup tier.'
        }),
        calculateLocalEstimate({
          id: 2,
          estimateName: 'Production Baseline TCO - Azure (3-Yr Reserved)',
          provider: 'AZURE',
          pricingModel: 'THREE_YEAR_COMMITTED',
          notes: 'Azure target estimate leveraging Azure Hybrid Benefit (AHB) for SQL Server CRM database.'
        }),
        calculateLocalEstimate({
          id: 3,
          estimateName: 'Production Baseline TCO - GCP (3-Yr CUD)',
          provider: 'GCP',
          pricingModel: 'THREE_YEAR_COMMITTED',
          notes: 'Google Cloud target estimate featuring Tau T2D AMD instances and Cloud SQL Enterprise Plus.'
        })
      ];
    }
  },

  /**
   * Delete a saved estimate by ID
   */
  async deleteSavedEstimate(id) {
    try {
      const response = await fetch(`${RESOURCE_URL}/saved/${id}`, {
        method: 'DELETE',
      });
      return await handleResponse(response);
    } catch (err) {
      console.warn('FinOps API delete fallback:', err.message);
      const existing = JSON.parse(localStorage.getItem('cloudsage_saved_estimates') || '[]');
      const filtered = existing.filter(e => e.id !== id);
      localStorage.setItem('cloudsage_saved_estimates', JSON.stringify(filtered));
      return true;
    }
  },

  /**
   * Generate complete cost report payload
   */
  async generateCostReport(provider = 'AWS', pricingModel = 'THREE_YEAR_COMMITTED') {
    try {
      const response = await fetch(`${RESOURCE_URL}/report?provider=${provider}&pricingModel=${pricingModel}`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
      return await handleResponse(response);
    } catch (err) {
      console.warn('FinOps API generate report fallback:', err.message);
      const est = calculateLocalEstimate({ provider, pricingModel });
      const comp = await this.compareProviders(pricingModel);
      const opts = await this.getOptimizationRecommendations();

      return {
        reportId: `FINOPS-RPT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        projectName: 'Enterprise Banking & Digital Commerce Migration',
        generatedAt: new Date().toISOString(),
        targetProvider: provider,
        pricingModel: est.pricingModelLabel,
        onPremMonthlySpend: est.onPremCurrentMonthlyCost,
        targetCloudMonthlySpend: est.totalMonthlyCost,
        netMonthlySavings: est.monthlySavings,
        netAnnualSavings: est.annualSavings,
        savingsPercentage: est.savingsPercentage,
        fiveYearRoiPercentage: est.fiveYearRoiPercentage,
        paybackPeriodMonths: est.paybackPeriodMonths,
        estimatedCarbonReductionTons: 142.4,
        estimateDetails: est,
        comparisonSummary: comp,
        topOptimizations: opts,
        monthlyCashflowProjection: mockMonthlyCostTrend,
        executiveSummary: `CloudSage FinOps engine has conducted comprehensive TCO modeling for the enterprise portfolio (40 vCPU, 224 GB RAM, 1,950 GB storage). Migrating to ${provider} utilizing ${est.pricingModelLabel} commitments reduces monthly infrastructure run-rate from $19,800.00 to $${est.totalMonthlyCost.toLocaleString()}, unlocking $${est.annualSavings.toLocaleString()} in net recurring annual savings (${est.savingsPercentage}% reduction). Capital payback is achieved in Month ${est.paybackPeriodMonths} with a 5-Year cumulative ROI of ${est.fiveYearRoiPercentage}%.`,
        methodologyDisclaimer: est.pricingDisclaimer
      };
    }
  },

  /**
   * Export CSV directly or download via blob
   */
  async exportCsv(provider = 'AWS', pricingModel = 'THREE_YEAR_COMMITTED') {
    try {
      const response = await fetch(`${RESOURCE_URL}/export-csv?provider=${provider}&pricingModel=${pricingModel}`, {
        method: 'GET',
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `CloudSage_FinOps_Cost_${provider}_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        return true;
      }
    } catch (err) {
      console.warn('FinOps API CSV export fallback to client-side CSV:', err.message);
    }

    // Client-side CSV generation fallback
    const est = calculateLocalEstimate({ provider, pricingModel });
    const lines = [
      'CloudSage - MigrateMind FinOps Cost Breakdown',
      `Generated,${new Date().toISOString()}`,
      `Provider,${est.provider}`,
      `Pricing Model,${est.pricingModelLabel}`,
      `Disclaimer,"${est.pricingDisclaimer}"`,
      '',
      'Category,Resource / Service Description,Monthly Cost (USD),Annual Cost (USD),Share (%)',
      `Compute,Virtual Machines & Container Cluster (${est.totalCpuCores} vCPU / ${est.totalRamGB} GB RAM),${est.computeMonthlyCost},${est.computeMonthlyCost * 12},${Math.round((est.computeMonthlyCost / est.totalMonthlyCost) * 100)}`,
      `Storage,Block SSD & Object Backup Tier (${est.totalStorageGB} GB),${est.storageMonthlyCost},${est.storageMonthlyCost * 12},${Math.round((est.storageMonthlyCost / est.totalMonthlyCost) * 100)}`,
      `Database,Managed Cloud Database Tier (${est.isMultiAzDatabase ? 'Multi-AZ HA' : 'Single-AZ'}),${est.databaseMonthlyCost},${est.databaseMonthlyCost * 12},${Math.round((est.databaseMonthlyCost / est.totalMonthlyCost) * 100)}`,
      `Networking,Load Balancer & Egress Transfer (${est.networkEgressGB} GB egress),${est.networkingMonthlyCost},${est.networkingMonthlyCost * 12},${Math.round((est.networkingMonthlyCost / est.totalMonthlyCost) * 100)}`,
      `TOTAL TARGET CLOUD SPEND,,${est.totalMonthlyCost},${est.totalAnnualCost},100.0`,
      '',
      'BASELINE COMPARISON,,Monthly Cost (USD),Annual Cost (USD),Savings (%)',
      `Current On-Premises Datacenter Run Rate,,${est.onPremCurrentMonthlyCost},${est.onPremCurrentAnnualCost},-`,
      `Net Recurring Cloud Savings,,${est.monthlySavings},${est.annualSavings},${est.savingsPercentage}%`,
      `5-Year Cumulative ROI,,${est.fiveYearRoiPercentage}%,,Payback in ${est.paybackPeriodMonths} months`
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CloudSage_FinOps_Cost_${provider}_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    return true;
  }
};

