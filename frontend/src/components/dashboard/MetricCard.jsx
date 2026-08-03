import { motion } from "framer-motion";

function formatValue(value, prefix = "") {
  // Handle null/undefined
  if (value === null || value === undefined) {
    return `${prefix}0`;
  }

  // If already a formatted string (contains commas or ₹), return it
  if (typeof value === "string") {
    if (value.includes(",") || value.includes("₹")) {
      return value;
    }

    value = value.replace(/,/g, "").replace("₹", "").trim();
  }

  const number = Number(value);

  // Invalid number
  if (Number.isNaN(number)) {
    return `${prefix}0`;
  }

  // Indian Currency Formatting
  if (prefix === "₹ ") {
    if (number >= 10000000) {
      return `${prefix}${(number / 10000000).toFixed(2)} Cr`;
    }

    if (number >= 100000) {
      return `${prefix}${(number / 100000).toFixed(2)} L`;
    }

    return `${prefix}${number.toLocaleString("en-IN")}`;
  }

  return `${prefix}${number.toLocaleString("en-IN")}`;
}

function MetricCard({
  title,
  value,
  icon: Icon,
  iconBg,
  iconColor,
  trend,
  trendColor,
  prefix = "",
}) {
  const gradientId = title.replace(/\s+/g, "-").toLowerCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -8,
        scale: 1.02,
      }}
      transition={{ duration: 0.3 }}
      className="
        relative
        overflow-hidden
        rounded-[28px]
        border
        border-slate-200
        bg-white
        shadow-lg
        hover:shadow-2xl
        transition-all
        duration-300
        h-[220px]
        p-6
      "
    >
      {/* Top Gradient */}
      <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />

      {/* Decorative Glow */}
      <div
        className={`absolute -right-10 -top-10 h-28 w-28 rounded-full blur-3xl opacity-10 ${iconBg}`}
      />

      {/* Header */}
      <div className="flex items-center gap-4">
        <motion.div
          whileHover={{
            rotate: -8,
            scale: 1.1,
          }}
          transition={{
            type: "spring",
            stiffness: 260,
          }}
          className={`
            ${iconBg}
            flex
            h-14
            w-14
            shrink-0
            items-center
            justify-center
            rounded-2xl
            shadow-lg
          `}
        >
          <Icon className={`h-7 w-7 ${iconColor}`} />
        </motion.div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[2px] text-slate-400">
            {title}
          </p>
        </div>
      </div>

      {/* Value */}
      <div className="mt-6">
        <h2
          className="
            whitespace-nowrap
            text-[28px]
            font-black
            leading-none
            tracking-tight
            text-slate-800
            lg:text-[32px]
            xl:text-[36px]
          "
        >
          {formatValue(value, prefix)}
        </h2>
      </div>

      {/* Footer */}
      <div className="absolute bottom-5 left-6 right-6 flex items-end justify-between">
        <div className="flex flex-col gap-2">
          <span
            className={`
              inline-flex
              w-fit
              items-center
              rounded-full
              bg-green-100
              px-3
              py-1
              text-xs
              font-bold
              ${trendColor}
            `}
          >
            ↑ {trend}
          </span>

          <span className="text-sm text-slate-400">
            vs last month
          </span>
        </div>

        {/* Sparkline */}
        <motion.svg
          width="88"
          height="42"
          viewBox="0 0 88 42"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <defs>
            <linearGradient
              id={gradientId}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop
                offset="0%"
                stopColor="currentColor"
                stopOpacity="0.2"
                className={iconColor}
              />

              <stop
                offset="100%"
                stopColor="currentColor"
                className={iconColor}
              />
            </linearGradient>
          </defs>

          <motion.path
            d="
              M4 35
              L16 32
              L28 18
              L40 22
              L52 8
              L64 14
              L76 9
            "
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.3 }}
          />

          <motion.circle
            cx="76"
            cy="9"
            r="3.5"
            fill="currentColor"
            className={iconColor}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1 }}
          />
        </motion.svg>
      </div>
    </motion.div>
  );
}

export default MetricCard;