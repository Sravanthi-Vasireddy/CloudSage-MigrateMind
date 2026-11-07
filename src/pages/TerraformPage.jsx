import React, { useState } from 'react';
import {
  FileCode2,
  Copy,
  Download,
  Terminal,
  CheckCircle2,
  ShieldCheck,
  Settings,
  Layers,
  Sparkles,
  Eye,
  Check,
  Play
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import {
  terraformModules,
  generateTerraformCode,
  mockPlanOutput,
  mockSecurityScanResults
} from '../data/mockTerraform';

export const TerraformPage = () => {
  const { currentProject, showToast } = useProject();

  const [selectedModules, setSelectedModules] = useState(['vpc', 'eks', 'aurora', 'iam_security']);

  const [variables, setVariables] = useState({
    aws_region: 'us-east-1',
    environment: 'production',
    vpc_cidr: '10.100.0.0/16',
    cluster_name: 'cloudsage-prod-eks',
  });

  const [activeFile, setActiveFile] = useState('main.tf');
  const [isCopied, setIsCopied] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);

  const codeBundle = generateTerraformCode(selectedModules, variables);

  const toggleModule = (modId) => {
    setSelectedModules((prev) =>
      prev.includes(modId) ? prev.filter((id) => id !== modId) : [...prev, modId]
    );
    showToast('Terraform code recalculated for updated module stack.');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeBundle[activeFile]);
    setIsCopied(true);
    showToast(`Copied ${activeFile} to clipboard.`);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownloadBundle = () => {
    const combinedContent = Object.entries(codeBundle)
      .map(([fileName, content]) => `### === FILE: ${fileName} ===\n\n${content}\n\n`)
      .join('\n');

    const blob = new Blob([combinedContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cloudsage-terraform-${variables.environment}.tf`;
    link.click();
    showToast('Complete Terraform configuration bundle downloaded.');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-blue-600 mb-1">
            Automated IaC Studio
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Terraform Generator
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Generate production-grade, modular Terraform HCL for VPC, EKS, Aurora Multi-AZ, and CIS-hardened security groups.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            icon={Play}
            onClick={() => setIsPlanModalOpen(true)}
          >
            Simulate Plan
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Download}
            onClick={handleDownloadBundle}
          >
            Download .tf Bundle
          </Button>
        </div>
      </div>

      {/* Module Selector & Configuration Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Module Picker (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card
            title="Terraform Module Catalogue"
            subtitle="Select modules to include in the generated Landing Zone"
          >
            <div className="space-y-3">
              {terraformModules.map((mod) => {
                const isSelected = selectedModules.includes(mod.id);
                return (
                  <div
                    key={mod.id}
                    onClick={() => toggleModule(mod.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/40 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                        />
                        <h4 className="text-xs font-bold text-slate-900">{mod.name}</h4>
                      </div>
                      <Badge variant={isSelected ? 'blue' : 'slate'} size="xs">
                        +{mod.resourceCount} Resources
                      </Badge>
                    </div>

                    <p className="text-[11px] text-slate-500 mt-1.5 ml-6">
                      {mod.description}
                    </p>

                    <div className="mt-2 ml-6 text-[10px] text-slate-400 flex items-center gap-2">
                      <span>Standard: {mod.complianceStandard}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Variables Configuration */}
          <Card
            title="Deployment Variables"
            subtitle="Custom parameter values rendered into variables.tf"
          >
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Target AWS Region
                </label>
                <select
                  value={variables.aws_region}
                  onChange={(e) => setVariables({ ...variables, aws_region: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="us-east-1">us-east-1 (N. Virginia - Primary)</option>
                  <option value="us-west-2">us-west-2 (Oregon - Disaster Recovery)</option>
                  <option value="eu-west-1">eu-west-1 (Ireland)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Environment
                  </label>
                  <select
                    value={variables.environment}
                    onChange={(e) => setVariables({ ...variables, environment: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="production">Production</option>
                    <option value="staging">Staging</option>
                    <option value="development">Development</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    VPC CIDR
                  </label>
                  <input
                    type="text"
                    value={variables.vpc_cidr}
                    onChange={(e) => setVariables({ ...variables, vpc_cidr: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  EKS Cluster Identifier
                </label>
                <input
                  type="text"
                  value={variables.cluster_name}
                  onChange={(e) => setVariables({ ...variables, cluster_name: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Code Viewer & Preflight Security (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-xl overflow-hidden flex flex-col h-[520px]">
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800">
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {Object.keys(codeBundle).map((fileName) => (
                  <button
                    key={fileName}
                    onClick={() => setActiveFile(fileName)}
                    className={`px-3 py-1 rounded text-xs font-mono font-medium transition-colors ${
                      activeFile === fileName
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    {fileName}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4 font-mono text-xs text-slate-200 leading-relaxed bg-[#0b1021]">
              <pre className="whitespace-pre">{codeBundle[activeFile]}</pre>
            </div>
          </div>

          <Card
            title="IaC Security & Compliance Pre-Flight"
            subtitle="Automated Checkov & tfsec policy inspection for generated HCL"
            actions={
              <Badge variant="emerald" size="xs">
                Zero Critical Findings
              </Badge>
            }
          >
            <div className="space-y-2 text-xs">
              {mockSecurityScanResults.map((res) => (
                <div
                  key={res.id}
                  className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-semibold text-slate-800">{res.title}</span>
                      <span className="text-[11px] font-mono text-slate-500 block">
                        Rule: {res.id} • Target: {res.resource}
                      </span>
                    </div>
                  </div>
                  <Badge variant="emerald" size="xs">
                    {res.severity}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {isPlanModalOpen && (
        <Modal
          isOpen={isPlanModalOpen}
          onClose={() => setIsPlanModalOpen(false)}
          title="Terraform Plan Dry-Run Simulation"
          subtitle="Simulated execution output for AWS US-East-1 deployment"
          maxWidth="max-w-3xl"
          footer={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsPlanModalOpen(false)}
            >
              Close Simulator
            </Button>
          }
        >
          <div className="bg-slate-950 p-4 rounded-xl font-mono text-xs text-slate-300 overflow-x-auto max-h-[450px]">
            <pre className="whitespace-pre text-emerald-400">{mockPlanOutput}</pre>
          </div>
        </Modal>
      )}
    </div>
  );
};

