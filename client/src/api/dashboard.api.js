import apiClient from "./axios.js";
export function getDashboardRequest() { return apiClient.get("/dashboard").then((r) => r.data); }