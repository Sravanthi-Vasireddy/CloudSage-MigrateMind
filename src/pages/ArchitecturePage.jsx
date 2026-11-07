import React, { useState, useCallback, useMemo, useEffect } from 'react';
import ReactFlow, {
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge
} from 'reactflow';
import 'reactflow/dist/style.css';

import {
  Network,
  Download,
  ShieldCheck,
  Database,
  Cloud,
  FileCode2,
  ExternalLink,
  Layers,
  Sparkles,
  RefreshCw,
  Info,
  CheckCircle2,
  AlertTriangle,
  GitCompare,
  Plus,
  Trash2,
  Save,
  Server,
  Cpu,
  HardDrive,
  Lock,
  Boxes,
  Zap,
  X
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { CloudArchitectureNode } from '../components/architecture/CustomNodes';
import { formatCurrency, formatStorage } from '../utils/formatters';
import { architectureApi } from '../services/architectureApi';

// Fallback Provider Architecture Blueprints (Used when backend is offline)
const FALLBACK_BLUEPRINTS = {
  AWS: {
    id: 1,
    provider: 'AWS',
    architectureName: 'CloudSage AWS Enterprise Multi-AZ Target Architecture',
    description: 'Recommended target topology generated from assessed workloads utilizing Amazon EKS, Aurora PostgreSQL Multi-AZ, and Transit Gateway.',
    primaryRegion: 'us-east-1 (N. Virginia)',
    secondaryRegion: 'us-west-2 (Oregon)',
    isMultiRegionDR: false,
    totalComputeCores: 40,
    totalRamGB: 224,
    totalStorageGB: 1950,
    primaryComputeService: 'Amazon EKS (Karpenter auto-scaling) & EC2 (m6i/c6i)',
    primaryDatabaseService: 'Amazon Aurora PostgreSQL Multi-AZ & RDS Custom',
    primaryStorageService: 'Amazon S3 Lakehouse & EBS gp3 Volume Tier',
    primaryNetworkService: 'AWS Transit Gateway, Dual-AZ VPC & Direct Connect',
    primarySecurityService: 'AWS WAF v2, AWS KMS CMK, IAM OIDC & GuardDuty',
    operationalComplexity: 'Medium',
    estimatedMonthlyBaseline: 2640.00,
    nodes: [
      { id: 'user-traffic', type: 'cloudNode', position: { x: 50, y: 180 }, data: { title: 'Global End Users', category: 'Edge Network', subtitle: 'Public HTTPS Clients & Mobile Apps', status: 'active', icon: 'Users', color: '#3b82f6', provider: 'AWS', details: { service: 'Amazon Route 53 + CloudFront', protocol: 'TLS 1.3 / HTTPS', ddosProtection: 'AWS Shield Standard' } } },
      { id: 'onprem-dc', type: 'cloudNode', position: { x: 50, y: 380 }, data: { title: 'On-Premises Datacenter', category: 'Hybrid Connectivity', subtitle: 'Chicago Equinix CH1 & HQ', status: 'active', icon: 'Building2', color: '#f59e0b', provider: 'AWS', details: { service: 'AWS Direct Connect', bandwidth: '10 Gbps Dedicated', backup: 'IPsec VPN Tunnel' } } },
      { id: 'transit-gw', type: 'cloudNode', position: { x: 300, y: 280 }, data: { title: 'AWS Transit Gateway', category: 'Network Backbone', subtitle: 'Hub & Spoke Router (tgw-08a9f2)', status: 'active', icon: 'Network', color: '#6366f1', provider: 'AWS', details: { service: 'AWS Transit Gateway', asn: '64512', vpcAttachments: '4 VPCs Attached' } } },
      { id: 'aws-waf-alb', type: 'cloudNode', position: { x: 550, y: 150 }, data: { title: 'AWS WAF v2 + Public ALB', category: 'Ingress & Balancing', subtitle: 'Dual-AZ Ingress (10.100.1.0/24)', status: 'active', icon: 'ShieldCheck', color: '#10b981', provider: 'AWS', details: { service: 'Application Load Balancer', scheme: 'internet-facing', wafRules: 'OWASP Core + IP Reputation' } } },
      { id: 'eks-cluster', type: 'cloudNode', position: { x: 820, y: 150 }, data: { title: 'Amazon EKS App Tier', category: 'Compute & Containers', subtitle: 'Kubernetes v1.30 (m6i.xlarge)', status: 'active', icon: 'Boxes', color: '#0284c7', provider: 'AWS', details: { service: 'Amazon EKS', autoscaler: 'Karpenter v0.35', instances: '3-12 Nodes Multi-AZ' } } },
      { id: 'aurora-pg', type: 'cloudNode', position: { x: 1100, y: 150 }, data: { title: 'Amazon Aurora PostgreSQL', category: 'Database Tier', subtitle: 'Multi-AZ Cluster (db.r6g.2xlarge)', status: 'active', icon: 'Database', color: '#7c3aed', provider: 'AWS', details: { service: 'Amazon Aurora', engine: 'PostgreSQL 16.2', replication: '6-way 3-AZ Synchronous' } } },
      { id: 'elasticache', type: 'cloudNode', position: { x: 820, y: 350 }, data: { title: 'Amazon ElastiCache Redis', category: 'In-Memory Caching', subtitle: 'Redis Cluster 7.1 Multi-AZ', status: 'active', icon: 'Cpu', color: '#ea580c', provider: 'AWS', details: { service: 'Amazon ElastiCache', shards: '2 Shards x 2 Replicas', encryption: 'In-Transit TLS + At-Rest' } } },
      { id: 's3-datalake', type: 'cloudNode', position: { x: 1100, y: 350 }, data: { title: 'Amazon S3 Lakehouse', category: 'Storage & Archival', subtitle: 'Intelligent-Tiering + Glacier', status: 'active', icon: 'HardDrive', color: '#16a34a', provider: 'AWS', details: { service: 'Amazon S3', durability: '11 9s Durability', versioning: 'Enabled with MFA Delete' } } }
    ],
    edges: [
      { id: 'e1-2', source: 'user-traffic', target: 'aws-waf-alb', animated: true, style: { stroke: '#3b82f6', strokeWidth: 2 } },
      { id: 'e2-3', source: 'onprem-dc', target: 'transit-gw', style: { stroke: '#f59e0b', strokeWidth: 2, strokeDasharray: '4,4' } },
      { id: 'e3-4', source: 'transit-gw', target: 'aws-waf-alb', style: { stroke: '#6366f1', strokeWidth: 2 } },
      { id: 'e4-5', source: 'aws-waf-alb', target: 'eks-cluster', animated: true, style: { stroke: '#10b981', strokeWidth: 2 } },
      { id: 'e5-6', source: 'eks-cluster', target: 'aurora-pg', animated: true, style: { stroke: '#0284c7', strokeWidth: 2 } },
      { id: 'e5-7', source: 'eks-cluster', target: 'elasticache', style: { stroke: '#ea580c', strokeWidth: 2 } },
      { id: 'e5-8', source: 'eks-cluster', target: 's3-datalake', style: { stroke: '#16a34a', strokeWidth: 2 } }
    ]
  },
  AZURE: {
    id: 2,
    provider: 'AZURE',
    architectureName: 'CloudSage Azure Enterprise Multi-Zone Target Architecture',
    description: 'Recommended target topology generated from assessed workloads utilizing AKS, Azure SQL Managed Instance, and Azure Virtual Network.',
    primaryRegion: 'eastus (East US)',
    secondaryRegion: 'westus2 (West US 2)',
    isMultiRegionDR: false,
    totalComputeCores: 40,
    totalRamGB: 224,
    totalStorageGB: 1950,
    primaryComputeService: 'Azure Kubernetes Service (AKS) & Azure VMs (D-series v5)',
    primaryDatabaseService: 'Azure SQL Database Managed Instance & PostgreSQL Flexible Server',
    primaryStorageService: 'Azure Blob Storage (Hot/Cool/Archive) & Premium SSD',
    primaryNetworkService: 'Azure Virtual Network (VNet) Hub-Spoke & App Gateway v2',
    primarySecurityService: 'Azure Firewall Premium, Key Vault HSM & Microsoft Entra ID',
    operationalComplexity: 'Medium',
    estimatedMonthlyBaseline: 2720.00,
    nodes: [
      { id: 'user-traffic', type: 'cloudNode', position: { x: 50, y: 180 }, data: { title: 'Global Users & Clients', category: 'Edge Network', subtitle: 'Public HTTPS & Enterprise Mobile', status: 'active', icon: 'Users', color: '#0078d4', provider: 'AZURE', details: { service: 'Azure Front Door + Azure DNS', protocol: 'TLS 1.3 / HTTPS', ddosProtection: 'Azure DDoS Protection Standard' } } },
      { id: 'onprem-dc', type: 'cloudNode', position: { x: 50, y: 380 }, data: { title: 'On-Premises Datacenter', category: 'Hybrid Connectivity', subtitle: 'Chicago Equinix CH1 & HQ', status: 'active', icon: 'Building2', color: '#f59e0b', provider: 'AZURE', details: { service: 'Azure ExpressRoute', bandwidth: '10 Gbps Circuit', backup: 'VPN Gateway Route-based' } } },
      { id: 'transit-gw', type: 'cloudNode', position: { x: 300, y: 280 }, data: { title: 'Azure Virtual WAN Hub', category: 'Network Backbone', subtitle: 'Secured Hub (vwan-eastus)', status: 'active', icon: 'Network', color: '#0078d4', provider: 'AZURE', details: { service: 'Azure Virtual WAN', topology: 'Hub and Spoke', vnetPeerings: '4 VNets Peered' } } },
      { id: 'aws-waf-alb', type: 'cloudNode', position: { x: 550, y: 150 }, data: { title: 'Azure Application Gateway v2', category: 'Ingress & Balancing', subtitle: 'WAF v2 Tier (10.200.1.0/24)', status: 'active', icon: 'ShieldCheck', color: '#10b981', provider: 'AZURE', details: { service: 'Application Gateway v2', wafPolicy: 'OWASP 3.2 Detection & Prevention', sslOffloading: 'Key Vault Managed Certs' } } },
      { id: 'eks-cluster', type: 'cloudNode', position: { x: 820, y: 150 }, data: { title: 'Azure Kubernetes Service (AKS)', category: 'Compute & Containers', subtitle: 'K8s v1.30 (Standard_D4s_v5)', status: 'active', icon: 'Boxes', color: '#0078d4', provider: 'AZURE', details: { service: 'Azure AKS', nodePools: 'System + User Node Pools', autoscaler: 'KEDA + Azure Virtual Nodes' } } },
      { id: 'aurora-pg', type: 'cloudNode', position: { x: 1100, y: 150 }, data: { title: 'Azure SQL Managed Instance', category: 'Database Tier', subtitle: 'Business Critical (8 vCores)', status: 'active', icon: 'Database', color: '#7c3aed', provider: 'AZURE', details: { service: 'Azure SQL MI', highAvailability: 'Always On Availability Groups', failover: 'Automated Zone-redundant Failover' } } },
      { id: 'elasticache', type: 'cloudNode', position: { x: 820, y: 350 }, data: { title: 'Azure Cache for Redis', category: 'In-Memory Caching', subtitle: 'Premium Tier P1 Multi-Zone', status: 'active', icon: 'Cpu', color: '#ea580c', provider: 'AZURE', details: { service: 'Azure Cache for Redis', clustering: 'Enabled (2 Shards)', sla: '99.99% Availability SLA' } } },
      { id: 's3-datalake', type: 'cloudNode', position: { x: 1100, y: 350 }, data: { title: 'Azure Blob Storage', category: 'Storage & Archival', subtitle: 'Hot / Cool / Archive Lifecycle', status: 'active', icon: 'HardDrive', color: '#16a34a', provider: 'AZURE', details: { service: 'Azure Blob Storage', replication: 'GZRS (Geo-Zone-Redundant)', security: 'Customer Managed Key (Key Vault)' } } }
    ],
    edges: [
      { id: 'e1-2', source: 'user-traffic', target: 'aws-waf-alb', animated: true, style: { stroke: '#0078d4', strokeWidth: 2 } },
      { id: 'e2-3', source: 'onprem-dc', target: 'transit-gw', style: { stroke: '#f59e0b', strokeWidth: 2, strokeDasharray: '4,4' } },
      { id: 'e3-4', source: 'transit-gw', target: 'aws-waf-alb', style: { stroke: '#0078d4', strokeWidth: 2 } },
      { id: 'e4-5', source: 'aws-waf-alb', target: 'eks-cluster', animated: true, style: { stroke: '#10b981', strokeWidth: 2 } },
      { id: 'e5-6', source: 'eks-cluster', target: 'aurora-pg', animated: true, style: { stroke: '#0078d4', strokeWidth: 2 } },
      { id: 'e5-7', source: 'eks-cluster', target: 'elasticache', style: { stroke: '#ea580c', strokeWidth: 2 } },
      { id: 'e5-8', source: 'eks-cluster', target: 's3-datalake', style: { stroke: '#16a34a', strokeWidth: 2 } }
    ]
  },
  GCP: {
    id: 3,
    provider: 'GCP',
    architectureName: 'CloudSage Google Cloud Enterprise Regional Target Architecture',
    description: 'Recommended target topology generated from assessed workloads utilizing GKE Autopilot, Cloud SQL Enterprise Plus, and Global VPC.',
    primaryRegion: 'us-central1 (Iowa)',
    secondaryRegion: 'us-west1 (Oregon)',
    isMultiRegionDR: false,
    totalComputeCores: 40,
    totalRamGB: 224,
    totalStorageGB: 1950,
    primaryComputeService: 'Google Kubernetes Engine (GKE Autopilot) & Compute Engine',
    primaryDatabaseService: 'Cloud SQL Enterprise Plus & AlloyDB for PostgreSQL',
    primaryStorageService: 'Google Cloud Storage (Standard/Nearline) & Persistent Disk SSD',
    primaryNetworkService: 'GCP Global Shared VPC, Cloud Load Balancing & Interconnect',
    primarySecurityService: 'Google Cloud Armor WAF, Cloud KMS & Security Command Center',
    operationalComplexity: 'Low-Medium',
    estimatedMonthlyBaseline: 2510.00,
    nodes: [
      { id: 'user-traffic', type: 'cloudNode', position: { x: 50, y: 180 }, data: { title: 'Global Users & Clients', category: 'Edge Network', subtitle: 'Anycast Worldwide Traffic', status: 'active', icon: 'Users', color: '#4285f4', provider: 'GCP', details: { service: 'Cloud CDN + Cloud DNS', protocol: 'HTTP/3 & QUIC / TLS 1.3', ddosProtection: 'Google Cloud Armor Standard' } } },
      { id: 'onprem-dc', type: 'cloudNode', position: { x: 50, y: 380 }, data: { title: 'On-Premises Datacenter', category: 'Hybrid Connectivity', subtitle: 'Chicago Equinix CH1 & HQ', status: 'active', icon: 'Building2', color: '#f59e0b', provider: 'GCP', details: { service: 'Cloud Interconnect', bandwidth: '10 Gbps Dedicated Interconnect', backup: 'Cloud HA-VPN 99.99% SLA' } } },
      { id: 'transit-gw', type: 'cloudNode', position: { x: 300, y: 280 }, data: { title: 'Google Global VPC Backbone', category: 'Network Backbone', subtitle: 'Single Global VPC Mesh', status: 'active', icon: 'Network', color: '#ea4335', provider: 'GCP', details: { service: 'GCP Global Shared VPC', routing: 'Global Dynamic BGP Routing', networkServiceTier: 'Premium Tier Fiber Backbone' } } },
      { id: 'aws-waf-alb', type: 'cloudNode', position: { x: 550, y: 150 }, data: { title: 'Cloud Armor + External HTTPS LB', category: 'Ingress & Balancing', subtitle: 'Global Anycast IP Ingress', status: 'active', icon: 'ShieldCheck', color: '#34a853', provider: 'GCP', details: { service: 'Cloud Load Balancing', waf: 'Cloud Armor Adaptive Protection', ssl: 'Google Managed Certificates' } } },
      { id: 'eks-cluster', type: 'cloudNode', position: { x: 820, y: 150 }, data: { title: 'Google Kubernetes Engine (GKE)', category: 'Compute & Containers', subtitle: 'GKE Autopilot (e2-standard-4)', status: 'active', icon: 'Boxes', color: '#4285f4', provider: 'GCP', details: { service: 'GKE Autopilot', clusterType: 'Regional GKE Cluster (3 Zones)', management: 'Fully Automated Upgrades & Patching' } } },
      { id: 'aurora-pg', type: 'cloudNode', position: { x: 1100, y: 150 }, data: { title: 'Cloud SQL Enterprise Plus', category: 'Database Tier', subtitle: 'PostgreSQL 16 (db-custom-8-64)', status: 'active', icon: 'Database', color: '#fbbc05', provider: 'GCP', details: { service: 'Cloud SQL Enterprise Plus', highAvailability: 'Regional Multi-Zone HA', disk: 'Fast SSD Persistent Disk (Auto-grow)' } } },
      { id: 'elasticache', type: 'cloudNode', position: { x: 820, y: 350 }, data: { title: 'Cloud Memorystore Redis', category: 'In-Memory Caching', subtitle: 'Standard Tier High Availability', status: 'active', icon: 'Cpu', color: '#ea4335', provider: 'GCP', details: { service: 'Cloud Memorystore', replication: 'Primary + Read Replica (Multi-Zone)', failover: 'Automatic Failover < 30s' } } },
      { id: 's3-datalake', type: 'cloudNode', position: { x: 1100, y: 350 }, data: { title: 'Google Cloud Storage (GCS)', category: 'Storage & Archival', subtitle: 'Standard + Nearline Storage', status: 'active', icon: 'HardDrive', color: '#34a853', provider: 'GCP', details: { service: 'Cloud Storage', location: 'Dual-Region (nam4 US-Central/East)', lifecycle: 'Autoclass Intelligent Storage Tiering' } } }
    ],
    edges: [
      { id: 'e1-2', source: 'user-traffic', target: 'aws-waf-alb', animated: true, style: { stroke: '#4285f4', strokeWidth: 2 } },
      { id: 'e2-3', source: 'onprem-dc', target: 'transit-gw', style: { stroke: '#f59e0b', strokeWidth: 2, strokeDasharray: '4,4' } },
      { id: 'e3-4', source: 'transit-gw', target: 'aws-waf-alb', style: { stroke: '#ea4335', strokeWidth: 2 } },
      { id: 'e4-5', source: 'aws-waf-alb', target: 'eks-cluster', animated: true, style: { stroke: '#34a853', strokeWidth: 2 } },
      { id: 'e5-6', source: 'eks-cluster', target: 'aurora-pg', animated: true, style: { stroke: '#fbbc05', strokeWidth: 2 } },
      { id: 'e5-7', source: 'eks-cluster', target: 'elasticache', style: { stroke: '#ea4335', strokeWidth: 2 } },
      { id: 'e5-8', source: 'eks-cluster', target: 's3-datalake', style: { stroke: '#34a853', strokeWidth: 2 } }
    ]
  }
};

export const ArchitecturePage = () => {
  const { currentProject, showToast } = useProject();

  // Selected Cloud Provider
  const [selectedProvider, setSelectedProvider] = useState('AWS'); // AWS, AZURE, GCP
  const [architectureData, setArchitectureData] = useState(FALLBACK_BLUEPRINTS.AWS);
  const [isLoading, setIsLoading] = useState(false);
  const [backendOnline, setBackendOnline] = useState(false);

  // React Flow state
  const [nodes, setNodes, onNodesChange] = useNodesState(FALLBACK_BLUEPRINTS.AWS.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(FALLBACK_BLUEPRINTS.AWS.edges);
  const [selectedNodeData, setSelectedNodeData] = useState(FALLBACK_BLUEPRINTS.AWS.nodes[4].data);
  const [isMultiRegionDR, setIsMultiRegionDR] = useState(false);

  // Modals
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [comparisonData, setComparisonData] = useState(null);
  const [isAddComponentModalOpen, setIsAddComponentModalOpen] = useState(false);

  // Add Component Form
  const [newComponent, setNewComponent] = useState({
    title: 'Serverless Event Worker',
    category: 'Compute & Serverless',
    service: 'AWS Lambda SnapStart',
    subtitle: 'Event-driven worker tier',
    icon: 'Zap',
    color: '#8b5cf6',
  });

  const nodeTypes = useMemo(() => ({ cloudNode: CloudArchitectureNode }), []);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const onNodeClick = useCallback((event, node) => {
    setSelectedNodeData(node.data);
  }, []);

  // Fetch or generate architecture for current provider
  const loadArchitecture = useCallback(async (provider) => {
    setIsLoading(true);
    try {
      const data = await architectureApi.getArchitectureByProvider(provider);
      if (data) {
        setArchitectureData(data);
        setIsMultiRegionDR(Boolean(data.isMultiRegionDR));

        // Parse persisted nodes and edges
        if (data.nodesJson) {
          try {
            const parsedNodes = JSON.parse(data.nodesJson);
            setNodes(parsedNodes);
            if (parsedNodes.length > 0) {
              setSelectedNodeData(parsedNodes[0].data);
            }
          } catch (e) {
            console.error('Failed to parse nodesJson', e);
          }
        }
        if (data.edgesJson) {
          try {
            setEdges(JSON.parse(data.edgesJson));
          } catch (e) {
            console.error('Failed to parse edgesJson', e);
          }
        }
        setBackendOnline(true);
      }
    } catch (err) {
      console.warn('Backend architecture offline, using local provider blueprint:', err);
      setBackendOnline(false);
      const fallback = FALLBACK_BLUEPRINTS[provider] || FALLBACK_BLUEPRINTS.AWS;
      setArchitectureData(fallback);
      setNodes(fallback.nodes);
      setEdges(fallback.edges);
      setSelectedNodeData(fallback.nodes[4]?.data || fallback.nodes[0]?.data);
      setIsMultiRegionDR(Boolean(fallback.isMultiRegionDR));
    } finally {
      setIsLoading(false);
    }
  }, [setNodes, setEdges]);

  useEffect(() => {
    loadArchitecture(selectedProvider);
  }, [selectedProvider, loadArchitecture]);

  // Load comparison data
  const handleOpenComparison = async () => {
    setIsCompareModalOpen(true);
    try {
      const comparison = await architectureApi.getComparison();
      setComparisonData(comparison);
    } catch (err) {
      console.warn('Offline comparison mode:', err);
    }
  };

  // Switch Provider
  const handleSelectProvider = (prov) => {
    if (prov === selectedProvider) return;
    setSelectedProvider(prov);
    showToast(`Switched target cloud architecture to ${prov}.`);
  };

  // Regenerate Architecture from Inventory & Assessment
  const handleRegenerate = async () => {
    setIsLoading(true);
    try {
      if (backendOnline) {
        const regenerated = await architectureApi.generateArchitecture(selectedProvider);
        setArchitectureData(regenerated);
        if (regenerated.nodesJson) setNodes(JSON.parse(regenerated.nodesJson));
        if (regenerated.edgesJson) setEdges(JSON.parse(regenerated.edgesJson));
        showToast(`Regenerated ${selectedProvider} target architecture from inventory & 6Rs assessment.`);
      } else {
        const fallback = FALLBACK_BLUEPRINTS[selectedProvider];
        setArchitectureData(fallback);
        setNodes(fallback.nodes);
        setEdges(fallback.edges);
        showToast(`Re-applied baseline ${selectedProvider} architecture blueprint.`);
      }
    } catch (err) {
      showToast(`Regeneration failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle DR Multi-Region
  const handleToggleDR = async () => {
    const nextState = !isMultiRegionDR;
    setIsMultiRegionDR(nextState);

    try {
      if (backendOnline && architectureData?.id) {
        await architectureApi.updateArchitecture(architectureData.id, {
          isMultiRegionDR: nextState,
          secondaryRegion: nextState ? architectureData.secondaryRegion || 'us-west-2' : null,
        });
      }
      showToast(
        nextState
          ? `Secondary Region (${architectureData.secondaryRegion || 'Pilot Light'}) DR topology enabled.`
          : `Primary Region (${architectureData.primaryRegion}) active single-region topology.`
      );
    } catch (err) {
      showToast(`DR toggle failed: ${err.message}`);
    }
  };

  // Save Layout Changes
  const handleSaveLayout = async () => {
    try {
      if (backendOnline && architectureData?.id) {
        await architectureApi.updateArchitecture(architectureData.id, {
          nodesJson: JSON.stringify(nodes),
          edgesJson: JSON.stringify(edges),
        });
        showToast('Architecture layout coordinates saved to database.');
      } else {
        showToast('Canvas layout cached in local session.');
      }
    } catch (err) {
      showToast(`Save failed: ${err.message}`);
    }
  };

  // Add Component Node to Canvas
  const handleAddComponentSubmit = (e) => {
    e.preventDefault();
    const newId = `custom-node-${Date.now()}`;
    const newNode = {
      id: newId,
      type: 'cloudNode',
      position: { x: 550, y: 350 },
      data: {
        title: newComponent.title,
        category: newComponent.category,
        subtitle: newComponent.subtitle,
        status: 'active',
        icon: newComponent.icon,
        color: newComponent.color,
        provider: selectedProvider,
        details: {
          service: newComponent.service,
          type: 'User-Provisioned Cloud Component',
          environment: 'Production Tier',
        },
      },
    };

    setNodes((nds) => [...nds, newNode]);
    setIsAddComponentModalOpen(false);
    showToast(`Added component "${newComponent.title}" to architecture canvas.`);
  };

  // Remove Selected Component
  const handleRemoveSelectedNode = () => {
    if (!selectedNodeData) return;
    const selectedTitle = selectedNodeData.title;
    setNodes((nds) => nds.filter((n) => n.data.title !== selectedTitle));
    setSelectedNodeData(null);
    showToast(`Removed component "${selectedTitle}" from canvas.`);
  };

  // Export Diagram
  const handleExportDiagram = () => {
    const jsonStr = JSON.stringify({
      provider: selectedProvider,
      architectureName: architectureData.architectureName,
      primaryRegion: architectureData.primaryRegion,
      secondaryRegion: architectureData.secondaryRegion,
      isMultiRegionDR,
      totalComputeCores: architectureData.totalComputeCores,
      totalRamGB: architectureData.totalRamGB,
      totalStorageGB: architectureData.totalStorageGB,
      estimatedMonthlyBaseline: architectureData.estimatedMonthlyBaseline,
      nodes,
      edges,
    }, null, 2);

    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CloudSage_${selectedProvider}_Target_Architecture.json`;
    link.click();
    showToast(`Exported ${selectedProvider} target architecture blueprint JSON.`);
  };

  return (
    <div className="space-y-6">
      {/* Backend Status Notification Banner */}
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
                <strong>Target Architecture Designer API Online:</strong> Persisted topologies managed via{' '}
                <code className="bg-emerald-100 text-emerald-900 px-1 py-0.5 rounded font-mono text-[11px]">
                  http://localhost:8080/api/architectures
                </code>{' '}
                with MySQL database persistence.
              </p>
            ) : (
              <p className="font-medium">
                <strong>Spring Boot Backend Offline:</strong> Running in client-side design mode. Start backend with{' '}
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
            onClick={() => loadArchitecture(selectedProvider)}
            disabled={isLoading}
          >
            {isLoading ? 'Syncing...' : 'Sync Provider'}
          </Button>
        </div>
      </div>

      {/* Cloud Provider Selection Cards */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Select Cloud Provider
          </h2>
          <span className="text-[11px] text-slate-400">
            Select AWS, Azure, or GCP to view recommended cloud native architecture
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* AWS Card */}
          <div
            onClick={() => handleSelectProvider('AWS')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              selectedProvider === 'AWS'
                ? 'bg-white shadow-md border-amber-500 ring-2 ring-amber-500/20'
                : 'bg-white hover:border-slate-300 hover:shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                AWS • Amazon Web Services
              </span>
              <span className="text-[10px] font-mono text-slate-500">us-east-1</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">AWS Well-Architected Framework</h3>
            <p className="text-xs text-slate-500 mt-1">
              Amazon EKS, Aurora PostgreSQL Multi-AZ, S3 Lakehouse, Transit Gateway.
            </p>
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Compute / Sizing:</span>
              <span className="font-semibold text-slate-800">m6i.xlarge (Karpenter)</span>
            </div>
          </div>

          {/* Azure Card */}
          <div
            onClick={() => handleSelectProvider('AZURE')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              selectedProvider === 'AZURE'
                ? 'bg-white shadow-md border-blue-600 ring-2 ring-blue-600/20'
                : 'bg-white hover:border-slate-300 hover:shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                AZURE • Microsoft Azure
              </span>
              <span className="text-[10px] font-mono text-slate-500">eastus</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">Azure Cloud Adoption Framework</h3>
            <p className="text-xs text-slate-500 mt-1">
              Azure AKS, Azure SQL Managed Instance, Blob Storage, Virtual WAN Hub.
            </p>
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Compute / Sizing:</span>
              <span className="font-semibold text-slate-800">Standard_D4s_v5 (KEDA)</span>
            </div>
          </div>

          {/* GCP Card */}
          <div
            onClick={() => handleSelectProvider('GCP')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              selectedProvider === 'GCP'
                ? 'bg-white shadow-md border-emerald-500 ring-2 ring-emerald-500/20'
                : 'bg-white hover:border-slate-300 hover:shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                GCP • Google Cloud Platform
              </span>
              <span className="text-[10px] font-mono text-slate-500">us-central1</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">Google Cloud Architecture Framework</h3>
            <p className="text-xs text-slate-500 mt-1">
              GKE Autopilot, Cloud SQL Enterprise Plus, Cloud Storage, Global Shared VPC.
            </p>
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Compute / Sizing:</span>
              <span className="font-semibold text-slate-800">e2-standard-4 (Autopilot)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Toolbar Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-blue-600 mb-1">
            Target Cloud Topology • Stage 5
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>{architectureData.architectureName}</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {architectureData.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={GitCompare}
            onClick={handleOpenComparison}
          >
            Compare Providers
          </Button>

          <Button
            variant={isMultiRegionDR ? 'primary' : 'secondary'}
            size="sm"
            onClick={handleToggleDR}
          >
            {isMultiRegionDR ? 'DR Multi-Region: ON' : 'Enable Multi-Region DR'}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            icon={Plus}
            onClick={() => setIsAddComponentModalOpen(true)}
          >
            Add Component
          </Button>

          <Button
            variant="secondary"
            size="sm"
            icon={Save}
            onClick={handleSaveLayout}
          >
            Save Layout
          </Button>

          <Button
            variant="secondary"
            size="sm"
            icon={Sparkles}
            onClick={handleRegenerate}
            disabled={isLoading}
          >
            Regenerate
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={Download}
            onClick={handleExportDiagram}
          >
            Export JSON
          </Button>
        </div>
      </div>

      {/* Stage 6 Cost Preparation Sizing Bar */}
      <div className="p-3.5 bg-slate-900 text-white rounded-xl shadow-md border border-slate-800 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-400 shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">Total Compute Sizing</span>
              <span className="font-bold text-white text-sm">{architectureData.totalComputeCores} Cores ({architectureData.totalRamGB} GB RAM)</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">Total Storage Capacity</span>
              <span className="font-bold text-white text-sm">{formatStorage(architectureData.totalStorageGB)} High-Performance Tier</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-purple-400 shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">Database Architecture</span>
              <span className="font-bold text-white text-sm truncate max-w-[200px]" title={architectureData.primaryDatabaseService}>
                {architectureData.primaryDatabaseService}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">Operational Complexity</span>
              <span className="font-bold text-amber-400 text-sm">{architectureData.operationalComplexity} Complexity</span>
            </div>
          </div>
        </div>

        <div className="pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800 text-left lg:text-right shrink-0">
          <span className="text-[10px] uppercase font-semibold text-slate-400 block">
            Baseline Sizing Estimate (Stage 6 FinOps Prep)
          </span>
          <span className="text-lg font-extrabold text-emerald-400">
            {formatCurrency(architectureData.estimatedMonthlyBaseline || 2640.0)}/mo
          </span>
          <span className="text-[10px] text-slate-400 block">
            *Preliminary compute/storage baseline; live rates estimated in Stage 6
          </span>
        </div>
      </div>

      {/* Main Interactive React Flow Canvas and Details Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Canvas Area (8 cols) */}
        <div className="lg:col-span-8 bg-slate-50 rounded-xl border border-slate-200 overflow-hidden shadow-xs flex flex-col h-[600px] relative">
          <div className="px-4 py-2 bg-white border-b border-slate-200 flex items-center justify-between text-xs z-10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-slate-800">
                {selectedProvider} Interactive Architecture Canvas
              </span>
              <Badge variant="blue" size="xs">
                {architectureData.primaryRegion}
              </Badge>
              {isMultiRegionDR && (
                <Badge variant="purple" size="xs">
                  DR: {architectureData.secondaryRegion}
                </Badge>
              )}
            </div>
            <div className="text-[11px] text-slate-500 flex items-center gap-2">
              <span>Zoom & Drag Enabled</span>
              <span>•</span>
              <span className="text-blue-600 font-medium">Click node to inspect service specs</span>
            </div>
          </div>

          <div className="flex-1 w-full h-full">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              nodeTypes={nodeTypes}
              fitView
              attributionPosition="bottom-left"
            >
              <Controls />
              <Background color="#cbd5e1" gap={16} size={1} />
              <MiniMap
                nodeColor={(n) => n.data.color || '#2563eb'}
                maskColor="rgba(241, 245, 249, 0.7)"
                style={{ height: 100, width: 140 }}
              />
            </ReactFlow>
          </div>
        </div>

        {/* Selected Service Information Panel (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <Card
            title={selectedNodeData ? selectedNodeData.title : 'Service Configuration'}
            subtitle={selectedNodeData ? `${selectedNodeData.category} • ${selectedNodeData.provider || selectedProvider}` : 'Click any component on canvas to inspect parameters'}
            action={
              selectedNodeData && (
                <Button
                  variant="ghost"
                  size="xs"
                  icon={Trash2}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleRemoveSelectedNode}
                  title="Remove component from architecture canvas"
                >
                  Remove
                </Button>
              )
            }
          >
            {selectedNodeData ? (
              <div className="space-y-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-slate-400 uppercase font-semibold text-[10px]">Managed Cloud Service</span>
                    <Badge variant="blue" size="xs">{selectedNodeData.provider || selectedProvider}</Badge>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    {selectedNodeData.details?.service || selectedNodeData.title}
                  </h4>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    {selectedNodeData.subtitle}
                  </p>
                </div>

                <div className="space-y-2">
                  <h5 className="font-semibold text-slate-700 text-[11px] uppercase tracking-wider">
                    Technical Specifications
                  </h5>
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg bg-white overflow-hidden">
                    {Object.entries(selectedNodeData.details || {}).map(([key, val]) => (
                      <div key={key} className="p-2.5 flex items-center justify-between text-xs">
                        <span className="text-slate-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <span className="font-mono font-medium text-slate-800 text-[11px] text-right truncate max-w-[180px]">
                          {String(val)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 text-blue-900 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Well-Architected Guardrails</span>
                  </div>
                  <p className="text-[11px] text-blue-800 leading-relaxed">
                    Automated encryption at rest with Customer Managed Keys (KMS/Key Vault). Multi-AZ active availability zone distribution with automated health check failovers.
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 text-xs">
                <Cloud className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <p>Click on any node in the architecture canvas to inspect cloud service specifications, subnet placements, and encryption policies.</p>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Multi-Cloud Architecture Comparison Modal */}
      {isCompareModalOpen && (
        <Modal
          isOpen={isCompareModalOpen}
          onClose={() => setIsCompareModalOpen(false)}
          title="Multi-Cloud Target Architecture Comparison"
          subtitle="Compare recommended architectures and service equivalents across AWS, Microsoft Azure, and Google Cloud"
          maxWidth="max-w-5xl"
          footer={
            <Button variant="primary" size="sm" onClick={() => setIsCompareModalOpen(false)}>
              Close Comparison
            </Button>
          }
        >
          <div className="space-y-6 text-xs">
            {/* Top 3 Provider Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-900 text-sm">Amazon Web Services</span>
                  <Badge variant="amber" size="xs">AWS</Badge>
                </div>
                <div className="space-y-1 text-slate-700 text-xs">
                  <div><strong>Primary Region:</strong> us-east-1 (N. Virginia)</div>
                  <div><strong>Compute:</strong> Amazon EKS + EC2 (Nitro)</div>
                  <div><strong>Database:</strong> Amazon Aurora PostgreSQL (Multi-AZ)</div>
                  <div><strong>Storage:</strong> S3 Intelligent-Tiering + EBS gp3</div>
                  <div><strong>Network:</strong> Transit Gateway + Dual-AZ VPC</div>
                  <div><strong>DR Strategy:</strong> Pilot light in us-west-2</div>
                  <div className="pt-2 border-t border-amber-200 text-emerald-700 font-bold">
                    Est. Baseline: $2,640.00/mo
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-900 text-sm">Microsoft Azure</span>
                  <Badge variant="blue" size="xs">AZURE</Badge>
                </div>
                <div className="space-y-1 text-slate-700 text-xs">
                  <div><strong>Primary Region:</strong> eastus (East US)</div>
                  <div><strong>Compute:</strong> Azure AKS + Virtual Machines</div>
                  <div><strong>Database:</strong> Azure SQL Managed Instance</div>
                  <div><strong>Storage:</strong> Azure Blob Storage (GZRS) + SSD</div>
                  <div><strong>Network:</strong> Virtual WAN Hub + App Gateway v2</div>
                  <div><strong>DR Strategy:</strong> Zone-redundant paired region in westus2</div>
                  <div className="pt-2 border-t border-blue-200 text-emerald-700 font-bold">
                    Est. Baseline: $2,720.00/mo
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-900 text-sm">Google Cloud Platform</span>
                  <Badge variant="emerald" size="xs">GCP</Badge>
                </div>
                <div className="space-y-1 text-slate-700 text-xs">
                  <div><strong>Primary Region:</strong> us-central1 (Iowa)</div>
                  <div><strong>Compute:</strong> GKE Autopilot + Compute Engine</div>
                  <div><strong>Database:</strong> Cloud SQL Enterprise Plus / AlloyDB</div>
                  <div><strong>Storage:</strong> Cloud Storage Dual-Region + Persistent Disk</div>
                  <div><strong>Network:</strong> Global Shared VPC + Cloud Armor</div>
                  <div><strong>DR Strategy:</strong> Cross-region failover to us-west1</div>
                  <div className="pt-2 border-t border-emerald-200 text-emerald-700 font-bold">
                    Est. Baseline: $2,510.00/mo
                  </div>
                </div>
              </div>
            </div>

            {/* Deep-Dive Service Mapping Table */}
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-2">
                Core Cloud Service Mapping Matrix
              </h4>
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs divide-y divide-slate-200">
                  <thead className="bg-slate-50 text-[11px] uppercase font-semibold text-slate-600">
                    <tr>
                      <th className="py-2.5 px-3">Service Category</th>
                      <th className="py-2.5 px-3 text-amber-900">AWS Equivalent</th>
                      <th className="py-2.5 px-3 text-blue-900">Azure Equivalent</th>
                      <th className="py-2.5 px-3 text-emerald-900">GCP Equivalent</th>
                      <th className="py-2.5 px-3">Architectural Difference</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {(comparisonData?.serviceMappings || [
                      { category: 'Virtual Machines', aws: 'Amazon EC2 (m6i/c6i)', azure: 'Azure Virtual Machines (D-series)', gcp: 'Google Compute Engine (n2/c2)', diff: 'AWS Nitro hypervisor vs Azure Hyper-V vs GCP KVM with custom core/RAM flexibility.' },
                      { category: 'Kubernetes', aws: 'Amazon EKS (Karpenter)', azure: 'Azure AKS (Virtual Nodes)', gcp: 'Google GKE (Autopilot)', diff: 'GKE provides the most mature automated control plane management; EKS offers deepest IAM integration via IRSA.' },
                      { category: 'Serverless Functions', aws: 'AWS Lambda (SnapStart)', azure: 'Azure Functions (Consumption)', gcp: 'Google Cloud Run / Cloud Functions', diff: 'Lambda features broadest event sources; GCP Cloud Run supports full containers with HTTP/2.' },
                      { category: 'Relational Database', aws: 'Amazon Aurora Multi-AZ', azure: 'Azure SQL Managed Instance', gcp: 'Cloud SQL Enterprise Plus', diff: 'Aurora features 6-way storage replication across 3 AZs; Azure SQL MI guarantees near-100% T-SQL compatibility.' },
                      { category: 'Object Storage', aws: 'Amazon S3 (Intelligent-Tiering)', azure: 'Azure Blob Storage (Hot/Cool)', gcp: 'Google Cloud Storage (Autoclass)', diff: 'All providers feature 11 9s durability with automated cold archival transition policies.' },
                      { category: 'Load Balancing & WAF', aws: 'AWS WAF v2 + Public ALB', azure: 'Azure App Gateway v2 + WAF', gcp: 'Cloud Armor + Global HTTPS LB', diff: 'GCP provides single Anycast IP globally; AWS and Azure use regional multi-AZ endpoints.' },
                      { category: 'Key Management', aws: 'AWS KMS (FIPS 140-3)', azure: 'Azure Key Vault HSM', gcp: 'Google Cloud KMS', diff: 'Hardware security module (HSM) backed envelope encryption native across all cloud services.' }
                    ]).map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60">
                        <td className="py-2.5 px-3 font-semibold text-slate-900">{row.category}</td>
                        <td className="py-2.5 px-3 font-mono text-[11px] text-amber-800">{row.awsService || row.aws}</td>
                        <td className="py-2.5 px-3 font-mono text-[11px] text-blue-800">{row.azureService || row.azure}</td>
                        <td className="py-2.5 px-3 font-mono text-[11px] text-emerald-800">{row.gcpService || row.gcp}</td>
                        <td className="py-2.5 px-3 text-slate-500 text-[11px] leading-relaxed">{row.architecturalDifference || row.diff}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Component Modal */}
      {isAddComponentModalOpen && (
        <Modal
          isOpen={isAddComponentModalOpen}
          onClose={() => setIsAddComponentModalOpen(false)}
          title={`Add Component to ${selectedProvider} Architecture Canvas`}
          subtitle="Provision an additional compute, database, cache, or security node"
          maxWidth="max-w-md"
          footer={
            <>
              <Button variant="secondary" size="sm" onClick={() => setIsAddComponentModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleAddComponentSubmit}>
                Place on Canvas
              </Button>
            </>
          }
        >
          <form onSubmit={handleAddComponentSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Component Title</label>
              <input
                type="text"
                value={newComponent.title}
                onChange={(e) => setNewComponent({ ...newComponent, title: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category & Tier</label>
              <select
                value={newComponent.category}
                onChange={(e) => setNewComponent({ ...newComponent, category: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Compute & Containers">Compute & Containers</option>
                <option value="Compute & Serverless">Compute & Serverless</option>
                <option value="Database Tier">Database Tier</option>
                <option value="In-Memory Caching">In-Memory Caching</option>
                <option value="Storage & Archival">Storage & Archival</option>
                <option value="Security & Compliance">Security & Compliance</option>
                <option value="Ingress & Balancing">Ingress & Balancing</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Cloud Service</label>
              <input
                type="text"
                value={newComponent.service}
                onChange={(e) => setNewComponent({ ...newComponent, service: e.target.value })}
                placeholder={selectedProvider === 'AWS' ? 'e.g. AWS Lambda / Amazon SQS' : selectedProvider === 'AZURE' ? 'e.g. Azure Functions' : 'e.g. Cloud Run'}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Subtitle / Sizing Spec</label>
              <input
                type="text"
                value={newComponent.subtitle}
                onChange={(e) => setNewComponent({ ...newComponent, subtitle: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
