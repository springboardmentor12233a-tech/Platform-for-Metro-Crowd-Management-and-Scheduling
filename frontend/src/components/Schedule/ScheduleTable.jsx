import { useMemo, useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

import TrainStatusBadge from "./TrainStatusBadge";

function ScheduleTable({
  scheduleData = [],
  loading = false,
}) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 8;

  const lineColor = {
    Blue: "bg-blue-100 text-blue-700",
    Yellow: "bg-yellow-100 text-yellow-700",
    Red: "bg-red-100 text-red-700",
    Green: "bg-green-100 text-green-700",
    Magenta: "bg-pink-100 text-pink-700",
  };

  /* -----------------------------
     SEARCH
  ----------------------------- */

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) {
      return scheduleData;
    }

    return scheduleData.filter((train) =>
      [
        train.train_id,
        train.line,
        train.from_station,
        train.to_station,
        train.status,
        train.ai_suggestion,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value)
            .toLowerCase()
            .includes(query)
        )
    );
  }, [scheduleData, search]);

  /* -----------------------------
     PAGINATION
  ----------------------------- */

  const totalPages = Math.ceil(
    filtered.length / rowsPerPage
  );

  const paginatedData = useMemo(() => {
    const startIndex =
      (currentPage - 1) * rowsPerPage;

    return filtered.slice(
      startIndex,
      startIndex + rowsPerPage
    );
  }, [filtered, currentPage]);

  /* Reset page when search changes */

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  /* Prevent invalid page */

  useEffect(() => {
    if (
      totalPages > 0 &&
      currentPage > totalPages
    ) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  /* -----------------------------
     PAGE NUMBERS
  ----------------------------- */

  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">

      {/* =========================
          HEADER
      ========================== */}

      <div className="p-6 border-b border-slate-200">

        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">

          <div>

            <h2 className="text-2xl font-bold text-slate-900">
              Complete Train Schedule
            </h2>

            <p className="text-slate-500 mt-1">
              AI Optimized Metro Timetable
            </p>

          </div>

          {/* Search */}

          <div className="relative">

            <Search
              className="absolute left-3 top-3 text-slate-400"
              size={18}
            />

            <input
              type="text"
              placeholder="Search train, station or line..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full lg:w-80 pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

          </div>

        </div>

      </div>

      {/* =========================
          TABLE
      ========================== */}

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead className="bg-slate-50">

            <tr className="text-left text-slate-600 text-sm">

              <th className="px-6 py-4 font-semibold">
                Train
              </th>

              <th className="px-6 py-4 font-semibold">
                Line
              </th>

              <th className="px-6 py-4 font-semibold">
                From
              </th>

              <th className="px-6 py-4 font-semibold">
                To
              </th>

              <th className="px-6 py-4 font-semibold">
                Departure
              </th>

              <th className="px-6 py-4 font-semibold">
                Arrival
              </th>

              <th className="px-6 py-4 font-semibold">
                Platform
              </th>

              <th className="px-6 py-4 font-semibold">
                Status
              </th>

              <th className="px-6 py-4 font-semibold">
                AI Suggestion
              </th>

            </tr>

          </thead>

          <tbody>

            {/* LOADING */}

            {loading ? (

              <tr>

                <td
                  colSpan="9"
                  className="px-6 py-16 text-center text-slate-500"
                >

                  <div className="flex flex-col items-center gap-3">

                    <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />

                    <span>
                      Loading train schedules...
                    </span>

                  </div>

                </td>

              </tr>

            ) : paginatedData.length === 0 ? (

              /* EMPTY */

              <tr>

                <td
                  colSpan="9"
                  className="px-6 py-16 text-center text-slate-500"
                >

                  No train schedules found.

                </td>

              </tr>

            ) : (

              /* DATA */

              paginatedData.map((train) => {

                const suggestion =
                  train.ai_suggestion ||
                  (
                    train.status?.toLowerCase() ===
                    "delayed"
                      ? "Increase frequency"
                      : train.status?.toLowerCase() ===
                        "boarding"
                      ? "Prepare platform"
                      : "Running normally"
                  );

                return (

                  <tr
                    key={train.id || train.train_id}
                    className="border-t border-slate-200 hover:bg-slate-50 transition"
                  >

                    {/* Train */}

                    <td className="px-6 py-5 font-semibold text-slate-900">
                      {train.train_id}
                    </td>

                    {/* Line */}

                    <td className="px-6 py-5">

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          lineColor[train.line] ||
                          "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {train.line}
                      </span>

                    </td>

                    {/* From */}

                    <td className="px-6 py-5 text-slate-700">
                      {train.from_station}
                    </td>

                    {/* To */}

                    <td className="px-6 py-5 text-slate-700">
                      {train.to_station}
                    </td>

                    {/* Departure */}

                    <td className="px-6 py-5 font-medium text-slate-900">
                      {train.departure_time}
                    </td>

                    {/* Arrival */}

                    <td className="px-6 py-5 font-medium text-slate-900">
                      {train.arrival_time}
                    </td>

                    {/* Platform */}

                    <td className="px-6 py-5 text-slate-700">
                      Platform {train.platform}
                    </td>

                    {/* Status */}

                    <td className="px-6 py-5">

                      <TrainStatusBadge
                        status={train.status}
                      />

                    </td>

                    {/* AI Suggestion */}

                    <td className="px-6 py-5 text-sm text-slate-600 max-w-xs">
                      {suggestion}
                    </td>

                  </tr>

                );

              })

            )}

          </tbody>

        </table>

      </div>

      {/* =========================
          FOOTER / PAGINATION
      ========================== */}

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-6 border-t border-slate-200">

        {/* Result count */}

        <p className="text-sm text-slate-500">

          Showing{" "}

          <span className="font-semibold text-slate-700">
            {filtered.length === 0
              ? 0
              : (currentPage - 1) *
                  rowsPerPage +
                1}
          </span>

          {" – "}

          <span className="font-semibold text-slate-700">
            {Math.min(
              currentPage * rowsPerPage,
              filtered.length
            )}
          </span>

          {" of "}

          <span className="font-semibold text-slate-700">
            {filtered.length}
          </span>

          {" trains"}

        </p>

        {/* Pagination */}

        {totalPages > 1 && (

          <div className="flex items-center gap-2">

            {/* Previous */}

            <button
              onClick={() =>
                setCurrentPage((page) =>
                  Math.max(page - 1, 1)
                )
              }
              disabled={currentPage === 1}
              className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >

              <ChevronLeft size={18} />

            </button>

            {/* Pages */}

            {pageNumbers.map((page) => (

              <button
                key={page}
                onClick={() =>
                  setCurrentPage(page)
                }
                className={`w-10 h-10 rounded-xl font-semibold transition ${
                  currentPage === page
                    ? "bg-indigo-600 text-white shadow-md"
                    : "border border-slate-300 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {page}
              </button>

            ))}

            {/* Next */}

            <button
              onClick={() =>
                setCurrentPage((page) =>
                  Math.min(
                    page + 1,
                    totalPages
                  )
                )
              }
              disabled={
                currentPage === totalPages
              }
              className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >

              <ChevronRight size={18} />

            </button>

          </div>

        )}

      </div>

    </div>
  );
}

export default ScheduleTable;