import apiClient from "./axios.js";
export function getAuditLogsRequest() { return apiClient.get("/audit-logs").then((r) => r.data); }