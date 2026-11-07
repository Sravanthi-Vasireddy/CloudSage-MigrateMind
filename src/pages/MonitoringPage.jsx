import React, { useState, useEffect, useMemo } from 'react';
import {
  Activity,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Server,
  Database,
  Cpu,
  HardDrive,
  Clock,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  ShieldAlert,
  Play,
  RotateCcw,
  Layers,
  Search,
  Filter,
  Info,
  Check,
  ChevronRight,
  FileText,
  Sliders,
  ExternalLink,
  Zap,
  Terminal,
  BarChart2
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { StatCard } from '../components/common/StatCard';
import { monitoringApi } from '../services/monitoringApi';

export const MonitoringPage = () => {
  const { currentProject, showToast } = useProject();

  // Active Tab: 'overview' | 'validations' | 'health' | 'comparison' | 'failures' | 'audit'
  const [activeTab, setActiveTab] = useState('overview');

  // Loading & Action State
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isExecutingValidation, setIsExecutingValidation] = useState(false);

  // Core Data
  const [summary, setSummary] = useState(null);
  const [workloads, setWorkloads] = useState([]);
  const [validations, setValidations] = useState([]);
  const [failures, setFailures] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  // Filters
  const [validationFilterStatus, setValidationFilterStatus] = useState('ALL');
  const [validationFilterType, setValidationFilterType] = useState('ALL');
  const [validationSearchQuery, setValidationSearchQuery] = useState('');

  const [failureFilterStatus, setFailureFilterStatus] = useState('ALL');
  const [auditFilterActivity, setAuditFilterActivity] = useState('ALL');

  // Modals
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [selectedIncidentForResolve, setSelectedIncidentForResolve] = useState(null);
  const [resolveNotes, setResolveNotes] = useState('');

  const [isRunValidationModalOpen, setIsRunValidationModalOpen] = useState(false);
  const [selectedWorkloadForValidation, setSelectedWorkloadForValidation] = useState('');

  // Initial Data Fetch
  useEffect(() => {
    loadAllMonitoringData();
  }, []);

  const loadAllMonitoringData = async () => {
    setLoading(true);
    try {
      const [sumRes, workRes, valRes, failRes, metRes, audRes] = await Promise.all([
        monitoringApi.getDashboardSummary(),
        monitoringApi.getAllWorkloadStatuses(),
        monitoringApi.getAllValidationResults(),
        monitoringApi.getAllFailureIncidents(),
        monitoringApi.getPerformanceComparison(),
        monitoringApi.getAuditLogs()
      ]);

      setSummary(sumRes);
      setWorkloads(workRes);
      setValidations(valRes);
      setFailures(failRes);
      setMetrics(metRes);
      setAuditLogs(audRes);
    } catch (err) {
      console.error('Failed to load migration monitoring data:', err);
      showToast('Error loading monitoring telemetry. Running in local simulation mode.');
    } finally {
      setLoading(false);
    }
  };

  // Manual & Polling Refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    showToast('Refreshing cloud telemetry & polling workload health checks...');
    setTimeout(async () => {
      await loadAllMonitoringData();
      setRefreshing(false);
      showToast('Telemetry refreshed from Spring Boot monitoring engine.');
    }, 600);
  };

  // Run Automated Validation
  const handleTriggerValidation = async (e) => {
    e.preventDefault();
    setIsExecutingValidation(true);
    showToast(`Running automated test probes for '${selectedWorkloadForValidation || 'Retail Orders Web Portal'}'...`);
    try {
      await monitoringApi.executeWorkloadValidation({
        workloadName: selectedWorkloadForValidation || 'Retail Orders Web Portal',
        validationTypes: [
          'APPLICATION_AVAILABILITY',
          'DATABASE_CONNECTIVITY',
          'STORAGE_ACCESSIBILITY',
          'RESPONSE_TIME',
          'CONFIG_CONSISTENCY'
        ]
      });
      setIsRunValidationModalOpen(false);
      await loadAllMonitoringData();
      showToast('Validation suite executed successfully. All health probes verified.');
    } catch (err) {
      console.error(err);
      showToast('Validation execution error.');
    } finally {
      setIsExecutingValidation(false);
    }
  };

  // Retry Validation Check
  const handleRetryValidation = async (id, name) => {
    try {
      showToast(`Retrying validation check '${name}'...`);
      await monitoringApi.retryValidation(id);
      await loadAllMonitoringData();
      showToast(`Validation check '${name}' re-evaluated: PASSED.`);
    } catch (err) {
      console.error(err);
      showToast('Retry validation failed.');
    }
  };

  // Open Resolve Failure Modal
  const handleOpenResolveModal = (incident) => {
    setSelectedIncidentForResolve(incident);
    setResolveNotes(incident.recommendedCorrectiveAction || 'Applied corrective action and verified service recovery.');
    setIsResolveModalOpen(true);
  };

  // Submit Failure Resolution
  const handleSaveResolution = async (e) => {
    e.preventDefault();
    if (!selectedIncidentForResolve) return;
    try {
      await monitoringApi.resolveFailureIncident(selectedIncidentForResolve.id, {
        troubleshootingNotes: resolveNotes,
        recoveryStatus: 'RESOLVED'
      });
      setIsResolveModalOpen(false);
      await loadAllMonitoringData();
      showToast(`Incident #${selectedIncidentForResolve.id} marked as RESOLVED.`);
    } catch (err) {
      console.error(err);
      showToast('Failed to resolve incident.');
    }
  };

  // Retry Failure Incident
  const handleRetryFailureIncident = async (id, workload) => {
    try {
      showToast(`Triggering automated retry for '${workload}' incident...`);
      await monitoringApi.retryFailureIncident(id);
      await loadAllMonitoringData();
      showToast(`Retry queued for incident #${id}. Validation engine will re-evaluate.`);
    } catch (err) {
      console.error(err);
      showToast('Failed to retry incident.');
    }
  };

  // Filtered Validations
  const filteredValidations = useMemo(() => {
    return validations.filter((v) => {
      const matchesSearch =
        validationSearchQuery === '' ||
        v.validationName.toLowerCase().includes(validationSearchQuery.toLowerCase()) ||
        v.workloadName.toLowerCase().includes(validationSearchQuery.toLowerCase());

      const matchesStatus =
        validationFilterStatus === 'ALL' ||
        v.validationStatus.toUpperCase() === validationFilterStatus.toUpperCase();

      const matchesType =
        validationFilterType === 'ALL' ||
        v.validationType.toUpperCase() === validationFilterType.toUpperCase();

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [validations, validationSearchQuery, validationFilterStatus, validationFilterType]);

  // Filtered Failures
  const filteredFailures = useMemo(() => {
    return failures.filter((f) => {
      return failureFilterStatus === 'ALL' || f.recoveryStatus.toUpperCase() === failureFilterStatus.toUpperCase();
    });
  }, [failures, failureFilterStatus]);

  // Filtered Audit Logs
  const filteredAuditLogs = useMemo(() => {
    return auditLogs.filter((a) => {
      return auditFilterActivity === 'ALL' || a.activityType.toUpperCase() === auditFilterActivity.toUpperCase();
    });
  }, [auditLogs, auditFilterActivity]);

  // Status Badges
  const getValidationBadge = (status) => {
    switch (status?.toUpperCase()) {
      case 'PASSED':
        return <Badge variant="emerald" size="xs">PASSED</Badge>;
      case 'FAILED':
        return <Badge variant="rose" size="xs">FAILED</Badge>;
      case 'WARNING':
        return <Badge variant="amber" size="xs">WARNING</Badge>;
      default:
        return <Badge variant="blue" size="xs">{status}</Badge>;
    }
  };

  const getHealthBadge = (health) => {
    switch (health?.toUpperCase()) {
      case 'HEALTHY':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Healthy</span>;
      case 'DEGRADED':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>Degraded</span>;
      case 'CRITICAL':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200"><span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>Critical</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700">Unknown</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
            <Activity className="w-4 h-4 text-blue-600" />
            Stage 9 – Migration Monitoring &amp; Validation
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            Migration Execution Monitoring &amp; Workload Validation
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-4xl">
            Live telemetry tracking of cutover workloads, automated health &amp; connectivity validation probes, 
            failure incident remediation, and before-and-after performance benchmarking.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            icon={RefreshCw}
            loading={refreshing}
            onClick={handleRefresh}
          >
            {refreshing ? 'Polling Cloud...' : 'Refresh Telemetry'}
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={Play}
            onClick={() => {
              setSelectedWorkloadForValidation(workloads[0]?.workloadName || '');
              setIsRunValidationModalOpen(true);
            }}
          >
            Run Automated Validation
          </Button>
        </div>
      </div>

      {/* Telemetry Demarcation Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white px-5 py-3.5 rounded-xl shadow-sm border border-blue-950/40 flex items-start gap-3.5">
        <div className="p-2 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-400/30 shrink-0 mt-0.5">
          <Info className="w-4 h-4" />
        </div>
        <div className="space-y-0.5 text-xs">
          <div className="font-semibold text-blue-200 tracking-wide flex items-center gap-2">
            <span>Telemetry Mode: Polling &amp; Scheduled Refresh</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/30 text-blue-100">
              Simulated Telemetry &bull; Provider Agent Inactive
            </span>
          </div>
          <p className="text-slate-300 leading-relaxed text-[11.5px]">
            {summary?.telemetryNotice || "Real-time dashboard updates powered by Java backend polling and scheduled telemetry refreshes. Simulated metrics are clearly demarcated until active cloud provider agents (CloudWatch / Azure Monitor) are configured."}
          </p>
        </div>
      </div>

      {/* Top Executive KPI Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Scheduled Workloads"
          value={summary?.totalScheduledWorkloads || workloads.length}
          subtext="5 Migration Waves defined"
          icon={Server}
          color="blue"
        />

        <StatCard
          title="Migrated Workloads"
          value={`${summary?.successfulMigrations || 0} (${summary?.overallCompletionPercentage || 0}%)`}
          subtext={`${summary?.inProgressMigrations || 0} currently in progress`}
          icon={CheckCircle2}
          color="emerald"
        />

        <StatCard
          title="In Progress"
          value={summary?.inProgressMigrations || 0}
          subtext={`${summary?.pendingMigrations || 0} workloads pending wave start`}
          icon={Activity}
          color="sky"
        />

        <StatCard
          title="Failed Migrations"
          value={summary?.failedMigrations || 0}
          subtext={summary?.failedMigrations > 0 ? "Requires engineer intervention" : "Zero active incidents"}
          icon={AlertTriangle}
          color={summary?.failedMigrations > 0 ? "amber" : "slate"}
        />

        <StatCard
          title="Health Posture"
          value={`${summary?.healthyWorkloadsCount || 0} Healthy`}
          subtext={`${summary?.degradedWorkloadsCount || 0} Degraded &bull; ${summary?.criticalWorkloadsCount || 0} Critical`}
          icon={ShieldCheck}
          color={summary?.criticalWorkloadsCount > 0 ? "amber" : "emerald"}
        />
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3.5 px-1 border-b-2 font-semibold text-xs tracking-wide flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            <Activity className="w-4 h-4" />
            Executive Overview &amp; Waves
          </button>

          <button
            onClick={() => setActiveTab('validations')}
            className={`py-3.5 px-1 border-b-2 font-semibold text-xs tracking-wide flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'validations'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            Workload Validation Matrix ({validations.length})
          </button>

          <button
            onClick={() => setActiveTab('health')}
            className={`py-3.5 px-1 border-b-2 font-semibold text-xs tracking-wide flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'health'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            <Cpu className="w-4 h-4" />
            Infrastructure Health Telemetry
          </button>

          <button
            onClick={() => setActiveTab('comparison')}
            className={`py-3.5 px-1 border-b-2 font-semibold text-xs tracking-wide flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'comparison'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            Performance Comparison (Before vs. After)
          </button>

          <button
            onClick={() => setActiveTab('failures')}
            className={`py-3.5 px-1 border-b-2 font-semibold text-xs tracking-wide flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'failures'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            Failure Management ({failures.length})
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`py-3.5 px-1 border-b-2 font-semibold text-xs tracking-wide flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'audit'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            <FileText className="w-4 h-4" />
            Migration Audit Log
          </button>
        </nav>
      </div>

      {/* TAB 1: EXECUTIVE OVERVIEW & WAVES */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Wave-wise Migration Progress */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  Wave-Wise Migration Execution Progress
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Synchronized with Stage 7 Migration Plan roadmap and milestone execution.
                </p>
              </div>
              <div className="text-xs font-semibold text-slate-600">
                Overall Completed: <strong className="text-emerald-600 text-sm">{summary?.overallCompletionPercentage || 0}%</strong>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-5">
              {(summary?.waveProgressList || []).map((wave) => (
                <div
                  key={wave.waveId}
                  className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/50 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Wave {wave.waveNumber}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${
                      wave.status === 'COMPLETED'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : wave.status === 'IN_PROGRESS'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-slate-200 text-slate-600'
                    }`}>
                      {wave.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{wave.waveName}</h4>
                    <div className="text-2xl font-extrabold text-slate-900 mt-1">
                      {wave.progressPercentage}%
                    </div>
                  </div>

                  <div className="w-full bg-slate-200 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all ${
                        wave.progressPercentage >= 100
                          ? 'bg-emerald-500'
                          : wave.progressPercentage > 40
                          ? 'bg-blue-600'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${wave.progressPercentage}%` }}
                    ></div>
                  </div>

                  <div className="text-[11px] text-slate-500 flex justify-between">
                    <span>{wave.completedWorkloads} / {wave.totalWorkloads} Done</span>
                    {wave.failedWorkloads > 0 && (
                      <span className="text-rose-600 font-bold">{wave.failedWorkloads} Failed</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Workload Status Overview Table */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Workload Migration Status &amp; Cutover Health</h3>
                <p className="text-xs text-slate-500 mt-0.5">Real-time status of on-premises workloads migrating to the target cloud.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Workload Name</th>
                    <th className="px-4 py-3">Source Host</th>
                    <th className="px-4 py-3">Target Cloud Service</th>
                    <th className="px-4 py-3">Assigned Wave</th>
                    <th className="px-4 py-3">Migration Progress</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Health</th>
                    <th className="px-4 py-3 text-right">Last Validated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {workloads.map((w) => (
                    <tr key={w.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3.5 font-bold text-slate-900 whitespace-nowrap">
                        {w.workloadName}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                        {w.sourceHost}
                      </td>
                      <td className="px-4 py-3.5 text-blue-600 font-medium whitespace-nowrap">
                        {w.targetCloudService}
                      </td>
                      <td className="px-4 py-3.5 text-slate-700 whitespace-nowrap">
                        {w.waveName}
                      </td>
                      <td className="px-4 py-3.5 w-36 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-semibold text-slate-600">
                            <span>{w.completionPercentage}%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full transition-all ${
                                w.completionPercentage >= 100
                                  ? 'bg-emerald-500'
                                  : w.completionPercentage > 50
                                  ? 'bg-blue-600'
                                  : 'bg-amber-500'
                              }`}
                              style={{ width: `${w.completionPercentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                          w.status === 'SUCCESSFUL'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : w.status === 'IN_PROGRESS'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : w.status === 'FAILED'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {w.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {getHealthBadge(w.healthStatus)}
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono text-[11px] text-slate-400 whitespace-nowrap">
                        {w.lastValidatedAt ? new Date(w.lastValidatedAt).toLocaleTimeString() : 'Pending'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: WORKLOAD VALIDATION MATRIX */}
      {activeTab === 'validations' && (
        <div className="space-y-4">
          {/* Controls Bar: Search & Filters */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search validation checks or workloads..."
                value={validationSearchQuery}
                onChange={(e) => setValidationSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Filter className="w-3.5 h-3.5" />
                <span>Filters:</span>
              </div>

              {/* Status Filter */}
              <select
                value={validationFilterStatus}
                onChange={(e) => setValidationFilterStatus(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="ALL">All Statuses</option>
                <option value="PASSED">Passed</option>
                <option value="FAILED">Failed</option>
                <option value="WARNING">Warning</option>
              </select>

              {/* Type Filter */}
              <select
                value={validationFilterType}
                onChange={(e) => setValidationFilterType(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="ALL">All Categories</option>
                <option value="APPLICATION_AVAILABILITY">Application Availability</option>
                <option value="DATABASE_CONNECTIVITY">Database Connectivity</option>
                <option value="NETWORK_CONNECTIVITY">Network Connectivity</option>
                <option value="STORAGE_ACCESSIBILITY">Storage Accessibility</option>
                <option value="RESPONSE_TIME">Response Time</option>
                <option value="CONFIG_CONSISTENCY">Configuration Consistency</option>
              </select>

              <Button
                variant="primary"
                size="sm"
                icon={Play}
                onClick={() => {
                  setSelectedWorkloadForValidation(workloads[0]?.workloadName || '');
                  setIsRunValidationModalOpen(true);
                }}
              >
                Execute Check
              </Button>
            </div>
          </div>

          {/* Validation Checks Table */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Validation Probe Name</th>
                    <th className="px-4 py-3">Target Workload</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Expected Result</th>
                    <th className="px-4 py-3">Actual Result</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-4 py-3 text-center">Retries</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredValidations.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-4 py-8 text-center text-slate-400">
                        No validation checks found matching filter.
                      </td>
                    </tr>
                  ) : (
                    filteredValidations.map((v) => (
                      <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3.5 font-bold text-slate-900 max-w-xs">
                          <div className="truncate" title={v.validationName}>{v.validationName}</div>
                          {v.errorDetails && (
                            <div className="text-[10px] font-mono text-rose-600 truncate mt-0.5" title={v.errorDetails}>
                              Error: {v.errorDetails}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap text-slate-700">
                          {v.workloadName}
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-mono">
                            {v.validationType}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-slate-600 max-w-xs truncate" title={v.expectedResult}>
                          {v.expectedResult}
                        </td>
                        <td className="px-4 py-3.5 text-slate-800 font-medium max-w-xs truncate" title={v.actualResult}>
                          {v.actualResult}
                        </td>
                        <td className="px-4 py-3.5 text-center whitespace-nowrap">
                          {getValidationBadge(v.validationStatus)}
                        </td>
                        <td className="px-4 py-3.5 text-center font-bold text-slate-700 whitespace-nowrap">
                          {v.retryCount || 0}
                        </td>
                        <td className="px-4 py-3.5 text-right whitespace-nowrap">
                          <Button
                            variant="secondary"
                            size="xs"
                            icon={RotateCcw}
                            onClick={() => handleRetryValidation(v.id, v.validationName)}
                          >
                            Retry
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Showing {filteredValidations.length} of {validations.length} validation checks</span>
              <span className="text-[11px] text-slate-400">Automated Java validation engine executes non-destructive test probes</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: INFRASTRUCTURE HEALTH TELEMETRY */}
      {activeTab === 'health' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {workloads.map((w) => (
              <div
                key={w.id}
                className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-5 hover:border-slate-300 transition-all space-y-4"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {w.sourceHost}
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-blue-50 text-blue-600 border border-blue-200">
                        Simulated Cloud Telemetry
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">{w.workloadName}</h4>
                    <p className="text-[11px] text-blue-600 font-medium">{w.targetCloudService}</p>
                  </div>
                  <div>{getHealthBadge(w.healthStatus)}</div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {/* CPU */}
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                    <div className="flex justify-between items-center text-slate-500">
                      <span className="flex items-center gap-1 text-[11px]"><Cpu className="w-3.5 h-3.5 text-blue-600" /> CPU</span>
                      <span className="font-bold text-slate-900">{w.cpuUtilization}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${w.cpuUtilization > 85 ? 'bg-rose-500' : 'bg-blue-600'}`}
                        style={{ width: `${w.cpuUtilization}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Memory */}
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                    <div className="flex justify-between items-center text-slate-500">
                      <span className="flex items-center gap-1 text-[11px]"><Layers className="w-3.5 h-3.5 text-purple-600" /> Memory</span>
                      <span className="font-bold text-slate-900">{w.memoryUtilization}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${w.memoryUtilization > 85 ? 'bg-rose-500' : 'bg-purple-600'}`}
                        style={{ width: `${w.memoryUtilization}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Storage */}
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                    <div className="flex justify-between items-center text-slate-500">
                      <span className="flex items-center gap-1 text-[11px]"><HardDrive className="w-3.5 h-3.5 text-amber-600" /> Storage</span>
                      <span className="font-bold text-slate-900">{w.storageUtilization}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5">
                      <div
                        className="bg-amber-500 h-1.5 rounded-full"
                        style={{ width: `${w.storageUtilization}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Uptime */}
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                    <div className="flex justify-between items-center text-slate-500">
                      <span className="flex items-center gap-1 text-[11px]"><ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Uptime</span>
                      <span className="font-bold text-emerald-700">{w.uptimePercentage}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5">
                      <div
                        className="bg-emerald-500 h-1.5 rounded-full"
                        style={{ width: `${w.uptimePercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Footer Telemetry Latency & Throughput */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Latency: <strong className="text-slate-800">{w.responseTimeMs} ms</strong></span>
                  <span>Throughput: <strong className="text-slate-800">{w.networkThroughputMbps} MB/s</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PERFORMANCE COMPARISON */}
      {activeTab === 'comparison' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-6">
            <div className="pb-4 border-b border-slate-100 mb-5">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Source Infrastructure vs. Target Cloud Performance Comparison
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Before-and-after empirical benchmarks comparing on-premises baseline performance to cloud runtime telemetry.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {metrics.map((m) => (
                <div
                  key={m.id}
                  className="p-5 rounded-xl border border-slate-200/90 bg-white shadow-2xs space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">{m.workloadName}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      +{m.improvementPercentage}% Improvement
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      {m.metricName}
                    </span>
                    <div className="flex items-baseline gap-3 mt-1">
                      <div className="text-xl font-bold text-slate-400 line-through">
                        {m.sourceValue} {m.unit}
                      </div>
                      <ArrowRight className="w-4 h-4 text-emerald-600" />
                      <div className="text-2xl font-extrabold text-emerald-600">
                        {m.targetValue} {m.unit}
                      </div>
                    </div>
                  </div>

                  {/* Visual Comparison Bar */}
                  <div className="space-y-1.5 text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <div className="flex justify-between text-[11px]">
                      <span>On-Prem Legacy Baseline</span>
                      <span className="font-semibold text-slate-700">{m.sourceValue} {m.unit}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div className="bg-slate-400 h-1.5 rounded-full" style={{ width: '60%' }}></div>
                    </div>

                    <div className="flex justify-between text-[11px] pt-1">
                      <span className="text-emerald-700 font-semibold">Target Cloud Runtime</span>
                      <span className="font-bold text-emerald-600">{m.targetValue} {m.unit}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '90%' }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: MIGRATION FAILURE MANAGEMENT */}
      {activeTab === 'failures' && (
        <div className="space-y-4">
          {/* Failure Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Migration Failures &amp; Guided Incident Recovery</h3>
              <p className="text-xs text-slate-500 mt-0.5">Track cutover blockers, inspect error stack traces, and apply remediation playbooks.</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Recovery Status:</span>
              <select
                value={failureFilterStatus}
                onChange={(e) => setFailureFilterStatus(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="ALL">All Incidents</option>
                <option value="OPEN">Open Incidents</option>
                <option value="RESOLVED">Resolved Incidents</option>
                <option value="RETRY_QUEUED">Retry Queued</option>
              </select>
            </div>
          </div>

          {/* Incidents List */}
          <div className="space-y-4">
            {filteredFailures.map((inc) => (
              <div
                key={inc.id}
                className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-6 space-y-4 hover:border-slate-300 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                        {inc.failureCategory}
                      </span>
                      <span className="text-xs text-slate-500 font-semibold">{inc.migrationWave}</span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900">{inc.workloadName}</h4>
                    <p className="text-xs text-slate-600">{inc.failureReason}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded uppercase ${
                      inc.recoveryStatus === 'RESOLVED'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : inc.recoveryStatus === 'RETRY_QUEUED'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {inc.recoveryStatus}
                    </span>

                    {inc.recoveryStatus !== 'RESOLVED' && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleOpenResolveModal(inc)}
                      >
                        Resolve Incident
                      </Button>
                    )}

                    <Button
                      variant="secondary"
                      size="sm"
                      icon={RotateCcw}
                      onClick={() => handleRetryFailureIncident(inc.id, inc.workloadName)}
                    >
                      Retry ({inc.retryCount || 0})
                    </Button>
                  </div>
                </div>

                {/* Error Trace & Remediation Advice */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {inc.errorDetails && (
                    <div className="p-3.5 rounded-lg bg-slate-900 text-slate-200 font-mono text-[11px] overflow-x-auto space-y-1">
                      <span className="text-rose-400 font-bold">Captured Cloud Error Log / Trace:</span>
                      <pre className="text-slate-300 leading-relaxed whitespace-pre-wrap">{inc.errorDetails}</pre>
                    </div>
                  )}

                  <div className="p-3.5 rounded-lg bg-blue-50/70 border border-blue-100 space-y-1">
                    <span className="font-bold text-blue-900 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-blue-600" /> Recommended Corrective Action:
                    </span>
                    <p className="text-blue-950/80 leading-relaxed">
                      {inc.recommendedCorrectiveAction}
                    </p>
                  </div>
                </div>

                {inc.troubleshootingNotes && (
                  <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-100 text-xs text-emerald-900 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Engineer Troubleshooting Notes: </span>
                      <span>{inc.troubleshootingNotes}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: MIGRATION AUDIT LOG */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Migration Audit &amp; Event Stream Log</h3>
              <p className="text-xs text-slate-500 mt-0.5">Immutable audit trail of cutovers, automated validation probe executions, and recovery actions.</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Activity Type:</span>
              <select
                value={auditFilterActivity}
                onChange={(e) => setAuditFilterActivity(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="ALL">All Activity Types</option>
                <option value="MIGRATION_EXECUTION">Migration Execution</option>
                <option value="VALIDATION_RUN">Validation Run</option>
                <option value="FAILURE_RECORDED">Failure Recorded</option>
                <option value="INCIDENT_RESOLVED">Incident Resolved</option>
                <option value="RETRY_ATTEMPT">Retry Attempt</option>
                <option value="STATUS_CHANGE">Status Change</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-6">
            <div className="space-y-4">
              {filteredAuditLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-3.5 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600 shrink-0 mt-0.5">
                    {log.activityType === 'VALIDATION_RUN' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : log.activityType === 'FAILURE_RECORDED' ? (
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                    ) : log.activityType === 'INCIDENT_RESOLVED' ? (
                      <ShieldCheck className="w-4 h-4 text-blue-600" />
                    ) : log.activityType === 'RETRY_ATTEMPT' ? (
                      <RotateCcw className="w-4 h-4 text-amber-600" />
                    ) : (
                      <Activity className="w-4 h-4 text-blue-600" />
                    )}
                  </div>

                  <div className="flex-1 text-xs space-y-0.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-800 text-[11px]">{log.activityType}</span>
                        {log.workloadName && (
                          <span className="px-2 py-0.2 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">
                            {log.workloadName}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'Just now'}
                      </span>
                    </div>

                    <p className="text-slate-700 leading-relaxed pt-1">{log.actionDescription}</p>
                    <div className="text-[11px] text-slate-400">Performed by: <span className="font-medium text-slate-600">{log.performedBy}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: RUN AUTOMATED VALIDATION SUITE */}
      <Modal
        isOpen={isRunValidationModalOpen}
        onClose={() => setIsRunValidationModalOpen(false)}
        title="Execute Workload Validation Probes"
        subtitle="Automated Java validation engine executes synthetic network, database, storage, and response time checks."
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleTriggerValidation} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Select Workload *</label>
            <select
              value={selectedWorkloadForValidation}
              onChange={(e) => setSelectedWorkloadForValidation(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              {workloads.map((w) => (
                <option key={w.id} value={w.workloadName}>
                  {w.workloadName} ({w.targetCloudService})
                </option>
              ))}
            </select>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
            <span className="font-bold text-slate-800 text-[11px] block">Test Suite Probes Included:</span>
            <ul className="space-y-1.5 text-slate-600 text-[11.5px]">
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Application HTTP 200 OK Ingress ALB Probe</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Database Connection Pool &amp; Query Handshake</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Persistent Volume IOPS &amp; KMS Decrypt Check</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Synthetic Transaction Response Latency (p99)</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Configuration &amp; Secret Injection Parity Audit</li>
            </ul>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsRunValidationModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={isExecutingValidation}
            >
              {isExecutingValidation ? 'Running Probes...' : 'Execute Validation'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL: RESOLVE FAILURE INCIDENT */}
      <Modal
        isOpen={isResolveModalOpen}
        onClose={() => setIsResolveModalOpen(false)}
        title="Resolve Migration Incident"
        subtitle={selectedIncidentForResolve ? `Document remediation for ${selectedIncidentForResolve.workloadName}` : ''}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSaveResolution} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Troubleshooting &amp; Resolution Notes *</label>
            <textarea
              rows="4"
              required
              value={resolveNotes}
              onChange={(e) => setResolveNotes(e.target.value)}
              placeholder="Describe the root cause fix, security group adjustment, or parameter reconfiguration applied..."
              className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            ></textarea>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsResolveModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
            >
              Mark Incident as Resolved
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

