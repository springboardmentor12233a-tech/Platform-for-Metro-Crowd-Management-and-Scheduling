import { useCallback, useEffect, useState } from "react";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../services/userService";

export default function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  }, []);

  const addUser = useCallback(
    async (userData) => {
      try {
        setProcessing(true);
        await createUser(userData);
        await fetchUsers();
      } catch (err) {
        throw err;
      } finally {
        setProcessing(false);
      }
    },
    [fetchUsers]
  );

  const editUser = useCallback(
    async (id, userData) => {
      try {
        setProcessing(true);
        await updateUser(id, userData);
        await fetchUsers();
      } catch (err) {
        throw err;
      } finally {
        setProcessing(false);
      }
    },
    [fetchUsers]
  );

  const removeUser = useCallback(
    async (id) => {
      try {
        setProcessing(true);

        const response = await deleteUser(id);

        alert(response.message);

        // User may have been deactivated instead of deleted,
        // so refetch instead of just filtering it out locally.
        await fetchUsers();

        return response;
      } catch (err) {
        throw err;
      } finally {
        setProcessing(false);
      }
    },
    [fetchUsers]
  );

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    processing,
    error,
    fetchUsers,
    addUser,
    editUser,
    removeUser,
  };
}