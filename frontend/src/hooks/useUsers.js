import { useEffect, useState } from "react";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../services/userService";

export default function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
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
  };

  const addUser = async (userData) => {
    const newUser = await createUser(userData);
    setUsers((prev) => [...prev, newUser]);
  };

  const editUser = async (id, userData) => {
    const updated = await updateUser(id, userData);

    setUsers((prev) =>
      prev.map((user) => (user.id === id ? updated : user))
    );
  };

  const removeUser = async (id) => {
    await deleteUser(id);

    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    fetchUsers,
    addUser,
    editUser,
    removeUser,
  };
}