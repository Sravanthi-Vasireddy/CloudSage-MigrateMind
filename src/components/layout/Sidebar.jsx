import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderGit2,
  Server,
  Layers,
  GitFork,
  Network,
  FileCode2,
  ShieldAlert,
  DollarSign,
  CalendarDays,
  Activity,
  FileText,
  Settings,
  Cloud,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';

const NAV_ITEMS = [
  { path: '/overview', label: 'Overview', icon: LayoutDashboard },
  { path: '/projects', label: 'Migration Projects', icon: FolderGit2, badge: '4' },
  { path: '/inventory', label: 'Infrastructure Inventory', icon: Server, badge: '48' },
  { path: '/assessment', label: 'Workload Assessment', icon: Layers },
  { path: '/strategy', label: 'Migration Strategy', icon: GitFork },
  { path: '/architecture', label: 'Target Architecture', icon: Network },
  { path: '/terraform', label: 'Terraform Generator', icon: FileCode2, badge: 'IaC' },
  { path: '/security', label: 'Security & Compliance', icon: ShieldAlert },
  { path: '/finops', label: 'FinOps Cost Analysis', icon: DollarSign },
  { path: '/timeline', label: 'Migration Timeline', icon: CalendarDays },
  { path: '/monitoring', label: 'Migration Monitoring', icon: Activity, badge: 'Live' },
  { path: '/reports', label: 'Assessment Reports', icon: FileText },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export const Sidebar = () => {
  const { currentProject } = useProject();
  const location = useLocation();

  return (
    <aside className="w-64 bg-[#0a1128] text-slate-300 flex flex-col h-screen shrink-0 border-r border-slate-800/80 sticky top-0 z-30 select-none">
      {/* Brand Header */}
      <div className="h-16 px-5 flex items-center gap-3 border-b border-slate-800/80 bg-[#070d1f]">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
          <Cloud className="w-5 h-5" />
        </div>
        <div className="leading-tight">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-base text-white tracking-tight">CloudSage</span>
            <span className="text-[10px] font-semibold px-1.5 py-0.2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded">
              v2.4
            </span>
          </div>
          <span className="text-[11px] font-medium text-slate-400 tracking-wide uppercase">
            MigrateMind
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
        <div className="px-3 pb-1 text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
          Cloud Migration Suite
        </div>

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (item.path === '/overview' && location.pathname === '/');

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-md ${
                    isActive
                      ? 'bg-blue-700/80 text-blue-100'
                      : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-slate-200'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Project Mini Status Card */}
      <div className="p-3 mx-3 mb-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
        <div className="flex items-center justify-between text-slate-400 mb-1.5">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Readiness</span>
          <span className="font-semibold text-blue-400">{currentProject.readinessScore}% Ready</span>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-emerald-400 h-1.5 rounded-full"
            style={{ width: `${currentProject.readinessScore}%` }}
          />
        </div>
        <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span className="truncate font-medium text-slate-300">{currentProject.client}</span>
          <span className="text-[10px] px-1 bg-slate-800 text-slate-300 rounded border border-slate-700">AWS</span>
        </div>
      </div>

      {/* Partner & Consulting Footer */}
      <div className="px-4 py-3 border-t border-slate-800/80 bg-[#070d1f] flex items-center justify-between text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <div className="text-[11px]">
            <span className="font-semibold text-slate-200">HCLTech</span>
            <span className="text-slate-500 text-[10px] block">Cloud Smart CoE</span>
          </div>
        </div>
        <div className="text-[10px] text-blue-400 font-medium">Enterprise</div>
      </div>
    </aside>
  );
};

