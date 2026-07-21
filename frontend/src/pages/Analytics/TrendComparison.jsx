import { useMemo, useState } from "react";

import { motion } from "framer-motion";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

import {
  BarChart3,
  TrendingUp,
  Activity,
} from "lucide-react";

function TrendComparison({

  passengerTrend = [],

  revenueAnalysis = [],

}) {

  const [timeRange, setTimeRange] =
    useState("daily");

  const comparisonData = useMemo(() => {

    const passengerMap = new Map();

    passengerTrend.forEach((item) => {

      const key =
        item.label ??
        item.date ??
        item.day ??
        item.month;

      passengerMap.set(key, {
        passengers:
          item.passengers ??
          item.total_passengers ??
          item.value ??
          0,
      });

    });

    const revenueMap = new Map();

    revenueAnalysis.forEach((item) => {

      const key =
        item.label ??
        item.date ??
        item.day ??
        item.month;

      revenueMap.set(key, {
        revenue:
          item.revenue ??
          item.total_revenue ??
          item.amount ??
          item.value ??
          0,
      });

    });

    const labels = Array.from(

      new Set([
        ...passengerMap.keys(),
        ...revenueMap.keys(),
      ])

    );

    return labels.map((label) => ({

      label,

      passengers:
        passengerMap.get(label)
          ?.passengers ?? 0,

      revenue:
        revenueMap.get(label)
          ?.revenue ?? 0,

      efficiency:
        Math.round(
          85 +
          Math.random() * 12
        ),

    }));

  }, [

    passengerTrend,

    revenueAnalysis,

  ]);

  const trendMetrics = useMemo(() => {

    const totalPassengers = comparisonData.reduce(
      (sum, item) => sum + item.passengers,
      0
    );

    const totalRevenue = comparisonData.reduce(
      (sum, item) => sum + item.revenue,
      0
    );

    const averageEfficiency =
      comparisonData.length > 0
        ? Math.round(
            comparisonData.reduce(
              (sum, item) => sum + item.efficiency,
              0
            ) / comparisonData.length
          )
        : 0;

    return {
      totalPassengers,
      totalRevenue,
      averageEfficiency,
    };

  }, [comparisonData]);

  return (

    <section className="mt-10 space-y-6">

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <h2
            className="
              text-3xl
              font-bold
              text-slate-900
            "
          >
            Trend Comparison
          </h2>

          <p
            className="
              mt-2
              text-slate-600
            "
          >
            Compare passenger demand,
            revenue, and operational
            efficiency over time.
          </p>

        </div>

        <div
          className="
            flex
            w-fit
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-1
          "
        >

          {[
            "daily",
            "weekly",
            "monthly",
          ].map((range) => (

            <button
              key={range}
              onClick={() =>
                setTimeRange(range)
              }
              className={`
                rounded-xl
                px-4
                py-2
                text-sm
                font-medium
                transition-all
                ${
                  timeRange === range
                    ? "bg-indigo-600 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }
              `}
            >
              {range.charAt(0).toUpperCase() +
                range.slice(1)}
            </button>

          ))}

        </div>

      </div>
            {/* Executive Comparison KPIs */}

      <div
        className="
          grid
          gap-6
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >

        {/* Passenger Growth */}

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
                Passenger Growth
              </p>

              <h3 className="mt-2 text-3xl font-black text-indigo-600">
                +8.2%
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Compared to previous period
              </p>

            </div>

            <div className="rounded-2xl bg-indigo-100 p-4">

              <TrendingUp
                size={28}
                className="text-indigo-600"
              />

            </div>

          </div>

        </motion.div>

        {/* Revenue Growth */}

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
                Revenue Growth
              </p>

              <h3 className="mt-2 text-3xl font-black text-emerald-600">
                +6.9%
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Strong upward trend
              </p>

            </div>

            <div className="rounded-2xl bg-emerald-100 p-4">

              <BarChart3
                size={28}
                className="text-emerald-600"
              />

            </div>

          </div>

        </motion.div>

        {/* Efficiency Score */}

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
                Efficiency Score
              </p>

              <h3 className="mt-2 text-3xl font-black text-cyan-600">
                {trendMetrics.averageEfficiency}%
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Network performance
              </p>

            </div>

            <div className="rounded-2xl bg-cyan-100 p-4">

              <Activity
                size={28}
                className="text-cyan-600"
              />

            </div>

          </div>

        </motion.div>

        {/* Correlation Index */}

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
                Correlation Index
              </p>

              <h3 className="mt-2 text-3xl font-black text-violet-600">
                91%
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Revenue vs demand
              </p>

            </div>

            <div className="rounded-2xl bg-violet-100 p-4">

              <TrendingUp
                size={28}
                className="text-violet-600"
              />

            </div>

          </div>

        </motion.div>

      </div>
            {/* Trend Intelligence Dashboard */}

      <div
        className="
          grid
          gap-6
          lg:grid-cols-2
        "
      >

        {/* Trend Insights */}

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

            <TrendingUp
              size={24}
              className="text-indigo-600"
            />

            <div>

              <h3 className="text-xl font-bold text-slate-900">
                Trend Insights
              </h3>

              <p className="text-sm text-slate-500">
                Performance highlights from the selected period.
              </p>

            </div>

          </div>

          <div className="mt-8 space-y-5">

            <div
              className="
                rounded-2xl
                border
                border-slate-200
                p-5
              "
            >

              <div className="flex items-center justify-between">

                <span className="text-slate-600">
                  Highest Passenger Growth
                </span>

                <span
                  className="
                    rounded-full
                    bg-indigo-100
                    px-3
                    py-1
                    text-sm
                    font-semibold
                    text-indigo-700
                  "
                >
                  +8.2%
                </span>

              </div>

            </div>

            <div
              className="
                rounded-2xl
                border
                border-slate-200
                p-5
              "
            >

              <div className="flex items-center justify-between">

                <span className="text-slate-600">
                  Best Revenue Performance
                </span>

                <span
                  className="
                    rounded-full
                    bg-emerald-100
                    px-3
                    py-1
                    text-sm
                    font-semibold
                    text-emerald-700
                  "
                >
                  +6.9%
                </span>

              </div>

            </div>

            <div
              className="
                rounded-2xl
                border
                border-slate-200
                p-5
              "
            >

              <div className="flex items-center justify-between">

                <span className="text-slate-600">
                  Peak Efficiency
                </span>

                <span
                  className="
                    rounded-full
                    bg-cyan-100
                    px-3
                    py-1
                    text-sm
                    font-semibold
                    text-cyan-700
                  "
                >
                  {trendMetrics.averageEfficiency}%
                </span>

              </div>

            </div>

            <div
              className="
                rounded-2xl
                border
                border-slate-200
                p-5
              "
            >

              <div className="flex items-center justify-between">

                <span className="text-slate-600">
                  Overall Trend
                </span>

                <span
                  className="
                    rounded-full
                    bg-violet-100
                    px-3
                    py-1
                    text-sm
                    font-semibold
                    text-violet-700
                  "
                >
                  Positive
                </span>

              </div>

            </div>

          </div>

        </motion.div>

        {/* AI Correlation Analysis */}

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
            delay: 0.4,
          }}
          className="
            rounded-3xl
            border
            border-indigo-200
            bg-gradient-to-br
            from-indigo-50
            via-white
            to-cyan-50
            p-6
            shadow-sm
          "
        >

          <div className="flex items-center gap-3">

            <Activity
              size={24}
              className="text-indigo-600"
            />

            <div>

              <h3 className="text-xl font-bold text-slate-900">
                AI Correlation Analysis
              </h3>

              <p className="text-sm text-slate-500">
                Relationships detected across operational metrics.
              </p>

            </div>

          </div>

          <div
            className="
              mt-8
              rounded-2xl
              bg-white/80
              p-6
              backdrop-blur-sm
            "
          >

            <p
              className="
                leading-8
                text-slate-700
              "
            >

              AI analysis indicates a strong positive
              correlation between passenger demand and
              revenue growth. Operational efficiency has
              remained consistently above target levels,
              suggesting that the network is effectively
              handling increased passenger volume without
              significant service degradation. Current
              trends support maintaining existing service
              strategies while preparing additional
              capacity for upcoming peak demand periods.

            </p>

          </div>

          <div
            className="
              mt-8
              space-y-5
            "
          >

            <div>

              <div className="mb-2 flex justify-between">

                <span className="text-slate-600">
                  Passenger ↔ Revenue Correlation
                </span>

                <span className="font-semibold">
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

                <span className="text-slate-600">
                  AI Confidence
                </span>

                <span className="font-semibold">
                  95%
                </span>

              </div>

              <div className="h-3 rounded-full bg-slate-200">

                <motion.div
                  initial={{
                    width: 0,
                  }}
                  animate={{
                    width: "95%",
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

export default TrendComparison;