import apiClient from "./axios.js";

function toFormData(payload) {
    const fd = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        if (key === "profilePictureFile") fd.append("profilePicture", value);
        else if (key === "permissions") fd.append(key, JSON.stringify(value));
        else fd.append(key, value);
    });
    return fd;
}

export function getUsersRequest() { return apiClient.get("/users").then((r) => r.data); }
export function getUserRequest(id) { return apiClient.get(`/users/${id}`).then((r) => r.data); }
export function createUserRequest(payload) {
    return apiClient.post("/users", toFormData(payload), { headers: { "Content-Type": "multipart/form-data" } }).then((r) => r.data);
}
export function updateUserRequest(id, payload) {
    return apiClient.put(`/users/${id}`, toFormData(payload), { headers: { "Content-Type": "multipart/form-data" } }).then((r) => r.data);
}
export function deleteUserRequest(id) { return apiClient.delete(`/users/${id}`).then((r) => r.data); }