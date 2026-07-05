import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";

function RevenueChart({ data }) {
  const totalRevenue = data.reduce(
    (sum, item) => sum + item.revenue,
    0
  );

  const avgRevenue = Math.round(totalRevenue / data.length);

  return (
    <div className="h-full flex flex-col">

      {/* Header */}

      <div className="flex items-start justify-between mb-5">

        <div>

          <h2 className="text-[30px] font-bold text-slate-900">
            Revenue Analysis
          </h2>

          <p className="text-slate-500 mt-1">
            Monthly revenue generated
          </p>

        </div>

        <button
          className="
          px-4
          py-2
          rounded-xl
          border
          border-slate-200
          bg-white
          shadow-sm
          hover:shadow-md
          hover:bg-slate-50
          transition-all
          "
        >
          Monthly ▼
        </button>

      </div>

      {/* KPI */}

      <div className="flex gap-4 mb-6">

        <div
          className="
          rounded-2xl
          bg-emerald-50
          px-5
          py-3
          border
          border-emerald-100
          "
        >

          <p className="text-xs uppercase text-emerald-600 font-semibold">
            Average
          </p>

          <p className="text-xl font-bold text-slate-900 mt-1">
            ₹ {avgRevenue.toLocaleString()}
          </p>

        </div>

        <div
          className="
          rounded-2xl
          bg-indigo-50
          px-5
          py-3
          border
          border-indigo-100
          "
        >

          <p className="text-xs uppercase text-indigo-600 font-semibold">
            Total
          </p>

          <p className="text-xl font-bold text-slate-900 mt-1">
            ₹ {(totalRevenue / 10000000).toFixed(2)} Cr
          </p>

        </div>

      </div>

      {/* Chart */}

      <div className="flex-1">

        <ResponsiveContainer width="100%" height="100%">

          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 15,
              left: -10,
              bottom: 0,
            }}
          >

            <CartesianGrid
              strokeDasharray="4 4"
              vertical={false}
              stroke="#E2E8F0"
            />

            <XAxis
              dataKey="date"
              tick={{
                fill: "#64748B",
                fontSize: 12,
              }}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              tick={{
                fill: "#64748B",
                fontSize: 12,
              }}
              tickLine={false}
              axisLine={false}
              width={55}
            />

            <Tooltip
              cursor={{
                fill: "#EEF2FF",
              }}
              contentStyle={{
                borderRadius: "18px",
                border: "none",
                boxShadow:
                  "0 15px 35px rgba(0,0,0,.12)",
              }}
              formatter={(value) => [
                `₹ ${Number(value).toLocaleString()}`,
                "Revenue",
              ]}
            />

            <Bar
              dataKey="revenue"
              radius={[10, 10, 0, 0]}
              maxBarSize={18}
            >

              {data.map((entry, index) => (

                <Cell
                  key={index}
                  fill="#22C55E"
                />

              ))}

            </Bar>

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}

export default RevenueChart;