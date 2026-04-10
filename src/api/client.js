/**
 * Base API client for PCSensei.
 * Uses VITE_API_URL env variable with fallback to localhost:5000.
 */

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * Core fetch wrapper — handles JSON parsing + error formatting.
 */
const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem("pcsensei_token");

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errData = await response.json().catch(() => ({ error: "Request failed" }));
    throw new Error(errData.error || `HTTP ${response.status}`);
  }

  // Handle 204 No Content
  if (response.status === 204) return null;

  return response.json();
};

export const api = {
  get: (endpoint) => request(endpoint),
  post: (endpoint, body) => request(endpoint, { method: "POST", body: JSON.stringify(body) }),
  put: (endpoint, body) => request(endpoint, { method: "PUT", body: JSON.stringify(body) }),
  delete: (endpoint) => request(endpoint, { method: "DELETE" }),
};
