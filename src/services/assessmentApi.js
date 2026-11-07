/**
 * CloudSage - MigrateMind
 * Workload Assessment & 6Rs Strategy REST API Client
 * Connects React frontend to Spring Boot backend (/api/assessments)
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const RESOURCE_URL = `${API_BASE_URL}/api/assessments`;

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
      // Non-JSON response
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

export const assessmentApi = {
  /**
   * Retrieve all assessed workloads
   */
  async getAllAssessments() {
    const response = await fetch(RESOURCE_URL, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
    return handleResponse(response);
  },

  /**
   * Retrieve single assessment by ID
   */
  async getAssessmentById(id) {
    const response = await fetch(`${RESOURCE_URL}/${id}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
    return handleResponse(response);
  },

  /**
   * Retrieve assessment by infrastructure ID
   */
  async getAssessmentByInfrastructureId(infraId) {
    const response = await fetch(`${RESOURCE_URL}/infrastructure/${infraId}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
    return handleResponse(response);
  },

  /**
   * Evaluate / re-evaluate a single infrastructure workload
   */
  async evaluateWorkload(infraId) {
    const response = await fetch(`${RESOURCE_URL}/evaluate/${infraId}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
    });
    return handleResponse(response);
  },

  /**
   * Evaluate all infrastructure workloads in batch
   */
  async evaluateAllWorkloads() {
    const response = await fetch(`${RESOURCE_URL}/evaluate-all`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
    });
    return handleResponse(response);
  },

  /**
   * Manually override a 6R migration strategy
   */
  async overrideStrategy(id, overrideData) {
    const response = await fetch(`${RESOURCE_URL}/${id}/override`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(overrideData),
    });
    return handleResponse(response);
  },

  /**
   * Retrieve summary metrics and 6Rs distribution
   */
  async getSummary() {
    const response = await fetch(`${RESOURCE_URL}/summary`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
    return handleResponse(response);
  },

  /**
   * Delete an assessment
   */
  async deleteAssessment(id) {
    const response = await fetch(`${RESOURCE_URL}/${id}`, {
      method: 'DELETE',
      headers: { Accept: 'application/json' },
    });
    return handleResponse(response);
  },
};

