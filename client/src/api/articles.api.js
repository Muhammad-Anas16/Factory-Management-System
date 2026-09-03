import apiClient from "./axios.js";

function toFormData(payload) {
  const fd = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (key === "imageFiles") (value || []).forEach((file) => fd.append("images", file));
    else fd.append(key, value);
  });
  return fd;
}

export function getArticlesRequest() { return apiClient.get("/articles").then((r) => r.data); }
export function createArticleRequest(payload) {
  return apiClient.post("/articles", toFormData(payload), { headers: { "Content-Type": "multipart/form-data" } }).then((r) => r.data);
}
export function updateArticleRequest(id, payload) {
  return apiClient.put(`/articles/${id}`, toFormData(payload), { headers: { "Content-Type": "multipart/form-data" } }).then((r) => r.data);
}
export function deleteArticleRequest(id) { return apiClient.delete(`/articles/${id}`).then((r) => r.data); }