import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api/",
    headers: {"Content-Type": "application/json",},
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);


api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes("auth/login/") &&
            !originalRequest.url.includes("auth/token/refresh/")
        ) {
            originalRequest._retry = true;

            const refresh = localStorage.getItem("refresh");

            if (refresh) {
                try {
                    const response = await axios.post(
                        "http://127.0.0.1:8000/api/auth/token/refresh/",
                        { refresh }
                    );

                    const newAccess = response.data.access;

                    localStorage.setItem("access", newAccess);

                    originalRequest.headers.Authorization =
                        `Bearer ${newAccess}`;

                    return api(originalRequest);

                } catch (refreshError) {
                    localStorage.removeItem("access");
                    localStorage.removeItem("refresh");
                    localStorage.removeItem("user");

                    window.location.href = "/login";

                    return Promise.reject(refreshError);
                }
            }
        }

        return Promise.reject(error);
    }
);

export default api;