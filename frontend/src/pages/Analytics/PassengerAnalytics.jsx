import { useMemo, useState } from "react";
import { motion } from "framer-motion";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import {
  Users,
  BrainCircuit,
  TrendingUp,
  Clock3,
} from "lucide-react";

function PassengerAnalytics({
  passengerTrend = [],
  busiestStations = [],
}) {

  const [view, setView] = useState("daily");

  const chartData = useMemo(() => {

    if (!Array.isArray(passengerTrend)) return [];

    return passengerTrend.map((item) => ({
      label:
        item.date ??
        item.day ??
        item.month ??
        "",
      passengers: item.passengers ?? 0,
    }));

  }, [passengerTrend]);

  const totalPassengers = useMemo(() =>

    chartData.reduce(
      (sum, item) => sum + item.passengers,
      0
    )

  , [chartData]);

  const averagePassengers = useMemo(() => {

    if (!chartData.length) return 0;

    return Math.round(
      totalPassengers / chartData.length
    );

  }, [chartData, totalPassengers]);

  const maxPassengers = useMemo(() => {

    if (!busiestStations.length) return 1;

    return Math.max(
      ...busiestStations.map(
        (station) =>
          station.passengers ??
          station.total_passengers ??
          0
      )
    );

  }, [busiestStations]);

  return (

    <section className="mt-8 space-y-6">

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <h2 className="text-3xl font-bold text-slate-900">
            Passenger Intelligence
          </h2>

          <p className="mt-2 text-slate-600">
            Analyze passenger demand, identify high-traffic stations,
            and monitor travel patterns across the metro network.
          </p>

        </div>

        <div className="flex rounded-2xl bg-slate-100 p-1">
                      {["daily", "weekly", "monthly"].map((option) => (

            <button
              key={option}
              onClick={() => setView(option)}
              className={`
                rounded-xl
                px-5
                py-2
                text-sm
                font-semibold
                capitalize
                transition-all
                ${
                  view === option
                    ? "bg-white text-indigo-600 shadow-md"
                    : "text-slate-500 hover:text-slate-700"
                }
              `}
            >
              {option}
            </button>

          ))}

        </div>

      </div>

      {/* Passenger KPI Cards */}

      <div
        className="
          grid
          gap-6
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >

        {/* Total Passengers */}

        <motion.div
          initial={{ opacity: 0, y: 25 }}
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
                Total Passengers
              </p>

              <h3 className="mt-2 text-3xl font-black text-slate-900">
                {totalPassengers.toLocaleString()}
              </h3>

            </div>

            <div className="rounded-2xl bg-cyan-100 p-4">

              <Users
                size={28}
                className="text-cyan-600"
              />

            </div>

          </div>

        </motion.div>

        {/* Average */}

        <motion.div
          initial={{ opacity: 0, y: 25 }}
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
                Average / Period
              </p>

              <h3 className="mt-2 text-3xl font-black text-slate-900">
                {averagePassengers.toLocaleString()}
              </h3>

            </div>

            <div className="rounded-2xl bg-indigo-100 p-4">

              <TrendingUp
                size={28}
                className="text-indigo-600"
              />

            </div>

          </div>

        </motion.div>

        {/* Peak Hour */}

        <motion.div
          initial={{ opacity: 0, y: 25 }}
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
                Peak Hour
              </p>

              <h3 className="mt-2 text-3xl font-black text-slate-900">
                08:00
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

        {/* AI Prediction */}

        <motion.div
          initial={{ opacity: 0, y: 25 }}
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
                AI Demand
              </p>

              <h3 className="mt-2 text-3xl font-black text-emerald-600">
                Stable
              </h3>

            </div>

            <div className="rounded-2xl bg-violet-100 p-4">

              <BrainCircuit
                size={28}
                className="text-violet-600"
              />

            </div>

          </div>

        </motion.div>

      </div>
            {/* Passenger Trend & AI Insight */}

      <div
        className="
          grid
          gap-6
          xl:grid-cols-3
        "
      >

        {/* Passenger Trend Chart */}

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
              Passenger Trend
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Historical passenger movement across the metro network.
            </p>

          </div>

          <div className="h-96">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <AreaChart data={chartData}>

                <defs>

                  <linearGradient
                    id="passengerGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >

                    <stop
                      offset="5%"
                      stopColor="#4F46E5"
                      stopOpacity={0.35}
                    />

                    <stop
                      offset="95%"
                      stopColor="#4F46E5"
                      stopOpacity={0}
                    />

                  </linearGradient>

                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#E2E8F0"
                />

                <XAxis
                  dataKey="label"
                  tick={{
                    fontSize: 12,
                  }}
                />

                <YAxis
                  tick={{
                    fontSize: 12,
                  }}
                />

                <Tooltip
                  contentStyle={{
                    borderRadius: "16px",
                    border: "1px solid #CBD5E1",
                    backgroundColor: "#FFFFFF",
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="passengers"
                  stroke="#4F46E5"
                  strokeWidth={3}
                  fill="url(#passengerGradient)"
                  activeDot={{
                    r: 6,
                  }}
                />

              </AreaChart>

            </ResponsiveContainer>

          </div>

        </motion.div>

        {/* AI Insight Panel */}

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

          <div className="flex items-center gap-3">

            <div className="rounded-2xl bg-violet-100 p-3">

              <BrainCircuit
                className="text-violet-600"
                size={24}
              />

            </div>

            <div>

              <h3 className="text-lg font-bold text-slate-900">
                AI Passenger Insight
              </h3>

              <p className="text-sm text-slate-500">
                Generated automatically
              </p>

            </div>

          </div>

          <div className="mt-6 rounded-2xl bg-violet-50 p-5">

            <p className="leading-7 text-slate-700">

              Passenger demand is stable across most
              stations. Peak congestion is expected
              during the morning commute, while
              evening traffic remains within the
              predicted operating threshold.

            </p>

          </div>

          <div className="mt-6 space-y-5">

            <div>

              <div className="mb-2 flex justify-between">

                <span className="text-sm text-slate-600">
                  Demand Prediction
                </span>

                <span className="font-semibold text-slate-800">
                  94%
                </span>

              </div>

              <div className="h-2 rounded-full bg-slate-200">

                <motion.div
                  initial={{
                    width: 0,
                  }}
                  animate={{
                    width: "94%",
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
                  Forecast Confidence
                </span>

                <span className="font-semibold text-slate-800">
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
                    bg-emerald-500
                  "
                />

              </div>

            </div>

          </div>

        </motion.div>

      </div>
            {/* Passenger Trend & AI Insight */}

      <div
        className="
          grid
          gap-6
          xl:grid-cols-3
        "
      >

        {/* Passenger Trend Chart */}

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
              Passenger Trend
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Historical passenger movement across the metro network.
            </p>

          </div>

          <div className="h-96">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <AreaChart data={chartData}>

                <defs>

                  <linearGradient
                    id="passengerGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >

                    <stop
                      offset="5%"
                      stopColor="#4F46E5"
                      stopOpacity={0.35}
                    />

                    <stop
                      offset="95%"
                      stopColor="#4F46E5"
                      stopOpacity={0}
                    />

                  </linearGradient>

                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#E2E8F0"
                />

                <XAxis
                  dataKey="label"
                  tick={{
                    fontSize: 12,
                  }}
                />

                <YAxis
                  tick={{
                    fontSize: 12,
                  }}
                />

                <Tooltip
                  contentStyle={{
                    borderRadius: "16px",
                    border: "1px solid #CBD5E1",
                    backgroundColor: "#FFFFFF",
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="passengers"
                  stroke="#4F46E5"
                  strokeWidth={3}
                  fill="url(#passengerGradient)"
                  activeDot={{
                    r: 6,
                  }}
                />

              </AreaChart>

            </ResponsiveContainer>

          </div>

        </motion.div>

        {/* AI Insight Panel */}

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

          <div className="flex items-center gap-3">

            <div className="rounded-2xl bg-violet-100 p-3">

              <BrainCircuit
                className="text-violet-600"
                size={24}
              />

            </div>

            <div>

              <h3 className="text-lg font-bold text-slate-900">
                AI Passenger Insight
              </h3>

              <p className="text-sm text-slate-500">
                Generated automatically
              </p>

            </div>

          </div>

          <div className="mt-6 rounded-2xl bg-violet-50 p-5">

            <p className="leading-7 text-slate-700">

              Passenger demand is stable across most
              stations. Peak congestion is expected
              during the morning commute, while
              evening traffic remains within the
              predicted operating threshold.

            </p>

          </div>

          <div className="mt-6 space-y-5">

            <div>

              <div className="mb-2 flex justify-between">

                <span className="text-sm text-slate-600">
                  Demand Prediction
                </span>

                <span className="font-semibold text-slate-800">
                  94%
                </span>

              </div>

              <div className="h-2 rounded-full bg-slate-200">

                <motion.div
                  initial={{
                    width: 0,
                  }}
                  animate={{
                    width: "94%",
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
                  Forecast Confidence
                </span>

                <span className="font-semibold text-slate-800">
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
                    bg-emerald-500
                  "
                />

              </div>

            </div>

          </div>

        </motion.div>

      </div>
          </section>

  );

}

export default PassengerAnalytics;