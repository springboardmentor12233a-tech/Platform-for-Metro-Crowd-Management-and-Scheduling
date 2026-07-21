import api from "./axios";

/* ============================
   Authentication
============================ */

export const login = async (email, password) => {
  const response = await api.post("/auth/login", {
    email,
    password,
  });

  return response.data;
};

export const logout = async () => {
  try {
    const response = await api.post("/auth/logout");
    return response.data;
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
};

/* ============================
   Current User
============================ */

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

/* ============================
   Password Recovery
============================ */

export const forgotPassword = async (email) => {
  const response = await api.post("/auth/forgot-password", {
    email,
  });

  return response.data;
};

export const resetPassword = async (token, password) => {
  const response = await api.post("/auth/reset-password", {
    token,
    password,
  });

  return response.data;
};

/* ============================
   Refresh Token
   (Future Feature)
============================ */

export const refreshAccessToken = async (refreshToken) => {
  const response = await api.post("/auth/refresh", {
    refresh_token: refreshToken,
  });

  return response.data;
};

/* ============================
   User Management (Admin)
============================ */

export const createUser = async (userData) => {
  const response = await api.post("/users", userData);
  return response.data;
};

export const getUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

export const getUserById = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const updateUser = async (id, userData) => {
  const response = await api.put(`/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};