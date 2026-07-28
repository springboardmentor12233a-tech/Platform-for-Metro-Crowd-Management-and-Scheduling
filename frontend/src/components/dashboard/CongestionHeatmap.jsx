import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  ArrowUpDown,
  Users,
  Activity,
  AlertTriangle,
  BrainCircuit,
  Clock,
  TrainFront,
} from "lucide-react";

// =====================================================
// Risk Styles
// =====================================================

const riskStyles = {
  Critical: {
    bg: "bg-red-50",
    border: "border-red-300",
    text: "text-red-700",
    dot: "bg-red-500",
    badge: "bg-red-100 text-red-700",
  },
  High: {
    bg: "bg-orange-50",
    border: "border-orange-300",
    text: "text-orange-700",
    dot: "bg-orange-500",
    badge: "bg-orange-100 text-orange-700",
  },
  Moderate: {
    bg: "bg-yellow-50",
    border: "border-yellow-300",
    text: "text-yellow-700",
    dot: "bg-yellow-400",
    badge: "bg-yellow-100 text-yellow-700",
  },
  Low: {
    bg: "bg-green-50",
    border: "border-green-300",
    text: "text-green-700",
    dot: "bg-green-500",
    badge: "bg-green-100 text-green-700",
  },
};

const CongestionHeatmap = ({ busiestStations = [], onGenerateAI }) => {
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Occupancy");

  // =====================================================
  // Derive, Filter & Sort Stations
  // =====================================================

  const stations = useMemo(() => {
    let data = [...busiestStations];

    if (search) {
      data = data.filter((station) =>
        (station.station ?? "")
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    data = data.map((station) => {
      const occupancy = Math.min(
        Math.round((station.passengers / 320000) * 100),
        100
      );

      let status = "Low";

      if (occupancy >= 85) {
        status = "Critical";
      } else if (occupancy >= 65) {
        status = "High";
      } else if (occupancy >= 40) {
        status = "Moderate";
      }

      const trend =
        occupancy >= 85
          ? "Rising"
          : occupancy >= 50
          ? "Stable"
          : "Falling";

      return {
        ...station,
        occupancy,
        status,
        trend,
      };
    });

    if (riskFilter !== "All") {
      data = data.filter((station) => station.status === riskFilter);
    }

    switch (sortBy) {
      case "Passengers":
        data.sort((a, b) => b.passengers - a.passengers);
        break;

      case "Station":
        data.sort((a, b) => a.station.localeCompare(b.station));
        break;

      default:
        data.sort((a, b) => b.occupancy - a.occupancy);
    }

    return data;
  }, [busiestStations, search, riskFilter, sortBy]);

  // =====================================================
  // Network Summary
  // =====================================================

  const criticalCount = stations.filter((s) => s.status === "Critical").length;
  const highCount = stations.filter((s) => s.status === "High").length;

  const formatLastUpdated = (date) => {
    if (!date) return "Just Now";

    return `Updated ${new Date(date).toLocaleTimeString()}`;
  };

  return (
    <section className="rounded-3xl">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Congestion Heatmap
          </h2>

          <p className="mt-1 text-slate-500">
            Real-time network-wide congestion monitoring
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600">
            <TrainFront size={16} />
            {stations.length} Stations
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-red-100 px-4 py-2 text-sm font-medium text-red-700">
            <AlertTriangle size={16} />
            {criticalCount} Critical
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-orange-100 px-4 py-2 text-sm font-medium text-orange-700">
            <Activity size={16} />
            {highCount} High
          </div>
        </div>
      </div>

      <div className="my-8 h-px bg-slate-200" />

      {/* =====================================================
          Metro Heatmap Grid
      ===================================================== */}

      <div className="mb-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Network Heatmap
            </h3>

            <p className="text-slate-500">
              Color-coded station congestion overview
            </p>
          </div>

          <div className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600">
            {stations.length} Stations
          </div>
        </div>

        {stations.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center">
            <Filter size={40} className="mx-auto text-slate-400" />

            <p className="mt-4 text-slate-500">
              No stations match your filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
            {stations.map((station, index) => {
              const style = riskStyles[station.status];

              return (
                <motion.div
                  key={station.station_id ?? `heatmap-${index}`}
                  whileHover={{
                    scale: 1.04,
                    y: -4,
                  }}
                  className={`
                    relative
                    overflow-hidden
                    rounded-2xl
                    border
                    p-5
                    shadow-sm
                    transition-all
                    duration-300
                    hover:shadow-xl
                    ${style.border}
                    ${style.bg}
                  `}
                >
                  {station.status === "Critical" && (
                    <div className="absolute right-2 top-2 h-3 w-3 rounded-full bg-red-500 animate-pulse" />
                  )}

                  <h3 className="font-bold text-slate-900">
                    {station.station}
                  </h3>

                  <p className="mt-3 text-4xl font-bold">
                    {station.occupancy}%
                  </p>

                  <span
                    className={`mt-4 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${style.badge}`}
                  >
                    {station.status}
                  </span>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* =====================================================
          Search, Filter & Sort Toolbar
      ===================================================== */}

      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:w-96">
          <Search
            className="absolute left-4 top-3.5 text-slate-400"
            size={18}
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search station..."
            className="
              w-full
              rounded-2xl
              border
              border-slate-200
              py-3
              pl-11
              pr-4
              outline-none
              focus:border-indigo-500
            "
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-3"
          >
            <option>All</option>
            <option>Critical</option>
            <option>High</option>
            <option>Moderate</option>
            <option>Low</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-3"
          >
            <option>Occupancy</option>
            <option>Passengers</option>
            <option>Station</option>
          </select>
        </div>
      </div>

      <div className="my-8 h-px bg-slate-200" />

      {/* =====================================================
          Live Congestion List (single copy)
      ===================================================== */}

      <div>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Live Congestion List
            </h3>

            <p className="text-slate-500">
              Detailed per-station breakdown with AI decision support
            </p>
          </div>

          <span className="rounded-full bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-700">
            LIVE
          </span>
        </div>

        {stations.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center">
            <Users size={40} className="mx-auto text-slate-400" />

            <p className="mt-4 text-slate-500">
              No stations to display.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {stations.map((station, index) => {
              const style = riskStyles[station.status];

              return (
                <motion.div
                  key={station.station_id ?? `list-${index}`}
                  whileHover={{ scale: 1.01 }}
                  className="rounded-2xl border border-slate-200 p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-lg">{station.station}</h3>

                      <p className="mt-1 text-slate-500">
                        {station.passengers.toLocaleString()} passengers
                      </p>

                      <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                        <Clock size={14} />
                        {formatLastUpdated(station.last_updated)}
                      </div>
                    </div>

                    <span
                      className={`rounded-full px-4 py-2 text-sm font-semibold ${style.badge}`}
                    >
                      {station.status}
                    </span>
                  </div>

                  {/* Occupancy Bar */}

                  <div className="mt-5">
                    <div className="mb-2 flex justify-between text-sm">
                      <span>Occupancy</span>

                      <span>{station.occupancy}%</span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${station.occupancy}%` }}
                        transition={{ duration: 1 }}
                        className={`h-full rounded-full ${style.dot}`}
                      />
                    </div>
                  </div>

                  {/* Trend Indicator */}

                  <div className="mt-4 flex items-center gap-4 text-sm">
                    <span
                      className={`
                        rounded-full
                        px-3
                        py-1
                        ${
                          station.trend === "Rising"
                            ? "bg-red-100 text-red-700"
                            : station.trend === "Stable"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }
                      `}
                    >
                      {station.trend === "Rising"
                        ? "▲ Rising"
                        : station.trend === "Stable"
                        ? "→ Stable"
                        : "▼ Falling"}
                    </span>
                  </div>

                  {/* AI Decision Support */}

                  <div className="mt-5 flex items-center justify-between">
                    <div className="text-xs text-slate-500">
                      AI Decision Support
                    </div>

                    <button
                      type="button"
                      onClick={() => onGenerateAI?.(station)}
                      className="
                        flex
                        items-center
                        gap-2
                        rounded-xl
                        bg-gradient-to-r
                        from-indigo-600
                        to-violet-600
                        px-4
                        py-2
                        text-sm
                        font-semibold
                        text-white
                        transition-all
                        duration-300
                        hover:scale-105
                        hover:shadow-lg
                      "
                    >
                      <BrainCircuit size={16} />
                      Generate AI Recommendation
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default CongestionHeatmap;