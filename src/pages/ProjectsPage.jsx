import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderGit2,
  Plus,
  Search,
  Filter,
  Server,
  TrendingUp,
  DollarSign,
  Calendar,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { formatCurrency, formatNumber } from '../utils/formatters';

export const ProjectsPage = () => {
  const { projects, selectedProjectId, setSelectedProjectId, showToast } = useProject();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedDetailProject, setSelectedDetailProject] = useState(null);

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalServers = projects.reduce((acc, p) => acc + (p.serversCount || 0), 0);
  const totalBudget = projects.reduce((acc, p) => acc + (p.budget || 0), 0);
  const totalSpent = projects.reduce((acc, p) => acc + (p.spent || 0), 0);

  const handleSetActive = (project) => {
    setSelectedProjectId(project.id);
    showToast(`Active project switched to "${project.name}"`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-blue-600 mb-1">
            Enterprise Portfolio
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Migration Projects
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage enterprise migration programs, target cloud landing zones, and wave delivery.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => showToast('Select "Create New Migration Project" from the top dropdown or initialize below.')}
          >
            New Project
          </Button>
        </div>
      </div>

      {/* Portfolio Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Active Projects</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{projects.length} Initiatives</div>
          <span className="text-xs text-slate-500 mt-0.5 block">HCLTech Cloud Practice</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Total Scoped Workloads</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{formatNumber(totalServers)} Workloads</div>
          <span className="text-xs text-slate-500 mt-0.5 block">Discovered & Mapped</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Portfolio Budget</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(totalBudget)}</div>
          <span className="text-xs text-slate-500 mt-0.5 block">{formatCurrency(totalSpent)} committed</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Target Cloud Provider</span>
          <div className="text-2xl font-bold text-blue-600 mt-1">AWS Enterprise</div>
          <span className="text-xs text-slate-500 mt-0.5 block">Multi-AZ Landing Zones</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by name, client, or code..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Statuses ({projects.length})</option>
            <option value="In Migration">In Migration</option>
            <option value="Assessment">Assessment Phase</option>
            <option value="Wave 1 Done">Wave 1 Done</option>
            <option value="Discovery">Discovery</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map((project) => {
          const isSelected = selectedProjectId === project.id;
          const budgetPct = Math.round(((project.spent || 0) / (project.budget || 1)) * 100);

          return (
            <div
              key={project.id}
              className={`bg-white rounded-xl border transition-all p-5 shadow-sm hover:shadow-md flex flex-col justify-between ${
                isSelected
                  ? 'border-blue-500 ring-2 ring-blue-500/20'
                  : 'border-slate-200/90'
              }`}
            >
              <div>
                {/* Header & Badges */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {project.code}
                      </span>
                      <Badge
                        variant={
                          project.status === 'In Migration'
                            ? 'blue'
                            : project.status === 'Wave 1 Done'
                            ? 'emerald'
                            : 'amber'
                        }
                        size="xs"
                      >
                        {project.status}
                      </Badge>
                      {isSelected && (
                        <Badge variant="blue" size="xs" dot>
                          Active Project
                        </Badge>
                      )}
                    </div>
                    <h3
                      className="text-base font-bold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer"
                      onClick={() => setSelectedDetailProject(project)}
                    >
                      {project.name}
                    </h3>
                    <p className="text-xs font-medium text-slate-500">{project.client}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-lg font-bold text-slate-900">{project.readinessScore}%</span>
                    <span className="text-[10px] text-slate-400 block uppercase font-semibold">Readiness</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-3 line-clamp-2">
                  {project.description}
                </p>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-3 gap-2 my-4 p-3 bg-slate-50/70 rounded-lg border border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">Scope</span>
                    <span className="font-semibold text-slate-800">{project.serversCount} Workloads</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">Target Cloud</span>
                    <span className="font-semibold text-slate-800 truncate block">AWS US-East-1</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">Lead Architect</span>
                    <span className="font-semibold text-slate-800 truncate block">{project.leadArchitect}</span>
                  </div>
                </div>

                {/* Budget Progress Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Budget Utilized: {formatCurrency(project.spent)}</span>
                    <span className="font-semibold text-slate-700">
                      {budgetPct}% of {formatCurrency(project.budget)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full"
                      style={{ width: `${Math.min(budgetPct, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="flex items-center justify-between gap-2 pt-4 mt-4 border-t border-slate-100">
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => setSelectedDetailProject(project)}
                >
                  View Details
                </Button>

                <div className="flex items-center gap-2">
                  {!isSelected && (
                    <Button
                      variant="secondary"
                      size="xs"
                      onClick={() => handleSetActive(project)}
                    >
                      Set Active
                    </Button>
                  )}
                  <Button
                    variant="primary"
                    size="xs"
                    icon={ChevronRight}
                    iconPosition="right"
                    onClick={() => {
                      setSelectedProjectId(project.id);
                      navigate('/overview');
                    }}
                  >
                    Open Dashboard
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Project Details Modal */}
      {selectedDetailProject && (
        <Modal
          isOpen={!!selectedDetailProject}
          onClose={() => setSelectedDetailProject(null)}
          title={selectedDetailProject.name}
          subtitle={`Client: ${selectedDetailProject.client} • Code: ${selectedDetailProject.code}`}
          footer={
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedDetailProject(null)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setSelectedProjectId(selectedDetailProject.id);
                  setSelectedDetailProject(null);
                  navigate('/overview');
                }}
              >
                Select & Open Workspace
              </Button>
            </>
          }
        >
          <div className="space-y-4 text-xs">
            <div>
              <h4 className="font-semibold text-slate-900 mb-1">Executive Summary</h4>
              <p className="text-slate-600">{selectedDetailProject.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div>
                <span className="text-slate-500 block">Target Landing Zone:</span>
                <span className="font-semibold text-slate-900">{selectedDetailProject.targetCloud}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Current Phase:</span>
                <span className="font-semibold text-slate-900">{selectedDetailProject.phase}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Lead Architect:</span>
                <span className="font-semibold text-slate-900">{selectedDetailProject.leadArchitect}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Consulting Partner:</span>
                <span className="font-semibold text-slate-900">{selectedDetailProject.consultancy}</span>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Scope Breakdown</h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-2.5 bg-blue-50/50 rounded border border-blue-100">
                  <span className="text-slate-500 block">Scoped Workloads</span>
                  <span className="text-base font-bold text-blue-700">{selectedDetailProject.serversCount}</span>
                </div>
                <div className="p-2.5 bg-purple-50/50 rounded border border-purple-100">
                  <span className="text-slate-500 block">Readiness Score</span>
                  <span className="text-base font-bold text-purple-700">{selectedDetailProject.readinessScore}%</span>
                </div>
                <div className="p-2.5 bg-emerald-50/50 rounded border border-emerald-100">
                  <span className="text-slate-500 block">Est. Cost Reduction</span>
                  <span className="text-base font-bold text-emerald-700">{selectedDetailProject.metrics?.costSavingsPct}%</span>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

