import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/* ============================
   REQUEST INTERCEPTOR
============================ */

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ============================
   RESPONSE INTERCEPTOR
============================ */

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Unauthorized
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      // Future refresh token implementation
      // const refreshToken = localStorage.getItem("refreshToken");

      // if (refreshToken) {
      //   try {
      //     const response = await axios.post(
      //       `${API_BASE_URL}/auth/refresh`,
      //       {
      //         refresh_token: refreshToken,
      //       }
      //     );
      //
      //     const newToken = response.data.access_token;
      //
      //     localStorage.setItem("accessToken", newToken);
      //
      //     originalRequest.headers.Authorization =
      //       `Bearer ${newToken}`;
      //
      //     return api(originalRequest);
      //   } catch (err) {
      //     console.error(err);
      //   }
      // }

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      if (window.location.pathname !== "/") {
        window.location.replace("/");
      }
    }

    // Forbidden
    if (error.response?.status === 403) {
      if (window.location.pathname !== "/unauthorized") {
        window.location.replace("/unauthorized");
      }
    }

    return Promise.reject(error);
  }
);

export default api;