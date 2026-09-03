import apiClient from "./axios.js";
export function getReportsRequest(params) {
  const query = new URLSearchParams(params || {}).toString();
  return apiClient.get(`/reports${query ? `?${query}` : ""}`).then((r) => r.data);
}