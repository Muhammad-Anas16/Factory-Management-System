import apiClient from "./axios.js";
export function getWorkAllocationsRequest() { return apiClient.get("/work-allocations").then((r) => r.data); }
export function createWorkAllocationRequest(payload) { return apiClient.post("/work-allocations", payload).then((r) => r.data); }
export function updateWorkAllocationRequest(id, payload) { return apiClient.put(`/work-allocations/${id}`, payload).then((r) => r.data); }
export function completeWorkAllocationRequest(id, payload) { return apiClient.post(`/work-allocations/${id}/complete`, payload).then((r) => r.data); }
export function deleteWorkAllocationRequest(id) { return apiClient.delete(`/work-allocations/${id}`).then((r) => r.data); }