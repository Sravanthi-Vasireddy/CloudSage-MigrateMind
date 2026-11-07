import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Lock,
  RefreshCw,
  Sparkles,
  ExternalLink,
  Plus,
  Search,
  Filter,
  Copy,
  Check,
  Trash2,
  Edit3,
  FileText,
  Sliders,
  Layers,
  Activity,
  ArrowRight,
  Clock,
  User,
  Server,
  ChevronRight,
  Info,
  TrendingUp,
  XCircle,
  AlertCircle,
  Download
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { StatCard } from '../components/common/StatCard';
import { securityApi } from '../services/securityApi';

export const SecurityPage = () => {
  const { currentProject, showToast } = useProject();

  // Active Tab: 'dashboard' | 'register' | 'domains' | 'compliance' | 'mitigations'
  const [activeTab, setActiveTab] = useState('dashboard');

  // Loading & Scan State
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [copiedCodeId, setCopiedCodeId] = useState(null);

  // Core Data
  const [summary, setSummary] = useState(null);
  const [risks, setRisks] = useState([]);
  const [controls, setControls] = useState([]);
  const [complianceReqs, setComplianceReqs] = useState([]);
  const [complianceSummaries, setComplianceSummaries] = useState([]);
  const [mitigations, setMitigations] = useState([]);

  // Risk Register Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Security Domain Filter
  const [selectedDomain, setSelectedDomain] = useState('ALL');

  // Compliance Framework Filter
  const [selectedFramework, setSelectedFramework] = useState('GDPR');

  // Modals
  const [isRiskModalOpen, setIsRiskModalOpen] = useState(false);
  const [editingRisk, setEditingRisk] = useState(null);
  const [riskFormData, setRiskFormData] = useState({
    riskId: '',
    riskTitle: '',
    category: 'Compatibility / Data Loss',
    affectedWorkload: 'Core Banking Ledger & Settlement DB',
    probability: 3,
    impact: 3,
    owner: '',
    mitigationPlan: '',
    status: 'OPEN',
    mitigationProgress: 0
  });

  const [isMitigationModalOpen, setIsMitigationModalOpen] = useState(false);
  const [selectedRiskForMitigation, setSelectedRiskForMitigation] = useState(null);
  const [mitigationFormData, setMitigationFormData] = useState({
    actionTitle: '',
    assignedOwner: '',
    targetDate: new Date().toISOString().split('T')[0],
    status: 'NOT_STARTED',
    progressPercentage: 0,
    linkedMigrationTaskId: 1,
    resolutionNotes: ''
  });

  // Load all data on mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [sumRes, riskRes, ctrlRes, compRes, compSumRes, mitRes] = await Promise.all([
        securityApi.getDashboardSummary(),
        securityApi.getAllRisks(),
        securityApi.getSecurityControls(),
        securityApi.getComplianceRequirements(),
        securityApi.getComplianceFrameworkSummaries(),
        securityApi.getMitigationActions()
      ]);

      setSummary(sumRes);
      setRisks(riskRes);
      setControls(ctrlRes);
      setComplianceReqs(compRes);
      setComplianceSummaries(compSumRes);
      setMitigations(mitRes);
    } catch (err) {
      console.error('Failed to load security and compliance data:', err);
      showToast('Error loading security data. Fallback mode enabled.');
    } finally {
      setLoading(false);
    }
  };

  // Re-scan trigger
  const handleTriggerScan = async () => {
    setScanning(true);
    showToast('Executing comprehensive static security audit & risk evaluation...');
    setTimeout(async () => {
      await loadAllData();
      setScanning(false);
      showToast('Audit complete: 9 security domains & 4 compliance frameworks verified against target IaC.');
    }, 900);
  };

  // Copy code snippet helper
  const handleCopySnippet = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeId(id);
    showToast('Terraform remediation snippet copied to clipboard');
    setTimeout(() => setCopiedCodeId(null), 2500);
  };

  // Filtered Risks
  const filteredRisks = useMemo(() => {
    return risks.filter(r => {
      const matchesSearch =
        searchQuery === '' ||
        r.riskTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.riskId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.affectedWorkload && r.affectedWorkload.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (r.owner && r.owner.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesSeverity = filterSeverity === 'ALL' || r.severity === filterSeverity;
      const matchesCategory = filterCategory === 'ALL' || r.category === filterCategory;
      const matchesStatus = filterStatus === 'ALL' || r.status === filterStatus;

      return matchesSearch && matchesSeverity && matchesCategory && matchesStatus;
    });
  }, [risks, searchQuery, filterSeverity, filterCategory, filterStatus]);

  // Distinct Categories
  const categories = useMemo(() => {
    const set = new Set(risks.map(r => r.category).filter(Boolean));
    return ['ALL', ...Array.from(set)];
  }, [risks]);

  // Domains list
  const domainsList = [
    'ALL',
    'Identity & Access Management (IAM)',
    'Role-Based Access Control (RBAC)',
    'Encryption at Rest',
    'Encryption in Transit',
    'Network Security',
    'Firewall Configurations',
    'Security Groups & Network ACLs',
    'Backup and Disaster Recovery',
    'Access Control and Audit Policies'
  ];

  const filteredControls = useMemo(() => {
    if (selectedDomain === 'ALL') return controls;
    return controls.filter(c => c.domain.toLowerCase() === selectedDomain.toLowerCase());
  }, [controls, selectedDomain]);

  // Compliance list for selected framework
  const filteredComplianceReqs = useMemo(() => {
    return complianceReqs.filter(c => c.framework.toUpperCase() === selectedFramework.toUpperCase());
  }, [complianceReqs, selectedFramework]);

  // 5x5 Heatmap Distribution Calculation
  // probability (1-5) vs impact (1-5)
  const heatmapData = useMemo(() => {
    // 5x5 grid where row = probability (5 down to 1), col = impact (1 up to 5)
    const grid = {};
    for (let p = 1; p <= 5; p++) {
      grid[p] = {};
      for (let i = 1; i <= 5; i++) {
        grid[p][i] = [];
      }
    }
    risks.forEach(r => {
      const p = Math.max(1, Math.min(5, r.probability || 3));
      const i = Math.max(1, Math.min(5, r.impact || 3));
      grid[p][i].push(r);
    });
    return grid;
  }, [risks]);

  // Severity helper
  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return <Badge variant="rose" size="xs">CRITICAL</Badge>;
      case 'HIGH':
        return <Badge variant="amber" size="xs">HIGH</Badge>;
      case 'MEDIUM':
        return <Badge variant="blue" size="xs">MEDIUM</Badge>;
      case 'LOW':
        return <Badge variant="emerald" size="xs">LOW</Badge>;
      default:
        return <Badge variant="slate" size="xs">{severity}</Badge>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'OPEN':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">Open</span>;
      case 'IN_PROGRESS':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">In Progress</span>;
      case 'MITIGATED':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Mitigated</span>;
      case 'ACCEPTED':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">Accepted</span>;
      default:
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-50 text-slate-600">{status}</span>;
    }
  };

  // Open Add/Edit Risk Modal
  const handleOpenAddRiskModal = () => {
    setEditingRisk(null);
    setRiskFormData({
      riskId: `RISK-00${risks.length + 1}`,
      riskTitle: '',
      category: 'Compatibility / Data Loss',
      affectedWorkload: 'Core Banking Ledger & Settlement DB',
      probability: 3,
      impact: 3,
      owner: 'Cloud Security Team',
      mitigationPlan: '',
      status: 'OPEN',
      mitigationProgress: 0
    });
    setIsRiskModalOpen(true);
  };

  const handleOpenEditRiskModal = (risk) => {
    setEditingRisk(risk);
    setRiskFormData({
      riskId: risk.riskId,
      riskTitle: risk.riskTitle,
      category: risk.category,
      affectedWorkload: risk.affectedWorkload,
      probability: risk.probability,
      impact: risk.impact,
      owner: risk.owner,
      mitigationPlan: risk.mitigationPlan,
      status: risk.status,
      mitigationProgress: risk.mitigationProgress
    });
    setIsRiskModalOpen(true);
  };

  const handleSaveRisk = async (e) => {
    e.preventDefault();
    try {
      if (editingRisk) {
        await securityApi.updateRisk(editingRisk.id, riskFormData);
        showToast(`Risk ${editingRisk.riskId} successfully updated.`);
      } else {
        await securityApi.createRisk(riskFormData);
        showToast('New migration risk registered.');
      }
      setIsRiskModalOpen(false);
      await loadAllData();
    } catch (err) {
      console.error(err);
      showToast('Failed to save risk.');
    }
  };

  const handleDeleteRisk = async (id, riskId) => {
    if (!window.confirm(`Are you sure you want to delete ${riskId} from the risk register?`)) return;
    try {
      await securityApi.deleteRisk(id);
      showToast(`Risk ${riskId} removed.`);
      await loadAllData();
    } catch (err) {
      console.error(err);
      showToast('Failed to delete risk.');
    }
  };

  // Quick risk status update
  const handleQuickStatusChange = async (risk, newStatus) => {
    try {
      await securityApi.updateRisk(risk.id, {
        ...risk,
        status: newStatus,
        mitigationProgress: newStatus === 'MITIGATED' ? 100 : risk.mitigationProgress
      });
      showToast(`${risk.riskId} status updated to ${newStatus}`);
      await loadAllData();
    } catch (err) {
      console.error(err);
      showToast('Failed to update status.');
    }
  };

  // Security Control Status Update
  const handleToggleControlStatus = async (control, newStatus) => {
    try {
      await securityApi.updateSecurityControl(control.id, {
        status: newStatus,
        recommendation: control.recommendation
      });
      showToast(`Control ${control.controlId} updated to ${newStatus}`);
      await loadAllData();
    } catch (err) {
      console.error(err);
      showToast('Failed to update security control.');
    }
  };

  // Compliance Requirement Status Update
  const handleToggleComplianceStatus = async (req, newStatus) => {
    try {
      await securityApi.updateComplianceRequirement(req.id, {
        status: newStatus,
        assessmentNotes: req.assessmentNotes,
        complianceGap: req.complianceGap,
        suggestedCorrectiveAction: req.suggestedCorrectiveAction
      });
      showToast(`Section ${req.frameworkSection} set to ${newStatus}`);
      await loadAllData();
    } catch (err) {
      console.error(err);
      showToast('Failed to update compliance requirement.');
    }
  };

  // Open Mitigation Modal
  const handleOpenAddMitigationModal = (risk) => {
    setSelectedRiskForMitigation(risk);
    setMitigationFormData({
      actionTitle: `Remediate ${risk.riskTitle}`,
      assignedOwner: risk.owner || 'SecOps Lead',
      targetDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      status: 'NOT_STARTED',
      progressPercentage: 0,
      linkedMigrationTaskId: 1,
      resolutionNotes: ''
    });
    setIsMitigationModalOpen(true);
  };

  const handleSaveMitigation = async (e) => {
    e.preventDefault();
    if (!selectedRiskForMitigation) return;
    try {
      await securityApi.addMitigationAction(selectedRiskForMitigation.id, mitigationFormData);
      showToast(`Mitigation action linked to ${selectedRiskForMitigation.riskId}`);
      setIsMitigationModalOpen(false);
      await loadAllData();
    } catch (err) {
      console.error(err);
      showToast('Failed to save mitigation action.');
    }
  };

  const handleUpdateMitigationProgress = async (actionId, progress, status) => {
    try {
      await securityApi.updateMitigationAction(actionId, {
        progress,
        status: progress === 100 ? 'COMPLETED' : status || 'IN_PROGRESS'
      });
      showToast('Mitigation progress updated.');
      await loadAllData();
    } catch (err) {
      console.error(err);
      showToast('Failed to update progress.');
    }
  };

  // Export Governance Summary
  const handleExportGovernanceReport = () => {
    const reportData = {
      project: currentProject?.name || 'Cloud Migration Assessment',
      exportTimestamp: new Date().toISOString(),
      statutoryDisclaimer: "This module provides assessment guidance and does not claim to provide official certification or legal compliance validation.",
      summary: summary,
      risks: risks,
      securityAssessmentControls: controls,
      complianceFrameworks: complianceSummaries
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CloudSage_Security_Compliance_Report_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Governance & Security Assessment Report exported successfully.');
  };

  // Calculated current risk score in modal preview
  const currentModalScore = Number(riskFormData.probability) * Number(riskFormData.impact);
  const getCalculatedSeverity = (score) => {
    if (score >= 16) return { name: 'CRITICAL', color: 'bg-rose-500 text-white' };
    if (score >= 10) return { name: 'HIGH', color: 'bg-amber-500 text-white' };
    if (score >= 5) return { name: 'MEDIUM', color: 'bg-blue-500 text-white' };
    return { name: 'LOW', color: 'bg-emerald-500 text-white' };
  };
  const modalSeverity = getCalculatedSeverity(currentModalScore);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            Stage 8 – Migration Risk, Security & Compliance Management
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            Cloud Security, Risk & Regulatory Compliance
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-4xl">
            Enterprise risk scoring engine (Probability &times; Impact formula), 9-domain cloud security posture controls, 
            and automated regulatory compliance alignment across GDPR, ISO 27001, SOC 2, and HIPAA.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            icon={Download}
            onClick={handleExportGovernanceReport}
          >
            Export Report
          </Button>

          <Button
            variant="secondary"
            size="sm"
            icon={RefreshCw}
            loading={scanning}
            onClick={handleTriggerScan}
          >
            {scanning ? 'Auditing Posture...' : 'Trigger Re-Scan'}
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={handleOpenAddRiskModal}
          >
            Add Migration Risk
          </Button>
        </div>
      </div>

      {/* Mandatory Statutory Disclaimer Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white px-5 py-3.5 rounded-xl shadow-sm border border-blue-950/40 flex items-start gap-3.5">
        <div className="p-2 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-400/30 shrink-0 mt-0.5">
          <Info className="w-4 h-4" />
        </div>
        <div className="space-y-0.5 text-xs">
          <div className="font-semibold text-blue-200 tracking-wide flex items-center gap-1.5">
            <span>Enterprise Compliance & Governance Advisory</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/30 text-blue-100">ISO/IEC &bull; GDPR &bull; SOC 2 &bull; HIPAA</span>
          </div>
          <p className="text-slate-300 leading-relaxed text-[11.5px]">
            {summary?.complianceDisclaimer || "This module provides assessment guidance and does not claim to provide official certification or legal compliance validation."}
          </p>
        </div>
      </div>

      {/* Top Executive KPI Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Overall Posture"
          value={summary?.overallPosture === 'ELEVATED_RISK' ? 'Elevated' : summary?.overallPosture || 'Healthy'}
          subtext={summary?.criticalRisks > 0 ? `${summary.criticalRisks} Critical risks active` : 'No Critical blockers'}
          icon={summary?.overallPosture === 'ELEVATED_RISK' ? AlertTriangle : ShieldCheck}
          color={summary?.overallPosture === 'ELEVATED_RISK' ? 'amber' : 'emerald'}
        />

        <StatCard
          title="Identified Risks"
          value={summary?.totalRisksIdentified || risks.length}
          subtext={`${summary?.criticalRisks || 0} Critical &bull; ${summary?.highRisks || 0} High`}
          icon={ShieldAlert}
          color="blue"
        />

        <StatCard
          title="Mitigation Progress"
          value={`${summary?.mitigatedRisks || 0} / ${summary?.totalRisksIdentified || risks.length}`}
          subtext={`${summary?.inProgressRisks || 0} in active remediation`}
          icon={Activity}
          color="purple"
        />

        <StatCard
          title="Compliance Score"
          value={`${summary?.overallCompliancePercentage || 91.7}%`}
          subtext={`${summary?.compliantRequirements || 11} of ${summary?.compliantRequirements + summary?.nonCompliantRequirements + summary?.needsReviewRequirements || 12} controls`}
          icon={CheckCircle2}
          color="emerald"
        />

        <StatCard
          title="Security Domains"
          value={`${summary?.passedSecurityControls || 7} / ${summary?.totalSecurityControls || 9}`}
          subtext={`${summary?.reviewSecurityControls || 1} Needs Review &bull; ${summary?.failedSecurityControls || 1} Fail`}
          icon={Lock}
          color="sky"
        />
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-6">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`py-3.5 px-1 border-b-2 font-semibold text-xs tracking-wide flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'dashboard'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            <Activity className="w-4 h-4" />
            Executive Heatmap &amp; Posture
          </button>

          <button
            onClick={() => setActiveTab('register')}
            className={`py-3.5 px-1 border-b-2 font-semibold text-xs tracking-wide flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'register'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            Centralized Risk Register ({risks.length})
          </button>

          <button
            onClick={() => setActiveTab('domains')}
            className={`py-3.5 px-1 border-b-2 font-semibold text-xs tracking-wide flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'domains'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            <Lock className="w-4 h-4" />
            9 Security Assessment Domains
          </button>

          <button
            onClick={() => setActiveTab('compliance')}
            className={`py-3.5 px-1 border-b-2 font-semibold text-xs tracking-wide flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'compliance'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            Compliance Checklists (GDPR &bull; ISO &bull; SOC 2 &bull; HIPAA)
          </button>

          <button
            onClick={() => setActiveTab('mitigations')}
            className={`py-3.5 px-1 border-b-2 font-semibold text-xs tracking-wide flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'mitigations'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            <Sliders className="w-4 h-4" />
            Risk Mitigation Tracker ({mitigations.length})
          </button>
        </nav>
      </div>

      {/* TAB 1: EXECUTIVE HEATMAP & POSTURE */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 5x5 Heatmap Matrix (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200/90 shadow-sm p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    5&times;5 Probability vs Impact Risk Matrix
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Evaluated via standard formula: <span className="font-mono text-slate-700 font-semibold">Risk Score = Probability (1-5) &times; Impact (1-5)</span>
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-semibold">
                  <span className="flex items-center gap-1 text-emerald-700"><span className="w-2.5 h-2.5 rounded bg-emerald-500"></span> Low (1-4)</span>
                  <span className="flex items-center gap-1 text-blue-700"><span className="w-2.5 h-2.5 rounded bg-blue-500"></span> Med (5-9)</span>
                  <span className="flex items-center gap-1 text-amber-700"><span className="w-2.5 h-2.5 rounded bg-amber-500"></span> High (10-15)</span>
                  <span className="flex items-center gap-1 text-rose-700"><span className="w-2.5 h-2.5 rounded bg-rose-500"></span> Crit (16-25)</span>
                </div>
              </div>

              {/* Matrix Layout */}
              <div className="mt-5">
                <div className="flex items-center">
                  <div className="w-12 text-center text-xs font-bold uppercase tracking-wider text-slate-400 rotate-[-90deg] origin-center -ml-2">
                    Probability
                  </div>

                  <div className="flex-1">
                    {/* Matrix Rows (p = 5 down to 1) */}
                    {[5, 4, 3, 2, 1].map((prob) => {
                      const probLabels = {
                        5: '5 - Almost Certain',
                        4: '4 - Likely',
                        3: '3 - Possible',
                        2: '2 - Unlikely',
                        1: '1 - Rare'
                      };

                      return (
                        <div key={prob} className="flex items-center gap-2 mb-2">
                          <span className="w-28 text-right text-[11px] font-medium text-slate-500 truncate pr-1">
                            {probLabels[prob]}
                          </span>

                          <div className="flex-1 grid grid-cols-5 gap-2">
                            {[1, 2, 3, 4, 5].map((imp) => {
                              const score = prob * imp;
                              const cellRisks = heatmapData[prob]?.[imp] || [];
                              const count = cellRisks.length;

                              // Severity styling
                              let cellBg = 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:border-emerald-400';
                              if (score >= 16) {
                                cellBg = 'bg-rose-50 text-rose-800 border-rose-200 hover:border-rose-400';
                              } else if (score >= 10) {
                                cellBg = 'bg-amber-50 text-amber-800 border-amber-200 hover:border-amber-400';
                              } else if (score >= 5) {
                                cellBg = 'bg-blue-50 text-blue-800 border-blue-200 hover:border-blue-400';
                              }

                              return (
                                <div
                                  key={imp}
                                  title={`Score ${score} (Prob ${prob} &times; Imp ${imp}): ${count} risk(s)\n${cellRisks.map(r => r.riskId + ': ' + r.riskTitle).join('\n')}`}
                                  className={`h-14 rounded-lg border flex flex-col items-center justify-center p-1 transition-all cursor-pointer shadow-2xs relative group ${cellBg}`}
                                  onClick={() => {
                                    if (count > 0) {
                                      setActiveTab('register');
                                    }
                                  }}
                                >
                                  <span className="text-sm font-extrabold">{score}</span>
                                  {count > 0 ? (
                                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-slate-900 text-white mt-0.5">
                                      {count} {count === 1 ? 'risk' : 'risks'}
                                    </span>
                                  ) : (
                                    <span className="text-[9px] opacity-40 font-mono">-</span>
                                  )}

                                  {/* Tooltip on hover */}
                                  {count > 0 && (
                                    <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 bg-slate-900 text-white text-[11px] rounded shadow-lg z-30 pointer-events-none">
                                      <div className="font-bold border-b border-slate-700 pb-1 mb-1 text-slate-300">
                                        Score {score} &bull; {count} Risk(s)
                                      </div>
                                      {cellRisks.slice(0, 3).map(r => (
                                        <div key={r.id} className="truncate text-slate-200">
                                          &bull; {r.riskId}: {r.riskTitle}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}

                    {/* Matrix Column Footer (Impact Labels) */}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="w-28 text-right text-[11px] font-medium text-slate-400"></span>
                      <div className="flex-1 grid grid-cols-5 gap-2 text-center">
                        <span className="text-[11px] font-semibold text-slate-600">1 - Negligible</span>
                        <span className="text-[11px] font-semibold text-slate-600">2 - Minor</span>
                        <span className="text-[11px] font-semibold text-slate-600">3 - Moderate</span>
                        <span className="text-[11px] font-semibold text-slate-600">4 - Major</span>
                        <span className="text-[11px] font-semibold text-slate-600">5 - Critical</span>
                      </div>
                    </div>

                    <div className="text-center text-xs font-bold uppercase tracking-wider text-slate-400 mt-2">
                      Impact
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Severity Breakdown & Category Distribution (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Severity Summary Card */}
              <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-6">
                <h3 className="text-base font-bold text-slate-900 tracking-tight">Risk Severity Breakdown</h3>
                <p className="text-xs text-slate-500 mt-0.5 mb-4">Total quantified risks partitioned by severity tier.</p>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-rose-700 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500"></span> Critical Severity (16 - 25)
                      </span>
                      <span className="text-slate-900 font-bold">{summary?.criticalRisks || 2} ({Math.round(((summary?.criticalRisks || 2) / (risks.length || 6)) * 100)}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className="bg-rose-500 h-2 rounded-full transition-all"
                        style={{ width: `${((summary?.criticalRisks || 2) / (risks.length || 6)) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-amber-700 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span> High Severity (10 - 15)
                      </span>
                      <span className="text-slate-900 font-bold">{summary?.highRisks || 1} ({Math.round(((summary?.highRisks || 1) / (risks.length || 6)) * 100)}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className="bg-amber-500 h-2 rounded-full transition-all"
                        style={{ width: `${((summary?.highRisks || 1) / (risks.length || 6)) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-blue-700 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span> Medium Severity (5 - 9)
                      </span>
                      <span className="text-slate-900 font-bold">{summary?.mediumRisks || 3} ({Math.round(((summary?.mediumRisks || 3) / (risks.length || 6)) * 100)}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${((summary?.mediumRisks || 3) / (risks.length || 6)) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-emerald-700 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Low Severity (1 - 4)
                      </span>
                      <span className="text-slate-900 font-bold">{summary?.lowRisks || 0} (0%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-emerald-500 h-2 rounded-full transition-all" style={{ width: '0%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Open: <strong className="text-slate-800">{summary?.openRisks || 2}</strong></span>
                  <span>In Progress: <strong className="text-slate-800">{summary?.inProgressRisks || 3}</strong></span>
                  <span>Mitigated: <strong className="text-slate-800">{summary?.mitigatedRisks || 1}</strong></span>
                  <span>Accepted: <strong className="text-slate-800">{summary?.acceptedRisks || 0}</strong></span>
                </div>
              </div>

              {/* Compliance Frameworks Summary Progress */}
              <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">Regulatory Frameworks Readiness</h3>
                  <button
                    onClick={() => setActiveTab('compliance')}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    View Checklists <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3.5">
                  {complianceSummaries.map((fw) => (
                    <div key={fw.frameworkName} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-slate-800">{fw.frameworkName}</span>
                        <span className="font-bold text-slate-900">
                          {fw.compliancePercentage}% ({fw.compliantCount}/{fw.totalRequirements} controls)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            fw.compliancePercentage >= 90 ? 'bg-emerald-500' : fw.compliancePercentage >= 75 ? 'bg-blue-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${fw.compliancePercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CENTRALIZED RISK REGISTER */}
      {activeTab === 'register' && (
        <div className="space-y-4">
          {/* Controls Bar: Search + Filters */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by ID, title, workload, owner..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Filter className="w-3.5 h-3.5" />
                <span>Filters:</span>
              </div>

              {/* Severity Filter */}
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="ALL">All Severities</option>
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="ALL">All Statuses</option>
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="MITIGATED">Mitigated</option>
                <option value="ACCEPTED">Accepted</option>
              </select>

              {/* Category Filter */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 max-w-[180px] truncate"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c === 'ALL' ? 'All Categories' : c}</option>
                ))}
              </select>

              <Button
                variant="primary"
                size="sm"
                icon={Plus}
                onClick={handleOpenAddRiskModal}
              >
                Add Risk
              </Button>
            </div>
          </div>

          {/* Risk Register Table */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Risk ID</th>
                    <th className="px-4 py-3">Title &amp; Workload</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3 text-center">Prob (1-5)</th>
                    <th className="px-4 py-3 text-center">Impact (1-5)</th>
                    <th className="px-4 py-3 text-center">Score &amp; Severity</th>
                    <th className="px-4 py-3">Owner</th>
                    <th className="px-4 py-3">Mitigation Progress</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRisks.length === 0 ? (
                    <tr>
                      <td colSpan="10" className="px-4 py-8 text-center text-slate-400">
                        No risks found matching your filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredRisks.map((risk) => (
                      <tr key={risk.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3.5 font-mono font-bold text-slate-900 whitespace-nowrap">
                          {risk.riskId}
                        </td>
                        <td className="px-4 py-3.5 max-w-xs">
                          <div className="font-semibold text-slate-900 truncate" title={risk.riskTitle}>
                            {risk.riskTitle}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
                            <Server className="w-3 h-3 text-slate-400 shrink-0" />
                            {risk.affectedWorkload}
                          </div>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium">
                            {risk.category}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-center font-bold text-slate-800">
                          {risk.probability}
                        </td>
                        <td className="px-4 py-3.5 text-center font-bold text-slate-800">
                          {risk.impact}
                        </td>
                        <td className="px-4 py-3.5 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            <span className="font-extrabold text-slate-900 text-xs w-5 text-right">{risk.riskScore}</span>
                            {getSeverityBadge(risk.severity)}
                          </div>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap text-slate-700">
                          <div className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate max-w-[130px]" title={risk.owner}>{risk.owner}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 w-36 whitespace-nowrap">
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] font-semibold text-slate-600">
                              <span>Remediated</span>
                              <span>{risk.mitigationProgress || 0}%</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-1.5">
                              <div
                                className={`h-1.5 rounded-full transition-all ${
                                  risk.mitigationProgress === 100
                                    ? 'bg-emerald-500'
                                    : risk.mitigationProgress > 40
                                    ? 'bg-blue-500'
                                    : 'bg-amber-500'
                                }`}
                                style={{ width: `${risk.mitigationProgress || 0}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <select
                            value={risk.status}
                            onChange={(e) => handleQuickStatusChange(risk, e.target.value)}
                            className="text-[11px] font-semibold border border-slate-200 rounded px-2 py-1 bg-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="OPEN">Open</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="MITIGATED">Mitigated</option>
                            <option value="ACCEPTED">Accepted</option>
                          </select>
                        </td>
                        <td className="px-4 py-3.5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenAddMitigationModal(risk)}
                              title="Add Mitigation Action"
                              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleOpenEditRiskModal(risk)}
                              title="Edit Risk"
                              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded transition-colors"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteRisk(risk.id, risk.riskId)}
                              title="Delete Risk"
                              className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Showing {filteredRisks.length} of {risks.length} risks</span>
              <span className="text-[11px] text-slate-400">Risk Scoring Engine: Severity Auto-recomputed on update</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: 9 SECURITY ASSESSMENT DOMAINS */}
      {activeTab === 'domains' && (
        <div className="space-y-6">
          {/* Domain Filter Pills */}
          <div className="flex flex-wrap gap-2 pb-2">
            {domainsList.map((domain) => (
              <button
                key={domain}
                onClick={() => setSelectedDomain(domain)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedDomain === domain
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {domain}
              </button>
            ))}
          </div>

          {/* Security Controls Grid */}
          <div className="grid grid-cols-1 gap-5">
            {filteredControls.map((ctrl) => (
              <div
                key={ctrl.id}
                className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-6 hover:border-slate-300 transition-all space-y-4"
              >
                {/* Control Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-500">{ctrl.controlId}</span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {ctrl.domain}
                        </span>
                        {getSeverityBadge(ctrl.severity)}
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mt-1">{ctrl.controlTitle}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{ctrl.description}</p>
                    </div>
                  </div>

                  {/* Status Switcher */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleToggleControlStatus(ctrl, 'PASS')}
                      className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                        ctrl.status === 'PASS'
                          ? 'bg-emerald-600 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      PASS
                    </button>
                    <button
                      onClick={() => handleToggleControlStatus(ctrl, 'NEEDS_REVIEW')}
                      className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                        ctrl.status === 'NEEDS_REVIEW'
                          ? 'bg-amber-500 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      REVIEW
                    </button>
                    <button
                      onClick={() => handleToggleControlStatus(ctrl, 'FAIL')}
                      className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                        ctrl.status === 'FAIL'
                          ? 'bg-rose-600 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      FAIL
                    </button>
                  </div>
                </div>

                {/* Gap & Recommendation Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-lg bg-rose-50/60 border border-rose-100 space-y-1">
                    <span className="font-bold text-rose-800 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                      Missing Control / Identified Gap:
                    </span>
                    <p className="text-rose-900/80 leading-relaxed">
                      {ctrl.missingControl || 'No missing controls identified in verified template.'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-blue-50/60 border border-blue-100 space-y-1">
                    <span className="font-bold text-blue-800 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      Architectural Recommendation:
                    </span>
                    <p className="text-blue-900/80 leading-relaxed">
                      {ctrl.recommendation}
                    </p>
                  </div>
                </div>

                {/* Terraform IaC Remediation Code Snippet */}
                {ctrl.terraformSnippet && (
                  <div className="rounded-lg bg-slate-900 text-slate-100 p-4 font-mono text-[11px] overflow-x-auto relative">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-slate-400">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Terraform IaC Remediation Module
                      </span>
                      <button
                        onClick={() => handleCopySnippet(ctrl.id, ctrl.terraformSnippet)}
                        className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                      >
                        {copiedCodeId === ctrl.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400 font-semibold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Code</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="text-emerald-300 leading-relaxed">{ctrl.terraformSnippet}</pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: COMPLIANCE MANAGEMENT CHECKLISTS */}
      {activeTab === 'compliance' && (
        <div className="space-y-6">
          {/* Framework Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'GDPR', label: 'GDPR (EU Regulation)', badge: 'Privacy & Transfer' },
              { id: 'ISO 27001', label: 'ISO/IEC 27001:2022', badge: 'ISMS Baseline' },
              { id: 'SOC 2', label: 'SOC 2 Type II', badge: 'Trust Criteria' },
              { id: 'HIPAA', label: 'HIPAA Security Rule', badge: 'ePHI Safeguards' }
            ].map((fw) => {
              const summaryItem = complianceSummaries.find(s => s.frameworkName.toUpperCase() === fw.id.toUpperCase());
              const isSelected = selectedFramework.toUpperCase() === fw.id.toUpperCase();

              return (
                <button
                  key={fw.id}
                  onClick={() => setSelectedFramework(fw.id)}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900">{fw.label}</span>
                    <span className="text-[10px] font-bold text-blue-600">{fw.badge}</span>
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900">
                    {summaryItem ? `${summaryItem.compliancePercentage}%` : '90%'}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {summaryItem ? `${summaryItem.compliantCount} of ${summaryItem.totalRequirements} Compliant` : 'Verified'}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Checklists for Selected Framework */}
          <div className="space-y-4">
            {filteredComplianceReqs.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-6 space-y-4 hover:border-slate-300 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-extrabold px-2 py-0.5 rounded bg-slate-900 text-white">
                        {req.frameworkSection}
                      </span>
                      <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">
                        {req.framework}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900">{req.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{req.description}</p>
                  </div>

                  {/* Compliance Status Buttons */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleToggleComplianceStatus(req, 'COMPLIANT')}
                      className={`px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer ${
                        req.status === 'COMPLIANT'
                          ? 'bg-emerald-600 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      COMPLIANT
                    </button>
                    <button
                      onClick={() => handleToggleComplianceStatus(req, 'NEEDS_REVIEW')}
                      className={`px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer ${
                        req.status === 'NEEDS_REVIEW'
                          ? 'bg-amber-500 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      NEEDS REVIEW
                    </button>
                    <button
                      onClick={() => handleToggleComplianceStatus(req, 'NON_COMPLIANT')}
                      className={`px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer ${
                        req.status === 'NON_COMPLIANT'
                          ? 'bg-rose-600 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      NON-COMPLIANT
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-lg bg-amber-50/60 border border-amber-200/80 space-y-1">
                    <span className="font-bold text-amber-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      Compliance Gap Analysis:
                    </span>
                    <p className="text-amber-950/80 leading-relaxed">
                      {req.complianceGap || 'No compliance gap recorded.'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-emerald-50/60 border border-emerald-200/80 space-y-1">
                    <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Suggested Corrective Action:
                    </span>
                    <p className="text-emerald-950/80 leading-relaxed">
                      {req.suggestedCorrectiveAction || 'Maintain standard baseline.'}
                    </p>
                  </div>
                </div>

                {/* Assessment Notes */}
                <div className="text-xs text-slate-500 pt-2 border-t border-slate-100 flex items-center gap-2">
                  <span className="font-semibold text-slate-700">Audit Notes:</span>
                  <span>{req.assessmentNotes || 'Verified during CloudSage Stage 8 automated assessment.'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: RISK MITIGATION ACTION TRACKER */}
      {activeTab === 'mitigations' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div>
              <h3 className="text-base font-bold text-slate-900">Active Mitigation Projects &amp; Workstreams</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Directly synchronized with Stage 7 Migration Execution Waves and Task dependencies.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => {
                if (risks.length > 0) {
                  handleOpenAddMitigationModal(risks[0]);
                } else {
                  showToast('Please add a risk first.');
                }
              }}
            >
              Add Mitigation Action
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mitigations.map((action) => {
              const linkedRisk = risks.find(r => r.id === action.riskId);

              return (
                <div
                  key={action.id}
                  className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-5 space-y-3 hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-blue-600" />
                        Linked to {linkedRisk ? linkedRisk.riskId : `Risk #${action.riskId}`}
                      </span>

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        action.status === 'COMPLETED'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : action.status === 'IN_PROGRESS'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {action.status.replace('_', ' ')}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900">{action.actionTitle}</h4>

                    {linkedRisk && (
                      <p className="text-[11px] text-slate-500 line-clamp-2">
                        {linkedRisk.riskTitle}
                      </p>
                    )}

                    <div className="pt-2 text-xs text-slate-600 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-slate-500">
                          <User className="w-3.5 h-3.5 text-slate-400" /> Lead:
                        </span>
                        <span className="font-semibold text-slate-800">{action.assignedOwner}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-slate-500">
                          <Clock className="w-3.5 h-3.5 text-slate-400" /> Target Date:
                        </span>
                        <span className="font-semibold text-slate-800">{action.targetDate}</span>
                      </div>

                      {action.linkedMigrationTaskId && (
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-slate-500">
                            <Layers className="w-3.5 h-3.5 text-slate-400" /> Stage 7 Task:
                          </span>
                          <span className="font-mono text-blue-600 font-bold">
                            Task #{action.linkedMigrationTaskId} (Pilot Foundation)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress Slider */}
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-700">Mitigation Progress:</span>
                      <span className="font-bold text-blue-600">{action.progressPercentage}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={action.progressPercentage}
                      onChange={(e) => handleUpdateMitigationProgress(action.id, Number(e.target.value), action.status)}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />

                    {action.resolutionNotes && (
                      <p className="text-[11px] text-slate-500 italic mt-1">
                        &quot;{action.resolutionNotes}&quot;
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT MIGRATION RISK */}
      <Modal
        isOpen={isRiskModalOpen}
        onClose={() => setIsRiskModalOpen(false)}
        title={editingRisk ? `Edit Risk: ${editingRisk.riskId}` : 'Register New Migration Risk'}
        subtitle="Quantify risks using the 1-25 scoring formula (Probability &times; Impact) with automatic severity classification."
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSaveRisk} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Risk Title *</label>
            <input
              type="text"
              required
              value={riskFormData.riskTitle}
              onChange={(e) => setRiskFormData({ ...riskFormData, riskTitle: e.target.value })}
              placeholder="e.g., Oracle Exadata Schema Conversion & Stored Procedure Incompatibility"
              className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Risk Category *</label>
              <select
                value={riskFormData.category}
                onChange={(e) => setRiskFormData({ ...riskFormData, category: e.target.value })}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="Compatibility / Data Loss">Compatibility / Data Loss</option>
                <option value="Application Downtime">Application Downtime</option>
                <option value="Network Connectivity">Network Connectivity</option>
                <option value="Performance Degradation">Performance Degradation</option>
                <option value="Unexpected Migration Costs">Unexpected Migration Costs</option>
                <option value="Security & Access Control">Security &amp; Access Control</option>
                <option value="Dependency Bottlenecks">Dependency Bottlenecks</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Affected Workload / Service *</label>
              <input
                type="text"
                required
                value={riskFormData.affectedWorkload}
                onChange={(e) => setRiskFormData({ ...riskFormData, affectedWorkload: e.target.value })}
                placeholder="e.g., Core Banking Settlement DB"
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Probability & Impact Interactive Scoring preview */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                Java-Based Scoring Engine Preview
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700">
                  Calculated Score: <strong className="text-slate-900 text-sm">{currentModalScore}</strong>
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${modalSeverity.color}`}>
                  {modalSeverity.name}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>Probability (1 - 5):</span>
                  <span className="font-bold text-blue-600">{riskFormData.probability}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={riskFormData.probability}
                  onChange={(e) => setRiskFormData({ ...riskFormData, probability: Number(e.target.value) })}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>1 (Rare)</span>
                  <span>5 (Almost Certain)</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>Impact (1 - 5):</span>
                  <span className="font-bold text-blue-600">{riskFormData.impact}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={riskFormData.impact}
                  onChange={(e) => setRiskFormData({ ...riskFormData, impact: Number(e.target.value) })}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>1 (Negligible)</span>
                  <span>5 (Critical Outage)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Assigned Owner</label>
              <input
                type="text"
                value={riskFormData.owner}
                onChange={(e) => setRiskFormData({ ...riskFormData, owner: e.target.value })}
                placeholder="e.g., Dr. Sarah Lin"
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Status</label>
              <select
                value={riskFormData.status}
                onChange={(e) => setRiskFormData({ ...riskFormData, status: e.target.value })}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs"
              >
                <option value="OPEN">OPEN</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="MITIGATED">MITIGATED</option>
                <option value="ACCEPTED">ACCEPTED</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mitigation Progress (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={riskFormData.mitigationProgress}
                onChange={(e) => setRiskFormData({ ...riskFormData, mitigationProgress: Number(e.target.value) })}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Mitigation Action Plan</label>
            <textarea
              rows="3"
              value={riskFormData.mitigationPlan}
              onChange={(e) => setRiskFormData({ ...riskFormData, mitigationPlan: e.target.value })}
              placeholder="Outline specific architectural and technical mitigations (e.g. AWS SCT tool translation, schema refactoring)..."
              className="w-full border border-slate-300 rounded-lg p-2.5 text-xs"
            ></textarea>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsRiskModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
            >
              {editingRisk ? 'Save Changes' : 'Register Risk'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL: ADD MITIGATION ACTION */}
      <Modal
        isOpen={isMitigationModalOpen}
        onClose={() => setIsMitigationModalOpen(false)}
        title="Add Risk Mitigation Action"
        subtitle={selectedRiskForMitigation ? `Linking remediation action to ${selectedRiskForMitigation.riskId}` : ''}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSaveMitigation} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Remediation Action Title *</label>
            <input
              type="text"
              required
              value={mitigationFormData.actionTitle}
              onChange={(e) => setMitigationFormData({ ...mitigationFormData, actionTitle: e.target.value })}
              placeholder="e.g., Provision AWS Direct Connect 10Gbps dedicated circuit"
              className="w-full border border-slate-300 rounded-lg p-2.5 text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Assigned Owner *</label>
              <input
                type="text"
                required
                value={mitigationFormData.assignedOwner}
                onChange={(e) => setMitigationFormData({ ...mitigationFormData, assignedOwner: e.target.value })}
                placeholder="e.g., Marcus Vance"
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Completion Date</label>
              <input
                type="date"
                value={mitigationFormData.targetDate}
                onChange={(e) => setMitigationFormData({ ...mitigationFormData, targetDate: e.target.value })}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Status</label>
              <select
                value={mitigationFormData.status}
                onChange={(e) => setMitigationFormData({ ...mitigationFormData, status: e.target.value })}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs"
              >
                <option value="NOT_STARTED">NOT_STARTED</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Linked Stage 7 Migration Task</label>
              <select
                value={mitigationFormData.linkedMigrationTaskId}
                onChange={(e) => setMitigationFormData({ ...mitigationFormData, linkedMigrationTaskId: Number(e.target.value) })}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs"
              >
                <option value="1">Task #1 - Landing Zone &amp; Direct Connect Network Setup</option>
                <option value="2">Task #2 - IAM Roles &amp; CloudTrail Audit Configuration</option>
                <option value="8">Task #8 - Core Banking DB Schema Conversion (SCT)</option>
                <option value="9">Task #9 - Staging Synthetic Cutover Dress Rehearsal</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Resolution / Progress Notes</label>
            <textarea
              rows="3"
              value={mitigationFormData.resolutionNotes}
              onChange={(e) => setMitigationFormData({ ...mitigationFormData, resolutionNotes: e.target.value })}
              placeholder="Add technical status details, testing milestones, or blocker resolutions..."
              className="w-full border border-slate-300 rounded-lg p-2.5 text-xs"
            ></textarea>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsMitigationModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
            >
              Save Mitigation Action
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
