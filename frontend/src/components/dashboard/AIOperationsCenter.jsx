import { motion } from "framer-motion";
import {
  Brain,
  Activity,
  AlertTriangle,
  ShieldCheck,
  TrendingUp,
  Clock,
} from "lucide-react";

function AIOperationsCenter({
  summary,
  busiestStations,
  recentAlerts,
  latestPrediction,
  lastUpdated,
}) {
  // ==========================
  // Network Calculations
  // ==========================

  const totalStations = summary?.total_stations || 0;

  const criticalAlerts = recentAlerts.filter(
    (alert) => alert.severity === "Critical"
  ).length;

  const warningAlerts = recentAlerts.filter(
    (alert) => alert.severity === "Warning"
  ).length;

  const healthyStations =
    totalStations - criticalAlerts - warningAlerts;

  const networkHealth =
    criticalAlerts > 2
      ? "Critical"
      : warningAlerts > 3
      ? "Warning"
      : "Healthy";

  const healthColor =
    networkHealth === "Critical"
      ? "bg-red-500/20 text-red-400 border-red-500/30"
      : networkHealth === "Warning"
      ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      : "bg-green-500/20 text-green-400 border-green-500/30";

  const healthPercentage =
    totalStations === 0
      ? 100
      : Math.max(
          0,
          Math.round(
            (healthyStations / totalStations) * 100
          )
        );

  const topStation =
    busiestStations.length > 0
      ? busiestStations[0]
      : null;

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 25,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.45,
      }}
      className="
        mb-8
        rounded-[32px]
        border
        border-slate-200
        bg-white
        p-8
        shadow-xl
      "
    >
      {/* ==========================
          Header
      ========================== */}

      <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">

        <div className="flex items-center gap-5">

          <div
            className="
              rounded-3xl
              bg-gradient-to-br
              from-indigo-600
              to-violet-600
              p-5
              shadow-lg
            "
          >
            <Brain
              size={38}
              className="text-white"
            />
          </div>

          <div>

            <h2 className="text-3xl font-bold text-slate-900">
              AI Operations Center
            </h2>

            <p className="mt-2 text-slate-500">
              Real-time metro intelligence,
              prediction and operational monitoring
            </p>

          </div>

        </div>

        <div className="flex flex-wrap items-center gap-4">

          <div
            className={`
              rounded-full
              border
              px-5
              py-3
              text-sm
              font-bold
              ${healthColor}
            `}
          >
            {networkHealth} Network
          </div>

          <div
            className="
              flex
              items-center
              gap-2
              rounded-full
              bg-slate-100
              px-5
              py-3
            "
          >
            <Clock
              size={16}
              className="text-indigo-600"
            />

            <span className="text-sm font-medium text-slate-700">
              {lastUpdated?.toLocaleTimeString()}
            </span>

          </div>

        </div>

      </div>

      {/* Divider */}

      <div className="my-8 h-px bg-slate-200" />
            {/* ==========================
          Live KPI Cards
      ========================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        {/* Network Health */}

        <motion.div
          whileHover={{
            y: -5,
          }}
          className="
            rounded-3xl
            border
            border-slate-200
            bg-gradient-to-br
            from-green-50
            to-emerald-50
            p-6
            shadow-sm
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 font-medium">
                Network Health
              </p>

              <h2 className="mt-3 text-4xl font-bold text-slate-900">
                {healthPercentage}%
              </h2>

            </div>

            <div className="rounded-2xl bg-green-100 p-4">

              <ShieldCheck
                size={34}
                className="text-green-600"
              />

            </div>

          </div>

          <div className="mt-6">

            <div className="flex justify-between text-sm text-slate-500 mb-2">

              <span>Operational Status</span>

              <span>{networkHealth}</span>

            </div>

            <div className="h-3 overflow-hidden rounded-full bg-slate-200">

              <motion.div
                initial={{
                  width: 0,
                }}
                animate={{
                  width: `${healthPercentage}%`,
                }}
                transition={{
                  duration: 1,
                }}
                className="
                  h-full
                  rounded-full
                  bg-gradient-to-r
                  from-green-500
                  to-emerald-500
                "
              />

            </div>

          </div>

        </motion.div>

        {/* Active Alerts */}

        <motion.div
          whileHover={{
            y: -5,
          }}
          className="
            rounded-3xl
            border
            border-slate-200
            bg-gradient-to-br
            from-red-50
            to-orange-50
            p-6
            shadow-sm
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 font-medium">
                Active Alerts
              </p>

              <h2 className="mt-3 text-4xl font-bold text-slate-900">
                {recentAlerts.length}
              </h2>

            </div>

            <div className="rounded-2xl bg-red-100 p-4">

              <AlertTriangle
                size={34}
                className="text-red-600"
              />

            </div>

          </div>

          <div className="mt-6 flex justify-between">

            <div>

              <p className="text-xs text-slate-500">
                Critical
              </p>

              <h3 className="text-xl font-bold text-red-600">
                {criticalAlerts}
              </h3>

            </div>

            <div>

              <p className="text-xs text-slate-500">
                Warning
              </p>

              <h3 className="text-xl font-bold text-yellow-600">
                {warningAlerts}
              </h3>

            </div>

          </div>

        </motion.div>

        {/* AI Prediction */}

        <motion.div
          whileHover={{
            y: -5,
          }}
          className="
            rounded-3xl
            border
            border-slate-200
            bg-gradient-to-br
            from-indigo-50
            to-violet-50
            p-6
            shadow-sm
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 font-medium">
                AI Prediction
              </p>

              <h2 className="mt-3 text-4xl font-bold text-slate-900">

                {latestPrediction
                  ? latestPrediction.predicted_passengers.toLocaleString()
                  : "--"}

              </h2>

            </div>

            <div className="rounded-2xl bg-indigo-100 p-4">

              <Brain
                size={34}
                className="text-indigo-600"
              />

            </div>

          </div>

          <p className="mt-6 text-sm text-slate-600">

            {latestPrediction
              ? `${latestPrediction.from_station} → ${latestPrediction.to_station}`
              : "Waiting for prediction..."}

          </p>

        </motion.div>

        {/* Busiest Station */}

        <motion.div
          whileHover={{
            y: -5,
          }}
          className="
            rounded-3xl
            border
            border-slate-200
            bg-gradient-to-br
            from-cyan-50
            to-sky-50
            p-6
            shadow-sm
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 font-medium">
                Busiest Station
              </p>

              <h2 className="mt-3 text-2xl font-bold text-slate-900">

                {topStation
                  ? topStation.station
                  : "--"}

              </h2>

            </div>

            <div className="rounded-2xl bg-cyan-100 p-4">

              <Activity
                size={34}
                className="text-cyan-600"
              />

            </div>

          </div>

          <p className="mt-6 text-sm text-slate-600">

            {topStation
              ? `${topStation.passengers.toLocaleString()} passengers`
              : "No station data"}

          </p>

        </motion.div>

      </div>

      {/* Divider */}

      <div className="my-8 h-px bg-slate-200" />
            {/* ==========================
          Bottom Section
      ========================== */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

        {/* Top Stations */}

        <div
          className="
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-7
            shadow-lg
          "
        >

          <div className="flex items-center justify-between">

            <h2 className="text-2xl font-bold text-slate-900">
              🏆 Top Busiest Stations
            </h2>

            <span className="rounded-full bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-700">
              LIVE
            </span>

          </div>

          <div className="mt-7 space-y-5">

            {busiestStations.length === 0 ? (

              <div className="rounded-2xl border border-dashed border-slate-300 py-10 text-center text-slate-500">
                No station data available.
              </div>

            ) : (

              busiestStations.slice(0, 5).map((station, index) => {

                const occupancy = Math.min(
                  Math.round((station.passengers / 320000) * 100),
                  100
                );

                return (

                  <motion.div
                    key={index}
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: index * 0.08,
                    }}
                    className="
                      rounded-2xl
                      border
                      border-slate-200
                      p-5
                    "
                  >

                    <div className="flex justify-between">

                      <div>

                        <h3 className="font-bold text-lg text-slate-900">
                          {station.station}
                        </h3>

                        <p className="mt-1 text-slate-500">
                          {station.passengers.toLocaleString()} passengers
                        </p>

                      </div>

                      <div className="text-right">

                        <div className="text-xl font-bold text-indigo-600">
                          {occupancy}%
                        </div>

                        <div className="text-xs text-slate-500">
                          Occupancy
                        </div>

                      </div>

                    </div>

                    <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200">

                      <motion.div
                        initial={{
                          width: 0,
                        }}
                        animate={{
                          width: `${occupancy}%`,
                        }}
                        transition={{
                          duration: 1,
                        }}
                        className="
                          h-full
                          rounded-full
                          bg-gradient-to-r
                          from-indigo-500
                          to-violet-600
                        "
                      />

                    </div>

                  </motion.div>

                );

              })

            )}

          </div>

        </div>

        {/* AI Status */}

        <div
          className="
            rounded-3xl
            border
            border-slate-200
            bg-gradient-to-br
            from-slate-900
            via-slate-800
            to-slate-900
            p-7
            text-white
            shadow-xl
          "
        >

          <div className="flex items-center gap-3">

            <Activity className="text-green-400" />

            <h2 className="text-2xl font-bold">
              AI System Status
            </h2>

          </div>

          <div className="mt-8 space-y-5">

            <div className="flex items-center justify-between">

              <span>Prediction Engine</span>

              <span className="rounded-full bg-green-500/20 px-4 py-2 text-green-400">
                Online
              </span>

            </div>

            <div className="flex items-center justify-between">

              <span>Alert Monitoring</span>

              <span className="rounded-full bg-green-500/20 px-4 py-2 text-green-400">
                Active
              </span>

            </div>

            <div className="flex items-center justify-between">

              <span>Passenger Analytics</span>

              <span className="rounded-full bg-green-500/20 px-4 py-2 text-green-400">
                Running
              </span>

            </div>

            <div className="flex items-center justify-between">

              <span>Data Synchronization</span>

              <span className="rounded-full bg-green-500/20 px-4 py-2 text-green-400">
                Healthy
              </span>

            </div>

          </div>

          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">

            <div className="flex items-center gap-3">

              <span className="h-3 w-3 rounded-full bg-green-400 animate-pulse"></span>

              <p className="font-semibold">
                MetroFlow AI is actively monitoring the network.
              </p>

            </div>

            <p className="mt-4 text-sm leading-7 text-slate-300">

              The AI engine continuously analyzes passenger movement,
              congestion, revenue trends, and operational alerts to
              support real-time decision making for metro operators.

            </p>

          </div>

        </div>

      </div>

    </motion.section>
  );
}

export default AIOperationsCenter;