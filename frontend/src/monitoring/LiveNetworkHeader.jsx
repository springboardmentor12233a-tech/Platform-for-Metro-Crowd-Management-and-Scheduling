import { motion } from "framer-motion";

import {
  AlertTriangle,
  Activity,
  ShieldCheck,
  Clock,
  Radio,
} from "lucide-react";

function LiveNetworkHeader({
  summary = {},
  recentAlerts = [],
  lastUpdated = "",
}) {
  // ============================================================
  // NORMALIZE SUMMARY DATA
  // ============================================================

  const summaryData =
    summary?.data ||
    summary?.summary ||
    summary ||
    {};

  const totalStations = Number(
    summaryData?.total_stations ??
      summaryData?.totalStations ??
      0
  );

  const totalPassengers = Number(
    summaryData?.total_passengers ??
      summaryData?.totalPassengers ??
      summaryData?.active_passengers ??
      summaryData?.activePassengers ??
      0
  );

  // ============================================================
  // NORMALIZE ALERTS
  // ============================================================

  const alerts = Array.isArray(recentAlerts)
    ? recentAlerts
    : Array.isArray(recentAlerts?.data)
    ? recentAlerts.data
    : Array.isArray(recentAlerts?.alerts)
    ? recentAlerts.alerts
    : [];

  // ============================================================
  // ALERT COUNTS
  // ============================================================

  const criticalAlerts = alerts.filter((alert) => {
    const severity = String(
      alert?.severity ??
        alert?.level ??
        alert?.risk ??
        ""
    )
      .trim()
      .toLowerCase();

    return (
      severity === "critical" ||
      severity === "high"
    );
  }).length;

  const warningAlerts = alerts.filter((alert) => {
    const severity = String(
      alert?.severity ??
        alert?.level ??
        alert?.risk ??
        ""
    )
      .trim()
      .toLowerCase();

    return (
      severity === "warning" ||
      severity === "medium"
    );
  }).length;

  const activeAlerts =
    criticalAlerts + warningAlerts;

  // ============================================================
  // NETWORK HEALTH
  // ============================================================

  const networkHealth = Math.max(
    0,
    Math.min(
      100,
      100 -
        criticalAlerts * 5 -
        warningAlerts * 2
    )
  );

  // ============================================================
  // AI STATUS
  // ============================================================

  const aiRecommendation =
    criticalAlerts > 0
      ? "Critical crowd conditions detected. Increase monitoring and consider additional train frequency."
      : warningAlerts > 0
      ? "Some stations require observation. Monitor passenger density and prepare additional services."
      : "No critical congestion events detected. Continue normal metro operations.";

  return (
    <div className="space-y-5">

      {/* ======================================================
          MAIN CROWD CONTROL HEADER
      ====================================================== */}

      <motion.section
        initial={{
          opacity: 0,
          y: 15,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.4,
        }}
        className="
          overflow-hidden
          rounded-[28px]
          border
          border-slate-200
          bg-white
          shadow-lg
        "
      >

        {/* ====================================================
            PAGE TITLE
        ==================================================== */}

        <div className="px-7 pb-5 pt-7">

          <div className="flex items-start justify-between gap-6">

            <div>

              <h1
                className="
                  text-4xl
                  font-bold
                  tracking-tight
                  text-slate-900
                  lg:text-5xl
                "
              >
                MetroVision Crowd Control Center
              </h1>

              <p
                className="
                  mt-2
                  text-base
                  text-slate-500
                "
              >
                AI-powered real-time crowd monitoring dashboard
              </p>

            </div>

            {/* LIVE BADGE */}

            <div
              className="
                flex
                shrink-0
                items-center
                gap-2
                rounded-full
                bg-emerald-100
                px-5
                py-2.5
                text-sm
                font-semibold
                text-emerald-700
              "
            >

              <span
                className="
                  h-2.5
                  w-2.5
                  animate-pulse
                  rounded-full
                  bg-emerald-500
                "
              />

              LIVE

            </div>

          </div>

        </div>

        {/* ====================================================
            ORANGE ALERT CENTER
        ==================================================== */}

        <div
          className="
            relative
            overflow-hidden
            bg-gradient-to-r
            from-red-600
            via-orange-500
            to-amber-400
            px-7
            py-5
            text-white
          "
        >

          <div className="relative z-10 flex items-center justify-between">

            <div className="flex items-center gap-4">

              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-white/15
                "
              >

                <AlertTriangle size={24} />

              </div>

              <div>

                <h2 className="text-xl font-bold">
                  Metro Operations Alert Center
                </h2>

                <p className="mt-0.5 text-sm text-white/90">
                  AI-powered real-time operational monitoring
                </p>

              </div>

            </div>

            <div
              className="
                hidden
                items-center
                gap-2
                rounded-full
                bg-white/15
                px-4
                py-2
                text-sm
                font-semibold
                sm:flex
              "
            >

              <Radio size={15} />

              LIVE

            </div>

          </div>

        </div>

        {/* ====================================================
            KPI CARDS
        ==================================================== */}

        <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-3">

          {/* CRITICAL */}

          <motion.div
            whileHover={{ y: -2 }}
            className="
              rounded-2xl
              border
              border-red-200
              bg-red-50
              p-5
            "
          >

            <div className="flex items-start justify-between">

              <div>

                <div className="flex items-center gap-2">

                  <AlertTriangle
                    size={18}
                    className="text-red-600"
                  />

                  <span className="text-sm font-semibold text-red-700">
                    Critical Alerts
                  </span>

                </div>

                <h3
                  className="
                    mt-2
                    text-3xl
                    font-bold
                    text-red-700
                  "
                >
                  {criticalAlerts}
                </h3>

                <p className="mt-1 text-xs text-red-600">
                  {criticalAlerts > 0
                    ? "Stations require immediate action"
                    : "No critical alerts detected"}
                </p>

              </div>

            </div>

          </motion.div>

          {/* WARNING */}

          <motion.div
            whileHover={{ y: -2 }}
            className="
              rounded-2xl
              border
              border-amber-200
              bg-amber-50
              p-5
            "
          >

            <div className="flex items-start justify-between">

              <div>

                <div className="flex items-center gap-2">

                  <AlertTriangle
                    size={18}
                    className="text-amber-600"
                  />

                  <span className="text-sm font-semibold text-amber-700">
                    Warning
                  </span>

                </div>

                <h3
                  className="
                    mt-2
                    text-3xl
                    font-bold
                    text-amber-700
                  "
                >
                  {warningAlerts}
                </h3>

                <p className="mt-1 text-xs text-amber-600">
                  {warningAlerts > 0
                    ? "Stations under observation"
                    : "No warning conditions detected"}
                </p>

              </div>

            </div>

          </motion.div>

          {/* NETWORK HEALTH */}

          <motion.div
            whileHover={{ y: -2 }}
            className="
              rounded-2xl
              border
              border-emerald-200
              bg-emerald-50
              p-5
            "
          >

            <div className="flex items-start justify-between">

              <div>

                <div className="flex items-center gap-2">

                  <ShieldCheck
                    size={18}
                    className="text-emerald-600"
                  />

                  <span className="text-sm font-semibold text-emerald-700">
                    Network Health
                  </span>

                </div>

                <h3
                  className={`
                    mt-2
                    text-3xl
                    font-bold
                    ${
                      networkHealth >= 90
                        ? "text-emerald-700"
                        : networkHealth >= 75
                        ? "text-amber-600"
                        : "text-red-600"
                    }
                  `}
                >
                  {networkHealth}%
                </h3>

                <p className="mt-1 text-xs text-emerald-700">
                  All systems operational
                </p>

              </div>

            </div>

          </motion.div>

        </div>

        {/* ====================================================
            LAST UPDATED
        ==================================================== */}

        <div
          className="
            mx-5
            border-t
            border-slate-200
            py-4
          "
        >

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-2 text-sm text-slate-500">

              <Clock
                size={17}
                className="text-slate-500"
              />

              <span>
                Last Updated:
              </span>

              <span className="font-semibold text-slate-700">
                {lastUpdated || "Just now"}
              </span>

            </div>

            <div className="flex items-center gap-2">

              <span
                className="
                  h-2.5
                  w-2.5
                  animate-pulse
                  rounded-full
                  bg-emerald-500
                "
              />

              <span className="text-sm font-semibold text-emerald-700">
                AI Monitoring Active
              </span>

            </div>

          </div>

        </div>

      </motion.section>

      {/* ======================================================
          LIVE TREND STRIP
      ====================================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.4,
          delay: 0.1,
        }}
        className="
          relative
          h-28
          overflow-hidden
          rounded-2xl
          bg-[#252932]
          shadow-lg
        "
      >

        {/* GRID */}

        <div
          className="
            absolute
            inset-0
            opacity-10
            [background-image:linear-gradient(rgba(255,255,255,.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.15)_1px,transparent_1px)]
            [background-size:40px_40px]
          "
        />

        {/* TREND LINE */}

        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1000 120"
          preserveAspectRatio="none"
        >

          <path
            d="
              M0 78
              C80 76 110 75 160 76
              C220 78 260 77 320 76
              C390 75 430 78 490 75
              C560 72 600 70 660 68
              C730 65 770 64 830 61
              C900 59 940 58 1000 57
            "
            fill="none"
            stroke="rgba(139,92,246,0.95)"
            strokeWidth="2"
          />

        </svg>

        <div className="relative z-10 flex h-full flex-col justify-between px-5 py-4">

          <span className="text-xs font-semibold text-emerald-400">
            ↗ +4.8%
          </span>

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-2 text-xs text-slate-500">

              <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />

              Live

            </div>

            <Radio
              size={13}
              className="text-slate-600"
            />

          </div>

        </div>

      </motion.div>

      {/* ======================================================
          DATA SUMMARY FOR LOWER COMPONENTS
      ====================================================== */}

      <div
        className="
          hidden
          items-center
          gap-4
          rounded-xl
          bg-slate-900
          px-5
          py-3
          text-xs
          text-white
        "
      >

        <Activity size={15} />

        <span>
          Stations: {totalStations.toLocaleString("en-IN")}
        </span>

        <span>
          Passengers: {totalPassengers.toLocaleString("en-IN")}
        </span>

        <span>
          Active Alerts: {activeAlerts}
        </span>

        <span>
          AI Status: Active
        </span>

      </div>

    </div>
  );
}

export default LiveNetworkHeader;