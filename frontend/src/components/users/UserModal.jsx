import React, { useEffect, useState } from "react";

import {
  X,
  Save,
  UserPlus,
  User,
  Mail,
  Lock,
  Shield,
  Activity,
} from "lucide-react";

const roles = ["Admin", "Operator", "Analyst", "Member"];

const EMPTY_FORM = {
  name: "",
  email: "",
  password: "",
  role: "Member",
  is_active: true,
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function UserModal({ open, onClose, onSave, editingUser }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (editingUser) {
      setForm({
        name: editingUser.name,
        email: editingUser.email,
        password: "",
        role: editingUser.role,
        is_active: editingUser.is_active ?? true,
      });
    } else {
      setForm(EMPTY_FORM);
    }

    setSaving(false);
    setError("");
    setIsDirty(false);
  }, [editingUser, open]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") {
        attemptClose();
      }
    };

    window.addEventListener("keydown", handler);

    return () => window.removeEventListener("keydown", handler);
  }, [isDirty]);

  if (!open) return null;

  const handleChange = (e) => {
    setError("");
    setIsDirty(true);

    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleStatusChange = (e) => {
    setIsDirty(true);

    setForm((prev) => ({
      ...prev,
      is_active: e.target.value === "true",
    }));
  };

  const attemptClose = () => {
    if (saving) return;

    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!form.name.trim()) {
      setError("Full Name is required.");
      return;
    }

    if (!EMAIL_REGEX.test(form.email)) {
      setError("Enter a valid email.");
      return;
    }

    if (!editingUser && form.password.length < 8) {
      setError("Password should contain at least 8 characters.");
      return;
    }

    try {
      setSaving(true);

      await onSave(form);

      setIsDirty(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      onClick={attemptClose}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-xl" />

      {/* Blue Glow */}
      <div className="pointer-events-none absolute -left-40 top-10 h-[420px] w-[420px] rounded-full bg-blue-500/20 blur-3xl animate-pulse" />

      {/* Purple Glow */}
      <div className="pointer-events-none absolute right-[-120px] bottom-[-120px] h-[500px] w-[500px] rounded-full bg-violet-500/20 blur-3xl animate-pulse" />

      {/* Cyan Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/20 blur-3xl" />

      {/* Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-2xl overflow-hidden rounded-[32px] border border-white/60 bg-white/90 shadow-[0_30px_80px_rgba(30,64,175,0.20)] backdrop-blur-2xl"
      >
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 px-8 py-8 text-white">
          <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

          <div className="relative flex items-start justify-between">
            <div className="flex items-center gap-5">
              <div className="rounded-2xl bg-white/20 p-4 backdrop-blur">
                <UserPlus size={28} />
              </div>

              <div>
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest">
                  MetroVision Admin
                </span>

                <h2 className="mt-3 text-3xl font-bold">
                  {editingUser ? "Edit User" : "Create User"}
                </h2>

                <p className="mt-2 text-blue-100">
                  Create and manage enterprise users with secure role-based
                  access.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={attemptClose}
              className="relative z-20 rounded-xl bg-white/10 p-3 transition hover:rotate-90 hover:bg-white/20"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="space-y-6 p-8">
          {/* Error */}
          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-600 shadow-sm">
              {error}
            </div>
          )}

          {/* Basic Information */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Full Name */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <User size={17} className="text-blue-600" />
                Full Name
              </label>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                disabled={saving}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-700 shadow-sm outline-none transition-all duration-300 placeholder:text-slate-400 hover:border-blue-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Mail size={17} className="text-blue-600" />
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="john@metrovision.ai"
                disabled={saving}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-700 shadow-sm outline-none transition-all duration-300 placeholder:text-slate-400 hover:border-blue-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Lock size={17} className="text-blue-600" />
              Password
              {editingUser && (
                <span className="ml-2 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                  Optional
                </span>
              )}
            </label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              disabled={saving}
              placeholder={
                editingUser
                  ? "Leave blank to keep current password"
                  : "Enter secure password"
              }
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-700 shadow-sm outline-none transition-all duration-300 placeholder:text-slate-400 hover:border-blue-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </div>

          {/* Role & Status */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Role */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Shield size={17} className="text-blue-600" />
                User Role
              </label>

              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                disabled={saving}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-700 shadow-sm outline-none transition-all duration-300 hover:border-blue-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Activity size={17} className="text-green-600" />
                Account Status
              </label>

              <select
                value={String(form.is_active)}
                onChange={handleStatusChange}
                disabled={saving}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-700 shadow-sm outline-none transition-all duration-300 hover:border-blue-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              >
                <option value="true">🟢 Active</option>
                <option value="false">🔴 Inactive</option>
              </select>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />

          {/* Footer */}
          <div className="flex flex-col-reverse gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
            {/* Unsaved Changes */}
            <div>
              {isDirty && (
                <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700">
                  <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                  Unsaved Changes
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={attemptClose}
                disabled={saving}
                className="rounded-2xl border border-slate-200 bg-white px-7 py-3.5 font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-8 py-3.5 font-semibold text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <svg
                      className="h-5 w-5 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="white"
                        strokeWidth="3"
                        opacity="0.25"
                      />
                      <path
                        d="M22 12A10 10 0 0012 2"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                    {editingUser ? "Updating User..." : "Creating User..."}
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    {editingUser ? "Save Changes" : "Create User"}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}