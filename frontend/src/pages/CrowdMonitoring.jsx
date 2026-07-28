import { useEffect, useMemo, useState } from "react";

import Layout from "../components/layout/Layout";

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
  const [summary, setSummary] = useState({});
  const [stations, setStations] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("");

  const [filters, setFilters] = useState({
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

      setSummary(summaryData || {});
      setStations(stationData || []);
      setAlerts(alertData || []);

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

    const timer = setInterval(loadData, 30000);

    return () => clearInterval(timer);
  }, []);

  const filteredStations = useMemo(() => {
    let data = [...stations];

    if (filters.search) {
      const keyword = filters.search.toLowerCase();

      data = data.filter((station) => {
        const name = (
          station.station_name ||
          station.station ||
          station.name ||
          ""
        ).toLowerCase();

        return name.includes(keyword);
      });
    }

    data = data.map((station) => {
      const passengers =
        station.passengers ??
        station.total_passengers ??
        0;

      const occupancy =
        station.occupancy ??
        Math.min(
          Math.round((passengers / 10000) * 100),
          100
        );

      let risk = "LOW";

      if (occupancy >= 80) risk = "HIGH";
      else if (occupancy >= 60) risk = "MEDIUM";

      return {
        ...station,
        passengers,
        occupancy,
        risk,
      };
    });

    if (filters.risk !== "ALL") {
      data = data.filter(
        (station) => station.risk === filters.risk
      );
    }

    if (filters.occupancy === "HIGH") {
      data = data.filter(
        (station) => station.occupancy >= 80
      );
    } else if (filters.occupancy === "MEDIUM") {
      data = data.filter(
        (station) =>
          station.occupancy >= 60 &&
          station.occupancy < 80
      );
    } else if (filters.occupancy === "LOW") {
      data = data.filter(
        (station) => station.occupancy < 60
      );
    }

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
            b.passengers - a.passengers
        );
        break;

      case "OCCUPANCY":
        data.sort(
          (a, b) =>
            b.occupancy - a.occupancy
        );
        break;

      default:
        data.sort(
          (a, b) =>
            b.occupancy - a.occupancy
        );
    }

    return data;
  }, [stations, filters]);

  /* ==========================
      Loading Screen
  ========================== */

  if (loading) {
    return (
      <Layout>

        <div className="flex min-h-[80vh] items-center justify-center">

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

      </Layout>
    );
  }

  /* ==========================
      Dashboard
  ========================== */

  return (

    <Layout>

      <div className="mx-auto max-w-7xl space-y-10">

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

        <div className="sticky top-0 z-10 -mx-1 rounded-2xl bg-slate-50/80 px-1 py-1 backdrop-blur-sm">
          <MonitoringFilters
            onFilterChange={setFilters}
          />
        </div>

        {/* ==========================
            Station Monitoring
        ========================== */}

        {filteredStations.length === 0 ? (

          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">

            <h3 className="text-xl font-bold text-slate-800">
              No Stations Match Your Filters
            </h3>

            <p className="mt-2 text-slate-500">
              Try adjusting the search, risk, or occupancy filters above.
            </p>

          </div>

        ) : (

          <StationStatusGrid
            busiestStations={filteredStations}
          />

        )}

        {/* ==========================
            Crowd Density Analytics
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

      </div>

    </Layout>

  );

}

export default CrowdMonitoring;