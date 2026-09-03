import apiClient from "./axios.js";
export function getPayrollRequest() { return apiClient.get("/payroll").then((r) => r.data); }
export function createPayrollRequest(payload) { return apiClient.post("/payroll", payload).then((r) => r.data); }
export function updatePayrollRequest(id, payload) { return apiClient.put(`/payroll/${id}`, payload).then((r) => r.data); }
export function deletePayrollRequest(id) { return apiClient.delete(`/payroll/${id}`).then((r) => r.data); }