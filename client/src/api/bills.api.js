import apiClient from "./axios.js";
export function getBillsRequest() { return apiClient.get("/bills").then((r) => r.data); }
export function getBillRequest(id) { return apiClient.get(`/bills/${id}`).then((r) => r.data); }
export function createBillRequest(payload) { return apiClient.post("/bills", payload).then((r) => r.data); }