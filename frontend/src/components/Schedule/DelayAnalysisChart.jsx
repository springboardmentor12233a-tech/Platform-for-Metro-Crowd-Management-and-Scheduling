import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip,
  Cell,
} from "recharts";

const data = [
  { name: "On Time", value: 82 },
  { name: "Delayed", value: 12 },
  { name: "Boarding", value: 6 },
];

const COLORS = [
  "#22c55e",
  "#ef4444",
  "#3b82f6",
];

function DelayAnalysisChart() {
  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6">

      <h3 className="text-xl font-bold mb-6">
        Delay Analysis
      </h3>

      <ResponsiveContainer width="100%" height={320}>
        <PieChart>

          <Pie
            data={data}
            dataKey="value"
            outerRadius={110}
            label
          >
            {data.map((_, index) => (
              <Cell
                key={index}
                fill={COLORS[index]}
              />
            ))}
          </Pie>

          <Tooltip />

        </PieChart>
      </ResponsiveContainer>

    </div>
  );
}

export default DelayAnalysisChart;