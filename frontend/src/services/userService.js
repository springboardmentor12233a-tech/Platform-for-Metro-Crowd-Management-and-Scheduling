import api from "./axios";

/**
 * Get all users
 */
export const getUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

/**
 * Get single user
 */
export const getUserById = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

/**
 * Create user
 */
export const createUser = async (userData) => {
  const response = await api.post("/users", userData);
  return response.data;
};

/**
 * Update user
 */
export const updateUser = async (id, userData) => {
  const response = await api.put(`/users/${id}`, userData);
  return response.data;
};

/**
 * Delete user
 */
export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};