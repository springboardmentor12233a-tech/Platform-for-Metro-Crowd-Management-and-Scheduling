import { useEffect, useState } from "react";

import {
  Users,
  TrainFront,
  MapPinned,
  IndianRupee,
  Bot,
} from "lucide-react";

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
// Occupancy → status/style helper (was duplicated 3x)
// =====================================================
const getOccupancyStyle = (occupancy) => {
  if (occupancy >= 90) {
    return {
      status: "Critical",
      badgeClass: "bg-red-100 text-red-700",
      barClass: "bg-red-500",
      recommendation:
        "Immediately increase train frequency, deploy additional station staff, open all AFC gates, and broadcast crowd-control announcements.",
    };
  }
  if (occupancy >= 75) {
    return {
      status: "Warning",
      badgeClass: "bg-yellow-100 text-yellow-700",
      barClass: "bg-yellow-500",
      recommendation:
        "Prepare standby trains, monitor passenger flow continuously, and deploy extra security personnel.",
    };
  }
  return {
    status: "Healthy",
    badgeClass: "bg-green-100 text-green-700",
    barClass: "bg-green-500",
    recommendation:
      "Passenger movement is within normal operating limits. Continue routine monitoring.",
  };
};

const Dashboard = () => {
  // =====================================================
  // Loading State
  // =====================================================

  const [loading, setLoading] = useState(true);

  // =====================================================
  // Dashboard Summary
  // =====================================================

  const [summary, setSummary] = useState({
    total_passengers: 0,
    total_trips: 0,
    total_stations: 0,
    total_revenue: 0,
  });

  // =====================================================
  // Dashboard Charts
  // =====================================================

  const [busiestStations, setBusiestStations] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [ticketData, setTicketData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [topRoutes, setTopRoutes] = useState([]);

  // =====================================================
  // Live Dashboard Data
  // =====================================================

  const [latestPrediction, setLatestPrediction] = useState(null);

  const [recentAlerts, setRecentAlerts] = useState([]);

  const [recentHistory, setRecentHistory] = useState([]);

  const [lastUpdated, setLastUpdated] = useState(new Date());

  // =====================================================
  // Gemini AI
  // =====================================================

  const [aiRecommendation, setAiRecommendation] = useState(null);

  const [loadingRecommendation, setLoadingRecommendation] =
    useState(false);

  const [recommendationHistory, setRecommendationHistory] =
    useState([]);

  const [aiError, setAiError] = useState(null);

  // =====================================================
  // AI Assistant Modal
  // =====================================================

  const [assistantOpen, setAssistantOpen] = useState(false);

  // =====================================================
  // Auto Refresh
  // =====================================================

  const REFRESH_INTERVAL = 30000;

  // ==========================================
  // Fetch Dashboard Data
  // ==========================================

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

      // ==========================
      // Debug Logs
      // ==========================
      console.log("========== DASHBOARD ==========");
      console.log("Summary:", summaryData);
      console.log("Stations:", stationsData);
      console.log("Trend:", trend);
      console.log("Tickets:", tickets);
      console.log("Revenue:", revenue);
      console.log("Top Routes:", routes);
      console.log("Live Dashboard:", live);
      console.log("Recommendation History:", history);

      // ==========================
      // Safe Summary
      // ==========================
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

      // ==========================
      // Safe Dashboard Data
      // ==========================
      setBusiestStations(
        Array.isArray(stationsData) ? stationsData : []
      );
      setTrendData(
        Array.isArray(trend) ? trend : []
      );
      setTicketData(
        Array.isArray(tickets) ? tickets : []
      );
      setRevenueData(
        Array.isArray(revenue) ? revenue : []
      );
      setTopRoutes(
        Array.isArray(routes) ? routes : []
      );

      // ==========================
      // Live Dashboard
      // ==========================
      setLatestPrediction(live?.latest_prediction ?? null);
      setRecentAlerts(
        Array.isArray(live?.recent_alerts) ? live.recent_alerts : []
      );
      setRecentHistory(
        Array.isArray(live?.recent_history) ? live.recent_history : []
      );

      // ==========================
      // AI History
      // ==========================
      setRecommendationHistory(
        Array.isArray(history) ? history : []
      );

      setLastUpdated(new Date());
    } catch (error) {
      console.error("Dashboard Error:", error);

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

    return () => clearInterval(intervalId);
  }, []);

  // ==========================================
  // AI Recommendation
  // ==========================================

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

      // ---------------------------------------
      // Determine Risk Level
      // ---------------------------------------

      let riskLevel = "Low";

      if (alertsData.length >= 5) {
        riskLevel = "Critical";
      } else if (alertsData.length >= 3) {
        riskLevel = "High";
      } else if (alertsData.length >= 1) {
        riskLevel = "Medium";
      }

      // ---------------------------------------
      // Build AI Summary
      // ---------------------------------------

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

      // ---------------------------------------
      // Backend Payload
      // ---------------------------------------

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

      // ---------------------------------------
      // Gemini API
      // ---------------------------------------

      const response =
        await generateRecommendation(payload);

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

  // ==========================================
  // Loading Skeleton
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 animate-pulse">

        <div className="h-10 w-72 rounded bg-slate-200 mb-8" />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-36 rounded-3xl bg-white shadow-sm"
            />
          ))}

        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-8">

          <div className="h-[420px] rounded-3xl bg-white shadow-sm" />

          <div className="h-[420px] rounded-3xl bg-white shadow-sm" />

        </div>

      </div>
    );
  }

  return (
    <div className="space-y-10">

      {/* =====================================================
          DASHBOARD HEADER
      ===================================================== */}

      <DashboardHeader
        title="MetroVision AI Dashboard"
        subtitle="Real-time AI-powered metro operations monitoring"
      />

      <div className="flex items-center gap-2.5 text-sm text-slate-500">

        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
        </span>

        Refreshing every {REFRESH_INTERVAL / 1000} seconds

      </div>

      {/* =====================================================
          METRO STATUS
      ===================================================== */}

      <MetroStatusCard
        totalStations={summary.total_stations}
        activeAlerts={recentAlerts.length}
        totalTrips={summary.total_trips}
        lastUpdated={lastUpdated}
      />

      {/* =====================================================
          KPI CARDS
      ===================================================== */}

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

        <MetricCard
          title="Total Passengers"
          value={(summary.total_passengers ?? 0).toLocaleString()}
          icon={Users}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-100"
          trend="+8.2%"
          trendColor="text-green-600"
        />

        <MetricCard
          title="Metro Trips"
          value={(summary.total_trips ?? 0).toLocaleString()}
          icon={TrainFront}
          iconColor="text-cyan-600"
          iconBg="bg-cyan-100"
          trend="Live"
          trendColor="text-cyan-600"
        />

        <MetricCard
          title="Stations"
          value={(summary.total_stations ?? 0).toLocaleString()}
          icon={MapPinned}
          iconColor="text-orange-600"
          iconBg="bg-orange-100"
          trend="Healthy"
          trendColor="text-green-600"
        />

        <MetricCard
          title="Revenue"
          value={`₹ ${(summary.total_revenue ?? 0).toLocaleString()}`}
          icon={IndianRupee}
          iconColor="text-green-600"
          iconBg="bg-green-100"
          trend="+5.7%"
          trendColor="text-green-600"
        />

      </section>

      {/* =====================================================
          SMART STATION MONITOR
      ===================================================== */}

      <section>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              🏆 Smart Station Monitor
            </h2>

            <p className="text-slate-500 mt-2">
              AI-monitored busiest metro stations across the network
            </p>
          </div>

          <div className="rounded-full bg-indigo-100 px-5 py-2 font-semibold text-indigo-700">
            {busiestStations.length} Active Stations
          </div>
        </div>

        {busiestStations.length === 0 ? (

          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">

            <h3 className="text-xl font-bold">
              No Station Data
            </h3>

            <p className="mt-2 text-slate-500">
              Passenger information will appear here once data is available.
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

            {busiestStations.map((station, index) => {

              const capacity = Math.max(
                station.passengers + 5000,
                1000
              );

              const occupancy = Math.min(
                Math.round(
                  (station.passengers / capacity) * 100
                ),
                100
              );

              const {
                status,
                badgeClass,
                barClass,
                recommendation,
              } = getOccupancyStyle(occupancy);

              return (

                <div
                  key={station.station_id ?? index}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >

                  {/* Header */}

                  <div className="flex items-center justify-between">

                    <div>

                      <h3 className="text-xl font-bold">
                        {station.station}
                      </h3>

                      <p className="text-slate-500">
                        Metro Station
                      </p>

                    </div>

                    <div
                      className={`rounded-full px-4 py-2 text-sm font-semibold ${badgeClass}`}
                    >
                      {status}
                    </div>

                  </div>

                  {/* Passengers */}

                  <div className="mt-6 flex items-center justify-between">

                    <div>

                      <p className="text-sm text-slate-500">
                        Daily Passengers
                      </p>

                      <h2 className="text-4xl font-black">
                        {station.passengers.toLocaleString()}
                      </h2>

                    </div>

                    <div className="rounded-2xl bg-indigo-100 p-5 text-xl">
                      👥
                    </div>

                  </div>

                  {/* Occupancy */}

                  <div className="mt-6">

                    <div className="flex justify-between mb-2 text-sm text-slate-600">

                      <span>Occupancy</span>

                      <span className="font-semibold">{occupancy}%</span>

                    </div>

                    <div className="h-3 rounded-full bg-slate-200 overflow-hidden">

                      <div
                        className={`h-full rounded-full transition-all duration-500 ${barClass}`}
                        style={{
                          width: `${occupancy}%`,
                        }}
                      />

                    </div>

                  </div>

                  {/* AI Recommendation */}

                  <div className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50 p-5">

                    <div className="flex items-center gap-2">

                      <span>🤖</span>

                      <h4 className="font-semibold">
                        AI Recommendation
                      </h4>

                    </div>

                    <p className="mt-3 text-slate-600 leading-7 text-sm">

                      {recommendation}

                    </p>

                  </div>

                  {/* Footer */}

                  <div className="mt-6 flex justify-between text-sm text-slate-500">

                    <span>
                      Capacity: {capacity.toLocaleString()}
                    </span>

                    <span>
                      Updated: {lastUpdated.toLocaleTimeString()}
                    </span>

                  </div>

                </div>

              );

            })}

          </div>

        )}

      </section>

      {/* =====================================================
          AI OPERATIONS CENTER
      ===================================================== */}

      <section>

        <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

          <div>

            <h2 className="text-3xl font-bold tracking-tight">
              🤖 MetroVision AI Operations Center
            </h2>

            <p className="mt-2 text-slate-500">
              Google Gemini powered operational intelligence,
              recommendations and network monitoring.
            </p>

          </div>

          <div className="flex flex-wrap gap-3">

            <div className="rounded-full bg-green-100 px-5 py-2 font-semibold text-green-700">
              🟢 Gemini Online
            </div>

            <div className="rounded-full bg-indigo-100 px-5 py-2 font-semibold text-indigo-700">
              🧠 AI Confidence {aiRecommendation?.confidence ?? 96}%
            </div>

            <div className="rounded-full bg-cyan-100 px-5 py-2 font-semibold text-cyan-700">
              📜 {recommendationHistory.length} Recommendations
            </div>

          </div>

        </div>

        {/* AI Error Banner */}

        {aiError && (

          <div className="mb-6 rounded-3xl border border-red-200 bg-red-50 p-6">

            <h3 className="font-bold text-red-700">
              Gemini AI
            </h3>

            <p className="mt-2 text-red-600">
              {aiError}
            </p>

          </div>

        )}

        {/* Critical Alert Banner */}

        {recentAlerts.length > 0 && (

          <div className="mb-6 rounded-3xl border border-red-200 bg-red-50 p-6">

            <div className="flex items-center justify-between">

              <div>

                <h3 className="text-xl font-bold text-red-700">
                  🚨 Active Network Alerts
                </h3>

                <p className="mt-2 text-red-600">
                  {recentAlerts.length} active alert
                  {recentAlerts.length > 1 ? "s" : ""} detected across the metro
                  network.
                </p>

              </div>

              <div className="rounded-full bg-red-100 px-5 py-2 font-bold text-red-700">
                {recentAlerts.length}
              </div>

            </div>

          </div>

        )}

        {/* AI Component */}

        <AIOperationsCenter
          summary={summary}
          busiestStations={busiestStations}
          recentAlerts={recentAlerts}
          recentHistory={recentHistory}
          latestPrediction={latestPrediction}
          recommendation={aiRecommendation}
          loadingRecommendation={loadingRecommendation}
          recommendationHistory={recommendationHistory}
          lastUpdated={lastUpdated}
          onViewAllHistory={() => {
            console.log("Open Recommendation History");
          }}
        />

        {/* AI Quick Actions */}

        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-5">

          <button
            onClick={() =>
              fetchAIRecommendation(
                summary,
                busiestStations,
                recentAlerts
              )
            }
            disabled={loadingRecommendation}
            className="rounded-2xl bg-indigo-600 px-6 py-4 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-indigo-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loadingRecommendation ? "⏳ Generating..." : "🔄 Generate Recommendation"}
          </button>

          <button
            className="rounded-2xl border border-slate-200 bg-white px-6 py-4 font-semibold transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm"
          >
            🤖 Ask Gemini
          </button>

          <button
            className="rounded-2xl border border-slate-200 bg-white px-6 py-4 font-semibold transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm"
          >
            📊 AI Analytics
          </button>

          <button
            className="rounded-2xl border border-slate-200 bg-white px-6 py-4 font-semibold transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm"
          >
            📜 View History
          </button>

        </div>

      </section>

      {/* =====================================================
          TOP ROUTES
      ===================================================== */}

      <section>

        <div className="mb-6 flex flex-wrap justify-between items-center gap-4">

          <div>

            <h2 className="text-3xl font-bold tracking-tight">
              🚇 Top Performing Routes
            </h2>

            <p className="text-slate-500 mt-2">
              Most frequently travelled metro routes today.
            </p>

          </div>

          <div className="rounded-full bg-cyan-100 px-5 py-2 font-semibold text-cyan-700">

            {topRoutes.length} Routes

          </div>

        </div>

        <div className="rounded-3xl bg-white border border-slate-200 shadow-sm p-6">

          <TopRoutesTable
            data={topRoutes}
          />

        </div>

      </section>

      {/* Floating AI Assistant Button */}

      <button
        onClick={() => setAssistantOpen(true)}
        className="fixed bottom-8 right-8 z-50 flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-4 font-semibold text-white shadow-2xl transition-all duration-200 hover:scale-105 hover:bg-indigo-700"
      >
        <Bot size={18} />
        AI Assistant
      </button>

      <footer className="mt-16 border-t border-slate-200 py-8 text-center text-slate-500">

        <p>

          MetroVision AI • Smart Metro Crowd Management Platform

        </p>

        <p className="mt-2 text-sm">

          Powered by FastAPI • React • PostgreSQL • Google Gemini

        </p>

      </footer>

      <AIAssistant
        open={assistantOpen}
        onClose={() => setAssistantOpen(false)}
        dashboardContext={{
          summary,
          busiestStations: busiestStations.slice(0, 5),
          topRoutes: topRoutes.slice(0, 5),
          recentAlerts,
          latestPrediction,
          lastUpdated,
        }}
      />

    </div>
  );
};

export default Dashboard;