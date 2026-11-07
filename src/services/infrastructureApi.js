/**
 * CloudSage - MigrateMind
 * Infrastructure Inventory REST API Client
 * Connects React frontend to Spring Boot backend (/api/infrastructure)
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const RESOURCE_URL = `${API_BASE_URL}/api/infrastructure`;

/**
 * Helper to handle HTTP JSON responses and format errors
 */
async function handleResponse(response) {
  if (!response.ok) {
    let errorDetail = `HTTP ${response.status} ${response.statusText}`;
    try {
      const errorJson = await response.json();
      if (errorJson.message) {
        errorDetail = errorJson.message;
      }
      if (errorJson.validationErrors) {
        const fieldErrors = Object.entries(errorJson.validationErrors)
          .map(([field, msg]) => `${field}: ${msg}`)
          .join(', ');
        errorDetail += ` (${fieldErrors})`;
      }
    } catch {
      // Non-JSON error body
    }
    const error = new Error(errorDetail);
    error.status = response.status;
    throw error;
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const infrastructureApi = {
  /**
   * Ping backend to check if Spring Boot is online
   */
  async checkHealth() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);
      const res = await fetch(RESOURCE_URL, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return res.ok;
    } catch {
      return false;
    }
  },

  /**
   * Fetch all infrastructure workloads
   */
  async getAll() {
    const response = await fetch(RESOURCE_URL, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });
    return handleResponse(response);
  },

  /**
   * Fetch single infrastructure workload by ID
   */
  async getById(id) {
    const response = await fetch(`${RESOURCE_URL}/${id}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });
    return handleResponse(response);
  },

  /**
   * Create a new infrastructure workload
   */
  async create(data) {
    const response = await fetch(RESOURCE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  /**
   * Update an existing infrastructure workload
   */
  async update(id, data) {
    const response = await fetch(`${RESOURCE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  /**
   * Delete an infrastructure workload by ID
   */
  async delete(id) {
    const response = await fetch(`${RESOURCE_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
      },
    });
    return handleResponse(response);
  },
};

