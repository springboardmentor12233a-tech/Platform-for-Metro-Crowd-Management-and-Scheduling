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
  ArrowUpRight,
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
  // NETWORK CALCULATIONS
  // =====================================================

  const totalStations = Number(
    summary?.total_stations ?? 0
  );

  const alerts = Array.isArray(recentAlerts)
    ? recentAlerts
    : [];

  const criticalAlerts = alerts.filter(
    (alert) =>
      String(alert?.severity ?? "").toLowerCase() ===
      "critical"
  ).length;

  const warningAlerts = alerts.filter(
    (alert) =>
      String(alert?.severity ?? "").toLowerCase() ===
      "warning"
  ).length;

  const healthyStations = Math.max(
    totalStations -
      criticalAlerts -
      warningAlerts,
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
      : Math.min(
          Math.round(
            (healthyStations / totalStations) *
              100
          ),
          100
        );

  // =====================================================
  // AI RECOMMENDATION
  // =====================================================

  const riskLevel =
    recommendation?.risk_level || "Unknown";

  const riskColor =
    riskLevel === "Critical"
      ? "border-red-200 bg-red-50 text-red-700"
      : riskLevel === "High"
      ? "border-orange-200 bg-orange-50 text-orange-700"
      : riskLevel === "Medium"
      ? "border-amber-200 bg-amber-50 text-amber-700"
      : "border-emerald-200 bg-emerald-50 text-emerald-700";

  const recommendationSummary =
    recommendation?.summary ??
    "Waiting for AI analysis...";

  const expectedImpact =
    recommendation?.expected_impact ??
    "Impact prediction unavailable.";

  // =====================================================
  // HELPERS
  // =====================================================

  const getRiskBadge = (risk) => {
    switch (
      String(risk || "").toLowerCase()
    ) {
      case "critical":
        return "border-red-200 bg-red-50 text-red-700";

      case "high":
        return "border-orange-200 bg-orange-50 text-orange-700";

      case "medium":
        return "border-amber-200 bg-amber-50 text-amber-700";

      default:
        return "border-emerald-200 bg-emerald-50 text-emerald-700";
    }
  };

  const getRiskDot = (risk) => {
    switch (
      String(risk || "").toLowerCase()
    ) {
      case "critical":
        return "bg-red-500";

      case "high":
        return "bg-orange-500";

      case "medium":
        return "bg-amber-500";

      default:
        return "bg-emerald-500";
    }
  };

  const formatHistoryTime = (date) => {
    if (!date) return "--";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "--";
    }

    return parsedDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTime = (date) => {
    if (!date) return "--:--:--";

    return date.toLocaleTimeString();
  };

  const latestRecommendations =
    Array.isArray(
      recommendationHistory
    )
      ? recommendationHistory
          .slice()
          .sort(
            (a, b) =>
              new Date(
                b?.created_at ?? 0
              ).getTime() -
              new Date(
                a?.created_at ?? 0
              ).getTime()
          )
          .slice(0, 5)
      : [];

  // =====================================================
  // SUMMARY VALUES
  // =====================================================

  const totalPassengers = Number(
    summary?.total_passengers ?? 0
  );

  const totalTrips = Number(
    summary?.total_trips ?? 0
  );

  const totalRevenue = Number(
    summary?.total_revenue ?? 0
  );

  // =====================================================
  // AI STATUS
  // =====================================================

  const aiStatus = [
    {
      title: "Gemini AI",
      value: "Online",
      icon: BrainCircuit,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
      border: "border-violet-400/10",
    },
    {
      title: "Prediction Engine",
      value: "Running",
      icon: Activity,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-400/10",
    },
    {
      title: "Metro Network",
      value: networkHealth,
      icon: Radar,
      color:
        networkHealth === "Critical"
          ? "text-red-400"
          : networkHealth === "Warning"
          ? "text-amber-400"
          : "text-emerald-400",
      bg:
        networkHealth === "Critical"
          ? "bg-red-500/10"
          : networkHealth === "Warning"
          ? "bg-amber-500/10"
          : "bg-emerald-500/10",
      border:
        networkHealth === "Critical"
          ? "border-red-400/10"
          : networkHealth === "Warning"
          ? "border-amber-400/10"
          : "border-emerald-400/10",
    },
    {
      title: "Last Analysis",
      value: formatTime(lastUpdated),
      icon: Clock,
      color: "text-sky-400",
      bg: "bg-sky-500/10",
      border: "border-sky-400/10",
    },
  ];

  // =====================================================
  // STATION STATUS
  // =====================================================

  const getStationOccupancy = (passengers) => {
    const value = Number(passengers ?? 0);

    if (!value) return 0;

    return Math.min(
      Math.max(
        Math.round(
          (value / 320000) * 100
        ),
        0
      ),
      100
    );
  };

  const getStationStatus = (occupancy) => {
    if (occupancy >= 90) {
      return {
        label: "Critical",
        badge:
          "border-red-200 bg-red-50 text-red-600",
        bar: "bg-red-500",
      };
    }

    if (occupancy >= 75) {
      return {
        label: "Warning",
        badge:
          "border-amber-200 bg-amber-50 text-amber-600",
        bar: "bg-amber-500",
      };
    }

    return {
      label: "Healthy",
      badge:
        "border-emerald-200 bg-emerald-50 text-emerald-600",
      bar: "bg-emerald-500",
    };
  };

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.45,
      }}
      className="w-full"
    >
      {/* =====================================================
          TOP HEADER
      ===================================================== */}

      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 items-center gap-4">

          <motion.div
            initial={{
              rotate: -12,
              scale: 0.85,
            }}
            animate={{
              rotate: 0,
              scale: 1,
            }}
            transition={{
              duration: 0.5,
            }}
            className="
              flex
              h-14
              w-14
              shrink-0
              items-center
              justify-center
              rounded-2xl
              bg-gradient-to-br
              from-violet-600
              via-indigo-600
              to-blue-600
              shadow-lg
              shadow-indigo-600/20
            "
          >
            <BrainCircuit
              size={27}
              className="text-white"
            />
          </motion.div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">

              <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                MetroVision AI
              </h2>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-300">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                Live
              </span>

            </div>

            <p className="mt-1.5 max-w-3xl text-sm leading-6 text-slate-400">
              AI-powered operational intelligence for
              crowd monitoring, prediction, congestion
              management and real-time metro decision support.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5">

          <div
            className={`rounded-2xl border px-4 py-3 ${riskColor}`}
          >
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] opacity-70">
              AI Risk
            </p>

            <p className="mt-1 text-sm font-black">
              {riskLevel}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-500">
              Network
            </p>

            <p className="mt-1 text-sm font-black text-white">
              {healthPercentage}%
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-500">
              Updated
            </p>

            <p className="mt-1 text-sm font-black text-white">
              {formatTime(lastUpdated)}
            </p>
          </div>

        </div>
      </div>

      {/* =====================================================
          KPI STRIP
      ===================================================== */}

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">

        {/* Network Health */}
        <motion.div
          whileHover={{
            y: -2,
          }}
          className="rounded-2xl border border-emerald-400/10 bg-emerald-500/[0.06] p-4"
        >
          <div className="flex items-center justify-between">

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                Network Health
              </p>

              <p className="mt-1 text-2xl font-black text-white">
                {healthPercentage}%
              </p>
            </div>

            <div className="rounded-xl bg-emerald-500/10 p-2.5">
              <ShieldCheck
                size={20}
                className="text-emerald-400"
              />
            </div>

          </div>

          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/5">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${healthPercentage}%`,
              }}
              transition={{
                duration: 0.9,
              }}
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400"
            />
          </div>
        </motion.div>

        {/* Passengers */}
        <motion.div
          whileHover={{
            y: -2,
          }}
          className="rounded-2xl border border-indigo-400/10 bg-indigo-500/[0.06] p-4"
        >
          <div className="flex items-center justify-between">

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                Passengers
              </p>

              <p className="mt-1 text-2xl font-black text-white">
                {totalPassengers.toLocaleString()}
              </p>
            </div>

            <div className="rounded-xl bg-indigo-500/10 p-2.5">
              <TrendingUp
                size={20}
                className="text-indigo-400"
              />
            </div>

          </div>

          <p className="mt-2 text-xs text-slate-500">
            Current daily movement
          </p>
        </motion.div>

        {/* Prediction */}
        <motion.div
          whileHover={{
            y: -2,
          }}
          className="rounded-2xl border border-violet-400/10 bg-violet-500/[0.06] p-4"
        >
          <div className="flex items-center justify-between">

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                AI Prediction
              </p>

              <p className="mt-1 text-2xl font-black text-white">
                {latestPrediction
                  ? Number(
                      latestPrediction.predicted_passengers ??
                        0
                    ).toLocaleString()
                  : "--"}
              </p>
            </div>

            <div className="rounded-xl bg-violet-500/10 p-2.5">
              <BrainCircuit
                size={20}
                className="text-violet-400"
              />
            </div>

          </div>

          <p className="mt-2 truncate text-xs text-slate-500">
            {latestPrediction
              ? `${latestPrediction.from_station} → ${latestPrediction.to_station}`
              : "Awaiting prediction"}
          </p>
        </motion.div>

        {/* Operations */}
        <motion.div
          whileHover={{
            y: -2,
          }}
          className="rounded-2xl border border-cyan-400/10 bg-cyan-500/[0.06] p-4"
        >
          <div className="flex items-center justify-between">

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                Operations
              </p>

              <p className="mt-1 text-2xl font-black text-white">
                {totalTrips.toLocaleString()}
              </p>
            </div>

            <div className="rounded-xl bg-cyan-500/10 p-2.5">
              <TrainFront
                size={20}
                className="text-cyan-400"
              />
            </div>

          </div>

          <p className="mt-2 text-xs text-slate-500">
            ₹ {totalRevenue.toLocaleString()} revenue
          </p>
        </motion.div>

      </div>

      {/* =====================================================
          MAIN AI OPERATIONS GRID
      ===================================================== */}

      <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-12">

        {/* ===================================================
            SMART STATION MONITOR
        =================================================== */}

        <div className="flex min-h-[720px] flex-col rounded-3xl border border-white/10 bg-white/[0.035] p-5 xl:col-span-5">

          {/* Header */}

          <div className="flex items-start justify-between gap-3">

            <div>
              <div className="flex items-center gap-2">
                <div className="rounded-xl bg-indigo-500/10 p-2">
                  <Gauge
                    size={17}
                    className="text-indigo-400"
                  />
                </div>

                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-indigo-300">
                  Network Monitoring
                </span>
              </div>

              <h3 className="mt-2 text-xl font-black text-white">
                Smart Station Monitor
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                AI-monitored passenger demand across
                the busiest stations.
              </p>
            </div>

            <span className="shrink-0 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-emerald-300">
              Live
            </span>

          </div>

          {/* Station List */}

          <div className="mt-5 flex-1 space-y-3">

            {busiestStations.length === 0 ? (
              <div className="flex min-h-[450px] items-center justify-center rounded-2xl border border-dashed border-white/10">
                <div className="text-center">
                  <Gauge
                    size={36}
                    className="mx-auto text-slate-600"
                  />

                  <p className="mt-3 text-sm text-slate-500">
                    Waiting for station data...
                  </p>
                </div>
              </div>
            ) : (
              busiestStations
                .slice(0, 5)
                .map((station, index) => {
                  const passengers =
                    Number(
                      station?.passengers ??
                        0
                    );

                  const occupancy =
                    getStationOccupancy(
                      passengers
                    );

                  const status =
                    getStationStatus(
                      occupancy
                    );

                  return (
                    <motion.div
                      key={
                        station?.station_id ??
                        index
                      }
                      whileHover={{
                        y: -2,
                      }}
                      className="
                        rounded-2xl
                        border
                        border-white/10
                        bg-white/[0.035]
                        p-4
                        transition
                        hover:border-white/15
                        hover:bg-white/[0.05]
                      "
                    >

                      <div className="flex items-center justify-between gap-3">

                        <div className="flex min-w-0 items-center gap-3">

                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10">
                            <TrainFront
                              size={16}
                              className="text-indigo-400"
                            />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-white">
                              {station?.station ??
                                "Unknown Station"}
                            </p>

                            <p className="mt-0.5 text-[10px] text-slate-500">
                              {passengers.toLocaleString()} passengers
                            </p>
                          </div>

                        </div>

                        <span
                          className={`shrink-0 rounded-full border px-2.5 py-1 text-[9px] font-bold ${status.badge}`}
                        >
                          {status.label}
                        </span>

                      </div>

                      <div className="mt-4">

                        <div className="mb-1.5 flex items-center justify-between text-[10px] text-slate-500">
                          <span>
                            Occupancy
                          </span>

                          <span className="font-bold text-slate-300">
                            {occupancy}%
                          </span>
                        </div>

                        <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                          <motion.div
                            initial={{
                              width: 0,
                            }}
                            animate={{
                              width: `${occupancy}%`,
                            }}
                            transition={{
                              duration: 0.8,
                              delay:
                                index *
                                0.08,
                            }}
                            className={`h-full rounded-full ${status.bar}`}
                          />
                        </div>

                      </div>

                    </motion.div>
                  );
                })
            )}

          </div>

          {/* Station Footer */}

          <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">

            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

              <span className="text-[10px] text-slate-500">
                {busiestStations.length} stations monitored
              </span>
            </div>

            <span className="text-[10px] text-slate-500">
              Updated {formatTime(lastUpdated)}
            </span>

          </div>

        </div>

        {/* ===================================================
            AI COMMAND CENTER
        =================================================== */}

        <div className="flex min-h-[720px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#111a2d] via-[#0c1628] to-[#10182a] p-5 shadow-2xl xl:col-span-7">

          {/* Header */}

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

            <div>
              <div className="flex items-center gap-2">
                <div className="rounded-xl bg-cyan-500/10 p-2">
                  <BrainCircuit
                    size={17}
                    className="text-cyan-400"
                  />
                </div>

                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-cyan-300">
                  Intelligence
                </span>
              </div>

              <h3 className="mt-2 text-xl font-black text-white">
                AI Command Center
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Gemini-powered recommendations and
                operational decision support.
              </p>
            </div>

            <div
              className={`rounded-full border px-3 py-1.5 text-[9px] font-bold uppercase tracking-wide ${getRiskBadge(
                riskLevel
              )}`}
            >
              Risk: {riskLevel}
            </div>

          </div>

          {/* AI Status Grid */}

          <div className="mt-5 grid grid-cols-2 gap-3">

            {aiStatus.map((item) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  whileHover={{
                    y: -2,
                  }}
                  className={`rounded-2xl border p-3.5 ${item.bg} ${item.border}`}
                >
                  <div className="flex items-center justify-between">

                    <Icon
                      size={17}
                      className={item.color}
                    />

                    <ArrowUpRight
                      size={13}
                      className="text-white/20"
                    />

                  </div>

                  <p className="mt-3 text-[10px] text-slate-500">
                    {item.title}
                  </p>

                  <p className="mt-0.5 text-sm font-bold text-white">
                    {item.value}
                  </p>

                </motion.div>
              );
            })}

          </div>

          {/* AI Insight */}

          <div className="mt-4 rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.05] p-4">

            <div className="flex items-center gap-2">
              <Sparkles
                size={15}
                className="text-cyan-400"
              />

              <span className="text-xs font-bold text-cyan-300">
                AI Insight
              </span>
            </div>

            <p className="mt-2 text-xs leading-6 text-slate-300">
              {loadingRecommendation
                ? "Analyzing latest network data..."
                : recommendationSummary}
            </p>

          </div>

          {/* Expected Impact */}

          <div className="mt-3 rounded-2xl border border-indigo-400/10 bg-indigo-400/[0.05] p-4">

            <div className="flex items-center gap-2">
              <TrendingUp
                size={15}
                className="text-indigo-300"
              />

              <span className="text-xs font-bold text-indigo-300">
                Expected Impact
              </span>
            </div>

            <p className="mt-2 text-xs leading-6 text-slate-300">
              {expectedImpact}
            </p>

          </div>

          {/* =================================================
              RECOMMENDATION TIMELINE
          ================================================= */}

          <div className="mt-4 flex min-h-0 flex-1 flex-col rounded-2xl border border-white/10 bg-black/10 p-4">

            <div className="mb-3 flex items-center justify-between gap-3">

              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-cyan-500/10 p-2">
                  <Clock
                    size={15}
                    className="text-cyan-400"
                  />
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white">
                    AI Recommendation Timeline
                  </h4>

                  <p className="text-[9px] text-slate-500">
                    Latest Gemini operational decisions
                  </p>
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-2.5 py-1 text-[8px] font-bold uppercase tracking-wide text-cyan-300">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
                Live
              </span>

            </div>

            {latestRecommendations.length ===
            0 ? (
              <div className="flex min-h-[250px] flex-1 items-center justify-center text-center">

                <div>
                  <BrainCircuit
                    size={40}
                    className="mx-auto text-cyan-400"
                  />

                  <h4 className="mt-4 text-sm font-bold text-white">
                    AI Engine Ready
                  </h4>

                  <p className="mt-1 max-w-xs text-xs leading-5 text-slate-500">
                    Generate a recommendation to
                    populate the operational timeline.
                  </p>
                </div>

              </div>
            ) : (
              <>
                <div className="relative min-h-0 flex-1 overflow-y-auto pr-1">

                  {/* Timeline line */}

                  <div
                    className="
                      absolute
                      bottom-2
                      left-[18px]
                      top-2
                      w-px
                      bg-gradient-to-b
                      from-cyan-400/70
                      via-indigo-500/50
                      to-transparent
                    "
                  />

                  <div className="space-y-3">

                    {latestRecommendations.map(
                      (item, index) => (
                        <motion.div
                          key={
                            item?.id ??
                            index
                          }
                          initial={{
                            opacity: 0,
                            x: -10,
                          }}
                          animate={{
                            opacity: 1,
                            x: 0,
                          }}
                          transition={{
                            delay:
                              index * 0.08,
                            duration: 0.3,
                          }}
                          className="relative pl-9"
                        >

                          {/* Timeline dot */}

                          <div
                            className={`
                              absolute
                              left-[10px]
                              top-4
                              h-4
                              w-4
                              rounded-full
                              border-[3px]
                              border-[#0f182a]
                              ${getRiskDot(
                                item?.risk_level
                              )}
                            `}
                          />

                          {/* Timeline Card */}

                          <div className="rounded-xl border border-white/10 bg-white/[0.035] p-3.5">

                            <div className="flex flex-wrap items-center justify-between gap-2">

                              <div className="flex min-w-0 items-center gap-2">

                                <TrainFront
                                  size={14}
                                  className="shrink-0 text-cyan-400"
                                />

                                <span className="truncate text-xs font-bold text-white">
                                  {item?.station_name ??
                                    "Unknown Station"}
                                </span>

                              </div>

                              <div className="flex items-center gap-2">

                                <span className="text-[9px] text-slate-500">
                                  {formatHistoryTime(
                                    item?.created_at
                                  )}
                                </span>

                                <span
                                  className={`
                                    rounded-full
                                    border
                                    px-2
                                    py-0.5
                                    text-[8px]
                                    font-bold
                                    ${getRiskBadge(
                                      item?.risk_level
                                    )}
                                  `}
                                >
                                  {item?.risk_level ??
                                    "Unknown"}
                                </span>

                              </div>

                            </div>

                            {/* Recommendation */}

                            <div className="mt-3 rounded-lg bg-slate-900/50 p-3">

                              <div className="flex items-center gap-2">
                                <Sparkles
                                  size={12}
                                  className="text-indigo-300"
                                />

                                <span className="text-[9px] font-bold uppercase tracking-wide text-indigo-300">
                                  Recommendation
                                </span>
                              </div>

                              <p className="mt-1.5 text-[10px] leading-5 text-slate-400">
                                {item?.recommendation ??
                                  "No recommendation available."}
                              </p>

                            </div>

                            {/* Impact */}

                            <div className="mt-2 rounded-lg bg-cyan-500/[0.05] p-3">

                              <div className="flex items-center gap-2">
                                <TrendingUp
                                  size={12}
                                  className="text-cyan-300"
                                />

                                <span className="text-[9px] font-bold uppercase tracking-wide text-cyan-300">
                                  Expected Impact
                                </span>
                              </div>

                              <p className="mt-1.5 text-[10px] leading-5 text-slate-400">
                                {item?.expected_impact ??
                                  "Impact unavailable."}
                              </p>

                            </div>

                            {/* Confidence */}

                            <div className="mt-3">

                              <div className="flex items-center justify-between text-[9px]">
                                <span className="font-medium text-slate-500">
                                  AI Confidence
                                </span>

                                <span className="font-bold text-emerald-400">
                                  {item?.confidence ??
                                    95}
                                  %
                                </span>
                              </div>

                              <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/5">
                                <motion.div
                                  initial={{
                                    width: 0,
                                  }}
                                  animate={{
                                    width: `${
                                      item?.confidence ??
                                      95
                                    }%`,
                                  }}
                                  transition={{
                                    duration: 0.7,
                                  }}
                                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                                />
                              </div>

                            </div>

                          </div>
                        </motion.div>
                      )
                    )}

                  </div>

                </div>

                <button
                  type="button"
                  onClick={onViewAllHistory}
                  className="
                    mt-3
                    w-full
                    rounded-xl
                    border
                    border-cyan-500/20
                    bg-cyan-500/[0.06]
                    px-4
                    py-2.5
                    text-[10px]
                    font-bold
                    text-cyan-300
                    transition
                    hover:bg-cyan-500/[0.12]
                  "
                >
                  View Complete Recommendation History
                </button>
              </>
            )}

          </div>

          {/* Active Engine */}

          <div className="mt-3 flex items-center justify-between rounded-xl border border-emerald-400/10 bg-emerald-500/[0.05] px-3.5 py-2.5">

            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />

              <span className="text-[10px] font-semibold text-slate-300">
                MetroVision AI Engine
              </span>
            </div>

            <span className="text-[9px] font-bold uppercase tracking-wide text-emerald-300">
              Online
            </span>

          </div>

        </div>
      </div>

      {/* =====================================================
          RECENT PREDICTIONS
      ===================================================== */}

      {recentHistory.length > 0 && (
        <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.025] p-4">

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white">
                Recent AI Predictions
              </h4>

              <p className="mt-1 text-[10px] text-slate-500">
                Latest passenger movement predictions
              </p>
            </div>

            <Activity
              size={16}
              className="text-slate-500"
            />
          </div>

          <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-5">

            {recentHistory
              .slice(0, 5)
              .map((item, index) => {

                const predictedPassengers =
                  Number(
                    item?.predicted_passengers ??
                      0
                  );

                return (
                  <div
                    key={
                      item?.id ??
                      index
                    }
                    className="rounded-xl border border-white/10 bg-white/[0.025] px-3 py-3"
                  >

                    <p className="truncate text-[10px] font-semibold text-white">
                      {item?.from_station ??
                        "Unknown"}{" "}
                      →{" "}
                      {item?.to_station ??
                        "Unknown"}
                    </p>

                    <div className="mt-2 flex items-center justify-between">

                      <span className="text-[9px] text-slate-500">
                        Prediction
                      </span>

                      <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-[9px] font-bold text-indigo-300">
                        {predictedPassengers.toLocaleString()}
                      </span>

                    </div>

                  </div>
                );
              })}

          </div>

        </div>
      )}

      {/* =====================================================
          SYSTEM FOOTER
      ===================================================== */}

      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <div className="flex items-center gap-2">
              <Sparkles
                size={16}
                className="text-indigo-500"
              />

              <h3 className="text-sm font-black text-slate-900">
                MetroVision AI Engine
              </h3>
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Real-time intelligence powered by FastAPI,
              PostgreSQL and Gemini AI.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">

            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <p className="text-[9px] uppercase tracking-wide text-slate-400">
                Stations
              </p>

              <p className="mt-0.5 text-sm font-black text-slate-900">
                {totalStations}
              </p>
            </div>

            <div className="rounded-xl border border-red-100 bg-red-50 px-3 py-2">
              <p className="text-[9px] uppercase tracking-wide text-red-400">
                Alerts
              </p>

              <p className="mt-0.5 text-sm font-black text-red-600">
                {alerts.length}
              </p>
            </div>

            <div className="rounded-xl border border-indigo-100 bg-indigo-50 px-3 py-2">
              <p className="text-[9px] uppercase tracking-wide text-indigo-400">
                Confidence
              </p>

              <p className="mt-0.5 text-sm font-black text-indigo-600">
                {recommendation?.confidence ??
                  96}
                %
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />

              <span className="text-[10px] font-bold text-emerald-700">
                All Systems Operational
              </span>
            </div>

          </div>

        </div>

      </div>

    </motion.section>
  );
}

export default AIOperationsCenter;