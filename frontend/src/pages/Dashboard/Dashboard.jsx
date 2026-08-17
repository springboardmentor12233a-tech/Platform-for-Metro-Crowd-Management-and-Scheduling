import { useEffect, useState } from "react";

import {
  Users,
  TrainFront,
  MapPinned,
  IndianRupee,
  Bot,
  Gauge,
  Building2,
  ShieldAlert,
  Sparkles,
  Activity,
  RefreshCw,
  ArrowUpRight,
  Clock3,
  BrainCircuit,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

// Dashboard Components
import MetricCard from "../../components/dashboard/MetricCard";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import MetroStatusCard from "../../components/dashboard/MetroStatusCard";
import TopRoutesTable from "../../components/dashboard/TopRoutesTable";
import AIOperationsCenter from "../../components/dashboard/AIOperationsCenter";
import AIAssistant from "../../components/dashboard/AIAssistant";

// Dashboard APIs
import {
  getDashboardSummary,
  getBusiestStations,
  getPassengerTrend,
  getTicketDistribution,
  getRevenueAnalysis,
  getTopRoutes,
  getLiveDashboard,
} from "../../api/dashboardApi";

// AI APIs
import {
  generateRecommendation,
  getRecommendationHistory,
} from "../../api/ai";

// =====================================================
// OCCUPANCY HELPER
// =====================================================

const getOccupancyStyle = (occupancy) => {
  if (occupancy >= 90) {
    return {
      status: "Critical",
      badgeClass: "bg-red-50 text-red-600 border-red-200",
      barClass: "bg-red-500",
      accentClass: "text-red-600",
      recommendation:
        "Immediately increase train frequency, deploy additional station staff, open all AFC gates, and broadcast crowd-control announcements.",
    };
  }

  if (occupancy >= 75) {
    return {
      status: "Warning",
      badgeClass: "bg-amber-50 text-amber-600 border-amber-200",
      barClass: "bg-amber-500",
      accentClass: "text-amber-600",
      recommendation:
        "Prepare standby trains, monitor passenger flow continuously, and deploy additional security personnel.",
    };
  }

  return {
    status: "Healthy",
    badgeClass: "bg-emerald-50 text-emerald-600 border-emerald-200",
    barClass: "bg-emerald-500",
    accentClass: "text-emerald-600",
    recommendation:
      "Passenger movement is within normal operating limits. Continue routine monitoring.",
  };
};

// =====================================================
// DATA NORMALIZERS
// =====================================================

const normalizeTrend = (data) => {
  if (!Array.isArray(data)) return [];

  return data.map((item, i) => ({
    label:
      item.label ??
      item.date ??
      item.day ??
      item.hour ??
      item.time ??
      `#${i + 1}`,
    passengers:
      Number(
        item.passengers ??
          item.value ??
          item.count ??
          item.total ??
          0
      ) || 0,
  }));
};

const normalizeTicketData = (data) => {
  if (!Array.isArray(data)) return [];

  return data.map((item) => ({
    name:
      item.name ??
      item.type ??
      item.ticket_type ??
      item.category ??
      "Unknown",
    value:
      Number(
        item.value ??
          item.count ??
          item.total ??
          0
      ) || 0,
  }));
};

const normalizeRevenueData = (data) => {
  if (!Array.isArray(data)) return [];

  return data.map((item, i) => ({
    label:
      item.label ??
      item.month ??
      item.date ??
      item.day ??
      `#${i + 1}`,
    revenue:
      Number(
        item.revenue ??
          item.value ??
          item.amount ??
          item.total ??
          0
      ) || 0,
  }));
};

const TICKET_COLORS = [
  "#4f46e5",
  "#06b6d4",
  "#f97316",
  "#16a34a",
  "#e11d48",
  "#7c3aed",
];

// =====================================================
// DASHBOARD
// =====================================================

const Dashboard = () => {
  const REFRESH_INTERVAL = 30000;

  // =====================================================
  // STATE
  // =====================================================

  const [loading, setLoading] = useState(true);

  const [summary, setSummary] = useState({
    total_passengers: 0,
    total_trips: 0,
    total_stations: 0,
    total_revenue: 0,
  });

  const [busiestStations, setBusiestStations] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [ticketData, setTicketData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [topRoutes, setTopRoutes] = useState([]);

  const [latestPrediction, setLatestPrediction] = useState(null);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [recentHistory, setRecentHistory] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const [aiRecommendation, setAiRecommendation] = useState(null);
  const [loadingRecommendation, setLoadingRecommendation] =
    useState(false);
  const [recommendationHistory, setRecommendationHistory] =
    useState([]);
  const [aiError, setAiError] = useState(null);

  const [assistantOpen, setAssistantOpen] = useState(false);

  // =====================================================
  // FETCH DASHBOARD
  // =====================================================

  const fetchDashboardData = async () => {
    try {
      const [
        summaryData,
        stationsData,
        trend,
        tickets,
        revenue,
        routes,
        live,
        history,
      ] = await Promise.all([
        getDashboardSummary(),
        getBusiestStations(),
        getPassengerTrend(),
        getTicketDistribution(),
        getRevenueAnalysis(),
        getTopRoutes(),
        getLiveDashboard(),
        getRecommendationHistory(),
      ]);

      setSummary({
        total_passengers:
          Number(summaryData?.total_passengers) || 0,
        total_trips:
          Number(summaryData?.total_trips) || 0,
        total_stations:
          Number(summaryData?.total_stations) || 0,
        total_revenue:
          Number(summaryData?.total_revenue) || 0,
      });

      setBusiestStations(
        Array.isArray(stationsData)
          ? stationsData
          : []
      );

      setTrendData(
        Array.isArray(trend)
          ? trend
          : []
      );

      setTicketData(
        Array.isArray(tickets)
          ? tickets
          : []
      );

      setRevenueData(
        Array.isArray(revenue)
          ? revenue
          : []
      );

      setTopRoutes(
        Array.isArray(routes)
          ? routes
          : []
      );

      setLatestPrediction(
        live?.latest_prediction ?? null
      );

      setRecentAlerts(
        Array.isArray(live?.recent_alerts)
          ? live.recent_alerts
          : []
      );

      setRecentHistory(
        Array.isArray(live?.recent_history)
          ? live.recent_history
          : []
      );

      setRecommendationHistory(
        Array.isArray(history)
          ? history
          : []
      );

      setLastUpdated(new Date());
    } catch (error) {
      console.error(
        "Dashboard Error:",
        error
      );

      setSummary({
        total_passengers: 0,
        total_trips: 0,
        total_stations: 0,
        total_revenue: 0,
      });

      setBusiestStations([]);
      setTrendData([]);
      setTicketData([]);
      setRevenueData([]);
      setTopRoutes([]);
      setRecentAlerts([]);
      setRecentHistory([]);
      setRecommendationHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    const intervalId = setInterval(
      fetchDashboardData,
      REFRESH_INTERVAL
    );

    return () =>
      clearInterval(intervalId);
  }, []);

  // =====================================================
  // AI RECOMMENDATION
  // =====================================================

  const fetchAIRecommendation = async (
    summaryData,
    stationsData,
    alertsData = []
  ) => {
    try {
      setLoadingRecommendation(true);
      setAiError(null);

      const topStation =
        stationsData.length > 0
          ? stationsData[0]
          : null;

      let riskLevel = "Low";

      if (alertsData.length >= 5) {
        riskLevel = "Critical";
      } else if (alertsData.length >= 3) {
        riskLevel = "High";
      } else if (alertsData.length >= 1) {
        riskLevel = "Medium";
      }

      const summaryText = `
Total Passengers Today: ${(summaryData.total_passengers ?? 0).toLocaleString()}

Total Trips: ${(summaryData.total_trips ?? 0).toLocaleString()}

Total Revenue: ₹${(summaryData.total_revenue ?? 0).toLocaleString()}

Highest Traffic Station:
${topStation?.station ?? "Rajiv Chowk"}

Active Alerts:
${alertsData.length}

Generate operational recommendations.
`;

      const payload = {
        station_name:
          topStation?.station ??
          "Rajiv Chowk",

        risk_level: riskLevel,

        summary: summaryText,

        operational_action: "",

        expected_impact: "",

        confidence: 96,
      };

      const response =
        await generateRecommendation(
          payload
        );

      setAiRecommendation(response);
    } catch (error) {
      console.error(
        "Gemini Recommendation Error:",
        error
      );

      setAiError(
        "Unable to generate AI recommendation."
      );
    } finally {
      setLoadingRecommendation(false);
    }
  };

  // =====================================================
  // SKELETON
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f7fb] p-6 lg:p-8">
        <div className="mx-auto max-w-[1800px] animate-pulse space-y-6">

          <div className="h-12 w-80 rounded-2xl bg-slate-200" />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-32 rounded-3xl bg-white shadow-sm"
              />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="h-[360px] rounded-3xl bg-white xl:col-span-2" />
            <div className="h-[360px] rounded-3xl bg-white" />
          </div>

          <div className="h-[300px] rounded-3xl bg-white" />

        </div>
      </div>
    );
  }

  // =====================================================
  // DERIVED DATA
  // =====================================================

  const stationOccupancies =
    busiestStations.map((station) => {
      const capacity = Math.max(
        station.passengers + 5000,
        1000
      );

      return Math.min(
        Math.round(
          (station.passengers / capacity) * 100
        ),
        100
      );
    });

  const avgOccupancy =
    stationOccupancies.length
      ? Math.round(
          stationOccupancies.reduce(
            (sum, value) =>
              sum + value,
            0
          ) /
            stationOccupancies.length
        )
      : 0;

  const criticalStationsCount =
    stationOccupancies.filter(
      (value) => value >= 90
    ).length;

  const warningStationsCount =
    stationOccupancies.filter(
      (value) =>
        value >= 75 && value < 90
    ).length;

  const healthyStationsCount =
    stationOccupancies.filter(
      (value) => value < 75
    ).length;

  const busiestStationName =
    busiestStations[0]?.station ?? "—";

  const chartTrend =
    normalizeTrend(trendData);

  const chartTickets =
    normalizeTicketData(ticketData);

  const chartRevenue =
    normalizeRevenueData(revenueData);

  const networkHealth =
    criticalStationsCount > 0
      ? "Critical"
      : warningStationsCount > 0
      ? "Attention"
      : "Operational";

  const networkHealthClass =
    criticalStationsCount > 0
      ? "bg-red-50 text-red-600 border-red-200"
      : warningStationsCount > 0
      ? "bg-amber-50 text-amber-600 border-amber-200"
      : "bg-emerald-50 text-emerald-600 border-emerald-200";

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <div className="mx-auto max-w-[1800px] space-y-8 px-4 py-6 sm:px-6 lg:px-8">

        {/* =================================================
            HEADER
        ================================================= */}

        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm lg:p-7">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <div className="mb-3 flex flex-wrap items-center gap-3">

                <span className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                  MetroVision Control Center
                </span>

                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${networkHealthClass}`}
                >
                  <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-current" />
                  Network {networkHealth}
                </span>

              </div>

              <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Metro Operations
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Real-time AI-powered visibility across
                passenger flow, station demand, revenue
                and operational health.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">

              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <Clock3
                  size={16}
                  className="text-slate-400"
                />

                <span className="text-xs font-medium text-slate-500">
                  Updated
                </span>

                <span className="text-xs font-bold text-slate-800">
                  {lastUpdated.toLocaleTimeString()}
                </span>
              </div>

              <button
                onClick={fetchDashboardData}
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  px-4
                  py-3
                  text-sm
                  font-semibold
                  text-slate-700
                  transition
                  hover:border-indigo-200
                  hover:bg-indigo-50
                  hover:text-indigo-600
                "
              >
                <RefreshCw size={16} />
                Refresh
              </button>

            </div>

          </div>

        </section>

        {/* =================================================
            PRIMARY KPI CARDS
        ================================================= */}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <MetricCard
            title="Total Passengers"
            value={(
              summary.total_passengers ?? 0
            ).toLocaleString()}
            icon={Users}
            iconColor="text-indigo-600"
            iconBg="bg-indigo-100"
            trend="Network"
            trendColor="text-indigo-600"
          />

          <MetricCard
            title="Metro Trips"
            value={(
              summary.total_trips ?? 0
            ).toLocaleString()}
            icon={TrainFront}
            iconColor="text-cyan-600"
            iconBg="bg-cyan-100"
            trend="Live"
            trendColor="text-cyan-600"
          />

          <MetricCard
            title="Stations"
            value={(
              summary.total_stations ?? 0
            ).toLocaleString()}
            icon={MapPinned}
            iconColor="text-orange-600"
            iconBg="bg-orange-100"
            trend="Monitored"
            trendColor="text-orange-600"
          />

          <MetricCard
            title="Revenue"
            value={`₹ ${(
              summary.total_revenue ?? 0
            ).toLocaleString()}`}
            icon={IndianRupee}
            iconColor="text-emerald-600"
            iconBg="bg-emerald-100"
            trend="Current"
            trendColor="text-emerald-600"
          />

        </section>

        {/* =================================================
            NETWORK SNAPSHOT
        ================================================= */}

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

          {/* Occupancy */}
          <div className="rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-600 p-5 text-white shadow-lg shadow-indigo-500/20">

            <div className="flex items-start justify-between">
              <div className="rounded-2xl bg-white/10 p-3">
                <Gauge size={20} />
              </div>

              <Activity
                size={18}
                className="text-white/50"
              />
            </div>

            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.12em] text-white/60">
              Average Occupancy
            </p>

            <div className="mt-1 flex items-end gap-2">
              <span className="text-3xl font-black">
                {avgOccupancy}%
              </span>

              <span className="mb-1 text-xs text-white/60">
                across monitored stations
              </span>
            </div>

          </div>

          {/* Busiest station */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-start justify-between">
              <div className="rounded-2xl bg-cyan-50 p-3">
                <Building2
                  size={20}
                  className="text-cyan-600"
                />
              </div>

              <ArrowUpRight
                size={18}
                className="text-slate-300"
              />
            </div>

            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
              Busiest Station
            </p>

            <h3 className="mt-1 truncate text-2xl font-black text-slate-950">
              {busiestStationName}
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Highest recorded passenger volume
            </p>

          </div>

          {/* Alerts */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-start justify-between">
              <div className="rounded-2xl bg-red-50 p-3">
                <ShieldAlert
                  size={20}
                  className="text-red-600"
                />
              </div>

              <span className="rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-red-600">
                Live
              </span>
            </div>

            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
              Active Alerts
            </p>

            <h3 className="mt-1 text-3xl font-black text-slate-950">
              {recentAlerts.length}
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Alerts detected across the network
            </p>

          </div>

          {/* AI */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-start justify-between">
              <div className="rounded-2xl bg-violet-50 p-3">
                <BrainCircuit
                  size={20}
                  className="text-violet-600"
                />
              </div>

              <Sparkles
                size={18}
                className="text-violet-300"
              />
            </div>

            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
              AI Intelligence
            </p>

            <h3 className="mt-1 text-3xl font-black text-slate-950">
              {recommendationHistory.length}
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Recommendations available
            </p>

          </div>

        </section>

        {/* =================================================
            ANALYTICS
        ================================================= */}

        <section>

          <div className="mb-5 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">

            <div>
              <div className="flex items-center gap-2">
                <Activity
                  size={18}
                  className="text-indigo-600"
                />
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">
                  Network Analytics
                </span>
              </div>

              <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                Passenger & Revenue Intelligence
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Live movement and financial performance across the metro network.
              </p>
            </div>

          </div>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">

            {/* Passenger Trend */}
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">

              <div className="mb-5 flex items-start justify-between">

                <div>
                  <h3 className="font-bold text-slate-950">
                    Passenger Trend
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Ridership movement over time
                  </p>
                </div>

                <span className="rounded-full bg-indigo-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-indigo-600">
                  Live
                </span>

              </div>

              {chartTrend.length === 0 ? (
                <div className="flex h-[300px] items-center justify-center text-sm text-slate-400">
                  No trend data available yet.
                </div>
              ) : (
                <ResponsiveContainer
                  width="100%"
                  height={300}
                >
                  <AreaChart data={chartTrend}>
                    <defs>
                      <linearGradient
                        id="passengerArea"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#4f46e5"
                          stopOpacity={0.32}
                        />

                        <stop
                          offset="100%"
                          stopColor="#4f46e5"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>

                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e2e8f0"
                      vertical={false}
                    />

                    <XAxis
                      dataKey="label"
                      tick={{
                        fontSize: 11,
                        fill: "#64748b",
                      }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <YAxis
                      tick={{
                        fontSize: 11,
                        fill: "#64748b",
                      }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <Tooltip
                      contentStyle={{
                        borderRadius: 14,
                        border:
                          "1px solid #e2e8f0",
                        boxShadow:
                          "0 10px 30px rgba(15,23,42,0.08)",
                      }}
                    />

                    <Area
                      type="monotone"
                      dataKey="passengers"
                      stroke="#4f46e5"
                      strokeWidth={3}
                      fill="url(#passengerArea)"
                      dot={false}
                      activeDot={{
                        r: 5,
                        strokeWidth: 0,
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}

            </div>

            {/* Ticket Distribution */}
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="mb-5">
                <h3 className="font-bold text-slate-950">
                  Ticket Distribution
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Current ticket mix
                </p>
              </div>

              {chartTickets.length === 0 ? (
                <div className="flex h-[300px] items-center justify-center text-sm text-slate-400">
                  No ticket data available yet.
                </div>
              ) : (
                <ResponsiveContainer
                  width="100%"
                  height={300}
                >
                  <PieChart>
                    <Pie
                      data={chartTickets}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={62}
                      outerRadius={100}
                      paddingAngle={4}
                    >
                      {chartTickets.map(
                        (entry, index) => (
                          <Cell
                            key={`${entry.name}-${index}`}
                            fill={
                              TICKET_COLORS[
                                index %
                                  TICKET_COLORS.length
                              ]
                            }
                            stroke="none"
                          />
                        )
                      )}
                    </Pie>

                    <Tooltip
                      contentStyle={{
                        borderRadius: 14,
                        border:
                          "1px solid #e2e8f0",
                      }}
                    />

                    <Legend
                      verticalAlign="bottom"
                      iconType="circle"
                      wrapperStyle={{
                        fontSize: 11,
                        color: "#64748b",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}

            </div>

            {/* Revenue */}
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-3">

              <div className="mb-5 flex items-center justify-between gap-4">

                <div>
                  <h3 className="font-bold text-slate-950">
                    Revenue Performance
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Fare revenue generated over time
                  </p>
                </div>

                <div className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-600">
                  ₹{" "}
                  {(
                    summary.total_revenue ?? 0
                  ).toLocaleString()}
                </div>

              </div>

              {chartRevenue.length === 0 ? (
                <div className="flex h-[250px] items-center justify-center text-sm text-slate-400">
                  No revenue data available yet.
                </div>
              ) : (
                <ResponsiveContainer
                  width="100%"
                  height={250}
                >
                  <BarChart data={chartRevenue}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e2e8f0"
                      vertical={false}
                    />

                    <XAxis
                      dataKey="label"
                      tick={{
                        fontSize: 11,
                        fill: "#64748b",
                      }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <YAxis
                      tick={{
                        fontSize: 11,
                        fill: "#64748b",
                      }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <Tooltip
                      contentStyle={{
                        borderRadius: 14,
                        border:
                          "1px solid #e2e8f0",
                      }}
                    />

                    <Bar
                      dataKey="revenue"
                      fill="#16a34a"
                      radius={[
                        7,
                        7,
                        0,
                        0,
                      ]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}

            </div>

          </div>
        </section>

        {/* =================================================
            STATION MONITOR
        ================================================= */}

        <section>

          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <div className="flex items-center gap-2">
                <MapPinned
                  size={18}
                  className="text-indigo-600"
                />

                <span className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">
                  Operations
                </span>
              </div>

              <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                Smart Station Monitor
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                AI-derived station health and passenger density.
              </p>
            </div>

            <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 shadow-sm">
              {busiestStations.length} stations monitored
            </div>

          </div>

          {busiestStations.length === 0 ? (

            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <h3 className="text-lg font-bold text-slate-900">
                No station data
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Passenger information will appear here once data is available.
              </p>
            </div>

          ) : (

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">

              {busiestStations.map(
                (station, index) => {
                  const capacity =
                    Math.max(
                      station.passengers +
                        5000,
                      1000
                    );

                  const occupancy =
                    Math.min(
                      Math.round(
                        (station.passengers /
                          capacity) *
                          100
                      ),
                      100
                    );

                  const {
                    status,
                    badgeClass,
                    barClass,
                    recommendation,
                  } =
                    getOccupancyStyle(
                      occupancy
                    );

                  return (
                    <div
                      key={
                        station.station_id ??
                        index
                      }
                      className="
                        group
                        rounded-3xl
                        border
                        border-slate-200
                        bg-white
                        p-5
                        shadow-sm
                        transition
                        duration-300
                        hover:-translate-y-1
                        hover:border-indigo-100
                        hover:shadow-lg
                      "
                    >

                      <div className="flex items-start justify-between gap-4">

                        <div className="min-w-0">

                          <div className="flex items-center gap-2">
                            <span className="rounded-xl bg-indigo-50 p-2">
                              <TrainFront
                                size={16}
                                className="text-indigo-600"
                              />
                            </span>

                            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                              Station {index + 1}
                            </span>
                          </div>

                          <h3 className="mt-3 truncate text-xl font-black text-slate-950">
                            {station.station}
                          </h3>

                          <p className="mt-1 text-xs text-slate-500">
                            Passenger demand monitoring
                          </p>

                        </div>

                        <span
                          className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-bold ${badgeClass}`}
                        >
                          {status}
                        </span>

                      </div>

                      <div className="mt-6 flex items-end justify-between">

                        <div>
                          <p className="text-xs font-medium text-slate-400">
                            Daily passengers
                          </p>

                          <p className="mt-1 text-3xl font-black tracking-tight text-slate-950">
                            {Number(
                              station.passengers ??
                                0
                            ).toLocaleString()}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-slate-50 px-4 py-3 text-right">
                          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                            Occupancy
                          </p>

                          <p
                            className={`mt-1 text-lg font-black ${getOccupancyStyle(occupancy).accentClass}`}
                          >
                            {occupancy}%
                          </p>
                        </div>

                      </div>

                      <div className="mt-5">

                        <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-500">
                          <span>
                            Capacity utilization
                          </span>

                          <span>
                            {occupancy}%
                          </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${barClass}`}
                            style={{
                              width: `${occupancy}%`,
                            }}
                          />
                        </div>

                      </div>

                      <div className="mt-5 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4">

                        <div className="flex items-center gap-2">
                          <div className="rounded-lg bg-white p-1.5 shadow-sm">
                            <Bot
                              size={14}
                              className="text-indigo-600"
                            />
                          </div>

                          <span className="text-xs font-bold text-indigo-700">
                            AI Recommendation
                          </span>
                        </div>

                        <p className="mt-2 text-xs leading-5 text-slate-600">
                          {recommendation}
                        </p>

                      </div>

                      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-[11px] text-slate-400">

                        <span>
                          Capacity{" "}
                          {capacity.toLocaleString()}
                        </span>

                        <span>
                          Updated{" "}
                          {lastUpdated.toLocaleTimeString()}
                        </span>

                      </div>

                    </div>
                  );
                }
              )}

            </div>
          )}

        </section>

        {/* =================================================
            AI OPERATIONS CENTER
        ================================================= */}

        <section>

          <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">

            <div>
              <div className="flex items-center gap-2">
                <Bot
                  size={18}
                  className="text-violet-600"
                />

                <span className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">
                  Artificial Intelligence
                </span>
              </div>

              <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                AI Operations Center
              </h2>

              <p className="mt-1 max-w-2xl text-sm text-slate-500">
                Gemini-powered recommendations, operational alerts,
                predictions and decision support.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">

              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-600">
                ● Gemini Online
              </span>

              <span className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-600">
                Confidence{" "}
                {aiRecommendation?.confidence ??
                  96}
                %
              </span>

              <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-bold text-cyan-600">
                {recommendationHistory.length} recommendations
              </span>

            </div>

          </div>

          {aiError && (
            <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              {aiError}
            </div>
          )}

          {recentAlerts.length > 0 && (
            <div className="mb-5 flex items-center justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 p-4">

              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white p-2.5 shadow-sm">
                  <ShieldAlert
                    size={18}
                    className="text-red-600"
                  />
                </div>

                <div>
                  <p className="text-sm font-bold text-red-700">
                    Active network alerts
                  </p>

                  <p className="mt-0.5 text-xs text-red-600">
                    {recentAlerts.length} alert
                    {recentAlerts.length !== 1
                      ? "s"
                      : ""}{" "}
                    require attention.
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-red-100 px-3 py-1.5 text-xs font-black text-red-700">
                {recentAlerts.length}
              </span>

            </div>
          )}

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-[#10192d] shadow-xl shadow-slate-900/10">

            <AIOperationsCenter
              summary={summary}
              busiestStations={
                busiestStations
              }
              recentAlerts={
                recentAlerts
              }
              recentHistory={
                recentHistory
              }
              latestPrediction={
                latestPrediction
              }
              recommendation={
                aiRecommendation
              }
              loadingRecommendation={
                loadingRecommendation
              }
              recommendationHistory={
                recommendationHistory
              }
              lastUpdated={
                lastUpdated
              }
              onViewAllHistory={() => {
                console.log(
                  "Open Recommendation History"
                );
              }}
            />

          </div>

          {/* AI actions */}
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">

            <button
              onClick={() =>
                fetchAIRecommendation(
                  summary,
                  busiestStations,
                  recentAlerts
                )
              }
              disabled={
                loadingRecommendation
              }
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-2xl
                bg-indigo-600
                px-5
                py-3.5
                text-sm
                font-bold
                text-white
                shadow-lg
                shadow-indigo-500/20
                transition
                hover:bg-indigo-700
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              <RefreshCw
                size={16}
                className={
                  loadingRecommendation
                    ? "animate-spin"
                    : ""
                }
              />

              {loadingRecommendation
                ? "Generating..."
                : "Generate Recommendation"}
            </button>

            <button
              onClick={() =>
                setAssistantOpen(true)
              }
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-2xl
                border
                border-slate-200
                bg-white
                px-5
                py-3.5
                text-sm
                font-bold
                text-slate-700
                transition
                hover:border-violet-200
                hover:bg-violet-50
                hover:text-violet-700
              "
            >
              <Bot size={16} />
              Ask Gemini
            </button>

            <button
              onClick={() =>
                document
                  .getElementById(
                    "network-analytics"
                  )
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-2xl
                border
                border-slate-200
                bg-white
                px-5
                py-3.5
                text-sm
                font-bold
                text-slate-700
                transition
                hover:border-cyan-200
                hover:bg-cyan-50
                hover:text-cyan-700
              "
            >
              <Gauge size={16} />
              AI Analytics
            </button>

            <button
              onClick={() =>
                console.log(
                  "Open Recommendation History"
                )
              }
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-2xl
                border
                border-slate-200
                bg-white
                px-5
                py-3.5
                text-sm
                font-bold
                text-slate-700
                transition
                hover:border-indigo-200
                hover:bg-indigo-50
                hover:text-indigo-700
              "
            >
              <Clock3 size={16} />
              View History
            </button>

          </div>

        </section>

        {/* =================================================
            TOP ROUTES
        ================================================= */}

        <section>

          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <div className="flex items-center gap-2">
                <TrainFront
                  size={18}
                  className="text-cyan-600"
                />

                <span className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-600">
                  Network Flow
                </span>
              </div>

              <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                Top Performing Routes
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Highest-volume routes across the metro network.
              </p>
            </div>

            <span className="rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-xs font-bold text-cyan-700">
              {topRoutes.length} routes
            </span>

          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

            <TopRoutesTable
              data={topRoutes}
            />

          </div>

        </section>

        {/* =================================================
            FOOTER
        ================================================= */}

        <footer className="border-t border-slate-200 pt-6 pb-4">

          <div className="flex flex-col items-center justify-between gap-2 text-center text-xs text-slate-400 md:flex-row md:text-left">

            <p>
              MetroVision AI • Smart Metro Crowd Management Platform
            </p>

            <p>
              React • FastAPI • PostgreSQL • Google Gemini
            </p>

          </div>

        </footer>

      </div>

      {/* =================================================
          FLOATING AI ASSISTANT
      ================================================= */}

      <button
        onClick={() =>
          setAssistantOpen(true)
        }
        className="
          fixed
          bottom-6
          right-6
          z-50
          inline-flex
          items-center
          gap-2
          rounded-full
          border
          border-white/20
          bg-indigo-600
          px-5
          py-3.5
          text-sm
          font-bold
          text-white
          shadow-2xl
          shadow-indigo-600/25
          transition
          hover:-translate-y-0.5
          hover:bg-indigo-700
        "
      >
        <Bot size={17} />
        AI Assistant
      </button>

      {/* =================================================
          AI ASSISTANT MODAL
      ================================================= */}

      <AIAssistant
        open={assistantOpen}
        onClose={() =>
          setAssistantOpen(false)
        }
        dashboardContext={{
          summary,
          busiestStations:
            busiestStations.slice(
              0,
              5
            ),
          topRoutes:
            topRoutes.slice(0, 5),
          recentAlerts,
          latestPrediction,
          lastUpdated,
        }}
      />

    </div>
  );
};

export default Dashboard;