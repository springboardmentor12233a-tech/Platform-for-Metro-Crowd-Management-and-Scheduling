import { motion } from "framer-motion";

import {
  Users,
  Train,
  IndianRupee,
  Building2,
  Clock3,
  Target,
  BrainCircuit,
  Zap,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

const kpiConfig = [
  {
    title: "Total Passengers",
    key: "total_passengers",
    icon: Users,
    color: "cyan",
    trend: "+8.4%",
    positive: true,
    formatter: (value) => value?.toLocaleString() ?? "0",
  },
  {
    title: "Total Trips",
    key: "total_trips",
    icon: Train,
    color: "indigo",
    trend: "+5.1%",
    positive: true,
    formatter: (value) => value?.toLocaleString() ?? "0",
  },
  {
    title: "Total Revenue",
    key: "total_revenue",
    icon: IndianRupee,
    color: "emerald",
    trend: "+12.8%",
    positive: true,
    formatter: (value) => `₹ ${value?.toLocaleString() ?? "0"}`,
  },
  {
    title: "Active Stations",
    key: "total_stations",
    icon: Building2,
    color: "violet",
    trend: "100%",
    positive: true,
    formatter: (value) => value ?? "0",
  },
  {
    title: "Average Delay",
    key: "avg_delay",
    icon: Clock3,
    color: "amber",
    trend: "-18%",
    positive: true,
    formatter: (value) => `${value ?? 2.4} min`,
  },
  {
    title: "On-Time Performance",
    key: "otp",
    icon: Target,
    color: "blue",
    trend: "+2.3%",
    positive: true,
    formatter: (value) => `${value ?? 97}%`,
  },
  {
    title: "AI Prediction Accuracy",
    key: "accuracy",
    icon: BrainCircuit,
    color: "pink",
    trend: "+1.2%",
    positive: true,
    formatter: (value) => `${value ?? 96.5}%`,
  },
  {
    title: "Network Efficiency",
    key: "efficiency",
    icon: Zap,
    color: "green",
    trend: "+3.6%",
    positive: true,
    formatter: (value) => `${value ?? 94}%`,
  },
];

const colorClasses = {
  cyan: {
    accent: "bg-cyan-500",
    bg: "bg-cyan-100",
    text: "text-cyan-600",
    glow: "bg-cyan-100",
  },
  indigo: {
    accent: "bg-indigo-500",
    bg: "bg-indigo-100",
    text: "text-indigo-600",
    glow: "bg-indigo-100",
  },
  emerald: {
    accent: "bg-emerald-500",
    bg: "bg-emerald-100",
    text: "text-emerald-600",
    glow: "bg-emerald-100",
  },
  violet: {
    accent: "bg-violet-500",
    bg: "bg-violet-100",
    text: "text-violet-600",
    glow: "bg-violet-100",
  },
  amber: {
    accent: "bg-amber-500",
    bg: "bg-amber-100",
    text: "text-amber-600",
    glow: "bg-amber-100",
  },
  blue: {
    accent: "bg-blue-500",
    bg: "bg-blue-100",
    text: "text-blue-600",
    glow: "bg-blue-100",
  },
  pink: {
    accent: "bg-pink-500",
    bg: "bg-pink-100",
    text: "text-pink-600",
    glow: "bg-pink-100",
  },
  green: {
    accent: "bg-green-500",
    bg: "bg-green-100",
    text: "text-green-600",
    glow: "bg-green-100",
  },
};

function AnalyticsKPIs({ summary = {} }) {
  return (
    <section
      className="
        mt-8
        grid
        gap-6
        sm:grid-cols-2
        xl:grid-cols-4
      "
    >      {kpiConfig.map((item, index) => {

        const Icon = item.icon;

        const value = summary[item.key];

        const colors = colorClasses[item.color];

        return (

          <motion.div
            key={item.key}
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: index * 0.08,
              duration: 0.45,
            }}
            whileHover={{
              y: -6,
            }}
            className="
              group
              relative
              overflow-hidden
              rounded-3xl
              border
              border-slate-200
              bg-white
              p-6
              shadow-sm
              transition-all
              duration-300
              hover:shadow-xl
            "
          >

            {/* Top Accent */}

            <div
              className={`
                absolute
                left-0
                top-0
                h-1
                w-full
                ${colors.accent}
              `}
            />

            {/* Background Glow */}

            <div
              className={`
                absolute
                -right-10
                -top-10
                h-32
                w-32
                rounded-full
                ${colors.glow}
                opacity-50
                blur-3xl
                transition-all
                duration-500
                group-hover:scale-125
              `}
            />

            <div className="relative z-10">

              <div className="flex items-start justify-between">

                <div
                  className={`
                    rounded-2xl
                    ${colors.bg}
                    p-3
                  `}
                >

                  <Icon
                    size={24}
                    className={`${colors.text}`}
                  />

                </div>

                <div
                  className={`
                    flex
                    items-center
                    gap-1
                    rounded-full
                    px-3
                    py-1
                    text-xs
                    font-semibold
                    ${
                      item.positive
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }
                  `}
                >

                  {item.positive ? (
                    <TrendingUp size={14} />
                  ) : (
                    <TrendingDown size={14} />
                  )}

                  {item.trend}

                </div>

              </div>
                        <div className="mt-6">

                <p
                  className="
                    text-sm
                    font-medium
                    text-slate-500
                  "
                >
                  {item.title}
                </p>

                <h2
                  className="
                    mt-2
                    text-3xl
                    font-black
                    tracking-tight
                    text-slate-900
                  "
                >
                  {item.formatter(value)}
                </h2>

              </div>

              <div
                className="
                  mt-6
                  flex
                  items-center
                  justify-between
                "
              >

                <div>

                  <p className="text-xs uppercase tracking-wider text-slate-400">
                    Status
                  </p>

                  <p className="mt-1 text-sm font-semibold text-emerald-600">
                    Operational
                  </p>

                </div>

                <div className="text-right">

                  <p className="text-xs uppercase tracking-wider text-slate-400">
                    Updated
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    Live
                  </p>

                </div>

              </div>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  delay: 0.2 + index * 0.08,
                  duration: 0.8,
                }}
                className="
                  mt-6
                  h-1
                  origin-left
                  rounded-full
                  bg-gradient-to-r
                  from-indigo-500
                  via-cyan-500
                  to-emerald-500
                "
              />

            </div>

          </motion.div>

        );

      })}
          </section>
  );
}

export default AnalyticsKPIs;