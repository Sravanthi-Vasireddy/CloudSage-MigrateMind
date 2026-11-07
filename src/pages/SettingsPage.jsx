import React, { useState } from 'react';
import {
  Settings,
  Cloud,
  Database,
  Shield,
  Users,
  History,
  Save,
  RefreshCw
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Tabs } from '../components/common/Tabs';

export const SettingsPage = () => {
  const { currentProject, showToast } = useProject();

  const [activeTab, setActiveTab] = useState('general');

  const [generalConfig, setGeneralConfig] = useState({
    defaultCloud: 'aws',
    primaryRegion: 'us-east-1',
    secondaryRegion: 'us-west-2',
    currency: 'USD',
    storageUnit: 'TB',
    organizationName: 'Acme Retail Group',
    consultancyPartner: 'HCLTech Cloud Native CoE',
    enableMultiAzDefault: true,
    enforceKmsEncryption: true,
  });

  const [connectors, setConnectors] = useState([
    {
      id: 'vcenter',
      name: 'VMware vCenter API',
      type: 'Hypervisor Discovery',
      status: 'Connected',
      endpoint: 'https://vcenter.ord.acme.corp:443',
      lastSync: '18 minutes ago',
    },
    {
      id: 'servicenow',
      name: 'ServiceNow CMDB Connector',
      type: 'ITSM & Asset Catalog',
      status: 'Connected',
      endpoint: 'https://acmeretail.service-now.com',
      lastSync: '1 hour ago',
    },
    {
      id: 'aws-mgn',
      name: 'AWS Migration Evaluator & MGN',
      type: 'Cloud Migration Hub',
      status: 'Active',
      endpoint: 'arn:aws:mgn:us-east-1:123456789012',
      lastSync: '5 minutes ago',
    },
    {
      id: 'rvtools',
      name: 'RVTools Automated Parser',
      type: 'Offline XLSX Batch Import',
      status: 'Ready',
      endpoint: 'Local Batch Pipeline',
      lastSync: '2 days ago',
    },
  ]);

  const auditLogs = [
    { id: 'log-1', timestamp: '2026-11-07 16:42:10 UTC', user: 'Sai Kumar', action: 'Exported Production Terraform HCL bundle', ip: '10.240.1.15' },
    { id: 'log-2', timestamp: '2026-11-07 15:18:22 UTC', user: 'Sai Kumar', action: 'Overrode Strategy for ord-prod-db01 to Refactor (Aurora)', ip: '10.240.1.15' },
    { id: 'log-3', timestamp: '2026-11-07 14:02:45 UTC', user: 'System Engine', action: 'Synced 48 workloads from ServiceNow CMDB', ip: 'internal' },
    { id: 'log-4', timestamp: '2026-11-07 11:30:12 UTC', user: 'Priya Sharma', action: 'Validated CIS AWS Benchmark v2.0 scorecard', ip: '10.240.1.28' },
    { id: 'log-5', timestamp: '2026-11-06 18:20:00 UTC', user: 'Marcus Vance', action: 'Approved Executive Business Case for Wave 2', ip: '10.240.2.8' },
  ];

  const teamMembers = [
    { name: 'Sai Kumar', email: 'sai.kumar@hcltech.com', role: 'Lead Cloud Architect', org: 'HCLTech', access: 'Admin' },
    { name: 'Priya Sharma', email: 'priya.sharma@hcltech.com', role: 'Security & FinOps Specialist', org: 'HCLTech', access: 'Editor' },
    { name: 'Marcus Vance', email: 'm.vance@acmeretail.com', role: 'VP Infrastructure & Operations', org: 'Acme Retail', access: 'Reviewer' },
    { name: 'Alex Turner', email: 'a.turner@acmeretail.com', role: 'Principal Platform Engineer', org: 'Acme Retail', access: 'Editor' },
  ];

  const handleSaveGeneral = (e) => {
    e.preventDefault();
    showToast('Enterprise settings updated successfully.');
  };

  const handleTestConnector = (connName) => {
    showToast(`Connection to ${connName} verified successfully (Latency: 12ms).`);
  };

  const tabs = [
    { id: 'general', label: 'General Preferences', icon: Settings },
    { id: 'connectors', label: 'Discovery Connectors', icon: Database, count: connectors.length },
    { id: 'governance', label: 'Compliance Policies', icon: Shield },
    { id: 'team', label: 'Team & RBAC', icon: Users, count: teamMembers.length },
    { id: 'audit', label: 'Audit Log', icon: History },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-blue-600 mb-1">
            System Administration
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Settings & Enterprise Configuration
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure discovery credentials, default cloud landing zones, compliance rules, and access control.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="primary"
            size="sm"
            icon={Save}
            onClick={handleSaveGeneral}
          >
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab 1: General Preferences */}
      {activeTab === 'general' && (
        <Card
          title="Global Cloud Migration Defaults"
          subtitle="Configure default target platform settings for new workloads and Terraform generation"
        >
          <form onSubmit={handleSaveGeneral} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Default Target Cloud Provider
                </label>
                <select
                  value={generalConfig.defaultCloud}
                  onChange={(e) => setGeneralConfig({ ...generalConfig, defaultCloud: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="aws">Amazon Web Services (AWS Enterprise)</option>
                  <option value="azure">Microsoft Azure Enterprise</option>
                  <option value="gcp">Google Cloud Platform</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Primary Landing Zone Region
                </label>
                <input
                  type="text"
                  value={generalConfig.primaryRegion}
                  onChange={(e) => setGeneralConfig({ ...generalConfig, primaryRegion: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Client Organization Name
                </label>
                <input
                  type="text"
                  value={generalConfig.organizationName}
                  onChange={(e) => setGeneralConfig({ ...generalConfig, organizationName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Consulting Partner
                </label>
                <input
                  type="text"
                  value={generalConfig.consultancyPartner}
                  onChange={(e) => setGeneralConfig({ ...generalConfig, consultancyPartner: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2">
              <span className="font-semibold text-slate-900 block mb-1">Architecture Defaults</span>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={generalConfig.enableMultiAzDefault}
                  onChange={(e) => setGeneralConfig({ ...generalConfig, enableMultiAzDefault: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <span className="text-slate-700">Enforce Multi-AZ High Availability on all databases and containers</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={generalConfig.enforceKmsEncryption}
                  onChange={(e) => setGeneralConfig({ ...generalConfig, enforceKmsEncryption: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <span className="text-slate-700">Enforce Customer Managed KMS CMK encryption at rest on all storage</span>
              </label>
            </div>
          </form>
        </Card>
      )}

      {/* Tab 2: Discovery Connectors */}
      {activeTab === 'connectors' && (
        <Card
          title="On-Premises Infrastructure Discovery Connectors"
          subtitle="Agentless integrations with VMware, CMDBs, and discovery tools"
          noPadding
        >
          <div className="divide-y divide-slate-100">
            {connectors.map((conn) => (
              <div
                key={conn.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs hover:bg-slate-50 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-sm">{conn.name}</h4>
                    <Badge variant="emerald" size="xs">
                      {conn.status}
                    </Badge>
                  </div>
                  <div className="text-slate-500 text-[11px] mt-0.5">
                    {conn.type} • Endpoint: <span className="font-mono text-slate-700">{conn.endpoint}</span>
                  </div>
                  <div className="text-slate-400 text-[10px] mt-0.5">Last synchronized: {conn.lastSync}</div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="secondary"
                    size="xs"
                    icon={RefreshCw}
                    onClick={() => handleTestConnector(conn.name)}
                  >
                    Test Sync
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Tab 3: Governance Policies */}
      {activeTab === 'governance' && (
        <Card
          title="Cloud Migration Governance Guardrails"
          subtitle="Automated policy enforcement rules executed during Terraform generation"
        >
          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">CIS AWS Foundations Benchmark Level 2</span>
                <span className="text-slate-500">Require strict IAM least-privilege, root MFA, and encrypted CloudTrail logs.</span>
              </div>
              <Badge variant="emerald" size="sm">Active (Enforced)</Badge>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">Public Ingress Ban on Port 22/3389</span>
                <span className="text-slate-500">Block any Terraform module attempting 0.0.0.0/0 ingress to SSH or RDP.</span>
              </div>
              <Badge variant="emerald" size="sm">Active (Enforced)</Badge>
            </div>
          </div>
        </Card>
      )}

      {/* Tab 4: Team & RBAC */}
      {activeTab === 'team' && (
        <Card
          title="Authorized Consultants & Stakeholders"
          subtitle="Role-based access permissions for CloudSage workspace"
          noPadding
        >
          <div className="divide-y divide-slate-100 text-xs">
            {teamMembers.map((member, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 text-sm">{member.name}</div>
                  <div className="text-slate-500 text-[11px]">{member.email} • {member.org}</div>
                  <div className="text-slate-600 font-medium text-[11px] mt-0.5">{member.role}</div>
                </div>
                <Badge variant={member.access === 'Admin' ? 'purple' : 'blue'} size="sm">
                  {member.access}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Tab 5: Audit Log */}
      {activeTab === 'audit' && (
        <Card
          title="Security & Activity Audit Trail"
          subtitle="Immutable log of actions, strategy changes, and code exports"
          noPadding
        >
          <div className="divide-y divide-slate-100 text-xs">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="font-semibold text-slate-900">{log.action}</span>
                  <div className="text-slate-500 text-[11px]">
                    User: <strong className="text-slate-700">{log.user}</strong> • IP: {log.ip}
                  </div>
                </div>
                <span className="text-[11px] text-slate-400 font-mono shrink-0">{log.timestamp}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

