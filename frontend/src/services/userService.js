import api from "./axios";

/**
 * Get all users
 */
export const getUsers = async () => {
  const response = await api.get("/users/");
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
  const response = await api.post("/users/", userData);
  return response.data;
};

/**
 * Update user details
 *
 * Updates:
 * - name
 * - email
 * - role
 * - password (only when provided)
 */
export const updateUser = async (id, userData) => {
  const payload = {
    name: userData.name,
    email: userData.email,
    role: userData.role,
  };

  // Only send password when the admin entered one
  if (userData.password?.trim()) {
    payload.password = userData.password;
  }

  const response = await api.put(
    `/users/${id}`,
    payload
  );

  return response.data;
};

/**
 * Update user status
 *
 * Backend:
 * PATCH /users/{user_id}/status
 */
export const updateUserStatus = async (
  id,
  isActive
) => {
  const response = await api.patch(
    `/users/${id}/status`,
    null,
    {
      params: {
        is_active: isActive,
      },
    }
  );

  return response.data;
};

/**
 * Delete user
 */
export const deleteUser = async (id) => {
  const response = await api.delete(
    `/users/${id}`
  );

  return response.data;
};