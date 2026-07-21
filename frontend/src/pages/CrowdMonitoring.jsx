import { useEffect, useMemo, useState } from "react";

import LiveNetworkHeader from "../components/monitoring/LiveNetworkHeader";
import StationStatusGrid from "../components/monitoring/StationStatusGrid";
import LiveAlertFeed from "../components/monitoring/LiveAlertFeed";
import CrowdDensityPanel from "../components/monitoring/CrowdDensityPanel";
import AIRiskPanel from "../components/monitoring/AIRiskPanel";
import MonitoringFilters from "../components/monitoring/MonitoringFilters";

import {
  getDashboardSummary,
  getBusiestStations,
  getRecentAlerts,
} from "../services/dashboardApi";

function CrowdMonitoring() {

  const [summary, setSummary] =
    useState({});

  const [stations, setStations] =
    useState([]);

  const [alerts, setAlerts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [lastUpdated, setLastUpdated] =
    useState("");

  const [filters, setFilters] =
    useState({
      search: "",
      risk: "ALL",
      occupancy: "ALL",
      sortBy: "RISK",
    });

  async function loadData() {

    try {

      setLoading(true);

      const [
        summaryData,
        stationData,
        alertData,
      ] = await Promise.all([
        getDashboardSummary(),
        getBusiestStations(),
        getRecentAlerts(),
      ]);

      setSummary(summaryData);

      setStations(stationData);

      setAlerts(alertData);

      setLastUpdated(
        new Date().toLocaleTimeString()
      );

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }

  }

  useEffect(() => {

    loadData();

    const timer = setInterval(
      loadData,
      30000
    );

    return () =>
      clearInterval(timer);

  }, []);
    const filteredStations = useMemo(() => {

    let data = [...stations];

    // ==========================
    // Search
    // ==========================

    if (filters.search) {

      const keyword =
        filters.search.toLowerCase();

      data = data.filter((station) => {

        const name =
          (
            station.station_name ||
            station.station ||
            station.name ||
            ""
          ).toLowerCase();

        return name.includes(keyword);

      });

    }

    // ==========================
    // Enrich Station Data
    // ==========================

    data = data.map((station) => {

      const passengers =
        station.passengers ??
        station.total_passengers ??
        0;

      const occupancy =
        station.occupancy ??
        Math.min(
          Math.round(
            (passengers / 10000) * 100
          ),
          100
        );

      let risk = "LOW";

      if (occupancy >= 80) {
        risk = "HIGH";
      } else if (occupancy >= 60) {
        risk = "MEDIUM";
      }

      return {
        ...station,
        passengers,
        occupancy,
        risk,
      };

    });

    // ==========================
    // Risk Filter
    // ==========================

    if (filters.risk !== "ALL") {

      data = data.filter(
        (station) =>
          station.risk === filters.risk
      );

    }

    // ==========================
    // Occupancy Filter
    // ==========================

    if (filters.occupancy === "HIGH") {

      data = data.filter(
        (station) =>
          station.occupancy >= 80
      );

    } else if (
      filters.occupancy === "MEDIUM"
    ) {

      data = data.filter(
        (station) =>
          station.occupancy >= 60 &&
          station.occupancy < 80
      );

    } else if (
      filters.occupancy === "LOW"
    ) {

      data = data.filter(
        (station) =>
          station.occupancy < 60
      );

    }

    // ==========================
    // Sorting
    // ==========================

    switch (filters.sortBy) {

      case "NAME":

        data.sort((a, b) =>
          (
            a.station_name ||
            a.station ||
            ""
          ).localeCompare(
            b.station_name ||
            b.station ||
            ""
          )
        );

        break;

      case "PASSENGERS":

        data.sort(
          (a, b) =>
            b.passengers -
            a.passengers
        );

        break;

      case "OCCUPANCY":

        data.sort(
          (a, b) =>
            b.occupancy -
            a.occupancy
        );

        break;

      case "RISK":
      default:

        data.sort(
          (a, b) =>
            b.occupancy -
            a.occupancy
        );

    }

    return data;

  }, [stations, filters]);
    if (loading) {

    return (

      <div className="flex min-h-screen items-center justify-center bg-slate-50">

        <div className="text-center">

          <div
            className="
              mx-auto
              h-16
              w-16
              animate-spin
              rounded-full
              border-4
              border-cyan-200
              border-t-cyan-600
            "
          />

          <p className="mt-6 text-lg font-medium text-slate-600">
            Loading Crowd Monitoring Dashboard...
          </p>

        </div>

      </div>

    );

  }

  return (

    <div className="min-h-screen bg-slate-50">

      <div className="mx-auto max-w-7xl space-y-8 p-6">

        {/* ==========================
            Live Network Header
        ========================== */}

        <LiveNetworkHeader
          summary={summary}
          recentAlerts={alerts}
          lastUpdated={lastUpdated}
        />

        {/* ==========================
            Monitoring Filters
        ========================== */}

        <MonitoringFilters
          onFilterChange={setFilters}
        />

        {/* ==========================
            Station Monitoring
        ========================== */}

        <StationStatusGrid
          busiestStations={filteredStations}
        />

        {/* ==========================
            Analytics
        ========================== */}

        <CrowdDensityPanel
          busiestStations={filteredStations}
        />

        {/* ==========================
            AI Risk Assessment
        ========================== */}

        <AIRiskPanel
          busiestStations={filteredStations}
        />

        {/* ==========================
            Live Alert Feed
        ========================== */}

        <LiveAlertFeed
          recentAlerts={alerts}
        />
                {/* ==========================
            Network Status Footer
        ========================== */}

        <section
          className="
            rounded-3xl
            border
            border-cyan-200
            bg-gradient-to-r
            from-cyan-50
            via-white
            to-blue-50
            p-8
            shadow-sm
          "
        >

          <div className="grid gap-8 lg:grid-cols-2">

            {/* Left */}

            <div>

              <h2 className="text-2xl font-bold text-slate-900">
                Live Monitoring Status
              </h2>

              <p className="mt-4 leading-8 text-slate-600">

                MetroFlow AI continuously monitors passenger
                density, occupancy trends, and operational
                risks across the metro network. The dashboard
                refreshes automatically every 30 seconds,
                ensuring operators always have the latest
                network information.

              </p>

            </div>

            {/* Right */}

            <div className="space-y-5">

              <div className="flex items-center justify-between rounded-2xl bg-white p-5">

                <span className="font-medium text-slate-600">
                  Stations Monitored
                </span>

                <span className="text-xl font-bold text-cyan-700">
                  {filteredStations.length}
                </span>

              </div>

              <div className="flex items-center justify-between rounded-2xl bg-white p-5">

                <span className="font-medium text-slate-600">
                  Active Alerts
                </span>

                <span className="text-xl font-bold text-red-600">
                  {alerts.length}
                </span>

              </div>

              <div className="flex items-center justify-between rounded-2xl bg-white p-5">

                <span className="font-medium text-slate-600">
                  Last Updated
                </span>

                <span className="font-semibold text-emerald-600">
                  {lastUpdated}
                </span>

              </div>

            </div>

          </div>

        </section>

      </div>

    </div>

  );

}

export default CrowdMonitoring;