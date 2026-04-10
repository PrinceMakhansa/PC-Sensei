import { api } from "./client.js";

/**
 * Fetch all builds for the logged-in user.
 */
export const fetchUserBuilds = () => api.get("/api/builds");

/**
 * Fetch a single build by ID.
 */
export const fetchBuildById = (id) => api.get(`/api/builds/${id}`);

/**
 * Save a new build.
 * @param {{ name: string, description?: string, parts: Array }} buildData
 */
export const createBuild = (buildData) => api.post("/api/builds", buildData);

/**
 * Update an existing build.
 * @param {string} id
 * @param {Partial<{ name, description, parts }>} updates
 */
export const updateBuild = (id, updates) => api.put(`/api/builds/${id}`, updates);

/**
 * Delete a build.
 */
export const deleteBuild = (id) => api.delete(`/api/builds/${id}`);
