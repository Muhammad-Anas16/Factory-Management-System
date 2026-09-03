import apiClient from "./axios.js";
export function getPaymentsRequest() { return apiClient.get("/payments").then((r) => r.data); }
export function createPaymentRequest(payload) { return apiClient.post("/payments", payload).then((r) => r.data); }