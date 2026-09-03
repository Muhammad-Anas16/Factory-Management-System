import apiClient from "./axios.js";
export function getChallansRequest() { return apiClient.get("/challans").then((r) => r.data); }
export function getChallanRequest(id) { return apiClient.get(`/challans/${id}`).then((r) => r.data); }
export function createChallanRequest(payload) { return apiClient.post("/challans", payload).then((r) => r.data); }