import api from "../api/axios";

export const login = async (email, password) => {
    const response = await api.post("/auth/login", {
        email,
        password,
    });

    return response.data;
};

export const register = async (user) => {
    const response = await api.post("/auth/register", user);

    return response.data;
};

export const getProfile = async () => {
    const response = await api.get("/auth/profile");
    return response.data;
};

export const updateProfile = async (data) => {
    const response = await api.put("/auth/profile", {
        name: data.name,
        email: data.email,
    });
    return response.data;
};

export const forgotPassword = async (email) => {
    const response = await api.post("/auth/forgot-password", {
        email,
    });

    return response.data;
};

export const resetPassword = async (token, newPassword) => {
    const response = await api.post("/auth/reset-password", {
        token,
        new_password: newPassword,
    });

    return response.data;
};