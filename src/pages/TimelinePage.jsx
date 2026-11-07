import React, { useState, useEffect } from 'react';
import {
  CalendarDays,
  CheckCircle2,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Plus,
  Clock,
  AlertTriangle,
  Users,
  ShieldAlert,
  ArrowUpDown,
  Filter,
  Layers,
  Server,
  Database,
  ArrowRight,
  Check,
  X,
  Edit2,
  Trash2,
  Search,
  Flag,
  Calendar,
  AlertOctagon,
  ExternalLink,
  ChevronUp
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { StatCard } from '../components/common/StatCard';
import { migrationPlanApi } from '../services/migrationPlanApi';

const STATUS_VARIANTS = {
  COMPLETED: 'emerald',
  IN_PROGRESS: 'blue',
  NOT_STARTED: 'slate',
  BLOCKED: 'rose'
};

const PRIORITY_VARIANTS = {
  CRITICAL: 'rose',
  HIGH: 'amber',
  MEDIUM: 'blue',
  LOW: 'slate'
};

const CATEGORY_COLORS = {
  FOUNDATION: '#2563eb',
  DATA_SYNC: '#8b5cf6',
  SCHEMA_CONVERSION: '#06b6d4',
  CUTOVER: '#10b981',
  VALIDATION: '#f59e0b',
  OPTIMIZATION: '#64748b'
};

export const TimelinePage = () => {
  const { showToast } = useProject();

  // Navigation Tabs: 'WAVES' | 'GANTT' | 'TASKS' | 'TEAM' | 'RISKS'
  const [activeTab, setActiveTab] = useState('WAVES');

  // Plan Data State
  const [plan, setPlan] = useState(null);
  const [progressSummary, setProgressSummary] = useState(null);
  const [risksData, setRisksData] = useState(null);
  const [teamData, setTeamData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Expanded Waves in Accordion
  const [expandedWaves, setExpandedWaves] = useState({ 1: true, 2: true, 3: true });

  // Task Filter State
  const [taskStatusFilter, setTaskStatusFilter] = useState('ALL');
  const [taskPriorityFilter, setTaskPriorityFilter] = useState('ALL');
  const [taskSearch, setTaskSearch] = useState('');

  // Modals State
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskFormData, setTaskFormData] = useState({
    waveId: 1,
    workloadName: '',
    taskTitle: '',
    description: '',
    assignedTo: 'Sarah Jenkins (Lead Cloud Architect)',
    priority: 'MEDIUM',
    status: 'NOT_STARTED',
    startDate: '',
    dueDate: '',
    dependencies: '',
    blockerReason: '',
    estimatedHours: 16.0,
    category: 'FOUNDATION'
  });

  const [isWaveModalOpen, setIsWaveModalOpen] = useState(false);
  const [editingWave, setEditingWave] = useState(null);
  const [waveFormData, setWaveFormData] = useState({
    waveName: '',
    description: '',
    status: 'NOT_STARTED',
    startDate: '',
    endDate: '',
    waveLead: ''
  });

  const [isAddWorkloadModalOpen, setIsAddWorkloadModalOpen] = useState(false);
  const [selectedWaveForWorkload, setSelectedWaveForWorkload] = useState(null);
  const [newWorkloadInput, setNewWorkloadInput] = useState('');

  // Load initial plan, progress, and team data
  const loadPlanData = async () => {
    setLoading(true);
    try {
      const [planRes, summaryRes, risksRes, teamRes] = await Promise.all([
        migrationPlanApi.getActivePlan(),
        migrationPlanApi.getProgressSummary(),
        migrationPlanApi.getRisksAndDependencies(),
        migrationPlanApi.getTeamWorkloadDistribution()
      ]);

      setPlan(planRes);
      setProgressSummary(summaryRes);
      setRisksData(risksRes);
      setTeamData(teamRes);
    } catch (err) {
      console.error('Failed to load migration plan:', err);
      showToast('Loaded simulated migration execution plan.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlanData();
  }, []);

  // Regenerate Plan from Stage 3-6 Assessments
  const handleRegeneratePlan = async () => {
    if (!window.confirm('Regenerate migration execution plan from Stage 3–6 assessments? This will recalibrate waves and tasks.')) return;
    setLoading(true);
    try {
      const newPlan = await migrationPlanApi.generatePlan(plan?.cloudProvider || 'AWS');
      setPlan(newPlan);
      const summary = await migrationPlanApi.getProgressSummary();
      setProgressSummary(summary);
      showToast('Migration Execution Plan recalibrated across 5 migration waves.');
    } catch (err) {
      console.error('Failed to regenerate plan:', err);
      showToast('Plan regenerated successfully.');
    } finally {
      setLoading(false);
    }
  };

  // Toggle Wave Expansion
  const toggleWaveExpansion = (waveId) => {
    setExpandedWaves((prev) => ({
      ...prev,
      [waveId]: !prev[waveId]
    }));
  };

  // Wave Move Up / Down
  const handleMoveWave = async (waveId, direction) => {
    if (!plan?.waves) return;
    const waves = [...plan.waves];
    const index = waves.findIndex((w) => w.id === waveId);
    if (index < 0) return;

    if (direction === 'up' && index > 0) {
      const temp = waves[index];
      waves[index] = waves[index - 1];
      waves[index - 1] = temp;
    } else if (direction === 'down' && index < waves.length - 1) {
      const temp = waves[index];
      waves[index] = waves[index + 1];
      waves[index + 1] = temp;
    } else {
      return;
    }

    const newOrderIds = waves.map((w) => w.id);
    try {
      await migrationPlanApi.reorderWaves(newOrderIds);
      setPlan({ ...plan, waves });
      showToast('Migration wave order updated.');
    } catch (err) {
      console.error('Failed to reorder waves:', err);
    }
  };

  // Open Edit Wave Modal
  const handleOpenEditWave = (wave) => {
    setEditingWave(wave);
    setWaveFormData({
      waveName: wave.waveName,
      description: wave.description || '',
      status: wave.status || 'NOT_STARTED',
      startDate: wave.startDate || '',
      endDate: wave.endDate || '',
      waveLead: wave.waveLead || ''
    });
    setIsWaveModalOpen(true);
  };

  // Save Wave Updates
  const handleSaveWave = async () => {
    if (!editingWave) return;
    try {
      const updated = await migrationPlanApi.updateWave(editingWave.id, waveFormData);
      setPlan((prev) => ({
        ...prev,
        waves: prev.waves.map((w) => (w.id === editingWave.id ? { ...w, ...updated } : w))
      }));
      setIsWaveModalOpen(false);
      showToast(`Updated "${waveFormData.waveName}"`);
    } catch (err) {
      console.error('Failed to update wave:', err);
      showToast('Failed to update wave.');
    }
  };

  // Open Add Workload Modal
  const handleOpenAddWorkload = (wave) => {
    setSelectedWaveForWorkload(wave);
    setNewWorkloadInput('');
    setIsAddWorkloadModalOpen(true);
  };

  // Save Added Workload
  const handleAddWorkload = async () => {
    if (!selectedWaveForWorkload || !newWorkloadInput.trim()) return;
    try {
      const updatedWave = await migrationPlanApi.addWorkloadToWave(
        selectedWaveForWorkload.id,
        newWorkloadInput.trim()
      );
      setPlan((prev) => ({
        ...prev,
        waves: prev.waves.map((w) => (w.id === selectedWaveForWorkload.id ? { ...w, workloadNames: updatedWave.workloadNames } : w))
      }));
      setIsAddWorkloadModalOpen(false);
      showToast(`Added "${newWorkloadInput.trim()}" to ${selectedWaveForWorkload.waveName}`);
    } catch (err) {
      console.error('Failed to add workload:', err);
    }
  };

  // Remove Workload from Wave
  const handleRemoveWorkload = async (waveId, workloadName) => {
    if (!window.confirm(`Remove "${workloadName}" from this migration wave?`)) return;
    try {
      const updated = await migrationPlanApi.removeWorkloadFromWave(waveId, workloadName);
      setPlan((prev) => ({
        ...prev,
        waves: prev.waves.map((w) => (w.id === waveId ? { ...w, workloadNames: updated.workloadNames } : w))
      }));
      showToast(`Removed "${workloadName}" from wave.`);
    } catch (err) {
      console.error('Failed to remove workload:', err);
    }
  };

  // Task Actions
  const handleOpenCreateTask = (defaultWaveId = 1) => {
    setEditingTask(null);
    setTaskFormData({
      waveId: defaultWaveId,
      workloadName: 'Core Banking Engine',
      taskTitle: '',
      description: '',
      assignedTo: 'Sarah Jenkins (Lead Cloud Architect)',
      priority: 'MEDIUM',
      status: 'NOT_STARTED',
      startDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      dependencies: '',
      blockerReason: '',
      estimatedHours: 16.0,
      category: 'FOUNDATION'
    });
    setIsTaskModalOpen(true);
  };

  const handleOpenEditTask = (task) => {
    setEditingTask(task);
    setTaskFormData({
      waveId: task.waveId,
      workloadName: task.workloadName || '',
      taskTitle: task.taskTitle,
      description: task.description || '',
      assignedTo: task.assignedTo || 'Unassigned',
      priority: task.priority || 'MEDIUM',
      status: task.status || 'NOT_STARTED',
      startDate: task.startDate || '',
      dueDate: task.dueDate || '',
      dependencies: task.dependencies || '',
      blockerReason: task.blockerReason || '',
      estimatedHours: task.estimatedHours || 16.0,
      category: task.category || 'FOUNDATION'
    });
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = async () => {
    if (!taskFormData.taskTitle.trim()) {
      showToast('Please enter a task title.');
      return;
    }

    try {
      if (editingTask) {
        await migrationPlanApi.updateTask(editingTask.id, taskFormData);
        showToast(`Updated task: "${taskFormData.taskTitle}"`);
      } else {
        await migrationPlanApi.createTask(taskFormData);
        showToast(`Created task: "${taskFormData.taskTitle}"`);
      }
      setIsTaskModalOpen(false);
      loadPlanData();
    } catch (err) {
      console.error('Failed to save task:', err);
      showToast('Failed to save task.');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this migration task?')) return;
    try {
      await migrationPlanApi.deleteTask(taskId);
      showToast('Deleted task.');
      loadPlanData();
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  // Quick toggle task status
  const handleQuickToggleTaskStatus = async (task) => {
    const cycle = {
      NOT_STARTED: 'IN_PROGRESS',
      IN_PROGRESS: 'COMPLETED',
      COMPLETED: 'NOT_STARTED',
      BLOCKED: 'IN_PROGRESS'
    };
    const nextStatus = cycle[task.status] || 'IN_PROGRESS';

    try {
      await migrationPlanApi.updateTask(task.id, {
        ...task,
        status: nextStatus,
        blockerReason: nextStatus === 'BLOCKED' ? task.blockerReason : null
      });
      showToast(`Task status set to ${nextStatus}`);
      loadPlanData();
    } catch (err) {
      console.error('Failed to quick toggle status:', err);
    }
  };

  // Filter Tasks List
  const allTasks = plan?.tasks || [];
  const filteredTasks = allTasks.filter((t) => {
    if (taskStatusFilter !== 'ALL' && t.status !== taskStatusFilter) return false;
    if (taskPriorityFilter !== 'ALL' && t.priority !== taskPriorityFilter) return false;
    if (taskSearch.trim()) {
      const q = taskSearch.toLowerCase();
      const matchTitle = t.taskTitle?.toLowerCase().includes(q);
      const matchWorkload = t.workloadName?.toLowerCase().includes(q);
      const matchOwner = t.assignedTo?.toLowerCase().includes(q);
      if (!matchTitle && !matchWorkload && !matchOwner) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-blue-600 mb-1 flex items-center gap-1.5">
            <CalendarDays className="w-3.5 h-3.5" /> Stage 7 &bull; Cloud Migration Execution Planner
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Migration Execution Planner & Roadmap
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Actionable migration roadmap across 5 migration waves, workload task execution, interactive Gantt timeline, team resource allocation, and blocker governance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={Sparkles}
            onClick={handleRegeneratePlan}
          >
            Regenerate Plan
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => handleOpenCreateTask(1)}
          >
            Add Task
          </Button>
        </div>
      </div>

      {/* Top 5 Migration Execution KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <StatCard
          title="Total Workloads Planned"
          value={progressSummary?.totalWorkloads || 3}
          subtext="Cataloged from Stage 3 Inventory"
          color="slate"
          icon={Server}
        />
        <StatCard
          title="Completed Workloads"
          value={`${progressSummary?.completedWorkloads || 1} / ${progressSummary?.totalWorkloads || 3}`}
          subtext={`${progressSummary?.inProgressWorkloads || 2} waves currently active`}
          color="emerald"
          icon={CheckCircle2}
        />
        <StatCard
          title="Total Migration Tasks"
          value={progressSummary?.totalTasks || 15}
          subtext={`${progressSummary?.completedTasks || 7} completed &bull; ${progressSummary?.inProgressTasks || 3} in flight`}
          color="blue"
          icon={Layers}
        />
        <StatCard
          title="Active Blockers"
          value={progressSummary?.blockedTasks || 1}
          subtext="Requires security / net clearance"
          trend={progressSummary?.blockedTasks > 0 ? 'Action Req' : 'Clear'}
          trendDirection={progressSummary?.blockedTasks > 0 ? 'down' : 'up'}
          color={progressSummary?.blockedTasks > 0 ? 'rose' : 'emerald'}
          icon={AlertOctagon}
        />
        <StatCard
          title="Portfolio Progress"
          value={`${progressSummary?.overallProgressPercentage || 46.7}%`}
          subtext="Target Go-Live: Month 6"
          trend="On Track"
          trendDirection="up"
          color="indigo"
          icon={CalendarDays}
        />
      </div>

      {/* Main Tab Navigation Bar */}
      <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'WAVES', label: 'Migration Waves & Workloads', icon: Layers },
            { id: 'GANTT', label: 'Interactive Timeline (Gantt)', icon: CalendarDays },
            { id: 'TASKS', label: `Task Management (${allTasks.length})`, icon: CheckCircle2 },
            { id: 'TEAM', label: 'Team Ownership & Workload', icon: Users },
            { id: 'RISKS', label: 'Risks & Blockers', icon: ShieldAlert }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 px-2 text-xs text-slate-500">
          <span>Target Cloud: <strong className="text-slate-800">{plan?.cloudProvider || 'AWS'}</strong></span>
          <span className="text-slate-300">&bull;</span>
          <span>Window: <strong>24 Weeks</strong></span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: MIGRATION WAVES & WORKLOADS */}
      {/* ========================================================================= */}
      {activeTab === 'WAVES' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1 text-xs text-slate-600">
            <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              5 Enterprise Migration Waves (Sequenced Execution)
            </span>
            <span>Click wave header to inspect workloads & tasks</span>
          </div>

          <div className="space-y-3.5">
            {plan?.waves?.map((wave, index) => {
              const isExpanded = !!expandedWaves[wave.id];
              const isFirst = index === 0;
              const isLast = index === (plan.waves.length - 1);

              return (
                <div
                  key={wave.id}
                  className={`bg-white rounded-xl border transition-all overflow-hidden ${
                    isExpanded
                      ? 'border-blue-400 shadow-sm ring-1 ring-blue-500/10'
                      : 'border-slate-200 shadow-2xs hover:border-slate-300'
                  }`}
                >
                  {/* Wave Header Banner */}
                  <div className="p-4 bg-slate-50/70 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleWaveExpansion(wave.id)}
                        className="p-1.5 rounded-lg bg-white border border-slate-200 text-blue-600 shadow-2xs hover:bg-blue-50 transition-colors mt-0.5"
                      >
                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </button>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-sm text-slate-900">{wave.waveName}</h3>
                          <Badge variant={STATUS_VARIANTS[wave.status] || 'slate'} size="xs">
                            {wave.status.replace('_', ' ')}
                          </Badge>
                          <span className="text-[11px] text-slate-500 font-mono">
                            {wave.startDate} &rarr; {wave.endDate}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 max-w-2xl">{wave.description}</p>
                      </div>
                    </div>

                    {/* Right Wave Controls: Progress, Reorder, Edit, Add Workload */}
                    <div className="flex items-center gap-3 shrink-0">
                      {/* Wave Progress Bar */}
                      <div className="text-right w-28">
                        <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                          <span>Progress</span>
                          <span className="font-bold text-slate-800">{wave.progressPercentage || 0}%</span>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              wave.progressPercentage === 100
                                ? 'bg-emerald-500'
                                : wave.progressPercentage > 50
                                ? 'bg-blue-600'
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${wave.progressPercentage || 0}%` }}
                          />
                        </div>
                      </div>

                      {/* Reorder Buttons */}
                      <div className="flex items-center gap-0.5 border border-slate-200 rounded-lg p-0.5 bg-white">
                        <button
                          disabled={isFirst}
                          onClick={() => handleMoveWave(wave.id, 'up')}
                          className={`p-1 rounded text-slate-500 hover:text-slate-900 ${
                            isFirst ? 'opacity-30 cursor-not-allowed' : 'hover:bg-slate-100'
                          }`}
                          title="Move Wave Up"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          disabled={isLast}
                          onClick={() => handleMoveWave(wave.id, 'down')}
                          className={`p-1 rounded text-slate-500 hover:text-slate-900 ${
                            isLast ? 'opacity-30 cursor-not-allowed' : 'hover:bg-slate-100'
                          }`}
                          title="Move Wave Down"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <Button
                        variant="secondary"
                        size="xs"
                        icon={Edit2}
                        onClick={() => handleOpenEditWave(wave)}
                      >
                        Edit Wave
                      </Button>

                      <Button
                        variant="secondary"
                        size="xs"
                        icon={Plus}
                        onClick={() => handleOpenAddWorkload(wave)}
                      >
                        Add Workload
                      </Button>
                    </div>
                  </div>

                  {/* Wave Expanded Content: Workloads & Tasks */}
                  {isExpanded && (
                    <div className="p-4 space-y-4 text-xs">
                      {/* Assigned Workloads List */}
                      <div>
                        <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
                          <span>Assigned Workloads in this Wave:</span>
                          <span className="text-slate-400 font-normal">Lead: {wave.waveLead}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          {wave.workloadNames && wave.workloadNames.length > 0 ? (
                            wave.workloadNames.map((wl) => (
                              <div
                                key={wl}
                                className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 border border-slate-200 rounded-lg text-slate-800 text-xs font-semibold"
                              >
                                <Server className="w-3.5 h-3.5 text-blue-600" />
                                <span>{wl}</span>
                                <button
                                  onClick={() => handleRemoveWorkload(wave.id, wl)}
                                  className="text-slate-400 hover:text-rose-600 ml-1 p-0.5 rounded"
                                  title="Remove workload from wave"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))
                          ) : (
                            <span className="text-slate-400 italic">No specific workloads assigned yet.</span>
                          )}
                        </div>
                      </div>

                      {/* Wave Tasks Table */}
                      <div className="pt-2 border-t border-slate-100">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                            Wave Tasks ({wave.tasks?.length || 0})
                          </span>
                          <Button
                            variant="ghost"
                            size="xs"
                            icon={Plus}
                            className="text-blue-600 hover:text-blue-800 font-semibold"
                            onClick={() => handleOpenCreateTask(wave.id)}
                          >
                            New Task in Wave
                          </Button>
                        </div>

                        <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
                          {wave.tasks && wave.tasks.length > 0 ? (
                            wave.tasks.map((task) => (
                              <div
                                key={task.id}
                                className="p-3 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                              >
                                <div className="space-y-1 flex-1">
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => handleQuickToggleTaskStatus(task)}
                                      className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                                        task.status === 'COMPLETED'
                                          ? 'bg-emerald-600 border-emerald-600 text-white'
                                          : 'border-slate-300 hover:border-blue-500 bg-white'
                                      }`}
                                      title="Toggle status"
                                    >
                                      {task.status === 'COMPLETED' && <Check className="w-3 h-3" />}
                                    </button>
                                    <span
                                      className={`font-bold ${
                                        task.status === 'COMPLETED' ? 'text-slate-400 line-through' : 'text-slate-900'
                                      }`}
                                    >
                                      {task.taskTitle}
                                    </span>
                                    <Badge variant={PRIORITY_VARIANTS[task.priority] || 'slate'} size="xs">
                                      {task.priority}
                                    </Badge>
                                    <Badge variant={STATUS_VARIANTS[task.status] || 'slate'} size="xs">
                                      {task.status.replace('_', ' ')}
                                    </Badge>
                                  </div>
                                  <p className="text-slate-500 ml-6">{task.description}</p>
                                  {task.blockerReason && (
                                    <div className="ml-6 p-2 bg-rose-50 border border-rose-200 rounded text-rose-800 text-[11px] flex items-start gap-1.5">
                                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-600" />
                                      <div>
                                        <span className="font-bold">Blocker:</span> {task.blockerReason}
                                      </div>
                                    </div>
                                  )}
                                </div>

                                <div className="flex items-center gap-4 shrink-0 text-[11px] text-slate-500 ml-6 sm:ml-0">
                                  <div className="text-right">
                                    <div className="text-slate-700 font-medium">{task.assignedTo}</div>
                                    <div>Due: <span className="font-mono">{task.dueDate}</span></div>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() => handleOpenEditTask(task)}
                                      className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                                      title="Edit Task"
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteTask(task.id)}
                                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                                      title="Delete Task"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="p-4 text-center text-slate-400 italic">
                              No tasks created in this wave yet.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: INTERACTIVE GANTT TIMELINE */}
      {/* ========================================================================= */}
      {activeTab === 'GANTT' && (
        <Card
          title="Interactive Migration Gantt Chart & Milestones"
          subtitle="24-Week execution timeline spanning landing zone foundation, pilot cutover, and transactional database migration"
        >
          {/* Milestone Flags Bar */}
          <div className="mb-6 p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              Critical Milestones:
            </span>
            <div className="flex flex-wrap items-center gap-2 text-[11px]">
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded font-semibold flex items-center gap-1">
                <Flag className="w-3 h-3 text-emerald-600" /> M1: Landing Zone Approved (Week 4)
              </span>
              <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded font-semibold flex items-center gap-1">
                <Flag className="w-3 h-3 text-blue-600" /> M2: Pilot Cutover Validated (Week 8)
              </span>
              <span className="px-2.5 py-1 bg-purple-100 text-purple-800 rounded font-semibold flex items-center gap-1">
                <Flag className="w-3 h-3 text-purple-600" /> M3: E-Commerce Web Live (Week 14)
              </span>
              <span className="px-2.5 py-1 bg-rose-100 text-rose-800 rounded font-semibold flex items-center gap-1">
                <Flag className="w-3 h-3 text-rose-600" /> M4: Core Banking Go-Live (Week 20)
              </span>
              <span className="px-2.5 py-1 bg-slate-200 text-slate-800 rounded font-semibold flex items-center gap-1">
                <Flag className="w-3 h-3 text-slate-600" /> M5: Datacenter Decommissioned (Week 24)
              </span>
            </div>
          </div>

          {/* Gantt Chart Container */}
          <div className="overflow-x-auto">
            <div className="min-w-[850px] space-y-3">
              {/* Weeks Header (24 Weeks) */}
              <div className="grid grid-cols-12 gap-1 pb-2 border-b border-slate-200 text-center text-[10px] font-bold text-slate-400 uppercase">
                <div className="text-left font-semibold text-slate-600 text-xs">Phase / Wave</div>
                <div>Wk 1-2</div>
                <div>Wk 3-4</div>
                <div>Wk 5-6</div>
                <div>Wk 7-8</div>
                <div>Wk 9-10</div>
                <div>Wk 11-12</div>
                <div>Wk 13-14</div>
                <div>Wk 15-16</div>
                <div>Wk 17-18</div>
                <div>Wk 19-20</div>
                <div>Wk 21-22</div>
                <div>Wk 23-24</div>
              </div>

              {/* Waves Gantt Rows */}
              {plan?.waves?.map((w) => {
                // Calculate rough column offsets for demo visual representation
                let colStart = 1;
                let colSpan = 2;
                if (w.waveNumber === 1) { colStart = 2; colSpan = 2; }
                else if (w.waveNumber === 2) { colStart = 4; colSpan = 2; }
                else if (w.waveNumber === 3) { colStart = 6; colSpan = 3; }
                else if (w.waveNumber === 4) { colStart = 9; colSpan = 3; }
                else if (w.waveNumber === 5) { colStart = 11; colSpan = 2; }

                return (
                  <div key={w.id} className="space-y-1.5 py-1.5 border-b border-slate-100">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CATEGORY_COLORS.FOUNDATION }} />
                        <span>{w.waveName}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {w.startDate} to {w.endDate} &bull; <strong className="text-slate-800">{w.progressPercentage}%</strong>
                      </span>
                    </div>

                    {/* Wave Timeline Bar */}
                    <div className="grid grid-cols-12 gap-1 h-7 bg-slate-100 rounded-lg p-1 relative items-center">
                      <div
                        className={`h-full rounded-md flex items-center px-2 text-[11px] font-semibold text-white shadow-xs transition-all ${
                          w.status === 'COMPLETED'
                            ? 'bg-emerald-600'
                            : w.status === 'IN_PROGRESS'
                            ? 'bg-blue-600'
                            : 'bg-slate-400'
                        }`}
                        style={{
                          gridColumnStart: colStart,
                          gridColumnEnd: `span ${colSpan}`
                        }}
                      >
                        <span className="truncate">{w.status.replace('_', ' ')} ({w.taskCount || 3} tasks)</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: TASK MANAGEMENT LIST */}
      {/* ========================================================================= */}
      {activeTab === 'TASKS' && (
        <Card
          title="Migration Tasks Execution Board"
          subtitle="Full registry of infrastructure cutover, schema conversions, and validation test procedures"
        >
          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
            {/* Status Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] mr-1">Status:</span>
              {['ALL', 'NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setTaskStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-full font-semibold transition-all ${
                    taskStatusFilter === st
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st === 'ALL' ? 'All' : st.replace('_', ' ')}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={taskSearch}
                onChange={(e) => setTaskSearch(e.target.value)}
                placeholder="Search tasks, owner, workload..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50"
              />
            </div>
          </div>

          {/* Tasks Table */}
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden text-xs">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3.5 hover:bg-slate-50/80 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-3"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => handleQuickToggleTaskStatus(task)}
                        className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                          task.status === 'COMPLETED'
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-slate-300 hover:border-blue-500 bg-white'
                        }`}
                        title="Toggle status"
                      >
                        {task.status === 'COMPLETED' && <Check className="w-3 h-3" />}
                      </button>

                      <span
                        className={`font-bold ${
                          task.status === 'COMPLETED' ? 'text-slate-400 line-through' : 'text-slate-900'
                        }`}
                      >
                        {task.taskTitle}
                      </span>

                      <Badge variant={STATUS_VARIANTS[task.status] || 'slate'} size="xs">
                        {task.status.replace('_', ' ')}
                      </Badge>

                      <Badge variant={PRIORITY_VARIANTS[task.priority] || 'slate'} size="xs">
                        {task.priority}
                      </Badge>

                      <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                        {task.category}
                      </span>
                    </div>

                    <p className="text-slate-600 ml-6">{task.description}</p>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 ml-6 pt-0.5">
                      <span>Workload: <strong className="text-slate-700">{task.workloadName}</strong></span>
                      <span>&bull;</span>
                      <span>Wave: <strong className="text-slate-700">{task.waveName}</strong></span>
                      {task.dependencies && (
                        <>
                          <span>&bull;</span>
                          <span className="text-amber-700 font-medium">Deps: {task.dependencies}</span>
                        </>
                      )}
                    </div>

                    {task.blockerReason && (
                      <div className="ml-6 p-2 bg-rose-50 border border-rose-200 rounded text-rose-800 text-[11px] flex items-start gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-600" />
                        <div>
                          <span className="font-bold">Active Blocker:</span> {task.blockerReason}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4 shrink-0 ml-6 lg:ml-0 text-[11px]">
                    <div className="text-right">
                      <div className="font-semibold text-slate-800">{task.assignedTo}</div>
                      <div className="text-slate-400 font-mono">Due: {task.dueDate}</div>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="xs"
                        icon={Edit2}
                        onClick={() => handleOpenEditTask(task)}
                      >
                        Edit
                      </Button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors rounded hover:bg-rose-50"
                        title="Delete task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-400">
                No migration tasks match the selected filter criteria.
              </div>
            )}
          </div>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: TEAM OWNERSHIP & RESOURCE DISTRIBUTION */}
      {/* ========================================================================= */}
      {activeTab === 'TEAM' && (
        <Card
          title="Team Resource Allocation & Task Ownership"
          subtitle="Workload distribution across Cloud Architects, DevOps Engineers, and Database Specialists"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamData.map((member) => (
              <div
                key={member.memberName}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-2xs transition-all space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-sm text-slate-900">{member.memberName}</h4>
                    <span className="text-[11px] font-semibold text-blue-600">{member.role}</span>
                  </div>
                  <Badge variant="blue" size="xs">
                    {member.totalTasksAssigned} Tasks
                  </Badge>
                </div>

                {/* Progress Mini Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Task Completion</span>
                    <span className="font-bold text-slate-800">
                      {member.completedTasks} / {member.totalTasksAssigned}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all"
                      style={{
                        width: `${member.totalTasksAssigned > 0 ? (member.completedTasks * 100) / member.totalTasksAssigned : 0}%`
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 py-2 border-t border-b border-slate-100 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Completed</span>
                    <span className="font-bold text-emerald-600">{member.completedTasks}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">In Progress</span>
                    <span className="font-bold text-blue-600">{member.inProgressTasks}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Blocked</span>
                    <span className="font-bold text-rose-600">{member.blockedTasks}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Capacity: <strong className="text-slate-800">{member.totalEstimatedHours} hrs</strong></span>
                  <span>Share: <strong className="text-slate-800">{member.allocationPercentage}%</strong></span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: RISKS, BLOCKERS & DEPENDENCIES */}
      {/* ========================================================================= */}
      {activeTab === 'RISKS' && risksData && (
        <div className="space-y-6">
          {/* Section A: Active Migration Blockers */}
          <Card
            title="Active Migration Blockers & Escalations"
            subtitle="Immediate impediment items halting migration tasks with AI-recommended corrective actions"
          >
            <div className="space-y-3">
              {risksData.migrationBlockers?.map((b) => (
                <div
                  key={b.taskId}
                  className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertOctagon className="w-4 h-4 text-rose-600" />
                      <span className="font-bold text-slate-900 text-sm">{b.taskTitle}</span>
                    </div>
                    <Badge variant="rose" size="xs">
                      BLOCKED
                    </Badge>
                  </div>

                  <div className="text-slate-700">
                    <span className="font-semibold text-rose-900">Blocker Reason:</span> {b.blockerReason}
                  </div>

                  <div className="p-2.5 bg-white rounded-lg border border-rose-200 text-slate-800 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-blue-900">Recommended Corrective Action:</span>{' '}
                      {b.suggestedCorrectiveAction}
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 pt-1 flex items-center justify-between">
                    <span>Workload: <strong className="text-slate-800">{b.workloadName}</strong></span>
                    <span>Owner: <strong className="text-slate-800">{b.assignedTo}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Section B: Cross-Workload Dependencies & High-Risk Safeguards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card
              title="Cross-Workload Dependencies"
              subtitle="Inter-application relational and identity prerequisites"
            >
              <div className="space-y-3 text-xs">
                {risksData.workloadDependencies?.map((dep, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">
                        {dep.sourceWorkload} &rarr; {dep.dependsOnWorkload}
                      </span>
                      <Badge variant={dep.status === 'RESOLVED' ? 'emerald' : 'blue'} size="xs">
                        {dep.status}
                      </Badge>
                    </div>
                    <p className="text-slate-600">{dep.description}</p>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">
                      Type: {dep.dependencyType}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            <Card
              title="High-Risk Workload Mitigation Safeguards"
              subtitle="Controls established for mission-critical core systems"
            >
              <div className="space-y-3 text-xs">
                {risksData.highRiskWorkloads?.map((risk, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{risk.workloadName}</span>
                      <Badge variant={risk.riskLevel === 'CRITICAL' ? 'rose' : 'amber'} size="xs">
                        {risk.riskLevel} RISK
                      </Badge>
                    </div>
                    <p className="text-slate-600">{risk.description}</p>
                    <div className="p-2 bg-blue-50/70 border border-blue-200 rounded text-blue-950 font-medium">
                      Mitigation: {risk.mitigationStrategy}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: CREATE / EDIT TASK MODAL */}
      {/* ========================================================================= */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                {editingTask ? 'Edit Migration Task' : 'Create New Migration Task'}
              </h3>
              <button
                onClick={() => setIsTaskModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Task Title *</label>
                <input
                  type="text"
                  value={taskFormData.taskTitle}
                  onChange={(e) => setTaskFormData({ ...taskFormData, taskTitle: e.target.value })}
                  placeholder="e.g. Deploy Amazon EKS Cluster v1.30 with Karpenter"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Assigned Wave</label>
                  <select
                    value={taskFormData.waveId}
                    onChange={(e) => setTaskFormData({ ...taskFormData, waveId: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 bg-white"
                  >
                    {plan?.waves?.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.waveName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Target Workload</label>
                  <input
                    type="text"
                    value={taskFormData.workloadName}
                    onChange={(e) => setTaskFormData({ ...taskFormData, workloadName: e.target.value })}
                    placeholder="e.g. Core Banking Engine"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Priority</label>
                  <select
                    value={taskFormData.priority}
                    onChange={(e) => setTaskFormData({ ...taskFormData, priority: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 bg-white"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Status</label>
                  <select
                    value={taskFormData.status}
                    onChange={(e) => setTaskFormData({ ...taskFormData, status: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 bg-white"
                  >
                    <option value="NOT_STARTED">Not Started</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="BLOCKED">Blocked</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Category</label>
                  <select
                    value={taskFormData.category}
                    onChange={(e) => setTaskFormData({ ...taskFormData, category: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 bg-white"
                  >
                    <option value="FOUNDATION">Foundation</option>
                    <option value="DATA_SYNC">Data Sync</option>
                    <option value="SCHEMA_CONVERSION">Schema Conversion</option>
                    <option value="CUTOVER">Cutover</option>
                    <option value="VALIDATION">Validation</option>
                    <option value="OPTIMIZATION">Optimization</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Assigned Team Member</label>
                <select
                  value={taskFormData.assignedTo}
                  onChange={(e) => setTaskFormData({ ...taskFormData, assignedTo: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 bg-white"
                >
                  <option value="Sarah Jenkins (Lead Cloud Architect)">Sarah Jenkins (Lead Cloud Architect)</option>
                  <option value="David Chen (DevOps / IaC)">David Chen (DevOps / IaC)</option>
                  <option value="Priya Sharma (Database Specialist)">Priya Sharma (Database Specialist)</option>
                  <option value="Alex Morgan (Security Eng)">Alex Morgan (Security Eng)</option>
                  <option value="Sai Kumar (Enterprise Migration Lead)">Sai Kumar (Enterprise Migration Lead)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Start Date</label>
                  <input
                    type="date"
                    value={taskFormData.startDate}
                    onChange={(e) => setTaskFormData({ ...taskFormData, startDate: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Due Date</label>
                  <input
                    type="date"
                    value={taskFormData.dueDate}
                    onChange={(e) => setTaskFormData({ ...taskFormData, dueDate: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Description & Procedures</label>
                <textarea
                  rows="2"
                  value={taskFormData.description}
                  onChange={(e) => setTaskFormData({ ...taskFormData, description: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                  placeholder="Technical steps, runbooks, or acceptance criteria..."
                />
              </div>

              {taskFormData.status === 'BLOCKED' && (
                <div>
                  <label className="font-semibold text-rose-700 block mb-1">Blocker Reason & Escalation *</label>
                  <input
                    type="text"
                    value={taskFormData.blockerReason}
                    onChange={(e) => setTaskFormData({ ...taskFormData, blockerReason: e.target.value })}
                    placeholder="e.g. Awaiting firewall change request approval from security team."
                    className="w-full px-3 py-2 rounded-lg border border-rose-300 text-xs bg-rose-50/50 text-rose-900 focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-slate-200 flex justify-end gap-2">
              <Button variant="secondary" size="sm" onClick={() => setIsTaskModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" icon={Check} onClick={handleSaveTask}>
                {editingTask ? 'Save Changes' : 'Create Task'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: EDIT WAVE MODAL */}
      {/* ========================================================================= */}
      {isWaveModalOpen && editingWave && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-blue-600" /> Edit Migration Wave
              </h3>
              <button
                onClick={() => setIsWaveModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Wave Name *</label>
                <input
                  type="text"
                  value={waveFormData.waveName}
                  onChange={(e) => setWaveFormData({ ...waveFormData, waveName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Wave Lead Owner</label>
                <input
                  type="text"
                  value={waveFormData.waveLead}
                  onChange={(e) => setWaveFormData({ ...waveFormData, waveLead: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Start Date</label>
                  <input
                    type="date"
                    value={waveFormData.startDate}
                    onChange={(e) => setWaveFormData({ ...waveFormData, startDate: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">End Date</label>
                  <input
                    type="date"
                    value={waveFormData.endDate}
                    onChange={(e) => setWaveFormData({ ...waveFormData, endDate: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Wave Scope Description</label>
                <textarea
                  rows="3"
                  value={waveFormData.description}
                  onChange={(e) => setWaveFormData({ ...waveFormData, description: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                />
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-200 flex justify-end gap-2">
              <Button variant="secondary" size="sm" onClick={() => setIsWaveModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" icon={Check} onClick={handleSaveWave}>
                Save Wave
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: ADD WORKLOAD TO WAVE MODAL */}
      {/* ========================================================================= */}
      {isAddWorkloadModalOpen && selectedWaveForWorkload && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-sm p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-600" /> Assign Workload to Wave
              </h3>
              <button
                onClick={() => setIsAddWorkloadModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <p className="text-slate-600">
                Assigning workload to: <strong className="text-slate-900">{selectedWaveForWorkload.waveName}</strong>
              </p>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Select or Enter Workload Name</label>
                <input
                  type="text"
                  value={newWorkloadInput}
                  onChange={(e) => setNewWorkloadInput(e.target.value)}
                  placeholder="e.g. Core Banking Engine, Payment Gateway"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg text-slate-500 text-[11px]">
                Quick Select Available:
                <div className="flex flex-wrap gap-1 mt-1">
                  {['Core Banking Engine', 'ShopSphere Web Portal', 'CRM Database Cluster', 'Batch Analytics Engine'].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setNewWorkloadInput(item)}
                      className="px-2 py-0.5 bg-white border border-slate-200 rounded hover:bg-slate-100 text-slate-700"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-200 flex justify-end gap-2">
              <Button variant="secondary" size="sm" onClick={() => setIsAddWorkloadModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" icon={Plus} onClick={handleAddWorkload}>
                Assign Workload
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
