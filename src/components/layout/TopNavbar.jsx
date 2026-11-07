import React, { useState } from 'react';
import {
  Search,
  Bell,
  ChevronDown,
  Cloud,
  CheckCircle2,
  FolderGit2,
  User,
  Shield,
  HelpCircle,
  Plus
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';

export const TopNavbar = ({ onNewProjectClick }) => {
  const {
    projects,
    currentProject,
    selectedProjectId,
    setSelectedProjectId,
    setIsSearchOpen,
    notifications,
    markAllNotificationsAsRead
  } = useProject();

  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 sticky top-0 z-20 flex items-center justify-between px-6 shadow-xs">
      {/* Left: Project Selector & Breadcrumb */}
      <div className="flex items-center gap-4">
        {/* Project Selector Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setIsProjectDropdownOpen(!isProjectDropdownOpen);
              setIsNotifDropdownOpen(false);
              setIsProfileDropdownOpen(false);
            }}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50/70 hover:bg-slate-100/80 text-left transition-all"
          >
            <div className="w-6 h-6 rounded-md bg-blue-600/10 text-blue-600 flex items-center justify-center shrink-0">
              <FolderGit2 className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 max-w-[220px]">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Active Project</div>
              <div className="text-xs font-semibold text-slate-900 truncate">{currentProject.name}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
          </button>

          {/* Project Dropdown Menu */}
          {isProjectDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setIsProjectDropdownOpen(false)}
              />
              <div className="absolute left-0 mt-2 w-80 rounded-xl bg-white shadow-xl border border-slate-200 py-2 z-40">
                <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Select Migration Project
                </div>
                <div className="max-h-60 overflow-y-auto divide-y divide-slate-100">
                  {projects.map((proj) => (
                    <button
                      key={proj.id}
                      onClick={() => {
                        setSelectedProjectId(proj.id);
                        setIsProjectDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 flex items-start justify-between hover:bg-slate-50 transition-colors ${
                        selectedProjectId === proj.id ? 'bg-blue-50/60' : ''
                      }`}
                    >
                      <div>
                        <div className="text-xs font-semibold text-slate-900">{proj.name}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {proj.client} • {proj.serversCount} workloads
                        </div>
                      </div>
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                        {proj.phase}
                      </span>
                    </button>
                  ))}
                </div>
                {onNewProjectClick && (
                  <div className="p-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setIsProjectDropdownOpen(false);
                        onNewProjectClick();
                      }}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Create New Migration Project
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Cloud Provider Indicator Pill */}
        <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">
          <Cloud className="w-3.5 h-3.5 text-amber-500" />
          <span>Target: {currentProject.targetCloud}</span>
        </div>
      </div>

      {/* Center: Search Field Trigger */}
      <div className="flex-1 max-w-md mx-6 hidden sm:block">
        <button
          type="button"
          onClick={() => setIsSearchOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-1.5 text-xs text-slate-400 bg-slate-50 border border-slate-200/90 rounded-lg hover:border-slate-300 hover:bg-white transition-all shadow-2xs"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400" />
            <span>Search workloads, Terraform modules, findings...</span>
          </div>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-slate-500 bg-slate-200/60 border border-slate-300/80 rounded">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Right: Notifications, User Profile & Actions */}
      <div className="flex items-center gap-3">
        {/* Search button on mobile */}
        <button
          type="button"
          onClick={() => setIsSearchOpen(true)}
          className="sm:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setIsNotifDropdownOpen(!isNotifDropdownOpen);
              setIsProjectDropdownOpen(false);
              setIsProfileDropdownOpen(false);
            }}
            className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {isNotifDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setIsNotifDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-white shadow-xl border border-slate-200 py-2 z-40">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">Migration Alerts</span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.2 bg-blue-100 text-blue-700 rounded-full">
                      {unreadCount} unread
                    </span>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-[11px] text-blue-600 hover:underline font-medium"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3.5 hover:bg-slate-50/80 transition-colors ${
                        !n.read ? 'bg-blue-50/30' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-900">
                        <span>{n.title}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{n.time}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Profile */}
        <div className="relative border-l border-slate-200 pl-3">
          <button
            type="button"
            onClick={() => {
              setIsProfileDropdownOpen(!isProfileDropdownOpen);
              setIsProjectDropdownOpen(false);
              setIsNotifDropdownOpen(false);
            }}
            className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-slate-100 transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-800 to-blue-900 text-white flex items-center justify-center font-bold text-xs ring-2 ring-slate-100">
              SK
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-semibold text-slate-900">Sai Kumar</div>
              <div className="text-[10px] text-slate-500 font-medium">Lead Cloud Architect</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
          </button>

          {/* User Profile Menu */}
          {isProfileDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setIsProfileDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white shadow-xl border border-slate-200 py-2 z-40">
                <div className="px-4 py-2 border-b border-slate-100">
                  <div className="text-xs font-semibold text-slate-900">Sai Kumar</div>
                  <div className="text-[11px] text-slate-500">sai.kumar@hcltech.com</div>
                  <div className="mt-1 text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded inline-block">
                    HCLTech Cloud Native CoE
                  </div>
                </div>
                <div className="py-1">
                  <a
                    href="#settings"
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    Consultant Profile & Certifications
                  </a>
                  <a
                    href="#governance"
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    <Shield className="w-4 h-4 text-slate-400" />
                    Security Credentials & Keys
                  </a>
                  <a
                    href="#docs"
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    <HelpCircle className="w-4 h-4 text-slate-400" />
                    CloudSage User Manual
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

