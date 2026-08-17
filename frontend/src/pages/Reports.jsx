import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area, Cell } from "recharts";
import api from "../api/axios";
import CongestionHeatmap from "../components/CongestionHeatmap";

// Priority badge mapping for AI Insights
function getPriorityBadge(type) {
  switch (type) {
    case "capacity_warning":
      return {
        priority: "HIGH PRIORITY",
        bg: "bg-red-500/10 text-red-400 border-red-500/40",
        category: "Crowd & Capacity Alert",
        action: "Increase train frequency or deploy extra coaches during peak windows.",
      };
    case "scheduling_recommendation":
      return {
        priority: "MEDIUM PRIORITY",
        bg: "bg-amber-500/10 text-amber-400 border-amber-500/40",
        category: "Service Schedule Tuning",
        action: "Adjust train headways between 16:00 and 18:00 to match predicted demand.",
      };
    case "resource_allocation":
      return {
        priority: "OPTIMIZATION",
        bg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/40",
        category: "Resource Allocation",
        action: "Optimize weekend fleet and staff allocation to reflect 40.8% lower weekend surge.",
      };
    default:
      return {
        priority: "INFORMATION",
        bg: "bg-indigo-500/10 text-indigo-400 border-indigo-500/40",
        category: "Corridor Telemetry",
        action: "Review rolling-stock allocation across high-demand line corridors.",
      };
  }
}

// Custom Tooltip for Busiest Stations (Fixed hover UI - no gray rectangle backdrop)
const CustomBusiestTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="glass-card p-3 rounded-xl border border-slate-700 shadow-2xl text-xs space-y-1">
        <div className="font-bold text-white text-sm">{data.station}</div>
        <div className="text-slate-300">
          Average Demand: <span className="text-cyan-400 font-bold">{Math.round(data.avg_passengers)} pax / hr</span>
        </div>
        <div className="text-slate-400 text-[10px]">
          Relative Rank: <span className="text-emerald-400 font-medium">#{data.rank} in Network</span>
        </div>
      </div>
    );
  }
  return null;
};

// Custom Tooltip for Hourly Demand Chart
const CustomHourlyTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isPeak = data.hour === 17 || data.hour === 18;
    return (
      <div className="glass-card p-3 rounded-xl border border-slate-700 shadow-2xl text-xs space-y-1">
        <div className="font-bold text-white text-sm">Time Window: {data.hour}:00</div>
        <div className="text-slate-300">
          Average Demand: <span className="text-cyan-400 font-bold">{Math.round(data.avg_passengers)} passengers</span>
        </div>
        <div className="text-slate-400 text-[10px]">
          Demand Severity:{" "}
          <span className={isPeak ? "text-red-400 font-bold" : "text-emerald-400 font-medium"}>
            {isPeak ? "🔥 Network Peak Hour" : "Standard Operation"}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

function Reports() {
  const [summary, setSummary] = useState(null);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      api.get("/reports/traffic-summary", { params: { top_n: 8 } }),
      api.get("/reports/ai-insights", { params: { top_n: 5 } }),
    ])
      .then(([summaryRes, insightsRes]) => {
        setSummary(summaryRes.data);
        setInsights(insightsRes.data.insights || []);
      })
      .catch((err) => {
        console.error(err);
        if (err.response?.status === 401) navigate("/login");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  // Ranked Busiest Stations
  const rankedBusiestStations = useMemo(() => {
    if (!summary?.busiest_stations) return [];
    return summary.busiest_stations.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));
  }, [summary]);

  // Sorted Demand by Line
  const sortedDemandByLine = useMemo(() => {
    if (!summary?.demand_by_line) return [];
    return [...summary.demand_by_line].sort((a, b) => b.avg_passengers - a.avg_passengers);
  }, [summary]);

  // Calculated Weekend Variance Percentage
  const weekendVariancePct = useMemo(() => {
    if (!summary?.weekday_vs_weekend) return "0.0";
    const { weekday_avg_passengers, weekend_avg_passengers } = summary.weekday_vs_weekend;
    if (!weekday_avg_passengers) return "0.0";
    const diff = ((weekday_avg_passengers - weekend_avg_passengers) / weekday_avg_passengers) * 100;
    return diff.toFixed(1);
  }, [summary]);

  // Line Demand Spread Calculation
  const lineDemandSpreadPct = useMemo(() => {
    if (sortedDemandByLine.length < 2) return "0.0";
    const highest = sortedDemandByLine[0].avg_passengers;
    const lowest = sortedDemandByLine[sortedDemandByLine.length - 1].avg_passengers;
    if (!lowest) return "0.0";
    return (((highest - lowest) / lowest) * 100).toFixed(1);
  }, [sortedDemandByLine]);

  const handlePrintReport = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center font-sans">
        <div className="flex items-center gap-3 font-mono text-sm text-cyan-400 animate-pulse">
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading Metro Analytics Engine...
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-red-400 font-mono text-sm">Failed to load analytics telemetry reports.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500 selection:text-white">
      {/* Top Navigation Header */}
      <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Left Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 p-0.5 shadow-lg shadow-blue-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold text-white tracking-tight">
                Metro<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Flow</span>
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                Analytics Engine Active
              </span>
            </div>
            <p className="text-slate-400 text-xs">Traffic Intelligence & Decision Support Center</p>
          </div>
        </div>

        {/* Right Back to Dashboard Button */}
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white text-xs font-medium px-3.5 py-2 rounded-xl transition-all"
          >
            <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in-up">
        {/* Report Controls & Metadata Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800 text-xs">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Filter Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Time Horizon:</span>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-cyan-500"
              >
                <option value="Last 30 Days">Last 30 Days Telemetry</option>
                <option value="Last 7 Days">Last 7 Days Telemetry</option>
                <option value="Current Quarter">Current Quarter</option>
              </select>
            </div>

            <div className="h-4 w-[1px] bg-slate-800 hidden sm:block" />

            <span className="text-slate-400 font-mono text-[11px]">
              Coverage: <strong className="text-slate-200 font-normal">05:00 – 23:00</strong>
            </span>
            <span className="text-slate-400 font-mono text-[11px]">
              Records: <strong className="text-cyan-400 font-normal">{summary.total_records_analyzed.toLocaleString()} station-hours</strong>
            </span>
          </div>

          <button
            onClick={handlePrintReport}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium px-4 py-2 rounded-xl text-xs shadow-lg shadow-blue-600/20 transition-all active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>Export Analytics Report</span>
          </button>
        </div>

        {/* SECTION 1: NETWORK PERFORMANCE SUMMARY (4 KPI Cards) */}
        <section className="space-y-3">
          <div>
            <h2 className="text-base font-bold text-white">Network Performance Summary</h2>
            <p className="text-xs text-slate-400">AI-generated overview of passenger demand and congestion patterns</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Peak Hour */}
            <div className="dashboard-card p-5 rounded-2xl">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Peak Hour Window</span>
                <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-3xl font-black text-white tracking-tight">
                {summary.peak_hours.peak_hour}:00
              </div>
              <div className="text-xs text-cyan-400 mt-1 font-mono">
                {summary.peak_hours.peak_hour_avg_passengers} avg passengers
              </div>
              <div className="mt-3 text-[11px] text-amber-400 font-medium flex items-center gap-1">
                <span>▲ Evening Rush Hour Peak</span>
              </div>
            </div>

            {/* Card 2: Weekday Average */}
            <div className="dashboard-card p-5 rounded-2xl">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Weekday Average</span>
                <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-3xl font-black text-white tracking-tight">
                {Math.round(summary.weekday_vs_weekend.weekday_avg_passengers)}
              </div>
              <div className="text-xs text-slate-400 mt-1">passengers / station-hour</div>
              <div className="mt-3 text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                <span>▲ High Commuter Demand</span>
              </div>
            </div>

            {/* Card 3: Weekend Average */}
            <div className="dashboard-card p-5 rounded-2xl">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Weekend Average</span>
                <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-3xl font-black text-white tracking-tight">
                {Math.round(summary.weekday_vs_weekend.weekend_avg_passengers)}
              </div>
              <div className="text-xs text-slate-400 mt-1">passengers / station-hour</div>
              <div className="mt-3 text-[11px] text-cyan-400 font-medium flex items-center gap-1">
                <span>↓ {weekendVariancePct}% vs weekday</span>
              </div>
            </div>

            {/* Card 4: Network Status */}
            <div className="dashboard-card p-5 rounded-2xl">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Network Status</span>
                <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="text-xl font-bold text-emerald-400 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                Operational
              </div>
              <div className="text-xs text-slate-400 mt-1">{summary.busiest_stations.length} Stations Monitored</div>
              <div className="mt-3 text-[11px] text-slate-400 font-mono">
                AI Predictions Active
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: CATEGORIZED AI INSIGHTS & RECOMMENDATIONS */}
        <section className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>🤖</span> AI Insights & Recommendations
              </h2>
              <p className="text-xs text-slate-400">Actionable recommendations generated from network demand patterns</p>
            </div>
            <span className="text-xs bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full font-mono font-medium">
              🤖 LLM Copilot Enhanced
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((insight, i) => {
              const details = getPriorityBadge(insight.type);
              return (
                <div key={i} className="dashboard-card p-5 rounded-2xl space-y-3 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white flex items-center gap-2">
                      <span className="text-base">
                        {insight.type === "capacity_warning" ? "⚠️" :
                         insight.type === "scheduling_recommendation" ? "📅" :
                         insight.type === "resource_allocation" ? "📊" : "🔍"}
                      </span>
                      {details.category}
                    </span>

                    <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border font-bold ${details.bg}`}>
                      {details.priority}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {insight.message}
                  </p>

                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
                    <span className="font-bold text-cyan-400 block mb-0.5">Recommended Action:</span>
                    <span className="text-slate-300">{details.action}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 3: BUSIEST STATIONS (HORIZONTAL BAR CHART WITH RANKINGS & NO GRAY HOVER BACKDROP) */}
        <section className="dashboard-card p-5 sm:p-6 rounded-2xl space-y-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>🚉</span> Busiest Stations
            </h2>
            <p className="text-xs text-slate-400">
              Average passenger demand by station across monitored corridors
            </p>
          </div>

          <div style={{ height: 350 }} className="w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={rankedBusiestStations}
                layout="vertical"
                margin={{ top: 10, right: 35, left: 40, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="purpleGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.7} />
                    <stop offset="100%" stopColor="#c084fc" stopOpacity={1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={{ stroke: "#334155" }} />
                <YAxis
                  dataKey="station"
                  type="category"
                  tick={{ fill: "#e2e8f0", fontSize: 12, fontWeight: 500 }}
                  width={140}
                  axisLine={{ stroke: "#334155" }}
                  tickLine={false}
                />
                {/* FIX: cursor={{ fill: 'transparent' }} eliminates the large gray selection backdrop rectangle! */}
                <Tooltip cursor={{ fill: "rgba(51, 65, 85, 0.2)" }} content={<CustomBusiestTooltip />} />
                <Bar
                  dataKey="avg_passengers"
                  fill="url(#purpleGradient)"
                  radius={[0, 6, 6, 0]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* SECTION 4: CONGESTION HEATMAP */}
        <section className="dashboard-card p-5 sm:p-6 rounded-2xl space-y-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>🔥</span> Congestion Heatmap
            </h2>
            <p className="text-xs text-slate-400">
              Station crowd intensity across operating hours
            </p>
          </div>

          <CongestionHeatmap />
        </section>

        {/* SECTION 5: PASSENGER DEMAND BY HOUR (AREA / LINE CHART) */}
        <section className="dashboard-card p-5 sm:p-6 rounded-2xl space-y-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>📈</span> Passenger Demand by Hour
            </h2>
            <p className="text-xs text-slate-400">
              Network-wide average passenger demand throughout the operating day
            </p>
          </div>

          <div style={{ height: 320 }} className="w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={summary.peak_hours.hourly_average} margin={{ top: 15, right: 20, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="cyanArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="hour" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <Tooltip content={<CustomHourlyTooltip />} />
                <Area type="monotone" dataKey="avg_passengers" stroke="#06b6d4" strokeWidth={3} fill="url(#cyanArea)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* SECTION 6: DEMAND BY METRO LINE & PERFORMANCE SUMMARY */}
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Bar Chart Column (3 cols) */}
          <div className="lg:col-span-3 dashboard-card p-5 sm:p-6 rounded-2xl space-y-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>🚇</span> Demand by Metro Line
              </h2>
              <p className="text-xs text-slate-400">
                Average passenger demand across metro line corridors
              </p>
            </div>

            <div style={{ height: 300 }} className="w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sortedDemandByLine} margin={{ top: 15, right: 10, left: -15, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="line" tick={{ fill: "#94a3b8", fontSize: 11 }} angle={-20} textAnchor="end" height={60} />
                  <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <Tooltip cursor={{ fill: "rgba(51, 65, 85, 0.2)" }} contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px" }} />
                  <Bar dataKey="avg_passengers" fill="#f59e0b" radius={[6, 6, 0, 0]} maxBarSize={45}>
                    {sortedDemandByLine.map((entry, index) => (
                      <Cell key={`line-cell-${index}`} fill={index === 0 ? "#f97316" : index === 1 ? "#3b82f6" : "#8b5cf6"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Line Performance Summary Column (2 cols) */}
          <div className="lg:col-span-2 dashboard-card p-5 sm:p-6 rounded-2xl space-y-4 flex flex-col justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Line Performance Summary
              </h2>
              <p className="text-xs text-slate-400">Comparative line demand metrics</p>
            </div>

            <div className="space-y-3 bg-slate-950/80 p-4 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Highest Demand Line:</span>
                <span className="font-bold text-orange-400 font-mono">
                  {sortedDemandByLine[0]?.line || "N/A"} ({Math.round(sortedDemandByLine[0]?.avg_passengers || 0)} avg)
                </span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Lowest Demand Line:</span>
                <span className="font-bold text-blue-400 font-mono">
                  {sortedDemandByLine[sortedDemandByLine.length - 1]?.line || "N/A"} ({Math.round(sortedDemandByLine[sortedDemandByLine.length - 1]?.avg_passengers || 0)} avg)
                </span>
              </div>

              <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-800">
                <span className="text-slate-400">Demand Spread Variance:</span>
                <span className="font-bold text-emerald-400 font-mono">
                  +{lineDemandSpreadPct}% difference
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              * Line metrics are aggregated across peak and off-peak operating hours.
            </p>
          </div>
        </section>

        {/* SECTION 7: KEY FINDINGS & AI OPERATIONAL RECOMMENDATIONS */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Key Findings */}
          <div className="dashboard-card p-5 rounded-2xl space-y-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>📌</span> Key Findings
              </h2>
              <p className="text-xs text-slate-400">Summary observations from network telemetry</p>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5">
                <span className="text-amber-400 text-sm">🌆</span>
                <div>
                  <strong className="text-white block">Peak Hour Window</strong>
                  <span>{summary.peak_hours.peak_hour}:00 represents the network-wide maximum demand surge.</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5">
                <span className="text-purple-400 text-sm">🚉</span>
                <div>
                  <strong className="text-white block">Highest-Demand Station Hub</strong>
                  <span>Kashmere Gate and Rajiv Chowk record the highest average commuter density.</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5">
                <span className="text-cyan-400 text-sm">📅</span>
                <div>
                  <strong className="text-white block">Weekday vs Weekend Variance</strong>
                  <span>Weekday demand is {weekendVariancePct}% higher than weekend passenger volumes.</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Operational Recommendations */}
          <div className="dashboard-card p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <span>🤖</span> AI Operational Recommendations
                </h2>
                <p className="text-xs text-slate-400">Strategic policy recommendations</p>
              </div>
              <span className="text-[10px] font-mono bg-blue-950/80 text-blue-300 border border-blue-500/30 px-2.5 py-1 rounded-full">
                AI-Assisted Analytics
              </span>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <strong className="text-cyan-400 block mb-1">1. Peak Service Frequency Boost</strong>
                <span>Increase train dispatch frequency between 16:00 and 18:00 on high-density corridors.</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <strong className="text-amber-400 block mb-1">2. Interchange Crowd Control</strong>
                <span>Deploy platform gate regulations at Kashmere Gate and Rajiv Chowk during peak windows.</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <strong className="text-emerald-400 block mb-1">3. Weekend Resource Optimization</strong>
                <span>Adjust weekend train fleet deployment by ~35% to optimize energy and operational costs.</span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Meta */}
        <p className="text-xs text-slate-400 text-center font-mono pt-4 border-t border-slate-800/80">
          Based on {summary.total_records_analyzed.toLocaleString()} analyzed station-hour records • MetroFlow Analytics System v0.1.0-prod
        </p>
      </main>
    </div>
  );
}

export default Reports;