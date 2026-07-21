import { useMemo } from "react";

import { motion } from "framer-motion";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import {
  Train,
  Clock3,
  Gauge,
  ShieldCheck,
} from "lucide-react";

function OperationalAnalytics({

  summary = {},

  busiestStations = [],

}) {

  const operationalData = useMemo(() => {

    const maxPassengers =
      busiestStations.length > 0
        ? Math.max(
            ...busiestStations.map(
              station =>
                station.passengers ??
                station.total_passengers ??
                0
            )
          )
        : 1;

    return busiestStations
      .slice(0, 6)
      .map((station) => ({

        station:
          station.station,

        utilization:
          Math.round(
            (
              (
                station.passengers ??
                station.total_passengers ??
                0
              ) /
              maxPassengers
            ) * 100
          ),

      }));

  }, [busiestStations]);

  return (

    <section className="mt-10 space-y-6">

      <div>

        <h2
          className="
            text-3xl
            font-bold
            text-slate-900
          "
        >
          Operational Intelligence
        </h2>

        <p
          className="
            mt-2
            text-slate-600
          "
        >
          Analyze metro performance,
          operational efficiency,
          service quality,
          and AI operational recommendations.
        </p>

      </div>
            {/* Operational KPI Cards */}

      <div
        className="
          grid
          gap-6
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >

        {/* Active Trips */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-6
            shadow-sm
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500">
                Active Trips
              </p>

              <h3 className="mt-2 text-3xl font-black text-slate-900">
                {summary.total_trips?.toLocaleString() ?? "0"}
              </h3>

            </div>

            <div className="rounded-2xl bg-indigo-100 p-4">

              <Train
                size={28}
                className="text-indigo-600"
              />

            </div>

          </div>

        </motion.div>

        {/* Average Delay */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-6
            shadow-sm
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500">
                Average Delay
              </p>

              <h3 className="mt-2 text-3xl font-black text-amber-600">
                {summary.average_delay ?? "2.4"} min
              </h3>

            </div>

            <div className="rounded-2xl bg-amber-100 p-4">

              <Clock3
                size={28}
                className="text-amber-600"
              />

            </div>

          </div>

        </motion.div>

        {/* Network Efficiency */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-6
            shadow-sm
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500">
                Network Efficiency
              </p>

              <h3 className="mt-2 text-3xl font-black text-emerald-600">
                {summary.network_efficiency ?? "94"}%
              </h3>

            </div>

            <div className="rounded-2xl bg-emerald-100 p-4">

              <Gauge
                size={28}
                className="text-emerald-600"
              />

            </div>

          </div>

        </motion.div>

        {/* Service Reliability */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-6
            shadow-sm
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500">
                Service Reliability
              </p>

              <h3 className="mt-2 text-3xl font-black text-cyan-600">
                {summary.service_reliability ?? "98.7"}%
              </h3>

            </div>

            <div className="rounded-2xl bg-cyan-100 p-4">

              <ShieldCheck
                size={28}
                className="text-cyan-600"
              />

            </div>

          </div>

        </motion.div>

      </div>
            {/* Operational Performance */}

      <div
        className="
          grid
          gap-6
          xl:grid-cols-3
        "
      >

        {/* Network Utilization Chart */}

        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.2,
          }}
          className="
            xl:col-span-2
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-6
            shadow-sm
          "
        >

          <div className="mb-6">

            <h3 className="text-xl font-bold text-slate-900">
              Station Utilization
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Relative utilization of the busiest stations.
            </p>

          </div>

          <div className="h-96">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart
                data={operationalData}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#E2E8F0"
                />

                <XAxis
                  dataKey="station"
                  tick={{
                    fontSize: 11,
                  }}
                />

                <YAxis
                  unit="%"
                  tick={{
                    fontSize: 12,
                  }}
                />

                <Tooltip
                  formatter={(value) => [
                    `${value}%`,
                    "Utilization",
                  ]}
                  contentStyle={{
                    borderRadius: "16px",
                    border: "1px solid #CBD5E1",
                    backgroundColor: "#FFFFFF",
                  }}
                />

                <Bar
                  dataKey="utilization"
                  radius={[10, 10, 0, 0]}
                  fill="#4F46E5"
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </motion.div>

        {/* Operations Summary */}

        <motion.div
          initial={{
            opacity: 0,
            x: 20,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            delay: 0.3,
          }}
          className="
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-6
            shadow-sm
          "
        >

          <h3 className="text-xl font-bold text-slate-900">
            Operations Summary
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Live operational indicators.
          </p>

          <div className="mt-8 space-y-6">

            <div>

              <div className="mb-2 flex justify-between">

                <span className="text-sm text-slate-600">
                  Platform Utilization
                </span>

                <span className="font-semibold text-slate-900">
                  91%
                </span>

              </div>

              <div className="h-3 rounded-full bg-slate-200">

                <motion.div
                  initial={{
                    width: 0,
                  }}
                  animate={{
                    width: "91%",
                  }}
                  transition={{
                    duration: 1,
                  }}
                  className="
                    h-full
                    rounded-full
                    bg-indigo-500
                  "
                />

              </div>

            </div>

            <div>

              <div className="mb-2 flex justify-between">

                <span className="text-sm text-slate-600">
                  Fleet Utilization
                </span>

                <span className="font-semibold text-slate-900">
                  88%
                </span>

              </div>

              <div className="h-3 rounded-full bg-slate-200">

                <motion.div
                  initial={{
                    width: 0,
                  }}
                  animate={{
                    width: "88%",
                  }}
                  transition={{
                    delay: 0.2,
                    duration: 1,
                  }}
                  className="
                    h-full
                    rounded-full
                    bg-cyan-500
                  "
                />

              </div>

            </div>

            <div>

              <div className="mb-2 flex justify-between">

                <span className="text-sm text-slate-600">
                  Schedule Adherence
                </span>

                <span className="font-semibold text-slate-900">
                  96%
                </span>

              </div>

              <div className="h-3 rounded-full bg-slate-200">

                <motion.div
                  initial={{
                    width: 0,
                  }}
                  animate={{
                    width: "96%",
                  }}
                  transition={{
                    delay: 0.4,
                    duration: 1,
                  }}
                  className="
                    h-full
                    rounded-full
                    bg-emerald-500
                  "
                />

              </div>

            </div>

            <div>

              <div className="mb-2 flex justify-between">

                <span className="text-sm text-slate-600">
                  Safety Compliance
                </span>

                <span className="font-semibold text-slate-900">
                  99%
                </span>

              </div>

              <div className="h-3 rounded-full bg-slate-200">

                <motion.div
                  initial={{
                    width: 0,
                  }}
                  animate={{
                    width: "99%",
                  }}
                  transition={{
                    delay: 0.6,
                    duration: 1,
                  }}
                  className="
                    h-full
                    rounded-full
                    bg-green-500
                  "
                />

              </div>

            </div>

          </div>

        </motion.div>

      </div>
            {/* Bottom Operational Intelligence */}

      <div
        className="
          grid
          gap-6
          lg:grid-cols-2
        "
      >

        {/* AI Operations Insight */}

        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.4,
          }}
          className="
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-6
            shadow-sm
          "
        >

          <div className="flex items-center gap-3">

            <div className="rounded-2xl bg-violet-100 p-3">

              <ShieldCheck
                size={24}
                className="text-violet-600"
              />

            </div>

            <div>

              <h3 className="text-xl font-bold text-slate-900">
                AI Operational Insight
              </h3>

              <p className="text-sm text-slate-500">
                Live operational intelligence
              </p>

            </div>

          </div>

          <div className="mt-6 rounded-2xl bg-violet-50 p-5">

            <p className="leading-7 text-slate-700">

              Metro operations are currently
              performing within acceptable
              thresholds. High-demand stations
              remain stable, and predicted
              congestion levels are manageable.
              AI recommends maintaining the
              current train frequency while
              monitoring upcoming peak hours.

            </p>

          </div>

          <div className="mt-8 space-y-5">

            <div>

              <div className="mb-2 flex items-center justify-between">

                <span className="text-sm text-slate-600">
                  Operational Risk
                </span>

                <span className="font-semibold text-emerald-600">
                  Low
                </span>

              </div>

              <div className="h-2 rounded-full bg-slate-200">

                <motion.div
                  initial={{
                    width: 0,
                  }}
                  animate={{
                    width: "18%",
                  }}
                  transition={{
                    duration: 1,
                  }}
                  className="
                    h-full
                    rounded-full
                    bg-emerald-500
                  "
                />

              </div>

            </div>

            <div>

              <div className="mb-2 flex items-center justify-between">

                <span className="text-sm text-slate-600">
                  AI Confidence
                </span>

                <span className="font-semibold text-slate-900">
                  97%
                </span>

              </div>

              <div className="h-2 rounded-full bg-slate-200">

                <motion.div
                  initial={{
                    width: 0,
                  }}
                  animate={{
                    width: "97%",
                  }}
                  transition={{
                    delay: 0.2,
                    duration: 1,
                  }}
                  className="
                    h-full
                    rounded-full
                    bg-indigo-500
                  "
                />

              </div>

            </div>

          </div>

        </motion.div>

        {/* Station Performance Leaderboard */}

        <motion.div
          initial={{
            opacity: 0,
            x: 20,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            delay: 0.5,
          }}
          className="
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-6
            shadow-sm
          "
        >

          <h3 className="text-xl font-bold text-slate-900">
            Station Performance
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Top-performing operational stations.
          </p>

          <div className="mt-8 space-y-5">

            {operationalData.map((station, index) => (

              <div
                key={station.station}
              >

                <div className="mb-2 flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <div
                      className="
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-full
                        bg-indigo-100
                        text-sm
                        font-bold
                        text-indigo-600
                      "
                    >
                      {index + 1}
                    </div>

                    <span className="font-medium text-slate-700">
                      {station.station}
                    </span>

                  </div>

                  <span className="font-semibold text-slate-900">
                    {station.utilization}%
                  </span>

                </div>

                <div className="h-2 rounded-full bg-slate-200">

                  <motion.div
                    initial={{
                      width: 0,
                    }}
                    animate={{
                      width: `${station.utilization}%`,
                    }}
                    transition={{
                      delay: index * 0.1,
                      duration: 0.8,
                    }}
                    className="
                      h-full
                      rounded-full
                      bg-gradient-to-r
                      from-indigo-500
                      via-cyan-500
                      to-emerald-500
                    "
                  />

                </div>

              </div>

            ))}

          </div>

        </motion.div>

      </div>
          </section>

  );

}

export default OperationalAnalytics;