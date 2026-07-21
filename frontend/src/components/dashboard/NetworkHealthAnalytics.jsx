import { motion } from "framer-motion";
import {
  Activity,
  Server,
  ShieldCheck,
  Brain,
  AlertTriangle,
} from "lucide-react";

function NetworkHealthAnalytics({
  summary,
  recentAlerts = [],
  lastUpdated,
}) {
  const totalStations = summary?.total_stations || 0;

  const activeAlerts = recentAlerts.length;

  const healthyStations = Math.max(
    totalStations - activeAlerts,
    0
  );

  const healthScore =
    totalStations > 0
      ? Math.round(
          (healthyStations / totalStations) * 100
        )
      : 100;

  const apiStatus = "Operational";
  const aiStatus = "Online";

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="
        rounded-[32px]
        border
        border-slate-200
        bg-white
        p-8
        shadow-xl
      "
    >

      {/* Header */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex items-center gap-5">

          <div
            className="
              rounded-2xl
              bg-gradient-to-br
              from-emerald-500
              to-teal-600
              p-4
            "
          >

            <ShieldCheck
              size={34}
              className="text-white"
            />

          </div>

          <div>

            <h2 className="text-3xl font-bold text-slate-900">
              Network Health Analytics
            </h2>

            <p className="mt-2 text-slate-500">
              Real-time operational health monitoring
            </p>

          </div>

        </div>

        <div
          className="
            rounded-2xl
            bg-emerald-50
            px-6
            py-4
          "
        >

          <p className="text-sm text-slate-500">
            Network Health
          </p>

          <h2 className="mt-1 text-3xl font-bold text-emerald-600">
            {healthScore}%
          </h2>

        </div>

      </div>

      <div className="my-8 h-px bg-slate-200" />
            {/* ==========================
          Health Overview Cards
      ========================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        {/* Network Health */}

        <motion.div
          whileHover={{ y: -5 }}
          className="
            rounded-3xl
            border
            border-slate-200
            bg-gradient-to-br
            from-emerald-50
            to-green-50
            p-7
            shadow-sm
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500">
                Network Health
              </p>

              <h2 className="mt-3 text-5xl font-bold text-emerald-600">
                {healthScore}%
              </h2>

            </div>

            <div className="rounded-2xl bg-emerald-100 p-4">

              <ShieldCheck
                size={34}
                className="text-emerald-600"
              />

            </div>

          </div>

          <p className="mt-6 text-slate-600">
            Overall operational efficiency
          </p>

        </motion.div>

        {/* Station Availability */}

        <motion.div
          whileHover={{ y: -5 }}
          className="
            rounded-3xl
            border
            border-slate-200
            bg-gradient-to-br
            from-blue-50
            to-cyan-50
            p-7
            shadow-sm
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500">
                Healthy Stations
              </p>

              <h2 className="mt-3 text-5xl font-bold text-cyan-600">
                {healthyStations}
              </h2>

            </div>

            <div className="rounded-2xl bg-cyan-100 p-4">

              <Activity
                size={34}
                className="text-cyan-600"
              />

            </div>

          </div>

          <p className="mt-6 text-slate-600">
            Out of {totalStations} stations
          </p>

        </motion.div>

        {/* Backend API */}

        <motion.div
          whileHover={{ y: -5 }}
          className="
            rounded-3xl
            border
            border-slate-200
            bg-gradient-to-br
            from-indigo-50
            to-violet-50
            p-7
            shadow-sm
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500">
                Backend API
              </p>

              <h2 className="mt-3 text-3xl font-bold text-indigo-600">
                {apiStatus}
              </h2>

            </div>

            <div className="rounded-2xl bg-indigo-100 p-4">

              <Server
                size={34}
                className="text-indigo-600"
              />

            </div>

          </div>

          <p className="mt-6 text-slate-600">
            FastAPI services responding normally
          </p>

        </motion.div>

        {/* AI Engine */}

        <motion.div
          whileHover={{ y: -5 }}
          className="
            rounded-3xl
            border
            border-slate-200
            bg-gradient-to-br
            from-purple-50
            to-pink-50
            p-7
            shadow-sm
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500">
                AI Engine
              </p>

              <h2 className="mt-3 text-3xl font-bold text-purple-600">
                {aiStatus}
              </h2>

            </div>

            <div className="rounded-2xl bg-purple-100 p-4">

              <Brain
                size={34}
                className="text-purple-600"
              />

            </div>

          </div>

          <p className="mt-6 text-slate-600">
            Prediction services active
          </p>

        </motion.div>

      </div>

      <div className="my-8 h-px bg-slate-200" />
            {/* ==========================
          Live Operations Status
      ========================== */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

        {/* Live Monitoring */}

        <div
          className="
            rounded-3xl
            border
            border-slate-200
            bg-gradient-to-br
            from-slate-900
            via-slate-800
            to-slate-900
            p-8
            text-white
            shadow-xl
          "
        >

          <div className="flex items-center gap-4">

            <span className="h-3 w-3 rounded-full bg-green-400 animate-pulse" />

            <h2 className="text-2xl font-bold">
              Live Monitoring
            </h2>

          </div>

          <div className="mt-8 space-y-6">

            <div className="flex items-center justify-between">

              <span className="text-slate-300">
                Network Status
              </span>

              <span className="font-semibold text-green-400">
                Healthy
              </span>

            </div>

            <div className="flex items-center justify-between">

              <span className="text-slate-300">
                Backend API
              </span>

              <span className="font-semibold text-green-400">
                Operational
              </span>

            </div>

            <div className="flex items-center justify-between">

              <span className="text-slate-300">
                AI Prediction Engine
              </span>

              <span className="font-semibold text-green-400">
                Online
              </span>

            </div>

            <div className="flex items-center justify-between">

              <span className="text-slate-300">
                Alert Count
              </span>

              <span
                className={`font-semibold ${
                  activeAlerts > 0
                    ? "text-yellow-400"
                    : "text-green-400"
                }`}
              >
                {activeAlerts}
              </span>

            </div>

            <div className="flex items-center justify-between">

              <span className="text-slate-300">
                Last Refresh
              </span>

             <span className="font-semibold">
  {lastUpdated?.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }) || "Just now"}
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

              MetroFlow continuously monitors station availability,
              backend services, AI prediction pipelines, and operational
              alerts to ensure uninterrupted metro operations.

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

          <div className="flex items-center gap-4">

            <div className="rounded-2xl bg-emerald-100 p-4">

              <AlertTriangle
                size={32}
                className="text-emerald-600"
              />

            </div>

            <div>

              <h2 className="text-2xl font-bold text-slate-900">
                AI Operational Recommendation
              </h2>

              <p className="mt-2 text-slate-500">
                Automated system guidance
              </p>

            </div>

          </div>

          <div className="mt-8 rounded-2xl bg-slate-50 p-6">

            <p className="leading-8 text-slate-700">

              {activeAlerts === 0
                ? "All monitored systems are operating normally. Continue standard service scheduling and routine monitoring across the network."
                : activeAlerts <= 3
                ? "A limited number of operational alerts have been detected. Review affected stations while maintaining the current service schedule."
                : "Multiple operational alerts are active. Prioritize affected stations, investigate backend events, and consider adjusting train frequency where required."}

            </p>

          </div>

          <div className="mt-8 flex flex-wrap gap-3">

            <span className="rounded-full bg-emerald-100 px-4 py-2 text-emerald-700 font-medium">
              AI Enabled
            </span>

            <span className="rounded-full bg-blue-100 px-4 py-2 text-blue-700 font-medium">
              Live Analytics
            </span>

            <span className="rounded-full bg-purple-100 px-4 py-2 text-purple-700 font-medium">
              Real-Time Monitoring
            </span>

          </div>

        </div>

      </div>

    </motion.section>
  );
}

export default NetworkHealthAnalytics;