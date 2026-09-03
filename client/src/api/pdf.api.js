import apiClient from "./axios.js";
export function downloadPayrollSlipRequest(id) {
  return apiClient.get(`/pdf/payroll/${id}`, { responseType: "blob" }).then((r) => r.data);
}