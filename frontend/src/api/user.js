import api from "./axios";

// Get all users
export const getUsers = (params) =>
  api.get("/users", { params });

// Get one user
export const getUser = (id) =>
  api.get(`/users/${id}`);

// Create user
export const createUser = (data) =>
  api.post("/users", data);

// Update user
export const updateUser = (id, data) =>
  api.put(`/users/${id}`, data);

// Activate / Deactivate
export const updateUserStatus = (id, is_active) =>
  api.patch(`/users/${id}/status`, null, {
    params: { is_active },
  });

// Delete
export const deleteUser = (id) =>
  api.delete(`/users/${id}`);