import { motion } from "framer-motion";
import {
  Activity,
  Users,
  AlertTriangle,
  ShieldCheck,
  Clock,
} from "lucide-react";

function LiveNetworkHeader({
  summary,
  recentAlerts = [],
  lastUpdated,
}) {
  const totalStations = summary?.total_stations || 0;
  const totalPassengers = summary?.total_passengers || 0;

  const activeAlerts = recentAlerts.length;

  const networkHealth =
    totalStations > 0
      ? Math.round(
          ((totalStations - activeAlerts) /
            totalStations) *
            100
        )
      : 100;

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.45,
      }}
      className="
        rounded-[32px]
        overflow-hidden
        border
        border-slate-200
        bg-gradient-to-br
        from-slate-900
        via-slate-800
        to-slate-900
        shadow-2xl
      "
    >

      {/* ==========================
          Hero Header
      ========================== */}

      <div
        className="
          relative
          overflow-hidden
          px-10
          py-10
        "
      >

        {/* Decorative Background */}

        <div className="absolute inset-0 opacity-10">

          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-cyan-400 blur-3xl" />

          <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-emerald-400 blur-3xl" />

        </div>

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <div className="flex items-center gap-3">

              <span className="h-3 w-3 rounded-full bg-green-400 animate-pulse" />

              <span className="font-medium tracking-wide text-green-300 uppercase">
                Live Monitoring
              </span>

            </div>

            <h1 className="mt-4 text-5xl font-bold text-white">

              Metro Network
              <br />
              Operations Center

            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">

              Monitor station activity, crowd density,
              operational alerts and AI insights across
              the entire metro network in real time.

            </p>

          </div>

          <div
            className="
              rounded-3xl
              border
              border-white/10
              bg-white/5
              p-6
              backdrop-blur-xl
            "
          >

            <div className="flex items-center gap-3">

              <Clock
                size={20}
                className="text-cyan-300"
              />

              <span className="text-slate-300">

                Last Updated

              </span>

            </div>

            <h2 className="mt-3 text-3xl font-bold text-white">

              {lastUpdated || "Just now"}

            </h2>

          </div>

        </div>

      </div>

      <div className="border-t border-white/10" />
            {/* ==========================
          Live KPI Cards
      ========================== */}

      <div className="grid grid-cols-1 gap-6 p-8 md:grid-cols-2 xl:grid-cols-4">

        {/* Total Stations */}

        <motion.div
          whileHover={{
            y: -6,
          }}
          className="
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-7
            shadow-sm
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500">
                Total Stations
              </p>

              <h2 className="mt-3 text-5xl font-bold text-slate-900">
                {totalStations}
              </h2>

            </div>

            <div
              className="
                rounded-2xl
                bg-cyan-100
                p-4
              "
            >

              <Activity
                size={34}
                className="text-cyan-600"
              />

            </div>

          </div>

          <p className="mt-6 text-slate-500">
            Connected to the metro network
          </p>

        </motion.div>

        {/* Active Passengers */}

        <motion.div
          whileHover={{
            y: -6,
          }}
          className="
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-7
            shadow-sm
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500">
                Active Passengers
              </p>

              <h2 className="mt-3 text-5xl font-bold text-indigo-600">

                {totalPassengers.toLocaleString()}

              </h2>

            </div>

            <div
              className="
                rounded-2xl
                bg-indigo-100
                p-4
              "
            >

              <Users
                size={34}
                className="text-indigo-600"
              />

            </div>

          </div>

          <p className="mt-6 text-slate-500">
            Current monitored passenger flow
          </p>

        </motion.div>

        {/* Active Alerts */}

        <motion.div
          whileHover={{
            y: -6,
          }}
          className="
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-7
            shadow-sm
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500">
                Active Alerts
              </p>

              <h2
                className={`mt-3 text-5xl font-bold ${
                  activeAlerts > 0
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >

                {activeAlerts}

              </h2>

            </div>

            <div
              className={`
                rounded-2xl
                p-4
                ${
                  activeAlerts > 0
                    ? "bg-red-100"
                    : "bg-green-100"
                }
              `}
            >

              <AlertTriangle
                size={34}
                className={
                  activeAlerts > 0
                    ? "text-red-600"
                    : "text-green-600"
                }
              />

            </div>

          </div>

          <p className="mt-6 text-slate-500">

            {activeAlerts > 0
              ? "Stations requiring attention"
              : "No active operational alerts"}

          </p>

        </motion.div>

        {/* Network Health */}

        <motion.div
          whileHover={{
            y: -6,
          }}
          className="
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-7
            shadow-sm
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500">
                Network Health
              </p>

              <h2
                className={`mt-3 text-5xl font-bold ${
                  networkHealth >= 90
                    ? "text-emerald-600"
                    : networkHealth >= 75
                    ? "text-amber-500"
                    : "text-red-600"
                }`}
              >

                {networkHealth}%

              </h2>

            </div>

            <div
              className="
                rounded-2xl
                bg-emerald-100
                p-4
              "
            >

              <ShieldCheck
                size={34}
                className="text-emerald-600"
              />

            </div>

          </div>

          <p className="mt-6 text-slate-500">
            Overall operational availability
          </p>

        </motion.div>

      </div>

      <div className="border-t border-slate-200" />
            {/* ==========================
          Live KPI Cards
      ========================== */}

      <div className="grid grid-cols-1 gap-6 p-8 md:grid-cols-2 xl:grid-cols-4">

        {/* Total Stations */}

        <motion.div
          whileHover={{
            y: -6,
          }}
          className="
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-7
            shadow-sm
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500">
                Total Stations
              </p>

              <h2 className="mt-3 text-5xl font-bold text-slate-900">
                {totalStations}
              </h2>

            </div>

            <div
              className="
                rounded-2xl
                bg-cyan-100
                p-4
              "
            >

              <Activity
                size={34}
                className="text-cyan-600"
              />

            </div>

          </div>

          <p className="mt-6 text-slate-500">
            Connected to the metro network
          </p>

        </motion.div>

        {/* Active Passengers */}

        <motion.div
          whileHover={{
            y: -6,
          }}
          className="
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-7
            shadow-sm
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500">
                Active Passengers
              </p>

              <h2 className="mt-3 text-5xl font-bold text-indigo-600">

                {totalPassengers.toLocaleString()}

              </h2>

            </div>

            <div
              className="
                rounded-2xl
                bg-indigo-100
                p-4
              "
            >

              <Users
                size={34}
                className="text-indigo-600"
              />

            </div>

          </div>

          <p className="mt-6 text-slate-500">
            Current monitored passenger flow
          </p>

        </motion.div>

        {/* Active Alerts */}

        <motion.div
          whileHover={{
            y: -6,
          }}
          className="
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-7
            shadow-sm
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500">
                Active Alerts
              </p>

              <h2
                className={`mt-3 text-5xl font-bold ${
                  activeAlerts > 0
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >

                {activeAlerts}

              </h2>

            </div>

            <div
              className={`
                rounded-2xl
                p-4
                ${
                  activeAlerts > 0
                    ? "bg-red-100"
                    : "bg-green-100"
                }
              `}
            >

              <AlertTriangle
                size={34}
                className={
                  activeAlerts > 0
                    ? "text-red-600"
                    : "text-green-600"
                }
              />

            </div>

          </div>

          <p className="mt-6 text-slate-500">

            {activeAlerts > 0
              ? "Stations requiring attention"
              : "No active operational alerts"}

          </p>

        </motion.div>

        {/* Network Health */}

        <motion.div
          whileHover={{
            y: -6,
          }}
          className="
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-7
            shadow-sm
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500">
                Network Health
              </p>

              <h2
                className={`mt-3 text-5xl font-bold ${
                  networkHealth >= 90
                    ? "text-emerald-600"
                    : networkHealth >= 75
                    ? "text-amber-500"
                    : "text-red-600"
                }`}
              >

                {networkHealth}%

              </h2>

            </div>

            <div
              className="
                rounded-2xl
                bg-emerald-100
                p-4
              "
            >

              <ShieldCheck
                size={34}
                className="text-emerald-600"
              />

            </div>

          </div>

          <p className="mt-6 text-slate-500">
            Overall operational availability
          </p>

        </motion.div>

      </div>

      <div className="border-t border-slate-200" />
          {/* ==========================
          Live Status & AI Recommendation
      ========================== */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 p-8">

        {/* Live System Status */}

        <div
          className="
            rounded-3xl
            bg-gradient-to-br
            from-slate-900
            via-slate-800
            to-slate-900
            p-8
            text-white
            shadow-xl
          "
        >

          <div className="flex items-center gap-3">

            <span className="h-3 w-3 rounded-full bg-green-400 animate-pulse" />

            <h2 className="text-2xl font-bold">
              Live System Status
            </h2>

          </div>

          <div className="mt-8 space-y-6">

            <div className="flex items-center justify-between">

              <span className="text-slate-300">
                Metro Network
              </span>

              <span className="font-semibold text-green-400">
                Online
              </span>

            </div>

            <div className="flex items-center justify-between">

              <span className="text-slate-300">
                Crowd Monitoring
              </span>

              <span className="font-semibold text-green-400">
                Active
              </span>

            </div>

            <div className="flex items-center justify-between">

              <span className="text-slate-300">
                AI Prediction Engine
              </span>

              <span className="font-semibold text-green-400">
                Running
              </span>

            </div>

            <div className="flex items-center justify-between">

              <span className="text-slate-300">
                Alert Monitoring
              </span>

              <span
                className={`font-semibold ${
                  activeAlerts > 0
                    ? "text-yellow-400"
                    : "text-green-400"
                }`}
              >
                {activeAlerts > 0
                  ? "Monitoring"
                  : "Normal"}
              </span>

            </div>

            <div className="flex items-center justify-between">

              <span className="text-slate-300">
                Network Availability
              </span>

              <span className="font-semibold text-cyan-300">
                {networkHealth}%
              </span>

            </div>

          </div>

          <div
            className="
              mt-8
              rounded-2xl
              border
              border-white/10
              bg-white/5
              p-6
            "
          >

            <p className="leading-8 text-slate-300">

              MetroFlow continuously receives operational data from
              connected stations and updates crowd analytics, alerts,
              and AI predictions in real time to support faster
              operational decision-making.

            </p>

          </div>

        </div>

        {/* AI Recommendation */}

        <div
          className="
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-8
            shadow-lg
          "
        >

          <h2 className="text-2xl font-bold text-slate-900">
            AI Recommendation
          </h2>

          <p className="mt-2 text-slate-500">
            Live operational guidance
          </p>

          <div className="mt-8 rounded-2xl bg-slate-50 p-6">

            <p className="leading-8 text-slate-700">

              {activeAlerts === 0
                ? "No critical congestion events detected. Continue normal metro operations while maintaining automated monitoring across all stations."
                : activeAlerts <= 3
                ? "A small number of stations require observation. Continue monitoring crowd density and prepare additional services if passenger demand increases."
                : "Multiple operational alerts are active. Dispatch additional personnel, increase train frequency where necessary, and prioritize high-congestion stations."}

            </p>

          </div>

          <div className="mt-8 flex flex-wrap gap-3">

            <span className="rounded-full bg-emerald-100 px-4 py-2 font-medium text-emerald-700">
              AI Enabled
            </span>

            <span className="rounded-full bg-cyan-100 px-4 py-2 font-medium text-cyan-700">
              Live Monitoring
            </span>

            <span className="rounded-full bg-indigo-100 px-4 py-2 font-medium text-indigo-700">
              Smart Analytics
            </span>

          </div>

        </div>

      </div>

    </motion.section>
  );
}

export default LiveNetworkHeader;