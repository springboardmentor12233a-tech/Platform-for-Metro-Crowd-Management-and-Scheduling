import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Users,
  Activity,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

function StationStatusGrid({ busiestStations = [] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const processedStations = useMemo(() => {
    return busiestStations.map((station, index) => {
      const passengers =
        station.passengers ?? station.total_passengers ?? 0;

      const occupancy = Math.min(
        Math.round((passengers / 10000) * 100),
        100
      );

      let status = "Normal";

      if (occupancy >= 80) {
        status = "Critical";
      } else if (occupancy >= 60) {
        status = "Busy";
      }

      return {
        id: index,
        ...station,
        passengers,
        occupancy,
        status,
      };
    });
  }, [busiestStations]);

  const filteredStations = useMemo(() => {
    return processedStations.filter((station) => {
      const stationName =
        station.station_name || station.station || station.name || "";

      const matchesSearch = stationName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ? true : station.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [processedStations, searchTerm, statusFilter]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Critical":
        return "bg-red-100 text-red-700";
      case "Busy":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-emerald-100 text-emerald-700";
    }
  };

  const getProgressColor = (occupancy) => {
    if (occupancy >= 80) return "bg-red-500";
    if (occupancy >= 60) return "bg-yellow-500";
    return "bg-emerald-500";
  };

  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">
            Live Station Monitoring
          </h2>
          <p className="mt-2 text-slate-500">
            Real-time crowd density and operational monitoring across the
            metro network.
          </p>
        </div>

        <div className="flex flex-col gap-4 md:flex-row">
          {/* Search */}
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search station..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="
                w-72
                rounded-xl
                border
                border-slate-200
                py-3
                pl-11
                pr-4
                outline-none
                transition
                focus:border-cyan-500
              "
            />
          </div>

          {/* Filter */}
          <div className="relative">
            <Filter
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="
                rounded-xl
                border
                border-slate-200
                py-3
                pl-11
                pr-10
                outline-none
                transition
                focus:border-cyan-500
              "
            >
              <option>All</option>
              <option>Normal</option>
              <option>Busy</option>
              <option>Critical</option>
            </select>
          </div>
        </div>
      </div>

      {/* ==========================
          Station Grid
      ========================== */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredStations.map((station, index) => (
          <motion.div
            key={station.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: index * 0.05 }}
            whileHover={{ y: -6, scale: 1.02 }}
            className="
              rounded-3xl
              border
              border-slate-200
              bg-white
              p-6
              shadow-sm
              transition-all
            "
          >
            {/* Station Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {station.station_name ||
                    station.station ||
                    station.name ||
                    "Unknown Station"}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Station ID #{station.id + 1}
                </p>
              </div>

              <span
                className={`
                  rounded-full
                  px-3
                  py-1
                  text-xs
                  font-semibold
                  ${getStatusColor(station.status)}
                `}
              >
                {station.status}
              </span>
            </div>

            {/* Passenger Statistics */}
            <div className="mt-8 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-cyan-100 p-3">
                  <Users size={24} className="text-cyan-600" />
                </div>

                <div>
                  <p className="text-sm text-slate-500">Passengers</p>
                  <h3 className="text-2xl font-bold text-slate-900">
                    {station.passengers.toLocaleString()}
                  </h3>
                </div>
              </div>

              <Activity size={28} className="text-slate-300" />
            </div>

            {/* Occupancy */}
            <div className="mt-8">
              <div className="mb-3 flex items-center justify-between">
                <span className="font-medium text-slate-600">Occupancy</span>
                <span className="font-bold text-slate-900">
                  {station.occupancy}%
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${station.occupancy}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className={`
                    h-full
                    rounded-full
                    ${getProgressColor(station.occupancy)}
                  `}
                />
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Crowd Level</p>
                <h4 className="mt-2 text-lg font-bold">{station.status}</h4>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Risk Score</p>
                <h4 className="mt-2 text-lg font-bold">
                  {Math.round(station.occupancy * 0.9)}%
                </h4>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredStations.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="
            rounded-3xl
            border-2
            border-dashed
            border-slate-300
            bg-slate-50
            px-8
            py-16
            text-center
          "
        >
          <Search size={48} className="mx-auto text-slate-400" />
          <h3 className="mt-6 text-2xl font-bold text-slate-700">
            No Stations Found
          </h3>
          <p className="mt-3 text-slate-500">
            No stations match your current search or selected filter. Try
            another search term or choose a different status.
          </p>
        </motion.div>
      )}

      {/* Monitoring Summary */}
      <div
        className="
          rounded-3xl
          border
          border-slate-200
          bg-gradient-to-r
          from-slate-900
          via-slate-800
          to-slate-900
          p-8
          text-white
        "
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-2xl font-bold">Monitoring Summary</h3>
            <p className="mt-2 text-slate-300">
              Real-time overview of monitored metro stations.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <div>
              <p className="text-sm text-slate-400">Displayed</p>
              <h4 className="mt-2 text-3xl font-bold">
                {filteredStations.length}
              </h4>
            </div>

            <div>
              <p className="text-sm text-slate-400">Total</p>
              <h4 className="mt-2 text-3xl font-bold">
                {processedStations.length}
              </h4>
            </div>

            <div>
              <p className="text-sm text-slate-400">Filter</p>
              <h4 className="mt-2 text-xl font-semibold">{statusFilter}</h4>
            </div>

            <div>
              <p className="text-sm text-slate-400">Live Status</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-green-400 animate-pulse" />
                <span className="font-semibold text-green-300">
                  Connected
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StationStatusGrid;