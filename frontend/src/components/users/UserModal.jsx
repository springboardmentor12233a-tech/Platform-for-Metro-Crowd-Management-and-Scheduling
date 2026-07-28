import React, { useEffect, useState } from "react";
import { X, Save, UserPlus } from "lucide-react";

const roles = [
  "Admin",
  "Operator",
  "Analyst",
  "Member",
];

export default function UserModal({
  open,
  onClose,
  onSave,
  editingUser,
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Member",
  });

  useEffect(() => {
    if (editingUser) {
      setForm({
        name: editingUser.name,
        email: editingUser.email,
        password: "",
        role: editingUser.role,
      });
    } else {
      setForm({
        name: "",
        email: "",
        password: "",
        role: "Member",
      });
    }
  }, [editingUser]);

  if (!open) return null;

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      return alert("Name is required");
    }

    if (!form.email.trim()) {
      return alert("Email is required");
    }

    if (!editingUser && !form.password.trim()) {
      return alert("Password is required");
    }

    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">

      <div className="w-full max-w-lg rounded-3xl border border-gray-200 bg-white p-8 shadow-2xl dark:border-gray-800 dark:bg-gray-900">

        <div className="mb-8 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-blue-600 p-3 text-white">
              <UserPlus size={22} />
            </div>

            <div>

              <h2 className="text-2xl font-bold">

                {editingUser
                  ? "Edit User"
                  : "Create User"}

              </h2>

              <p className="text-sm text-gray-500">
                Manage system users
              </p>

            </div>

          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X size={22} />
          </button>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <div>

            <label className="mb-2 block text-sm font-medium">
              Full Name
            </label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="john@email.com"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium">

              Password

              {editingUser && (
                <span className="ml-2 text-gray-400">
                  (optional)
                </span>
              )}

            </label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder={
                editingUser
                  ? "Leave blank to keep current password"
                  : "Enter password"
              }
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium">
              Role
            </label>

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800"
            >
              {roles.map((role) => (
                <option
                  key={role}
                  value={role}
                >
                  {role}
                </option>
              ))}
            </select>

          </div>

          <div className="flex justify-end gap-4 pt-6">

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border px-6 py-3 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
            >
              <Save size={18} />

              {editingUser
                ? "Update User"
                : "Create User"}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}