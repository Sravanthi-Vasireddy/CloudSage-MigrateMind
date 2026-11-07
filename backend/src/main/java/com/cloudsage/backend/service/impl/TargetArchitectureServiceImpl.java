package com.cloudsage.backend.service.impl;

import com.cloudsage.backend.dto.ArchitectureComparisonDto;
import com.cloudsage.backend.dto.ArchitectureModificationDto;
import com.cloudsage.backend.dto.ArchitectureResponseDto;
import com.cloudsage.backend.entity.Infrastructure;
import com.cloudsage.backend.entity.TargetArchitecture;
import com.cloudsage.backend.exception.ResourceNotFoundException;
import com.cloudsage.backend.repository.InfrastructureRepository;
import com.cloudsage.backend.repository.TargetArchitectureRepository;
import com.cloudsage.backend.repository.WorkloadAssessmentRepository;
import com.cloudsage.backend.service.TargetArchitectureService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class TargetArchitectureServiceImpl implements TargetArchitectureService {

    private final TargetArchitectureRepository architectureRepository;
    private final InfrastructureRepository infrastructureRepository;
    private final WorkloadAssessmentRepository assessmentRepository;

    public TargetArchitectureServiceImpl(TargetArchitectureRepository architectureRepository,
                                         InfrastructureRepository infrastructureRepository,
                                         WorkloadAssessmentRepository assessmentRepository) {
        this.architectureRepository = architectureRepository;
        this.infrastructureRepository = infrastructureRepository;
        this.assessmentRepository = assessmentRepository;
    }

    @Override
    public ArchitectureResponseDto generateArchitecture(String rawProvider) {
        String provider = (rawProvider == null ? "AWS" : rawProvider.trim().toUpperCase());
        if (!Arrays.asList("AWS", "AZURE", "GCP").contains(provider)) {
            provider = "AWS";
        }

        List<Infrastructure> inventory = infrastructureRepository.findAll();

        int totalCores = 0;
        int totalRam = 0;
        int totalStorage = 0;

        for (Infrastructure item : inventory) {
            totalCores += item.getCpuCores() != null ? item.getCpuCores() : 4;
            totalRam += item.getRamGB() != null ? item.getRamGB() : 16;
            totalStorage += item.getStorageGB() != null ? item.getStorageGB() : 250;
        }

        // Defaults if inventory is empty
        if (totalCores == 0) totalCores = 40;
        if (totalRam == 0) totalRam = 224;
        if (totalStorage == 0) totalStorage = 1950;

        TargetArchitecture arch = architectureRepository.findByProvider(provider)
                .orElse(new TargetArchitecture());

        arch.setProvider(provider);
        arch.setTotalComputeCores(totalCores);
        arch.setTotalRamGB(totalRam);
        arch.setTotalStorageGB(totalStorage);

        populateProviderSpecifics(arch, provider, totalCores, totalStorage);

        TargetArchitecture saved = architectureRepository.save(arch);
        return ArchitectureResponseDto.fromEntity(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ArchitectureResponseDto> getAllArchitectures() {
        return architectureRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(ArchitectureResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ArchitectureResponseDto getArchitectureById(Long id) {
        TargetArchitecture arch = architectureRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TargetArchitecture", "id", id));
        return ArchitectureResponseDto.fromEntity(arch);
    }

    @Override
    public ArchitectureResponseDto getArchitectureByProvider(String rawProvider) {
        String provider = (rawProvider == null ? "AWS" : rawProvider.trim().toUpperCase());
        Optional<TargetArchitecture> existing = architectureRepository.findByProvider(provider);
        if (existing.isPresent()) {
            return ArchitectureResponseDto.fromEntity(existing.get());
        }
        // Auto-generate if not yet generated
        return generateArchitecture(provider);
    }

    @Override
    public ArchitectureResponseDto updateArchitecture(Long id, ArchitectureModificationDto dto) {
        TargetArchitecture arch = architectureRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TargetArchitecture", "id", id));

        if (dto.getIsMultiRegionDR() != null) {
            arch.setIsMultiRegionDR(dto.getIsMultiRegionDR());
        }
        if (dto.getSecondaryRegion() != null) {
            arch.setSecondaryRegion(dto.getSecondaryRegion());
        }
        if (dto.getNodesJson() != null) {
            arch.setNodesJson(dto.getNodesJson());
        }
        if (dto.getEdgesJson() != null) {
            arch.setEdgesJson(dto.getEdgesJson());
        }
        if (dto.getDescription() != null) {
            arch.setDescription(dto.getDescription());
        }

        TargetArchitecture saved = architectureRepository.save(arch);
        return ArchitectureResponseDto.fromEntity(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public ArchitectureComparisonDto getArchitectureComparison() {
        ArchitectureComparisonDto comparison = new ArchitectureComparisonDto();

        // 1. Service Mappings
        List<ArchitectureComparisonDto.ServiceMappingItem> mappings = new ArrayList<>();
        mappings.add(new ArchitectureComparisonDto.ServiceMappingItem(
                "Compute (Virtual Machines)",
                "Amazon EC2 (Nitro System, m6i/c6i/r6i)",
                "Azure Virtual Machines (D-series / E-series v5)",
                "Google Compute Engine (n2 / c2 / e2 instances)",
                "AWS provides broadest chip diversity (x86 + Graviton ARM); Azure integrates tightly with Windows Server licensing; GCP offers custom core/RAM ratios.",
                "Low"
        ));
        mappings.add(new ArchitectureComparisonDto.ServiceMappingItem(
                "Containers & Kubernetes",
                "Amazon EKS (with Karpenter just-in-time autoscaling)",
                "Azure Kubernetes Service (AKS with Virtual Nodes / KEDA)",
                "Google Kubernetes Engine (GKE Autopilot / Enterprise)",
                "GKE provides the most mature automated control plane management; EKS offers deepest IAM integration via IRSA; AKS provides seamless Visual Studio & GitHub Actions CI/CD.",
                "Medium"
        ));
        mappings.add(new ArchitectureComparisonDto.ServiceMappingItem(
                "Serverless Functions",
                "AWS Lambda (SnapStart, 10GB RAM, EventBridge)",
                "Azure Functions (Consumption / Premium Plan, Durable Functions)",
                "Google Cloud Functions / Cloud Run (concurrency up to 1000)",
                "AWS Lambda has widest event-driven integrations; Azure excels in stateful workflows with Durable Functions; GCP Cloud Run allows containerized serverless HTTP APIs.",
                "Low"
        ));
        mappings.add(new ArchitectureComparisonDto.ServiceMappingItem(
                "Managed Relational Database",
                "Amazon Aurora Multi-AZ & RDS (PostgreSQL/MySQL/Oracle)",
                "Azure SQL Database Managed Instance & Azure Flexible Server",
                "Google Cloud SQL Enterprise Plus & AlloyDB for PostgreSQL",
                "Aurora features 6-way storage replication across 3 AZs; Azure SQL MI guarantees near-100% T-SQL compatibility; AlloyDB delivers 4x faster analytics queries.",
                "Medium"
        ));
        mappings.add(new ArchitectureComparisonDto.ServiceMappingItem(
                "Object Storage & Archival",
                "Amazon S3 (Standard, Intelligent-Tiering, Glacier Deep Archive)",
                "Azure Blob Storage (Hot, Cool, Cold, Archive Tiers)",
                "Google Cloud Storage (Standard, Nearline, Coldline, Archive)",
                "S3 provides 11 9s durability with automated Intelligent-Tiering; Azure Blob supports hierarchical namespace for big data; GCP features uniform worldwide bucket naming.",
                "Low"
        ));
        mappings.add(new ArchitectureComparisonDto.ServiceMappingItem(
                "Virtual Networking & Ingress",
                "AWS VPC, Transit Gateway, Route 53, ALB/NLB",
                "Azure Virtual Network (VNet), Virtual WAN, App Gateway v2",
                "Google Cloud VPC (Global Subnets), Cloud Load Balancing",
                "GCP offers single global VPC spanning all regions; AWS Transit Gateway provides hub-spoke routing; Azure Application Gateway includes built-in URL routing & SSL offloading.",
                "Medium"
        ));
        mappings.add(new ArchitectureComparisonDto.ServiceMappingItem(
                "Security & Key Management",
                "AWS WAF v2, AWS KMS (FIPS 140-3), GuardDuty, IAM",
                "Azure Firewall Premium, Key Vault HSM, Microsoft Entra ID",
                "Google Cloud Armor, Cloud KMS, Security Command Center",
                "AWS KMS integrates natively with all AWS services; Entra ID is the enterprise gold standard for SSO; Cloud Armor leverages Google's global anti-DDoS network.",
                "Medium"
        ));
        comparison.setServiceMappings(mappings);

        // 2. Provider Summaries
        List<ArchitectureComparisonDto.ProviderSummaryItem> summaries = new ArrayList<>();
        summaries.add(new ArchitectureComparisonDto.ProviderSummaryItem(
                "AWS",
                "us-east-1 (N. Virginia)",
                "Amazon EKS (3-12 m6i.xlarge) + EC2",
                "Amazon Aurora PostgreSQL Multi-AZ (1 Primary, 1 Replica)",
                "Amazon S3 Lakehouse (Multi-Tier) + EBS gp3 SSD",
                "AWS Transit Gateway + Dual-AZ VPC with NAT Gateways",
                "Multi-AZ active/active with pilot light in us-west-2 (Oregon)",
                2640.00,
                "Medium"
        ));
        summaries.add(new ArchitectureComparisonDto.ProviderSummaryItem(
                "Azure",
                "eastus (East US)",
                "Azure AKS (Standard_D4s_v5) + Azure VMs",
                "Azure SQL Database Managed Instance (General Purpose / BC)",
                "Azure Blob Storage (Hot/Cool) + Managed Disks Premium SSD",
                "Azure Hub-Spoke VNet + Application Gateway v2 WAF",
                "Multi-Zone availability with secondary region in westus2",
                2720.00,
                "Medium"
        ));
        summaries.add(new ArchitectureComparisonDto.ProviderSummaryItem(
                "GCP",
                "us-central1 (Iowa)",
                "GKE Autopilot (e2-standard-4) + Compute Engine",
                "Cloud SQL Enterprise Plus for PostgreSQL / MySQL",
                "Google Cloud Storage Standard + Persistent Disk Extreme",
                "GCP Global VPC + Cloud Load Balancing + Cloud Armor",
                "Regional HA across 3 zones with cross-region sync to us-west1",
                2510.00,
                "Low-Medium"
        ));
        comparison.setProviderSummaries(summaries);

        return comparison;
    }

    @Override
    public void deleteArchitecture(Long id) {
        TargetArchitecture arch = architectureRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TargetArchitecture", "id", id));
        architectureRepository.delete(arch);
    }

    /**
     * Populate specific provider metadata, service names, React Flow topology JSON, and preliminary specs.
     */
    private void populateProviderSpecifics(TargetArchitecture arch, String provider, int cores, int storage) {
        switch (provider) {
            case "AZURE":
                arch.setArchitectureName("CloudSage Azure Enterprise Multi-Zone Target Architecture");
                arch.setDescription("Recommended target topology generated from assessed workloads utilizing AKS, Azure SQL Managed Instance, and Azure Virtual Network.");
                arch.setPrimaryRegion("eastus (East US)");
                arch.setSecondaryRegion("westus2 (West US 2)");
                arch.setPrimaryComputeService("Azure Kubernetes Service (AKS) & Azure VMs (D-series v5)");
                arch.setPrimaryDatabaseService("Azure SQL Database Managed Instance & PostgreSQL Flexible Server");
                arch.setPrimaryStorageService("Azure Blob Storage (Hot/Cool/Archive) & Premium SSD");
                arch.setPrimaryNetworkService("Azure Virtual Network (VNet) Hub-Spoke & App Gateway v2");
                arch.setPrimarySecurityService("Azure Firewall Premium, Key Vault HSM & Microsoft Entra ID");
                arch.setOperationalComplexity("Medium");
                arch.setEstimatedMonthlyBaseline(Math.round((cores * 33.5 + storage * 0.11 + 940.0) * 100.0) / 100.0);
                arch.setNodesJson(buildAzureNodesJson());
                arch.setEdgesJson(buildStandardEdgesJson());
                arch.setSpecsJson(buildAzureSpecsJson(cores, storage));
                break;

            case "GCP":
                arch.setArchitectureName("CloudSage Google Cloud Enterprise Regional Target Architecture");
                arch.setDescription("Recommended target topology generated from assessed workloads utilizing GKE Autopilot, Cloud SQL Enterprise Plus, and Global VPC.");
                arch.setPrimaryRegion("us-central1 (Iowa)");
                arch.setSecondaryRegion("us-west1 (Oregon)");
                arch.setPrimaryComputeService("Google Kubernetes Engine (GKE Autopilot) & Compute Engine");
                arch.setPrimaryDatabaseService("Cloud SQL Enterprise Plus & AlloyDB for PostgreSQL");
                arch.setPrimaryStorageService("Google Cloud Storage (Standard/Nearline) & Persistent Disk SSD");
                arch.setPrimaryNetworkService("GCP Global Shared VPC, Cloud Load Balancing & Interconnect");
                arch.setPrimarySecurityService("Google Cloud Armor WAF, Cloud KMS & Security Command Center");
                arch.setOperationalComplexity("Low-Medium");
                arch.setEstimatedMonthlyBaseline(Math.round((cores * 31.0 + storage * 0.095 + 910.0) * 100.0) / 100.0);
                arch.setNodesJson(buildGcpNodesJson());
                arch.setEdgesJson(buildStandardEdgesJson());
                arch.setSpecsJson(buildGcpSpecsJson(cores, storage));
                break;

            case "AWS":
            default:
                arch.setArchitectureName("CloudSage AWS Enterprise Multi-AZ Target Architecture");
                arch.setDescription("Recommended target topology generated from assessed workloads utilizing Amazon EKS, Aurora PostgreSQL Multi-AZ, and Transit Gateway.");
                arch.setPrimaryRegion("us-east-1 (N. Virginia)");
                arch.setSecondaryRegion("us-west-2 (Oregon)");
                arch.setPrimaryComputeService("Amazon EKS (Karpenter auto-scaling) & EC2 (m6i/c6i)");
                arch.setPrimaryDatabaseService("Amazon Aurora PostgreSQL Multi-AZ & RDS Custom");
                arch.setPrimaryStorageService("Amazon S3 Lakehouse & EBS gp3 Volume Tier");
                arch.setPrimaryNetworkService("AWS Transit Gateway, Dual-AZ VPC & Direct Connect");
                arch.setPrimarySecurityService("AWS WAF v2, AWS KMS CMK, IAM OIDC & GuardDuty");
                arch.setOperationalComplexity("Medium");
                arch.setEstimatedMonthlyBaseline(Math.round((cores * 32.0 + storage * 0.10 + 980.0) * 100.0) / 100.0);
                arch.setNodesJson(buildAwsNodesJson());
                arch.setEdgesJson(buildStandardEdgesJson());
                arch.setSpecsJson(buildAwsSpecsJson(cores, storage));
                break;
        }
    }

    private String buildAwsNodesJson() {
        return "[" +
                "{\"id\":\"user-traffic\",\"type\":\"cloudNode\",\"position\":{\"x\":50,\"y\":180},\"data\":{\"title\":\"Global End Users\",\"category\":\"Edge Network\",\"subtitle\":\"Public HTTPS Clients & Mobile Apps\",\"status\":\"active\",\"icon\":\"Users\",\"color\":\"#3b82f6\",\"provider\":\"AWS\",\"details\":{\"service\":\"Amazon Route 53 + CloudFront\",\"protocol\":\"TLS 1.3 / HTTPS\",\"ddosProtection\":\"AWS Shield Standard\"}}}," +
                "{\"id\":\"onprem-dc\",\"type\":\"cloudNode\",\"position\":{\"x\":50,\"y\":380},\"data\":{\"title\":\"On-Premises Datacenter\",\"category\":\"Hybrid Connectivity\",\"subtitle\":\"Chicago Equinix CH1 & HQ\",\"status\":\"active\",\"icon\":\"Building2\",\"color\":\"#f59e0b\",\"provider\":\"AWS\",\"details\":{\"service\":\"AWS Direct Connect\",\"bandwidth\":\"10 Gbps Dedicated\",\"backup\":\"IPsec VPN Tunnel\"}}}," +
                "{\"id\":\"transit-gw\",\"type\":\"cloudNode\",\"position\":{\"x\":300,\"y\":280},\"data\":{\"title\":\"AWS Transit Gateway\",\"category\":\"Network Backbone\",\"subtitle\":\"Hub & Spoke Router (tgw-08a9f2)\",\"status\":\"active\",\"icon\":\"Network\",\"color\":\"#6366f1\",\"provider\":\"AWS\",\"details\":{\"service\":\"AWS Transit Gateway\",\"asn\":\"64512\",\"vpcAttachments\":\"4 VPCs Attached\"}}}," +
                "{\"id\":\"aws-waf-alb\",\"type\":\"cloudNode\",\"position\":{\"x\":550,\"y\":150},\"data\":{\"title\":\"AWS WAF v2 + Public ALB\",\"category\":\"Ingress & Balancing\",\"subtitle\":\"Dual-AZ Ingress (10.100.1.0/24)\",\"status\":\"active\",\"icon\":\"ShieldCheck\",\"color\":\"#10b981\",\"provider\":\"AWS\",\"details\":{\"service\":\"Application Load Balancer\",\"scheme\":\"internet-facing\",\"wafRules\":\"OWASP Core + IP Reputation\"}}}," +
                "{\"id\":\"eks-cluster\",\"type\":\"cloudNode\",\"position\":{\"x\":820,\"y\":150},\"data\":{\"title\":\"Amazon EKS App Tier\",\"category\":\"Compute & Containers\",\"subtitle\":\"Kubernetes v1.30 (m6i.xlarge)\",\"status\":\"active\",\"icon\":\"Boxes\",\"color\":\"#0284c7\",\"provider\":\"AWS\",\"details\":{\"service\":\"Amazon EKS\",\"autoscaler\":\"Karpenter v0.35\",\"instances\":\"3-12 Nodes Multi-AZ\"}}}," +
                "{\"id\":\"aurora-pg\",\"type\":\"cloudNode\",\"position\":{\"x\":1100,\"y\":150},\"data\":{\"title\":\"Amazon Aurora PostgreSQL\",\"category\":\"Database Tier\",\"subtitle\":\"Multi-AZ Cluster (db.r6g.2xlarge)\",\"status\":\"active\",\"icon\":\"Database\",\"color\":\"#7c3aed\",\"provider\":\"AWS\",\"details\":{\"service\":\"Amazon Aurora\",\"engine\":\"PostgreSQL 16.2\",\"replication\":\"6-way 3-AZ Synchronous\"}}}," +
                "{\"id\":\"elasticache\",\"type\":\"cloudNode\",\"position\":{\"x\":820,\"y\":350},\"data\":{\"title\":\"Amazon ElastiCache Redis\",\"category\":\"In-Memory Caching\",\"subtitle\":\"Redis Cluster 7.1 Multi-AZ\",\"status\":\"active\",\"icon\":\"Cpu\",\"color\":\"#ea580c\",\"provider\":\"AWS\",\"details\":{\"service\":\"Amazon ElastiCache\",\"shards\":\"2 Shards x 2 Replicas\",\"encryption\":\"In-Transit TLS + At-Rest\"}}}," +
                "{\"id\":\"s3-datalake\",\"type\":\"cloudNode\",\"position\":{\"x\":1100,\"y\":350},\"data\":{\"title\":\"Amazon S3 Lakehouse\",\"category\":\"Storage & Archival\",\"subtitle\":\"Intelligent-Tiering + Glacier\",\"status\":\"active\",\"icon\":\"HardDrive\",\"color\":\"#16a34a\",\"provider\":\"AWS\",\"details\":{\"service\":\"Amazon S3\",\"durability\":\"11 9s Durability\",\"versioning\":\"Enabled with MFA Delete\"}}}" +
                "]";
    }

    private String buildAzureNodesJson() {
        return "[" +
                "{\"id\":\"user-traffic\",\"type\":\"cloudNode\",\"position\":{\"x\":50,\"y\":180},\"data\":{\"title\":\"Global Users & Clients\",\"category\":\"Edge Network\",\"subtitle\":\"Public HTTPS & Enterprise Mobile\",\"status\":\"active\",\"icon\":\"Users\",\"color\":\"#0078d4\",\"provider\":\"AZURE\",\"details\":{\"service\":\"Azure Front Door + Azure DNS\",\"protocol\":\"TLS 1.3 / HTTPS\",\"ddosProtection\":\"Azure DDoS Protection Standard\"}}}," +
                "{\"id\":\"onprem-dc\",\"type\":\"cloudNode\",\"position\":{\"x\":50,\"y\":380},\"data\":{\"title\":\"On-Premises Datacenter\",\"category\":\"Hybrid Connectivity\",\"subtitle\":\"Chicago Equinix CH1 & HQ\",\"status\":\"active\",\"icon\":\"Building2\",\"color\":\"#f59e0b\",\"provider\":\"AZURE\",\"details\":{\"service\":\"Azure ExpressRoute\",\"bandwidth\":\"10 Gbps Circuit\",\"backup\":\"VPN Gateway Route-based\"}}}," +
                "{\"id\":\"transit-gw\",\"type\":\"cloudNode\",\"position\":{\"x\":300,\"y\":280},\"data\":{\"title\":\"Azure Virtual WAN Hub\",\"category\":\"Network Backbone\",\"subtitle\":\"Secured Hub (vwan-eastus)\",\"status\":\"active\",\"icon\":\"Network\",\"color\":\"#0078d4\",\"provider\":\"AZURE\",\"details\":{\"service\":\"Azure Virtual WAN\",\"topology\":\"Hub and Spoke\",\"vnetPeerings\":\"4 VNets Peered\"}}}," +
                "{\"id\":\"aws-waf-alb\",\"type\":\"cloudNode\",\"position\":{\"x\":550,\"y\":150},\"data\":{\"title\":\"Azure Application Gateway v2\",\"category\":\"Ingress & Balancing\",\"subtitle\":\"WAF v2 Tier (10.200.1.0/24)\",\"status\":\"active\",\"icon\":\"ShieldCheck\",\"color\":\"#10b981\",\"provider\":\"AZURE\",\"details\":{\"service\":\"Application Gateway v2\",\"wafPolicy\":\"OWASP 3.2 Detection & Prevention\",\"sslOffloading\":\"Key Vault Managed Certs\"}}}," +
                "{\"id\":\"eks-cluster\",\"type\":\"cloudNode\",\"position\":{\"x\":820,\"y\":150},\"data\":{\"title\":\"Azure Kubernetes Service (AKS)\",\"category\":\"Compute & Containers\",\"subtitle\":\"K8s v1.30 (Standard_D4s_v5)\",\"status\":\"active\",\"icon\":\"Boxes\",\"color\":\"#0078d4\",\"provider\":\"AZURE\",\"details\":{\"service\":\"Azure AKS\",\"nodePools\":\"System + User Node Pools\",\"autoscaler\":\"KEDA + Azure Virtual Nodes\"}}}," +
                "{\"id\":\"aurora-pg\",\"type\":\"cloudNode\",\"position\":{\"x\":1100,\"y\":150},\"data\":{\"title\":\"Azure SQL Managed Instance\",\"category\":\"Database Tier\",\"subtitle\":\"Business Critical (8 vCores)\",\"status\":\"active\",\"icon\":\"Database\",\"color\":\"#7c3aed\",\"provider\":\"AZURE\",\"details\":{\"service\":\"Azure SQL MI\",\"highAvailability\":\"Always On Availability Groups\",\"failover\":\"Automated Zone-redundant Failover\"}}}," +
                "{\"id\":\"elasticache\",\"type\":\"cloudNode\",\"position\":{\"x\":820,\"y\":350},\"data\":{\"title\":\"Azure Cache for Redis\",\"category\":\"In-Memory Caching\",\"subtitle\":\"Premium Tier P1 Multi-Zone\",\"status\":\"active\",\"icon\":\"Cpu\",\"color\":\"#ea580c\",\"provider\":\"AZURE\",\"details\":{\"service\":\"Azure Cache for Redis\",\"clustering\":\"Enabled (2 Shards)\",\"sla\":\"99.99% Availability SLA\"}}}," +
                "{\"id\":\"s3-datalake\",\"type\":\"cloudNode\",\"position\":{\"x\":1100,\"y\":350},\"data\":{\"title\":\"Azure Blob Storage (Data Lake)\",\"category\":\"Storage & Archival\",\"subtitle\":\"Hot / Cool / Archive Lifecycle\",\"status\":\"active\",\"icon\":\"HardDrive\",\"color\":\"#16a34a\",\"provider\":\"AZURE\",\"details\":{\"service\":\"Azure Blob Storage\",\"replication\":\"GZRS (Geo-Zone-Redundant)\",\"security\":\"Customer Managed Key (Key Vault)\"}}}" +
                "]";
    }

    private String buildGcpNodesJson() {
        return "[" +
                "{\"id\":\"user-traffic\",\"type\":\"cloudNode\",\"position\":{\"x\":50,\"y\":180},\"data\":{\"title\":\"Global Users & Clients\",\"category\":\"Edge Network\",\"subtitle\":\"Anycast Worldwide Traffic\",\"status\":\"active\",\"icon\":\"Users\",\"color\":\"#4285f4\",\"provider\":\"GCP\",\"details\":{\"service\":\"Cloud CDN + Cloud DNS\",\"protocol\":\"HTTP/3 & QUIC / TLS 1.3\",\"ddosProtection\":\"Google Cloud Armor Standard\"}}}," +
                "{\"id\":\"onprem-dc\",\"type\":\"cloudNode\",\"position\":{\"x\":50,\"y\":380},\"data\":{\"title\":\"On-Premises Datacenter\",\"category\":\"Hybrid Connectivity\",\"subtitle\":\"Chicago Equinix CH1 & HQ\",\"status\":\"active\",\"icon\":\"Building2\",\"color\":\"#f59e0b\",\"provider\":\"GCP\",\"details\":{\"service\":\"Cloud Interconnect\",\"bandwidth\":\"10 Gbps Dedicated Interconnect\",\"backup\":\"Cloud HA-VPN 99.99% SLA\"}}}," +
                "{\"id\":\"transit-gw\",\"type\":\"cloudNode\",\"position\":{\"x\":300,\"y\":280},\"data\":{\"title\":\"Google Global VPC Backbone\",\"category\":\"Network Backbone\",\"subtitle\":\"Single Global VPC Mesh\",\"status\":\"active\",\"icon\":\"Network\",\"color\":\"#ea4335\",\"provider\":\"GCP\",\"details\":{\"service\":\"GCP Global Shared VPC\",\"routing\":\"Global Dynamic BGP Routing\",\"networkServiceTier\":\"Premium Tier Fiber Backbone\"}}}," +
                "{\"id\":\"aws-waf-alb\",\"type\":\"cloudNode\",\"position\":{\"x\":550,\"y\":150},\"data\":{\"title\":\"Cloud Armor + External HTTPS LB\",\"category\":\"Ingress & Balancing\",\"subtitle\":\"Global Anycast IP Ingress\",\"status\":\"active\",\"icon\":\"ShieldCheck\",\"color\":\"#34a853\",\"provider\":\"GCP\",\"details\":{\"service\":\"Cloud Load Balancing\",\"waf\":\"Cloud Armor Adaptive Protection\",\"ssl\":\"Google Managed Certificates\"}}}," +
                "{\"id\":\"eks-cluster\",\"type\":\"cloudNode\",\"position\":{\"x\":820,\"y\":150},\"data\":{\"title\":\"Google Kubernetes Engine (GKE)\",\"category\":\"Compute & Containers\",\"subtitle\":\"GKE Autopilot (e2-standard-4)\",\"status\":\"active\",\"icon\":\"Boxes\",\"color\":\"#4285f4\",\"provider\":\"GCP\",\"details\":{\"service\":\"GKE Autopilot\",\"clusterType\":\"Regional GKE Cluster (3 Zones)\",\"management\":\"Fully Automated Upgrades & Patching\"}}}," +
                "{\"id\":\"aurora-pg\",\"type\":\"cloudNode\",\"position\":{\"x\":1100,\"y\":150},\"data\":{\"title\":\"Cloud SQL Enterprise Plus\",\"category\":\"Database Tier\",\"subtitle\":\"PostgreSQL 16 (db-custom-8-64)\",\"status\":\"active\",\"icon\":\"Database\",\"color\":\"#fbbc05\",\"provider\":\"GCP\",\"details\":{\"service\":\"Cloud SQL Enterprise Plus\",\"highAvailability\":\"Regional Multi-Zone HA\",\"disk\":\"Fast SSD Persistent Disk (Auto-grow)\"}}}," +
                "{\"id\":\"elasticache\",\"type\":\"cloudNode\",\"position\":{\"x\":820,\"y\":350},\"data\":{\"title\":\"Cloud Memorystore Redis\",\"category\":\"In-Memory Caching\",\"subtitle\":\"Standard Tier High Availability\",\"status\":\"active\",\"icon\":\"Cpu\",\"color\":\"#ea4335\",\"provider\":\"GCP\",\"details\":{\"service\":\"Cloud Memorystore\",\"replication\":\"Primary + Read Replica (Multi-Zone)\",\"failover\":\"Automatic Failover < 30s\"}}}," +
                "{\"id\":\"s3-datalake\",\"type\":\"cloudNode\",\"position\":{\"x\":1100,\"y\":350},\"data\":{\"title\":\"Google Cloud Storage (GCS)\",\"category\":\"Storage & Archival\",\"subtitle\":\"Standard + Nearline Storage\",\"status\":\"active\",\"icon\":\"HardDrive\",\"color\":\"#34a853\",\"provider\":\"GCP\",\"details\":{\"service\":\"Cloud Storage\",\"location\":\"Dual-Region (nam4 US-Central/East)\",\"lifecycle\":\"Autoclass Intelligent Storage Tiering\"}}}" +
                "]";
    }

    private String buildStandardEdgesJson() {
        return "[" +
                "{\"id\":\"e1-2\",\"source\":\"user-traffic\",\"target\":\"aws-waf-alb\",\"animated\":true,\"style\":{\"stroke\":\"#3b82f6\",\"strokeWidth\":2}}," +
                "{\"id\":\"e2-3\",\"source\":\"onprem-dc\",\"target\":\"transit-gw\",\"style\":{\"stroke\":\"#f59e0b\",\"strokeWidth\":2,\"strokeDasharray\":\"4,4\"}}," +
                "{\"id\":\"e3-4\",\"source\":\"transit-gw\",\"target\":\"aws-waf-alb\",\"style\":{\"stroke\":\"#6366f1\",\"strokeWidth\":2}}," +
                "{\"id\":\"e4-5\",\"source\":\"aws-waf-alb\",\"target\":\"eks-cluster\",\"animated\":true,\"style\":{\"stroke\":\"#10b981\",\"strokeWidth\":2}}," +
                "{\"id\":\"e5-6\",\"source\":\"eks-cluster\",\"target\":\"aurora-pg\",\"animated\":true,\"style\":{\"stroke\":\"#0284c7\",\"strokeWidth\":2}}," +
                "{\"id\":\"e5-7\",\"source\":\"eks-cluster\",\"target\":\"elasticache\",\"style\":{\"stroke\":\"#ea580c\",\"strokeWidth\":2}}," +
                "{\"id\":\"e5-8\",\"source\":\"eks-cluster\",\"target\":\"s3-datalake\",\"style\":{\"stroke\":\"#16a34a\",\"strokeWidth\":2}}" +
                "]";
    }

    private String buildAwsSpecsJson(int cores, int storage) {
        return "{\"provider\":\"AWS\",\"vpcCidr\":\"10.100.0.0/16\",\"subnets\":[\"10.100.1.0/24 (Pub A)\",\"10.100.2.0/24 (Pub B)\",\"10.100.10.0/24 (Priv App A)\",\"10.100.20.0/24 (Priv DB A)\"],\"compute\":{\"cores\":" + cores + ",\"type\":\"m6i.xlarge (Karpenter auto-scaling)\",\"container\":\"Amazon EKS v1.30\"},\"storage\":{\"capacityGb\":" + storage + ",\"tier\":\"Amazon S3 Intelligent-Tiering + EBS gp3\"},\"database\":{\"engine\":\"Aurora PostgreSQL 16.2 / RDS Oracle\",\"ha\":\"Multi-AZ Synchronous Mirroring\"}}";
    }

    private String buildAzureSpecsJson(int cores, int storage) {
        return "{\"provider\":\"AZURE\",\"vnetCidr\":\"10.200.0.0/16\",\"subnets\":[\"10.200.1.0/24 (Gateway)\",\"10.200.2.0/24 (AKS Ingress)\",\"10.200.10.0/24 (App Nodes)\",\"10.200.20.0/24 (Data Tier)\"],\"compute\":{\"cores\":" + cores + ",\"type\":\"Standard_D4s_v5 (AKS User Pool)\",\"container\":\"Azure Kubernetes Service (AKS)\"},\"storage\":{\"capacityGb\":" + storage + ",\"tier\":\"Azure Blob Storage (GZRS) + Premium SSD\"},\"database\":{\"engine\":\"Azure SQL Managed Instance / PostgreSQL Flexible\",\"ha\":\"Business Critical Zone Redundancy\"}}";
    }

    private String buildGcpSpecsJson(int cores, int storage) {
        return "{\"provider\":\"GCP\",\"vpcCidr\":\"10.150.0.0/16\",\"subnets\":[\"10.150.1.0/24 (Proxy-only Ingress)\",\"10.150.10.0/24 (GKE Nodes)\",\"10.150.20.0/24 (Cloud SQL VPC Peering)\"],\"compute\":{\"cores\":" + cores + ",\"type\":\"e2-standard-4 (GKE Autopilot)\",\"container\":\"Google Kubernetes Engine (GKE)\"},\"storage\":{\"capacityGb\":" + storage + ",\"tier\":\"Cloud Storage Dual-Region + Persistent Disk SSD\"},\"database\":{\"engine\":\"Cloud SQL Enterprise Plus / AlloyDB\",\"ha\":\"Regional HA Across 3 Zones\"}}";
    }
}

