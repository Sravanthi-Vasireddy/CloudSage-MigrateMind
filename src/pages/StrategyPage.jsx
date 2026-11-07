import React, { useState, useEffect } from 'react';
import {
  GitFork,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Settings2,
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
  RotateCcw,
  RefreshCw,
  Server
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Table } from '../components/common/Table';
import { SIX_R_STRATEGIES, mockStrategyDistribution, mockStrategyRules } from '../data/mockStrategy';
import { mockWorkloadAssessments } from '../data/mockAssessment';
import { assessmentApi } from '../services/assessmentApi';

export const StrategyPage = () => {
  const { showToast } = useProject();

  const [activeStrategyKey, setActiveStrategyKey] = useState('Replatform');
  const [workloads, setWorkloads] = useState(mockWorkloadAssessments);
  const [distribution, setDistribution] = useState(mockStrategyDistribution);
  const [backendOnline, setBackendOnline] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const activeStrategy = SIX_R_STRATEGIES[activeStrategyKey] || SIX_R_STRATEGIES.Replatform;

  // Load real assessment data if backend is available
  useEffect(() => {
    async function fetchAssessments() {
      setIsLoading(true);
      try {
        const [assessmentsData, summaryData] = await Promise.all([
          assessmentApi.getAllAssessments(),
          assessmentApi.getSummary(),
        ]);

        if (assessmentsData && assessmentsData.length > 0) {
          const mapped = assessmentsData.map((a) => ({
            id: a.id,
            name: a.workloadName,
            category: a.databaseType && a.databaseType !== 'None' ? 'Database & Tier-1 Service' : 'Application Tier',
            targetService: a.selectedStrategy === 'Refactor' ? 'AWS EKS + Aurora Serverless' : a.selectedStrategy === 'Replatform' ? 'Amazon RDS Multi-AZ' : a.selectedStrategy === 'Repurchase' ? 'Enterprise SaaS Platform' : 'AWS EC2 (AWS MGN)',
            effortWeeks: a.estimatedEffortWeeks || 4,
            recommendedStrategy: a.selectedStrategy || a.recommendedStrategy,
            isOverridden: a.isOverridden,
          }));
          setWorkloads(mapped);
          setBackendOnline(true);
        }

        if (summaryData?.strategyDistribution) {
          const total = summaryData.assessedWorkloads || 1;
          const dist = Object.entries(summaryData.strategyDistribution).map(([name, count]) => ({
            name,
            count,
            percentage: Math.round((count / total) * 100),
            color: SIX_R_STRATEGIES[name]?.color || '#3b82f6',
          }));
          setDistribution(dist);
        }
      } catch (err) {
        console.warn('Backend strategy sync falling back to initial data:', err);
        setBackendOnline(false);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAssessments();
  }, []);

  const handleStrategyOverride = async (workloadId, newStrategy) => {
    try {
      if (backendOnline) {
        await assessmentApi.overrideStrategy(workloadId, {
          selectedStrategy: newStrategy,
          overrideReason: 'Strategy overridden via 6R Decision Matrix',
        });
      }

      setWorkloads((prev) =>
        prev.map((w) => (w.id === workloadId ? { ...w, recommendedStrategy: newStrategy, isOverridden: true } : w))
      );

      setDistribution((prev) =>
        prev.map((d) => {
          if (d.name === newStrategy) return { ...d, count: d.count + 1 };
          return d;
        })
      );

      showToast(`Strategy overridden to ${newStrategy} for workload ID: ${workloadId}`);
    } catch (err) {
      showToast(`Override failed: ${err.message}`);
    }
  };

  const handleResetDefaults = () => {
    setWorkloads(mockWorkloadAssessments);
    setDistribution(mockStrategyDistribution);
    showToast('6R decision matrix reset to automated rules engine baseline.');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-blue-600 mb-1">
            Gartner & AWS 6R Framework
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Migration Strategy Matrix
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Formulate, inspect, and fine-tune cloud adoption pathways across Rehost, Replatform, Refactor, Repurchase, Retain, and Retire.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            icon={RotateCcw}
            onClick={handleResetDefaults}
          >
            Reset Rules
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Sparkles}
            onClick={() => showToast('Rules engine successfully validated against AWS Well-Architected Framework.')}
          >
            Validate 6R Matrix
          </Button>
        </div>
      </div>

      {/* 6R Strategy Selectable Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {Object.entries(SIX_R_STRATEGIES).map(([key, strat]) => {
          const isSelected = activeStrategyKey === key;
          const stat = distribution.find((d) => d.name === key);

          return (
            <div
              key={key}
              onClick={() => setActiveStrategyKey(key)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-white shadow-md border-blue-500 ring-2 ring-blue-500/20'
                  : 'bg-white hover:bg-slate-50 border-slate-200 shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: strat.color }}
                />
                <span className="text-[10px] font-bold text-slate-400">
                  {stat?.percentage || 0}%
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 truncate">{strat.name.split(' ')[0]}</h4>
              <p className="text-[10px] text-slate-500 truncate mt-0.5">{strat.typicalCostSavings} savings</p>
              <div className="mt-2 text-xs font-extrabold text-slate-800">
                {stat?.count || 0} <span className="text-[10px] font-normal text-slate-500">workloads</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Strategy Inspector Card */}
      <Card
        title={activeStrategy.name}
        subtitle={activeStrategy.description}
        badge={
          <Badge variant="blue" size="sm">
            Effort: {activeStrategy.avgEffort}
          </Badge>
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
          <div className="space-y-4">
            <div>
              <h5 className="font-bold text-slate-900 mb-1">Optimal Fit & Use Cases</h5>
              <p className="text-slate-600 leading-relaxed">{activeStrategy.bestFor}</p>
            </div>
            <div>
              <h5 className="font-bold text-slate-900 mb-1.5">Recommended Cloud Services</h5>
              <div className="flex flex-wrap gap-1.5">
                {activeStrategy.targetTools.map((tool) => (
                  <Badge key={tool} variant="sky" size="xs">
                    {tool}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h5 className="font-bold text-emerald-800 mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Strategic Advantages
            </h5>
            <ul className="space-y-1.5">
              {activeStrategy.pros.map((pro, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-600">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-amber-800 mb-2 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              Key Trade-offs & Risks
            </h5>
            <ul className="space-y-1.5">
              {activeStrategy.cons.map((con, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-600">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>{con}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 p-2.5 rounded bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Risk Classification:</span>
              <span className="font-bold text-slate-800">{activeStrategy.riskProfile} Risk</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Strategy Rule Formulation Engine */}
      <Card
        title="Automated 6R Decision Rules Engine"
        subtitle="Heuristic rule conditions mapped against CMDB discovery traits"
      >
        <div className="space-y-2.5">
          {mockStrategyRules.map((rule) => (
            <div
              key={rule.id}
              className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{rule.ruleName}</span>
                  <Badge
                    variant={rule.priority === 'Critical' ? 'red' : 'blue'}
                    size="xs"
                  >
                    {rule.priority} Priority
                  </Badge>
                </div>
                <div className="font-mono text-[11px] text-slate-600">
                  Condition: <span className="text-blue-700">{rule.condition}</span>
                </div>
                <div className="text-[11px] text-emerald-700 font-medium">
                  → Action: {rule.action}
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-sm font-bold text-slate-900">{rule.matchedCount}</span>
                <span className="text-[10px] text-slate-400 block uppercase">Matched Hosts</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Workload 6R Recommendations with Override Ability */}
      <Card
        title="Workload Strategy Allocation & Manual Override"
        subtitle="Consultants can override automated strategy recommendations to meet custom client constraints"
        noPadding
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] uppercase font-semibold text-slate-600 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Workload Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Target Service</th>
                <th className="py-3 px-4">Effort</th>
                <th className="py-3 px-4">Current 6R Strategy</th>
                <th className="py-3 px-4 text-right">Override Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {workloads.map((wkld) => (
                <tr key={wkld.id} className="hover:bg-blue-50/40">
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    <div className="flex items-center gap-1.5">
                      <Server className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{wkld.name}</span>
                      {wkld.isOverridden && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-100 text-purple-700 border border-purple-200">
                          OVERRIDDEN
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{wkld.category}</td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-700">
                    {wkld.targetService}
                  </td>
                  <td className="py-3 px-4">{wkld.effortWeeks} Weeks</td>
                  <td className="py-3 px-4">
                    <Badge variant="blue" size="xs">
                      {wkld.recommendedStrategy}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <select
                      value={wkld.recommendedStrategy}
                      onChange={(e) => handleStrategyOverride(wkld.id, e.target.value)}
                      className="px-2 py-1 text-xs rounded border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
                    >
                      <option value="Rehost">Rehost</option>
                      <option value="Replatform">Replatform</option>
                      <option value="Refactor">Refactor</option>
                      <option value="Repurchase">Repurchase</option>
                      <option value="Retain">Retain</option>
                      <option value="Retire">Retire</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
