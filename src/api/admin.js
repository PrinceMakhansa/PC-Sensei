import { api } from "./client.js";

const toQS = (params = {}) => {
  const filtered = Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "");
  if (!filtered.length) return "";
  return "?" + new URLSearchParams(Object.fromEntries(filtered)).toString();
};

// Dashboard
export const fetchDashboardStats = () => api.get("/api/admin/stats");

// Components
export const adminFetchComponents = (params) =>
  api.get(`/api/admin/components${toQS(params)}`);
export const adminCreateComponent = (data) => api.post("/api/admin/components", data);
export const adminUpdateComponent = (id, data) => api.put(`/api/admin/components/${id}`, data);
export const adminDeleteComponent = (id) => api.delete(`/api/admin/components/${id}`);

// Users
export const adminFetchUsers = (params) =>
  api.get(`/api/admin/users${toQS(params)}`);
export const adminDeleteUser = (id) => api.delete(`/api/admin/users/${id}`);
export const adminPromoteByEmail = (email) => api.post("/api/admin/admins", { email });
export const adminDemoteByEmail = (email) => api.post("/api/admin/admins/demote", { email });

// Builds
export const adminFetchBuilds = (params) =>
  api.get(`/api/admin/builds${toQS(params)}`);
