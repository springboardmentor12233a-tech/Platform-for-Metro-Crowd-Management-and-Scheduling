import { useEffect, useMemo, useState } from "react";
import { Search, Radio } from "lucide-react";

import {
  getLiveCrowdMonitoring,
  getNetworkSummary,
} from "../../api/dashboardApi";

import useMetro from "../../hooks/useMetro";

import LiveAlertPanel from "../../components/CrowdMonitoring/LiveAlertPanel";
import KPICards from "../../components/CrowdMonitoring/KPICards";
import MetroNetwork from "../../components/CrowdMonitoring/MetroNetwork";
import MetroNetworkMap from "../../components/CrowdMonitoring/MetroNetworkMap";
import AIInsights from "../../components/CrowdMonitoring/AIInsights";
import StationCard from "../../components/CrowdMonitoring/StationCard";

import CrowdDistributionChart from "../../components/CrowdMonitoring/CrowdDistributionChart";
import BusiestCrowdChart from "../../components/CrowdMonitoring/BusiestCrowdChart";

function CrowdMonitoring() {
  // ==========================================
  // Global Context
  // ==========================================

  const { selectedStation } = useMetro();

  // ==========================================
  // Local State
  // ==========================================

  const [stations, setStations] = useState([]);
  const [summary, setSummary] = useState(null);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  // ==========================================
  // Load API Data
  // ==========================================

  const loadData = async () => {
    try {
      const [liveData, summaryData] = await Promise.all([
        getLiveCrowdMonitoring(),
        getNetworkSummary(),
      ]);

      setStations(liveData);
      setSummary(summaryData);
    } catch (error) {
      console.error("Failed to load crowd monitoring:", error);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Initial Load
  // ==========================================

  useEffect(() => {
    loadData();

    const interval = setInterval(() => {
      loadData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // ==========================================
  // Search
  // ==========================================

  const filteredStations = useMemo(() => {
    return stations.filter((station) =>
      station.station
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [stations, search]);

  // ==========================================
  // Selected Station
  // ==========================================

  const selectedStationData = useMemo(() => {
    if (!selectedStation) return null;

    return (
      stations.find(
        (station) =>
          station.station.toLowerCase() ===
          selectedStation.toLowerCase()
      ) || null
    );
  }, [stations, selectedStation]);

  // ==========================================
  // Prioritize Selected Station
  // ==========================================

  const orderedStations = useMemo(() => {
    if (!selectedStationData) {
      return filteredStations;
    }

    return [
      selectedStationData,
      ...filteredStations.filter(
        (station) =>
          station.station !== selectedStationData.station
      ),
    ];
  }, [filteredStations, selectedStationData]);

  // ==========================================
  // Loading Screen
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center">

          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>

          <h2 className="text-2xl font-bold text-slate-700">
            Loading MetroFlow...
          </h2>

          <p className="text-slate-500 mt-2">
            Initializing AI Crowd Monitoring System
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8">

      {/* ==========================================
          Header
      ========================================== */}

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">

        <div>

          <h1 className="text-5xl font-bold text-slate-900">
            MetroFlow Crowd Control Center
          </h1>

          <p className="text-slate-500 mt-2 text-lg">
            AI-powered real-time crowd monitoring dashboard
          </p>

        </div>

        <div className="mt-5 lg:mt-0 flex items-center gap-3 bg-green-100 text-green-700 px-5 py-3 rounded-full font-semibold">

          <Radio
            className="animate-pulse"
            size={18}
          />

          LIVE

        </div>

      </div>

      {/* ==========================================
          Selected Station Banner
      ========================================== */}

      {selectedStationData && (

        <div className="mb-8 rounded-3xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 text-white shadow-xl overflow-hidden">

          <div className="flex flex-col lg:flex-row justify-between items-center gap-8 p-8">

            <div>

              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-semibold">

                <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse"></span>

                Synced from Incident Management

              </div>

              <h2 className="mt-5 text-4xl font-bold">
                {selectedStationData.station}
              </h2>

              <p className="mt-3 text-blue-100">
                This station is currently synchronized across MetroFlow.
              </p>

            </div>

            <div className="grid grid-cols-2 gap-5">

              <div className="rounded-2xl bg-white/15 backdrop-blur-md p-5">

                <p className="text-sm text-blue-100">
                  Crowd Level
                </p>

                <h3 className="mt-2 text-3xl font-bold">
                  {selectedStationData.crowd_level}
                </h3>

              </div>

              <div className="rounded-2xl bg-white/15 backdrop-blur-md p-5">

                <p className="text-sm text-blue-100">
                  Occupancy
                </p>

                <h3 className="mt-2 text-3xl font-bold">
                  {selectedStationData.occupancy}%
                </h3>

              </div>

            </div>

          </div>

        </div>

      )}
            {/* ==========================================
          Live Alert Panel
      ========================================== */}

      <LiveAlertPanel
        stations={stations}
        selectedStation={selectedStation}
      />

      {/* ==========================================
          KPI Cards
      ========================================== */}

      <KPICards
        stations={stations}
        summary={summary}
        selectedStation={selectedStationData}
      />

      {/* ==========================================
          Metro Network + AI Insights
      ========================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">

        <div className="xl:col-span-2">

          <MetroNetwork
            stations={stations}
            summary={summary}
            selectedStation={selectedStationData}
          />

        </div>

        <div>

          <AIInsights
            stations={stations}
            summary={summary}
            selectedStation={selectedStationData}
          />

        </div>

      </div>

      {/* ==========================================
          Interactive Metro Network Map
      ========================================== */}

      <div className="mb-8">

        <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-6">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">

            <div>

              <h2 className="text-2xl font-bold text-slate-900">
                Live Metro Network Map
              </h2>

              <p className="text-slate-500 mt-1">
                AI-powered visualization of crowd levels across the metro network.
              </p>

            </div>

            <div className="flex flex-wrap items-center gap-5 text-sm">

              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                <span>Low</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                <span>Medium</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                <span>High</span>
              </div>

            </div>

          </div>

          <MetroNetworkMap
            stations={stations}
            selectedStation={selectedStationData}
          />

        </div>

      </div>

      {/* ==========================================
          Analytics
      ========================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

        <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-6">

          <div className="flex items-center justify-between mb-6">

            <div>

              <h2 className="text-xl font-bold text-slate-900">
                Crowd Distribution
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Current passenger distribution across the network.
              </p>

            </div>

            {selectedStationData && (

              <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-700">

                Focus: {selectedStationData.station}

              </span>

            )}

          </div>

          <CrowdDistributionChart
            data={stations}
            selectedStation={selectedStationData}
          />

        </div>

        <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-6">

          <div className="flex items-center justify-between mb-6">

            <div>

              <h2 className="text-xl font-bold text-slate-900">
                Busiest Stations
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                AI ranked passenger volume analysis.
              </p>

            </div>

            {selectedStationData && (

              <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">

                Selected: {selectedStationData.station}

              </span>

            )}

          </div>

          <BusiestCrowdChart
            data={stations}
            selectedStation={selectedStationData}
          />

        </div>

      </div>
            {/* ==========================================
          Search
      ========================================== */}

      <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-6 mb-10">

        <div className="relative">

          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
            size={20}
          />

          <input
            type="text"
            placeholder="Search metro station..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-14 pr-5 py-4 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

        </div>

        <div className="mt-5 flex flex-col gap-3 text-sm text-slate-500 md:flex-row md:justify-between">

          <span>
            Showing <strong>{orderedStations.length}</strong> stations
          </span>

          <span>
            Auto Refresh: <strong>30 sec</strong>
          </span>

        </div>

      </div>

      {/* ==========================================
          Live Station Monitoring
      ========================================== */}

      <div className="mb-10">

        <div className="mb-6 flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">

          <div>

            <h2 className="text-3xl font-bold text-slate-900">
              Live Station Monitoring
            </h2>

            <p className="mt-1 text-slate-500">
              AI-powered monitoring with crowd prediction and operational
              recommendations.
            </p>

          </div>

          <div className="flex items-center gap-6 text-sm">

            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-green-500"></span>
              <span>Low Risk</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-yellow-400"></span>
              <span>Moderate Risk</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-500"></span>
              <span>High Risk</span>
            </div>

          </div>

        </div>

        {orderedStations.length === 0 ? (

          <div className="rounded-3xl border border-slate-200 bg-white p-16 text-center shadow-lg">

            <h2 className="text-2xl font-bold text-slate-700">
              No Stations Found
            </h2>

            <p className="mt-2 text-slate-500">
              Try searching with another station name.
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 2xl:grid-cols-3">

            {orderedStations.map((station) => (

              <StationCard
                key={station.station}
                station={station}
                selected={
                  selectedStationData?.station === station.station
                }
              />

            ))}

          </div>

        )}

      </div>
            {/* ==========================================
          Footer
      ========================================== */}

      <footer className="mt-14 border-t border-slate-300 pt-8">

        <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">

          <div>

            <h3 className="text-xl font-bold text-slate-800">
              MetroFlow AI Crowd Management Platform
            </h3>

            <p className="mt-2 text-slate-500">
              Real-time crowd monitoring • Predictive AI • Operational Intelligence • Live Analytics
            </p>

          </div>

          <div className="flex flex-wrap items-center gap-6">

            {selectedStationData && (

              <div className="text-right">

                <p className="text-sm text-slate-500">
                  Active Station
                </p>

                <p className="font-bold text-indigo-600">
                  {selectedStationData.station}
                </p>

              </div>

            )}

            <div className="text-right">

              <p className="text-sm text-slate-500">
                Last Updated
              </p>

              <p className="font-semibold">
                {new Date().toLocaleTimeString()}
              </p>

            </div>

            <div className="flex items-center gap-2 rounded-full bg-green-100 px-4 py-2">

              <span className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></span>

              <span className="font-semibold text-green-700">
                System Online
              </span>

            </div>

          </div>

        </div>

      </footer>

    </div>
  );
}

export default CrowdMonitoring;