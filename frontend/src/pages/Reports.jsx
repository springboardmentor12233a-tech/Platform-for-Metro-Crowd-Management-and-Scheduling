import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from "recharts";
import api from "../api/axios";
import CongestionHeatmap from "../components/CongestionHeatmap";

function Reports() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/reports/traffic-summary", { params: { top_n: 8 } })
      .then((res) => setSummary(res.data))
      .catch((err) => {
        console.error(err);
        if (err.response?.status === 401) navigate("/login");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <p className="text-slate-400">Loading traffic reports...</p>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <p className="text-red-400">Failed to load reports.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
        <div>
          <h1 className="text-xl font-bold">MetroFlow</h1>
          <p className="text-slate-400 text-sm">Traffic Analysis Reports</p>
        </div>
        <Link to="/dashboard" className="bg-slate-700 hover:bg-slate-600 text-sm px-3 py-1.5 rounded">
          ← Back to Dashboard
        </Link>
      </header>

      <main className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <p className="text-slate-400 text-sm">Peak Hour (Network-wide)</p>
            <p className="text-2xl font-bold mt-1">{summary.peak_hours.peak_hour}:00</p>
            <p className="text-slate-500 text-xs mt-1">{summary.peak_hours.peak_hour_avg_passengers} avg passengers</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <p className="text-slate-400 text-sm">Weekday Avg</p>
            <p className="text-2xl font-bold mt-1">{Math.round(summary.weekday_vs_weekend.weekday_avg_passengers)}</p>
            <p className="text-slate-500 text-xs mt-1">passengers per station-hour</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <p className="text-slate-400 text-sm">Weekend Avg</p>
            <p className="text-2xl font-bold mt-1">{Math.round(summary.weekday_vs_weekend.weekend_avg_passengers)}</p>
            <p className="text-slate-500 text-xs mt-1">passengers per station-hour</p>
          </div>
        </div>

        <section>
          <h2 className="text-lg font-semibold mb-3">Busiest Stations (Average Demand)</h2>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700" style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summary.busiest_stations} layout="vertical" margin={{ left: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <YAxis dataKey="station" type="category" tick={{ fill: "#94a3b8", fontSize: 12 }} width={120} />
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155" }} labelStyle={{ color: "#e2e8f0" }} />
                <Bar dataKey="avg_passengers" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

<section>
  <h2 className="text-lg font-semibold mb-3">Congestion Heatmap (Station × Hour)</h2>
  <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
    <CongestionHeatmap />
  </div>
</section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Average Demand by Hour of Day</h2>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700" style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={summary.peak_hours.hourly_average}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="hour" tick={{ fill: "#94a3b8", fontSize: 12 }} label={{ value: "Hour", position: "insideBottom", offset: -5, fill: "#94a3b8" }} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155" }} labelStyle={{ color: "#e2e8f0" }} />
                <Line type="monotone" dataKey="avg_passengers" stroke="#22d3ee" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Average Demand by Line</h2>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700" style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summary.demand_by_line}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="line" tick={{ fill: "#94a3b8", fontSize: 11 }} angle={-20} textAnchor="end" height={70} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155" }} labelStyle={{ color: "#e2e8f0" }} />
                <Bar dataKey="avg_passengers" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <p className="text-xs text-slate-500 text-center">
          Based on {summary.total_records_analyzed.toLocaleString()} analyzed station-hour records
        </p>
      </main>
    </div>
  );
}

export default Reports;