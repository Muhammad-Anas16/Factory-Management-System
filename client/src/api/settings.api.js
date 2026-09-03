import apiClient from "./axios.js";
export function getSettingsRequest() { return apiClient.get("/settings").then((r) => r.data); }
export function createSettingRequest(payload) { return apiClient.post("/settings", payload).then((r) => r.data); }