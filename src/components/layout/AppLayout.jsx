import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { SearchModal } from '../common/SearchModal';
import { Toast } from '../common/Toast';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useProject } from '../../context/ProjectContext';
import { FolderGit2 } from 'lucide-react';

export const AppLayout = () => {
  const { addProject } = useProject();
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);

  // New Project Form State
  const [formData, setFormData] = useState({
    name: '',
    client: '',
    code: '',
    targetCloud: 'AWS (us-east-1 & us-west-2)',
    cloudProvider: 'aws',
    serversCount: 24,
    budget: 1500000,
    leadArchitect: 'Sai Kumar',
    phase: 'Assessment Phase',
    description: '',
  });

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.client) return;

    addProject({
      name: formData.name,
      client: formData.client,
      code: formData.code || formData.name.substring(0, 6).toUpperCase(),
      targetCloud: formData.targetCloud,
      cloudProvider: formData.cloudProvider,
      serversCount: Number(formData.serversCount),
      budget: Number(formData.budget),
      leadArchitect: formData.leadArchitect,
      phase: formData.phase,
      status: 'Assessment',
      description: formData.description || 'Enterprise workload modernization and cloud migration.',
    });

    setIsNewProjectModalOpen(false);
    setFormData({
      name: '',
      client: '',
      code: '',
      targetCloud: 'AWS (us-east-1 & us-west-2)',
      cloudProvider: 'aws',
      serversCount: 24,
      budget: 1500000,
      leadArchitect: 'Sai Kumar',
      phase: 'Assessment Phase',
      description: '',
    });
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-900 font-sans antialiased">
      {/* Fixed Left Navigation */}
      <Sidebar />

      {/* Main Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopNavbar onNewProjectClick={() => setIsNewProjectModalOpen(true)} />

        {/* Page Content Viewport */}
        <main className="flex-1 p-6 md:p-8 max-w-[1600px] w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Omnibar Global Search Modal */}
      <SearchModal />

      {/* Feedback Toast Notification */}
      <Toast />

      {/* Create New Project Modal */}
      <Modal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        title="Initiate Enterprise Migration Project"
        subtitle="Configure project parameters, target landing zone cloud, and scope."
        maxWidth="max-w-xl"
        footer={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsNewProjectModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={FolderGit2}
              onClick={handleCreateProject}
            >
              Initialize Project
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateProject} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Project Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Core Billing Modernization"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Enterprise Client / BU *
              </label>
              <input
                type="text"
                required
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                placeholder="e.g. Global Financial Services"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Cloud
              </label>
              <select
                value={formData.cloudProvider}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    cloudProvider: e.target.value,
                    targetCloud: e.target.value === 'aws' ? 'AWS (us-east-1)' : 'Multi-Cloud',
                  })
                }
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="aws">Amazon Web Services (AWS)</option>
                <option value="azure">Microsoft Azure</option>
                <option value="gcp">Google Cloud Platform</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Workloads
              </label>
              <input
                type="number"
                value={formData.serversCount}
                onChange={(e) => setFormData({ ...formData, serversCount: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Budget ($)
              </label>
              <input
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Project Description & Objectives
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Outline business drivers, datacenter lease expiry deadlines, and compliance requirements..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

