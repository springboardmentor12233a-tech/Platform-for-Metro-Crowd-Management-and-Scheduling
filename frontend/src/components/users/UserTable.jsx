import {
  Pencil,
  Trash2,
  UserCircle2,
  Shield,
  Activity,
  CalendarDays,
  UserCheck,
  UserX,
} from "lucide-react";


// ======================================================
// Role Badge
// ======================================================

function getRoleBadge(role) {
  switch (role) {
    case "Admin":
      return "bg-red-100 text-red-700 border border-red-200";

    case "Operator":
      return "bg-blue-100 text-blue-700 border border-blue-200";

    case "Analyst":
      return "bg-purple-100 text-purple-700 border border-purple-200";

    default:
      return "bg-emerald-100 text-emerald-700 border border-emerald-200";
  }
}


// ======================================================
// Format Date
// ======================================================

function formatDate(date) {
  if (!date) return "Never";

  return new Date(date).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}


// ======================================================
// User Table
// ======================================================

export default function UserTable({
  users,
  loading,
  onEdit,
  onDelete,
  onStatusChange,
}) {

  // ====================================================
  // Loading State
  // ====================================================

  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-20 shadow-xl">

        <div className="flex flex-col items-center gap-5">

          <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />

          <h2 className="text-xl font-bold text-slate-800">
            Loading Users...
          </h2>

          <p className="text-slate-500">
            Fetching latest user information.
          </p>

        </div>

      </div>
    );
  }


  // ====================================================
  // Empty State
  // ====================================================

  if (!users.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-gradient-to-br from-white to-slate-50 p-20 shadow-xl">

        <div className="text-center">

          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-blue-100">

            <UserCircle2
              size={50}
              className="text-blue-600"
            />

          </div>

          <h2 className="mt-8 text-3xl font-bold text-slate-900">
            No Users Found
          </h2>

          <p className="mt-3 text-slate-500">
            Try changing filters or create a new user.
          </p>

        </div>

      </div>
    );
  }


  // ====================================================
  // Main Table
  // ====================================================

  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">

      {/* ==================================================
                          HEADER
      ================================================== */}

      <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-slate-50 via-white to-slate-50 px-8 py-6">

        <div>

          <h2 className="text-2xl font-bold text-slate-900">
            Team Members
          </h2>

          <p className="mt-1 text-slate-500">
            Manage all registered MetroVision users.
          </p>

        </div>

        <div className="rounded-2xl bg-blue-50 px-5 py-3">

          <span className="text-sm font-semibold text-blue-700">
            {users.length} Users
          </span>

        </div>

      </div>


      {/* ==================================================
                          TABLE
      ================================================== */}

      <div className="overflow-x-auto">

        <table className="min-w-full">

          {/* ==================================================
                              TABLE HEAD
          ================================================== */}

          <thead className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50/90 backdrop-blur">

            <tr>

              {/* User */}

              <th className="px-8 py-5 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                User
              </th>


              {/* Role */}

              <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-slate-500">

                <div className="flex items-center gap-2">

                  <Shield size={15} />

                  Role

                </div>

              </th>


              {/* Status */}

              <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-slate-500">

                <div className="flex items-center gap-2">

                  <Activity size={15} />

                  Status

                </div>

              </th>


              {/* Last Login */}

              <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-slate-500">

                <div className="flex items-center gap-2">

                  <CalendarDays size={15} />

                  Last Login

                </div>

              </th>


              {/* Created */}

              <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                Created
              </th>


              {/* Actions */}

              <th className="px-8 py-5 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                Actions
              </th>

            </tr>

          </thead>


          {/* ==================================================
                              TABLE BODY
          ================================================== */}

          <tbody className="divide-y divide-slate-100">

            {users.map((user) => (

              <tr
                key={user.id}
                className="group transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-50/60 hover:to-indigo-50/30"
              >

                {/* ==================================================
                                  USER
                ================================================== */}

                <td className="px-8 py-6">

                  <div className="flex items-center gap-4">

                    {/* Avatar */}

                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 text-lg font-bold text-white shadow-lg">

                      {user.name
                        ?.split(" ")
                        .map(
                          (word) =>
                            word[0]
                        )
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}

                    </div>


                    {/* User Info */}

                    <div>

                      <h3 className="font-semibold text-slate-900 transition group-hover:text-blue-700">

                        {user.name}

                      </h3>

                      <p className="mt-1 text-sm text-slate-500">

                        {user.email}

                      </p>

                    </div>

                  </div>

                </td>


                {/* ==================================================
                                  ROLE
                ================================================== */}

                <td className="px-6 py-6">

                  <span
                    className={`inline-flex items-center rounded-full px-4 py-2 text-xs font-semibold shadow-sm ${getRoleBadge(
                      user.role
                    )}`}
                  >

                    {user.role}

                  </span>

                </td>


                {/* ==================================================
                                  STATUS
                ================================================== */}

                <td className="px-6 py-6">

                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold shadow-sm ${
                      user.is_active
                        ? "border border-green-200 bg-green-100 text-green-700"
                        : "border border-red-200 bg-red-100 text-red-700"
                    }`}
                  >

                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        user.is_active
                          ? "animate-pulse bg-green-500"
                          : "bg-red-500"
                      }`}
                    />

                    {user.is_active
                      ? "Active"
                      : "Inactive"}

                  </span>

                </td>


                {/* ==================================================
                                LAST LOGIN
                ================================================== */}

                <td className="px-6 py-6">

                  {user.last_login ? (

                    <div className="text-sm">

                      <p className="font-medium text-slate-700">

                        {new Date(
                          user.last_login
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}

                      </p>

                      <p className="text-xs text-slate-400">

                        {new Date(
                          user.last_login
                        ).toLocaleTimeString(
                          "en-IN",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}

                      </p>

                    </div>

                  ) : (

                    <span className="text-sm text-slate-400">
                      Never
                    </span>

                  )}

                </td>


                {/* ==================================================
                                  CREATED
                ================================================== */}

                <td className="px-6 py-6">

                  <div className="text-sm">

                    <p className="font-medium text-slate-700">

                      {formatDate(
                        user.created_at
                      )}

                    </p>

                  </div>

                </td>


                {/* ==================================================
                                  ACTIONS
                ================================================== */}

                <td className="px-8 py-6">

                  <div className="flex justify-end gap-2">


                    {/* =================================================
                                        EDIT
                    ================================================= */}

                    <button
                      type="button"
                      onClick={() =>
                        onEdit(user)
                      }
                      title="Edit user"
                      className="rounded-xl bg-blue-50 p-3 text-blue-600 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-blue-600 hover:text-white hover:shadow-lg"
                    >

                      <Pencil size={18} />

                    </button>


                    {/* =================================================
                                ACTIVATE / DEACTIVATE
                    ================================================= */}

                    <button
                      type="button"
                      onClick={() =>
                        onStatusChange(
                          user
                        )
                      }
                      title={
                        user.is_active
                          ? "Deactivate user"
                          : "Activate user"
                      }
                      className={`rounded-xl p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:text-white hover:shadow-lg ${
                        user.is_active
                          ? "bg-amber-50 text-amber-600 hover:bg-amber-500"
                          : "bg-emerald-50 text-emerald-600 hover:bg-emerald-600"
                      }`}
                    >

                      {user.is_active ? (
                        <UserX
                          size={18}
                        />
                      ) : (
                        <UserCheck
                          size={18}
                        />
                      )}

                    </button>


                    {/* =================================================
                                  PERMANENT DELETE
                    ================================================= */}

                    <button
                      type="button"
                      onClick={() =>
                        onDelete(user)
                      }
                      title="Permanently delete user"
                      className="rounded-xl bg-red-50 p-3 text-red-600 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-red-600 hover:text-white hover:shadow-lg"
                    >

                      <Trash2
                        size={18}
                      />

                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>


      {/* ==================================================
                          FOOTER
      ================================================== */}

      <div className="border-t border-slate-200 bg-slate-50 px-8 py-4">

        <div className="flex flex-col gap-2 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">

          <p>
            Manage user access and platform permissions.
          </p>

          <div className="flex items-center gap-4">

            <span className="flex items-center gap-2">

              <span className="h-2.5 w-2.5 rounded-full bg-green-500" />

              Active

            </span>

            <span className="flex items-center gap-2">

              <span className="h-2.5 w-2.5 rounded-full bg-red-500" />

              Inactive

            </span>

          </div>

        </div>

      </div>

    </div>
  );
}