import React, { useState, useEffect, useCallback } from 'react';
import {
  Server,
  Search,
  Download,
  Upload,
  AlertTriangle,
  Eye,
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Database,
  Cpu,
  HardDrive,
  Info,
  X,
  Layers,
  Activity,
  Terminal,
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Table } from '../components/common/Table';
import { Modal } from '../components/common/Modal';
import { mockInventory } from '../data/mockInventory';
import { formatCurrency, formatStorage } from '../utils/formatters';
import { infrastructureApi } from '../services/infrastructureApi';

const DEFAULT_FORM_DATA = {
  workloadName: '',
  applicationName: '',
  serverName: '',
  operatingSystem: 'Ubuntu Server 22.04 LTS',
  cpuCores: 8,
  ramGB: 32,
  storageGB: 500,
  databaseType: 'PostgreSQL 15',
  environment: 'Production',
  businessCriticality: 'High',
  description: '',
};

export const InventoryPage = () => {
  const { currentProject, showToast } = useProject();

  // State
  const [inventoryList, setInventoryList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [backendOnline, setBackendOnline] = useState(null); // null = unknown, true = online, false = offline
  const [apiError, setApiError] = useState(null);

  // Filters & Query
  const [searchQuery, setSearchQuery] = useState('');
  const [envFilter, setEnvFilter] = useState('ALL');
  const [criticalityFilter, setCriticalityFilter] = useState('ALL');

  // Modals
  const [selectedServer, setSelectedServer] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);

  // Form
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch Inventory Data from Spring Boot REST API (with graceful fallback to mock data)
  const loadInventory = useCallback(async () => {
    setIsLoading(true);
    setApiError(null);

    try {
      const data = await infrastructureApi.getAll();
      setInventoryList(data);
      setBackendOnline(true);
    } catch (err) {
      console.warn('Spring Boot REST API offline or unreachable, falling back to initial enterprise inventory:', err);
      setBackendOnline(false);

      // Normalize mockInventory to have consistent fields
      const normalizedMock = mockInventory.map((item, idx) => ({
        id: item.id || `srv-${idx + 1}`,
        workloadName: item.workload || `Workload ${idx + 1}`,
        applicationName: item.appTier || 'Enterprise Service Tier',
        serverName: item.hostname || `host-${idx + 1}.corp.internal`,
        operatingSystem: item.os || 'Red Hat Enterprise Linux 8.8',
        cpuCores: item.vcpu || 8,
        ramGB: item.ramGb || 32,
        storageGB: item.storageGb || 500,
        databaseType: item.workload?.toLowerCase().includes('database') || item.workload?.toLowerCase().includes('db')
          ? 'Oracle 19c RAC'
          : 'None',
        environment: item.environment || 'Production',
        businessCriticality: item.environment === 'Production' ? 'Mission Critical' : 'Medium',
        description: item.workload || 'Core infrastructure workload',
        createdAt: new Date().toISOString(),
      }));

      setInventoryList(normalizedMock);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInventory();
  }, [loadInventory]);

  // Form Validation
  const validateForm = () => {
    const errors = {};
    if (!formData.workloadName?.trim()) errors.workloadName = 'Workload name is required';
    if (!formData.applicationName?.trim()) errors.applicationName = 'Application name is required';
    if (!formData.serverName?.trim()) errors.serverName = 'Server hostname is required';
    if (!formData.operatingSystem?.trim()) errors.operatingSystem = 'Operating system is required';
    if (!formData.cpuCores || Number(formData.cpuCores) < 1) errors.cpuCores = 'CPU cores must be at least 1';
    if (!formData.ramGB || Number(formData.ramGB) < 1) errors.ramGB = 'RAM must be at least 1 GB';
    if (!formData.storageGB || Number(formData.storageGB) < 1) errors.storageGB = 'Storage must be at least 1 GB';
    if (!formData.environment?.trim()) errors.environment = 'Environment is required';
    if (!formData.businessCriticality?.trim()) errors.businessCriticality = 'Criticality is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    setFormData(DEFAULT_FORM_DATA);
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (item, e) => {
    e?.stopPropagation();
    setActiveItem(item);
    setFormData({
      workloadName: item.workloadName || '',
      applicationName: item.applicationName || '',
      serverName: item.serverName || '',
      operatingSystem: item.operatingSystem || 'Ubuntu Server 22.04 LTS',
      cpuCores: item.cpuCores || 8,
      ramGB: item.ramGB || 32,
      storageGB: item.storageGB || 500,
      databaseType: item.databaseType || 'None',
      environment: item.environment || 'Production',
      businessCriticality: item.businessCriticality || 'High',
      description: item.description || '',
    });
    setFormErrors({});
    setIsEditModalOpen(true);
  };

  // Open Delete Modal
  const handleOpenDelete = (item, e) => {
    e?.stopPropagation();
    setActiveItem(item);
    setIsDeleteModalOpen(true);
  };

  // Submit Add Form
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setApiError(null);

    const payload = {
      ...formData,
      cpuCores: Number(formData.cpuCores),
      ramGB: Number(formData.ramGB),
      storageGB: Number(formData.storageGB),
    };

    try {
      if (backendOnline) {
        await infrastructureApi.create(payload);
        showToast(`Workload "${payload.workloadName}" created in database.`);
        await loadInventory();
      } else {
        const localNewItem = {
          ...payload,
          id: `local-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        setInventoryList((prev) => [localNewItem, ...prev]);
        showToast(`Workload "${payload.workloadName}" added locally (Spring Boot offline).`);
      }
      setIsAddModalOpen(false);
    } catch (err) {
      setApiError(err.message || 'Failed to create infrastructure record');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Edit Form
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm() || !activeItem) return;

    setIsSubmitting(true);
    setApiError(null);

    const payload = {
      ...formData,
      cpuCores: Number(formData.cpuCores),
      ramGB: Number(formData.ramGB),
      storageGB: Number(formData.storageGB),
    };

    try {
      if (backendOnline) {
        await infrastructureApi.update(activeItem.id, payload);
        showToast(`Workload "${payload.workloadName}" updated in database.`);
        await loadInventory();
      } else {
        setInventoryList((prev) =>
          prev.map((item) =>
            item.id === activeItem.id ? { ...item, ...payload } : item
          )
        );
        showToast(`Workload "${payload.workloadName}" updated locally.`);
      }
      setIsEditModalOpen(false);
    } catch (err) {
      setApiError(err.message || 'Failed to update infrastructure record');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confirm Delete
  const handleDeleteConfirm = async () => {
    if (!activeItem) return;

    setIsSubmitting(true);
    setApiError(null);

    try {
      if (backendOnline) {
        await infrastructureApi.delete(activeItem.id);
        showToast(`Workload "${activeItem.workloadName}" deleted from database.`);
        await loadInventory();
      } else {
        setInventoryList((prev) => prev.filter((item) => item.id !== activeItem.id));
        showToast(`Workload "${activeItem.workloadName}" deleted locally.`);
      }
      setIsDeleteModalOpen(false);
    } catch (err) {
      setApiError(err.message || 'Failed to delete infrastructure record');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = 'ID,WorkloadName,ApplicationName,ServerName,OperatingSystem,CPUCores,RAM_GB,Storage_GB,DatabaseType,Environment,BusinessCriticality\n';
    const rows = filteredData
      .map(
        (s) =>
          `"${s.id}","${s.workloadName}","${s.applicationName}","${s.serverName}","${s.operatingSystem}",${s.cpuCores},${s.ramGB},${s.storageGB},"${s.databaseType || 'None'}","${s.environment}","${s.businessCriticality}"\n`
      )
      .join('');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `CloudSage_Inventory_${currentProject?.code || 'EXP'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Infrastructure inventory exported to CSV successfully.');
  };

  // Filtered dataset
  const filteredData = inventoryList.filter((item) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      (item.workloadName && item.workloadName.toLowerCase().includes(q)) ||
      (item.applicationName && item.applicationName.toLowerCase().includes(q)) ||
      (item.serverName && item.serverName.toLowerCase().includes(q)) ||
      (item.operatingSystem && item.operatingSystem.toLowerCase().includes(q)) ||
      (item.databaseType && item.databaseType.toLowerCase().includes(q));

    const matchesEnv = envFilter === 'ALL' || item.environment === envFilter;
    const matchesCriticality =
      criticalityFilter === 'ALL' || item.businessCriticality === criticalityFilter;

    return matchesSearch && matchesEnv && matchesCriticality;
  });

  // Table Columns
  const columns = [
    {
      header: 'Workload & Application',
      key: 'workloadName',
      render: (item) => (
        <div>
          <div className="font-semibold text-slate-900 flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="truncate max-w-[220px]" title={item.workloadName}>
              {item.workloadName}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
            <span className="truncate max-w-[180px]">{item.applicationName}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Server & Operating System',
      key: 'serverName',
      render: (item) => (
        <div>
          <div className="font-mono text-xs font-medium text-slate-800 flex items-center gap-1">
            <span className="truncate max-w-[200px]" title={item.serverName}>
              {item.serverName}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 truncate max-w-[180px]" title={item.operatingSystem}>
            {item.operatingSystem}
          </div>
        </div>
      ),
    },
    {
      header: 'Compute & Memory',
      key: 'specs',
      render: (item) => (
        <div className="text-xs text-slate-700">
          <div className="flex items-center gap-1.5 font-medium">
            <Cpu className="w-3 h-3 text-slate-400 shrink-0" />
            <span>{item.cpuCores} Cores</span>
            <span className="text-slate-300">•</span>
            <span>{item.ramGB} GB RAM</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Storage & Database',
      key: 'storage',
      render: (item) => (
        <div className="text-xs">
          <div className="flex items-center gap-1.5 text-slate-700 font-medium">
            <HardDrive className="w-3 h-3 text-slate-400 shrink-0" />
            <span>{formatStorage(item.storageGB)}</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
            <Database className="w-3 h-3 text-blue-500 shrink-0" />
            <span className="truncate max-w-[120px]">{item.databaseType || 'None'}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Environment',
      key: 'environment',
      render: (item) => {
        const envVariant =
          item.environment === 'Production'
            ? 'blue'
            : item.environment === 'Staging'
            ? 'purple'
            : item.environment === 'Development'
            ? 'slate'
            : 'sky';
        return (
          <Badge variant={envVariant} size="xs">
            {item.environment}
          </Badge>
        );
      },
    },
    {
      header: 'Criticality',
      key: 'businessCriticality',
      render: (item) => {
        const critVariant =
          item.businessCriticality === 'Mission Critical'
            ? 'red'
            : item.businessCriticality === 'High'
            ? 'amber'
            : item.businessCriticality === 'Medium'
            ? 'blue'
            : 'slate';
        return (
          <Badge variant={critVariant} size="xs">
            {item.businessCriticality}
          </Badge>
        );
      },
    },
    {
      header: 'Actions',
      key: 'actions',
      align: 'right',
      render: (item) => (
        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="xs"
            icon={Eye}
            onClick={() => setSelectedServer(item)}
            title="Inspect Details"
          />
          <Button
            variant="ghost"
            size="xs"
            icon={Pencil}
            className="text-slate-600 hover:text-blue-600 hover:bg-blue-50"
            onClick={(e) => handleOpenEdit(item, e)}
            title="Edit Workload"
          />
          <Button
            variant="ghost"
            size="xs"
            icon={Trash2}
            className="text-slate-600 hover:text-red-600 hover:bg-red-50"
            onClick={(e) => handleOpenDelete(item, e)}
            title="Delete Workload"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Backend Connectivity Status Banner */}
      <div
        className={`p-3.5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs transition-colors ${
          backendOnline
            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
            : 'bg-amber-50/70 border-amber-200 text-amber-900'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-2.5 w-2.5 shrink-0">
            {backendOnline ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
              </>
            ) : (
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            )}
          </div>
          <div>
            {backendOnline ? (
              <p className="font-medium">
                <strong>Spring Boot REST API Online:</strong> Connected to{' '}
                <code className="bg-emerald-100 text-emerald-900 px-1 py-0.5 rounded font-mono text-[11px]">
                  http://localhost:8080/api/infrastructure
                </code>{' '}
                with MySQL persistence.
              </p>
            ) : (
              <p className="font-medium">
                <strong>Spring Boot Backend Offline:</strong> Running in client demo mode with local cache. Start backend via{' '}
                <code className="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-mono text-[11px]">
                  cd backend && mvnw.cmd spring-boot:run
                </code>
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          <Button
            variant="secondary"
            size="xs"
            icon={RefreshCw}
            onClick={loadInventory}
            disabled={isLoading}
          >
            {isLoading ? 'Connecting...' : 'Refresh Status'}
          </Button>
        </div>
      </div>

      {/* Global Error Banner */}
      {apiError && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>
              <strong>API Error:</strong> {apiError}
            </span>
          </div>
          <button
            onClick={() => setApiError(null)}
            className="text-red-500 hover:text-red-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-blue-600 mb-1">
            Enterprise Cloud Migration • Stage 3
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Infrastructure Inventory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage on-premises servers, application workloads, CPU/RAM sizing, and database topologies.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            icon={Download}
            onClick={handleExportCSV}
          >
            Export CSV
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={handleOpenAdd}
          >
            Add Workload
          </Button>
        </div>
      </div>

      {/* Filter and Query Control Bar */}
      <Card noPadding>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-50/50 border-b border-slate-200">
          {/* Search */}
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by workload, server, app, OS, or DB..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Environment Filter */}
          <div>
            <select
              value={envFilter}
              onChange={(e) => setEnvFilter(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Environments</option>
              <option value="Production">Production</option>
              <option value="Staging">Staging</option>
              <option value="Development">Development</option>
              <option value="QA">QA</option>
            </select>
          </div>

          {/* Criticality Filter */}
          <div>
            <select
              value={criticalityFilter}
              onChange={(e) => setCriticalityFilter(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Criticalities</option>
              <option value="Mission Critical">Mission Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        {/* Results summary pill */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span>
            Showing <strong className="text-slate-800">{filteredData.length}</strong> of{' '}
            {inventoryList.length} infrastructure workload(s)
          </span>
          <span className="text-[11px] text-blue-600 font-medium">
            Storage Engine: {backendOnline ? 'MySQL 8.0 (cloudsage_db)' : 'In-Memory Demo'}
          </span>
        </div>

        {/* Table View */}
        <Table
          columns={columns}
          data={filteredData}
          isLoading={isLoading}
          onRowClick={(item) => setSelectedServer(item)}
        />
      </Card>

      {/* Add Workload Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Infrastructure Workload"
        subtitle="Provision a new physical or virtual workload record in cloudsage_db"
        maxWidth="max-w-2xl"
        footer={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsAddModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleCreateSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving to Database...' : 'Save Workload'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Workload Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.workloadName}
                onChange={(e) => setFormData({ ...formData, workloadName: e.target.value })}
                placeholder="e.g. Core Banking Engine"
                className={`w-full px-3 py-1.5 rounded-lg border ${
                  formErrors.workloadName ? 'border-red-500' : 'border-slate-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {formErrors.workloadName && (
                <span className="text-[10px] text-red-500 mt-0.5 block">{formErrors.workloadName}</span>
              )}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Application Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.applicationName}
                onChange={(e) => setFormData({ ...formData, applicationName: e.target.value })}
                placeholder="e.g. FinCore Suite"
                className={`w-full px-3 py-1.5 rounded-lg border ${
                  formErrors.applicationName ? 'border-red-500' : 'border-slate-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {formErrors.applicationName && (
                <span className="text-[10px] text-red-500 mt-0.5 block">{formErrors.applicationName}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Server Hostname <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.serverName}
                onChange={(e) => setFormData({ ...formData, serverName: e.target.value })}
                placeholder="e.g. prod-fin-app-01.corp.internal"
                className={`w-full px-3 py-1.5 rounded-lg border ${
                  formErrors.serverName ? 'border-red-500' : 'border-slate-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {formErrors.serverName && (
                <span className="text-[10px] text-red-500 mt-0.5 block">{formErrors.serverName}</span>
              )}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Operating System <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.operatingSystem}
                onChange={(e) => setFormData({ ...formData, operatingSystem: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Ubuntu Server 22.04 LTS">Ubuntu Server 22.04 LTS</option>
                <option value="Red Hat Enterprise Linux 8.8">Red Hat Enterprise Linux 8.8</option>
                <option value="Red Hat Enterprise Linux 9.2">Red Hat Enterprise Linux 9.2</option>
                <option value="Windows Server 2022">Windows Server 2022</option>
                <option value="Windows Server 2019">Windows Server 2019</option>
                <option value="Oracle Linux 8.8">Oracle Linux 8.8</option>
                <option value="Debian GNU/Linux 12">Debian GNU/Linux 12</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                CPU Cores <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={formData.cpuCores}
                onChange={(e) => setFormData({ ...formData, cpuCores: e.target.value })}
                className={`w-full px-3 py-1.5 rounded-lg border ${
                  formErrors.cpuCores ? 'border-red-500' : 'border-slate-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                RAM (GB) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={formData.ramGB}
                onChange={(e) => setFormData({ ...formData, ramGB: e.target.value })}
                className={`w-full px-3 py-1.5 rounded-lg border ${
                  formErrors.ramGB ? 'border-red-500' : 'border-slate-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Storage (GB) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={formData.storageGB}
                onChange={(e) => setFormData({ ...formData, storageGB: e.target.value })}
                className={`w-full px-3 py-1.5 rounded-lg border ${
                  formErrors.storageGB ? 'border-red-500' : 'border-slate-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Database Engine</label>
              <input
                type="text"
                value={formData.databaseType}
                onChange={(e) => setFormData({ ...formData, databaseType: e.target.value })}
                placeholder="e.g. PostgreSQL 15, Oracle 19c"
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Environment</label>
              <select
                value={formData.environment}
                onChange={(e) => setFormData({ ...formData, environment: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Production">Production</option>
                <option value="Staging">Staging</option>
                <option value="Development">Development</option>
                <option value="QA">QA</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Business Criticality</label>
              <select
                value={formData.businessCriticality}
                onChange={(e) => setFormData({ ...formData, businessCriticality: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Mission Critical">Mission Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Description / Migration Scope</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Operational details, failover patterns, or migration notes..."
              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </form>
      </Modal>

      {/* Edit Workload Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Edit Workload: ${activeItem?.workloadName || ''}`}
        subtitle={`ID: #${activeItem?.id} • Server: ${activeItem?.serverName}`}
        maxWidth="max-w-2xl"
        footer={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsEditModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleUpdateSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating Database...' : 'Save Changes'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleUpdateSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Workload Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.workloadName}
                onChange={(e) => setFormData({ ...formData, workloadName: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Application Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.applicationName}
                onChange={(e) => setFormData({ ...formData, applicationName: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Server Hostname <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.serverName}
                onChange={(e) => setFormData({ ...formData, serverName: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Operating System <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.operatingSystem}
                onChange={(e) => setFormData({ ...formData, operatingSystem: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Ubuntu Server 22.04 LTS">Ubuntu Server 22.04 LTS</option>
                <option value="Red Hat Enterprise Linux 8.8">Red Hat Enterprise Linux 8.8</option>
                <option value="Red Hat Enterprise Linux 9.2">Red Hat Enterprise Linux 9.2</option>
                <option value="Windows Server 2022">Windows Server 2022</option>
                <option value="Windows Server 2019">Windows Server 2019</option>
                <option value="Oracle Linux 8.8">Oracle Linux 8.8</option>
                <option value="Debian GNU/Linux 12">Debian GNU/Linux 12</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">CPU Cores</label>
              <input
                type="number"
                min="1"
                value={formData.cpuCores}
                onChange={(e) => setFormData({ ...formData, cpuCores: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">RAM (GB)</label>
              <input
                type="number"
                min="1"
                value={formData.ramGB}
                onChange={(e) => setFormData({ ...formData, ramGB: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Storage (GB)</label>
              <input
                type="number"
                min="1"
                value={formData.storageGB}
                onChange={(e) => setFormData({ ...formData, storageGB: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Database Engine</label>
              <input
                type="text"
                value={formData.databaseType}
                onChange={(e) => setFormData({ ...formData, databaseType: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Environment</label>
              <select
                value={formData.environment}
                onChange={(e) => setFormData({ ...formData, environment: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Production">Production</option>
                <option value="Staging">Staging</option>
                <option value="Development">Development</option>
                <option value="QA">QA</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Business Criticality</label>
              <select
                value={formData.businessCriticality}
                onChange={(e) => setFormData({ ...formData, businessCriticality: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Mission Critical">Mission Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Description / Migration Scope</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Workload Deletion"
        subtitle="This action will permanently delete the workload from the inventory"
        maxWidth="max-w-md"
        footer={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleDeleteConfirm}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Deleting...' : 'Delete Workload'}
            </Button>
          </>
        }
      >
        <div className="space-y-3 text-xs">
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Are you sure you want to delete this workload?</p>
              <p className="mt-1 text-red-700">
                Workload: <strong>{activeItem?.workloadName}</strong>
              </p>
              <p className="text-red-700">
                Server: <span className="font-mono">{activeItem?.serverName}</span>
              </p>
            </div>
          </div>
          <p className="text-slate-500">
            This will remove the workload configuration from the migration planner inventory.
          </p>
        </div>
      </Modal>

      {/* Server Detail Modal */}
      {selectedServer && (
        <Modal
          isOpen={!!selectedServer}
          onClose={() => setSelectedServer(null)}
          title={`Workload Deep Dive: ${selectedServer.workloadName}`}
          subtitle={`Host: ${selectedServer.serverName} • App: ${selectedServer.applicationName}`}
          maxWidth="max-w-2xl"
          footer={
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedServer(null)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  showToast(`Cloud right-sizing verified for ${selectedServer.serverName}`);
                  setSelectedServer(null);
                }}
              >
                Confirm Sizing
              </Button>
            </>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-400 uppercase font-semibold text-[10px] block">Compute (CPU)</span>
                <span className="font-bold text-slate-800 text-sm">{selectedServer.cpuCores} Cores</span>
                <span className="text-slate-500 text-[10px] block">{selectedServer.operatingSystem}</span>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-semibold text-[10px] block">Memory (RAM)</span>
                <span className="font-bold text-slate-800 text-sm">{selectedServer.ramGB} GB</span>
                <span className="text-slate-500 text-[10px] block">DDR4 Registered</span>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-semibold text-[10px] block">Storage</span>
                <span className="font-bold text-slate-800 text-sm">{formatStorage(selectedServer.storageGB)}</span>
                <span className="text-slate-500 text-[10px] block">SSD SAN Volume</span>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-semibold text-[10px] block">Database Engine</span>
                <span className="font-bold text-slate-800 text-sm truncate block" title={selectedServer.databaseType}>
                  {selectedServer.databaseType || 'None'}
                </span>
                <span className="text-slate-500 text-[10px] block">{selectedServer.environment}</span>
              </div>
            </div>

            {selectedServer.description && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 uppercase font-semibold text-[10px] block mb-1">
                  Workload Description & Scope
                </span>
                <p className="text-slate-700 leading-relaxed">{selectedServer.description}</p>
              </div>
            )}

            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-blue-900 text-sm">
                  Recommended Target Architecture
                </span>
                <Badge variant="blue" size="sm">
                  {selectedServer.environment === 'Production' ? 'AWS Multi-AZ' : 'AWS Single-AZ'}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 block">Compute Sizing:</span>
                  <span className="font-semibold text-slate-900">
                    AWS EC2 {selectedServer.cpuCores >= 16 ? 'm6i.4xlarge' : selectedServer.cpuCores >= 8 ? 'm6i.2xlarge' : 'm6i.xlarge'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Storage Strategy:</span>
                  <span className="font-semibold text-slate-900">
                    Amazon EBS gp3 ({selectedServer.storageGB} GB, 3000 IOPS)
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-blue-200/60 flex items-center justify-between">
                <div>
                  <span className="text-slate-500 block text-[11px]">Business Criticality:</span>
                  <span className="text-slate-800 font-semibold">{selectedServer.businessCriticality}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block text-[11px]">Database Service:</span>
                  <span className="text-blue-700 font-semibold">
                    {selectedServer.databaseType && selectedServer.databaseType !== 'None'
                      ? `AWS RDS / Aurora (${selectedServer.databaseType})`
                      : 'Application Server Only'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
