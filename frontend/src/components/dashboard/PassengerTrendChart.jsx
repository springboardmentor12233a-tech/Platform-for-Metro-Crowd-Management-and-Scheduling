import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function PassengerTrendChart({ data }) {
  return (
    <div className="h-full flex flex-col">

      {/* Header */}

      <div className="flex items-center justify-between mb-6">

        <div>

          <h2 className="text-[30px] font-bold tracking-tight text-slate-900">
            Passenger Trend
          </h2>

          <p className="text-slate-500 mt-1 text-sm">
            Monthly passenger movement analytics
          </p>

        </div>

        <button
          className="
          px-4
          py-2
          rounded-xl
          bg-white/80
          backdrop-blur-md
          border
          border-slate-200
          shadow-sm
          hover:shadow-md
          hover:bg-slate-50
          transition-all
          duration-300
          "
        >
          Monthly ▼
        </button>

      </div>

      {/* Chart */}

      <div className="flex-1">

        <ResponsiveContainer width="100%" height="100%">

          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 25,
              left: 5,
              bottom: 0,
            }}
          >

            {/* Gradient */}

            <defs>

              <linearGradient
                id="passengerGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >

                <stop
                  offset="0%"
                  stopColor="#4F46E5"
                  stopOpacity={0.45}
                />

                <stop
                  offset="40%"
                  stopColor="#6366F1"
                  stopOpacity={0.18}
                />

                <stop
                  offset="100%"
                  stopColor="#6366F1"
                  stopOpacity={0}
                />

              </linearGradient>

            </defs>

            {/* Grid */}

            <CartesianGrid
              vertical={false}
              stroke="#E2E8F0"
              strokeDasharray="4 4"
            />

            {/* X Axis */}

            <XAxis
              dataKey="date"
              tick={{
                fill: "#64748B",
                fontSize: 12,
              }}
              tickMargin={10}
              tickLine={false}
              axisLine={false}
            />

            {/* Y Axis */}

            <YAxis
              width={55}
              tick={{
                fill: "#64748B",
                fontSize: 12,
              }}
              tickLine={false}
              axisLine={false}
            />

            {/* Tooltip */}

            <Tooltip
              cursor={{
                stroke: "#4F46E5",
                strokeDasharray: "4 4",
              }}
              contentStyle={{
                borderRadius: "18px",
                border: "none",
                background: "#ffffff",
                boxShadow: "0 18px 45px rgba(15,23,42,.12)",
                padding: "12px 16px",
              }}
              labelStyle={{
                fontWeight: 700,
                color: "#0F172A",
                marginBottom: "6px",
              }}
              formatter={(value) => [
                Number(value).toLocaleString(),
                "Passengers",
              ]}
            />

            {/* Area */}

            <Area
              type="monotone"
              dataKey="passengers"
              stroke="#4F46E5"
              strokeWidth={4}
              fill="url(#passengerGradient)"
              animationDuration={1800}
              dot={false}
              activeDot={{
                r: 7,
                fill: "#4F46E5",
                stroke: "#ffffff",
                strokeWidth: 3,
              }}
            />

          </AreaChart>

        </ResponsiveContainer>

      </div>

      {/* Footer */}

      <div className="flex items-center justify-between mt-5 border-t border-slate-100 pt-4">

        <div>

          <p className="text-xs uppercase tracking-wider text-slate-400">
            Trend
          </p>

          <p className="font-semibold text-slate-800">
            Passenger Growth
          </p>

        </div>

        <div className="flex items-center gap-2 rounded-full bg-green-100 px-4 py-2">

          <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />

          <span className="font-semibold text-green-700">
            +12.5%
          </span>

        </div>

      </div>

    </div>
  );
}

export default PassengerTrendChart;