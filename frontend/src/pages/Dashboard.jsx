import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import api from "../api/axios";

const MONITORED_STATIONS = [
  { name: "Rajiv Chowk", line: "Blue line", color: "#3b82f6" },
  { name: "Kashmere Gate", line: "Red line", color: "#ef4444" },
  { name: "Central Secretariat", line: "Yellow line", color: "#eab308" },
  { name: "Hauz Khas", line: "Magenta line", color: "#d946ef" },
  { name: "Dwarka Sector 21", line: "Orange line", color: "#f97316" },
  { name: "New Delhi", line: "Yellow line", color: "#eab308" },
];

function getStatusBadge(status) {
  switch (status) {
    case "Critical":
      return {
        bg: "bg-red-500/10 text-red-400 border-red-500/30",
        dot: "bg-red-500",
        bar: "from-red-600 to-red-500",
      };
    case "High":
      return {
        bg: "bg-orange-500/10 text-orange-400 border-orange-500/30",
        dot: "bg-orange-500",
        bar: "from-orange-600 to-orange-500",
      };
    case "Moderate":
      return {
        bg: "bg-amber-500/10 text-amber-400 border-amber-500/30",
        dot: "bg-amber-500",
        bar: "from-amber-500 to-yellow-400",
      };
    default:
      return {
        bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
        dot: "bg-emerald-500",
        bar: "from-emerald-500 to-cyan-400",
      };
  }
}

// Custom Tooltip for Congestion Chart
const CustomChartTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const badge = getStatusBadge(data.status);
    return (
      <div className="glass-card p-3 rounded-xl border border-slate-700 shadow-2xl text-xs space-y-1.5">
        <div className="flex items-center justify-between gap-3">
          <span className="font-bold text-white text-sm">{data.name}</span>
          <span className={`px-2 py-0.5 rounded-full border text-[10px] font-medium ${badge.bg}`}>
            {data.status}
          </span>
        </div>
        <div className="text-slate-300">
          Line: <span className="text-slate-100 font-medium">{data.line}</span>
        </div>
        <div className="text-slate-300">
          Predicted Passengers: <span className="text-cyan-400 font-bold">{Math.round(data.passengers)}</span>
        </div>
        <div className="text-slate-400 text-[10px] pt-1 border-t border-slate-800">
          AI Confidence: <span className="text-emerald-400 font-medium">{data.confidence || 94}%</span>
        </div>
      </div>
    );
  }
  return null;
};

function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [stations, setStations] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHour, setSelectedHour] = useState(new Date().getHours());
  const [liveMode, setLiveMode] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/operators/me")
      .then((res) => setProfile(res.data))
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, [navigate]);

  const fetchManualPredictions = useCallback(async (hour) => {
    setLoading(true);
    try {
      const results = await Promise.all(
        MONITORED_STATIONS.map(async (station) => {
          const res = await api.get("/predictions/crowd", {
            params: { station: station.name, line: station.line, hour },
          });
          return {
            name: station.name,
            line: station.line,
            color: station.color,
            passengers: res.data.predicted_passengers,
          };
        })
      );
      setStations(results);
      setAlerts([]);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Failed to fetch predictions", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLiveStatus = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/monitoring/status");
      const results = res.data.stations.map((s) => {
        const meta = MONITORED_STATIONS.find((m) => m.name === s.station) || {};
        return {
          name: s.station,
          line: meta.line || "Metro line",
          color: meta.color || "#3b82f6",
          passengers: s.predicted_passengers,
        };
      });
      setStations(results);
      setAlerts(res.data.alerts || []);
      setSelectedHour(res.data.current_hour);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Failed to fetch live status", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (liveMode) {
      fetchLiveStatus();
      const interval = setInterval(fetchLiveStatus, 30000);
      return () => clearInterval(interval);
    } else {
      fetchManualPredictions(selectedHour);
    }
  }, [liveMode, fetchLiveStatus, fetchManualPredictions, selectedHour]);

  useEffect(() => {
    if (!liveMode) {
      fetchManualPredictions(selectedHour);
    }
  }, [selectedHour, liveMode, fetchManualPredictions]);

  const stationsWithStatus = useMemo(() => {
    return stations.map((s, index) => {
      let status = "Low";
      if (s.passengers >= 1400) status = "Critical";
      else if (s.passengers >= 900) status = "High";
      else if (s.passengers >= 400) status = "Moderate";

      // Calculate mock utilization & confidence deterministically for UI richness
      const maxCapacity = 1000;
      const utilization = Math.min(100, Math.round((s.passengers / maxCapacity) * 100));
      const confidence = 92 + (index % 5);
      const trend = (index % 2 === 0 ? "+" : "-") + (2.5 + (index * 1.1)).toFixed(1) + "%";

      return {
        ...s,
        status,
        utilization,
        confidence,
        trend,
      };
    });
  }, [stations]);

  // Aggregate Metrics for KPI Section
  const totalPassengers = useMemo(() => {
    return Math.round(stationsWithStatus.reduce((acc, curr) => acc + curr.passengers, 0));
  }, [stationsWithStatus]);

  const busiestStation = useMemo(() => {
    if (stationsWithStatus.length === 0) return { name: "N/A", count: 0 };
    const sorted = [...stationsWithStatus].sort((a, b) => b.passengers - a.passengers);
    return { name: sorted[0].name, count: Math.round(sorted[0].passengers) };
  }, [stationsWithStatus]);

  const averageCrowd = useMemo(() => {
    if (stationsWithStatus.length === 0) return 0;
    return Math.round(totalPassengers / stationsWithStatus.length);
  }, [totalPassengers, stationsWithStatus]);

  const stationsAtRisk = useMemo(() => {
    return stationsWithStatus.filter((s) => s.status === "High" || s.status === "Critical").length;
  }, [stationsWithStatus]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500 selection:text-white">
      {/* Top Application Header */}
      <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Left Branding */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 p-0.5 shadow-lg shadow-blue-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <svg className="w-5 h-5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="4" y="3" width="16" height="16" rx="2" />
                <path d="M4 11h16" />
                <path d="M12 3v8" />
                <circle cx="8" cy="15" r="1" fill="currentColor" />
                <circle cx="16" cy="15" r="1" fill="currentColor" />
                <path d="m8 19-3 3" />
                <path d="m16 19 3 3" />
              </svg>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold text-white tracking-tight">
                Metro<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Flow</span>
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                System Operational
              </span>
            </div>
            <p className="text-slate-400 text-xs">AI-Powered Metro Crowd Intelligence</p>
          </div>
        </div>

        {/* Right Header Navigation Controls */}
        <div className="flex items-center gap-3">
          {/* Live Data Badge */}
          <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-950/60 border border-blue-500/30 text-blue-400 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            LIVE DATA
          </div>

          {/* User Profile */}
          {profile && (
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
              <div className="w-6 h-6 rounded-full bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 flex items-center justify-center font-bold text-[10px]">
                {profile.full_name?.charAt(0) || "U"}
              </div>
              <span className="text-slate-200 font-medium hidden md:inline">{profile.full_name}</span>
              <span className="text-slate-500 text-[10px] font-mono">({profile.role})</span>
            </div>
          )}

          {/* Navigation Links */}
          <Link
            to="/reports"
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white text-xs font-medium px-3 py-2 rounded-xl transition-all"
          >
            <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Reports</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-red-950/60 border border-slate-700 hover:border-red-500/40 text-slate-300 hover:text-red-300 text-xs font-medium px-3 py-2 rounded-xl transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Operations Container */}
      <main className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in-up">
        {/* Active Overcrowding Alerts Banner */}
        {liveMode && alerts.length > 0 && (
          <div className="bg-red-950/60 border border-red-500/50 rounded-2xl p-4 space-y-2 shadow-xl shadow-red-950/30">
            <div className="flex items-center gap-2 text-red-300 font-bold text-sm">
              <svg className="w-5 h-5 text-red-400 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>⚠ Active Overcrowding Telemetry Alerts</span>
            </div>
            {alerts.map((alert, i) => (
              <p key={i} className="text-xs text-red-200 pl-7 font-mono">
                • {alert.message}
              </p>
            ))}
          </div>
        )}

        {/* SECTION 1: KPI SUMMARY CARDS */}
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {/* Card 1: Total Passengers */}
          <div className="dashboard-card p-4 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Total Passengers</span>
              <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="text-2xl font-black text-white tracking-tight">{totalPassengers.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-400 mt-1 font-medium">
              <span>↑ +8.4%</span>
              <span className="text-slate-500 font-normal">vs prev hour</span>
            </div>
          </div>

          {/* Card 2: Busiest Station */}
          <div className="dashboard-card p-4 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Busiest Station</span>
              <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="text-lg font-bold text-white truncate">{busiestStation.name}</div>
            <div className="text-xs text-slate-400 mt-1 font-mono">{busiestStation.count} passengers</div>
          </div>

          {/* Card 3: Average Crowd */}
          <div className="dashboard-card p-4 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Average Crowd</span>
              <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="text-2xl font-black text-white tracking-tight">{averageCrowd}</div>
            <div className="text-xs text-slate-400 mt-1">commuters / station</div>
          </div>

          {/* Card 4: Stations at Risk */}
          <div className="dashboard-card p-4 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Stations at Risk</span>
              <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className={`text-2xl font-black tracking-tight ${stationsAtRisk > 0 ? "text-red-400" : "text-emerald-400"}`}>
              {stationsAtRisk}
            </div>
            <div className="text-xs text-slate-400 mt-1">High/Critical threshold</div>
          </div>

          {/* Card 5: Network Status */}
          <div className="dashboard-card p-4 rounded-2xl col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Network Status</span>
              <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-lg font-bold text-emerald-400 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              Operational
            </div>
            <div className="text-xs text-slate-400 mt-1">Normal capacity surge</div>
          </div>
        </section>

        {/* SECTION 2: LIVE STATION CROWD INTELLIGENCE */}
        <section className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Live Station Crowd Intelligence
                <span className="text-xs font-normal text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                  AI Predicted
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                AI-predicted passenger density across the metro network
              </p>
            </div>

            {/* Controls: Live Toggle & Hour Selector */}
            <div className="flex items-center gap-5">
              {/* Modern Live Switch */}
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                  LIVE
                  <span className={`w-2 h-2 rounded-full ${liveMode ? "bg-emerald-400 animate-ping" : "bg-slate-600"}`} />
                </span>
                <button
                  type="button"
                  onClick={() => setLiveMode(!liveMode)}
                  className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-200 ease-in-out border ${
                    liveMode ? "bg-emerald-600 border-emerald-400" : "bg-slate-800 border-slate-700"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                      liveMode ? "translate-x-6" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              {/* Hour Dropdown */}
              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-400 font-medium">Hour:</label>
                <select
                  value={selectedHour}
                  disabled={liveMode}
                  onChange={(e) => setSelectedHour(Number(e.target.value))}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 disabled:opacity-50 transition-colors"
                >
                  {Array.from({ length: 19 }, (_, i) => i + 5).map((h) => (
                    <option key={h} value={h}>{h}:00</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {liveMode && lastUpdated && (
            <p className="text-xs text-slate-400 flex items-center gap-1.5 px-1 font-mono">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              Live Telemetry — last sync {lastUpdated.toLocaleTimeString()} (auto-refreshes every 30s)
            </p>
          )}

          {/* Station Cards Grid */}
          {loading ? (
            <div className="p-8 text-center text-slate-400 animate-pulse font-mono text-sm">
              Analyzing station crowd telemetry...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {stationsWithStatus.map((station) => {
                const badge = getStatusBadge(station.status);
                return (
                  <div key={station.name} className="dashboard-card p-5 rounded-2xl relative overflow-hidden group">
                    {/* Top Metro Line Indicator */}
                    <div 
                      className="absolute top-0 left-0 right-0 h-1 opacity-80"
                      style={{ backgroundColor: station.color }}
                    />

                    {/* Header: Station Name & Line Badge */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <rect x="4" y="3" width="16" height="16" rx="2" />
                            <path d="M4 11h16" />
                          </svg>
                          <h3 className="font-bold text-white text-base tracking-tight">{station.name}</h3>
                        </div>
                        <span className="text-[11px] text-slate-400 pl-6 block font-medium">
                          {station.line}
                        </span>
                      </div>

                      <span className={`text-xs px-2.5 py-1 rounded-full border font-bold flex items-center gap-1.5 ${badge.bg}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                        {station.status}
                      </span>
                    </div>

                    {/* Passengers & Progress Bar */}
                    <div className="mt-4 mb-3">
                      <div className="flex items-baseline justify-between mb-1.5">
                        <span className="text-2xl font-black text-white tracking-tight">
                          {Math.round(station.passengers)}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          Capacity {station.utilization}%
                        </span>
                      </div>

                      {/* Animated Utilization Progress Bar */}
                      <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800 p-0.5">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${badge.bar} transition-all duration-500`}
                          style={{ width: `${station.utilization}%` }}
                        />
                      </div>
                    </div>

                    {/* Card Footer: AI Confidence & Trend */}
                    <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800/80">
                      <span>AI Confidence: <strong className="text-emerald-400 font-semibold">{station.confidence}%</strong></span>
                      <span className={station.trend.startsWith("+") ? "text-emerald-400 font-semibold" : "text-cyan-400 font-semibold"}>
                        ↗ {station.trend}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* SECTION 3: NETWORK CONGESTION CHART & METRO MAP */}
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Chart Column (3 cols) */}
          <div className="lg:col-span-3 dashboard-card p-5 sm:p-6 rounded-2xl space-y-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Network Congestion Overview
              </h2>
              <p className="text-xs text-slate-400">
                AI-predicted passenger volume by station
              </p>
            </div>

            <div style={{ height: 320 }} className="w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stationsWithStatus} margin={{ top: 15, right: 10, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity={1} />
                      <stop offset="100%" stopColor="#1e3a8a" stopOpacity={0.7} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: "#94a3b8", fontSize: 11 }} 
                    axisLine={{ stroke: "#334155" }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fill: "#94a3b8", fontSize: 11 }} 
                    axisLine={{ stroke: "#334155" }}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Bar 
                    dataKey="passengers" 
                    fill="url(#barGradient)" 
                    radius={[6, 6, 0, 0]}
                    maxBarSize={45}
                  >
                    {stationsWithStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} opacity={0.85} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Metro Network Map Column (2 cols) */}
          <div className="lg:col-span-2 dashboard-card p-5 sm:p-6 rounded-2xl space-y-4 flex flex-col justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Metro Network Status
              </h2>
              <p className="text-xs text-slate-400">
                Schematic line connectivity & live station congestion
              </p>
            </div>

            {/* Schematic Route Map Visual */}
            <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800/80 space-y-4 my-auto">
              <div className="relative space-y-3.5">
                {/* Connecting Track Line Accent */}
                <div className="absolute left-[15px] top-3 bottom-3 w-1 bg-gradient-to-b from-blue-500 via-yellow-500 to-red-500 opacity-60 rounded-full" />

                {stationsWithStatus.map((s) => {
                  const badge = getStatusBadge(s.status);
                  return (
                    <div key={s.name} className="relative flex items-center justify-between pl-8 pr-2 py-1 group">
                      {/* Station Connectivity Dot */}
                      <div className="absolute left-2.5 w-3 h-3 rounded-full bg-slate-950 border-2 border-cyan-400 shadow-md group-hover:scale-125 transition-transform" style={{ borderColor: s.color }}>
                        <div className={`w-full h-full rounded-full ${badge.dot}`} />
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-white">{s.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({s.line.split(" ")[0]})</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-cyan-400 font-bold">{Math.round(s.passengers)}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${badge.bg}`}>
                          {s.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Low</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> Moderate</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> High</span>
              </div>
              <span className="font-mono text-slate-400">6 Stations Active</span>
            </div>
          </div>
        </section>

        {/* SECTION 4: AI INSIGHTS & NETWORK HEALTH */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* AI Crowd Insights */}
          <div className="dashboard-card p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <span>🤖</span> AI Crowd Insights
                </h2>
                <p className="text-xs text-slate-400">Algorithmic observations & demand forecasting</p>
              </div>
              <span className="text-[10px] font-mono bg-blue-950/80 text-blue-300 border border-blue-500/30 px-2.5 py-1 rounded-full">
                Simulated AI Prediction
              </span>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5">
                <span className="text-cyan-400 text-sm">💡</span>
                <p>
                  <strong className="text-white">{busiestStation.name}</strong> currently records peak predicted demand with <strong className="text-cyan-300">{busiestStation.count} passengers</strong>.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5">
                <span className="text-emerald-400 text-sm">📊</span>
                <p>
                  Overall network crowd utilization averages <strong className="text-emerald-300">{averageCrowd} commuters / station</strong> across monitored lines.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5">
                <span className="text-indigo-400 text-sm">🚆</span>
                <p>
                  AI Dispatch Recommendation: Maintain standard 3.5-minute headway on Yellow & Blue Line corridors.
                </p>
              </div>
            </div>
          </div>

          {/* Network Health */}
          <div className="dashboard-card p-5 rounded-2xl space-y-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>🛡️</span> Network Health
              </h2>
              <p className="text-xs text-slate-400">Infrastructure telemetry & system diagnostics</p>
            </div>

            <div className="divide-y divide-slate-800 text-xs">
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-400">System Status</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Operational
                </span>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-400">Telemetry Data Feed</span>
                <span className="text-cyan-400 font-medium font-mono">
                  {liveMode ? "Live Stream (30s)" : "Simulated AI Prediction"}
                </span>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-400">AI Prediction Engine</span>
                <span className="text-slate-200 font-medium font-mono">v2.4 Neural Model</span>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-400">Stations Monitored</span>
                <span className="text-slate-200 font-medium font-mono">6 Stations</span>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-400">Last Telemetry Sync</span>
                <span className="text-slate-300 font-mono text-[11px]">
                  {lastUpdated ? lastUpdated.toLocaleTimeString() : "Syncing..."}
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;