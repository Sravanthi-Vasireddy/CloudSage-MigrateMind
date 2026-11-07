import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Server,
  TrendingUp,
  DollarSign,
  Activity,
  Layers,
  ArrowRight,
  FileCode2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Download,
  RefreshCw,
  FolderGit2,
  User,
  ShieldCheck,
  Award
} from 'lucide-react';
import { reportsApi } from '../services/reportsApi';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';
import { useProject } from '../context/ProjectContext';
import { StatCard } from '../components/common/StatCard';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Table } from '../components/common/Table';
import {
  dashboardSummaryCards,
  workload6RDistribution,
  monthlyCloudCostTrend,
  recentMigrationProjects,
  recentActivityFeed
} from '../data/mockDashboard';
import { formatCurrency } from '../utils/formatters';

export const OverviewPage = () => {
  const { currentProject, showToast } = useProject();
  const navigate = useNavigate();
  const [projectStats, setProjectStats] = React.useState(null);

  React.useEffect(() => {
    reportsApi.getProjectStatistics()
      .then((res) => setProjectStats(res))
      .catch((err) => console.warn('Overview project statistics error:', err));
  }, []);

  const handleSyncDiscovery = () => {
    showToast('Discovery sync triggered: Updated inventory from vCenter and CMDB.');
  };

  const handleExportBrief = () => {
    showToast('Executive migration assessment summary generated.');
  };

  // Recent Projects Table Columns definition
  const projectColumns = [
    {
      header: 'Project Name',
      key: 'projectName',
      render: (item) => (
        <div>
          <div className="font-semibold text-slate-900 flex items-center gap-2">
            <FolderGit2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="hover:text-blue-600 transition-colors cursor-pointer" onClick={() => navigate('/projects')}>
              {item.projectName}
            </span>
          </div>
          <span className="text-[11px] text-slate-500">{item.client} • {item.targetCloud}</span>
        </div>
      ),
    },
    {
      header: 'Workloads',
      key: 'workloadsCount',
      render: (item) => (
        <span className="font-semibold text-slate-800 text-xs">
          {item.workloadsCount} Workloads
        </span>
      ),
    },
    {
      header: 'Migration Status',
      key: 'status',
      render: (item) => (
        <Badge variant={item.statusVariant || 'blue'} size="xs">
          {item.status}
        </Badge>
      ),
    },
    {
      header: 'Progress',
      key: 'progress',
      render: (item) => (
        <div className="w-28">
          <div className="flex items-center justify-between text-[11px] text-slate-600 mb-1">
            <span>Wave Progress</span>
            <span className="font-bold text-slate-800">{item.progress}%</span>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${item.progress}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      header: 'Last Updated',
      key: 'lastUpdated',
      align: 'right',
      render: (item) => (
        <div className="text-right text-[11px] text-slate-500 font-medium">
          {item.lastUpdated}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 mb-1">
            <span>Executive Dashboard</span>
            <span>•</span>
            <span>HCLTech Cloud Native Advisory</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Cloud Migration Overview
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Enterprise workload assessment, 6R migration portfolio formulation, and target cloud financial analytics.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            icon={RefreshCw}
            onClick={handleSyncDiscovery}
          >
            Sync Discovery
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={Download}
            onClick={handleExportBrief}
          >
            Export Brief
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={FileCode2}
            onClick={() => navigate('/terraform')}
          >
            Generate IaC
          </Button>
        </div>
      </div>

      {/* Stage 10 Final Consolidated Project Readiness Dashboard */}
      {projectStats && (
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-5 space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-slate-100 gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-sm">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    Final Cloud Migration Readiness Dashboard
                  </h3>
                  <Badge variant="emerald" size="xs">
                    Stage 1–10 Consolidated
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Multi-stage migration assessment synthesis &bull; Master Readiness Score: <strong className="text-emerald-600 font-extrabold">{projectStats.overallProjectReadinessScore}%</strong>
                </p>
              </div>
            </div>

            <Button
              variant="secondary"
              size="xs"
              icon={ArrowRight}
              iconPosition="right"
              onClick={() => navigate('/reports')}
            >
              View Full Master Blueprint
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 space-y-0.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Inventory</span>
              <strong className="text-slate-900 text-sm block">{projectStats.totalServersCount} Servers</strong>
              <span className="text-[11px] text-slate-500 block">{projectStats.totalDatabasesCount} DB Instances</span>
            </div>

            <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-200/80 space-y-0.5">
              <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">6Rs Strategy</span>
              <strong className="text-blue-900 text-sm block">{projectStats.totalWorkloadsAssessed} Assessed</strong>
              <span className="text-[11px] text-blue-700 block">{projectStats.replatformCount} Replatform &bull; {projectStats.rehostCount} Rehost</span>
            </div>

            <div className="p-3 rounded-lg bg-purple-50/60 border border-purple-200/80 space-y-0.5">
              <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">Target Arch</span>
              <strong className="text-purple-900 text-sm block">100% Ready</strong>
              <span className="text-[11px] text-purple-700 block">Amazon EKS &bull; Aurora</span>
            </div>

            <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-200/80 space-y-0.5">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">FinOps TCO</span>
              <strong className="text-emerald-900 text-sm block">38.1% Savings</strong>
              <span className="text-[11px] text-emerald-700 block">${projectStats.estimatedAnnualSavings?.toLocaleString()} / yr</span>
            </div>

            <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-200/80 space-y-0.5">
              <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">Execution</span>
              <strong className="text-amber-900 text-sm block">{projectStats.migrationProgressPercentage}% Waves</strong>
              <span className="text-[11px] text-amber-700 block">5 Waves &bull; 15 Tasks</span>
            </div>

            <div className="p-3 rounded-lg bg-sky-50/60 border border-sky-200/80 space-y-0.5">
              <span className="text-[10px] font-bold text-sky-700 uppercase tracking-wider block">Compliance</span>
              <strong className="text-sky-900 text-sm block">{projectStats.complianceReadinessPercentage}% Aligned</strong>
              <span className="text-[11px] text-sky-700 block">GDPR &bull; ISO &bull; SOC2</span>
            </div>
          </div>
        </div>
      )}

      {/* TASK 3.A: Four Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Workloads: 48 */}
        <StatCard
          title="Total Workloads"
          value="48"
          subtext="Discovered across VMware & CMDB"
          trend="+4 this cycle"
          trendDirection="up"
          color="blue"
          icon={Server}
        />

        {/* Card 2: Assessed Workloads: 36 */}
        <StatCard
          title="Assessed Workloads"
          value="36"
          subtext="75% of catalog assessed"
          trend="12 pending"
          trendDirection="neutral"
          color="purple"
          icon={Layers}
        />

        {/* Card 3: Estimated Monthly Cloud Cost: $12,450 */}
        <StatCard
          title="Estimated Monthly Cloud Cost"
          value="$12,450"
          subtext="Projected AWS run-rate spend"
          trend="38% savings"
          trendDirection="up"
          color="emerald"
          icon={DollarSign}
        />

        {/* Card 4: Migration Progress: 65% */}
        <StatCard
          title="Migration Progress"
          value="65%"
          subtext="Wave 2 Execution in progress"
          trend="On schedule"
          trendDirection="up"
          color="amber"
          icon={TrendingUp}
        />
      </div>

      {/* TASK 3.B & 3.C: Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* TASK 3.B: Workload Distribution Chart (6Rs) (5 cols) */}
        <Card
          className="lg:col-span-5"
          title="Workload 6R Strategy Distribution"
          subtitle="Portfolio allocation across Rehost, Replatform, Refactor, Repurchase, Retire, Retain"
          actions={
            <Button
              variant="ghost"
              size="xs"
              icon={ArrowRight}
              iconPosition="right"
              onClick={() => navigate('/strategy')}
            >
              Configure
            </Button>
          }
        >
          <div className="h-64 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={workload6RDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="count"
                >
                  {workload6RDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val, name, item) => [
                    `${val} workloads (${item.payload.percentage}%)`,
                    item.payload.name,
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
            {/* Center Label inside Donut */}
            <div className="absolute text-center pointer-events-none">
              <span className="text-2xl font-extrabold text-slate-800">
                48
              </span>
              <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">
                Total Workloads
              </span>
            </div>
          </div>

          {/* 6R Legend Grid */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100">
            {workload6RDistribution.map((item) => (
              <div
                key={item.name}
                className="flex items-center gap-2 p-1.5 rounded hover:bg-slate-50 transition-colors cursor-pointer"
                onClick={() => navigate('/strategy')}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-slate-800 leading-tight">
                    {item.name}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {item.count} ({item.percentage}%)
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* TASK 3.C: Cloud Cost Overview Chart (7 cols) */}
        <Card
          className="lg:col-span-7"
          title="Cloud Cost Overview & TCO Comparison"
          subtitle="Sample monthly costs: On-Premises datacenter vs Target AWS Cloud ($12,450/mo optimized)"
          actions={
            <Button
              variant="ghost"
              size="xs"
              icon={ArrowRight}
              iconPosition="right"
              onClick={() => navigate('/finops')}
            >
              Cost Modeling
            </Button>
          }
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyCloudCostTrend.slice(0, 8)}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748b' }}
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
                <Legend
                  wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                  iconType="circle"
                />
                <Bar dataKey="onPremSpend" name="Current On-Premises" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="optimizedSpend" name="Target AWS Cloud (Optimized)" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between pt-2 border-t border-slate-100">
            <span>On-prem spend drops to $0 by Month 8 cutover</span>
            <span className="font-semibold text-emerald-600">Projected Run Rate: $12,450 / month</span>
          </div>
        </Card>
      </div>

      {/* TASK 3.D & 3.E: Recent Migration Projects Table & Recent Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* TASK 3.D: Recent Migration Projects Table (8 cols) */}
        <Card
          className="lg:col-span-8"
          title="Recent Migration Projects"
          subtitle="Portfolio tracking across active cloud modernization initiatives"
          actions={
            <Button
              variant="outline"
              size="xs"
              icon={ArrowRight}
              iconPosition="right"
              onClick={() => navigate('/projects')}
            >
              View All
            </Button>
          }
          noPadding
        >
          <Table
            columns={projectColumns}
            data={recentMigrationProjects}
            onRowClick={(item) => navigate('/projects')}
          />
        </Card>

        {/* TASK 3.E: Recent Activity Section (4 cols) */}
        <Card
          className="lg:col-span-4"
          title="Recent Activity"
          subtitle="Real-time log of assessment actions, overrides & IaC generations"
        >
          <div className="space-y-3.5">
            {recentActivityFeed.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 pb-3 border-b border-slate-100 last:border-0 last:pb-0"
              >
                <div className="mt-0.5 p-1.5 rounded-lg bg-blue-50 text-blue-600 shrink-0 border border-blue-100">
                  <Activity className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 truncate">{activity.title}</span>
                    <span className="text-[10px] text-slate-400 shrink-0 font-mono ml-2">{activity.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                    {activity.description}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-400">
                    <span className="font-medium text-slate-700">{activity.user}</span>
                    <span>•</span>
                    <Badge variant="slate" size="xs">
                      {activity.category}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

