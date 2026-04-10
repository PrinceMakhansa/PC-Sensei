import { api } from "./client.js";

export const authRegister = (data) => api.post("/api/auth/register", data);
export const authLogin = (data) => api.post("/api/auth/login", data);
export const authGetMe = () => api.get("/api/auth/me");
export const authUpdateProfile = (data) => api.put("/api/auth/profile", data);