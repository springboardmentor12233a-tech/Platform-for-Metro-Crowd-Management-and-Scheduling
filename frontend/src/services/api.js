import axios from "axios";


// ============================================================
// API INSTANCE
// ============================================================

const api = axios.create({

    baseURL:
        import.meta.env.VITE_API_BASE_URL ||
        "http://localhost:8000/api/v1",

    headers: {
        "Content-Type": "application/json",
    },
});


// ============================================================
// REQUEST INTERCEPTOR
// ============================================================

api.interceptors.request.use(

    (config) => {

        const token =
            sessionStorage.getItem(
                "metro_access_token"
            );

        console.log(
            "API Request:",
            config.method?.toUpperCase(),
            config.url
        );

        console.log(
            "Authentication token exists:",
            Boolean(token)
        );

        if (token) {

            config.headers =
                config.headers || {};

            config.headers.Authorization =
                `Bearer ${token}`;
        }

        return config;
    },

    (error) => {

        return Promise.reject(error);

    }
);


// ============================================================
// RESPONSE INTERCEPTOR
// ============================================================

api.interceptors.response.use(

    (response) => {

        return response;

    },

    (error) => {

        if (
            error.response?.status === 401
        ) {

            console.error(
                "401 Unauthorized:",
                error.response?.data
            );

            console.error(
                "Request URL:",
                error.config?.url
            );

            console.error(
                "Authorization header was:",
                error.config?.headers?.Authorization
                    ? "Present"
                    : "Missing"
            );
        }

        return Promise.reject(error);

    }
);


export default api;