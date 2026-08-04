"use client";

import React, { useState, useEffect } from "react";
import CommandCenterLayout from "@/components/CommandCenterLayout";
import { api } from "@/utils/api";
import { Trash2, Search, Calendar, Cpu } from "lucide-react";

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [stationFilter, setStationFilter] = useState("");
  const [crowdFilter, setCrowdFilter] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("metroflow_user");
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    }
    fetchHistory();
  }, [page, stationFilter, crowdFilter]);

  const fetchHistory = async () => {
    try {
      const res = await api.predict.history({
        page,
        limit,
        station: stationFilter || undefined,
        crowd_level: crowdFilter || undefined
      });
      setHistory(res.data || []);
      setTotal(res.total_records || 0);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this prediction log entry?")) return;
    try {
      await api.predict.deleteHistory(id);
      fetchHistory();
    } catch (err: any) {
      alert(err.message || "Failed to delete prediction entry.");
    }
  };

  const getCrowdBadgeColor = (level: string) => {
    switch (level) {
      case "Very High": return "bg-red-950/80 text-red-400 border-red-800/40";
      case "High": return "bg-orange-950/80 text-orange-400 border-orange-800/40";
      case "Medium": return "bg-yellow-950/80 text-yellow-400 border-yellow-800/40";
      default: return "bg-green-950/80 text-green-400 border-green-800/40";
    }
  };

  if (loading && page === 1) {
    return (
      <CommandCenterLayout>
        <div className="flex h-full w-full items-center justify-center text-cyan-400">
          <div className="flex flex-col items-center space-y-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>
            <p className="font-mono text-xs tracking-wider text-cyan-300">QUERYING PREDICTION HISTORY DATABASE...</p>
          </div>
        </div>
      </CommandCenterLayout>
    );
  }

  const role = currentUser?.role || "user";
  const canDelete = role === "admin";

  return (
    <CommandCenterLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl font-bold tracking-wider font-mono text-cyan-400 text-glow-cyan">
            FORECAST LOG HISTORY
          </h1>
          <p className="text-xs text-slate-500 font-mono">Traceability log of historical crowd prediction queries</p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Filter by station name..."
              value={stationFilter}
              onChange={(e) => {
                setStationFilter(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-slate-800 bg-[#070b19]/80 py-2.5 pl-10 pr-4 font-mono text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-400"
            />
          </div>

          <select
            value={crowdFilter}
            onChange={(e) => {
              setCrowdFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-slate-800 bg-[#070b19]/80 py-2.5 px-4 font-mono text-xs text-slate-450 focus:outline-none focus:ring-1 focus:ring-cyan-400"
          >
            <option value="">All Crowd Levels</option>
            <option value="Low">Low Density</option>
            <option value="Medium">Medium Density</option>
            <option value="High">High Density</option>
            <option value="Very High">Very High Density</option>
          </select>

          <div className="flex items-center justify-end font-mono text-[10px] text-slate-500 tracking-wider">
            LOG ENTRIES: {total} RECORDS DETECTED
          </div>
        </div>

        {/* History Table */}
        <div className="rounded-xl border border-slate-800 bg-[#070b19] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 uppercase text-[9px] tracking-wider">
                  <th className="p-4">Timetable Segment</th>
                  <th className="p-4">Features Checked</th>
                  <th className="p-4">Passengers Count</th>
                  <th className="p-4">Density Level</th>
                  <th className="p-4">Query Time</th>
                  {canDelete && <th className="p-4 text-right">Delete</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850 text-slate-300">
                {history.map(item => (
                  <tr key={item.prediction_id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-4 font-bold text-slate-200">
                      {item.from_station} → {item.to_station}
                    </td>
                    <td className="p-4 text-slate-400 text-[10px]">
                      Hour: {item.hour}:00 | Weather: {item.weather} | Interchange: {item.is_interchange ? "Yes" : "No"}
                    </td>
                    <td className="p-4 font-bold text-cyan-400">{item.predicted_passengers}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getCrowdBadgeColor(item.crowd_level)}`}>
                        {item.crowd_level}
                      </span>
                    </td>
                    <td className="p-4 flex items-center space-x-2 text-slate-500">
                      <Calendar size={13} />
                      <span>{new Date(item.prediction_time).toLocaleString()}</span>
                    </td>
                    {canDelete && (
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDelete(item.prediction_id)}
                          className="p-1.5 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {total > limit && (
          <div className="flex justify-center space-x-2 pt-4">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="rounded bg-slate-850 border border-slate-800 py-1.5 px-3.5 font-mono text-[10px] text-slate-400 hover:text-slate-200 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none"
            >
              PREV
            </button>
            <span className="flex items-center px-4 font-mono text-[10px] text-slate-500">
              PAGE {page} OF {Math.ceil(total / limit)}
            </span>
            <button
              disabled={page >= Math.ceil(total / limit)}
              onClick={() => setPage(page + 1)}
              className="rounded bg-slate-850 border border-slate-800 py-1.5 px-3.5 font-mono text-[10px] text-slate-400 hover:text-slate-200 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none"
            >
              NEXT
            </button>
          </div>
        )}
      </div>
    </CommandCenterLayout>
  );
}
