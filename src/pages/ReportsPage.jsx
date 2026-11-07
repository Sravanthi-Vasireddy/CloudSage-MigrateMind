import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Printer,
  CheckCircle2,
  Share2,
  UserCheck,
  Award,
  Sparkles,
  Server,
  DollarSign,
  ShieldCheck,
  Activity,
  Layers,
  ArrowRight,
  Plus,
  Trash2,
  Eye,
  Calendar,
  ExternalLink,
  ChevronRight,
  Info,
  Clock,
  Building2,
  FileSpreadsheet
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { StatCard } from '../components/common/StatCard';
import { reportsApi } from '../services/reportsApi';

export const ReportsPage = () => {
  const { currentProject, showToast } = useProject();

  const [activeTab, setActiveTab] = useState('viewer'); // 'viewer' | 'history'
  const [selectedReportType, setSelectedReportType] = useState('COMPLETE_ENTERPRISE');
  const [selectedProvider, setSelectedProvider] = useState('AWS');

  const [loading, setLoading] = useState(true);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadingCsv, setDownloadingCsv] = useState(false);

  // Core Data
  const [projectStats, setProjectStats] = useState(null);
  const [completeReport, setCompleteReport] = useState(null);
  const [reportHistory, setReportHistory] = useState([]);

  // Generate Report Modal
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [generateFormData, setGenerateFormData] = useState({
    reportTitle: '',
    reportType: 'COMPLETE_ENTERPRISE',
    organizationName: 'Acme Retail Enterprise & Global Financial Services',
    selectedCloudProvider: 'AWS',
    version: 'v3.0 Final'
  });

  useEffect(() => {
    loadAllReportData();
  }, [selectedProvider]);

  const loadAllReportData = async () => {
    setLoading(true);
    try {
      const [statsRes, reportRes, historyRes] = await Promise.all([
        reportsApi.getProjectStatistics(),
        reportsApi.getCompleteMigrationReport(selectedProvider),
        reportsApi.getReportHistory()
      ]);

      setProjectStats(statsRes);
      setCompleteReport(reportRes);
      setReportHistory(historyRes);
    } catch (err) {
      console.error('Failed to load reports:', err);
      showToast('Error loading migration reports.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    setDownloadingPdf(true);
    showToast('Compiling high-resolution PDF with executive scorecard and technical blueprints...');
    try {
      await reportsApi.downloadPdf(1, completeReport?.reportTitle || 'CloudSage_Master_Migration_Blueprint');
      showToast('Enterprise PDF generated and downloaded successfully.');
    } catch (err) {
      console.error(err);
      showToast('Error generating PDF.');
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleDownloadCsv = async () => {
    setDownloadingCsv(true);
    showToast('Exporting structured migration data to RFC 4180 CSV...');
    try {
      await reportsApi.downloadCsv(1, completeReport?.reportTitle || 'CloudSage_Migration_Data');
      showToast('Structured CSV dataset exported successfully.');
    } catch (err) {
      console.error(err);
      showToast('Error generating CSV.');
    } finally {
      setDownloadingCsv(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleOpenGenerateModal = () => {
    setGenerateFormData({
      reportTitle: `Enterprise ${selectedProvider} Cloud Migration Master Dossier`,
      reportType: selectedReportType,
      organizationName: projectStats?.clientName || 'Acme Retail Enterprise & Global Financial Services',
      selectedCloudProvider: selectedProvider,
      version: 'v3.0 Master Release'
    });
    setIsGenerateModalOpen(true);
  };

  const handleSaveGenerateReport = async (e) => {
    e.preventDefault();
    try {
      await reportsApi.generateReport(generateFormData);
      showToast('New enterprise report generated and archived to history.');
      setIsGenerateModalOpen(false);
      await loadAllReportData();
    } catch (err) {
      console.error(err);
      showToast('Failed to generate report.');
    }
  };

  const handleDeleteHistoryReport = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete report '${title}'?`)) return;
    try {
      await reportsApi.deleteReport(id);
      showToast('Report deleted from history.');
      await loadAllReportData();
    } catch (err) {
      console.error(err);
      showToast('Failed to delete report.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
            <Award className="w-4 h-4 text-blue-600" />
            Stage 10 – Final Migration Report &amp; Enterprise Documentation
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            Cloud Migration Deliverables &amp; Governance Blueprints
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-4xl">
            End-to-end multi-stage synthesis uniting Stage 3 Infrastructure Discovery, Stage 4 6Rs Assessment, Stage 5 Target Architecture, 
            Stage 6 FinOps TCO, Stage 7 Execution Waves, Stage 8 Risk Scoring, and Stage 9 Live Monitoring.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-50 text-xs font-semibold">
            {['AWS', 'AZURE', 'GCP'].map((p) => (
              <button
                key={p}
                onClick={() => setSelectedProvider(p)}
                className={`px-2.5 py-1 rounded cursor-pointer transition-all ${
                  selectedProvider === p ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <Button
            variant="secondary"
            size="sm"
            icon={Printer}
            onClick={handlePrint}
          >
            Print
          </Button>

          <Button
            variant="secondary"
            size="sm"
            icon={FileSpreadsheet}
            loading={downloadingCsv}
            onClick={handleDownloadCsv}
          >
            Export CSV
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={Download}
            loading={downloadingPdf}
            onClick={handleDownloadPdf}
          >
            Download PDF
          </Button>

          <Button
            variant="secondary"
            size="sm"
            icon={Plus}
            onClick={handleOpenGenerateModal}
          >
            New Report
          </Button>
        </div>
      </div>

      {/* Statutory Governance & Legal Advisory Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white px-5 py-3.5 rounded-xl shadow-sm border border-blue-950/40 flex items-start gap-3.5">
        <div className="p-2 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-400/30 shrink-0 mt-0.5">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div className="space-y-0.5 text-xs">
          <div className="font-semibold text-blue-200 tracking-wide flex items-center gap-2">
            <span>Executive Governance Dossier &bull; Digital Sign-Off Ready</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-200">
              Steering Committee Approved
            </span>
          </div>
          <p className="text-slate-300 leading-relaxed text-[11.5px]">
            {completeReport?.statutoryDisclaimer || "Notice: This documentation and assessment report constitutes technical migration guidance and does not provide official regulatory certification or legal compliance validation."}
          </p>
        </div>
      </div>

      {/* Top Executive KPI Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Overall Readiness"
          value={`${projectStats?.overallProjectReadinessScore || 88.5}%`}
          subtext="Migration Master Index"
          icon={Award}
          color="emerald"
        />

        <StatCard
          title="Assessed Workloads"
          value={projectStats?.totalWorkloadsAssessed || 36}
          subtext={`${projectStats?.totalServersCount || 48} Discovery Servers`}
          icon={Server}
          color="blue"
        />

        <StatCard
          title="Annual Savings"
          value={`$${(projectStats?.estimatedAnnualSavings || 90600).toLocaleString()}`}
          subtext={`${projectStats?.savingsPercentage || 38.1}% Run-rate reduction`}
          icon={DollarSign}
          color="purple"
        />

        <StatCard
          title="Compliance Score"
          value={`${projectStats?.complianceReadinessPercentage || 91.7}%`}
          subtext="GDPR, ISO, SOC2, HIPAA"
          icon={ShieldCheck}
          color="sky"
        />

        <StatCard
          title="Execution Progress"
          value={`${projectStats?.migrationProgressPercentage || 46.7}%`}
          subtext={`${projectStats?.totalWaves || 5} Waves defined`}
          icon={Activity}
          color="amber"
        />
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-6">
          <button
            onClick={() => setActiveTab('viewer')}
            className={`py-3.5 px-1 border-b-2 font-semibold text-xs tracking-wide flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'viewer'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            <FileText className="w-4 h-4" />
            Master Blueprint Viewer
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`py-3.5 px-1 border-b-2 font-semibold text-xs tracking-wide flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            <Clock className="w-4 h-4" />
            Report History &amp; Archives ({reportHistory.length})
          </button>
        </nav>
      </div>

      {/* TAB 1: MASTER BLUEPRINT VIEWER */}
      {activeTab === 'viewer' && (
        <div className="space-y-6">
          {/* Document Header Card */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-6 space-y-4">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="blue" size="xs">
                    {completeReport?.reportType || 'COMPLETE_ENTERPRISE'}
                  </Badge>
                  <span className="text-xs font-mono font-bold text-slate-500">
                    {completeReport?.version || 'v2.4 Final'}
                  </span>
                  <Badge variant="emerald" size="xs">
                    {completeReport?.approvalStatus || 'APPROVED'}
                  </Badge>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mt-2">
                  {completeReport?.reportTitle || 'Enterprise Cloud Modernization & Migration Master Blueprint'}
                </h2>
                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500 mt-1">
                  <span>Client Organization: <strong className="text-slate-800">{completeReport?.organizationName}</strong></span>
                  <span>Target Provider: <strong className="text-blue-600 font-bold">{selectedProvider}</strong></span>
                  <span>Generated: <strong className="text-slate-700">{completeReport?.generatedAt}</strong></span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-right space-y-1 shrink-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Lead Architect</span>
                <span className="text-xs font-bold text-slate-800 block">{completeReport?.author}</span>
                <span className="text-[11px] text-slate-500 block">Reviewer: {completeReport?.reviewer}</span>
              </div>
            </div>

            {/* SECTION 1: EXECUTIVE SUMMARY */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-blue-700 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                1. Executive Summary &amp; Strategic Rationale
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                In partnership with HCLTech Cloud Native Advisory, CloudSage – MigrateMind has completed an automated,
                multi-stage cloud migration discovery and architectural synthesis for <strong>{completeReport?.organizationName}</strong>.
                Migrating on-premises workloads to <strong>{selectedProvider}</strong> unlocks high availability, 
                streamlined FinOps unit economics, continuous CIS security posture enforcement, and eliminates aging datacenter hardware debt.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 space-y-2">
                  <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider block">Key Business Outcomes</span>
                  <ul className="space-y-1.5 text-slate-600">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> ${projectStats?.estimatedAnnualSavings?.toLocaleString()} net annual operational savings ({projectStats?.savingsPercentage}% TCO reduction).</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Payback breakeven achieved in {projectStats?.paybackPeriodMonths} months with 185.4% 5-year cumulative ROI.</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 99.99% high availability with Multi-AZ automated zero-downtime database failover.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 space-y-2">
                  <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider block">Steering Recommendations</span>
                  <ul className="space-y-1.5 text-slate-600">
                    <li className="flex items-center gap-2"><ChevronRight className="w-3.5 h-3.5 text-blue-600" /> Proceed with Wave 2 execution prioritizing Amazon EKS container migration.</li>
                    <li className="flex items-center gap-2"><ChevronRight className="w-3.5 h-3.5 text-blue-600" /> Utilize AWS SCT tool to convert 82% of legacy database stored procedures.</li>
                    <li className="flex items-center gap-2"><ChevronRight className="w-3.5 h-3.5 text-blue-600" /> Enforce 3-Year Committed Use Savings Plans to capture maximum 42% discounts.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* SECTION 2: 6R STRATEGY PORTFOLIO */}
            <div className="space-y-3 pt-6 border-t border-slate-100">
              <h3 className="text-sm font-bold uppercase tracking-wider text-blue-700 flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                2. 6Rs Workload Migration Strategy Portfolio
              </h3>
              <p className="text-xs text-slate-600">
                Workloads classified via Stage 4 empirical heuristics evaluating CPU/RAM utilization, schema complexity, and 12-factor cloud maturity:
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { name: 'Rehost', count: projectStats?.rehostCount || 16, desc: 'Lift & Shift', color: 'bg-blue-50 text-blue-700 border-blue-200' },
                  { name: 'Replatform', count: projectStats?.replatformCount || 12, desc: 'Containerize (EKS)', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                  { name: 'Refactor', count: projectStats?.refactorCount || 5, desc: 'Cloud-Native (Aurora)', color: 'bg-purple-50 text-purple-700 border-purple-200' },
                  { name: 'Repurchase', count: projectStats?.repurchaseCount || 3, desc: 'SaaS Transition', color: 'bg-sky-50 text-sky-700 border-sky-200' },
                  { name: 'Retire', count: projectStats?.retireCount || 2, desc: 'Decommission', color: 'bg-slate-100 text-slate-700 border-slate-200' },
                  { name: 'Retain', count: projectStats?.retainCount || 2, desc: 'On-Prem Peering', color: 'bg-amber-50 text-amber-700 border-amber-200' },
                ].map((s) => (
                  <div key={s.name} className={`p-3.5 rounded-xl border ${s.color} text-center space-y-1`}>
                    <span className="text-[10px] font-bold uppercase tracking-wider block">{s.name}</span>
                    <span className="text-2xl font-extrabold block">{s.count}</span>
                    <span className="text-[10px] opacity-75 block">{s.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 3: INFRASTRUCTURE & TARGET ARCHITECTURE SIZING */}
            <div className="space-y-3 pt-6 border-t border-slate-100">
              <h3 className="text-sm font-bold uppercase tracking-wider text-blue-700 flex items-center gap-2">
                <Server className="w-4 h-4 text-blue-600" />
                3. Infrastructure Baseline vs. Target Cloud Architecture Sizing
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Source Baseline */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2.5">
                  <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider block">
                    Source Datacenter Baseline (On-Premises)
                  </span>
                  <div className="space-y-1.5 text-slate-600">
                    <div className="flex justify-between"><span>Physical &amp; Virtual Servers:</span> <strong className="text-slate-900">{projectStats?.totalServersCount} Servers</strong></div>
                    <div className="flex justify-between"><span>Compute Capacity:</span> <strong className="text-slate-900">{projectStats?.totalCpuCores} vCPU Cores &bull; {projectStats?.totalRamGB} GB RAM</strong></div>
                    <div className="flex justify-between"><span>Persistent Storage:</span> <strong className="text-slate-900">{projectStats?.totalStorageGB} GB SAN/NAS</strong></div>
                    <div className="flex justify-between"><span>Database Engines:</span> <strong className="text-slate-900">{projectStats?.totalDatabasesCount} Instances (Oracle EE, SQL Server)</strong></div>
                    <div className="flex justify-between"><span>Monthly Run-rate:</span> <strong className="text-slate-900">${projectStats?.onPremisesMonthlyCost?.toLocaleString()} / mo</strong></div>
                  </div>
                </div>

                {/* Target Architecture */}
                <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/30 space-y-2.5">
                  <span className="font-bold text-blue-900 text-[11px] uppercase tracking-wider block">
                    Target Cloud Modernization Architecture ({selectedProvider})
                  </span>
                  <div className="space-y-1.5 text-blue-950">
                    <div className="flex justify-between"><span>VPC Network Topology:</span> <strong className="text-blue-900 font-mono">{projectStats?.targetVpcCidr} (Multi-AZ Hub/Spoke)</strong></div>
                    <div className="flex justify-between"><span>Managed Container Compute:</span> <strong className="text-blue-900">{projectStats?.primaryComputePlatform}</strong></div>
                    <div className="flex justify-between"><span>Cloud-Native Database:</span> <strong className="text-blue-900">{projectStats?.primaryDatabasePlatform}</strong></div>
                    <div className="flex justify-between"><span>Zero-Trust Security:</span> <strong className="text-blue-900">AWS KMS CMK &bull; Private Subnets &bull; WAF v2</strong></div>
                    <div className="flex justify-between"><span>Cloud Run-rate (3-Yr Plan):</span> <strong className="text-emerald-600 font-bold">${projectStats?.estimatedCloudMonthlyCost?.toLocaleString()} / mo</strong></div>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 4: FINOPS TCO & SAVINGS ANALYSIS */}
            <div className="space-y-3 pt-6 border-t border-slate-100">
              <h3 className="text-sm font-bold uppercase tracking-wider text-blue-700 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-blue-600" />
                4. FinOps Cost Analysis &amp; Multi-Cloud Economics
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
                <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Current Monthly</span>
                  <div className="text-xl font-bold text-slate-500">${projectStats?.onPremisesMonthlyCost?.toLocaleString()}</div>
                  <span className="text-[10px] text-slate-400">Datacenter run-rate</span>
                </div>

                <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 shadow-2xs space-y-1">
                  <span className="text-[10px] font-bold uppercase text-blue-600">Target Monthly</span>
                  <div className="text-xl font-extrabold text-blue-600">${projectStats?.estimatedCloudMonthlyCost?.toLocaleString()}</div>
                  <span className="text-[10px] text-blue-500">3-Yr Committed rate</span>
                </div>

                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 shadow-2xs space-y-1">
                  <span className="text-[10px] font-bold uppercase text-emerald-600">Net Annual Savings</span>
                  <div className="text-xl font-extrabold text-emerald-600">${projectStats?.estimatedAnnualSavings?.toLocaleString()}</div>
                  <span className="text-[10px] text-emerald-600 font-bold">{projectStats?.savingsPercentage}% TCO reduction</span>
                </div>

                <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/50 shadow-2xs space-y-1">
                  <span className="text-[10px] font-bold uppercase text-purple-600">Payback Breakeven</span>
                  <div className="text-xl font-extrabold text-purple-600">{projectStats?.paybackPeriodMonths} Months</div>
                  <span className="text-[10px] text-purple-600 font-bold">ROI: {projectStats?.fiveYearRoiPercentage}%</span>
                </div>
              </div>
            </div>

            {/* SECTION 5: TIMELINE, SECURITY & VALIDATION POSTURE */}
            <div className="space-y-3 pt-6 border-t border-slate-100">
              <h3 className="text-sm font-bold uppercase tracking-wider text-blue-700 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                5. Execution Waves, Security Posture &amp; Validation Engine Results
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* Wave Progress */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider block">Execution Roadmap</span>
                  <div className="text-2xl font-extrabold text-slate-900">{projectStats?.migrationProgressPercentage}% Done</div>
                  <p className="text-[11px] text-slate-500">5 Waves planned across {projectStats?.plannedDuration}. 15 automated tasks configured.</p>
                </div>

                {/* Security Posture */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider block">Regulatory Compliance</span>
                  <div className="text-2xl font-extrabold text-emerald-600">{projectStats?.complianceReadinessPercentage}% Compliant</div>
                  <p className="text-[11px] text-slate-500">Audited across GDPR, ISO 27001, SOC 2, and HIPAA. {projectStats?.passedSecurityControlsCount} of {projectStats?.totalSecurityControlsCount} controls passed.</p>
                </div>

                {/* Validation Telemetry */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider block">Automated Validation</span>
                  <div className="text-2xl font-extrabold text-blue-600">{projectStats?.passedValidationsCount} Probes Passed</div>
                  <p className="text-[11px] text-slate-500">Synthetic HTTP, DB handshake, EBS IOPS, and latency p99 non-destructive health checks verified.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: REPORT HISTORY & ARCHIVES */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Archived Migration Reports &amp; Blueprints</h3>
              <p className="text-xs text-slate-500 mt-0.5">Immutable audit trail of generated business cases, technical dossiers, and compliance blueprints.</p>
            </div>

            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={handleOpenGenerateModal}
            >
              Generate New Report
            </Button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Report Title</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Provider</th>
                    <th className="px-4 py-3">Version</th>
                    <th className="px-4 py-3">Author / Lead</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Generated Date</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reportHistory.map((rep) => (
                    <tr key={rep.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3.5 font-bold text-slate-900 max-w-xs truncate" title={rep.reportTitle}>
                        {rep.reportTitle}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-mono">
                          {rep.reportType}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap font-bold text-blue-600">
                        {rep.selectedCloudProvider}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap font-mono text-slate-600">
                        {rep.version}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-slate-700 max-w-[140px] truncate" title={rep.author}>
                        {rep.author}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <Badge variant="emerald" size="xs">
                          {rep.approvalStatus}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap font-mono text-[11px] text-slate-400">
                        {new Date(rep.generatedAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => reportsApi.downloadPdf(rep.id, rep.reportTitle)}
                            title="Download PDF"
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => reportsApi.downloadCsv(rep.id, rep.reportTitle)}
                            title="Download CSV"
                            className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-slate-100 rounded transition-colors"
                          >
                            <FileSpreadsheet className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteHistoryReport(rep.id, rep.reportTitle)}
                            title="Delete Report"
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: GENERATE NEW REPORT */}
      <Modal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        title="Generate Enterprise Migration Report"
        subtitle="Compile and archive a comprehensive cloud modernization blueprint synthesizing all stages."
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSaveGenerateReport} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Report Title *</label>
            <input
              type="text"
              required
              value={generateFormData.reportTitle}
              onChange={(e) => setGenerateFormData({ ...generateFormData, reportTitle: e.target.value })}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Report Category *</label>
              <select
                value={generateFormData.reportType}
                onChange={(e) => setGenerateFormData({ ...generateFormData, reportType: e.target.value })}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs"
              >
                <option value="COMPLETE_ENTERPRISE">Complete Master Blueprint</option>
                <option value="EXECUTIVE_SUMMARY">Executive Business Case</option>
                <option value="TECHNICAL_ARCHITECTURE">Technical Architecture</option>
                <option value="FINOPS_COST_ANALYSIS">FinOps TCO &amp; Cost Analysis</option>
                <option value="SECURITY_COMPLIANCE">Security &amp; Compliance</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Cloud Provider *</label>
              <select
                value={generateFormData.selectedCloudProvider}
                onChange={(e) => setGenerateFormData({ ...generateFormData, selectedCloudProvider: e.target.value })}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs"
              >
                <option value="AWS">Amazon Web Services (AWS)</option>
                <option value="AZURE">Microsoft Azure</option>
                <option value="GCP">Google Cloud Platform (GCP)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Document Version</label>
              <input
                type="text"
                value={generateFormData.version}
                onChange={(e) => setGenerateFormData({ ...generateFormData, version: e.target.value })}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Organization Name</label>
              <input
                type="text"
                value={generateFormData.organizationName}
                onChange={(e) => setGenerateFormData({ ...generateFormData, organizationName: e.target.value })}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsGenerateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
            >
              Generate &amp; Archive
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
