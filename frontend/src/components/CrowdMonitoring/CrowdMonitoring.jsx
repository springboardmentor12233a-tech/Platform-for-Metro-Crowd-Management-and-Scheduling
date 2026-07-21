import { useEffect, useMemo, useState } from "react";
import { Search, Radio } from "lucide-react";

import {
  getLiveCrowdMonitoring,
  getNetworkSummary,
} from "../../api/dashboardApi";

import KPICards from "../../components/CrowdMonitoring/KPICards";
import MetroNetwork from "../../components/CrowdMonitoring/MetroNetwork";
import AIInsights from "../../components/CrowdMonitoring/AIInsights";
import LiveAlertPanel from "../../components/CrowdMonitoring/LiveAlertPanel";
import StationCard from "../../components/CrowdMonitoring/StationCard";

import MetroNetworkMap from "../../components/CrowdMonitoring/MetroNetworkMap";
import CrowdDistributionChart from "../../components/CrowdMonitoring/CrowdDistributionChart";
import BusiestCrowdChart from "../../components/CrowdMonitoring/BusiestCrowdChart";
import LiveIncidentTimeline from "../../components/CrowdMonitoring/LiveIncidentTimeline";

function CrowdMonitoring() {
  const [stations, setStations] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    try {
      const [liveData, summaryData] = await Promise.all([
        getLiveCrowdMonitoring(),
        getNetworkSummary(),
      ]);

      setStations(liveData);
      setSummary(summaryData);
    } catch (err) {
      console.error("Failed to load dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const interval = setInterval(fetchData, 30000);

    return () => clearInterval(interval);
  }, []);

  const filteredStations = useMemo(() => {
    return stations.filter((station) =>
      station.station.toLowerCase().includes(search.toLowerCase())
    );
  }, [stations, search]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>

          <h2 className="text-3xl font-bold text-slate-700">
            Initializing MetroFlow...
          </h2>

          <p className="text-slate-500 mt-3">
            Connecting to the AI Crowd Monitoring Engine
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">

      {/* ================= HERO HEADER ================= */}

      <section className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white shadow-xl">

        <div className="max-w-[1800px] mx-auto px-8 py-10">

          <div className="flex flex-col xl:flex-row justify-between items-start">

            <div>

              <p className="uppercase tracking-[0.35em] text-cyan-400 text-sm font-semibold">
                AI Metro Operations Platform
              </p>

              <h1 className="mt-3 text-5xl font-extrabold">
                MetroFlow Command Center
              </h1>

              <p className="mt-5 max-w-3xl text-slate-300 text-lg leading-8">
                Real-time passenger monitoring, AI-powered crowd prediction,
                operational intelligence, and live analytics across the Delhi
                Metro Network.
              </p>

            </div>

            <div className="mt-8 xl:mt-0">

              <div className="rounded-3xl bg-white/10 backdrop-blur-xl border border-white/10 p-6 min-w-[280px]">

                <div className="flex items-center gap-3">

                  <Radio
                    className="text-green-400 animate-pulse"
                    size={20}
                  />

                  <span className="font-semibold tracking-wide">
                    LIVE NETWORK
                  </span>

                </div>

                <div className="mt-6">

                  <h2 className="text-3xl font-bold">
                    {new Date().toLocaleTimeString()}
                  </h2>

                  <p className="text-slate-300 mt-2">
                    {new Date().toLocaleDateString()}
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      <div className="max-w-[1800px] mx-auto px-8 py-8">

        {/* ================= KPI CARDS ================= */}

        <KPICards
          stations={stations}
          summary={summary}
        />

        {/* PART 2 STARTS FROM HERE */}
                {/* ================= COMMAND CENTER ================= */}

        <div className="grid xl:grid-cols-3 gap-8 mt-8 mb-10">

          {/* Metro Digital Twin */}

          <div className="xl:col-span-2 space-y-8">

            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">

              <div className="px-8 py-6 border-b border-slate-200 flex justify-between items-center">

                <div>

                  <h2 className="text-2xl font-bold text-slate-900">
                    Metro Digital Twin
                  </h2>

                  <p className="text-slate-500 mt-1">
                    Live AI visualization of the Delhi Metro network
                  </p>

                </div>

                <div className="flex items-center gap-2 text-green-600 font-semibold">

                  <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>

                  LIVE

                </div>

              </div>

              <div className="p-6">

                <MetroNetworkMap
                  stations={stations}
                />

              </div>

            </div>

          </div>

          {/* AI COMMAND CENTER */}

          <div>

            <AIInsights
              stations={stations}
              summary={summary}
            />

          </div>

        </div>

        {/* ================= NETWORK ANALYTICS ================= */}

        <div className="grid lg:grid-cols-2 gap-8 mb-10">

          <div className="bg-white rounded-3xl shadow-xl border border-slate-200">

            <div className="px-8 py-6 border-b border-slate-200">

              <h2 className="text-xl font-bold">
                Crowd Distribution
              </h2>

              <p className="text-slate-500 mt-1">
                Passenger distribution across stations
              </p>

            </div>

            <div className="p-6">

              <CrowdDistributionChart
                data={stations}
              />

            </div>

          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-slate-200">

            <div className="px-8 py-6 border-b border-slate-200">

              <h2 className="text-xl font-bold">
                Busiest Stations
              </h2>

              <p className="text-slate-500 mt-1">
                Highest passenger traffic today
              </p>

            </div>

            <div className="p-6">

              <BusiestCrowdChart
                data={stations}
              />

            </div>

          </div>

        </div>
        <div className="mb-10">

  <LiveIncidentTimeline
    stations={stations}
  />

</div>

        {/* ================= LIVE ALERTS ================= */}

        <div className="mb-10">

          <LiveAlertPanel
            stations={stations}
          />

        </div>

        {/* ================= SEARCH ================= */}

        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 mb-10">

          <div className="flex flex-col lg:flex-row justify-between lg:items-center mb-6">

            <div>

              <h2 className="text-2xl font-bold text-slate-900">
                Live Station Monitoring
              </h2>

              <p className="text-slate-500 mt-1">
                Search and inspect AI-powered crowd analytics
              </p>

            </div>

            <div className="text-sm text-slate-500 mt-4 lg:mt-0">

              Auto Refresh :
              <span className="font-semibold ml-2 text-indigo-600">
                Every 30 Seconds
              </span>

            </div>

          </div>

          <div className="relative">

            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
              size={22}
            />

            <input
              type="text"
              placeholder="Search station..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-14 pr-6 py-4 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />

          </div>

          <div className="flex justify-between mt-5 text-sm text-slate-500">

            <span>

              Showing
              <strong className="mx-1">
                {filteredStations.length}
              </strong>
              Stations

            </span>

            <span>

              Total Network :
              <strong className="ml-1">
                {stations.length}
              </strong>

            </span>

          </div>

        </div>

        {/* PART 3 STARTS HERE */}
                {/* ================= LIVE STATION GRID ================= */}

        <div className="mb-12">

          <div className="flex flex-col lg:flex-row justify-between lg:items-center mb-8">

            <div>

              <h2 className="text-3xl font-bold text-slate-900">
                Live Station Monitoring
              </h2>

              <p className="text-slate-500 mt-2">
                Real-time occupancy, AI prediction, congestion risk and operational recommendations.
              </p>

            </div>

            <div className="flex flex-wrap gap-6 mt-5 lg:mt-0">

              <div className="flex items-center gap-2">

                <span className="w-3 h-3 rounded-full bg-green-500"></span>

                <span className="text-sm font-medium text-slate-600">
                  Normal
                </span>

              </div>

              <div className="flex items-center gap-2">

                <span className="w-3 h-3 rounded-full bg-yellow-500"></span>

                <span className="text-sm font-medium text-slate-600">
                  Moderate
                </span>

              </div>

              <div className="flex items-center gap-2">

                <span className="w-3 h-3 rounded-full bg-red-500"></span>

                <span className="text-sm font-medium text-slate-600">
                  High Crowd
                </span>

              </div>

            </div>

          </div>

          {filteredStations.length === 0 ? (

            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl py-24 text-center">

              <div className="text-7xl mb-6">
                🚉
              </div>

              <h2 className="text-3xl font-bold text-slate-800">

                No Station Found

              </h2>

              <p className="mt-3 text-slate-500">

                Try another search keyword.

              </p>

            </div>

          ) : (

            <div className="grid gap-6 md:grid-cols-2 2xl:grid-cols-3">

              {filteredStations.map((station) => (

                <StationCard
                  key={station.station}
                  station={station}
                />

              ))}

            </div>

          )}

        </div>

        {/* ================= FOOTER ================= */}

        <footer className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 text-white p-8">

          <div className="flex flex-col xl:flex-row justify-between items-center gap-8">

            <div>

              <h2 className="text-2xl font-bold">

                MetroFlow AI Crowd Management Platform

              </h2>

              <p className="mt-2 text-slate-300 max-w-2xl">

                AI-powered operational intelligence platform for
                real-time passenger monitoring, congestion prediction,
                metro analytics and intelligent scheduling.

              </p>

            </div>

            <div className="grid grid-cols-2 gap-8">

              <div className="text-center">

                <h3 className="text-3xl font-bold text-cyan-400">

                  {stations.length}

                </h3>

                <p className="text-slate-300">

                  Stations

                </p>

              </div>

              <div className="text-center">

                <h3 className="text-3xl font-bold text-green-400">

                  99.9%

                </h3>

                <p className="text-slate-300">

                  Uptime

                </p>

              </div>

            </div>

          </div>

          <div className="border-t border-white/10 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">

            <p className="text-slate-400">

              © 2026 MetroFlow AI • Built with React, FastAPI & AI Analytics

            </p>

            <div className="flex items-center gap-3 mt-4 md:mt-0">

              <span className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></span>

              <span className="font-semibold text-green-300">

                System Operational

              </span>

            </div>

          </div>

        </footer>

      </div>

    </div>

  );

}

export default CrowdMonitoring;
