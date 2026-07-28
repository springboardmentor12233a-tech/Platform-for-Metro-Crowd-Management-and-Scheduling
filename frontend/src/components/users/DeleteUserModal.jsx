import React from "react";
import {
  AlertTriangle,
  Trash2,
  X,
} from "lucide-react";

export default function DeleteUserModal({
  open,
  user,
  onClose,
  onConfirm,
  loading = false,
}) {
  if (!open || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">

      <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-8 shadow-2xl dark:border-gray-800 dark:bg-gray-900">

        {/* Header */}

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="rounded-full bg-red-100 p-3 dark:bg-red-500/10">
              <AlertTriangle
                size={28}
                className="text-red-600 dark:text-red-400"
              />
            </div>

            <div>
              <h2 className="text-xl font-bold">
                Delete User
              </h2>

              <p className="text-sm text-gray-500">
                This action cannot be undone.
              </p>
            </div>

          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 transition hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X size={20} />
          </button>

        </div>

        {/* Body */}

        <div className="mt-8 rounded-2xl bg-red-50 p-5 dark:bg-red-500/10">

          <p className="text-gray-700 dark:text-gray-300">

            Are you sure you want to permanently delete

            <span className="mx-1 font-bold text-red-600 dark:text-red-400">
              {user.name}
            </span>

            ?

          </p>

          <p className="mt-2 text-sm text-gray-500">
            Email: {user.email}
          </p>

          <p className="text-sm text-gray-500">
            Role: {user.role}
          </p>

        </div>

        {/* Footer */}

        <div className="mt-8 flex justify-end gap-4">

          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-gray-300 px-5 py-3 font-medium transition hover:bg-gray-100 disabled:cursor-not-allowed dark:border-gray-700 dark:hover:bg-gray-800"
          >
            Cancel
          </button>

          <button
            onClick={() => onConfirm(user.id)}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Trash2 size={18} />

            {loading ? "Deleting..." : "Delete User"}
          </button>

        </div>

      </div>

    </div>
  );
}