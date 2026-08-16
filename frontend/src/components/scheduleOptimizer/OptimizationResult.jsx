import {
  Train,
  Users,
  MapPin,
  Clock3,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Timer,
  Gauge,
} from "lucide-react";

export default function OptimizationResult({ result }) {
  if (!result) return null;

  const getCrowdStyle = (level) => {
    switch (String(level || "").toUpperCase()) {
      case "LOW":
        return {
          border: "border-green-500",
          text: "text-green-400",
          bg: "bg-green-500/10",
        };

      case "MEDIUM":
        return {
          border: "border-yellow-500",
          text: "text-yellow-400",
          bg: "bg-yellow-500/10",
        };

      case "HIGH":
        return {
          border: "border-orange-500",
          text: "text-orange-400",
          bg: "bg-orange-500/10",
        };

      case "VERY HIGH":
      case "VERY_HIGH":
        return {
          border: "border-red-500",
          text: "text-red-400",
          bg: "bg-red-500/10",
        };

      default:
        return {
          border: "border-slate-600",
          text: "text-slate-300",
          bg: "bg-slate-900",
        };
    }
  };

  const crowdStyle = getCrowdStyle(result.crowd_level);

  return (
    <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-xl">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex items-center justify-between mb-8">

        <div>
          <h2 className="text-2xl font-bold text-white">
            🚆 AI Optimization Result
          </h2>

          <p className="text-slate-400 mt-1">
            Recommended train scheduling and platform allocation
          </p>
        </div>

        <div
          className={`px-4 py-2 rounded-full border ${crowdStyle.border} ${crowdStyle.bg}`}
        >
          <span className={`${crowdStyle.text} font-semibold`}>
            {result.crowd_level || "Unknown"}
          </span>
        </div>

      </div>


      {/* =====================================================
          TOP METRICS
      ===================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

        <Card
          title="Predicted Passengers"
          value={result.predicted_passengers ?? "-"}
          color="cyan"
          icon={<Users size={22} />}
        />

        <Card
          title="Crowd Level"
          value={result.crowd_level ?? "-"}
          color={
            String(result.crowd_level || "").toUpperCase() === "LOW"
              ? "green"
              : String(result.crowd_level || "").toUpperCase() === "MEDIUM"
              ? "yellow"
              : "red"
          }
          icon={<AlertTriangle size={22} />}
        />

        <Card
          title="Current Frequency"
          value={
            result.current_frequency !== null &&
            result.current_frequency !== undefined
              ? `${result.current_frequency} min`
              : "-"
          }
          color="blue"
          icon={<Clock3 size={22} />}
        />

        <Card
          title="Recommended Frequency"
          value={
            result.recommended_frequency !== null &&
            result.recommended_frequency !== undefined
              ? `${result.recommended_frequency} min`
              : "-"
          }
          color="green"
          icon={<Gauge size={22} />}
        />

      </div>


      {/* =====================================================
          TRAIN & PLATFORM INFORMATION
      ===================================================== */}

      <div className="mb-8">

        <h3 className="text-xl font-bold text-white mb-4">
          Train & Platform Allocation
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

          <InfoCard
            title="Station"
            value={result.station_name}
            icon={<MapPin size={20} />}
          />

          <InfoCard
            title="Current Train"
            value={result.train_id}
            icon={<Train size={20} />}
          />

          <InfoCard
            title="Train to Allocate"
            value={result.train_to_allocate}
            icon={<Train size={20} />}
          />

          <InfoCard
            title="Current Platform"
            value={result.current_platform}
            icon={<MapPin size={20} />}
          />

          <InfoCard
            title="Recommended Platform"
            value={result.recommended_platform}
            icon={<ArrowRight size={20} />}
          />

          <InfoCard
            title="Schedule Action"
            value={result.schedule_action}
            icon={<Clock3 size={20} />}
          />

        </div>

      </div>


      {/* =====================================================
          TIME & DELAY INFORMATION
      ===================================================== */}

      <div className="mb-8">

        <h3 className="text-xl font-bold text-white mb-4">
          Schedule & Delay
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

          <InfoCard
            title="Current Departure"
            value={result.current_departure_time}
            icon={<Clock3 size={20} />}
          />

          <InfoCard
            title="Recommended Departure"
            value={result.recommended_departure_time}
            icon={<ArrowRight size={20} />}
          />

          <InfoCard
            title="Delay"
            value={
              result.delay_minutes !== null &&
              result.delay_minutes !== undefined
                ? `${result.delay_minutes} min`
                : "-"
            }
            icon={<Timer size={20} />}
          />

          <InfoCard
            title="Reschedule Required"
            value={
              result.reschedule_required
                ? "YES"
                : "NO"
            }
            valueClass={
              result.reschedule_required
                ? "text-red-400"
                : "text-green-400"
            }
            icon={
              result.reschedule_required
                ? <AlertTriangle size={20} />
                : <CheckCircle2 size={20} />
            }
          />

        </div>

      </div>


      {/* =====================================================
          RECOMMENDATION
      ===================================================== */}

      <div className="rounded-xl bg-cyan-900/30 border border-cyan-600 p-6">

        <div className="flex items-center gap-3">

          <CheckCircle2
            className="text-cyan-400"
            size={24}
          />

          <h3 className="text-xl font-bold text-white">
            AI Recommendation
          </h3>

        </div>

        <p className="mt-4 text-cyan-300 font-semibold text-lg">
          {result.recommendation || "No recommendation available."}
        </p>

        <p className="mt-3 text-slate-300 leading-relaxed">
          {result.reason || "No additional reason provided."}
        </p>

      </div>

    </div>
  );
}


/* =========================================================
   METRIC CARD
========================================================= */

function Card({
  title,
  value,
  color = "cyan",
  icon,
}) {

  const colors = {

    cyan: {
      border: "border-cyan-500",
      icon: "text-cyan-400",
    },

    green: {
      border: "border-green-500",
      icon: "text-green-400",
    },

    yellow: {
      border: "border-yellow-500",
      icon: "text-yellow-400",
    },

    red: {
      border: "border-red-500",
      icon: "text-red-400",
    },

    blue: {
      border: "border-blue-500",
      icon: "text-blue-400",
    },

  };

  const style = colors[color] || colors.cyan;

  return (

    <div
      className={`
        bg-slate-900
        rounded-xl
        p-5
        border-l-4
        ${style.border}
      `}
    >

      <div className="flex justify-between items-start">

        <div>

          <p className="text-slate-400">
            {title}
          </p>

          <h2 className="text-2xl font-bold text-white mt-2 break-words">
            {value}
          </h2>

        </div>

        <div className={style.icon}>
          {icon}
        </div>

      </div>

    </div>

  );
}


/* =========================================================
   INFORMATION CARD
========================================================= */

function InfoCard({
  title,
  value,
  icon,
  valueClass = "text-white",
}) {

  return (

    <div className="bg-slate-900 rounded-xl p-5">

      <div className="flex items-center gap-2">

        {icon && (
          <span className="text-cyan-400">
            {icon}
          </span>
        )}

        <p className="text-slate-400">
          {title}
        </p>

      </div>

      <h3
        className={`
          ${valueClass}
          text-xl
          font-bold
          mt-2
        `}
      >
        {value ?? "-"}
      </h3>

    </div>

  );
}