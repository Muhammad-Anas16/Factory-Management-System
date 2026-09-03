import apiClient from "./axios.js";
export function getBackupsRequest() { return apiClient.get("/backup").then((r) => r.data); }
export function createBackupRequest() { return apiClient.post("/backup").then((r) => r.data); }