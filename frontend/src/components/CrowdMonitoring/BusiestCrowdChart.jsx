import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function BusiestCrowdChart({ data }) {
  const chartData = [...data]
    .sort((a, b) => b.passengers - a.passengers)
    .slice(0, 10);

  return (
    <div className="h-[420px] rounded-3xl bg-white p-6 shadow-lg border border-slate-200">

      {/* Header */}

      <div className="mb-6">

        <h2 className="text-2xl font-bold text-slate-900">
          Top Busy Stations
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Stations with the highest passenger volume
        </p>

      </div>

      <ResponsiveContainer width="100%" height="80%">

        <BarChart
          data={chartData}
          margin={{
            top: 10,
            right: 20,
            left: 0,
            bottom: 40,
          }}
        >

          <CartesianGrid
            strokeDasharray="4 4"
            vertical={false}
            stroke="#E2E8F0"
          />

          <XAxis
            dataKey="station"
            angle={-25}
            textAnchor="end"
            height={70}
            tick={{
              fontSize: 11,
              fill: "#64748B",
            }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{
              fill: "#64748B",
              fontSize: 12,
            }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            contentStyle={{
              borderRadius: "18px",
              border: "none",
              boxShadow: "0 18px 45px rgba(15,23,42,.12)",
            }}
            formatter={(value) => [
              Number(value).toLocaleString(),
              "Passengers",
            ]}
          />

          <Bar
            dataKey="passengers"
            fill="#4F46E5"
            radius={[8, 8, 0, 0]}
            animationDuration={1500}
          />

        </BarChart>

      </ResponsiveContainer>

    </div>
  );
}

export default BusiestCrowdChart;