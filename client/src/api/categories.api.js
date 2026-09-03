import apiClient from "./axios.js";
export function getCategoriesRequest() { return apiClient.get("/categories").then((r) => r.data); }
export function createCategoryRequest(payload) { return apiClient.post("/categories", payload).then((r) => r.data); }
export function updateCategoryRequest(id, payload) { return apiClient.put(`/categories/${id}`, payload).then((r) => r.data); }
export function deleteCategoryRequest(id) { return apiClient.delete(`/categories/${id}`).then((r) => r.data); }