import {
  Train,
  MapPin,
  Gauge,
  Users,
  Wrench,
  CalendarDays,
  Activity,
} from "lucide-react";

export default function TrainCard({ train }) {
  // =========================================================
  // Status colors
  // =========================================================

  const statusColor = {
    ACTIVE: "bg-green-600",
    MAINTENANCE: "bg-yellow-500 text-black",
    OUT_OF_SERVICE: "bg-red-600",
  };

  // =========================================================
  // Line colors
  // =========================================================

  const lineColor = {
    "Red Line": "bg-red-500/20 text-red-400",
    "Blue Line": "bg-blue-500/20 text-blue-400",
    "Yellow Line": "bg-yellow-500/20 text-yellow-300",
    "Green Line": "bg-green-500/20 text-green-400",
    "Pink Line": "bg-pink-500/20 text-pink-400",
    "Magenta Line": "bg-fuchsia-500/20 text-fuchsia-400",
    "Violet Line": "bg-violet-500/20 text-violet-400",
    "Orange Line": "bg-orange-500/20 text-orange-400",
  };

  // =========================================================
  // Normalize status
  // =========================================================

  const status = String(
    train.status || ""
  ).toUpperCase();

  // =========================================================
  // Occupancy
  // =========================================================

  const occupancy =
    train.occupancy_percentage !== null &&
    train.occupancy_percentage !== undefined
      ? Number(train.occupancy_percentage)
      : null;

  // =========================================================
  // Health (Frontend Only Demo)
  // =========================================================

  const healthScore = 95;

  // =========================================================
  // Occupancy bar color
  // =========================================================

  const getOccupancyColor = () => {
    if (occupancy === null) {
      return "bg-slate-600";
    }

    if (occupancy >= 90) {
      return "bg-red-500";
    }

    if (occupancy >= 75) {
      return "bg-orange-500";
    }

    if (occupancy >= 50) {
      return "bg-yellow-500";
    }

    return "bg-green-500";
  };

  // =========================================================
  // Health bar color
  // =========================================================

  const getHealthColor = (score) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 70) return "bg-yellow-500";
    return "bg-red-500";
  };

  // =========================================================
  // Recommendation
  // =========================================================

  const recommendation =
    train.recommendation ||
    "No recommendation available.";

  return (
    <div
      className="
        bg-slate-800
        rounded-2xl
        border
        border-slate-700
        p-6
        shadow-lg
        transition-all
        duration-300
        hover:-translate-y-2
        hover:shadow-cyan-500/20
        hover:border-cyan-500
      "
    >

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex justify-between items-start">

        <div>

          <div className="flex items-center gap-3">

            <Train
              size={22}
              className="text-cyan-400"
            />

            <h2 className="text-3xl font-bold text-white">
              {train.train_number}
            </h2>

          </div>

          <p className="text-slate-400 mt-1">
            {train.train_name}
          </p>

        </div>

        <span
          className={`
            px-4
            py-2
            rounded-full
            text-white
            font-semibold
            ${statusColor[status] || "bg-slate-600"}
          `}
        >
          {status || "UNKNOWN"}
        </span>

      </div>


      {/* =====================================================
          METRO LINE
      ===================================================== */}

      <div className="mt-5">

        <span
          className={`
            px-3
            py-1
            rounded-full
            text-sm
            font-semibold
            ${
              lineColor[train.line]
              || "bg-slate-700 text-white"
            }
          `}
        >
          {train.line}
        </span>

      </div>


      {/* =====================================================
          TRAIN DETAILS
      ===================================================== */}

      <div className="mt-6 space-y-4">

        {/* Current Station */}

        <div className="flex items-center gap-3">

          <MapPin
            size={18}
            className="text-cyan-400"
          />

          <span className="text-slate-300">

            <b>Current Station:</b>{" "}

            {train.current_station
              ? train.current_station
              : "Not Assigned"}

          </span>

        </div>


        {/* Capacity */}

        <div className="flex items-center gap-3">

          <Users
            size={18}
            className="text-green-400"
          />

          <span className="text-slate-300">

            <b>Capacity:</b>{" "}

            {train.capacity ?? "No data"}

          </span>

        </div>


        {/* Speed */}

        <div className="flex items-center gap-3">

          <Gauge
            size={18}
            className="text-yellow-400"
          />

          <span className="text-slate-300">

            <b>Speed Limit:</b>{" "}

            {train.speed_limit_kmh !== null &&
            train.speed_limit_kmh !== undefined
              ? `${train.speed_limit_kmh} km/h`
              : "No data"}

          </span>

        </div>


        {/* Manufacturer */}

        <div className="flex items-center gap-3">

          <Train
            size={18}
            className="text-blue-400"
          />

          <span className="text-slate-300">

            <b>Manufacturer:</b>{" "}

            {train.manufacturer || "Unknown"}

          </span>

        </div>


        {/* Model */}

        <div className="flex items-center gap-3">

          <Wrench
            size={18}
            className="text-orange-400"
          />

          <span className="text-slate-300">

            <b>Model:</b>{" "}

            {train.model || "Unknown"}

          </span>

        </div>


        {/* Year */}

        <div className="flex items-center gap-3">

          <CalendarDays
            size={18}
            className="text-purple-400"
          />

          <span className="text-slate-300">

            <b>Year:</b>{" "}

            {train.year_of_manufacture ?? "No data"}

          </span>

        </div>

      </div>


      {/* =====================================================
          DIVIDER
      ===================================================== */}

      <hr className="border-slate-700 my-5" />


      {/* =====================================================
          HEALTH
      ===================================================== */}

      <div className="space-y-5">

        <div>

          <div className="flex justify-between items-center">

            <div className="flex items-center gap-2">

              <Activity
                size={18}
                className="text-cyan-400"
              />

              <span className="text-slate-400">
                Health
              </span>

            </div>

            <span className="text-white font-semibold">
              {healthScore}%
            </span>

          </div>

          <div
            className="
              w-full
              bg-slate-700
              rounded-full
              h-2
              mt-2
            "
          >

            <div
              className={`
                ${getHealthColor(healthScore)}
                h-2
                rounded-full
                transition-all
              `}
              style={{
                width: `${healthScore}%`,
              }}
            />

          </div>

        </div>


        {/* =================================================
            OCCUPANCY
        ================================================= */}

        <div>

          <div className="flex justify-between items-center">

            <div className="flex items-center gap-2">

              <Users
                size={18}
                className="text-cyan-400"
              />

              <span className="text-slate-400">
                Occupancy
              </span>

            </div>

            <span className="text-white font-semibold">

              {occupancy !== null
                ? `${occupancy.toFixed(2)}%`
                : "No data"}

            </span>

          </div>

          <div
            className="
              w-full
              bg-slate-700
              rounded-full
              h-2
              mt-2
            "
          >

            <div
              className={`
                ${getOccupancyColor()}
                h-2
                rounded-full
                transition-all
              `}
              style={{
                width:
                  occupancy !== null
                    ? `${Math.min(
                        100,
                        Math.max(0, occupancy)
                      )}%`
                    : "0%",
              }}
            />

          </div>

        </div>


        {/* =================================================
            RECOMMENDATION
        ================================================= */}

        <div>

          <p className="text-slate-400 text-sm">
            Recommendation
          </p>

          <p className="text-cyan-400 font-semibold mt-1">
            {recommendation}
          </p>

        </div>


        {/* =================================================
            LAST UPDATED
        ================================================= */}

        <div>

          <p className="text-slate-500 text-xs">
            Last updated
          </p>

          <p className="text-slate-400 text-sm mt-1">
            {train.last_updated || "No data"}
          </p>

        </div>

      </div>

    </div>
  );
}