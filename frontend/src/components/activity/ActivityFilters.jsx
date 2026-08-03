export default function ActivityFilters({
  search,
  setSearch,
  role,
  setRole,
  action,
  setAction,
  module,
  setModule,
  status,
  setStatus,
  dateRange,
  setDateRange,
}) {
  return (
    <div className="mt-6 rounded-xl bg-white p-5 shadow">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6">

        {/* Search */}
        <input
          type="text"
          placeholder="Search user, target or action..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border px-4 py-2 outline-none focus:border-blue-500"
        />

        {/* Role */}
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="rounded-lg border px-4 py-2"
        >
          <option value="">All Roles</option>
          <option value="Admin">Admin</option>
          <option value="Manager">Manager</option>
          <option value="Member">Member</option>
        </select>

        {/* Action */}
        <select
          value={action}
          onChange={(e) => setAction(e.target.value)}
          className="rounded-lg border px-4 py-2"
        >
          <option value="">All Actions</option>
          <option value="Login">Login</option>
          <option value="Logout">Logout</option>
          <option value="Create User">Create User</option>
          <option value="Update User">Update User</option>
          <option value="Delete User">Delete User</option>
        </select>

        {/* Module */}
        <select
          value={module}
          onChange={(e) => setModule(e.target.value)}
          className="rounded-lg border px-4 py-2"
        >
          <option value="">All Modules</option>
          <option value="Authentication">Authentication</option>
          <option value="User Management">User Management</option>
          <option value="AI">AI</option>
          <option value="Schedule">Schedule</option>
        </select>

        {/* Status */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border px-4 py-2"
        >
          <option value="">All Status</option>
          <option value="Success">Success</option>
          <option value="Failed">Failed</option>
        </select>

        {/* Date Range */}
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="rounded-lg border px-4 py-2"
        >
          <option value="">All Time</option>
          <option value="today">Today</option>
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="90days">Last 90 Days</option>
        </select>

      </div>
    </div>
  );
}