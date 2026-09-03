import apiClient from "./axios.js";
export function getRolesRequest() { return apiClient.get("/roles").then((r) => r.data); }
export function createRoleRequest(payload) { return apiClient.post("/roles", payload).then((r) => r.data); }
export function updateRoleRequest(id, payload) { return apiClient.put(`/roles/${id}`, payload).then((r) => r.data); }
export function deleteRoleRequest(id) { return apiClient.delete(`/roles/${id}`).then((r) => r.data); }