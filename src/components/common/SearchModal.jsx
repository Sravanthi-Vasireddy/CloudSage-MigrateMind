import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Server, FileCode, Shield, Layers, DollarSign, Calendar, FileText, ChevronRight, X } from 'lucide-react';
import { useProject } from '../../context/ProjectContext';

const SEARCH_ITEMS = [
  { title: 'Overview Dashboard', category: 'Navigation', path: '/overview', icon: Layers, desc: 'Executive migration health & readiness' },
  { title: 'Migration Projects', category: 'Projects', path: '/projects', icon: Layers, desc: 'Portfolio of enterprise migration initiatives' },
  { title: 'Infrastructure Inventory', category: 'Assets', path: '/inventory', icon: Server, desc: 'Discovered physical & virtual servers' },
  { title: 'Workload Assessment', category: 'Assessment', path: '/assessment', icon: Server, desc: 'Workload complexity, coupling & wave matrix' },
  { title: 'Migration Strategy (6Rs)', category: 'Strategy', path: '/strategy', icon: Layers, desc: 'Interactive 6R recommendation engine' },
  { title: 'Target Architecture', category: 'Architecture', path: '/architecture', icon: Layers, desc: 'Visual cloud diagram & component inspector' },
  { title: 'Terraform Generator', category: 'IaC Studio', path: '/terraform', icon: FileCode, desc: 'Generate VPC, EKS, Aurora, IAM HCL modules' },
  { title: 'Security & Compliance', category: 'Governance', path: '/security', icon: Shield, desc: 'CIS AWS Benchmark, SOC2, PCI-DSS scorecards' },
  { title: 'FinOps Cost Analysis', category: 'FinOps', path: '/finops', icon: DollarSign, desc: 'TCO savings, 5-yr ROI, Right-sizing optimizer' },
  { title: 'Migration Timeline', category: 'Roadmap', path: '/timeline', icon: Calendar, desc: 'Wave progression & cutover runbook' },
  { title: 'Assessment Reports', category: 'Reports', path: '/reports', icon: FileText, desc: 'Executive business cases & technical blueprints' },
  { title: 'Global Settings', category: 'System', path: '/settings', icon: Layers, desc: 'Cloud providers, CMDB connectors & RBAC' },
];

export const SearchModal = () => {
  const { isSearchOpen, setIsSearchOpen } = useProject();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const filtered = query.trim() === ''
    ? SEARCH_ITEMS.slice(0, 7)
    : SEARCH_ITEMS.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase()) ||
        item.desc.toLowerCase().includes(query.toLowerCase())
      );

  const handleSelect = (path) => {
    setIsSearchOpen(false);
    setQuery('');
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsSearchOpen(false)}
      />

      <div className="flex min-h-full items-start justify-center pt-20 p-4">
        <div
          className="relative w-full max-w-xl overflow-hidden rounded-xl bg-white shadow-2xl border border-slate-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Header */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 bg-slate-50/50">
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search pages, servers, workloads, Terraform modules... (Esc to close)"
              className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-100 border border-slate-200 rounded">
              ESC
            </kbd>
          </div>

          {/* Results List */}
          <div className="max-h-96 overflow-y-auto p-2">
            {filtered.length > 0 ? (
              <div className="space-y-1">
                {filtered.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelect(item.path)}
                      className="w-full flex items-center justify-between p-2.5 rounded-lg text-left hover:bg-blue-50/70 group transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-blue-100 text-slate-600 group-hover:text-blue-700 transition-colors">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-slate-900 group-hover:text-blue-700">
                              {item.title}
                            </span>
                            <span className="text-[10px] font-semibold px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded">
                              {item.category}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center text-sm text-slate-500">
                No matching results found for "{query}".
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Tip: Use Ctrl+K or Cmd+K anytime to launch search</span>
            <span>CloudSage – MigrateMind</span>
          </div>
        </div>
      </div>
    </div>
  );
};

