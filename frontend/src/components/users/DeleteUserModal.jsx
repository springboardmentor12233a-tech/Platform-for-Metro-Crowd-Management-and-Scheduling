import React, { useEffect } from "react";
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
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !loading) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, loading, onClose]);

  if (!open || !user) return null;

  const handleBackdropClick = () => {
    if (!loading) onClose();
  };

  const handleCloseClick = () => {
    if (!loading) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-8 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-red-100 p-3">
              <AlertTriangle
                size={28}
                className="text-red-600"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Delete User
              </h2>
              <p className="text-sm text-gray-500">
                This action cannot be undone.
              </p>
            </div>
          </div>
          <button
            onClick={handleCloseClick}
            disabled={loading}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>
        {/* Body */}
        <div className="mt-8 rounded-2xl bg-red-50 p-5">
          <p className="text-gray-700">
            Are you sure you want to permanently delete
            <span className="mx-1 font-bold text-red-600">
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
          <p className="text-sm text-gray-500">
            Status: {user.is_active ? "Active" : "Inactive"}
          </p>
        </div>
        {/* Footer */}
        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={handleCloseClick}
            disabled={loading}
            className="rounded-xl border border-gray-300 px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(user.id)}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-medium text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Trash2 size={18} />
            {loading ? "Deleting..." : "Delete User"}
          </button>
        </div>
      </div>
    </div>
  );
}