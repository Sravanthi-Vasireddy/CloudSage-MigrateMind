package com.cloudsage.backend.dto;

import java.util.ArrayList;
import java.util.List;

public class ArchitectureComparisonDto {

    private List<ServiceMappingItem> serviceMappings = new ArrayList<>();
    private List<ProviderSummaryItem> providerSummaries = new ArrayList<>();

    public ArchitectureComparisonDto() {
    }

    public List<ServiceMappingItem> getServiceMappings() {
        return serviceMappings;
    }

    public void setServiceMappings(List<ServiceMappingItem> serviceMappings) {
        this.serviceMappings = serviceMappings;
    }

    public List<ProviderSummaryItem> getProviderSummaries() {
        return providerSummaries;
    }

    public void setProviderSummaries(List<ProviderSummaryItem> providerSummaries) {
        this.providerSummaries = providerSummaries;
    }

    public static class ServiceMappingItem {
        private String category;
        private String awsService;
        private String azureService;
        private String gcpService;
        private String architecturalDifference;
        private String operationalComplexity;

        public ServiceMappingItem() {
        }

        public ServiceMappingItem(String category, String awsService, String azureService,
                                  String gcpService, String architecturalDifference, String operationalComplexity) {
            this.category = category;
            this.awsService = awsService;
            this.azureService = azureService;
            this.gcpService = gcpService;
            this.architecturalDifference = architecturalDifference;
            this.operationalComplexity = operationalComplexity;
        }

        public String getCategory() {
            return category;
        }

        public void setCategory(String category) {
            this.category = category;
        }

        public String getAwsService() {
            return awsService;
        }

        public void setAwsService(String awsService) {
            this.awsService = awsService;
        }

        public String getAzureService() {
            return azureService;
        }

        public void setAzureService(String azureService) {
            this.azureService = azureService;
        }

        public String getGcpService() {
            return gcpService;
        }

        public void setGcpService(String gcpService) {
            this.gcpService = gcpService;
        }

        public String getArchitecturalDifference() {
            return architecturalDifference;
        }

        public void setArchitecturalDifference(String architecturalDifference) {
            this.architecturalDifference = architecturalDifference;
        }

        public String getOperationalComplexity() {
            return operationalComplexity;
        }

        public void setOperationalComplexity(String operationalComplexity) {
            this.operationalComplexity = operationalComplexity;
        }
    }

    public static class ProviderSummaryItem {
        private String provider;
        private String primaryRegion;
        private String computeSizing;
        private String databaseTopology;
        private String storageCapacity;
        private String networkArchitecture;
        private String highAvailability;
        private Double estimatedMonthlyBaseline;
        private String operationalComplexity;

        public ProviderSummaryItem() {
        }

        public ProviderSummaryItem(String provider, String primaryRegion, String computeSizing,
                                   String databaseTopology, String storageCapacity, String networkArchitecture,
                                   String highAvailability, Double estimatedMonthlyBaseline, String operationalComplexity) {
            this.provider = provider;
            this.primaryRegion = primaryRegion;
            this.computeSizing = computeSizing;
            this.databaseTopology = databaseTopology;
            this.storageCapacity = storageCapacity;
            this.networkArchitecture = networkArchitecture;
            this.highAvailability = highAvailability;
            this.estimatedMonthlyBaseline = estimatedMonthlyBaseline;
            this.operationalComplexity = operationalComplexity;
        }

        public String getProvider() {
            return provider;
        }

        public void setProvider(String provider) {
            this.provider = provider;
        }

        public String getPrimaryRegion() {
            return primaryRegion;
        }

        public void setPrimaryRegion(String primaryRegion) {
            this.primaryRegion = primaryRegion;
        }

        public String getComputeSizing() {
            return computeSizing;
        }

        public void setComputeSizing(String computeSizing) {
            this.computeSizing = computeSizing;
        }

        public String getDatabaseTopology() {
            return databaseTopology;
        }

        public void setDatabaseTopology(String databaseTopology) {
            this.databaseTopology = databaseTopology;
        }

        public String getStorageCapacity() {
            return storageCapacity;
        }

        public void setStorageCapacity(String storageCapacity) {
            this.storageCapacity = storageCapacity;
        }

        public String getNetworkArchitecture() {
            return networkArchitecture;
        }

        public void setNetworkArchitecture(String networkArchitecture) {
            this.networkArchitecture = networkArchitecture;
        }

        public String getHighAvailability() {
            return highAvailability;
        }

        public void setHighAvailability(String highAvailability) {
            this.highAvailability = highAvailability;
        }

        public Double getEstimatedMonthlyBaseline() {
            return estimatedMonthlyBaseline;
        }

        public void setEstimatedMonthlyBaseline(Double estimatedMonthlyBaseline) {
            this.estimatedMonthlyBaseline = estimatedMonthlyBaseline;
        }

        public String getOperationalComplexity() {
            return operationalComplexity;
        }

        public void setOperationalComplexity(String operationalComplexity) {
            this.operationalComplexity = operationalComplexity;
        }
    }
}

