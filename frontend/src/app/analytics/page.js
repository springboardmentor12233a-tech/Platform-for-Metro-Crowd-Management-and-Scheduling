"use client";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function AnalyticsPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/analytics")
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 px-6 py-10">
        <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Analytics Dashboard</h1>
          <p className="text-slate-500 mt-1">Passenger traffic and station performance</p>
        </div>

        {!data ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500">
            Loading analytics...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <p className="text-sm text-slate-500">Total Stations</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{data.total_stations}</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <p className="text-sm text-slate-500">Total Network Capacity</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{data.total_capacity}</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <p className="text-sm text-slate-500">Total Schedules</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{data.total_schedules}</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <p className="text-sm text-slate-500">On Time</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{data.on_time_count}</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <p className="text-sm text-slate-500">Delayed</p>
              <p className="text-3xl font-bold text-red-600 mt-1">{data.delayed_count}</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <p className="text-sm text-slate-500">Total Alerts</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{data.total_alerts}</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm sm:col-span-2 md:col-span-3">
              <p className="text-sm text-slate-500 mb-3">Alerts by Type</p>
              <div className="space-y-2">
                {Object.entries(data.alerts_by_type).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-slate-700">{type}</span>
                    <span className="font-semibold text-slate-900">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
        </>
  );
}