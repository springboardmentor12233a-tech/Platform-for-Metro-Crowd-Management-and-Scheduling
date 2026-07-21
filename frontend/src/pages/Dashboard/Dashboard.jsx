import { useEffect, useState } from "react";

import Layout from "../../components/layout/Layout";
import MetricCard from "../../components/dashboard/MetricCard";
import PassengerTrendChart from "../../components/dashboard/PassengerTrendChart";
import TicketDistributionChart from "../../components/dashboard/TicketDistributionChart";
import RevenueChart from "../../components/dashboard/RevenueChart";
import TopRoutesTable from "../../components/dashboard/TopRoutesTable";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import MetroStatusCard from "../../components/dashboard/MetroStatusCard";
import AIOperationsCenter from "../../components/dashboard/AIOperationsCenter";
import CongestionHeatmap from "../../components/dashboard/CongestionHeatmap";
import PassengerForecast from "../../components/dashboard/PassengerForecast";
import NetworkHealthAnalytics from "../../components/dashboard/NetworkHealthAnalytics";
import {
  Users,
  TrainFront,
  MapPinned,
  IndianRupee,
} from "lucide-react";

import { MdTrain } from "react-icons/md";

import {
  getDashboardSummary,
  getBusiestStations,
  getPassengerTrend,
  getTicketDistribution,
  getRevenueAnalysis,
  getTopRoutes,
  getLiveDashboard
} from "../../api/dashboardApi";

function Dashboard() {
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
  const [liveDashboard, setLiveDashboard] = useState(null);
  const [latestPrediction, setLatestPrediction] = useState(null);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [recentHistory, setRecentHistory] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());

 useEffect(() => {
  loadDashboard();

  const interval = setInterval(() => {
    loadDashboard();
  }, 30000);

  return () => clearInterval(interval);
}, []);

  const loadDashboard = async () => {
    try {
     const [
  summaryData,
  stationsData,
  trend,
  tickets,
  revenue,
  routes,
  liveData,
] = await Promise.all([
  getDashboardSummary(),
  getBusiestStations(),
  getPassengerTrend(),
  getTicketDistribution(),
  getRevenueAnalysis(),
  getTopRoutes(),
  getLiveDashboard(),
]);

      setSummary(summaryData);
      setBusiestStations(stationsData);
      setTrendData(trend);
      setTicketData(tickets);
      setRevenueData(revenue);
      setTopRoutes(routes);
      setLiveDashboard(liveData);
setLatestPrediction(liveData.latest_prediction);
setRecentAlerts(liveData.alerts);
setRecentHistory(liveData.recent_history);
setLastUpdated(new Date());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[70vh]">
          <div className="text-2xl font-semibold animate-pulse">
            Loading Dashboard...
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>

      <DashboardHeader />
<div
  className="
    mb-7
    rounded-2xl
    border
    border-green-200
    bg-green-50
    px-6
    py-4
    flex
    flex-wrap
    items-center
    justify-between
    gap-4
  "
>

  <div className="flex items-center gap-3">

    <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>

    <span className="font-semibold text-green-700">
      Metro Operations Live
    </span>

  </div>

  <div className="text-slate-600 text-sm">

    Last Updated :
    {" "}
    <strong>
      {lastUpdated.toLocaleTimeString()}
    </strong>

  </div>

  <div
    className="
      rounded-full
      bg-indigo-100
      px-4
      py-2
      text-indigo-700
      font-semibold
    "
  >
    Auto Refresh : 30 sec
  </div>

</div>

{/* ===================== LIVE OPERATIONS ===================== */}

<div className="grid grid-cols-1 lg:grid-cols-3 gap-7 mb-8">

  {/* Latest Prediction */}

  <div className="dashboard-card rounded-3xl p-7">

    <div className="flex items-center justify-between">

      <h2 className="text-2xl font-bold">
        🤖 Latest AI Prediction
      </h2>

      <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 font-semibold">
        LIVE
      </span>

    </div>

    {latestPrediction ? (

      <div className="mt-6 space-y-3">

        <p>
          <strong>From:</strong> {latestPrediction.from_station}
        </p>

        <p>
          <strong>To:</strong> {latestPrediction.to_station}
        </p>

        <p>
          <strong>Passengers:</strong>{" "}
          {latestPrediction.predicted_passengers}
        </p>

        <p>
          <strong>Ticket:</strong>{" "}
          {latestPrediction.ticket_type}
        </p>

      </div>

    ) : (

      <p className="mt-6 text-slate-500">
        No prediction available.
      </p>

    )}

  </div>

  {/* Active Alerts */}

  <div className="dashboard-card rounded-3xl p-7">

    <h2 className="text-2xl font-bold">
      🚨 Active Alerts
    </h2>

    <div className="mt-6 space-y-4">

      {recentAlerts.length === 0 ? (

        <p className="text-slate-500">
          No active alerts.
        </p>

      ) : (

        recentAlerts.map((alert) => (

          <div
  key={alert.id ?? `${alert.station}-${alert.severity}`}
  className={`
    rounded-xl
    border
    p-4
    ${
      alert.severity === "Critical"
        ? "bg-red-50 border-red-300"
        : alert.severity === "Warning"
        ? "bg-yellow-50 border-yellow-300"
        : "bg-green-50 border-green-300"
    }
  `}
>

  <div className="flex justify-between items-center">

    <h3 className="font-bold">
      {alert.station}
    </h3>

    <span
      className={`
        px-3
        py-1
        rounded-full
        text-xs
        font-bold
        ${
          alert.severity === "Critical"
            ? "bg-red-500 text-white"
            : alert.severity === "Warning"
            ? "bg-yellow-500 text-white"
            : "bg-green-500 text-white"
        }
      `}
    >
      {alert.severity}
    </span>

  </div>

  <p className="mt-3 text-slate-700">
    {alert.message}
  </p>

</div>

        ))

      )}

    </div>

  </div>

  {/* Recent Predictions */}

  <div className="dashboard-card rounded-3xl p-7">

    <h2 className="text-2xl font-bold">
      📜 Recent Predictions
    </h2>

    <div className="mt-6 space-y-3">

      {recentHistory.length === 0 ? (

        <p className="text-slate-500">
          No recent predictions.
        </p>

      ) : (

        recentHistory.map((item) => (

          <div
            key={item.id ?? `${item.from_station}-${item.to_station}`}
            className="flex justify-between border-b pb-2"
          >
            <span>
              {item.from_station}
            </span>

            <span className="font-semibold text-indigo-600">
              {item.predicted_passengers}
            </span>

          </div>

        ))

      )}

    </div>

  </div>

</div>

{/* ===================== KPI CARDS ===================== */}

<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-7 mb-8">

  <MetricCard
    title="Total Passengers"
    value={summary.total_passengers}
    prefix=""
    icon={<Users size={30} strokeWidth={2.2} />}
    iconBg="bg-gradient-to-br from-violet-500 to-indigo-600"
    valueColor="text-slate-900"
    lineColor="#7C3AED"
    growth="12.5%"
  />

  <MetricCard
    title="Total Trips"
    value={summary.total_trips}
    prefix=""
    icon={<TrainFront size={30} strokeWidth={2.2} />}
    iconBg="bg-gradient-to-br from-green-500 to-emerald-600"
    valueColor="text-slate-900"
    lineColor="#10B981"
    growth="8.3%"
  />

  <MetricCard
    title="Stations"
    value={summary.total_stations}
    prefix=""
    icon={<MapPinned size={30} strokeWidth={2.2} />}
    iconBg="bg-gradient-to-br from-red-500 to-pink-500"
    valueColor="text-slate-900"
    lineColor="#F97316"
    growth="2.1%"
  />

  <MetricCard
    title="Revenue"
    value={summary.total_revenue}
    prefix="₹ "
    icon={<IndianRupee size={30} strokeWidth={2.2} />}
    iconBg="bg-gradient-to-br from-yellow-400 to-orange-500"
    valueColor="text-slate-900"
    lineColor="#F59E0B"
    growth="15.7%"
  />

</div>
<AIOperationsCenter
  summary={summary}
  busiestStations={busiestStations}
  recentAlerts={recentAlerts}
  latestPrediction={latestPrediction}
  lastUpdated={lastUpdated}
/>

<div className="mt-8">
  <CongestionHeatmap
    busiestStations={busiestStations}
  />
</div>

<div className="mt-8">
  <PassengerForecast
    latestPrediction={latestPrediction}
  />
</div>

<div className="mt-8">
  <NetworkHealthAnalytics
    summary={summary}
    recentAlerts={recentAlerts}
    lastUpdated={lastUpdated}
  />
</div>



{/* ===================== Metro Status ===================== */}

<div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-8 mb-8">

  <MetroStatusCard />

  <div className="dashboard-card rounded-3xl p-7">

    <h2 className="text-2xl font-bold mb-5">
      🚨 Live AI Alerts
    </h2>

    {recentAlerts.length === 0 ? (

      <p className="text-slate-500">
        No active alerts.
      </p>

    ) : (

      <div className="space-y-4">

        {recentAlerts.map((alert) => (

          <div
            key={alert.id ?? `${alert.station}-${alert.message}`}
            className="rounded-xl border border-red-200 bg-red-50 p-4"
          >

            <h3 className="font-bold">
              {alert.station}
            </h3>

            <p className="text-red-600 mt-2">
              {alert.message}
            </p>

          </div>

        ))}

      </div>

    )}

  </div>

</div>

    {/* ===================== Top Stations ===================== */}

<div className="dashboard-card mt-8">

  {/* Header */}

  <div className="flex items-center justify-between border-b border-slate-200 px-8 py-6">

    <div>

      <h2 className="text-3xl font-bold flex items-center gap-3">

        🏆 Top 5 Busiest Stations

      </h2>

      <p className="text-slate-500 mt-1">
        Highest passenger traffic today
      </p>

    </div>

    <button
      className="
      px-5
      py-2.5
      rounded-xl
      bg-gradient-to-r
      from-indigo-600
      to-violet-600
      text-white
      font-semibold
      shadow-md
      hover:shadow-xl
      hover:scale-105
      transition-all
      "
    >
      View All →
    </button>

  </div>

  {/* Cards */}

  <div className="p-6 space-y-5">

    {busiestStations.map((station, index) => {

      const medals = ["🥇", "🥈", "🥉", "4", "5"];

      const colors = [
        "from-yellow-400 to-orange-500",
        "from-slate-300 to-slate-500",
        "from-orange-400 to-amber-600",
        "from-indigo-500 to-violet-600",
        "from-indigo-500 to-violet-600",
      ];

      const occupancy = Math.min(
        Math.round((station.passengers / 320000) * 100),
        100
      );

      return (

        <div
          key={
            station.station_id ??
            station.station ??
            `${station.station}-${index}`
          }
          className="
          group
          rounded-3xl
          border
          border-slate-200
          bg-white
          p-6
          shadow-sm
          hover:shadow-xl
          hover:border-indigo-300
          hover:-translate-y-1
          transition-all
          duration-300
          "
        >

          <div className="flex items-center justify-between">

            {/* LEFT */}

            <div className="flex items-center gap-5">

              {/* Rank */}

              <div
                className={`
                w-14
                h-14
                rounded-2xl
                bg-gradient-to-br
                ${colors[index]}
                text-white
                text-xl
                font-bold
                flex
                items-center
                justify-center
                shadow-lg
                `}
              >
                {medals[index]}
              </div>

              {/* Station */}

              <div>

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-lg">

                    🚉

                  </div>

                  <div>

                    <h3 className="font-bold text-xl text-slate-900">

                      {station.station}

                    </h3>

                    <p className="text-slate-500">

                      Metro Station

                    </p>

                  </div>

                </div>

                {/* Progress */}

                <div className="mt-4">

                  <div className="flex justify-between text-xs text-slate-500 mb-2">

                    <span>Occupancy</span>

                    <span>{occupancy}%</span>

                  </div>

                  <div className="w-[260px] h-2 rounded-full bg-slate-200 overflow-hidden">

                    <div
                      style={{
                        width: `${occupancy}%`,
                      }}
                      className="
                      h-full
                      rounded-full
                      bg-gradient-to-r
                      from-indigo-500
                      to-violet-600
                      "
                    />

                  </div>

                </div>

              </div>

            </div>

            {/* RIGHT */}

            <div className="text-right">

              <div
                className="
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-indigo-50
                px-4
                py-2
                text-indigo-700
                font-bold
                "
              >

                👥

                {station.passengers.toLocaleString()}

              </div>

              <div className="mt-4">

                <span
                  className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  bg-green-100
                  px-4
                  py-2
                  text-green-700
                  font-semibold
                  "
                >

                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/>

                  Active

                </span>

              </div>

            </div>

          </div>

        </div>

      );

    })}

  </div>

</div>
{/* ===================== Charts ===================== */}

<div className="grid grid-cols-1 xl:grid-cols-5 gap-8 mt-8">

  {/* Passenger Trend */}

  <div className="xl:col-span-3">

    <div
      className="
      dashboard-card
      h-[520px]
      p-8
      rounded-[32px]
      "
    >
      <PassengerTrendChart
        data={trendData}
      />
    </div>

  </div>

  {/* Ticket Distribution */}

  <div className="xl:col-span-2">

    <div
      className="
      dashboard-card
      h-[520px]
      p-8
      rounded-[32px]
      "
    >
      <TicketDistributionChart
        data={ticketData}
      />
    </div>

  </div>

</div>

{/* ===================== Bottom ===================== */}

<div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-8 mb-10">

  <div
    className="
    dashboard-card
    h-[520px]
    p-8
    rounded-[32px]
    "
  >

    <RevenueChart
      data={revenueData}
    />

  </div>

  <div
    className="
    dashboard-card
    h-[520px]
    p-8
    rounded-[32px]
    overflow-hidden
    "
  >

    <TopRoutesTable
      routes={topRoutes}
    />

  </div>

</div>
    </Layout>
  );
}

export default Dashboard;