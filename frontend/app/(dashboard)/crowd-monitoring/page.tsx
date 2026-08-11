'use client';

import { useEffect, useState, useRef } from "react";
import { useHour } from "../components/HourContext";
import {
  Users,
  Building2,
  AlertTriangle,
  Activity,
} from "lucide-react";

export default function CrowdMonitoringPage() {
  const { selectedHour } = useHour();

  const [stations, setStations] = useState<any[]>([]);
  const [kpi, setKpi] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedStation, setSelectedStation] = useState<any>(null);
  const [lastUpdated, setLastUpdated] = useState("");
  const busiestStation =
    stations.length > 0
      ? [...stations].sort((a, b) => b.passengers - a.passengers)[0]
      : null;

  const averagePassengers =
    stations.length > 0
      ? Math.round(
        stations.reduce((sum, s) => sum + s.passengers, 0) /
        stations.length
      )
      : 0;

  const averageCapacity =
    stations.length > 0
      ? (
        stations.reduce((sum, s) => sum + s.capacity, 0) /
        stations.length
      ).toFixed(1)
      : "0";
  const topStations = [...stations]
    .sort((a, b) => b.passengers - a.passengers)
    .slice(0, 5);
  console.log("Search array length:", stations.length);
  console.log(
    "TopStations variable:",
    topStations.map((s) => s.station_name)
  );
  console.log("Top 5:", topStations.map(s => s.station_name));
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("station_name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [alerts, setAlerts] = useState<any[]>([]);
  const detailsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {

    const fetchData = async () => {

      try {

        // Crowd data
        const response = await fetch(
          `http://127.0.0.1:8000/api/crowd/all-stations?hour=${selectedHour}`
        );
        const data = await response.json();

        // KPI data
        const kpiResponse = await fetch(
          `http://127.0.0.1:8000/api/dashboard/kpi?hour=${selectedHour}`
        );
        const kpiData = await kpiResponse.json();

        // Alerts
        const alertResponse = await fetch(
          `http://127.0.0.1:8000/api/alerts/active?hour=${selectedHour}`
        );
        const alertData = await alertResponse.json();

        // Update state
        console.log("Received:", data.stations.map((s: any) => s.station_name).slice(0, 10));
        setStations(data.stations || []);
        console.log("Stations received:", data.stations.length);
        console.log(
          "Top 5 from API:",
          [...data.stations]
            .sort((a, b) => b.passengers - a.passengers)
            .slice(0, 5)
            .map((s) => s.station_name)
        );
        setKpi(kpiData.kpis);
        setAlerts(alertData.alerts || []);
        setLastUpdated(new Date().toLocaleTimeString());

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }

    };

    fetchData();

    const interval = setInterval(fetchData, 10000);

    return () => clearInterval(interval);

  }, [selectedHour]);

  const filteredStations = stations
    .filter((station: any) => {
      const stationName = (station.station_name || "").toLowerCase();
      if (station.station_name === "Rajiv Chowk") {
        console.log("Searching:", search);
        console.log("Station:", station.station_name);
        console.log(
          "Matches:",
          stationName.includes(search.toLowerCase())
        );
      }

      const matchesSearch =
        stationName.includes(search.toLowerCase()) ||
        station.station_id.toString().includes(search);

      const matchesStatus =
        statusFilter === "All"
          ? true
          : station.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a: any, b: any) => {
      let valueA = a[sortBy];
      let valueB = b[sortBy];

      if (typeof valueA === "string") {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }

      if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
      if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;

      return 0;
    });

  console.log(
    "Filtered:",
    filteredStations.map((s: any) => s.station_name)
  );

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const aiRecommendation = () => {

    const critical = stations.filter(
      (s: any) => s.status === "Critical"
    ).length;

    const overcrowded = stations.filter(
      (s: any) => s.status === "Overcrowded"
    ).length;

    const busiest = [...stations].sort(
      (a, b) => b.passengers - a.passengers
    )[0];

    if (critical > 0) {
      return {
        title: "🔴 Critical Alert",
        message: `Deploy additional trains immediately. ${critical} stations are operating at critical capacity.`,
        color: "border-red-500 bg-red-950/30"
      };
    }

    if (overcrowded > 0) {
      return {
        title: "🟡 Traffic Increasing",
        message: `${overcrowded} stations are overcrowded. Monitor ${busiest?.station_name} closely.`,
        color: "border-yellow-500 bg-yellow-950/30"
      };
    }

    return {
      title: "🟢 Network Stable",
      message: "Metro network is operating normally.",
      color: "border-green-500 bg-green-950/30"
    };

  };

  const recommendation = selectedStation
    ? {
      title:
        selectedStation.status === "Critical"
          ? "🔴 Immediate Action Required"
          : selectedStation.status === "Overcrowded"
            ? "🟡 Monitor Closely"
            : "🟢 Operating Normally",

      message:
        selectedStation.status === "Critical"
          ? `Increase train frequency immediately at ${selectedStation.station_name}. Deploy platform staff and manage passenger flow.`
          : selectedStation.status === "Overcrowded"
            ? `${selectedStation.station_name} is becoming crowded. Consider increasing train frequency during this period.`
            : `${selectedStation.station_name} is operating within safe capacity. No operational changes are required.`,

      color:
        selectedStation.status === "Critical"
          ? "border-red-500 bg-red-950/30"
          : selectedStation.status === "Overcrowded"
            ? "border-yellow-500 bg-yellow-950/30"
            : "border-green-500 bg-green-950/30",
    }
    : aiRecommendation();

  return (

    <div className="min-h-screen bg-slate-950 text-white p-8">

      <h1 className="text-4xl font-bold">
        Crowd Monitoring
      </h1>

      <p className="text-slate-400 mt-2 mb-8">
        Live crowd status across metro stations
      </p>
      <div className="flex flex-col md:flex-row gap-4 mb-6">

        <div className="relative w-full md:w-1/3">

          <input
            type="text"
            placeholder="Search station..."
            value={search}
            onChange={(e) => {

              const value = e.target.value;
              console.log(
                "Search is using:",
                stations.slice(0, 10).map((s) => s.station_name)
              );

              setSearch(value);

              setShowSuggestions(true);

              if (value === "") {
                setSelectedStation(null);
                return;
              }

              const exact = stations.find(
                (station: any) =>
                  station.station_name.toLowerCase() ===
                  value.toLowerCase()
              );

              if (exact) {
                setSelectedStation(exact);
              }

            }}
            className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 w-full"
          />

          {showSuggestions && search.length > 0 && (
            <div className="absolute z-50 mt-2 w-full bg-slate-800 border border-slate-700 rounded-lg max-h-60 overflow-y-auto">

              {filteredStations.slice(0, 10).map((station: any) => (
                <div
                  key={station.station_id}
                  onClick={() => {
                    setSelectedStation(station);
                    setSearch(station.station_name);
                    setShowSuggestions(false);
                  }}
                  className="p-3 cursor-pointer hover:bg-slate-700 border-b border-slate-700"
                >
                  {station.station_name}
                </div>
              ))}

              {filteredStations.length === 0 && (
                <div className="p-3 text-slate-400">
                  🔍 No station found
                </div>
              )}

            </div>
          )}

        </div>

        {selectedStation && (
          <button
            onClick={() => {
              setSearch("");
              setSelectedStation(null);
              setShowSuggestions(false);
            }}
            className="bg-red-600 hover:bg-red-700 rounded-lg px-4 py-3"
          >
            ✖ Clear
          </button>
        )}


        <div className="bg-green-900/30 border border-green-700 rounded-lg px-4 py-3">
          <p className="text-green-400 font-semibold">
            🟢 LIVE
          </p>

          <p className="text-sm text-slate-300">
            Auto Refresh: Every 10 sec
          </p>

          <p className="text-xs text-slate-400">
            Last Updated: {lastUpdated}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">

          {["All", "Normal", "Overcrowded", "Critical"].map((status) => (

            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg transition
        ${statusFilter === status
                  ? "bg-cyan-500 text-black font-semibold"
                  : "bg-slate-800 hover:bg-slate-700"
                }`}
            >
              {status === "Normal" && "🟢 "}
              {status === "Overcrowded" && "🟡 "}
              {status === "Critical" && "🔴 "}
              {status}
            </button>

          ))}

        </div>

      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

        <div className="bg-slate-900 rounded-xl border border-red-700 p-6">
          <AlertTriangle className="text-red-500 mb-3" size={28} />

          <p className="text-slate-400">
            Active Alerts
          </p>

          <h2 className="text-3xl font-bold text-red-400">
            {alerts.length}
          </h2>

          <p className="text-xs text-slate-500 mt-2">
            Critical + Overcrowded Stations
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">

          <div className="bg-green-900/30 border border-green-700 rounded-xl p-5 text-center">
            <h2 className="text-3xl font-bold">
              {
                stations.filter(
                  (s: any) => s.status === "Normal"
                ).length
              }
            </h2>

            <p className="text-green-300 mt-2">
              🟢 Normal Stations
            </p>
          </div>

          <div className="bg-yellow-900/30 border border-yellow-600 rounded-xl p-5 text-center">
            <h2 className="text-3xl font-bold">
              {
                stations.filter(
                  (s: any) => s.status === "Overcrowded"
                ).length
              }
            </h2>

            <p className="text-yellow-300 mt-2">
              🟡 Crowded Stations
            </p>
          </div>

          <div className="bg-red-900/30 border border-red-700 rounded-xl p-5 text-center">
            <h2 className="text-3xl font-bold">
              {
                stations.filter(
                  (s: any) => s.status === "Critical"
                ).length
              }
            </h2>

            <p className="text-red-300 mt-2">
              🔴 Overcrowded Stations
            </p>
          </div>

        </div>

        <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
          <Building2 className="text-green-400 mb-3" size={28} />
          <p className="text-slate-400">Active Stations</p>
          <h2 className="text-3xl font-bold">
            {kpi?.active_stations}
          </h2>
        </div>

        <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
          <Activity className="text-yellow-400 mb-3" size={28} />
          <p className="text-slate-400">Congested Stations</p>
          <h2 className="text-3xl font-bold">
            {kpi?.congested_stations}
          </h2>
        </div>

      </div>



      {!selectedStation && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

          <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
            <p className="text-slate-400">
              🚉 Busiest Station
            </p>

            <h2 className="text-2xl font-bold">
              {busiestStation?.station_name}
            </h2>

            <p className="text-cyan-400 mt-2">
              👥 {busiestStation?.passengers.toLocaleString()}
            </p>
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
            <p className="text-slate-400">
              📈 Highest Capacity
            </p>

            <h2 className="text-3xl font-bold text-red-400">
              {busiestStation?.capacity.toFixed(1)}%
            </h2>

            <p className="text-slate-500 mt-2">
              {busiestStation?.station_name}
            </p>
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
            <p className="text-slate-400">
              👥 Average Passengers
            </p>

            <h2 className="text-3xl font-bold">
              {averagePassengers}
            </h2>
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
            <p className="text-slate-400">
              📊 Average Capacity
            </p>

            <h2 className="text-3xl font-bold">
              {averageCapacity}%
            </h2>
          </div>

        </div>
      )}

      <div
        className={`rounded-xl border p-6 mb-8 ${recommendation.color}`}
      >

        <h2 className="text-2xl font-bold mb-4">
          🤖 AI Operations Recommendation
        </h2>

        <h3 className="text-lg font-semibold mb-2">
          {recommendation.title}
        </h3>

        <p className="text-slate-300 leading-7">
          {recommendation.message}
        </p>

      </div>

      {/* Crowd Heatmap */}

      <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 mb-8">

        <h2 className="text-2xl font-bold text-cyan-400 mb-2">
          🗺 Crowd Heatmap
        </h2>

        <p className="text-slate-400 mb-6">
          Live congestion distribution across all metro stations
        </p>

        <div className="grid grid-cols-8 md:grid-cols-12 lg:grid-cols-16 gap-2">

          {stations.map((station: any) => (

            <div
              key={station.station_id}
              onClick={() => setSelectedStation(station)}
              className={`
                h-6
                rounded
                cursor-pointer
                transition-all
                duration-300
                hover:scale-110

                ${
                  selectedStation?.station_id === station.station_id
                  ? "ring-4 ring-cyan-400 scale-110"
                  : ""
                }

                ${
                  station.status === "Critical"
                  ? "bg-red-500"
                  : station.status === "Overcrowded"
                    ? "bg-yellow-400"
                    : "bg-green-500"
                }
              `}
              title={station.station_name}
            />

          ))}

        </div>

        <div className="flex flex-wrap gap-6 mt-6 text-sm">

          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500"></div>
            <span>Normal</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-yellow-400"></div>
            <span>Overcrowded</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-500"></div>
            <span>Critical</span>
          </div>

        </div>

      </div>


      <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 mb-8">

        <h2 className="text-2xl font-bold text-red-400 mb-5">
          🚨 Live Active Alerts
        </h2>

        {(
          selectedStation
            ? alerts.filter(
              (alert: any) =>
                alert.station_name === selectedStation.station_name
            )
            : alerts
        ).length === 0 ? (

          <p className="text-green-400">
            ✅ No active alerts
          </p>

        ) : (

          <div className="space-y-3">

            {(selectedStation
              ? alerts.filter(
                (alert: any) =>
                  alert.station_name === selectedStation.station_name
              )
              : alerts
            ).map((alert: any, index: number) => (

              <div
                key={index}
                className={`flex justify-between items-center rounded-lg p-4 ${alert.severity === "critical"
                  ? "bg-red-900/40 border border-red-600"
                  : "bg-yellow-900/30 border border-yellow-500"
                  }`}
              >

                <div>

                  <h3 className="font-bold">
                    {alert.station_name}
                  </h3>

                  <p className="text-sm text-slate-300">
                    {alert.message}
                  </p>

                </div>

                <div className="text-right">

                  <p className="text-xl font-bold">
                    {alert.capacity_percentage.toFixed(1)}%
                  </p>

                  <p className="text-xs">
                    {alert.severity.toUpperCase()}
                  </p>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

      {loading ? (

        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-cyan-500 border-t-transparent"></div>
        </div>

      ) : (

        <div className="overflow-x-auto rounded-xl border border-slate-700">

          <table className="w-full">

            <thead className="bg-slate-900">

              <tr>

                <th className="text-left p-4">#</th>

                <th
                  onClick={() => handleSort("station_name")}
                  className="text-left p-4 cursor-pointer hover:text-cyan-400"
                >
                  Station {sortBy === "station_name" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>

                <th
                  onClick={() => handleSort("passengers")}
                  className="text-left p-4 cursor-pointer hover:text-cyan-400"
                >
                  Passengers {sortBy === "passengers" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>

                <th
                  onClick={() => handleSort("capacity")}
                  className="text-left p-4 cursor-pointer hover:text-cyan-400"
                >
                  Capacity {sortBy === "capacity" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>

                <th className="text-left p-4">Crowd Level</th>

                <th
                  onClick={() => handleSort("status")}
                  className="text-left p-4 cursor-pointer hover:text-cyan-400"
                >
                  Status {sortBy === "status" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>



              </tr>

            </thead>

            <tbody>

              {Array.isArray(stations) &&
                filteredStations.map((station: any, index: number) => (
                  <tr
                    key={index}
                    onClick={() => {
                      setSelectedStation(station);

                      setTimeout(() => {
                        detailsRef.current?.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }, 100);
                    }}
                    className={`border-t border-slate-700 cursor-pointer transition ${selectedStation?.station_id === station.station_id
                      ? "bg-cyan-900/40"
                      : "hover:bg-slate-900"
                      }`}
                  >
                    <td className="p-4 text-slate-400">
                      {index + 1}
                    </td>


                    <td className="p-4 font-medium">
                      {station.station_name}
                    </td>

                    <td className="p-4">
                      {station.passengers.toLocaleString()}
                    </td>

                    <td className="p-4 w-64">

                      <div className="flex items-center gap-3">

                        <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">

                          <div
                            className={`h-3 rounded-full transition-all duration-500
          ${station.capacity >= 90
                                ? "bg-red-500"
                                : station.capacity >= 80
                                  ? "bg-yellow-400"
                                  : "bg-green-500"
                              }
        `}
                            style={{
                              width: `${Math.min(station.capacity, 100)}%`,
                            }}
                          />

                        </div>

                        <span className="text-sm font-semibold w-14 text-right">
                          {station.capacity.toFixed(1)}%
                        </span>

                      </div>

                    </td>

                    <td className="p-4">

                      <div className="flex items-center gap-2 font-semibold">

                        {station.capacity >= 90 ? (
                          <span className="text-red-500">
                            🔴 High
                          </span>
                        ) : station.capacity >= 80 ? (
                          <span className="text-yellow-400">
                            🟡 Medium
                          </span>
                        ) : (
                          <span className="text-green-500">
                            🟢 Low
                          </span>
                        )}

                      </div>

                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <span
                          className={`
                              inline-flex
                              items-center
                              justify-center
                              px-3
                              py-1
                              rounded-full
                              text-sm
                              font-semibold
                              min-w-[110px]
                    
                          ${station.status === "Critical"
                              ? "bg-red-600 text-white"
                              : station.status === "Overcrowded"
                                ? "bg-yellow-400 text-black"
                                : "bg-green-600 text-white"
                            }
                     `}
                        >
                          {station.status}
                        </span>
                      </div>
                    </td>

                  </tr>

                ))}

            </tbody>

          </table>

        </div>

      )}



      {selectedStation && (

        <div
          ref={detailsRef}
          className="grid lg:grid-cols-2 gap-6 mt-8"
        >

          {/* Top Stations Card */}
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">

            <h2 className="text-2xl font-bold text-cyan-400">
              🚉 Top 5 Busy Stations
            </h2>

            <p className="text-slate-400 mb-6">
              Ranked by current passenger count
            </p>
            {topStations.map((station, index) => (

              <div
                key={station.station_id}
                className="mb-5"
              >

                <div className="flex justify-between items-center mb-2">

                  <div>

                    <p className="font-semibold">
                      {index === 0 && "🥇 "}
                      {index === 1 && "🥈 "}
                      {index === 2 && "🥉 "}
                      {station.station_name}
                    </p>

                    <p className="text-slate-400 text-sm">
                      Capacity {station.capacity.toFixed(1)}%
                    </p>

                  </div>

                  <div className="text-cyan-400 font-bold">
                    {station.passengers.toLocaleString()}
                  </div>

                </div>

                <div className="w-full bg-slate-800 rounded-full h-3">

                  <div
                    className={`h-3 rounded-full ${station.capacity >= 90
                      ? "bg-red-500"
                      : station.capacity >= 80
                        ? "bg-yellow-400"
                        : "bg-green-500"
                      }`}
                    style={{
                      width: `${Math.min(station.capacity, 100)}%`,
                    }}
                  />

                </div>

              </div>

            ))}

          </div>

          {/* Station Details */}

          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">

            <h2 className="text-2xl font-bold text-cyan-400 mb-6">
              📍 Station Information
            </h2>

            <div className="grid md:grid-cols-2 gap-6">

              <div>
                <p className="text-slate-400 text-sm">Station Name</p>
                <h3 className="text-xl font-bold">
                  {selectedStation.station_name}
                </h3>
              </div>

              <div>
                <p className="text-slate-400 text-sm">Station ID</p>
                <h3>#{selectedStation.station_id}</h3>
              </div>

              <div>
                <p className="text-slate-400 text-sm">Passengers</p>
                <h3>{selectedStation.passengers.toLocaleString()}</h3>
              </div>

              <div>
                <p className="text-slate-400 text-sm">Capacity</p>
                <h3>{selectedStation.capacity.toFixed(1)}%</h3>
              </div>

              <div>
                <p className="text-slate-400 text-sm">Status</p>

                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full font-semibold
                    ${selectedStation.status === "Critical"
                      ? "bg-red-600 text-white"
                      : selectedStation.status === "Overcrowded"
                        ? "bg-yellow-400 text-black"
                        : "bg-green-600 text-white"
                    }`}
                >
                  {selectedStation.status}
                </span>

              </div>

              <div>
                <p className="text-slate-400 text-sm">Updated</p>
                <h3>{lastUpdated}</h3>
              </div>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}