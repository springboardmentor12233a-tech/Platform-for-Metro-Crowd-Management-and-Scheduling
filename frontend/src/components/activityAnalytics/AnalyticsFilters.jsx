import { Filter, RotateCcw } from "lucide-react";

export default function AnalyticsFilters({
  dateRange,
  setDateRange,
  module,
  setModule,
  role,
  setRole,
  onReset,
}) {
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">

      <div className="flex items-center gap-2 text-gray-700">
        <Filter className="h-5 w-5" />
        <span className="font-semibold">Filters</span>
      </div>

      {/* Date Range */}
      <select
        value={dateRange}
        onChange={(e) => setDateRange(e.target.value)}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
      >
        <option value="">All Time</option>
        <option value="today">Today</option>
        <option value="7days">Last 7 Days</option>
        <option value="30days">Last 30 Days</option>
        <option value="90days">Last 90 Days</option>
      </select>

      {/* Module */}
      <select
        value={module}
        onChange={(e) => setModule(e.target.value)}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
      >
        <option value="">All Modules</option>
        <option value="User Management">User Management</option>
        <option value="Stations">Stations</option>
        <option value="Scheduling">Scheduling</option>
        <option value="Analytics">Analytics</option>
        <option value="Settings">Settings</option>
      </select>

      {/* Role */}
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
      >
        <option value="">All Roles</option>
        <option value="Admin">Admin</option>
        <option value="Manager">Manager</option>
        <option value="Operator">Operator</option>
        <option value="Analyst">Analyst</option>
      </select>

      {/* Reset Button */}
      <button
        onClick={onReset}
        className="ml-auto flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
      >
        <RotateCcw className="h-4 w-4" />
        Reset
      </button>

    </div>
  );
}