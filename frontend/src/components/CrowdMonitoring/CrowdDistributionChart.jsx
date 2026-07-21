import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = ["#22C55E", "#F59E0B", "#EF4444"];

function CrowdDistributionChart({ data }) {
  const chartData = [
    {
      name: "Low",
      value: data.filter((s) => s.crowd_level === "Low").length,
    },
    {
      name: "Medium",
      value: data.filter((s) => s.crowd_level === "Medium").length,
    },
    {
      name: "High",
      value: data.filter((s) => s.crowd_level === "High").length,
    },
  ];

  return (
    <div className="h-[420px] rounded-3xl bg-white p-6 shadow-lg border border-slate-200">

      {/* Header */}

      <div className="mb-6">

        <h2 className="text-2xl font-bold text-slate-900">
          Crowd Distribution
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Live crowd level distribution across all stations
        </p>

      </div>

      <ResponsiveContainer width="100%" height="80%">

        <PieChart>

          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={120}
            paddingAngle={5}
            dataKey="value"
            animationDuration={1200}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index]}
              />
            ))}
          </Pie>

          <Tooltip
            contentStyle={{
              borderRadius: "18px",
              border: "none",
              boxShadow: "0 18px 45px rgba(15,23,42,.12)",
            }}
          />

          <Legend />

        </PieChart>

      </ResponsiveContainer>

    </div>
  );
}

export default CrowdDistributionChart;