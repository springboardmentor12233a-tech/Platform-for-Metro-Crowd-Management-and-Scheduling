import { motion } from "framer-motion";
import {
  BrainCircuit,
  Activity,
  ShieldCheck,
  TrendingUp,
  Clock,
  Sparkles,
  Gauge,
  Radar,
  TrainFront,
} from "lucide-react";

function AIOperationsCenter({
  summary,
  busiestStations = [],
  recentAlerts = [],
  recentHistory = [],
  latestPrediction,
  recommendation,
  loadingRecommendation,
  recommendationHistory = [],
  lastUpdated,
  onViewAllHistory,
}) {
  // =====================================================
  // Network Calculations
  // =====================================================

  const totalStations = summary?.total_stations ?? 0;

  const alerts = recentAlerts ?? [];

  const criticalAlerts = alerts.filter(
    (alert) => alert.severity === "Critical"
  ).length;

  const warningAlerts = alerts.filter(
    (alert) => alert.severity === "Warning"
  ).length;

  const healthyStations = Math.max(
    totalStations - criticalAlerts - warningAlerts,
    0
  );

  const networkHealth =
    criticalAlerts > 2
      ? "Critical"
      : warningAlerts > 3
      ? "Warning"
      : "Healthy";

  const healthPercentage =
    totalStations === 0
      ? 100
      : Math.round((healthyStations / totalStations) * 100);

  // =====================================================
  // AI Recommendation
  // =====================================================

  const riskLevel = recommendation?.risk_level || "Unknown";

  const riskColor =
    riskLevel === "Critical"
      ? "bg-red-100 text-red-700 border-red-200"
      : riskLevel === "High"
      ? "bg-orange-100 text-orange-700 border-orange-200"
      : riskLevel === "Medium"
      ? "bg-yellow-100 text-yellow-700 border-yellow-200"
      : "bg-green-100 text-green-700 border-green-200";

  const recommendationSummary =
    recommendation?.summary ?? "Waiting for AI analysis...";

  const expectedImpact =
    recommendation?.expected_impact ?? "Impact prediction unavailable.";

  // =====================================================
  // Recommendation Timeline Helpers
  // =====================================================

  const getRiskBadge = (risk) => {
    switch ((risk || "").toLowerCase()) {
      case "critical":
        return "bg-red-100 text-red-700 border-red-200";

      case "high":
        return "bg-orange-100 text-orange-700 border-orange-200";

      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";

      default:
        return "bg-green-100 text-green-700 border-green-200";
    }
  };

  const getRiskDot = (risk) => {
    switch ((risk || "").toLowerCase()) {
      case "critical":
        return "bg-red-500";

      case "high":
        return "bg-orange-500";

      case "medium":
        return "bg-yellow-500";

      default:
        return "bg-green-500";
    }
  };

  const formatHistoryTime = (date) => {
    if (!date) return "--";

    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTime = (date) => (date ? date.toLocaleTimeString() : "--:--:--");

  const latestRecommendations = Array.isArray(recommendationHistory)
    ? recommendationHistory
        .slice()
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
        )
        .slice(0, 5)
    : [];

  // =====================================================
  // Dashboard Statistics
  // =====================================================

  const totalPassengers = summary?.total_passengers ?? 0;

  const totalTrips = summary?.total_trips ?? 0;

  const totalRevenue = summary?.total_revenue ?? 0;

  // =====================================================
  // AI Status Cards
  // =====================================================

  const aiStatus = [
    {
      title: "Gemini AI",
      value: "Online",
      icon: BrainCircuit,
      color: "text-indigo-600",
    },
    {
      title: "Prediction Engine",
      value: "Running",
      icon: Activity,
      color: "text-green-600",
    },
    {
      title: "Metro Network",
      value: networkHealth,
      icon: Radar,
      color:
        networkHealth === "Critical"
          ? "text-red-600"
          : networkHealth === "Warning"
          ? "text-yellow-600"
          : "text-green-600",
    },
    {
      title: "Last Analysis",
      value: formatTime(lastUpdated),
      icon: Clock,
      color: "text-slate-700",
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="rounded-3xl"
    >
      {/* =====================================================
          METROFLOW AI HEADER
      ===================================================== */}

      <div className="flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-between">
        {/* Left Side */}

        <div className="flex items-start gap-6">
          <motion.div
            initial={{ rotate: -15, scale: 0.8 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="
              rounded-3xl
              bg-gradient-to-br
              from-indigo-600
              via-violet-600
              to-purple-700
              p-5
              shadow-xl
            "
          >
            <BrainCircuit size={42} className="text-white" />
          </motion.div>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-4xl font-extrabold text-slate-900">
                MetroFlow AI
              </h2>

              <div className="flex items-center gap-2 rounded-full bg-green-100 px-4 py-2">
                <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />

                <span className="font-semibold text-green-700">LIVE</span>
              </div>
            </div>

            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
              AI-powered operational intelligence for crowd monitoring,
              passenger prediction, congestion management and real-time
              metro decision support.
            </p>
          </div>
        </div>

        {/* Right */}

        <div className="flex flex-wrap gap-4">
          <div
            className={`
            rounded-2xl
            border
            px-5
            py-4
            font-semibold
            ${riskColor}
          `}
          >
            <div className="text-xs uppercase opacity-70">AI Risk</div>

            <div className="mt-1 text-lg font-bold">{riskLevel}</div>
          </div>

          <div className="rounded-2xl bg-slate-100 px-5 py-4">
            <div className="text-xs uppercase text-slate-500">
              Network Health
            </div>

            <div className="mt-1 text-lg font-bold">{healthPercentage}%</div>
          </div>

          <div className="rounded-2xl bg-slate-100 px-5 py-4">
            <div className="text-xs uppercase text-slate-500">
              Last Analysis
            </div>

            <div className="mt-1 text-lg font-bold">
              {formatTime(lastUpdated)}
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}

      <div className="my-10 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />

      {/* =====================================================
          LIVE KPI DASHBOARD
      ===================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Network Health */}

        <motion.div
          whileHover={{
            y: -8,
            scale: 1.02,
          }}
          transition={{
            duration: 0.25,
          }}
          className="
            rounded-3xl
            border
            border-green-200
            bg-gradient-to-br
            from-green-50
            to-emerald-100
            p-7
            shadow-lg
          "
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Network Health
              </p>

              <h2 className="mt-3 text-5xl font-black text-slate-900">
                {healthPercentage}%
              </h2>
            </div>

            <div className="rounded-2xl bg-white p-4 shadow">
              <ShieldCheck size={38} className="text-green-600" />
            </div>
          </div>

          <div className="mt-7">
            <div className="flex justify-between text-sm mb-2">
              <span>Status</span>

              <span className="font-semibold">{networkHealth}</span>
            </div>

            <div className="h-3 rounded-full bg-green-100 overflow-hidden">
              <motion.div
                initial={{
                  width: 0,
                }}
                animate={{
                  width: `${healthPercentage}%`,
                }}
                transition={{
                  duration: 1.2,
                }}
                className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-600"
              />
            </div>
          </div>
        </motion.div>

        {/* Passenger Analytics */}

        <motion.div
          whileHover={{
            y: -8,
            scale: 1.02,
          }}
          className="
            rounded-3xl
            border
            border-indigo-200
            bg-gradient-to-br
            from-indigo-50
            to-violet-100
            p-7
            shadow-lg
          "
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Passengers
              </p>

              <h2 className="mt-3 text-4xl font-black text-slate-900">
                {totalPassengers.toLocaleString()}
              </h2>
            </div>

            <div className="rounded-2xl bg-white p-4 shadow">
              <TrendingUp size={38} className="text-indigo-600" />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <span className="text-slate-500">Daily Movement</span>

            <span className="font-bold text-indigo-600">↑ Active</span>
          </div>
        </motion.div>

        {/* AI Prediction */}

        <motion.div
          whileHover={{
            y: -8,
            scale: 1.02,
          }}
          className="
            rounded-3xl
            border
            border-violet-200
            bg-gradient-to-br
            from-violet-50
            to-purple-100
            p-7
            shadow-lg
          "
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                AI Prediction
              </p>

              <h2 className="mt-3 text-4xl font-black text-slate-900">
                {latestPrediction
                  ? latestPrediction.predicted_passengers.toLocaleString()
                  : "--"}
              </h2>
            </div>

            <div className="rounded-2xl bg-white p-4 shadow">
              <BrainCircuit size={38} className="text-violet-600" />
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm leading-6 text-slate-600">
              {latestPrediction
                ? `${latestPrediction.from_station} → ${latestPrediction.to_station}`
                : "Waiting for live prediction..."}
            </p>
          </div>
        </motion.div>

        {/* Operations */}

        <motion.div
          whileHover={{
            y: -8,
            scale: 1.02,
          }}
          className="
            rounded-3xl
            border
            border-cyan-200
            bg-gradient-to-br
            from-cyan-50
            to-sky-100
            p-7
            shadow-lg
          "
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Operations
              </p>

              <h2 className="mt-3 text-4xl font-black text-slate-900">
                {totalTrips.toLocaleString()}
              </h2>
            </div>

            <div className="rounded-2xl bg-white p-4 shadow">
              <TrainFront size={38} className="text-cyan-600" />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <span className="text-slate-500">Revenue</span>

            <span className="font-bold text-cyan-700">
              ₹ {totalRevenue.toLocaleString()}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Divider */}

      <div className="my-10 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />

      {/* =====================================================
          AI OPERATIONS CONSOLE
      ===================================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* ======================================
            Smart Station Monitor
        ====================================== */}

        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                🏆 Smart Station Monitor
              </h2>

              <p className="mt-1 text-slate-500">
                AI monitored busiest stations
              </p>
            </div>

            <span className="rounded-full bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-700">
              LIVE
            </span>
          </div>

          <div className="mt-8 space-y-5">
            {busiestStations.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center">
                <Gauge size={40} className="mx-auto text-slate-400" />

                <p className="mt-4 text-slate-500">
                  Waiting for station data...
                </p>
              </div>
            ) : (
              busiestStations.slice(0, 5).map((station, index) => {
                const occupancy = Math.min(
                  Math.round((station.passengers / 320000) * 100),
                  100
                );

                const status =
                  occupancy >= 90
                    ? "Critical"
                    : occupancy >= 75
                    ? "Warning"
                    : "Healthy";

                const badgeColor =
                  occupancy >= 90
                    ? "bg-red-100 text-red-700"
                    : occupancy >= 75
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700";

                return (
                  <motion.div
                    key={station.station_id ?? index}
                    whileHover={{
                      scale: 1.02,
                    }}
                    className="rounded-2xl border border-slate-200 p-5"
                  >
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-bold text-lg">
                          {station.station}
                        </h3>

                        <p className="mt-1 text-slate-500">
                          {station.passengers.toLocaleString()} passengers
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-4 py-2 text-sm font-semibold ${badgeColor}`}
                      >
                        {status}
                      </span>
                    </div>

                    <div className="mt-5">
                      <div className="mb-2 flex justify-between text-sm">
                        <span>Occupancy</span>

                        <span>{occupancy}%</span>
                      </div>

                      <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${occupancy}%`,
                          }}
                          transition={{
                            duration: 1,
                          }}
                          className={`h-full rounded-full ${
                            occupancy >= 90
                              ? "bg-red-500"
                              : occupancy >= 75
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* ======================================
            AI COMMAND CENTER
        ====================================== */}

        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-white shadow-2xl">
          <div className="flex items-center gap-3">
            <BrainCircuit className="text-cyan-400" />

            <h2 className="text-2xl font-bold">AI Command Center</h2>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            {aiStatus.map((item) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  whileHover={{
                    scale: 1.04,
                  }}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5"
                >
                  <Icon size={28} className={item.color} />

                  <h3 className="mt-4 font-semibold">{item.title}</h3>

                  <p className="mt-2 text-sm text-slate-300">{item.value}</p>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-6">
            <div className="flex items-center gap-3">
              <Sparkles className="text-cyan-400" />

              <h3 className="font-bold">AI Insight</h3>
            </div>

            <p className="mt-4 leading-8 text-slate-300">
              {loadingRecommendation
                ? "Analyzing latest network data..."
                : recommendationSummary}
            </p>
          </div>

          <div className="mt-6 rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="text-indigo-300" />

              <h3 className="font-bold">Expected Impact</h3>
            </div>

            <p className="mt-4 leading-8 text-slate-300">{expectedImpact}</p>
          </div>

          {/* =====================================================
              AI RECOMMENDATION TIMELINE
          ===================================================== */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="
              mt-8
              rounded-3xl
              border
              border-cyan-500/20
              bg-gradient-to-br
              from-slate-900/60
              via-slate-800/70
              to-slate-900/60
              p-6
              backdrop-blur-xl
            "
          >
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-cyan-500/20 p-3">
                  <Clock size={22} className="text-cyan-400" />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white">
                    AI Recommendation Timeline
                  </h3>

                  <p className="text-sm text-slate-400">
                    Latest Gemini AI operational decisions
                  </p>
                </div>
              </div>

              {/* Live Badge */}

              <div className="flex items-center gap-2 rounded-full bg-cyan-500/20 px-4 py-2">
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-ping" />

                <span className="font-bold uppercase tracking-widest text-cyan-300">
                  LIVE
                </span>
              </div>
            </div>

            {latestRecommendations.length === 0 ? (
              /* Nice Empty State */
              <div className="py-16 text-center">
                <BrainCircuit
                  size={60}
                  className="mx-auto animate-pulse text-cyan-400"
                />

                <h3 className="mt-6 text-xl font-bold text-white">
                  AI Recommendation Engine Ready
                </h3>

                <p className="mt-3 text-slate-400">
                  Generate your first recommendation to build the
                  operational timeline.
                </p>
              </div>
            ) : (
              <>
                {/* Scrollable Timeline */}

                <div className="relative max-h-[650px] overflow-y-auto pr-2 custom-scrollbar">
                  {/* Animated Vertical Timeline Line */}

                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "100%" }}
                    transition={{
                      duration: 1.2,
                      ease: "easeOut",
                    }}
                    className="
                      absolute
                      left-[22px]
                      top-0
                      w-[2px]
                      rounded-full
                      bg-gradient-to-b
                      from-cyan-400
                      via-indigo-500
                      to-transparent
                    "
                  />

                  <div className="space-y-6">
                    {latestRecommendations.map((item, index) => (
                      <motion.div
                        key={item.id ?? index}
                        initial={{
                          opacity: 0,
                          x: -30,
                        }}
                        animate={{
                          opacity: 1,
                          x: 0,
                        }}
                        transition={{
                          delay: index * 0.15,
                          duration: 0.4,
                        }}
                        whileHover={{
                          scale: 1.02,
                          x: 8,
                          transition: {
                            duration: 0.2,
                          },
                        }}
                        className="relative pl-14"
                      >
                        {/* Glowing Timeline Dot */}

                        <div
                          className={`
                            absolute
                            left-[11px]
                            top-7
                            h-6
                            w-6
                            rounded-full
                            border-4
                            border-slate-900
                            shadow-xl
                            animate-pulse
                            ${getRiskDot(item.risk_level)}
                          `}
                        />

                        {/* Recommendation Card */}

                        <div
                          className="
                            rounded-2xl
                            border
                            border-white/10
                            bg-white/5
                            p-5
                            shadow-lg
                            transition-all
                            duration-300
                            hover:border-cyan-400/40
                            hover:bg-white/10
                          "
                        >
                          {/* Header */}

                          <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className="rounded-xl bg-cyan-500/20 p-2">
                                <TrainFront
                                  size={18}
                                  className="text-cyan-400"
                                />
                              </div>

                              <div>
                                <h4 className="font-semibold text-white">
                                  {item.station_name}
                                </h4>

                                <p className="text-xs text-slate-400">
                                  Metro Station
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="flex items-center gap-1 text-xs text-slate-400">
                                <Clock size={13} />
                                {formatHistoryTime(item.created_at)}
                              </span>

                              <span
                                className={`
                                  rounded-full
                                  border
                                  px-3
                                  py-1
                                  text-xs
                                  font-bold
                                  ${getRiskBadge(item.risk_level)}
                                `}
                              >
                                {item.risk_level}
                              </span>
                            </div>
                          </div>

                          {/* Recommendation */}

                          <div className="mt-5 rounded-xl bg-slate-800/50 p-4">
                            <div className="flex items-center gap-2">
                              <Sparkles
                                size={16}
                                className="text-indigo-300"
                              />

                              <span className="text-sm font-semibold text-indigo-300">
                                AI Recommendation
                              </span>
                            </div>

                            <p className="mt-3 leading-7 text-slate-300">
                              {item.recommendation}
                            </p>
                          </div>

                          {/* Expected Impact */}

                          <div className="mt-4 rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-4">
                            <div className="flex items-center gap-2">
                              <TrendingUp
                                size={16}
                                className="text-cyan-300"
                              />

                              <span className="text-sm font-semibold text-cyan-300">
                                Expected Impact
                              </span>
                            </div>

                            <p className="mt-3 text-sm leading-7 text-slate-300">
                              {item.expected_impact}
                            </p>
                          </div>

                          {/* AI Confidence */}

                          <div className="mt-4 rounded-xl border border-green-500/20 bg-green-500/10 p-4">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold text-green-300">
                                AI Confidence
                              </span>

                              <span className="font-bold text-green-400">
                                {item.confidence ?? 95}%
                              </span>
                            </div>

                            <div className="mt-3 h-2 overflow-hidden rounded-full bg-green-900">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{
                                  width: `${item.confidence ?? 95}%`,
                                }}
                                transition={{
                                  duration: 0.8,
                                }}
                                className="h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500"
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* View All History */}

                <div className="mt-8 text-center">
                  <button
                    type="button"
                    onClick={onViewAllHistory}
                    className="
                      rounded-xl
                      border
                      border-cyan-500/30
                      bg-cyan-500/10
                      px-5
                      py-3
                      text-sm
                      font-semibold
                      text-cyan-300
                      transition
                      hover:bg-cyan-500/20
                    "
                  >
                    View Complete AI Recommendation History
                  </button>
                </div>
              </>
            )}
          </motion.div>

          <div className="mt-8 flex items-center justify-between rounded-2xl border border-green-500/20 bg-green-500/10 px-6 py-5">
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-green-400 animate-pulse" />

              <span className="font-semibold">
                MetroFlow AI Engine Active
              </span>
            </div>

            <span className="rounded-full bg-green-500/20 px-4 py-2 text-sm text-green-300">
              ONLINE
            </span>
          </div>

          {/* Recent AI History */}

          {recentHistory.length > 0 && (
            <div className="mt-8">
              <h3 className="mb-4 text-lg font-semibold">
                Recent AI Predictions
              </h3>

              <div className="space-y-3">
                {recentHistory.slice(0, 5).map((item, index) => (
                  <div
                    key={item.id ?? index}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                  >
                    <div>
                      <p className="font-medium">
                        {item.from_station} → {item.to_station}
                      </p>

                      <p className="text-xs text-slate-400">Prediction</p>
                    </div>

                    <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-sm text-indigo-300">
                      {item.predicted_passengers.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =====================================================
          SYSTEM METRICS FOOTER
      ===================================================== */}

      <div className="mt-10 rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-50 via-white to-slate-50 p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          {/* Left */}

          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              MetroFlow AI Engine
            </h2>

            <p className="mt-2 text-slate-500">
              Real-time metro intelligence powered by FastAPI, PostgreSQL
              and Gemini AI.
            </p>
          </div>

          {/* Right */}

          <div className="flex flex-wrap gap-4">
            <div className="rounded-2xl bg-white border border-slate-200 px-6 py-4 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Total Stations
              </p>

              <h3 className="mt-2 text-3xl font-bold">
                {summary?.total_stations ?? 0}
              </h3>
            </div>

            <div className="rounded-2xl bg-white border border-slate-200 px-6 py-4 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Active Alerts
              </p>

              <h3 className="mt-2 text-3xl font-bold text-red-600">
                {alerts.length}
              </h3>
            </div>

            <div className="rounded-2xl bg-white border border-slate-200 px-6 py-4 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                AI Confidence
              </p>

              <h3 className="mt-2 text-3xl font-bold text-indigo-600">
                96%
              </h3>
            </div>
          </div>
        </div>

        {/* Divider */}

        <div className="my-8 h-px bg-slate-200" />

        {/* Bottom Status */}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="rounded-2xl bg-green-50 p-5">
            <div className="flex items-center gap-3">
              <ShieldCheck size={26} className="text-green-600" />

              <div>
                <p className="text-sm text-slate-500">Network</p>

                <h3 className="font-bold text-green-700">Healthy</h3>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-indigo-50 p-5">
            <div className="flex items-center gap-3">
              <BrainCircuit size={26} className="text-indigo-600" />

              <div>
                <p className="text-sm text-slate-500">AI Engine</p>

                <h3 className="font-bold text-indigo-700">Online</h3>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-cyan-50 p-5">
            <div className="flex items-center gap-3">
              <Radar size={26} className="text-cyan-600" />

              <div>
                <p className="text-sm text-slate-500">Monitoring</p>

                <h3 className="font-bold text-cyan-700">Active</h3>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-yellow-50 p-5">
            <div className="flex items-center gap-3">
              <Clock size={26} className="text-yellow-600" />

              <div>
                <p className="text-sm text-slate-500">Last Sync</p>

                <h3 className="font-bold text-yellow-700">
                  {formatTime(lastUpdated)}
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}

        <div className="mt-10 flex flex-col gap-4 border-t border-slate-200 pt-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="font-semibold text-slate-700">
              MetroFlow AI Operations Center v2.0
            </p>

            <p className="text-sm text-slate-500">
              Built with React • FastAPI • PostgreSQL • Gemini AI
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-full bg-green-100 px-5 py-3">
            <span className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></span>

            <span className="font-semibold text-green-700">
              All Systems Operational
            </span>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

export default AIOperationsCenter;