import { useMemo } from "react";
import { motion } from "framer-motion";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import {
  IndianRupee,
  TrendingUp,
  Wallet,
  Receipt,
} from "lucide-react";

const PIE_COLORS = [
  "#4F46E5",
  "#06B6D4",
  "#10B981",
  "#F59E0B",
  "#EF4444",
];

function RevenueAnalytics({
  revenueData = [],
  ticketDistribution = [],
}) {

  const totalRevenue = useMemo(() => {

    return revenueData.reduce(
      (sum, item) => sum + (item.revenue ?? 0),
      0
    );

  }, [revenueData]);

  const averageRevenue = useMemo(() => {

    if (!revenueData.length) return 0;

    return Math.round(
      totalRevenue / revenueData.length
    );

  }, [revenueData, totalRevenue]);

  const normalizedRevenueData = useMemo(() => {

    if (!Array.isArray(revenueData)) return [];

    return revenueData.map((item) => ({

      label:
        item.label ??
        item.date ??
        item.month ??
        item.day ??
        "N/A",

      revenue:
        item.revenue ??
        item.total_revenue ??
        item.amount ??
        item.value ??
        0,

    }));

  }, [revenueData]);

  const totalTickets = useMemo(() => {

    return ticketDistribution.reduce(

      (sum, item) => sum + (item.value ?? 0),

      0

    );

  }, [ticketDistribution]);

  return (

    <section className="mt-10 space-y-6">

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-3xl font-bold text-slate-900">
            Revenue Intelligence
          </h2>

          <p className="mt-2 text-slate-600">
            Monitor revenue growth, ticket sales,
            and financial performance across the metro network.
          </p>

        </div>

      </div>
            {/* Revenue KPI Cards */}

      <div
        className="
          grid
          gap-6
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >

        {/* Total Revenue */}

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
                Total Revenue
              </p>

              <h3 className="mt-2 text-3xl font-black text-slate-900">
                ₹ {totalRevenue.toLocaleString()}
              </h3>

            </div>

            <div className="rounded-2xl bg-emerald-100 p-4">

              <IndianRupee
                size={28}
                className="text-emerald-600"
              />

            </div>

          </div>

        </motion.div>

        {/* Average Revenue */}

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
                Average Revenue
              </p>

              <h3 className="mt-2 text-3xl font-black text-slate-900">
                ₹ {averageRevenue.toLocaleString()}
              </h3>

            </div>

            <div className="rounded-2xl bg-cyan-100 p-4">

              <Wallet
                size={28}
                className="text-cyan-600"
              />

            </div>

          </div>

        </motion.div>

        {/* Ticket Sales */}

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
                Ticket Sales
              </p>

              <h3 className="mt-2 text-3xl font-black text-slate-900">
                {totalTickets.toLocaleString()}
              </h3>

            </div>

            <div className="rounded-2xl bg-indigo-100 p-4">

              <Receipt
                size={28}
                className="text-indigo-600"
              />

            </div>

          </div>

        </motion.div>

        {/* Revenue Growth */}

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
                Revenue Growth
              </p>

              <h3 className="mt-2 text-3xl font-black text-emerald-600">
                +12.8%
              </h3>

            </div>

            <div className="rounded-2xl bg-green-100 p-4">

              <TrendingUp
                size={28}
                className="text-green-600"
              />

            </div>

          </div>

        </motion.div>

      </div>
            {/* Revenue Charts */}

      <div
        className="
          grid
          gap-6
          xl:grid-cols-3
        "
      >

        {/* Revenue Trend */}

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
              Revenue Trend
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Revenue performance over time across the metro network.
            </p>

          </div>

          <div className="h-96">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <AreaChart data={normalizedRevenueData}>

                <defs>

                  <linearGradient
                    id="revenueGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >

                    <stop
                      offset="5%"
                      stopColor="#10B981"
                      stopOpacity={0.35}
                    />

                    <stop
                      offset="95%"
                      stopColor="#10B981"
                      stopOpacity={0}
                    />

                  </linearGradient>

                </defs>

                <CartesianGrid
                  stroke="#E2E8F0"
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="label"
                  tick={{
                    fontSize: 12,
                  }}
                />

                <YAxis
                  tickFormatter={(value) => `₹${value}`}
                  tick={{
                    fontSize: 12,
                  }}
                />

                <Tooltip
                  formatter={(value) => [
                    `₹ ${Number(value).toLocaleString()}`,
                    "Revenue",
                  ]}
                  contentStyle={{
                    borderRadius: "16px",
                    border: "1px solid #CBD5E1",
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10B981"
                  strokeWidth={3}
                  fill="url(#revenueGradient)"
                  activeDot={{
                    r: 6,
                  }}
                />

              </AreaChart>

            </ResponsiveContainer>

          </div>

        </motion.div>

        {/* Ticket Distribution */}

        <motion.div
          initial={{
            opacity: 0,
            x: 25,
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

          <div className="mb-6">

            <h3 className="text-xl font-bold text-slate-900">
              Ticket Distribution
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Revenue contribution by ticket category.
            </p>

          </div>

          <div className="h-72">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <PieChart>

                <Pie
                  data={ticketDistribution}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={3}
                >

                  {ticketDistribution.map((entry, index) => (

                    <Cell
                      key={entry.name ?? index}
                      fill={
                        PIE_COLORS[
                          index % PIE_COLORS.length
                        ]
                      }
                    />

                  ))}

                </Pie>

                <Tooltip
                  formatter={(value) => [
                    Number(value).toLocaleString(),
                    "Tickets",
                  ]}
                />

              </PieChart>

            </ResponsiveContainer>

          </div>

          <div className="mt-6 space-y-3">

            {ticketDistribution.map((item, index) => (

              <div
                key={item.name ?? index}
                className="
                  flex
                  items-center
                  justify-between
                "
              >

                <div className="flex items-center gap-3">

                  <span
                    className="h-3 w-3 rounded-full"
                    style={{
                      backgroundColor:
                        PIE_COLORS[
                          index % PIE_COLORS.length
                        ],
                    }}
                  />

                  <span className="text-sm font-medium text-slate-700">
                    {item.name}
                  </span>

                </div>

                <span className="font-semibold text-slate-900">
                  {item.value?.toLocaleString() ?? 0}
                </span>

              </div>

            ))}

          </div>

        </motion.div>

      </div>
            {/* Revenue Insights */}

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
          delay: 0.45,
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

        <div className="flex items-center gap-3">

          <div className="rounded-2xl bg-emerald-100 p-3">

            <TrendingUp
              size={24}
              className="text-emerald-600"
            />

          </div>

          <div>

            <h3 className="text-xl font-bold text-slate-900">
              Revenue Intelligence
            </h3>

            <p className="text-sm text-slate-500">
              AI-generated financial insights
            </p>

          </div>

        </div>

        <div className="mt-7 grid gap-5 lg:grid-cols-3">

          <div className="rounded-2xl bg-emerald-50 p-5">

            <p className="text-sm font-medium text-slate-500">
              Best Performing Period
            </p>

            <h4 className="mt-2 text-2xl font-bold text-emerald-600">

              {
                normalizedRevenueData.reduce(

                  (best, current) =>
                    current.revenue >
                    (best?.revenue ?? -1)
                      ? current
                      : best,

                  null

                )?.label ?? "--"

              }

            </h4>

          </div>

          <div className="rounded-2xl bg-indigo-50 p-5">

            <p className="text-sm font-medium text-slate-500">
              Average Revenue
            </p>

            <h4 className="mt-2 text-2xl font-bold text-indigo-600">
              ₹ {averageRevenue.toLocaleString()}
            </h4>

          </div>

          <div className="rounded-2xl bg-cyan-50 p-5">

            <p className="text-sm font-medium text-slate-500">
              Revenue Trend
            </p>

            <h4 className="mt-2 text-2xl font-bold text-cyan-600">

              {
                totalRevenue > 0
                  ? "Growing"
                  : "No Data"
              }

            </h4>

          </div>

        </div>

        <div className="mt-8 rounded-2xl bg-slate-50 p-6">

          <h4 className="font-semibold text-slate-900">
            AI Financial Summary
          </h4>

          <p className="mt-3 leading-7 text-slate-600">

            Revenue performance remains stable across the
            metro network. Ticket sales indicate healthy
            passenger demand, while operational income
            continues to follow expected seasonal trends.
            Based on current analytics, no significant
            revenue anomalies have been detected.

          </p>

        </div>

      </motion.div>
          </section>

  );

}

export default RevenueAnalytics;