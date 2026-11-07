/**
 * CloudSage - MigrateMind
 * Target Cloud Architecture Designer REST API Client
 * Connects React frontend to Spring Boot backend (/api/architectures)
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const RESOURCE_URL = `${API_BASE_URL}/api/architectures`;

async function handleResponse(response) {
  if (!response.ok) {
    let errorDetail = `HTTP ${response.status} ${response.statusText}`;
    try {
      const errorJson = await response.json();
      if (errorJson.message) {
        errorDetail = errorJson.message;
      }
    } catch {
      // Non-JSON error body
    }
    const error = new Error(errorDetail);
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const architectureApi = {
  /**
   * Generate recommended target architecture for AWS, AZURE, or GCP
   */
  async generateArchitecture(provider) {
    const response = await fetch(`${RESOURCE_URL}/generate/${provider}`, {
      method: 'POST',
      headers: { Accept: 'application/json' },
    });
    return handleResponse(response);
  },

  /**
   * Retrieve all target architectures
   */
  async getAllArchitectures() {
    const response = await fetch(RESOURCE_URL, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
    return handleResponse(response);
  },

  /**
   * Retrieve target architecture by provider (AWS, AZURE, GCP)
   */
  async getArchitectureByProvider(provider) {
    const response = await fetch(`${RESOURCE_URL}/provider/${provider}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
    return handleResponse(response);
  },

  /**
   * Retrieve target architecture by ID
   */
  async getArchitectureById(id) {
    const response = await fetch(`${RESOURCE_URL}/${id}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
    return handleResponse(response);
  },

  /**
   * Update architecture configuration (e.g. toggle DR, update nodes/edges layout)
   */
  async updateArchitecture(id, modificationData) {
    const response = await fetch(`${RESOURCE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(modificationData),
    });
    return handleResponse(response);
  },

  /**
   * Retrieve multi-cloud architecture comparison matrix across AWS, Azure, and GCP
   */
  async getComparison() {
    const response = await fetch(`${RESOURCE_URL}/compare`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
    return handleResponse(response);
  },

  /**
   * Delete an architecture
   */
  async deleteArchitecture(id) {
    const response = await fetch(`${RESOURCE_URL}/${id}`, {
      method: 'DELETE',
      headers: { Accept: 'application/json' },
    });
    return handleResponse(response);
  },
};

