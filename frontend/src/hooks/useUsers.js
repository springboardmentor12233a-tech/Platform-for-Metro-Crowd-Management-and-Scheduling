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
        await deleteUser(id);
        setUsers((prev) => prev.filter((user) => user.id !== id));
      } catch (err) {
        throw err;
      } finally {
        setProcessing(false);
      }
    },
    []
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