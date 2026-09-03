import apiClient from "./axios.js";

export function loginRequest(username, password) {
    return apiClient.post("/auth/login", { username, password }).then((r) => r.data);
}
export function fetchMe() {
    return apiClient.get("/auth/me").then((r) => r.data);
}
export function logoutRequest() {
    return apiClient.post("/auth/logout").then((r) => r.data);
}