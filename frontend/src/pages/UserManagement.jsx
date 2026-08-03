import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  Users,
  UserCheck,
  Shield,
  Filter,
} from "lucide-react";
import toast from "react-hot-toast";

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
  const [statusFilter, setStatusFilter] = useState("All");

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

      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Active" && user.is_active) ||
        (statusFilter === "Inactive" && !user.is_active);

      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus
      );
    });
  }, [
    users,
    search,
    roleFilter,
    statusFilter,
  ]);

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
        toast.success("User updated successfully");
      } else {
        await addUser(formData);
        toast.success("User created successfully");
      }

      setModalOpen(false);
      setEditingUser(null);

    } catch (err) {
      toast.error(
        err.response?.data?.detail ||
          "Operation failed"
      );
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

      toast.success("User deleted successfully");

    } catch (err) {
      toast.error(
        err.response?.data?.detail ||
          "Delete failed"
      );
    }
  };

  const hasActiveFilters =
    search !== "" ||
    roleFilter !== "All" ||
    statusFilter !== "All";

  return (
    <div className="space-y-8">

      {/* =======================================================
                        HERO HEADER
      ======================================================== */}

      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 p-8 text-white shadow-2xl">

        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-3xl" />

        <div className="absolute -bottom-16 left-10 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl" />

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm backdrop-blur">

              <Shield size={16} />

              Administration

            </div>

            <h1 className="text-5xl font-black tracking-tight">

              User Management

            </h1>

            <p className="mt-4 max-w-2xl text-blue-100">

              Manage administrators, operators,
              analysts and members across the
              MetroVision platform with enterprise
              security and role-based access control.

            </p>

          </div>

          <button
            onClick={handleCreate}
            className="flex items-center gap-3 rounded-2xl bg-white px-6 py-4 font-bold text-blue-700 shadow-xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
          >
            <Plus size={20} />

            Add User
          </button>

        </div>

      </div>

      {/* =======================================================
                        STATISTICS
      ======================================================== */}

      <UserStats users={users} />

      {/* =======================================================
                      PREMIUM COMMAND BAR
      ======================================================== */}

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">

        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">

          {/* Search */}

          <div className="relative w-full max-w-2xl">

            <Search
              size={20}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search by name or email..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-14 pr-5 text-slate-700 shadow-sm outline-none transition-all duration-300 placeholder:text-slate-400 hover:border-blue-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />

          </div>

          {/* Filters */}

          <div className="flex flex-wrap gap-3">

            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4">

              <UserCheck
                size={18}
                className="text-blue-600"
              />

              <select
                value={roleFilter}
                onChange={(e) =>
                  setRoleFilter(e.target.value)
                }
                className="bg-transparent py-3 text-slate-700 outline-none"
              >
                <option>All</option>
                <option>Admin</option>
                <option>Operator</option>
                <option>Analyst</option>
                <option>Member</option>
              </select>

            </div>

            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4">

              <Filter
                size={18}
                className="text-indigo-600"
              />

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className="bg-transparent py-3 text-slate-700 outline-none"
              >
                <option>All</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>

            </div>

          </div>

        </div>

      </div>
            {/* =======================================================
                          ERROR
      ======================================================== */}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 shadow-sm">

          <h3 className="font-semibold text-red-700">
            Something went wrong
          </h3>

          <p className="mt-2 text-red-600">
            {error}
          </p>

        </div>
      )}

      {/* =======================================================
                      EMPTY STATE / TABLE
      ======================================================== */}

      {!loading && filteredUsers.length === 0 ? (

        <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 py-20 text-center shadow-xl">

          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-blue-100">

            <Users
              size={44}
              className="text-blue-600"
            />

          </div>

          <h2 className="mt-8 text-3xl font-bold text-slate-900">

            {hasActiveFilters
              ? "No Users Found"
              : "No Users Available"}

          </h2>

          <p className="mx-auto mt-4 max-w-lg text-slate-500">

            {hasActiveFilters
              ? "Try changing the search keyword or filter selection."
              : "Start building your MetroVision team by creating your first user account."}

          </p>

          {!hasActiveFilters && (

            <button
              onClick={handleCreate}
              className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-7 py-4 font-semibold text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >

              <Plus size={18} />

              Create First User

            </button>

          )}

        </div>

      ) : (

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">

          <UserTable
            users={filteredUsers}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

        </div>

      )}

      {/* =======================================================
                      USER MODAL
      ======================================================== */}

      <UserModal
        open={modalOpen}
        editingUser={editingUser}
        onClose={() => {
          setModalOpen(false);
          setEditingUser(null);
        }}
        onSave={handleSave}
      />

      {/* =======================================================
                    DELETE MODAL
      ======================================================== */}

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