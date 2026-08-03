import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  TrendingUp,
  Users,
  Activity,
  CalendarDays,
  Clock3,
  BarChart3,
  Sparkles,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function DemandForecast({
  forecastData = [],
  routes = [],
  hourlyDemand = [],
}) {
  const summary = useMemo(() => {
    const totalPassengers = forecastData.reduce(
      (sum, item) => sum + (item.predictedPassengers || 0),
      0
    );

    const peakDemand = Math.max(
      ...forecastData.map((item) => item.predictedPassengers || 0),
      0
    );

    const averageGrowth =
      forecastData.length > 0
        ? (
            forecastData.reduce(
              (sum, item) => sum + (item.growthRate || 0),
              0
            ) / forecastData.length
          ).toFixed(1)
        : 0;

    const averageAccuracy =
      forecastData.length > 0
        ? (
            forecastData.reduce(
              (sum, item) => sum + (item.accuracy || 0),
              0
            ) / forecastData.length
          ).toFixed(1)
        : 0;

    return {
      totalPassengers,
      peakDemand,
      averageGrowth,
      averageAccuracy,
    };
  }, [forecastData]);

  const demandColors = {
    Low: {
      badge: "bg-emerald-100 text-emerald-700",
      progress: "bg-emerald-500",
    },

    Moderate: {
      badge: "bg-yellow-100 text-yellow-700",
      progress: "bg-yellow-500",
    },

    High: {
      badge: "bg-orange-100 text-orange-700",
      progress: "bg-orange-500",
    },

    Critical: {
      badge: "bg-red-100 text-red-700",
      progress: "bg-red-600",
    },
  };

  const trendData = forecastData.length
    ? forecastData
    : [
        { day: "Mon", historical: 43000, predicted: 45500, confidence: 98 },
        { day: "Tue", historical: 44800, predicted: 47200, confidence: 97 },
        { day: "Wed", historical: 46200, predicted: 48800, confidence: 97 },
        { day: "Thu", historical: 47900, predicted: 50300, confidence: 96 },
        { day: "Fri", historical: 49500, predicted: 53400, confidence: 98 },
        { day: "Sat", historical: 35600, predicted: 38100, confidence: 95 },
        { day: "Sun", historical: 30200, predicted: 32100, confidence: 95 },
      ];

  return (
    <div className="space-y-8">
      {/* Hero */}
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
          duration: 0.6,
        }}
        className="
          relative
          overflow-hidden
          rounded-3xl
          bg-gradient-to-r
          from-indigo-700
          via-blue-700
          to-cyan-600
          p-8
          text-white
        "
      >
        <div className="absolute inset-0 bg-black/10" />

        <div className="relative z-10">
          <div
            className="
              flex
              flex-col
              gap-6
              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >
            <div>
              <div
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  bg-white/15
                  px-4
                  py-2
                "
              >
                <Brain size={18} />

                <span className="text-sm font-medium">
                  AI Passenger Forecasting
                </span>
              </div>

              <h2
                className="
                  mt-6
                  text-4xl
                  font-black
                "
              >
                Passenger Demand Forecast
              </h2>

              <p
                className="
                  mt-4
                  max-w-3xl
                  text-blue-100
                  leading-8
                "
              >
                Predict passenger demand before it happens using
                MetroVision AI. Analyze historical travel patterns,
                forecast upcoming rush hours, and optimize operations
                proactively.
              </p>
            </div>

            <div
              className="
                grid
                gap-4
                sm:grid-cols-2
              "
            >
              <div
                className="
                  rounded-2xl
                  bg-white/10
                  p-5
                  backdrop-blur
                "
              >
                <Activity className="text-green-300" size={28} />

                <p
                  className="
                    mt-4
                    text-sm
                    text-blue-100
                  "
                >
                  AI Status
                </p>

                <h3
                  className="
                    mt-2
                    text-2xl
                    font-bold
                  "
                >
                  Active
                </h3>
              </div>

              <div
                className="
                  rounded-2xl
                  bg-white/10
                  p-5
                  backdrop-blur
                "
              >
                <CalendarDays className="text-cyan-300" size={28} />

                <p
                  className="
                    mt-4
                    text-sm
                    text-blue-100
                  "
                >
                  Forecast Horizon
                </p>

                <h3
                  className="
                    mt-2
                    text-2xl
                    font-bold
                  "
                >
                  7 Days
                </h3>
              </div>

              <div
                className="
                  rounded-2xl
                  bg-white/10
                  p-5
                  backdrop-blur
                "
              >
                <Sparkles className="text-yellow-300" size={28} />

                <p
                  className="
                    mt-4
                    text-sm
                    text-blue-100
                  "
                >
                  Prediction Confidence
                </p>

                <h3
                  className="
                    mt-2
                    text-2xl
                    font-bold
                  "
                >
                  97.8%
                </h3>
              </div>

              <div
                className="
                  rounded-2xl
                  bg-white/10
                  p-5
                  backdrop-blur
                "
              >
                <Clock3 className="text-orange-300" size={28} />

                <p
                  className="
                    mt-4
                    text-sm
                    text-blue-100
                  "
                >
                  Last Updated
                </p>

                <h3
                  className="
                    mt-2
                    text-2xl
                    font-bold
                  "
                >
                  1 min ago
                </h3>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div
        className="
          grid
          gap-6
          md:grid-cols-2
          xl:grid-cols-4
        "
      >
        {[
          {
            title: "Predicted Passengers",
            value: summary.totalPassengers.toLocaleString(),
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-50",
            change: "+8.4%",
          },
          {
            title: "Peak Demand",
            value: `${summary.peakDemand.toLocaleString()}`,
            icon: TrendingUp,
            color: "text-red-600",
            bg: "bg-red-50",
            change: "+12.1%",
          },
          {
            title: "Growth Rate",
            value: `${summary.averageGrowth}%`,
            icon: Activity,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            change: "+3.2%",
          },
          {
            title: "Forecast Accuracy",
            value: `${summary.averageAccuracy}%`,
            icon: Brain,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
            change: "Excellent",
          },
        ].map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={item.title}
              initial={{
                opacity: 0,
                y: 20,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                delay: index * 0.08,
              }}
              whileHover={{
                y: -6,
              }}
              className="
                rounded-3xl
                border
                border-slate-200
                bg-white
                p-6
                shadow-sm
                transition-all
                hover:border-indigo-200
                hover:shadow-lg
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                "
              >
                <div>
                  <p
                    className="
                      text-sm
                      text-slate-500
                    "
                  >
                    {item.title}
                  </p>

                  <h3
                    className="
                      mt-3
                      text-3xl
                      font-black
                      text-slate-900
                    "
                  >
                    {item.value}
                  </h3>
                </div>

                <div
                  className={`
                    ${item.bg}
                    rounded-2xl
                    p-4
                  `}
                >
                  <Icon size={30} className={item.color} />
                </div>
              </div>

              <div
                className="
                  mt-6
                  flex
                  items-center
                  justify-between
                "
              >
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
                  {item.change}
                </span>

                <span
                  className="
                    text-sm
                    text-slate-500
                  "
                >
                  vs previous forecast
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Forecast Highlights */}
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
        }}
        className="
          rounded-3xl
          border
          border-slate-200
          bg-white
          p-8
          shadow-sm
        "
      >
        <div
          className="
            flex
            flex-col
            gap-4
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >
          <div>
            <h3
              className="
                text-2xl
                font-bold
                text-slate-900
              "
            >
              AI Forecast Highlights
            </h3>

            <p
              className="
                mt-2
                text-slate-500
              "
            >
              Key insights generated from passenger demand
              forecasting models.
            </p>
          </div>

          <div
            className="
              rounded-full
              bg-indigo-100
              px-4
              py-2
              text-sm
              font-semibold
              text-indigo-700
            "
          >
            Live AI Analysis
          </div>
        </div>

        <div
          className="
            mt-8
            grid
            gap-6
            lg:grid-cols-3
          "
        >
          {[
            {
              title: "Morning Rush",
              value: "7:30 AM - 9:30 AM",
              description:
                "Highest weekday commuter demand expected across all major corridors.",
            },
            {
              title: "Fastest Growing Line",
              value: "Blue Line",
              description:
                "Predicted passenger demand will increase significantly over the next week.",
            },
            {
              title: "Highest Confidence",
              value: "98.4%",
              description:
                "Forecast reliability remains exceptionally high due to stable historical patterns.",
            },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{
                opacity: 0,
                y: 20,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                delay: index * 0.1,
              }}
              className="
                rounded-2xl
                bg-slate-50
                p-6
              "
            >
              <BarChart3 className="text-indigo-600" size={28} />

              <h4
                className="
                  mt-5
                  text-lg
                  font-bold
                  text-slate-900
                "
              >
                {item.title}
              </h4>

              <p
                className="
                  mt-2
                  text-2xl
                  font-black
                  text-indigo-700
                "
              >
                {item.value}
              </p>

              <p
                className="
                  mt-4
                  leading-7
                  text-slate-600
                "
              >
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Historical vs Forecast Analysis */}
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
        }}
        className="
          rounded-3xl
          border
          border-slate-200
          bg-white
          p-8
          shadow-sm
        "
      >
        <div
          className="
            flex
            flex-col
            gap-4
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >
          <div>
            <h3
              className="
                text-2xl
                font-bold
                text-slate-900
              "
            >
              Historical vs AI Forecast
            </h3>

            <p
              className="
                mt-2
                text-slate-500
              "
            >
              Compare historical passenger movement with MetroVision AI
              demand predictions.
            </p>
          </div>

          <div
            className="
              rounded-full
              bg-indigo-100
              px-4
              py-2
              text-sm
              font-semibold
              text-indigo-700
            "
          >
            7-Day Forecast Window
          </div>
        </div>

        {/* Trend Comparison */}
        <div className="mt-10">
          <ResponsiveContainer width="100%" height={360}>
            <BarChart
              data={trendData}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
              barGap={6}
              barCategoryGap="20%"
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e2e8f0"
              />
              <XAxis
                dataKey="day"
                tick={{ fill: "#475569", fontSize: 13, fontWeight: 600 }}
                axisLine={{ stroke: "#e2e8f0" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                cursor={{ fill: "#f1f5f9" }}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
                formatter={(value, name) => [
                  value.toLocaleString(),
                  name === "historical" ? "Historical" : "Forecast",
                ]}
              />
              <Legend
                formatter={(value) =>
                  value === "historical" ? "Historical Demand" : "AI Forecast"
                }
                wrapperStyle={{ paddingTop: 20 }}
              />
              <Bar
                dataKey="historical"
                fill="#cbd5e1"
                radius={[8, 8, 0, 0]}
                maxBarSize={28}
              />
              <Bar
                dataKey="predicted"
                fill="#4f46e5"
                radius={[8, 8, 0, 0]}
                maxBarSize={28}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Hourly Passenger Demand */}
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
        }}
        className="
          grid
          gap-6
          xl:grid-cols-3
        "
      >
        {/* 24-Hour Timeline */}
        <div
          className="
            xl:col-span-2
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-8
            shadow-sm
          "
        >
          <div
            className="
              flex
              flex-col
              gap-4
              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >
            <div>
              <h3
                className="
                  text-2xl
                  font-bold
                  text-slate-900
                "
              >
                24-Hour Passenger Demand
              </h3>

              <p
                className="
                  mt-2
                  text-slate-500
                "
              >
                MetroVision AI predicts hourly passenger movement
                throughout the day.
              </p>
            </div>

            <div
              className="
                rounded-full
                bg-indigo-100
                px-4
                py-2
                text-sm
                font-semibold
                text-indigo-700
              "
            >
              Live Hourly Forecast
            </div>
          </div>

          <div
            className="
              mt-10
              grid
              grid-cols-12
              gap-3
              items-end
              h-72
            "
          >
            {(hourlyDemand.length
              ? hourlyDemand
              : [
                  { hour: "6", demand: 28 },
                  { hour: "7", demand: 42 },
                  { hour: "8", demand: 75 },
                  { hour: "9", demand: 91 },
                  { hour: "10", demand: 68 },
                  { hour: "11", demand: 54 },
                  { hour: "12", demand: 58 },
                  { hour: "1", demand: 62 },
                  { hour: "2", demand: 59 },
                  { hour: "3", demand: 65 },
                  { hour: "4", demand: 82 },
                  { hour: "5", demand: 98 },
                ]
            ).map((item, index) => (
              <motion.div
                key={`${item.hour}-${index}`}
                initial={{
                  height: 0,
                }}
                whileInView={{
                  height: `${item.demand}%`,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  delay: index * 0.05,
                }}
                className="
                  flex
                  flex-col
                  justify-end
                  items-center
                "
              >
                <div
                  className="
                    w-full
                    rounded-t-xl
                    bg-gradient-to-t
                    from-indigo-700
                    via-blue-600
                    to-cyan-400
                  "
                  style={{
                    height: `${item.demand}%`,
                    minHeight: "24px",
                  }}
                />

                <span
                  className="
                    mt-3
                    text-xs
                    font-medium
                    text-slate-600
                  "
                >
                  {item.hour}
                </span>
              </motion.div>
            ))}
          </div>

          <div
            className="
              mt-6
              flex
              justify-between
              text-sm
              text-slate-500
            "
          >
            <span>06:00</span>

            <span>12:00</span>

            <span>18:00</span>
          </div>
        </div>

        {/* Peak Hour Analysis */}
        <div
          className="
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-8
            shadow-sm
          "
        >
          <h3
            className="
              text-2xl
              font-bold
              text-slate-900
            "
          >
            Peak Hour Analysis
          </h3>

          <div className="mt-8 space-y-6">
            {[
              {
                period: "Morning",
                time: "7 AM - 10 AM",
                demand: 91,
                level: "High",
              },
              {
                period: "Afternoon",
                time: "12 PM - 3 PM",
                demand: 62,
                level: "Moderate",
              },
              {
                period: "Evening",
                time: "5 PM - 8 PM",
                demand: 98,
                level: "Critical",
              },
              {
                period: "Night",
                time: "9 PM - 11 PM",
                demand: 35,
                level: "Low",
              },
            ].map((item) => (
              <div key={item.period}>
                <div
                  className="
                    mb-2
                    flex
                    items-center
                    justify-between
                  "
                >
                  <div>
                    <h4
                      className="
                        font-semibold
                        text-slate-900
                      "
                    >
                      {item.period}
                    </h4>

                    <p
                      className="
                        text-sm
                        text-slate-500
                      "
                    >
                      {item.time}
                    </p>
                  </div>

                  <span
                    className={`
                      rounded-full
                      px-3
                      py-1
                      text-xs
                      font-semibold
                      ${demandColors[item.level]?.badge}
                    `}
                  >
                    {item.level}
                  </span>
                </div>

                <div
                  className="
                    h-3
                    rounded-full
                    bg-slate-100
                  "
                >
                  <motion.div
                    initial={{
                      width: 0,
                    }}
                    whileInView={{
                      width: `${item.demand}%`,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      duration: 1,
                    }}
                    className={`
                      h-full
                      rounded-full
                      ${demandColors[item.level]?.progress}
                    `}
                  />
                </div>
              </div>
            ))}
          </div>

          <div
            className="
              mt-10
              rounded-2xl
              bg-gradient-to-r
              from-indigo-600
              to-cyan-500
              p-6
              text-white
            "
          >
            <Brain size={30} />

            <h4
              className="
                mt-4
                text-xl
                font-bold
              "
            >
              AI Insight
            </h4>

            <p
              className="
                mt-3
                leading-7
                text-indigo-100
              "
            >
              Evening passenger demand is expected to exceed
              historical averages by approximately
              <span className="font-bold text-white"> 14%</span>.
              MetroVision AI recommends increasing train frequency
              between
              <span className="font-bold text-white">
                {" "}
                5 PM and 8 PM
              </span>
              to maintain optimal passenger flow.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Route Demand Analysis */}
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
        }}
        className="
          rounded-3xl
          border
          border-slate-200
          bg-white
          p-8
          shadow-sm
        "
      >
        <div
          className="
            flex
            flex-col
            gap-4
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >
          <div>
            <h3
              className="
                text-2xl
                font-bold
                text-slate-900
              "
            >
              Route Demand Analysis
            </h3>

            <p
              className="
                mt-2
                text-slate-500
              "
            >
              MetroVision AI analyzes passenger demand across major
              routes to identify capacity constraints before peak
              hours.
            </p>
          </div>

          <div
            className="
              rounded-full
              bg-indigo-100
              px-4
              py-2
              text-sm
              font-semibold
              text-indigo-700
            "
          >
            AI Route Intelligence
          </div>
        </div>

        <div
          className="
            mt-10
            overflow-x-auto
          "
        >
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="px-4 py-4 text-left text-sm font-semibold text-slate-600">
                  Route
                </th>

                <th className="px-4 py-4 text-center text-sm font-semibold text-slate-600">
                  Current
                </th>

                <th className="px-4 py-4 text-center text-sm font-semibold text-slate-600">
                  Forecast
                </th>

                <th className="px-4 py-4 text-center text-sm font-semibold text-slate-600">
                  Growth
                </th>

                <th className="px-4 py-4 text-center text-sm font-semibold text-slate-600">
                  Capacity
                </th>

                <th className="px-4 py-4 text-center text-sm font-semibold text-slate-600">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {(routes.length
                ? routes
                : [
                    {
                      route: "Blue Line",
                      current: 45200,
                      forecast: 50800,
                      growth: 12,
                      capacity: 91,
                      status: "Critical",
                    },
                    {
                      route: "Yellow Line",
                      current: 39800,
                      forecast: 43400,
                      growth: 9,
                      capacity: 82,
                      status: "High",
                    },
                    {
                      route: "Red Line",
                      current: 28400,
                      forecast: 30700,
                      growth: 8,
                      capacity: 71,
                      status: "Moderate",
                    },
                    {
                      route: "Green Line",
                      current: 18200,
                      forecast: 19100,
                      growth: 5,
                      capacity: 56,
                      status: "Low",
                    },
                    {
                      route: "Violet Line",
                      current: 21600,
                      forecast: 23800,
                      growth: 10,
                      capacity: 78,
                      status: "High",
                    },
                  ]
              ).map((route, index) => (
                <motion.tr
                  key={route.route}
                  initial={{
                    opacity: 0,
                    x: -20,
                  }}
                  whileInView={{
                    opacity: 1,
                    x: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    delay: index * 0.08,
                  }}
                  className="
                    border-b
                    border-slate-100
                    hover:bg-slate-50
                  "
                >
                  <td className="px-4 py-5">
                    <div
                      className="
                        flex
                        items-center
                        gap-3
                      "
                    >
                      <BarChart3 className="text-indigo-600" size={22} />

                      <span
                        className="
                          font-semibold
                          text-slate-900
                        "
                      >
                        {route.route}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-5 text-center font-medium text-slate-700">
                    {route.current.toLocaleString()}
                  </td>

                  <td className="px-4 py-5 text-center font-bold text-indigo-700">
                    {route.forecast.toLocaleString()}
                  </td>

                  <td className="px-4 py-5 text-center">
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
                      +{route.growth}%
                    </span>
                  </td>

                  <td className="px-4 py-5">
                    <div
                      className="
                        mx-auto
                        max-w-[180px]
                      "
                    >
                      <div
                        className="
                          mb-2
                          flex
                          justify-between
                          text-sm
                        "
                      >
                        <span className="text-slate-500">Usage</span>

                        <span className="font-semibold">
                          {route.capacity}%
                        </span>
                      </div>

                      <div
                        className="
                          h-3
                          rounded-full
                          bg-slate-100
                        "
                      >
                        <motion.div
                          initial={{
                            width: 0,
                          }}
                          whileInView={{
                            width: `${route.capacity}%`,
                          }}
                          viewport={{
                            once: true,
                          }}
                          transition={{
                            duration: 1,
                          }}
                          className={`
                            h-full
                            rounded-full
                            ${demandColors[route.status]?.progress}
                          `}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-5 text-center">
                    <span
                      className={`
                        rounded-full
                        px-3
                        py-1
                        text-sm
                        font-semibold
                        ${demandColors[route.status]?.badge}
                      `}
                    >
                      {route.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* AI Route Recommendation */}
        <motion.div
          initial={{
            opacity: 0,
          }}
          whileInView={{
            opacity: 1,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            delay: 0.3,
          }}
          className="
            mt-10
            rounded-3xl
            bg-gradient-to-r
            from-indigo-600
            via-blue-600
            to-cyan-500
            p-8
            text-white
          "
        >
          <div
            className="
              flex
              gap-5
            "
          >
            <Brain size={38} className="text-cyan-200" />

            <div>
              <h4
                className="
                  text-2xl
                  font-bold
                "
              >
                AI Route Optimization
              </h4>

              <p
                className="
                  mt-4
                  max-w-5xl
                  leading-8
                  text-blue-100
                "
              >
                Blue Line is projected to experience the highest
                passenger growth over the next forecast window.
                MetroVision AI recommends increasing train frequency,
                optimizing turnaround schedules, and reallocating
                standby trains to improve passenger throughput while
                reducing platform congestion.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Peak Demand Detection */}
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
        }}
        className="
          grid
          gap-6
          xl:grid-cols-3
        "
      >
        {/* Peak Demand Center */}
        <div
          className="
            xl:col-span-2
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-8
            shadow-sm
          "
        >
          <div
            className="
              flex
              flex-col
              gap-4
              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >
            <div>
              <h3
                className="
                  text-2xl
                  font-bold
                  text-slate-900
                "
              >
                Peak Demand Detection
              </h3>

              <p
                className="
                  mt-2
                  text-slate-500
                "
              >
                MetroVision AI continuously monitors demand patterns to
                identify future peak periods across the metro
                network.
              </p>
            </div>

            <div
              className="
                rounded-full
                bg-indigo-100
                px-4
                py-2
                text-sm
                font-semibold
                text-indigo-700
              "
            >
              AI Peak Detection
            </div>
          </div>

          <div
            className="
              mt-10
              grid
              gap-6
              md:grid-cols-2
            "
          >
            {[
              {
                title: "Peak Hour",
                value: "5:30 PM - 7:30 PM",
                icon: Clock3,
                color: "text-orange-600",
                bg: "bg-orange-50",
              },
              {
                title: "Highest Demand Station",
                value: "Rajiv Chowk",
                icon: Users,
                color: "text-indigo-600",
                bg: "bg-indigo-50",
              },
              {
                title: "Busiest Metro Line",
                value: "Blue Line",
                icon: TrendingUp,
                color: "text-red-600",
                bg: "bg-red-50",
              },
              {
                title: "Forecast Confidence",
                value: "98.2%",
                icon: Brain,
                color: "text-emerald-600",
                bg: "bg-emerald-50",
              },
            ].map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    delay: index * 0.08,
                  }}
                  whileHover={{
                    y: -5,
                  }}
                  className="
                    rounded-3xl
                    border
                    border-slate-200
                    p-6
                    transition-all
                    hover:border-indigo-200
                    hover:shadow-lg
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      justify-between
                    "
                  >
                    <div>
                      <p
                        className="
                          text-sm
                          text-slate-500
                        "
                      >
                        {item.title}
                      </p>

                      <h4
                        className="
                          mt-3
                          text-2xl
                          font-black
                          text-slate-900
                        "
                      >
                        {item.value}
                      </h4>
                    </div>

                    <div
                      className={`
                        ${item.bg}
                        rounded-2xl
                        p-4
                      `}
                    >
                      <Icon size={30} className={item.color} />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Weekday vs Weekend */}
          <div
            className="
              mt-10
              rounded-3xl
              bg-slate-50
              p-6
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
              "
            >
              <h4
                className="
                  text-xl
                  font-bold
                  text-slate-900
                "
              >
                Weekday vs Weekend Demand
              </h4>

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
                AI Comparison
              </span>
            </div>

            <div
              className="
                mt-8
                grid
                gap-6
                md:grid-cols-2
              "
            >
              {[
                {
                  label: "Weekdays",
                  demand: 92,
                  growth: "+11%",
                },
                {
                  label: "Weekends",
                  demand: 64,
                  growth: "+4%",
                },
              ].map((item) => (
                <div key={item.label}>
                  <div
                    className="
                      mb-3
                      flex
                      justify-between
                    "
                  >
                    <span
                      className="
                        font-semibold
                        text-slate-700
                      "
                    >
                      {item.label}
                    </span>

                    <span
                      className="
                        font-bold
                        text-slate-900
                      "
                    >
                      {item.demand}%
                    </span>
                  </div>

                  <div
                    className="
                      h-3
                      rounded-full
                      bg-slate-200
                    "
                  >
                    <motion.div
                      initial={{
                        width: 0,
                      }}
                      whileInView={{
                        width: `${item.demand}%`,
                      }}
                      viewport={{
                        once: true,
                      }}
                      transition={{
                        duration: 1,
                      }}
                      className="
                        h-full
                        rounded-full
                        bg-gradient-to-r
                        from-indigo-600
                        to-cyan-500
                      "
                    />
                  </div>

                  <p
                    className="
                      mt-3
                      text-sm
                      font-semibold
                      text-emerald-600
                    "
                  >
                    {item.growth} YoY Growth
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Executive AI Insight */}
        <div
          className="
            rounded-3xl
            bg-gradient-to-br
            from-slate-900
            via-indigo-900
            to-slate-900
            p-8
            text-white
            shadow-xl
          "
        >
          <Brain size={42} className="text-cyan-300" />

          <h3
            className="
              mt-6
              text-2xl
              font-bold
            "
          >
            Executive AI Insight
          </h3>

          <p
            className="
              mt-5
              leading-8
              text-slate-300
            "
          >
            MetroVision AI forecasts a significant increase in weekday
            passenger demand, particularly across interchange
            stations and the Blue Line corridor. Based on current
            travel trends, proactive train scheduling and platform
            management can reduce crowding while improving passenger
            throughput during evening peak hours.
          </p>

          <div
            className="
              mt-8
              space-y-5
            "
          >
            {[
              "Increase train frequency by 12%",
              "Deploy additional platform staff",
              "Monitor Rajiv Chowk every 5 minutes",
              "Optimize turnaround scheduling",
            ].map((tip) => (
              <div
                key={tip}
                className="
                  flex
                  items-center
                  gap-3
                "
              >
                <div
                  className="
                    h-3
                    w-3
                    rounded-full
                    bg-cyan-400
                  "
                />

                <span className="text-slate-200">{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Executive Forecast Summary */}
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
        }}
        className="
          rounded-3xl
          overflow-hidden
          bg-gradient-to-br
          from-slate-900
          via-indigo-900
          to-slate-900
          p-8
          text-white
          shadow-2xl
        "
      >
        <div
          className="
            flex
            flex-col
            gap-6
            lg:flex-row
            lg:items-start
            lg:justify-between
          "
        >
          <div>
            <div
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-white/10
                px-4
                py-2
              "
            >
              <Brain size={18} />
              <span>Executive Forecast Summary</span>
            </div>

            <h2
              className="
                mt-6
                text-4xl
                font-black
              "
            >
              MetroVision AI Demand Outlook
            </h2>

            <p
              className="
                mt-5
                max-w-3xl
                leading-8
                text-slate-300
              "
            >
              MetroVision AI predicts sustained passenger demand growth
              throughout the upcoming week. Historical travel
              behavior, seasonal trends and live operational signals
              indicate higher passenger volumes during weekday
              evening peaks, requiring proactive scheduling and
              resource allocation.
            </p>
          </div>

          <div
            className="
              rounded-3xl
              bg-white/10
              px-8
              py-6
              text-center
            "
          >
            <p className="text-slate-300">Network Demand Score</p>

            <h2
              className="
                mt-3
                text-5xl
                font-black
              "
            >
              94
            </h2>

            <p
              className="
                mt-2
                text-sm
                text-emerald-300
              "
            >
              Strong Growth
            </p>
          </div>
        </div>

        {/* Executive Metrics */}
        <div
          className="
            mt-10
            grid
            gap-6
            md:grid-cols-2
            xl:grid-cols-4
          "
        >
          {[
            {
              title: "Predicted Passengers",
              value: "648K",
            },
            {
              title: "Demand Growth",
              value: "+11.8%",
            },
            {
              title: "Forecast Accuracy",
              value: "97.8%",
            },
            {
              title: "Operational Saving",
              value: "₹3.4L",
            },
          ].map((metric) => (
            <div
              key={metric.title}
              className="
                rounded-3xl
                bg-white/10
                p-6
              "
            >
              <p className="text-slate-300">{metric.title}</p>

              <h3
                className="
                  mt-3
                  text-3xl
                  font-black
                "
              >
                {metric.value}
              </h3>
            </div>
          ))}
        </div>

        {/* Strategic Recommendations */}
        <div className="mt-10">
          <h3
            className="
              text-2xl
              font-bold
            "
          >
            Strategic Recommendations
          </h3>

          <div
            className="
              mt-6
              grid
              gap-5
              lg:grid-cols-2
            "
          >
            {[
              {
                title: "Increase Peak Capacity",
                description:
                  "Deploy additional trains on Blue and Yellow Lines during evening peak hours.",
              },
              {
                title: "Optimize Crew Scheduling",
                description:
                  "Allocate staff dynamically based on predicted station demand.",
              },
              {
                title: "Passenger Flow Management",
                description:
                  "Use intelligent routing and platform announcements to balance passenger distribution.",
              },
              {
                title: "Real-Time Monitoring",
                description:
                  "Continuously update AI forecasts using live passenger and ticketing data.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  delay: index * 0.08,
                }}
                className="
                  rounded-2xl
                  bg-white/10
                  p-6
                "
              >
                <h4
                  className="
                    text-xl
                    font-bold
                  "
                >
                  {item.title}
                </h4>

                <p
                  className="
                    mt-4
                    leading-7
                    text-slate-300
                  "
                >
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* AI Executive Conclusion */}
        <motion.div
          initial={{
            opacity: 0,
          }}
          whileInView={{
            opacity: 1,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            delay: 0.4,
          }}
          className="
            mt-10
            rounded-3xl
            border
            border-cyan-400/30
            bg-cyan-500/10
            p-8
          "
        >
          <div className="flex gap-5">
            <Brain size={40} className="text-cyan-300" />

            <div>
              <h3
                className="
                  text-2xl
                  font-bold
                "
              >
                AI Executive Conclusion
              </h3>

              <p
                className="
                  mt-5
                  max-w-5xl
                  leading-8
                  text-slate-300
                "
              >
                MetroVision AI estimates that implementing the
                recommended scheduling, staffing and capacity
                optimization strategies can reduce platform crowding,
                improve passenger throughput, and increase operational
                efficiency while maintaining a forecast accuracy above
                97%. Continuous learning from live data will further
                enhance prediction reliability over time.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default DemandForecast;