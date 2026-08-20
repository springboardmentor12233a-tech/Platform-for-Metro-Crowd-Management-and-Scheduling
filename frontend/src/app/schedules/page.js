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