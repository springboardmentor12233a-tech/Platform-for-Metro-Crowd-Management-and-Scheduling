"use client";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/schedules")
      .then((res) => res.json())
      .then((data) => setSchedules(data));
  }, []);

  const adjustFrequency = async (id, currentFreq, delta) => {
    const newFreq = Math.max(1, currentFreq + delta);
    await fetch(`http://localhost:8000/schedules/${id}?frequency_minutes=${newFreq}`, {
      method: "PUT",
    });
    fetch("http://localhost:8000/schedules")
      .then((res) => res.json())
      .then((data) => setSchedules(data));
  };

  const [delayStation, setDelayStation] = useState("");
  const [delayMinutes, setDelayMinutes] = useState("");
  const [delaySubmitting, setDelaySubmitting] = useState(false);

  const handleReportDelay = async (e) => {
    e.preventDefault();
    setDelaySubmitting(true);
    const res = await fetch(
      `http://localhost:8000/report-delay?station=${encodeURIComponent(delayStation)}&delay_minutes=${delayMinutes}`,
      { method: "POST" }
    );
    const data = await res.json();
    alert(data.message || "Delay reported");
    setDelayStation("");
    setDelayMinutes("");
    setDelaySubmitting(false);
    fetch("http://localhost:8000/schedules")
      .then((res) => res.json())
      .then((data) => setSchedules(data));
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 px-6 py-10">
        <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Train Schedules
          </h1>
          <p className="text-slate-500 mt-1">
            Live schedule data from backend
          </p>
        </div>

        <form
          onSubmit={handleReportDelay}
          className="bg-white border border-slate-200 rounded-xl p-5 mb-6 flex gap-3 items-end"
        >
          <div className="flex-1">
            <label className="block text-sm text-slate-600 mb-1">Station</label>
            <input
             value={delayStation}
             onChange={(e) => setDelayStation(e.target.value)}
             placeholder="e.g. Rajiv Chowk"
             required
             className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-400"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm text-slate-600 mb-1">Delay (minutes)</label>
            <input
              type="number"
              value={delayMinutes}
              onChange={(e) => setDelayMinutes(e.target.value)}
              placeholder="e.g. 20"
              required
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-400"
            />
          </div>
          <button
            type="submit"
            disabled={delaySubmitting}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700"
          >
            {delaySubmitting ? "Reporting..." : "Report Delay"}
          </button>
        </form>

        {schedules.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500">
            No schedules found. Add one via /docs first.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {schedules.map((schedule) => (
              <div
                key={schedule.id}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <h2 className="text-lg font-semibold text-slate-900">
                  {schedule.station_name}
                </h2>
                <p className="text-slate-500 text-sm mt-2">
                  Departure: {schedule.departure_time}
                </p>
                <p className="text-slate-500 text-sm">
                  Frequency: every {schedule.frequency_minutes} min
                </p>

                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => adjustFrequency(schedule.id, schedule.frequency_minutes, -1)}
                    className="w-6 h-6 bg-slate-200 text-slate-900 rounded text-sm font-bold hover:bg-slate-300"
                  >
                    −
                  </button>
                  <button
                    onClick={() => adjustFrequency(schedule.id, schedule.frequency_minutes, 1)}
                    className="w-6 h-6 bg-slate-200 text-slate-900 rounded text-sm font-bold hover:bg-slate-300"
                  >
                    +
                  </button>
                </div>
                <span
                  className={`inline-block mt-2 text-xs font-medium px-2 py-1 rounded-full border ${
                    schedule.status === "Delayed"
                      ? "bg-red-100 text-red-700 border-red-200"
                      : "bg-blue-100 text-blue-700 border-blue-200"
                  }`}
                >
                  {schedule.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
        </>
  );
}