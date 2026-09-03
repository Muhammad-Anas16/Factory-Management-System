import axios from "axios";

const BASE_URL = "http://127.0.0.1:4000/api";
export const API_ORIGIN = BASE_URL.replace(/\/api\/?$/, "");

const apiClient = axios.create({ baseURL: BASE_URL });

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("fms_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

apiClient.interceptors.response.use(
    (res) => res,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("fms_token");
            if (window.location.pathname !== "/login") window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default apiClient;