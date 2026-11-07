import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Sparkles,
  Layers,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Clock,
  Sliders,
  Shield,
  ArrowRight,
  Database,
  Server,
  RefreshCw,
  Search,
  Filter,
  Eye,
  Edit3,
  Cpu,
  HardDrive,
  Activity,
  Zap,
  Tag,
  Info,
  ChevronRight,
  X
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Cell,
  PieChart,
  Pie,
  Legend
} from 'recharts';
import { useProject } from '../context/ProjectContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Table } from '../components/common/Table';
import { Modal } from '../components/common/Modal';
import { formatStorage } from '../utils/formatters';
import { assessmentApi } from '../services/assessmentApi';
import { infrastructureApi } from '../services/infrastructureApi';
import { SIX_R_STRATEGIES } from '../data/mockStrategy';

// 6Rs Palette
const STRATEGY_COLORS = {
  Rehost: '#3b82f6',
  Replatform: '#0284c7',
  Refactor: '#8b5cf6',
  Repurchase: '#10b981',
  Retain: '#f59e0b',
  Retire: '#64748b',
};

const COMPLEXITY_COLORS = {
  Low: '#10b981',
  Medium: '#f59e0b',
  High: '#ef4444',
};

export const AssessmentPage = () => {
  const { showToast } = useProject();

  // State
  const [assessments, setAssessments] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [backendOnline, setBackendOnline] = useState(null);
  const [apiError, setApiError] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [strategyFilter, setStrategyFilter] = useState('ALL');
  const [complexityFilter, setComplexityFilter] = useState('ALL');
  const [overrideFilter, setOverrideFilter] = useState('ALL');

  // Modals
  const [inspectItem, setInspectItem] = useState(null);
  const [overrideModalItem, setOverrideModalItem] = useState(null);
  const [targetStrategy, setTargetStrategy] = useState('Replatform');
  const [overrideReason, setOverrideReason] = useState('');
  const [isSavingOverride, setIsSavingOverride] = useState(false);

  // Load Data
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setApiError(null);

    try {
      // Parallel fetch assessments, summary, and inventory
      const [assessmentsData, summaryData, inventoryData] = await Promise.all([
        assessmentApi.getAllAssessments(),
        assessmentApi.getSummary(),
        infrastructureApi.getAll(),
      ]);

      setAssessments(assessmentsData || []);
      setSummary(summaryData);
      setInventory(inventoryData || []);
      setBackendOnline(true);
    } catch (err) {
      console.warn('Spring Boot Assessment API offline or unreachable, falling back to local evaluation mode:', err);
      setBackendOnline(false);

      // Create fallback assessments from mock / local inventory
      const fallbackAssessments = [
        {
          id: 1,
          infrastructureId: 1,
          workloadName: 'Core Banking Engine',
          applicationName: 'FinCore Suite',
          serverName: 'prod-fin-app-01.corp.internal',
          operatingSystem: 'Red Hat Enterprise Linux 8.8',
          cpuCores: 16,
          ramGB: 64,
          storageGB: 500,
          databaseType: 'Oracle 19c RAC',
          environment: 'Production',
          businessCriticality: 'Mission Critical',
          infrastructureComplexity: 84,
          applicationDependencies: 8,
          performanceRequirements: 'Extreme Throughput (< 5ms SLA)',
          scalabilityRequirements: 'Dynamic Auto-scale (High-Burst Elasticity)',
          securityRequirements: 'PCI-DSS / ISO27001, AWS KMS HSM, Private Subnets, Multi-AZ Failover',
          migrationComplexity: 'High',
          recommendedStrategy: 'Replatform',
          selectedStrategy: 'Replatform',
          isOverridden: false,
          overrideReason: null,
          recommendationRationale: 'Database-centric mission-critical core ledger. Replatforming database layers to Amazon RDS Custom for Oracle or Amazon Aurora PostgreSQL achieves managed maintenance and automated patching with zero core ledger disruption.',
          risks: 'Proprietary PL/SQL stored procedures; Synchronous multi-site RAC replication; Strict 15-minute cutover window.',
          dependencies: 'AWS Database Migration Service (AWS DMS); AWS SCT; Direct Connect 10Gbps dedicated link.',
          suggestedActions: 'Execute AWS SCT schema assessment; Provision Amazon RDS Multi-AZ; Set up ongoing CDC change data capture replication.',
          readinessScore: 86,
          estimatedEffortWeeks: 8,
          assessedAt: new Date().toISOString(),
        },
        {
          id: 2,
          infrastructureId: 2,
          workloadName: 'E-Commerce Web Portal',
          applicationName: 'ShopSphere Online',
          serverName: 'prod-shop-web-01.dmz.internal',
          operatingSystem: 'Ubuntu Server 22.04 LTS',
          cpuCores: 8,
          ramGB: 32,
          storageGB: 250,
          databaseType: 'PostgreSQL 15',
          environment: 'Production',
          businessCriticality: 'High',
          infrastructureComplexity: 68,
          applicationDependencies: 5,
          performanceRequirements: 'High Performance (Tier-1 Enterprise)',
          scalabilityRequirements: 'Dynamic Auto-scale (High-Burst Elasticity)',
          securityRequirements: 'Enterprise Strict Compliance, IAM RBAC, TLS 1.3, Encrypted EBS/RDS',
          migrationComplexity: 'High',
          recommendedStrategy: 'Refactor',
          selectedStrategy: 'Refactor',
          isOverridden: false,
          overrideReason: null,
          recommendationRationale: 'High-value customer portal with modern Ubuntu runtime. Re-architecting into microservices and containerizing on Amazon EKS provides elastic auto-scaling during flash sales and eliminates on-premises VM licensing.',
          risks: 'Microservice decoupling timeline; Session state migration to Amazon ElastiCache Redis.',
          dependencies: 'CI/CD automated pipeline (GitHub Actions); Amazon EKS Kubernetes Cluster; Amazon Aurora Serverless v2.',
          suggestedActions: 'Containerize Docker images; Deploy Kubernetes Helm charts on Amazon EKS with Karpenter auto-scaler; Decouple synchronous orders via Amazon SQS.',
          readinessScore: 91,
          estimatedEffortWeeks: 12,
          assessedAt: new Date().toISOString(),
        },
        {
          id: 3,
          infrastructureId: 3,
          workloadName: 'CRM Database Cluster',
          applicationName: 'Enterprise Client360',
          serverName: 'prod-crm-db-01.corp.internal',
          operatingSystem: 'Windows Server 2022',
          cpuCores: 16,
          ramGB: 128,
          storageGB: 1200,
          databaseType: 'Microsoft SQL Server 2022',
          environment: 'Production',
          businessCriticality: 'High',
          infrastructureComplexity: 78,
          applicationDependencies: 4,
          performanceRequirements: 'Extreme Throughput (< 5ms SLA)',
          scalabilityRequirements: 'Predictable Horizontal Scaling',
          securityRequirements: 'Enterprise Strict Compliance, IAM RBAC, TLS 1.3, Encrypted EBS/RDS',
          migrationComplexity: 'Medium',
          recommendedStrategy: 'Repurchase',
          selectedStrategy: 'Repurchase',
          isOverridden: false,
          overrideReason: null,
          recommendationRationale: 'Commercial off-the-shelf (COTS) CRM application. High ongoing TCO for custom SQL Server clustering; recommended to repurchase as modern SaaS solution (Salesforce or Microsoft Dynamics 365) to eliminate database maintenance.',
          risks: 'Data migration schema mapping; Integration connector rebuild with corporate LDAP/SSO.',
          dependencies: 'SaaS vendor procurement; Azure AD SAML 2.0 Identity Provider; ETL connector pipelines.',
          suggestedActions: 'Perform SaaS feature-parity matrix; Build REST API connectors; Stage data migration using AWS Glue ETL.',
          readinessScore: 82,
          estimatedEffortWeeks: 6,
          assessedAt: new Date().toISOString(),
        },
        {
          id: 4,
          infrastructureId: 4,
          workloadName: 'Legacy Archive File Server',
          applicationName: 'DocuVault Cold Storage',
          serverName: 'ch1-stor-arc01.corp.internal',
          operatingSystem: 'Windows Server 2012 R2',
          cpuCores: 4,
          ramGB: 16,
          storageGB: 3500,
          databaseType: 'None',
          environment: 'Staging',
          businessCriticality: 'Low',
          infrastructureComplexity: 32,
          applicationDependencies: 1,
          performanceRequirements: 'Standard SLA Performance',
          scalabilityRequirements: 'Standard Scheduled Scale',
          securityRequirements: 'Standard Enterprise GuardDuty, Security Groups',
          migrationComplexity: 'Low',
          recommendedStrategy: 'Retire',
          selectedStrategy: 'Retire',
          isOverridden: false,
          overrideReason: null,
          recommendationRationale: 'Low-utilization legacy archive running on end-of-life Windows Server 2012 R2. Decommissioning the VM and exporting cold data to Amazon S3 Glacier Deep Archive eliminates on-premises storage CapEx.',
          risks: 'Minimal operational risk. Potential historical audit compliance inquiries.',
          dependencies: 'Historical cold-storage backup; Data retention policy sign-off.',
          suggestedActions: 'Migrate data to Amazon S3 Glacier Deep Archive via AWS DataSync; Decommission hypervisor VM and update CMDB.',
          readinessScore: 98,
          estimatedEffortWeeks: 2,
          assessedAt: new Date().toISOString(),
        },
        {
          id: 5,
          infrastructureId: 5,
          workloadName: 'Internal LDAP Directory & DNS',
          applicationName: 'Corp Identity Provider',
          serverName: 'ord-dc01.corp.internal',
          operatingSystem: 'Windows Server 2019',
          cpuCores: 4,
          ramGB: 16,
          storageGB: 150,
          databaseType: 'None',
          environment: 'Production',
          businessCriticality: 'High',
          infrastructureComplexity: 45,
          applicationDependencies: 6,
          performanceRequirements: 'Standard SLA Performance',
          scalabilityRequirements: 'Predictable Horizontal Scaling',
          securityRequirements: 'Enterprise Strict Compliance, Active Directory Guard',
          migrationComplexity: 'Low',
          recommendedStrategy: 'Rehost',
          selectedStrategy: 'Rehost',
          isOverridden: false,
          overrideReason: null,
          recommendationRationale: 'Standard Windows Active Directory domain controller. Automated lift-and-shift with AWS MGN preserves exact security tokens, domain functional levels, and GPO policies with zero risk.',
          risks: 'Low risk. Requires synchronized DNS forwarders during hybrid cutover.',
          dependencies: 'AWS MGN replication agent; AWS Direct Connect / Site-to-Site VPN.',
          suggestedActions: 'Install AWS MGN replication agent; Replicate into Amazon VPC; Promote secondary DC in cloud.',
          readinessScore: 94,
          estimatedEffortWeeks: 3,
          assessedAt: new Date().toISOString(),
        },
        {
          id: 6,
          infrastructureId: 6,
          workloadName: 'Industrial SCADA Factory Controller',
          applicationName: 'PlantOps Hardware Bridge',
          serverName: 'ord-scada-hmi01.plant.internal',
          operatingSystem: 'Solaris 10 SPARC',
          cpuCores: 8,
          ramGB: 32,
          storageGB: 400,
          databaseType: 'Sybase ASE',
          environment: 'Production',
          businessCriticality: 'Mission Critical',
          infrastructureComplexity: 92,
          applicationDependencies: 7,
          performanceRequirements: 'Extreme Throughput (< 5ms SLA)',
          scalabilityRequirements: 'Predictable Horizontal Scaling',
          securityRequirements: 'Air-Gapped Physical Perimeter, Hardware Token Authentication',
          migrationComplexity: 'High',
          recommendedStrategy: 'Retain',
          selectedStrategy: 'Retain',
          isOverridden: false,
          overrideReason: null,
          recommendationRationale: 'Specialized non-x86 SPARC hardware with attached RS-232 serial interfaces to industrial machinery. Retaining on-premises in Chicago DC-1 prevents cutover failure while hardware lifecycle modernizes.',
          risks: 'Aging hardware replacement difficulty; High on-premises colocation maintenance cost.',
          dependencies: 'Dedicated physical serial controllers; Industrial PLC network.',
          suggestedActions: 'Keep workload on-premises; Isolate VLAN network perimeter; Schedule modernization in Wave 4.',
          readinessScore: 40,
          estimatedEffortWeeks: 0,
          assessedAt: new Date().toISOString(),
        }
      ];

      setAssessments(fallbackAssessments);
      setSummary({
        totalWorkloads: fallbackAssessments.length,
        assessedWorkloads: fallbackAssessments.length,
        strategyDistribution: {
          Rehost: 1,
          Replatform: 1,
          Refactor: 1,
          Repurchase: 1,
          Retain: 1,
          Retire: 1,
        },
        complexityDistribution: {
          Low: 2,
          Medium: 2,
          High: 2,
        },
        averageReadinessScore: 81.8,
        overriddenCount: 0,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Run Batch Evaluation
  const handleEvaluateAll = async () => {
    setIsEvaluating(true);
    try {
      if (backendOnline) {
        const results = await assessmentApi.evaluateAllWorkloads();
        showToast(`Evaluation engine successfully assessed ${results.length} workload(s).`);
        await loadData();
      } else {
        showToast('Automated 6R recommendation engine evaluated all workloads (Local simulation).');
      }
    } catch (err) {
      setApiError(err.message || 'Failed to execute assessment engine');
    } finally {
      setIsEvaluating(false);
    }
  };

  // Evaluate Single Workload
  const handleEvaluateSingle = async (infraId, workloadName) => {
    setIsLoading(true);
    try {
      if (backendOnline) {
        await assessmentApi.evaluateWorkload(infraId);
        showToast(`Workload "${workloadName}" assessed with 6R recommendation.`);
        await loadData();
      } else {
        showToast(`Workload "${workloadName}" evaluated.`);
      }
    } catch (err) {
      setApiError(err.message || 'Failed to evaluate workload');
    } finally {
      setIsLoading(false);
    }
  };

  // Open Override Modal
  const handleOpenOverride = (item) => {
    setOverrideModalItem(item);
    setTargetStrategy(item.selectedStrategy || item.recommendedStrategy || 'Replatform');
    setOverrideReason(item.overrideReason || '');
    setApiError(null);
  };

  // Submit Override
  const handleSubmitOverride = async (e) => {
    e.preventDefault();
    if (!targetStrategy) return;
    if (!overrideReason.trim()) {
      setApiError('Please provide a justification / rationale for overriding the automated 6R recommendation.');
      return;
    }

    setIsSavingOverride(true);
    setApiError(null);

    try {
      if (backendOnline && overrideModalItem?.id) {
        await assessmentApi.overrideStrategy(overrideModalItem.id, {
          selectedStrategy: targetStrategy,
          overrideReason: overrideReason.trim(),
        });
        showToast(`Strategy overridden to ${targetStrategy} for "${overrideModalItem.workloadName}".`);
        await loadData();
      } else {
        // Local state update
        setAssessments((prev) =>
          prev.map((a) =>
            a.id === overrideModalItem.id
              ? {
                  ...a,
                  selectedStrategy: targetStrategy,
                  isOverridden: true,
                  overrideReason: overrideReason.trim(),
                }
              : a
          )
        );
        showToast(`Strategy overridden to ${targetStrategy} (Local cache).`);
      }
      setOverrideModalItem(null);
    } catch (err) {
      setApiError(err.message || 'Failed to save strategy override');
    } finally {
      setIsSavingOverride(false);
    }
  };

  // Chart Data preparation
  const chartData6R = useMemo(() => {
    const counts = {
      Rehost: 0,
      Replatform: 0,
      Refactor: 0,
      Repurchase: 0,
      Retain: 0,
      Retire: 0,
    };

    assessments.forEach((a) => {
      const s = a.selectedStrategy || a.recommendedStrategy;
      if (counts[s] !== undefined) {
        counts[s]++;
      }
    });

    return Object.entries(counts).map(([name, count]) => ({
      name,
      count,
      fill: STRATEGY_COLORS[name] || '#3b82f6',
    }));
  }, [assessments]);

  const complexityPieData = useMemo(() => {
    const counts = { Low: 0, Medium: 0, High: 0 };
    assessments.forEach((a) => {
      const c = a.migrationComplexity || 'Medium';
      if (counts[c] !== undefined) counts[c]++;
    });

    return [
      { name: 'Low Complexity', value: counts.Low, color: COMPLEXITY_COLORS.Low },
      { name: 'Medium Complexity', value: counts.Medium, color: COMPLEXITY_COLORS.Medium },
      { name: 'High Complexity', value: counts.High, color: COMPLEXITY_COLORS.High },
    ].filter((item) => item.value > 0);
  }, [assessments]);

  // Filtered dataset
  const filteredAssessments = useMemo(() => {
    return assessments.filter((item) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        (item.workloadName && item.workloadName.toLowerCase().includes(q)) ||
        (item.applicationName && item.applicationName.toLowerCase().includes(q)) ||
        (item.serverName && item.serverName.toLowerCase().includes(q)) ||
        (item.operatingSystem && item.operatingSystem.toLowerCase().includes(q)) ||
        (item.databaseType && item.databaseType.toLowerCase().includes(q));

      const activeStrat = item.selectedStrategy || item.recommendedStrategy;
      const matchesStrategy = strategyFilter === 'ALL' || activeStrat === strategyFilter;
      const matchesComplexity = complexityFilter === 'ALL' || item.migrationComplexity === complexityFilter;
      const matchesOverride =
        overrideFilter === 'ALL' ||
        (overrideFilter === 'OVERRIDDEN' && item.isOverridden) ||
        (overrideFilter === 'AUTOMATED' && !item.isOverridden);

      return matchesSearch && matchesStrategy && matchesComplexity && matchesOverride;
    });
  }, [assessments, searchQuery, strategyFilter, complexityFilter, overrideFilter]);

  // Table columns definition
  const columns = [
    {
      header: 'Workload & Application',
      key: 'workloadName',
      render: (item) => (
        <div>
          <div className="font-semibold text-slate-900 flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="truncate max-w-[200px]" title={item.workloadName}>
              {item.workloadName}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono mt-0.5 truncate max-w-[180px]">
            {item.serverName}
          </div>
        </div>
      ),
    },
    {
      header: 'Specs & Database',
      key: 'specs',
      render: (item) => (
        <div className="text-xs text-slate-700">
          <div className="flex items-center gap-1.5 font-medium">
            <Cpu className="w-3 h-3 text-slate-400 shrink-0" />
            <span>{item.cpuCores} Cores</span>
            <span className="text-slate-300">•</span>
            <span>{item.ramGB} GB RAM</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
            <Database className="w-3 h-3 text-blue-500 shrink-0" />
            <span className="truncate max-w-[130px]">{item.databaseType || 'No Dedicated DB'}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Complexity & Readiness',
      key: 'complexity',
      render: (item) => {
        const compVariant =
          item.migrationComplexity === 'High'
            ? 'red'
            : item.migrationComplexity === 'Medium'
            ? 'amber'
            : 'emerald';

        return (
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <Badge variant={compVariant} size="xs">
                {item.migrationComplexity} Complexity
              </Badge>
              <span className="text-[10px] text-slate-400 font-mono">
                Score: {item.infrastructureComplexity}/100
              </span>
            </div>
            <div className="w-28">
              <div className="flex items-center justify-between text-[10px] text-slate-500 mb-0.5">
                <span>Readiness</span>
                <span className="font-semibold text-slate-800">{item.readinessScore}%</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-1.5 rounded-full transition-all"
                  style={{ width: `${item.readinessScore}%` }}
                />
              </div>
            </div>
          </div>
        );
      },
    },
    {
      header: '6R Recommended Strategy',
      key: 'recommendedStrategy',
      render: (item) => {
        const color = STRATEGY_COLORS[item.recommendedStrategy] || '#3b82f6';
        return (
          <div>
            <span
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold"
              style={{
                backgroundColor: `${color}15`,
                color: color,
                border: `1px solid ${color}40`,
              }}
            >
              {item.recommendedStrategy}
            </span>
            <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Est. {item.estimatedEffortWeeks || 4} Weeks Effort</span>
            </div>
          </div>
        );
      },
    },
    {
      header: 'Active Strategy / Override',
      key: 'selectedStrategy',
      render: (item) => {
        const active = item.selectedStrategy || item.recommendedStrategy;
        const color = STRATEGY_COLORS[active] || '#3b82f6';
        const isOverridden = item.isOverridden;

        return (
          <div>
            <div className="flex items-center gap-1.5">
              <span
                className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold text-white shadow-xs"
                style={{ backgroundColor: color }}
              >
                {active}
              </span>
              {isOverridden && (
                <span
                  title={`Manual Override: ${item.overrideReason || 'Custom consultant rationale'}`}
                  className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-purple-100 text-purple-700 border border-purple-200"
                >
                  Overridden
                </span>
              )}
            </div>
            {isOverridden && item.overrideReason && (
              <p className="text-[10px] text-slate-500 truncate max-w-[150px] mt-0.5" title={item.overrideReason}>
                {item.overrideReason}
              </p>
            )}
          </div>
        );
      },
    },
    {
      header: 'Actions',
      key: 'actions',
      align: 'right',
      render: (item) => (
        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="xs"
            icon={Eye}
            onClick={() => setInspectItem(item)}
            title="Inspect 6R Recommendation Rationale"
          >
            Deep Dive
          </Button>
          <Button
            variant="ghost"
            size="xs"
            icon={Sliders}
            className="text-slate-600 hover:text-purple-600 hover:bg-purple-50"
            onClick={() => handleOpenOverride(item)}
            title="Override Migration Strategy"
          >
            Override
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Backend Status Notification Banner */}
      <div
        className={`p-3.5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs transition-colors ${
          backendOnline
            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
            : 'bg-amber-50/70 border-amber-200 text-amber-900'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-2.5 w-2.5 shrink-0">
            {backendOnline ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
              </>
            ) : (
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            )}
          </div>
          <div>
            {backendOnline ? (
              <p className="font-medium">
                <strong>Spring Boot 6Rs Recommendation Engine Online:</strong> REST endpoints active at{' '}
                <code className="bg-emerald-100 text-emerald-900 px-1 py-0.5 rounded font-mono text-[11px]">
                  http://localhost:8080/api/assessments
                </code>{' '}
                with MySQL persistence.
              </p>
            ) : (
              <p className="font-medium">
                <strong>Spring Boot Backend Offline:</strong> Running client-side decision engine. Start backend with{' '}
                <code className="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-mono text-[11px]">
                  cd backend && mvnw.cmd spring-boot:run
                </code>
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          <Button
            variant="secondary"
            size="xs"
            icon={RefreshCw}
            onClick={loadData}
            disabled={isLoading || isEvaluating}
          >
            {isLoading ? 'Syncing...' : 'Sync Assessments'}
          </Button>
        </div>
      </div>

      {/* Global API Error Alert */}
      {apiError && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>
              <strong>Assessment Error:</strong> {apiError}
            </span>
          </div>
          <button onClick={() => setApiError(null)} className="text-red-500 hover:text-red-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-blue-600 mb-1">
            Gartner & AWS 6Rs Framework • Stage 4
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Workload Assessment & 6Rs Strategy
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Evaluate infrastructure complexity, compliance mandates, operational coupling, and cloud-native feasibility.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="primary"
            size="sm"
            icon={Sparkles}
            onClick={handleEvaluateAll}
            disabled={isEvaluating}
          >
            {isEvaluating ? 'Running 6Rs Engine...' : 'Run 6Rs Evaluation Engine'}
          </Button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card noPadding>
          <div className="p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
                Total Catalog Workloads
              </span>
              <span className="text-2xl font-bold text-slate-900 mt-1 block">
                {summary?.totalWorkloads || inventory.length || assessments.length}
              </span>
              <span className="text-[11px] text-slate-500 mt-0.5 block">
                From Stage 3 Inventory
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card noPadding>
          <div className="p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
                Assessed Workloads
              </span>
              <span className="text-2xl font-bold text-blue-600 mt-1 block">
                {summary?.assessedWorkloads || assessments.length}
              </span>
              <span className="text-[11px] text-emerald-600 font-medium mt-0.5 block">
                100% Evaluation Coverage
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card noPadding>
          <div className="p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
                Cloud Readiness Index
              </span>
              <span className="text-2xl font-bold text-slate-900 mt-1 block">
                {summary?.averageReadinessScore || 85.4}%
              </span>
              <span className="text-[11px] text-blue-600 font-medium mt-0.5 block">
                High Migration Suitability
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card noPadding>
          <div className="p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
                Overridden Strategies
              </span>
              <span className="text-2xl font-bold text-slate-900 mt-1 block">
                {summary?.overriddenCount || assessments.filter((a) => a.isOverridden).length}
              </span>
              <span className="text-[11px] text-slate-500 mt-0.5 block">
                Manual Consultant Adjustments
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Interactive Charts: 6Rs Distribution & Complexity Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 6Rs Bar Chart (7 cols) */}
        <div className="lg:col-span-7">
          <Card
            title="6Rs Migration Strategy Distribution"
            subtitle="Workload count categorized across the 6 cloud adoption pathways"
          >
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData6R} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <RechartsTooltip
                    formatter={(val) => [`${val} Workload(s)`, 'Count']}
                    contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {chartData6R.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Complexity Donut Chart (5 cols) */}
        <div className="lg:col-span-5">
          <Card
            title="Migration Complexity Breakdown"
            subtitle="Risk and delivery effort distribution"
          >
            <div className="h-64 w-full flex items-center justify-center">
              {complexityPieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={complexityPieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                    >
                      {complexityPieData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      formatter={(val, name) => [`${val} Workloads`, name]}
                      contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <span className="text-xs text-slate-400">No complexity data available</span>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* 6Rs Interactive Framework Selector Cards */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-600">
            6R Migration Strategies Matrix (Click to Filter Table)
          </h2>
          {strategyFilter !== 'ALL' && (
            <button
              onClick={() => setStrategyFilter('ALL')}
              className="text-xs text-blue-600 hover:underline font-medium"
            >
              Clear Strategy Filter
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {Object.entries(SIX_R_STRATEGIES).map(([key, strat]) => {
            const isSelected = strategyFilter === key;
            const count = assessments.filter(
              (a) => (a.selectedStrategy || a.recommendedStrategy) === key
            ).length;
            const color = STRATEGY_COLORS[key] || '#3b82f6';

            return (
              <div
                key={key}
                onClick={() => setStrategyFilter(isSelected ? 'ALL' : key)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-white shadow-md ring-2 ring-blue-500/30'
                    : 'bg-white hover:border-slate-300 hover:shadow-xs'
                }`}
                style={{
                  borderColor: isSelected ? color : '#e2e8f0',
                }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: `${color}15`,
                      color: color,
                    }}
                  >
                    {key}
                  </span>
                  <span className="text-sm font-extrabold text-slate-800">{count}</span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-snug">
                  {strat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter and Query Control Bar */}
      <Card noPadding>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-50/50 border-b border-slate-200">
          {/* Search */}
          <div>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search workloads, apps, OS, DB..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Strategy Filter */}
          <div>
            <select
              value={strategyFilter}
              onChange={(e) => setStrategyFilter(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All 6R Strategies</option>
              <option value="Rehost">Rehost</option>
              <option value="Replatform">Replatform</option>
              <option value="Refactor">Refactor</option>
              <option value="Repurchase">Repurchase</option>
              <option value="Retain">Retain</option>
              <option value="Retire">Retire</option>
            </select>
          </div>

          {/* Complexity Filter */}
          <div>
            <select
              value={complexityFilter}
              onChange={(e) => setComplexityFilter(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Complexities</option>
              <option value="Low">Low Complexity</option>
              <option value="Medium">Medium Complexity</option>
              <option value="High">High Complexity</option>
            </select>
          </div>

          {/* Override Filter */}
          <div>
            <select
              value={overrideFilter}
              onChange={(e) => setOverrideFilter(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Decisions</option>
              <option value="OVERRIDDEN">Manually Overridden</option>
              <option value="AUTOMATED">Automated Recommendations</option>
            </select>
          </div>
        </div>

        {/* Results summary pill */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span>
            Showing <strong className="text-slate-800">{filteredAssessments.length}</strong> of{' '}
            {assessments.length} assessed workload(s)
          </span>
          <span className="text-[11px] text-blue-600 font-medium">
            Framework: AWS 6Rs & Well-Architected Viability Matrix
          </span>
        </div>

        {/* Table View */}
        <Table
          columns={columns}
          data={filteredAssessments}
          isLoading={isLoading}
          onRowClick={(item) => setInspectItem(item)}
        />
      </Card>

      {/* Deep Dive Recommendation Modal */}
      {inspectItem && (
        <Modal
          isOpen={!!inspectItem}
          onClose={() => setInspectItem(null)}
          title={`Workload Assessment: ${inspectItem.workloadName}`}
          subtitle={`Application: ${inspectItem.applicationName} • Host: ${inspectItem.serverName}`}
          maxWidth="max-w-3xl"
          footer={
            <>
              <Button variant="secondary" size="sm" onClick={() => setInspectItem(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={Sliders}
                onClick={() => {
                  const target = inspectItem;
                  setInspectItem(null);
                  handleOpenOverride(target);
                }}
              >
                Override Strategy
              </Button>
            </>
          }
        >
          <div className="space-y-4 text-xs">
            {/* Top Strategy & Complexity banner */}
            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Recommended Migration Strategy
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className="text-base font-bold px-3 py-1 rounded-lg text-white shadow-xs"
                    style={{
                      backgroundColor: STRATEGY_COLORS[inspectItem.selectedStrategy || inspectItem.recommendedStrategy] || '#3b82f6',
                    }}
                  >
                    {inspectItem.selectedStrategy || inspectItem.recommendedStrategy}
                  </span>
                  {inspectItem.isOverridden && (
                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-purple-100 text-purple-700 border border-purple-200">
                      Manually Overridden (Engine Recommended: {inspectItem.recommendedStrategy})
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right sm:text-right">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Migration Complexity
                </span>
                <div className="mt-1 flex items-center gap-2">
                  <Badge
                    variant={
                      inspectItem.migrationComplexity === 'High'
                        ? 'red'
                        : inspectItem.migrationComplexity === 'Medium'
                        ? 'amber'
                        : 'emerald'
                    }
                    size="sm"
                  >
                    {inspectItem.migrationComplexity} Complexity
                  </Badge>
                  <span className="text-xs text-slate-600 font-medium">
                    Est. {inspectItem.estimatedEffortWeeks || 4} Weeks
                  </span>
                </div>
              </div>
            </div>

            {/* Assessment Dimensions Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-400 uppercase font-semibold text-[10px] block">
                  Compute & RAM
                </span>
                <span className="font-bold text-slate-800 text-sm">
                  {inspectItem.cpuCores} Cores • {inspectItem.ramGB} GB
                </span>
                <span className="text-slate-500 text-[10px] block">{inspectItem.operatingSystem}</span>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-semibold text-[10px] block">
                  Allocated Storage
                </span>
                <span className="font-bold text-slate-800 text-sm">
                  {formatStorage(inspectItem.storageGB)}
                </span>
                <span className="text-slate-500 text-[10px] block">
                  {inspectItem.databaseType || 'No Database'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-semibold text-[10px] block">
                  Dependencies Coupling
                </span>
                <span className="font-bold text-slate-800 text-sm">
                  {inspectItem.applicationDependencies} External Peers
                </span>
                <span className="text-slate-500 text-[10px] block">
                  Complexity: {inspectItem.infrastructureComplexity}/100
                </span>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-semibold text-[10px] block">
                  Cloud Readiness
                </span>
                <span className="font-bold text-emerald-700 text-sm">
                  {inspectItem.readinessScore}% Ready
                </span>
                <span className="text-slate-500 text-[10px] block">{inspectItem.environment}</span>
              </div>
            </div>

            {/* Rationale & Explanation */}
            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <Info className="w-4 h-4 text-blue-600" />
                <span>6R Strategic Recommendation Rationale</span>
              </div>
              <p className="text-slate-600 leading-relaxed text-xs">
                {inspectItem.recommendationRationale}
              </p>
            </div>

            {/* Risks & Dependencies */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl border border-amber-200 bg-amber-50/50 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Identified Risks & Constraints</span>
                </div>
                <p className="text-amber-800 text-xs leading-relaxed">
                  {inspectItem.risks || 'No severe blocking risks identified.'}
                </p>
              </div>

              <div className="p-3 rounded-xl border border-purple-200 bg-purple-50/50 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-purple-900">
                  <Layers className="w-4 h-4 text-purple-600" />
                  <span>Application & Service Dependencies</span>
                </div>
                <p className="text-purple-800 text-xs leading-relaxed">
                  {inspectItem.dependencies || 'Standard enterprise Active Directory & network dependencies.'}
                </p>
              </div>
            </div>

            {/* Suggested Migration Actions */}
            <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Recommended Action Plan & Target AWS Architecture</span>
              </div>
              <p className="text-emerald-800 text-xs leading-relaxed">
                {inspectItem.suggestedActions}
              </p>
            </div>

            {/* Security and Performance SLA */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-[11px] text-slate-600">
              <div className="flex items-center justify-between">
                <span><strong>Security Compliance:</strong> {inspectItem.securityRequirements}</span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                <span><strong>Performance SLA:</strong> {inspectItem.performanceRequirements}</span>
                <span><strong>Scalability:</strong> {inspectItem.scalabilityRequirements}</span>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Manual Strategy Override Modal */}
      {overrideModalItem && (
        <Modal
          isOpen={!!overrideModalItem}
          onClose={() => setOverrideModalItem(null)}
          title={`Override 6R Strategy: ${overrideModalItem.workloadName}`}
          subtitle={`Current Recommendation: ${overrideModalItem.recommendedStrategy}`}
          maxWidth="max-w-lg"
          footer={
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setOverrideModalItem(null)}
                disabled={isSavingOverride}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSubmitOverride}
                disabled={isSavingOverride}
              >
                {isSavingOverride ? 'Saving Override...' : 'Confirm Strategy Override'}
              </Button>
            </>
          }
        >
          <form onSubmit={handleSubmitOverride} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Target 6R Strategy <span className="text-red-500">*</span>
              </label>
              <select
                value={targetStrategy}
                onChange={(e) => setTargetStrategy(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Rehost">Rehost – Move applications without code changes (Lift & Shift)</option>
                <option value="Replatform">Replatform – Optimize with managed services (Lift, Tinker & Shift)</option>
                <option value="Refactor">Refactor – Redesign with cloud-native microservices</option>
                <option value="Repurchase">Repurchase – Replace with commercial SaaS solution (Drop & Shop)</option>
                <option value="Retain">Retain – Keep on-premises in existing environment</option>
                <option value="Retire">Retire – Decommission unnecessary or obsolete application</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Consultant Justification / Override Rationale <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                placeholder="Explain the technical, business, or budget rationale for overriding the automated recommendation..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                This rationale will be recorded in the audit trail and included in executive assessment reports.
              </span>
            </div>

            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-[11px] flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                Original engine recommendation: <strong>{overrideModalItem.recommendedStrategy}</strong>. Overriding updates project cost projections, target architecture blueprints, and timeline phases.
              </span>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
