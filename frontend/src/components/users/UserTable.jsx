import React from "react";
import {
  Pencil,
  Trash2,
  Mail,
  UserCircle2,
} from "lucide-react";

import RoleBadge from "./RoleBadge";

export default function UserTable({
  users,
  loading,
  onEdit,
  onDelete,
}) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="space-y-4">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="h-16 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800"
            />
          ))}
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-20 text-center shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <UserCircle2
          size={64}
          className="mx-auto text-gray-400"
        />

        <h2 className="mt-6 text-xl font-semibold">
          No Users Found
        </h2>

        <p className="mt-2 text-gray-500">
          Create your first user to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="overflow-x-auto">
        <table className="min-w-full">

          <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
            <tr>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                User
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Email
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Role
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold">
                Actions
              </th>

            </tr>
          </thead>

          <tbody>

            {users.map((user) => (

              <tr
                key={user.id}
                className="border-b border-gray-100 transition hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/40"
              >

                <td className="px-6 py-5">

                  <div className="flex items-center gap-4">

                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-lg font-bold text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </div>

                    <div>

                      <p className="font-semibold">
                        {user.name}
                      </p>

                      <p className="text-sm text-gray-500">
                        ID #{user.id}
                      </p>

                    </div>

                  </div>

                </td>

                <td className="px-6 py-5">

                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">

                    <Mail size={16} />

                    {user.email}

                  </div>

                </td>

                <td className="px-6 py-5">

                  <RoleBadge role={user.role} />

                </td>

                <td className="px-6 py-5">

                  <div className="flex items-center justify-center gap-3">

                    <button
                      onClick={() => onEdit(user)}
                      className="rounded-lg bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => onDelete(user)}
                      className="rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
                    >
                      <Trash2 size={18} />
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>
      </div>
    </div>
  );
}