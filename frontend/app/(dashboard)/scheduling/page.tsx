'use client';

import { useEffect, useState } from "react";
import { useHour } from "../components/HourContext";
import { apiService } from "@/lib/api";

import {
  Train,
  Users,
  Clock,
  Activity,
} from "lucide-react";

export default function SchedulingPage() {

  const { selectedHour } = useHour();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [lineFilter, setLineFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [delayData, setDelayData] = useState<any>(null);

  useEffect(() => {

    const loadData = async () => {

      const result = await apiService.getSchedulingDashboard(
        Number(selectedHour)
      );

      setData(result);
      setDelayData(null);
      setLoading(false);

    };

    loadData();

    const interval = setInterval(loadData, 10000);

    return () => clearInterval(interval);

  }, [selectedHour]);

  const simulateDelay = async () => {
    try {
      const result = await apiService.simulateDelay(
        Number(selectedHour),
        Number(selectedHour) + 1,
        data.recommended_frequency,
        10
      );

      setDelayData(result);

    } catch (error) {
      console.error(error);
    }
  };

  const delayedCount = delayData
    ? delayData.updated_schedule.filter(
      (_: any, index: number) => index % 4 === 0
    ).length
    : 0;

  const stations = [
    "Rajiv Chowk",
    "Kashmere Gate",
    "Central Secretariat",
    "Botanical Garden",
    "Noida City Centre",
    "HUDA City Centre",
    "Dwarka Sector 21",
    "Vaishali",
  ];

  const lines = [
    "Blue Line",
    "Yellow Line",
    "Red Line",
    "Green Line",
  ];

  const scheduleRows = (delayData?.updated_schedule ?? data?.schedule ?? [])
    .map((item: any, index: number) => {
      const delayed = !!delayData && index % 4 === 0;

      return {
        trainId: 1000 + index,
        station: stations[index % stations.length],
        line: lines[index % lines.length],
        departure: delayed
          ? item.new_departure
          : delayData
            ? item.old_departure
            : item,
        delayed,
      };
    })
    .filter((row: any) => {
      const matchesSearch = row.departure
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesLine =
        lineFilter === "All" || row.line === lineFilter;

      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Delayed" && row.delayed) ||
        (statusFilter === "On Time" && !row.delayed);

      return matchesSearch && matchesLine && matchesStatus;
    });

  if (loading) {

    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Loading Scheduling Dashboard...
      </div>
    );

  }

  return (

    <div className="min-h-screen bg-slate-950 text-white p-8">

      <h1 className="text-4xl font-bold">
        Train Scheduling
      </h1>

      <p className="text-slate-400 mt-2 mb-8">
        AI-based Train Scheduling & Frequency Optimization
      </p>

      {/* KPI Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
          <Users className="text-cyan-400 mb-3" />
          <p className="text-slate-400">Predicted Passengers</p>
          <h2 className="text-3xl font-bold">
            {data.predicted_passengers}
          </h2>
        </div>

        <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
          <Clock className="text-yellow-400 mb-3" />
          <p className="text-slate-400">Current Frequency</p>
          <h2 className="text-3xl font-bold">
            {data.current_frequency} min
          </h2>
        </div>

        <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
          <Train className="text-green-400 mb-3" />
          <p className="text-slate-400">Recommended Frequency</p>
          <h2 className="text-3xl font-bold">
            {data.recommended_frequency} min
          </h2>
        </div>

        <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
          <Activity className="text-red-400 mb-3" />
          <p className="text-slate-400">Required Trains</p>
          <h2 className="text-3xl font-bold">
            {data.required_trains}
          </h2>
        </div>

      </div>

      {/* Status */}

      <div className="grid md:grid-cols-2 gap-6 mt-8">

        <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">

          <h2 className="text-xl font-bold mb-4">
            Platform Load
          </h2>

          <p className="text-3xl text-cyan-400 font-bold">
            {data.platform_load}
          </p>

        </div>


        <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">

          <h2 className="text-xl font-bold mb-4">
            Peak Hour
          </h2>

          <p className="text-3xl font-bold">

            {data.peak_hour.priority === "HIGH"
              ? "🔴 Peak Hour"
              : "🟢 Normal"}

          </p>

        </div>

      </div>

      {/* Schedule Controls */}

      <div className="flex flex-col md:flex-row gap-4 mt-8">

        <input
          type="text"
          placeholder="Search departure (e.g. 09:20)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 w-full"
        />

        <select
          value={lineFilter}
          onChange={(e) => setLineFilter(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-3"
        >
          <option>All</option>
          <option>Red Line</option>
          <option>Blue Line</option>
          <option>Yellow Line</option>
          <option>Green Line</option>
          <option>Violet Line</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-3"
        >
          <option>All</option>
          <option>On Time</option>
          <option>Delayed</option>
        </select>

        <button
          onClick={() => {
            setSearch("");
            setLineFilter("All");
            setStatusFilter("All");
          }}
          className="bg-slate-700 hover:bg-slate-600 px-5 py-3 rounded-lg"
        >
          Reset Filters
        </button>

      </div>

      {/* Peak Hour Optimization */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

        <div className="bg-slate-900 rounded-xl border border-orange-600 p-6">
          <h2 className="text-lg font-bold text-orange-400">
            Peak Hour Status
          </h2>

          <p className="text-3xl font-bold mt-4">
            {data.peak_hour.priority === "HIGH"
              ? "🔴 PEAK"
              : "🟢 NORMAL"}
          </p>

          <p className="text-slate-400 mt-2">
            Hour {selectedHour}:00
          </p>
        </div>

        <div className="bg-slate-900 rounded-xl border border-cyan-600 p-6">
          <h2 className="text-lg font-bold text-cyan-400">
            AI Recommendation
          </h2>

          <p className="text-2xl font-bold mt-4">
            {data.recommended_frequency} min
          </p>

          <p className="text-slate-400 mt-2">
            Recommended Train Frequency
          </p>
        </div>

        <div className="bg-slate-900 rounded-xl border border-green-600 p-6">
          <h2 className="text-lg font-bold text-green-400">
            Required Trains
          </h2>

          <p className="text-4xl font-bold mt-4">
            {data.required_trains}
          </p>

          <p className="text-slate-400 mt-2">
            Trains Required
          </p>
        </div>

      </div>


      {/* Delay Handling */}

      <div className="bg-slate-900 rounded-xl border border-slate-700 p-6 mt-8">

        <h2 className="text-2xl font-bold mb-6">
          🚨 Delay Handling
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          <div className="bg-red-950/30 border border-red-600 rounded-lg p-5">

            <h3 className="text-red-400 font-bold">
              Delayed Trains
            </h3>

            <p className="text-4xl font-bold mt-3">
              {delayedCount}
            </p>

          </div>

          <div className="bg-yellow-950/30 border border-yellow-500 rounded-lg p-5">

            <h3 className="text-yellow-400 font-bold">
              Average Delay
            </h3>

            <p className="text-4xl font-bold mt-3">
              {delayData
                ? `${delayData.delay_minutes} min`
                : "0 min"}
            </p>

          </div>

          <div className="bg-cyan-950/30 border border-cyan-600 rounded-lg p-5">

            <h3 className="text-cyan-400 font-bold">
              AI Action
            </h3>

            <p className="mt-3 text-slate-300">
              {delayData
                ? delayData.recommendation
                : "No active delays."}
            </p>

          </div>

        </div>

      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">
        🚆 Live Train Schedule
      </h2>


      {/* Schedule */}

      <div className="mt-8 bg-slate-900 rounded-xl border border-slate-700 p-6">

        <div className="flex justify-end mb-4">

          <button
            onClick={simulateDelay}
            className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg font-semibold"
          >
            🚨 Simulate 10 min Delay
          </button>

        </div>

        <h2 className="text-2xl font-bold mb-6">
          Generated Train Schedule
        </h2>

        <table className="w-full">

          <thead>

            <tr className="border-b border-slate-700 text-slate-400">

              <th className="text-left py-3">Train ID</th>
              <th className="text-left py-3">Station</th>
              <th className="text-left py-3">Metro Line</th>
              <th className="text-center py-3">Departure</th>
              <th className="text-center py-3">Arrival</th>
              <th className="text-center py-3">Frequency</th>
              <th className="text-center py-3">Status</th>

            </tr>

          </thead>

          <tbody>
            {scheduleRows.map((row: any) => {
              const [hour, minute] = row.departure.split(":");

              const arrival =
                `${String((Number(hour) + 1) % 24).padStart(2, "0")}:${minute}`;

              return (
                <tr
                  key={row.trainId}
                  className="border-b border-slate-800 hover:bg-slate-800"
                >
                  <td className="py-3 font-semibold">
                    TR-{row.trainId}
                  </td>

                  <td>{row.station}</td>

                  <td>{row.line}</td>

                  <td className="text-center">
                    {row.departure}
                  </td>

                  <td className="text-center">
                    {arrival}
                  </td>

                  <td className="text-center">
                    {data.recommended_frequency} min
                  </td>

                  <td className="text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${row.delayed
                        ? "bg-red-500/20 text-red-400"
                        : "bg-green-500/20 text-green-400"
                        }`}
                    >
                      {row.delayed ? "Delayed" : "On Time"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>

        </table>

      </div>

    </div>

  );

}