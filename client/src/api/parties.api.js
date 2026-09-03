import apiClient from "./axios.js";
export function getPartiesRequest() { return apiClient.get("/parties").then((r) => r.data); }
export function createPartyRequest(payload) { return apiClient.post("/parties", payload).then((r) => r.data); }
export function updatePartyRequest(id, payload) { return apiClient.put(`/parties/${id}`, payload).then((r) => r.data); }
export function deletePartyRequest(id) { return apiClient.delete(`/parties/${id}`).then((r) => r.data); }