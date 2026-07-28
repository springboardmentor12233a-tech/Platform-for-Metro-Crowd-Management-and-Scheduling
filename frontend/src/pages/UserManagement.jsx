import { useMemo, useState } from "react";
import { Plus, Search, Users } from "lucide-react";

import useUsers from "../hooks/useUsers";

import UserStats from "../components/users/UserStats";
import UserTable from "../components/users/UserTable";
import UserModal from "../components/users/UserModal";
import DeleteUserModal from "../components/users/DeleteUserModal";

export default function UserManagement() {
  const {
    users,
    loading,
    error,
    addUser,
    editUser,
    removeUser,
  } = useUsers();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());

      const matchesRole =
        roleFilter === "All" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const handleCreate = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const handleSave = async (formData) => {
    try {
      if (editingUser) {
        await editUser(editingUser.id, formData);
      } else {
        await addUser(formData);
      }

      setModalOpen(false);
      setEditingUser(null);
    } catch (err) {
      alert(err.response?.data?.detail || "Operation failed");
    }
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setDeleteOpen(true);
  };

  const confirmDelete = async (id) => {
    try {
      await removeUser(id);

      setDeleteOpen(false);
      setSelectedUser(null);
    } catch (err) {
      alert(err.response?.data?.detail || "Delete failed");
    }
  };

  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

        <div>

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-blue-600 p-3 text-white">
              <Users size={24} />
            </div>

            <div>

              <h1 className="text-3xl font-bold">
                User Management
              </h1>

              <p className="text-gray-500">
                Manage users and their roles.
              </p>

            </div>

          </div>

        </div>

        <button
          onClick={handleCreate}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Add User
        </button>

      </div>

      {/* Statistics */}

      <UserStats users={users} />

      {/* Toolbar */}

      <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between dark:border-gray-800 dark:bg-gray-900">

        <div className="relative w-full md:w-96">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800"
          />

        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800"
        >
          <option>All</option>
          <option>Admin</option>
          <option>Operator</option>
          <option>Analyst</option>
          <option>Member</option>
        </select>

      </div>

      {/* Error */}

      {error && (
        <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-red-600 dark:border-red-700 dark:bg-red-500/10">
          {error}
        </div>
      )}

      {/* Table */}

      <UserTable
        users={filteredUsers}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Add/Edit Modal */}

      <UserModal
        open={modalOpen}
        editingUser={editingUser}
        onClose={() => {
          setModalOpen(false);
          setEditingUser(null);
        }}
        onSave={handleSave}
      />

      {/* Delete Modal */}

      <DeleteUserModal
        open={deleteOpen}
        user={selectedUser}
        onClose={() => {
          setDeleteOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={confirmDelete}
      />

    </div>
  );
}