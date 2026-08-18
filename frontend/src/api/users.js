import api from "./axios";

// ======================================================
// Get All Users
// ======================================================

export const getUsers = (params = {}) =>
  api.get("/users/", {
    params,
  });


// ======================================================
// Get Single User
// ======================================================

export const getUser = (id) =>
  api.get(`/users/${id}`);


// ======================================================
// Create User
// ======================================================

export const createUser = (data) =>
  api.post("/users/", data);


// ======================================================
// Update User
// ======================================================

export const updateUser = (id, data) =>
  api.put(`/users/${id}`, data);


// ======================================================
// Activate / Deactivate User
// ======================================================

export const updateUserStatus = (
  id,
  is_active
) =>
  api.patch(
    `/users/${id}/status`,
    null,
    {
      params: {
        is_active,
      },
    }
  );


// ======================================================
// Permanently Delete User
// ======================================================

export const deleteUser = (id) =>
  api.delete(`/users/${id}`);