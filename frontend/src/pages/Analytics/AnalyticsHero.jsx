import { motion } from "framer-motion";

import {
  BarChart3,
  Activity,
  Brain,
  TrendingUp,
  CalendarDays,
} from "lucide-react";

function AnalyticsHero({
  summary,
  lastUpdated,
}) {

  return (

    <section
      className="
        relative
        overflow-hidden
        rounded-[34px]
        border
        border-slate-200
        bg-gradient-to-br
        from-white
        via-slate-50
        to-indigo-50
        p-8
        shadow-sm
      "
    >

      {/* Background Glow */}

      <div
        className="
          absolute
          -right-24
          -top-24
          h-72
          w-72
          rounded-full
          bg-indigo-300/20
          blur-3xl
        "
      />

      <div
        className="
          absolute
          -left-20
          -bottom-20
          h-72
          w-72
          rounded-full
          bg-cyan-300/20
          blur-3xl
        "
      />

      <div className="relative z-10">

        <div
          className="
            flex
            flex-col
            gap-8
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >

          {/* Left */}

          <div>

            <motion.div
              initial={{
                opacity: 0,
                y: -20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.6,
              }}
              className="
                inline-flex
                items-center
                gap-3
                rounded-full
                bg-indigo-100
                px-5
                py-2
              "
            >

              <BarChart3
                size={18}
                className="text-indigo-600"
              />

              <span
                className="
                  text-sm
                  font-semibold
                  text-indigo-700
                "
              >
                Metro Analytics Center
              </span>

            </motion.div>

            <h1
              className="
                mt-6
                text-5xl
                font-black
                tracking-tight
                text-slate-900
              "
            >
              Network Analytics
            </h1>

            <p
              className="
                mt-5
                max-w-3xl
                text-lg
                leading-8
                text-slate-600
              "
            >
              Analyze passenger movement,
              operational efficiency,
              revenue trends,
              AI forecasts,
              and metro network performance
              from one unified analytics center.
            </p>

          </div>

          {/* Right */}

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              delay: 0.2,
            }}
            className="
              rounded-3xl
              border
              border-indigo-200
              bg-white/80
              p-7
              shadow-lg
              backdrop-blur-xl
            "
          >
                        <div className="grid grid-cols-2 gap-5">

              {/* Total Passengers */}

              <div className="rounded-2xl bg-slate-50 p-5">

                <div className="flex items-center gap-3">

                  <div className="rounded-xl bg-cyan-100 p-3">

                    <Activity
                      size={22}
                      className="text-cyan-600"
                    />

                  </div>

                  <div>

                    <p className="text-sm text-slate-500">
                      Passengers
                    </p>

                    <h3 className="mt-1 text-2xl font-bold text-slate-900">
                      {summary?.total_passengers?.toLocaleString() || 0}
                    </h3>

                  </div>

                </div>

              </div>

              {/* Revenue */}

              <div className="rounded-2xl bg-slate-50 p-5">

                <div className="flex items-center gap-3">

                  <div className="rounded-xl bg-emerald-100 p-3">

                    <TrendingUp
                      size={22}
                      className="text-emerald-600"
                    />

                  </div>

                  <div>

                    <p className="text-sm text-slate-500">
                      Revenue
                    </p>

                    <h3 className="mt-1 text-2xl font-bold text-slate-900">
                      ₹ {summary?.total_revenue?.toLocaleString() || 0}
                    </h3>

                  </div>

                </div>

              </div>

              {/* AI Engine */}

              <div className="rounded-2xl bg-slate-50 p-5">

                <div className="flex items-center gap-3">

                  <div className="rounded-xl bg-violet-100 p-3">

                    <Brain
                      size={22}
                      className="text-violet-600"
                    />

                  </div>

                  <div>

                    <p className="text-sm text-slate-500">
                      AI Engine
                    </p>

                    <h3 className="mt-1 text-xl font-bold text-emerald-600">
                      ONLINE
                    </h3>

                  </div>

                </div>

              </div>

              {/* Last Updated */}

              <div className="rounded-2xl bg-slate-50 p-5">

                <div className="flex items-center gap-3">

                  <div className="rounded-xl bg-amber-100 p-3">

                    <CalendarDays
                      size={22}
                      className="text-amber-600"
                    />

                  </div>

                  <div>

                    <p className="text-sm text-slate-500">
                      Last Updated
                    </p>

                    <h3 className="mt-1 text-lg font-bold text-slate-900">
                      {lastUpdated
                        ? new Date(lastUpdated).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "--:--"}
                    </h3>

                  </div>

                </div>

              </div>

            </div>

          </motion.div>

        </div>
                {/* Analytics Overview */}

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.35,
          }}
          className="
            mt-10
            grid
            gap-6
            lg:grid-cols-2
          "
        >

          {/* Executive Insight */}

          <div
            className="
              rounded-3xl
              border
              border-slate-200
              bg-white/70
              p-7
              backdrop-blur-xl
            "
          >

            <div className="flex items-center gap-3">

              <div className="rounded-xl bg-indigo-100 p-3">

                <Brain
                  className="text-indigo-600"
                  size={22}
                />

              </div>

              <div>

                <h2 className="text-xl font-bold text-slate-900">
                  AI Executive Insight
                </h2>

                <p className="text-sm text-slate-500">
                  Real-time analysis of metro operations
                </p>

              </div>

            </div>

            <div className="mt-6 space-y-4">

              <div className="rounded-2xl bg-indigo-50 p-5">

                <p className="text-sm leading-7 text-slate-700">

                  Passenger movement remains stable across
                  the network with predictable demand.
                  Revenue trends indicate consistent ticket
                  sales while the AI engine continues to
                  optimize congestion and scheduling in
                  real time.

                </p>

              </div>

              <div className="grid grid-cols-2 gap-4">

                <div className="rounded-xl bg-slate-50 p-4">

                  <p className="text-sm text-slate-500">
                    Network Health
                  </p>

                  <h3 className="mt-2 text-2xl font-bold text-emerald-600">
                    98.6%
                  </h3>

                </div>

                <div className="rounded-xl bg-slate-50 p-4">

                  <p className="text-sm text-slate-500">
                    AI Accuracy
                  </p>

                  <h3 className="mt-2 text-2xl font-bold text-indigo-600">
                    96.4%
                  </h3>

                </div>

              </div>

            </div>

          </div>

          {/* Network Performance */}

          <div
            className="
              rounded-3xl
              border
              border-slate-200
              bg-white/70
              p-7
              backdrop-blur-xl
            "
          >

            <div className="flex items-center gap-3">

              <div className="rounded-xl bg-emerald-100 p-3">

                <TrendingUp
                  size={22}
                  className="text-emerald-600"
                />

              </div>

              <div>

                <h2 className="text-xl font-bold text-slate-900">
                  Network Performance
                </h2>

                <p className="text-sm text-slate-500">
                  Key operational indicators
                </p>

              </div>

            </div>

            <div className="mt-8 space-y-6">

              {/* Operational Efficiency */}

              <div>

                <div className="mb-2 flex items-center justify-between">

                  <span className="text-sm font-medium text-slate-600">
                    Operational Efficiency
                  </span>

                  <span className="text-sm font-semibold text-slate-800">
                    94%
                  </span>

                </div>

                <div className="h-3 overflow-hidden rounded-full bg-slate-200">

                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "94%" }}
                    transition={{ duration: 1 }}
                    className="h-full rounded-full bg-emerald-500"
                  />

                </div>

              </div>

              {/* Passenger Satisfaction */}

              <div>

                <div className="mb-2 flex items-center justify-between">

                  <span className="text-sm font-medium text-slate-600">
                    Passenger Satisfaction
                  </span>

                  <span className="text-sm font-semibold text-slate-800">
                    91%
                  </span>

                </div>

                <div className="h-3 overflow-hidden rounded-full bg-slate-200">

                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "91%" }}
                    transition={{
                      delay: 0.2,
                      duration: 1,
                    }}
                    className="h-full rounded-full bg-cyan-500"
                  />

                </div>

              </div>

              {/* AI Prediction Confidence */}

              <div>

                <div className="mb-2 flex items-center justify-between">

                  <span className="text-sm font-medium text-slate-600">
                    AI Prediction Confidence
                  </span>

                  <span className="text-sm font-semibold text-slate-800">
                    97%
                  </span>

                </div>

                <div className="h-3 overflow-hidden rounded-full bg-slate-200">

                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "97%" }}
                    transition={{
                      delay: 0.4,
                      duration: 1,
                    }}
                    className="h-full rounded-full bg-indigo-500"
                  />

                </div>

              </div>

            </div>

          </div>

        </motion.div>
                  {/* Bottom Status Bar */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.6,
          }}
          className="
            mt-10
            flex
            flex-col
            gap-5
            rounded-3xl
            border
            border-slate-200
            bg-white/70
            p-6
            backdrop-blur-xl
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >

          <div className="flex flex-wrap items-center gap-6">

            <div className="flex items-center gap-3">

              <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />

              <div>

                <p className="text-sm font-semibold text-slate-900">
                  AI Analytics Engine
                </p>

                <p className="text-xs text-slate-500">
                  Running Normally
                </p>

              </div>

            </div>

            <div className="flex items-center gap-3">

              <span className="h-3 w-3 rounded-full bg-cyan-500" />

              <div>

                <p className="text-sm font-semibold text-slate-900">
                  Data Pipeline
                </p>

                <p className="text-xs text-slate-500">
                  Live Synchronization
                </p>

              </div>

            </div>

            <div className="flex items-center gap-3">

              <span className="h-3 w-3 rounded-full bg-violet-500" />

              <div>

                <p className="text-sm font-semibold text-slate-900">
                  Prediction Models
                </p>

                <p className="text-xs text-slate-500">
                  Continuously Learning
                </p>

              </div>

            </div>

          </div>

          <div
            className="
              rounded-2xl
              bg-gradient-to-r
              from-indigo-600
              to-cyan-600
              px-6
              py-4
              text-white
              shadow-lg
            "
          >

            <p className="text-xs uppercase tracking-widest text-indigo-100">
              Overall Network Score
            </p>

            <h2 className="mt-1 text-3xl font-black">
              96.8%
            </h2>

          </div>

        </motion.div>

      </div>

    </section>

  );

}

export default AnalyticsHero;