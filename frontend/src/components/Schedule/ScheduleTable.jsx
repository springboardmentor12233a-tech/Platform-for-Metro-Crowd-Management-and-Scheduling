import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import scheduleData from "./scheduleData";
import TrainStatusBadge from "./TrainStatusBadge";

function ScheduleTable() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return scheduleData.filter(
      (train) =>
        train.train.toLowerCase().includes(search.toLowerCase()) ||
        train.line.toLowerCase().includes(search.toLowerCase()) ||
        train.from.toLowerCase().includes(search.toLowerCase()) ||
        train.to.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const lineColor = {
    Blue: "bg-blue-100 text-blue-700",
    Yellow: "bg-yellow-100 text-yellow-700",
    Red: "bg-red-100 text-red-700",
    Green: "bg-green-100 text-green-700",
    Magenta: "bg-pink-100 text-pink-700",
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl">

      {/* Header */}

      <div className="p-6 border-b">

        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">

          <div>

            <h2 className="text-2xl font-bold text-slate-900">
              Today's Train Schedule
            </h2>

            <p className="text-slate-500 mt-1">
              AI Optimized Metro Timetable
            </p>

          </div>

          <div className="relative">

            <Search
              className="absolute left-3 top-3 text-slate-400"
              size={18}
            />

            <input
              type="text"
              placeholder="Search train, station or line..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

          </div>

        </div>

      </div>

      {/* Table */}

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead className="bg-slate-50">

            <tr className="text-left text-slate-600">

              <th className="px-6 py-4">Train</th>
              <th className="px-6 py-4">Line</th>
              <th className="px-6 py-4">From</th>
              <th className="px-6 py-4">To</th>
              <th className="px-6 py-4">Departure</th>
              <th className="px-6 py-4">Arrival</th>
              <th className="px-6 py-4">Platform</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">AI Suggestion</th>

            </tr>

          </thead>

          <tbody>

            {filtered.map((train) => {

              const suggestion =
                train.status === "Delayed"
                  ? "Increase frequency"
                  : train.status === "Boarding"
                  ? "Prepare platform"
                  : "Running normally";

              return (

                <tr
                  key={train.id}
                  className="border-t hover:bg-slate-50 transition"
                >

                  <td className="px-6 py-5 font-semibold">
                    {train.train}
                  </td>

                  <td className="px-6 py-5">

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${lineColor[train.line]}`}
                    >
                      {train.line}
                    </span>

                  </td>

                  <td className="px-6 py-5">
                    {train.from}
                  </td>

                  <td className="px-6 py-5">
                    {train.to}
                  </td>

                  <td className="px-6 py-5 font-medium">
                    {train.departure}
                  </td>

                  <td className="px-6 py-5 font-medium">
                    {train.arrival}
                  </td>

                  <td className="px-6 py-5">
                    Platform {train.platform}
                  </td>

                  <td className="px-6 py-5">

                    <TrainStatusBadge
                      status={train.status}
                    />

                  </td>

                  <td className="px-6 py-5 text-sm text-slate-600">
                    {suggestion}
                  </td>

                </tr>

              );

            })}

          </tbody>

        </table>

      </div>

      {/* Footer */}

      <div className="flex flex-col md:flex-row justify-between items-center p-6 border-t">

        <p className="text-slate-500 text-sm">

          Showing

          <span className="font-semibold mx-1">
            {filtered.length}
          </span>

          trains

        </p>

        <div className="flex gap-2 mt-4 md:mt-0">

          <button className="px-4 py-2 rounded-xl border hover:bg-slate-100 transition">
            Previous
          </button>

          <button className="px-4 py-2 rounded-xl bg-indigo-600 text-white">
            1
          </button>

          <button className="px-4 py-2 rounded-xl border hover:bg-slate-100 transition">
            Next
          </button>

        </div>

      </div>

    </div>
  );
}

export default ScheduleTable;