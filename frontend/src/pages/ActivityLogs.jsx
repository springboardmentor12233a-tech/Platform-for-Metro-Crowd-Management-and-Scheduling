import { useState, useEffect } from "react";
import useActivityLogs from "../hooks/useActivityLogs";
import ActivityStats from "../components/activity/ActivityStats";
import ActivityFilters from "../components/activity/ActivityFilters";
import ActivityTable from "../components/activity/ActivityTable";
import Pagination from "../components/activity/Pagination";
import ExportCSVButton from "../components/activity/ExportCSVButton";
import ActivityDetailsDrawer from "../components/activity/ActivityDetailsDrawer";

export default function ActivityLogs() {
  const { logs, loading, error } = useActivityLogs();

  // Filter States
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [action, setAction] = useState("");
  const [module, setModule] = useState("");
  const [status, setStatus] = useState("");
  const [dateRange, setDateRange] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  // Sorting State
  const [sortField, setSortField] = useState("created_at");
  const [sortDirection, setSortDirection] = useState("desc");

  // Drawer State
  const [selectedLog, setSelectedLog] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Reset to page 1 whenever a filter changes.
  // Moved above the loading/error early returns — hooks must run
  // unconditionally on every render, or React throws exactly the
  // error you're seeing (hook count mismatch between renders).
  useEffect(() => {
    setCurrentPage(1);
  }, [search, role, action, module, status, dateRange]);

  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-lg font-semibold">Loading activity logs...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h2 className="text-lg font-semibold text-red-600">
          Failed to load activity logs.
        </h2>
        <p className="mt-2 text-gray-600">{error}</p>
      </div>
    );
  }

  const filteredLogs = logs.filter((log) => {
    const searchTerm = search.trim().toLowerCase();

    const matchesSearch =
      searchTerm === "" ||
      log.user_name?.toLowerCase().includes(searchTerm) ||
      log.target?.toLowerCase().includes(searchTerm) ||
      log.action?.toLowerCase().includes(searchTerm) ||
      log.module?.toLowerCase().includes(searchTerm) ||
      log.role?.toLowerCase().includes(searchTerm);

    const matchesRole =
      role === "" || log.role === role;

    const matchesAction =
      action === "" || log.action === action;

    const matchesModule =
      module === "" || log.module === module;

    const matchesStatus =
      status === "" || log.status === status;

    const today = new Date();

    let matchesDate = true;

    if (dateRange === "today") {
      matchesDate =
        new Date(log.created_at).toDateString() ===
        today.toDateString();
    }

    if (dateRange === "7days") {
      matchesDate =
        today - new Date(log.created_at) <=
        7 * 24 * 60 * 60 * 1000;
    }

    if (dateRange === "30days") {
      matchesDate =
        today - new Date(log.created_at) <=
        30 * 24 * 60 * 60 * 1000;
    }

    if (dateRange === "90days") {
      matchesDate =
        today - new Date(log.created_at) <=
        90 * 24 * 60 * 60 * 1000;
    }

    return (
      matchesSearch &&
      matchesRole &&
      matchesAction &&
      matchesModule &&
      matchesStatus &&
      matchesDate
    );
  });

  const sortedLogs = [...filteredLogs].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (sortField === "created_at") {
      return sortDirection === "asc"
        ? new Date(aValue) - new Date(bValue)
        : new Date(bValue) - new Date(aValue);
    }

    const first = String(aValue ?? "").toLowerCase();
    const second = String(bValue ?? "").toLowerCase();

    if (first < second)
      return sortDirection === "asc" ? -1 : 1;

    if (first > second)
      return sortDirection === "asc" ? 1 : -1;

    return 0;
  });

  const logsPerPage = 10;

  const totalPages = Math.ceil(
    sortedLogs.length / logsPerPage
  );

  const startIndex = (currentPage - 1) * logsPerPage;

  const paginatedLogs = sortedLogs.slice(
    startIndex,
    startIndex + logsPerPage
  );

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection((prev) =>
        prev === "asc" ? "desc" : "asc"
      );
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  return (
    <div className="p-6">

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Activity Logs
          </h1>

          <p className="text-gray-500">
            Monitor all user activities across the platform.
          </p>
        </div>

        <ExportCSVButton logs={filteredLogs} />
      </div>

      <ActivityStats logs={logs} />

      <ActivityFilters
        search={search}
        setSearch={setSearch}
        role={role}
        setRole={setRole}
        action={action}
        setAction={setAction}
        module={module}
        setModule={setModule}
        status={status}
        setStatus={setStatus}
        dateRange={dateRange}
        setDateRange={setDateRange}
      />

      <div className="mb-4 text-sm text-gray-600">
        Showing {paginatedLogs.length} of {filteredLogs.length} matching logs
      </div>

      <ActivityTable
        logs={paginatedLogs}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
        onRowClick={(log) => {
          setSelectedLog(log);
          setDrawerOpen(true);
        }}
      />

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      <ActivityDetailsDrawer
        log={selectedLog}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

    </div>
  );
}