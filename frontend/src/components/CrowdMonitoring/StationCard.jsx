import {
  Train,
  Users,
  Gauge,
  BrainCircuit,
  TrendingUp,
  ShieldAlert,
  Sparkles,
  AlertTriangle,
  Clock3,
} from "lucide-react";

import TrendSparkline from "./TrendSparkline";
import PredictionCard from "./PredictionCard";
import RiskGauge from "./RiskGauge";
import ConfidenceBar from "./ConfidenceBar";
import RecommendationList from "./RecommendationList";

// ==========================================
// Helpers
// ==========================================

const badgeColor = (level) => {
  switch (level) {
    case "High":
      return "bg-red-500";

    case "Medium":
      return "bg-yellow-500";

    default:
      return "bg-green-500";
  }
};

const progressColor = (level) => {
  switch (level) {
    case "High":
      return "bg-gradient-to-r from-red-500 to-red-600";

    case "Medium":
      return "bg-gradient-to-r from-yellow-400 to-orange-400";

    default:
      return "bg-gradient-to-r from-green-500 to-emerald-500";
  }
};

// ==========================================
// Component
// ==========================================

function StationCard({
  station,
  selected = false,
}) {
  return (
    <div
      className={`relative rounded-3xl bg-white p-6 border shadow-xl
      transition-all duration-500
      hover:-translate-y-2
      hover:scale-[1.02]
      hover:shadow-2xl
      ${
        selected
          ? "border-indigo-500 ring-4 ring-indigo-200 shadow-indigo-300"
          : station.crowd_level === "High"
          ? "border-red-500 shadow-red-200"
          : "border-slate-200"
      }`}
    >

      {/* ================= SELECTED BADGE ================= */}

      {selected && (

        <div className="absolute -top-3 left-6 rounded-full bg-indigo-600 px-4 py-1 text-xs font-bold text-white shadow-lg animate-pulse">

          Selected Station

        </div>

      )}

      {/* ================= HEADER ================= */}

      <div className="flex justify-between items-start">

        <div className="flex gap-4">

          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 ${
              selected
                ? "bg-gradient-to-br from-violet-600 to-indigo-700 scale-110"
                : "bg-gradient-to-br from-indigo-500 to-blue-600"
            }`}
          >

            <Train
              className="text-white"
              size={24}
            />

          </div>

          <div>

            <h2
              className={`text-2xl font-bold transition-colors ${
                selected
                  ? "text-indigo-700"
                  : "text-slate-900"
              }`}
            >
              {station.station}
            </h2>

            <div className="flex items-center gap-2 mt-1">

              <p className="text-slate-500">
                Delhi Metro Station
              </p>

              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${
                  station.status === "Busy"
                    ? "bg-red-100 text-red-700"
                    : station.status === "Moderate"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {station.status}
              </span>

            </div>

          </div>

        </div>

        <span
          className={`px-4 py-2 rounded-full text-white font-semibold shadow-md ${badgeColor(
            station.crowd_level
          )}`}
        >
          {station.crowd_level}
        </span>

      </div>

      {/* ================= OCCUPANCY ================= */}

      <div className="mt-7">

        <div className="flex justify-between mb-3">

          <div className="flex items-center gap-2">

            <Gauge
              size={18}
              className="text-slate-600"
            />

            <span className="font-medium">
              Current Occupancy
            </span>

          </div>

          <span className="text-xl font-bold">
            {station.occupancy}%
          </span>

        </div>

        <div className="h-4 rounded-full bg-slate-200 overflow-hidden">

          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out ${progressColor(
              station.crowd_level
            )}`}
            style={{
              width: `${Math.min(station.occupancy, 100)}%`,
            }}
          />

        </div>

      </div>

      {/* ================= PASSENGER STATS ================= */}

      <div className="grid grid-cols-2 gap-5 mt-6">

        <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 p-5 shadow-sm">

          <div className="flex items-center gap-2 mb-2">

            <Users
              size={18}
              className="text-indigo-600"
            />

            <span className="text-sm text-slate-500">
              Passengers
            </span>

          </div>

          <h3 className="text-3xl font-bold">
            {station.passengers.toLocaleString()}
          </h3>

        </div>

        <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 p-5 shadow-sm">

          <div className="flex items-center gap-2 mb-2">

            <Gauge
              size={18}
              className="text-indigo-600"
            />

            <span className="text-sm text-slate-500">
              Capacity
            </span>

          </div>

          <h3 className="text-3xl font-bold">
            {station.capacity} PAX
          </h3>

        </div>

      </div>

      {/* ================= AI ANALYTICS ================= */}
            <div className="grid grid-cols-2 gap-5 mt-6">

        {/* Passenger Trend */}

        <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">

          <div className="mb-3 flex items-center gap-2">

            <TrendingUp
              size={18}
              className="text-cyan-600"
            />

            <span className="font-semibold text-cyan-700">
              Passenger Trend
            </span>

          </div>

          <TrendSparkline
            trend={station.trend || []}
          />

        </div>

        {/* AI Prediction */}

        <div className="rounded-2xl border border-purple-200 bg-purple-50 p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">

          <div className="mb-3 flex items-center gap-2">

            <Sparkles
              size={18}
              className="text-purple-600"
            />

            <span className="font-semibold text-purple-700">
              AI Prediction
            </span>

          </div>

          <PredictionCard
            prediction={
              station.prediction || {
                next_15_min: 0,
                change: 0,
              }
            }
          />

        </div>

        {/* Risk Score */}

        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">

          <div className="mb-3 flex items-center gap-2">

            <ShieldAlert
              size={18}
              className="text-orange-600"
            />

            <span className="font-semibold text-orange-700">
              Risk Score
            </span>

          </div>

          <RiskGauge
            score={station.risk_score || 0}
          />

        </div>

        {/* AI Confidence */}

        <div className="rounded-2xl border border-green-200 bg-green-50 p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">

          <div className="mb-3 flex items-center gap-2">

            <BrainCircuit
              size={18}
              className="text-green-600"
            />

            <span className="font-semibold text-green-700">
              AI Confidence
            </span>

          </div>

          <ConfidenceBar
            confidence={station.confidence || 0}
          />

        </div>

      </div>

      {/* ================= AI RECOMMENDATIONS ================= */}

      <div className="mt-6 rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 p-5 shadow-sm">

        <div className="mb-4 flex items-center justify-between">

          <div className="flex items-center gap-2">

            <BrainCircuit
              size={22}
              className="text-indigo-600"
            />

            <h3 className="font-bold text-indigo-700">
              AI Recommendations
            </h3>

          </div>

          <span className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">
            LIVE
          </span>

        </div>

        <RecommendationList
          items={station.recommendation || []}
        />

      </div>

      {/* ================= HIGH RISK ALERT ================= */}

      {station.crowd_level === "High" && (

        <div className="mt-6 rounded-2xl border border-red-300 bg-gradient-to-r from-red-50 to-red-100 p-5 shadow-sm">

          <div className="flex items-start gap-3">

            <AlertTriangle
              size={24}
              className="mt-1 text-red-600"
            />

            <div>

              <h4 className="font-bold text-red-700">
                High Congestion Alert
              </h4>

              <p className="mt-2 text-sm text-red-600">
                Passenger occupancy has exceeded the operational
                threshold. AI recommends deploying additional
                trains and crowd-management staff immediately.
              </p>

            </div>

          </div>

        </div>

      )}

      {/* ================= FOOTER ================= */}

      <div className="mt-8 border-t border-slate-200 pt-5">

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-2 text-slate-500">

            <Clock3 size={16} />

            <span className="text-sm">
              Updated just now
            </span>

          </div>

          <div className="flex items-center gap-2">

            <span className="relative flex h-3 w-3">

              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>

              <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>

            </span>

            <span className="font-semibold text-green-600">
              LIVE DATA
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}

export default StationCard;