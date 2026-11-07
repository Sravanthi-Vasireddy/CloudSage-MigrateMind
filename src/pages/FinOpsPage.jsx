import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingDown,
  TrendingUp,
  Leaf,
  Sparkles,
  Download,
  Sliders,
  Server,
  Database,
  HardDrive,
  Network,
  Clock,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Bookmark,
  History,
  Trash2,
  CheckCircle2,
  RotateCcw,
  Printer,
  X,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { useProject } from '../context/ProjectContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { StatCard } from '../components/common/StatCard';
import { finOpsApi } from '../services/finopsApi';
import { formatCurrency } from '../utils/formatters';

const PROVIDER_METADATA = {
  AWS: {
    name: 'Amazon Web Services',
    shortName: 'AWS',
    accentColor: '#f59e0b',
    badgeVariant: 'amber',
    computeFamily: 'm6g.2xlarge (Graviton3 ARM)',
    dbEngine: 'Aurora PostgreSQL Serverless v2',
    storageTier: 'EBS gp3 + S3 Glacier Instant',
    colorHex: '#2563eb'
  },
  AZURE: {
    name: 'Microsoft Azure',
    shortName: 'Azure',
    accentColor: '#0284c7',
    badgeVariant: 'blue',
    computeFamily: 'D-series v5 (Standard_D8s_v5)',
    dbEngine: 'Azure SQL Managed Instance',
    storageTier: 'Managed Premium SSD + Cool Blob',
    colorHex: '#0284c7'
  },
  GCP: {
    name: 'Google Cloud Platform',
    shortName: 'GCP',
    accentColor: '#10b981',
    badgeVariant: 'emerald',
    computeFamily: 'Tau T2D (t2d-standard-8)',
    dbEngine: 'Cloud SQL Enterprise Plus',
    storageTier: 'Persistent Disk SSD + Autoclass',
    colorHex: '#10b981'
  }
};

const CATEGORY_COLORS = {
  Compute: '#2563eb',
  Database: '#8b5cf6',
  Storage: '#10b981',
  Networking: '#f59e0b'
};

export const FinOpsPage = () => {
  const { showToast } = useProject();

  // Active Provider & Pricing Plan State
  const [selectedProvider, setSelectedProvider] = useState('AWS');
  const [pricingPlan, setPricingPlan] = useState('THREE_YEAR_COMMITTED');

  // Baseline, Comparison, Optimizations Data State
  const [currentEstimate, setCurrentEstimate] = useState(null);
  const [comparisonData, setComparisonData] = useState(null);
  const [optimizations, setOptimizations] = useState([]);
  const [savedEstimates, setSavedEstimates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Optimization Filter State
  const [optFilter, setOptFilter] = useState('ALL');

  // What-If Cost Simulator State
  const [simCores, setSimCores] = useState(40);
  const [simRam, setSimRam] = useState(224);
  const [simStorage, setSimStorage] = useState(1950);
  const [simVms, setSimVms] = useState(3);
  const [simHours, setSimHours] = useState(730);
  const [simStorageType, setSimStorageType] = useState('STANDARD_SSD');
  const [simMultiAz, setSimMultiAz] = useState(true);
  const [simEgress, setSimEgress] = useState(500);
  const [simResult, setSimResult] = useState(null);
  const [simulating, setSimulating] = useState(false);

  // Modals State
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [saveEstimateName, setSaveEstimateName] = useState('');
  const [saveEstimateNotes, setSaveEstimateNotes] = useState('');
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [generatingReport, setGeneratingReport] = useState(false);

  // Load baseline estimate, comparisons, and optimization recommendations
  const loadFinOpsData = async () => {
    setLoading(true);
    try {
      const [estRes, compRes, optRes, savedRes] = await Promise.all([
        finOpsApi.getBaselineEstimate(selectedProvider, pricingPlan),
        finOpsApi.compareProviders(pricingPlan),
        finOpsApi.getOptimizationRecommendations(),
        finOpsApi.getAllSavedEstimates()
      ]);

      setCurrentEstimate(estRes);
      setComparisonData(compRes);
      setOptimizations(optRes);
      setSavedEstimates(savedRes);

      // Initialize simulator with baseline specs if not customized
      if (!simResult) {
        setSimResult(estRes);
        setSimCores(estRes.totalCpuCores || 40);
        setSimRam(estRes.totalRamGB || 224);
        setSimStorage(estRes.totalStorageGB || 1950);
        setSimVms(estRes.vmCount || 3);
        setSimHours(estRes.operatingHoursPerMonth || 730);
        setSimStorageType(estRes.storageType || 'STANDARD_SSD');
        setSimMultiAz(estRes.isMultiAzDatabase !== undefined ? estRes.isMultiAzDatabase : true);
        setSimEgress(estRes.networkEgressGB || 500);
      }
    } catch (err) {
      console.error('Failed to load FinOps data:', err);
      showToast('Loaded simulated baseline estimates (Backend offline)');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFinOpsData();
  }, [selectedProvider, pricingPlan]);

  // Handle dynamic simulation trigger
  const runSimulation = async () => {
    setSimulating(true);
    try {
      const result = await finOpsApi.simulateCost({
        provider: selectedProvider,
        pricingModel: pricingPlan,
        totalCpuCores: Number(simCores),
        totalRamGB: Number(simRam),
        totalStorageGB: Number(simStorage),
        vmCount: Number(simVms),
        operatingHoursPerMonth: Number(simHours),
        storageType: simStorageType,
        isMultiAzDatabase: simMultiAz,
        networkEgressGB: Number(simEgress)
      });
      setSimResult(result);
      showToast(`What-If cost simulation updated: ${formatCurrency(result.totalMonthlyCost)}/mo`);
    } catch (err) {
      console.error('Simulation failed:', err);
    } finally {
      setSimulating(false);
    }
  };

  // Run simulation automatically when simulation inputs change
  useEffect(() => {
    const timer = setTimeout(() => {
      runSimulation();
    }, 250);
    return () => clearTimeout(timer);
  }, [simCores, simRam, simStorage, simVms, simHours, simStorageType, simMultiAz, simEgress, selectedProvider, pricingPlan]);

  // Simulator Presets
  const applyPreset = (presetName) => {
    if (presetName === 'onprem') {
      setSimCores(40);
      setSimRam(224);
      setSimStorage(1950);
      setSimVms(3);
      setSimHours(730);
      setSimStorageType('STANDARD_SSD');
      setSimMultiAz(true);
      setSimEgress(500);
      showToast('Applied Preset: Current On-Prem Baseline (40 cores, 224 GB RAM)');
    } else if (presetName === 'optimized') {
      setSimCores(24);
      setSimRam(128);
      setSimStorage(1200);
      setSimVms(3);
      setSimHours(730);
      setSimStorageType('INTELLIGENT_TIER');
      setSimMultiAz(true);
      setSimEgress(400);
      showToast('Applied Preset: Cloud-Native Right-Sized Target (24 cores, 128 GB RAM)');
    } else if (presetName === 'devtest') {
      setSimCores(16);
      setSimRam(64);
      setSimStorage(500);
      setSimVms(2);
      setSimHours(400); // 12x5 non-prod schedule
      setSimStorageType('STANDARD_SSD');
      setSimMultiAz(false);
      setSimEgress(150);
      showToast('Applied Preset: Dev/Test Non-Prod Schedule (400 hrs/mo, Single-AZ)');
    } else if (presetName === 'highscale') {
      setSimCores(96);
      setSimRam(512);
      setSimStorage(5000);
      setSimVms(6);
      setSimHours(730);
      setSimStorageType('PREMIUM_SSD');
      setSimMultiAz(true);
      setSimEgress(2000);
      showToast('Applied Preset: Enterprise High Scale (96 cores, 512 GB RAM)');
    }
  };

  // Apply Optimization to Simulator
  const applyOptimizationToSimulator = (opt) => {
    if (opt.id === 'OPT-01') {
      setSimCores(Math.max(8, simCores - 4));
      setSimRam(Math.max(16, simRam - 16));
      showToast('Applied Web App Right-Sizing to Simulator (-4 vCPU, -16 GB RAM)');
    } else if (opt.id === 'OPT-02') {
      setSimStorageType('INTELLIGENT_TIER');
      showToast('Applied Managed Database Migration to Simulator');
    } else if (opt.id === 'OPT-03') {
      setPricingPlan('THREE_YEAR_COMMITTED');
      showToast('Applied 3-Year Savings Plans discount model');
    } else if (opt.id === 'OPT-04') {
      setSimStorageType('INTELLIGENT_TIER');
      showToast('Applied Object Lifecycle & Cold Tiering to Simulator');
    } else if (opt.id === 'OPT-05') {
      setSimHours(400);
      showToast('Applied Non-Production Scheduled Auto-Shutdown (400 hrs)');
    } else {
      showToast(`Applied ${opt.title} assumptions to simulator.`);
    }

    // Scroll to simulator
    const el = document.getElementById('what-if-simulator-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle Save Estimate
  const handleSaveEstimate = async () => {
    if (!saveEstimateName.trim()) {
      showToast('Please enter a name for the estimate.');
      return;
    }

    try {
      const activeData = simResult || currentEstimate;
      const saved = await finOpsApi.saveEstimate({
        estimateName: saveEstimateName.trim(),
        provider: selectedProvider,
        pricingModel: pricingPlan,
        vmCount: activeData.vmCount,
        totalCpuCores: activeData.totalCpuCores,
        totalRamGB: activeData.totalRamGB,
        totalStorageGB: activeData.totalStorageGB,
        operatingHoursPerMonth: activeData.operatingHoursPerMonth,
        storageType: activeData.storageType,
        isMultiAzDatabase: activeData.isMultiAzDatabase,
        networkEgressGB: activeData.networkEgressGB,
        notes: saveEstimateNotes.trim()
      });

      setSavedEstimates([saved, ...savedEstimates]);
      setIsSaveModalOpen(false);
      setSaveEstimateName('');
      setSaveEstimateNotes('');
      showToast(`Saved cost estimate: "${saved.estimateName}"`);
    } catch (err) {
      console.error('Failed to save estimate:', err);
      showToast('Failed to save estimate.');
    }
  };

  // Handle Restore Saved Estimate
  const handleRestoreEstimate = (saved) => {
    setSelectedProvider(saved.provider);
    setPricingPlan(saved.pricingModel || 'THREE_YEAR_COMMITTED');
    setSimCores(saved.totalCpuCores);
    setSimRam(saved.totalRamGB);
    setSimStorage(saved.totalStorageGB);
    setSimVms(saved.vmCount);
    setSimHours(saved.operatingHoursPerMonth);
    setSimStorageType(saved.storageType || 'STANDARD_SSD');
    setSimMultiAz(saved.isMultiAzDatabase !== undefined ? saved.isMultiAzDatabase : true);
    setSimEgress(saved.networkEgressGB || 500);
    setSimResult(saved);
    setIsHistoryDrawerOpen(false);
    showToast(`Restored cost estimate: "${saved.estimateName}"`);
  };

  // Handle Delete Saved Estimate
  const handleDeleteEstimate = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this saved estimate?')) return;
    try {
      await finOpsApi.deleteSavedEstimate(id);
      setSavedEstimates(savedEstimates.filter((item) => item.id !== id));
      showToast('Deleted saved estimate.');
    } catch (err) {
      console.error('Failed to delete estimate:', err);
    }
  };

  // Handle Open Executive PDF Report
  const handleOpenReport = async () => {
    setGeneratingReport(true);
    try {
      const data = await finOpsApi.generateCostReport(selectedProvider, pricingPlan);
      setReportData(data);
      setIsReportModalOpen(true);
    } catch (err) {
      console.error('Failed to generate report:', err);
      showToast('Could not generate full report payload.');
    } finally {
      setGeneratingReport(false);
    }
  };

  // Filtered Optimizations
  const filteredOptimizations = optimizations.filter((item) => {
    if (optFilter === 'ALL') return true;
    return item.priority === optFilter;
  });

  // Calculate Category Data for Donut Chart
  const activeData = simResult || currentEstimate || {};
  const donutData = [
    { name: 'Compute', value: activeData.computeMonthlyCost || 5100, color: CATEGORY_COLORS.Compute },
    { name: 'Database', value: activeData.databaseMonthlyCost || 3850, color: CATEGORY_COLORS.Database },
    { name: 'Storage', value: activeData.storageMonthlyCost || 1650, color: CATEGORY_COLORS.Storage },
    { name: 'Networking', value: activeData.networkingMonthlyCost || 1150, color: CATEGORY_COLORS.Networking }
  ];

  // Provider Comparison Bar Chart Data
  const comparisonChartData = comparisonData?.providers ? comparisonData.providers.map((p) => ({
    name: p.provider,
    displayName: p.displayName,
    Compute: p.computeCost,
    Database: p.databaseCost,
    Storage: p.storageCost,
    Networking: p.networkingCost,
    Total: p.monthlyTotal
  })) : [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-blue-600 mb-1 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5" /> Stage 6 &bull; FinOps Financial Engineering
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Cloud Cost Estimation & Optimization
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Total Cost of Ownership comparison across AWS, Azure, and GCP, commitment modeling, dynamic What-If simulation, and automated right-sizing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={History}
            onClick={() => setIsHistoryDrawerOpen(true)}
          >
            Saved Estimates ({savedEstimates.length})
          </Button>

          <Button
            variant="secondary"
            size="sm"
            icon={Bookmark}
            onClick={() => {
              setSaveEstimateName(`CloudSage-${selectedProvider}-Estimate-${new Date().toLocaleDateString()}`);
              setIsSaveModalOpen(true);
            }}
          >
            Save Scenario
          </Button>

          <Button
            variant="secondary"
            size="sm"
            icon={Download}
            onClick={() => {
              finOpsApi.exportCsv(selectedProvider, pricingPlan);
              showToast(`Exported ${selectedProvider} cost breakdown to CSV.`);
            }}
          >
            Export CSV
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={FileText}
            onClick={handleOpenReport}
            disabled={generatingReport}
          >
            {generatingReport ? 'Generating Report...' : 'Executive PDF Report'}
          </Button>
        </div>
      </div>

      {/* Top 4 FinOps KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Current On-Prem Spend"
          value={formatCurrency(activeData.onPremCurrentMonthlyCost || 19800)}
          subtext={`${formatCurrency((activeData.onPremCurrentMonthlyCost || 19800) * 12)} / year baseline`}
          color="slate"
          icon={Server}
        />
        <StatCard
          title={`Target ${selectedProvider} Spend`}
          value={formatCurrency(activeData.totalMonthlyCost || 12450)}
          subtext={`${formatCurrency(activeData.totalAnnualCost || 149400)} / year (${activeData.pricingModelLabel || '3-Yr Savings Plans'})`}
          color="blue"
          icon={TrendingDown}
        />
        <StatCard
          title="Net Monthly Savings"
          value={formatCurrency(activeData.monthlySavings || 7350)}
          subtext={`${activeData.savingsPercentage || 38}% net TCO reduction (${formatCurrency(activeData.annualSavings || 88200)}/yr)`}
          trend="High ROI"
          trendDirection="up"
          color="emerald"
          icon={TrendingUp}
        />
        <StatCard
          title="Payback & ESG Metrics"
          value={`Month ${activeData.paybackPeriodMonths || 7.2}`}
          subtext={`5-Yr ROI: ${activeData.fiveYearRoiPercentage || 312}% &bull; 142 MT CO2e saved`}
          trend="ESG Compliant"
          trendDirection="up"
          color="amber"
          icon={Leaf}
        />
      </div>

      {/* Cloud Provider & Pricing Commitment Model Control Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Provider Tabs */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider shrink-0">Cloud Provider:</span>
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
            {['AWS', 'AZURE', 'GCP'].map((prov) => {
              const meta = PROVIDER_METADATA[prov];
              const isSelected = selectedProvider === prov;
              return (
                <button
                  key={prov}
                  onClick={() => {
                    setSelectedProvider(prov);
                    showToast(`Switched target provider to ${meta.name}`);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: isSelected ? '#ffffff' : meta.accentColor }}
                  />
                  {meta.shortName}
                </button>
              );
            })}
          </div>
        </div>

        {/* Commitment Model Tabs */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider shrink-0">Pricing Model:</span>
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
            {[
              { id: 'ON_DEMAND', label: 'On-Demand (Retail)' },
              { id: 'ONE_YEAR_COMMITTED', label: '1-Year Committed (~29% off)' },
              { id: 'THREE_YEAR_COMMITTED', label: '3-Year Committed (~42% off)' }
            ].map((plan) => (
              <button
                key={plan.id}
                onClick={() => {
                  setPricingPlan(plan.id);
                  showToast(`FinOps commitment model updated to ${plan.label}`);
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  pricingPlan === plan.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {plan.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Illustrative Benchmark Disclaimer Callout */}
      <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl flex items-start gap-2.5 text-xs text-blue-900">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div className="flex-1 leading-relaxed">
          <span className="font-semibold">Enterprise Benchmark Methodology:</span> Cloud cost estimations are computed using standard enterprise catalog rates (US-East regional benchmark) for capacity planning across 40 vCPU, 224 GB RAM, and 1,950 GB storage. Actual invoiced billing reflects negotiated Enterprise Discount Programs (AWS EDP, Azure MCA, Google Cloud Commitments).
        </div>
      </div>

      {/* SECTION 1: 3-Cloud Provider Cost Comparison Section */}
      <Card
        title="Multi-Cloud Cost & TCO Comparison (AWS vs Azure vs GCP)"
        subtitle={`Side-by-side comparative financial model based on ${activeData.pricingModelLabel || '3-Year Commitments'}`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {comparisonData?.providers?.map((p) => {
            const isSelected = selectedProvider === p.provider;
            const meta = PROVIDER_METADATA[p.provider];
            return (
              <div
                key={p.provider}
                onClick={() => setSelectedProvider(p.provider)}
                className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/40 shadow-sm ring-1 ring-blue-600'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-2xs'
                }`}
              >
                {/* Header Badge */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: meta.accentColor }}
                    />
                    <span className="font-bold text-sm text-slate-900">{p.displayName}</span>
                  </div>
                  {p.isRecommended && (
                    <Badge variant="emerald" size="xs">
                      Optimal TCO
                    </Badge>
                  )}
                </div>

                {/* Primary Cost */}
                <div className="mt-2 mb-3">
                  <div className="text-2xl font-black text-slate-900">
                    {formatCurrency(p.monthlyTotal)}
                    <span className="text-xs font-normal text-slate-500"> / month</span>
                  </div>
                  <div className="text-xs text-slate-500">
                    {formatCurrency(p.annualTotal)} / year &bull;{' '}
                    <span className="font-bold text-emerald-600">Save {p.savingsPercentage}% vs On-Prem</span>
                  </div>
                </div>

                {/* Resource Category Breakdown */}
                <div className="space-y-1.5 py-2.5 border-t border-b border-slate-100 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <Server className="w-3 h-3 text-blue-600" /> Compute:
                    </span>
                    <span className="font-semibold text-slate-800">{formatCurrency(p.computeCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <Database className="w-3 h-3 text-purple-600" /> Database:
                    </span>
                    <span className="font-semibold text-slate-800">{formatCurrency(p.databaseCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <HardDrive className="w-3 h-3 text-emerald-600" /> Storage:
                    </span>
                    <span className="font-semibold text-slate-800">{formatCurrency(p.storageCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <Network className="w-3 h-3 text-amber-600" /> Network & Egress:
                    </span>
                    <span className="font-semibold text-slate-800">{formatCurrency(p.networkingCost)}</span>
                  </div>
                </div>

                {/* Architectural Specs */}
                <div className="mt-3 space-y-1 text-[11px] text-slate-500">
                  <div>
                    <span className="font-medium text-slate-700">Compute:</span> {p.recommendedComputeType}
                  </div>
                  <div>
                    <span className="font-medium text-slate-700">Database:</span> {p.recommendedDatabaseType}
                  </div>
                  <div>
                    <span className="font-medium text-slate-700">Storage:</span> {p.recommendedStorageType}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">5-Yr ROI: <strong className="text-emerald-700">{p.fiveYearRoiPercentage}%</strong></span>
                  <span className="text-slate-500">Payback: <strong className="text-slate-800">{p.paybackMonths} mo</strong></span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recharts Multi-Provider Grouped Bar Chart */}
        <div className="pt-4 border-t border-slate-100">
          <div className="text-xs font-bold text-slate-800 mb-3 uppercase tracking-wider">
            Resource Category Cost Distribution Across Providers
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="displayName" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(val) => `$${val / 1000}k`}
                />
                <Tooltip
                  formatter={(val) => formatCurrency(val)}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} iconType="circle" />
                <Bar dataKey="Compute" fill={CATEGORY_COLORS.Compute} radius={[2, 2, 0, 0]} />
                <Bar dataKey="Database" fill={CATEGORY_COLORS.Database} radius={[2, 2, 0, 0]} />
                <Bar dataKey="Storage" fill={CATEGORY_COLORS.Storage} radius={[2, 2, 0, 0]} />
                <Bar dataKey="Networking" fill={CATEGORY_COLORS.Networking} radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>

      {/* SECTION 2: 2 Charts Grid (12-Month Migration Cashflow Transition & Service Category Share) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 12-Month Cashflow Transition Area/Bar Chart */}
        <Card
          className="lg:col-span-7"
          title="12-Month Migration Cashflow Transition"
          subtitle="Datacenter decommission ramp-down vs Cloud ramp-up (Payback at Month 7.2)"
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={reportData?.monthlyCashflowProjection || [
                  { month: 'Jan', onPrem: 19800, cloudOptimized: 2800 },
                  { month: 'Feb', onPrem: 19800, cloudOptimized: 4100 },
                  { month: 'Mar', onPrem: 18900, cloudOptimized: 5900 },
                  { month: 'Apr', onPrem: 17400, cloudOptimized: 7800 },
                  { month: 'May', onPrem: 15100, cloudOptimized: 9400 },
                  { month: 'Jun', onPrem: 11500, cloudOptimized: 10800 },
                  { month: 'Jul', onPrem: 6800, cloudOptimized: 11900 },
                  { month: 'Aug', onPrem: 1200, cloudOptimized: 12450 },
                  { month: 'Sep', onPrem: 0, cloudOptimized: 12450 },
                  { month: 'Oct', onPrem: 0, cloudOptimized: 12450 },
                  { month: 'Nov', onPrem: 0, cloudOptimized: 12450 },
                  { month: 'Dec', onPrem: 0, cloudOptimized: 12450 },
                ]}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(val) => `$${val / 1000}k`}
                />
                <Tooltip
                  formatter={(val) => formatCurrency(val)}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} iconType="circle" />
                <Bar dataKey="onPrem" name="On-Premises Datacenter" fill="#94a3b8" radius={[2, 2, 0, 0]} />
                <Bar dataKey="cloudOptimized" name={`Target ${selectedProvider} Spend`} fill="#2563eb" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between pt-2 border-t border-slate-100">
            <span>Payback break-even achieved in Month 7.2</span>
            <span className="font-semibold text-emerald-600">5-Yr Cumulative ROI: {activeData.fiveYearRoiPercentage || 312}%</span>
          </div>
        </Card>

        {/* Spend Category Share Donut Chart */}
        <Card
          className="lg:col-span-5"
          title={`${selectedProvider} Spend by Category`}
          subtitle={`Annual run-rate breakdown based on ${activeData.pricingModelLabel || '3-Year Savings Plans'}`}
        >
          <div className="h-56 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {donutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val, name) => [
                    `${formatCurrency(val)}/mo (${Math.round((val / activeData.totalMonthlyCost) * 100)}%)`,
                    name
                  ]}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            {donutData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-700">{item.name}</span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-slate-500 text-[11px]">
                    {Math.round((item.value / (activeData.totalMonthlyCost || 1)) * 100)}%
                  </span>
                  <span className="font-bold text-slate-900">{formatCurrency(item.value)}/mo</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* SECTION 3: Interactive What-If Cost Simulator */}
      <div id="what-if-simulator-section">
        <Card
          title="Interactive What-If Cost Simulator"
          subtitle="Modify infrastructure capacity, operating schedules, and storage tiers to simulate dynamic cloud spend in real time"
        >
          {/* Quick Presets Bar */}
          <div className="mb-6 flex flex-wrap items-center gap-2 pb-4 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider mr-1">
              Simulation Presets:
            </span>
            <button
              onClick={() => applyPreset('onprem')}
              className="px-2.5 py-1 text-xs font-medium rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
            >
              Current On-Prem Baseline (40 cores / 224 GB)
            </button>
            <button
              onClick={() => applyPreset('optimized')}
              className="px-2.5 py-1 text-xs font-medium rounded-md bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors"
            >
              Cloud-Native Right-Sized (24 cores / 128 GB)
            </button>
            <button
              onClick={() => applyPreset('devtest')}
              className="px-2.5 py-1 text-xs font-medium rounded-md bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors"
            >
              Dev/Test 12x5 Schedule (400 hrs / Single-AZ)
            </button>
            <button
              onClick={() => applyPreset('highscale')}
              className="px-2.5 py-1 text-xs font-medium rounded-md bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition-colors"
            >
              High Enterprise Scale (96 cores / 512 GB)
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Sliders & Controls */}
            <div className="lg:col-span-8 space-y-4">
              {/* Virtual Machines & Cores */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <Server className="w-3.5 h-3.5 text-blue-600" /> Virtual Machine Count
                    </span>
                    <span className="font-mono font-bold text-blue-700">{simVms} VMs</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={simVms}
                    onChange={(e) => setSimVms(Number(e.target.value))}
                    className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>1 VM</span>
                    <span>25 VMs</span>
                    <span>50 VMs</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <Server className="w-3.5 h-3.5 text-blue-600" /> Total vCPU Cores
                    </span>
                    <span className="font-mono font-bold text-blue-700">{simCores} vCPUs</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="192"
                    step="2"
                    value={simCores}
                    onChange={(e) => setSimCores(Number(e.target.value))}
                    className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>2 Cores</span>
                    <span>96 Cores</span>
                    <span>192 Cores</span>
                  </div>
                </div>
              </div>

              {/* RAM & Storage */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <Server className="w-3.5 h-3.5 text-blue-600" /> Total Memory (RAM)
                    </span>
                    <span className="font-mono font-bold text-blue-700">{simRam} GB RAM</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="1024"
                    step="4"
                    value={simRam}
                    onChange={(e) => setSimRam(Number(e.target.value))}
                    className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>4 GB</span>
                    <span>512 GB</span>
                    <span>1,024 GB</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <HardDrive className="w-3.5 h-3.5 text-emerald-600" /> Storage Capacity
                    </span>
                    <span className="font-mono font-bold text-emerald-700">{simStorage} GB</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="10000"
                    step="50"
                    value={simStorage}
                    onChange={(e) => setSimStorage(Number(e.target.value))}
                    className="w-full accent-emerald-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>50 GB</span>
                    <span>5,000 GB</span>
                    <span>10,000 GB</span>
                  </div>
                </div>
              </div>

              {/* Operating Hours & Data Egress */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-600" /> Operating Hours / Month
                    </span>
                    <span className="font-mono font-bold text-amber-700">{simHours} hrs/mo</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="730"
                    step="10"
                    value={simHours}
                    onChange={(e) => setSimHours(Number(e.target.value))}
                    className="w-full accent-amber-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>100 hrs (Dev/Batch)</span>
                    <span>400 hrs (12x5 Workdays)</span>
                    <span>730 hrs (24x7)</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <Network className="w-3.5 h-3.5 text-amber-600" /> Monthly Internet Egress
                    </span>
                    <span className="font-mono font-bold text-amber-700">{simEgress} GB/mo</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="5000"
                    step="50"
                    value={simEgress}
                    onChange={(e) => setSimEgress(Number(e.target.value))}
                    className="w-full accent-amber-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>50 GB</span>
                    <span>2,500 GB</span>
                    <span>5,000 GB</span>
                  </div>
                </div>
              </div>

              {/* Toggles: Storage Class & Database High Availability */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 flex flex-col justify-between">
                  <span className="text-xs font-semibold text-slate-700 mb-1.5">Storage Tiering Class:</span>
                  <div className="flex items-center gap-1 bg-white p-1 rounded border border-slate-200">
                    {[
                      { id: 'STANDARD_SSD', label: 'Standard SSD' },
                      { id: 'PREMIUM_SSD', label: 'Premium SSD' },
                      { id: 'INTELLIGENT_TIER', label: 'Intelligent Tier' }
                    ].map((st) => (
                      <button
                        key={st.id}
                        onClick={() => setSimStorageType(st.id)}
                        className={`flex-1 py-1 text-[11px] font-medium rounded transition-all ${
                          simStorageType === st.id
                            ? 'bg-blue-600 text-white shadow-2xs'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-700 block">Database High Availability</span>
                    <span className="text-[11px] text-slate-500">Multi-AZ standby replica with automatic failover</span>
                  </div>
                  <button
                    onClick={() => setSimMultiAz(!simMultiAz)}
                    className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      simMultiAz ? 'bg-blue-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                        simMultiAz ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Live Recalculated Results Panel */}
            <div className="lg:col-span-4 bg-slate-900 text-white p-5 rounded-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
                    Dynamic What-If Results
                  </span>
                  <Badge variant={PROVIDER_METADATA[selectedProvider].badgeVariant} size="xs">
                    {selectedProvider} Target
                  </Badge>
                </div>

                <div className="mt-4 mb-4">
                  <div className="text-xs text-slate-400">Projected Cloud Spend:</div>
                  <div className="text-3xl font-black text-white mt-1">
                    {formatCurrency(simResult?.totalMonthlyCost || 12450)}
                    <span className="text-xs font-normal text-slate-400"> / mo</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {formatCurrency((simResult?.totalMonthlyCost || 12450) * 12)} / year
                  </div>
                </div>

                {/* Breakdown List */}
                <div className="space-y-2 py-3 border-t border-slate-800 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Compute ({simCores} cores, {simRam} GB):</span>
                    <span className="font-mono font-bold text-white">
                      {formatCurrency(simResult?.computeMonthlyCost || 5100)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Database ({simMultiAz ? 'Multi-AZ' : 'Single-AZ'}):</span>
                    <span className="font-mono font-bold text-white">
                      {formatCurrency(simResult?.databaseMonthlyCost || 3850)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Storage ({simStorage} GB):</span>
                    <span className="font-mono font-bold text-white">
                      {formatCurrency(simResult?.storageMonthlyCost || 1650)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Networking & Egress ({simEgress} GB):</span>
                    <span className="font-mono font-bold text-white">
                      {formatCurrency(simResult?.networkingMonthlyCost || 1150)}
                    </span>
                  </div>
                </div>

                {/* Savings Callout */}
                <div className="mt-4 p-3 bg-emerald-950/60 border border-emerald-700/50 rounded-lg">
                  <div className="flex justify-between text-xs">
                    <span className="text-emerald-300 font-semibold">Net Recurring Savings:</span>
                    <span className="font-mono font-bold text-emerald-400">
                      {formatCurrency(simResult?.monthlySavings || 7350)}/mo
                    </span>
                  </div>
                  <div className="text-[11px] text-emerald-200/80 mt-1">
                    {simResult?.savingsPercentage || 38}% reduction vs $19,800 on-prem run-rate
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full text-slate-900 bg-white hover:bg-slate-100"
                  icon={Bookmark}
                  onClick={() => {
                    setSaveEstimateName(`WhatIf-${selectedProvider}-${simCores}C-${simRam}G`);
                    setIsSaveModalOpen(true);
                  }}
                >
                  Save What-If Sizing
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* SECTION 4: Cost Optimization Engine */}
      <Card
        title="Automated FinOps Cost Optimization Engine"
        subtitle="7 prioritized opportunities identified from infrastructure telemetry and 6Rs strategy assessment"
      >
        {/* Filter Pills */}
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 text-xs">
          <span className="font-bold text-slate-800 uppercase tracking-wider mr-1">Filter Priority:</span>
          {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((prio) => (
            <button
              key={prio}
              onClick={() => setOptFilter(prio)}
              className={`px-3 py-1 rounded-full font-semibold transition-all ${
                optFilter === prio
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {prio === 'ALL' ? `All (${optimizations.length})` : prio}
            </button>
          ))}
        </div>

        {/* Optimization Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredOptimizations.map((rec) => (
            <div
              key={rec.id}
              className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-2xs transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                {/* Header Badge */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        rec.priority === 'HIGH' ? 'rose' : rec.priority === 'MEDIUM' ? 'amber' : 'slate'
                      }
                      size="xs"
                    >
                      {rec.priority} PRIORITY
                    </Badge>
                    <span className="text-[11px] font-mono text-slate-400">{rec.id}</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Save {formatCurrency(rec.expectedMonthlySavings)}/mo
                  </span>
                </div>

                <h4 className="font-bold text-sm text-slate-900 leading-snug">{rec.title}</h4>

                <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                  <div>
                    <span className="font-semibold text-slate-700">Identified Issue:</span> {rec.identifiedIssue}
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-150">
                    <span className="font-semibold text-blue-900">Suggested Optimization:</span>{' '}
                    <span className="text-slate-700">{rec.suggestedOptimization}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500 truncate max-w-[220px]" title={rec.affectedResource}>
                  Resource: <span className="font-medium text-slate-700">{rec.affectedResource}</span>
                </span>
                <Button
                  variant="ghost"
                  size="xs"
                  className="text-blue-600 hover:text-blue-800 font-semibold"
                  icon={ChevronRight}
                  onClick={() => applyOptimizationToSimulator(rec)}
                >
                  Apply to Simulator
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* ========================================================================= */}
      {/* MODAL 1: Save Cost Estimate Scenario */}
      {/* ========================================================================= */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-blue-600" /> Save Cost Estimate Scenario
              </h3>
              <button
                onClick={() => setIsSaveModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Scenario Name *</label>
                <input
                  type="text"
                  value={saveEstimateName}
                  onChange={(e) => setSaveEstimateName(e.target.value)}
                  placeholder="e.g. Production Baseline TCO - Q1 2026"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 rounded-lg text-slate-600">
                <div>
                  Provider: <strong className="text-slate-900">{selectedProvider}</strong>
                </div>
                <div>
                  Pricing: <strong className="text-slate-900">{pricingPlan}</strong>
                </div>
                <div>
                  Compute: <strong className="text-slate-900">{simCores} vCPU / {simRam} GB</strong>
                </div>
                <div>
                  Storage: <strong className="text-slate-900">{simStorage} GB</strong>
                </div>
                <div className="col-span-2 pt-1 border-t border-slate-200 font-semibold text-blue-700">
                  Monthly Total: {formatCurrency(simResult?.totalMonthlyCost || activeData.totalMonthlyCost)}/mo
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Architectural Notes & Assumptions</label>
                <textarea
                  rows="3"
                  value={saveEstimateNotes}
                  onChange={(e) => setSaveEstimateNotes(e.target.value)}
                  placeholder="e.g., Based on Graviton3 instances, multi-AZ Aurora failover, and cold archive storage lifecycle."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-200 flex justify-end gap-2">
              <Button variant="secondary" size="sm" onClick={() => setIsSaveModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" icon={CheckCircle2} onClick={handleSaveEstimate}>
                Save Estimate
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DRAWER / MODAL 2: Saved Estimates History */}
      {/* ========================================================================= */}
      {isHistoryDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-2xl max-h-[85vh] flex flex-col p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <History className="w-4 h-4 text-blue-600" /> Saved Cost Estimates History ({savedEstimates.length})
              </h3>
              <button
                onClick={() => setIsHistoryDrawerOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 my-4 text-xs">
              {savedEstimates.length === 0 ? (
                <div className="text-center py-10 text-slate-400">
                  No saved estimates found. Use "Save Scenario" to catalog pricing models.
                </div>
              ) : (
                savedEstimates.map((item) => (
                  <div
                    key={item.id}
                    className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 p-2 rounded-lg transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{item.estimateName}</span>
                        <Badge variant={PROVIDER_METADATA[item.provider]?.badgeVariant || 'blue'} size="xs">
                          {item.provider}
                        </Badge>
                      </div>
                      <p className="text-slate-500 text-[11px]">
                        {item.totalCpuCores} vCPU &bull; {item.totalRamGB} GB RAM &bull; {item.totalStorageGB} GB Storage &bull; {item.pricingModelLabel || item.pricingModel}
                      </p>
                      {item.notes && <p className="text-slate-600 italic text-[11px]">{item.notes}</p>}
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <div className="font-bold text-slate-900 text-sm">
                          {formatCurrency(item.totalMonthlyCost)}/mo
                        </div>
                        <div className="text-[10px] text-emerald-600 font-semibold">
                          Save {formatCurrency(item.monthlySavings)}/mo
                        </div>
                      </div>

                      <Button
                        variant="secondary"
                        size="xs"
                        icon={RotateCcw}
                        onClick={() => handleRestoreEstimate(item)}
                      >
                        Restore
                      </Button>

                      <button
                        onClick={(e) => handleDeleteEstimate(item.id, e)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors rounded hover:bg-rose-50"
                        title="Delete estimate"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <Button variant="secondary" size="sm" onClick={() => setIsHistoryDrawerOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: Executive PDF Cost Report Modal */}
      {/* ========================================================================= */}
      {isReportModalOpen && reportData && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col p-6 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Actions */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 print:hidden">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-base text-slate-900">
                  Executive FinOps Cost & TCO Report
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  icon={Printer}
                  onClick={() => window.print()}
                >
                  Print / Save as PDF
                </Button>
                <button
                  onClick={() => setIsReportModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Document Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 text-xs text-slate-800">
              {/* Document Header */}
              <div className="flex justify-between items-start pb-4 border-b-2 border-slate-900">
                <div>
                  <div className="text-xl font-black text-slate-900 tracking-tight">CloudSage &bull; MigrateMind</div>
                  <div className="text-xs uppercase font-bold tracking-wider text-blue-600 mt-0.5">
                    HCLTech Cloud Migration & Financial Engineering Advisory
                  </div>
                  <div className="text-slate-500 text-[11px] mt-1">
                    Project: {reportData.projectName} &bull; Report ID: {reportData.reportId}
                  </div>
                </div>
                <div className="text-right text-[11px] text-slate-500">
                  <div>Date: {new Date(reportData.generatedAt).toLocaleDateString()}</div>
                  <div>Target Provider: <strong className="text-slate-800">{reportData.targetProvider}</strong></div>
                  <div>Pricing Model: <strong className="text-slate-800">{reportData.pricingModel}</strong></div>
                </div>
              </div>

              {/* Executive Summary */}
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 mb-1.5">
                  1. Executive Financial Summary
                </h4>
                <p className="text-slate-700 leading-relaxed text-xs">
                  {reportData.executiveSummary}
                </p>
              </div>

              {/* Financial Scorecard Grid */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 mb-2">
                  2. Total Cost of Ownership (TCO) Scorecard
                </h4>
                <div className="grid grid-cols-4 gap-3">
                  <div className="p-3 border border-slate-200 rounded-lg text-center bg-slate-50">
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Current On-Prem Spend</div>
                    <div className="text-base font-bold text-slate-900 mt-0.5">
                      {formatCurrency(reportData.onPremMonthlySpend)}/mo
                    </div>
                    <div className="text-[10px] text-slate-400">{formatCurrency(reportData.onPremMonthlySpend * 12)}/yr</div>
                  </div>

                  <div className="p-3 border border-blue-200 rounded-lg text-center bg-blue-50">
                    <div className="text-[10px] text-blue-700 uppercase font-semibold">Target Cloud Spend</div>
                    <div className="text-base font-bold text-blue-900 mt-0.5">
                      {formatCurrency(reportData.targetCloudMonthlySpend)}/mo
                    </div>
                    <div className="text-[10px] text-blue-600">{formatCurrency(reportData.targetCloudMonthlySpend * 12)}/yr</div>
                  </div>

                  <div className="p-3 border border-emerald-200 rounded-lg text-center bg-emerald-50">
                    <div className="text-[10px] text-emerald-700 uppercase font-semibold">Net Recurring Savings</div>
                    <div className="text-base font-bold text-emerald-800 mt-0.5">
                      {formatCurrency(reportData.netMonthlySavings)}/mo
                    </div>
                    <div className="text-[10px] text-emerald-600">Save {reportData.savingsPercentage}% vs On-Prem</div>
                  </div>

                  <div className="p-3 border border-slate-200 rounded-lg text-center bg-slate-50">
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Capital Payback</div>
                    <div className="text-base font-bold text-slate-900 mt-0.5">
                      Month {reportData.paybackPeriodMonths}
                    </div>
                    <div className="text-[10px] text-emerald-600 font-semibold">5-Yr ROI: {reportData.fiveYearRoiPercentage}%</div>
                  </div>
                </div>
              </div>

              {/* Resource Breakdown Table */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 mb-2">
                  3. Cloud Resource Cost Breakdown
                </h4>
                <table className="w-full text-left border border-slate-200 rounded-lg overflow-hidden">
                  <thead className="bg-slate-100 text-[11px] font-bold text-slate-700">
                    <tr>
                      <th className="p-2 border-b border-slate-200">Category</th>
                      <th className="p-2 border-b border-slate-200">Architecture Specification</th>
                      <th className="p-2 border-b border-slate-200 text-right">Monthly (USD)</th>
                      <th className="p-2 border-b border-slate-200 text-right">Annual (USD)</th>
                      <th className="p-2 border-b border-slate-200 text-right">Share (%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[11px]">
                    <tr>
                      <td className="p-2 font-semibold">Compute</td>
                      <td className="p-2 text-slate-600">{reportData.estimateDetails.totalCpuCores} vCPU / {reportData.estimateDetails.totalRamGB} GB RAM ({reportData.estimateDetails.operatingHoursPerMonth} hrs/mo)</td>
                      <td className="p-2 text-right font-mono font-medium">{formatCurrency(reportData.estimateDetails.computeMonthlyCost)}</td>
                      <td className="p-2 text-right font-mono font-medium">{formatCurrency(reportData.estimateDetails.computeMonthlyCost * 12)}</td>
                      <td className="p-2 text-right text-slate-500">{Math.round((reportData.estimateDetails.computeMonthlyCost / reportData.targetCloudMonthlySpend) * 100)}%</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-semibold">Database</td>
                      <td className="p-2 text-slate-600">Managed DB Tier ({reportData.estimateDetails.isMultiAzDatabase ? 'Multi-AZ High Availability' : 'Single-AZ'})</td>
                      <td className="p-2 text-right font-mono font-medium">{formatCurrency(reportData.estimateDetails.databaseMonthlyCost)}</td>
                      <td className="p-2 text-right font-mono font-medium">{formatCurrency(reportData.estimateDetails.databaseMonthlyCost * 12)}</td>
                      <td className="p-2 text-right text-slate-500">{Math.round((reportData.estimateDetails.databaseMonthlyCost / reportData.targetCloudMonthlySpend) * 100)}%</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-semibold">Storage</td>
                      <td className="p-2 text-slate-600">{reportData.estimateDetails.totalStorageGB} GB ({reportData.estimateDetails.storageType})</td>
                      <td className="p-2 text-right font-mono font-medium">{formatCurrency(reportData.estimateDetails.storageMonthlyCost)}</td>
                      <td className="p-2 text-right font-mono font-medium">{formatCurrency(reportData.estimateDetails.storageMonthlyCost * 12)}</td>
                      <td className="p-2 text-right text-slate-500">{Math.round((reportData.estimateDetails.storageMonthlyCost / reportData.targetCloudMonthlySpend) * 100)}%</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-semibold">Networking</td>
                      <td className="p-2 text-slate-600">Load Balancers, NAT Gateways & {reportData.estimateDetails.networkEgressGB} GB Egress</td>
                      <td className="p-2 text-right font-mono font-medium">{formatCurrency(reportData.estimateDetails.networkingMonthlyCost)}</td>
                      <td className="p-2 text-right font-mono font-medium">{formatCurrency(reportData.estimateDetails.networkingMonthlyCost * 12)}</td>
                      <td className="p-2 text-right text-slate-500">{Math.round((reportData.estimateDetails.networkingMonthlyCost / reportData.targetCloudMonthlySpend) * 100)}%</td>
                    </tr>
                    <tr className="bg-slate-50 font-bold">
                      <td className="p-2">TOTAL TARGET SPEND</td>
                      <td className="p-2 text-slate-600">Enterprise Cloud Run Rate</td>
                      <td className="p-2 text-right font-mono text-blue-800">{formatCurrency(reportData.targetCloudMonthlySpend)}</td>
                      <td className="p-2 text-right font-mono text-blue-800">{formatCurrency(reportData.targetCloudMonthlySpend * 12)}</td>
                      <td className="p-2 text-right text-slate-800">100%</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Top Optimization Recommendations Table */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 mb-2">
                  4. Top FinOps Optimization Opportunities
                </h4>
                <div className="space-y-2">
                  {reportData.topOptimizations?.slice(0, 4).map((opt) => (
                    <div key={opt.id} className="p-2.5 border border-slate-200 rounded-lg flex justify-between items-center text-[11px]">
                      <div className="space-y-0.5">
                        <div className="font-bold text-slate-800">{opt.title}</div>
                        <div className="text-slate-500">{opt.suggestedOptimization}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Save {formatCurrency(opt.expectedMonthlySavings)}/mo
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Disclaimer */}
              <div className="pt-3 border-t border-slate-200 text-[10px] text-slate-400 italic">
                {reportData.methodologyDisclaimer}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end print:hidden">
              <Button variant="secondary" size="sm" onClick={() => setIsReportModalOpen(false)}>
                Close Report
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
