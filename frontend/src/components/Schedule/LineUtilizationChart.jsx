import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const data = [
  { line: "Blue", utilization: 92 },
  { line: "Yellow", utilization: 88 },
  { line: "Red", utilization: 75 },
  { line: "Green", utilization: 64 },
  { line: "Magenta", utilization: 81 },
];

function LineUtilizationChart() {
  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6">

      <h3 className="text-xl font-bold mb-6">
        Line Utilization
      </h3>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="line" />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="utilization"
            fill="#4f46e5"
            radius={[8, 8, 0, 0]}
          />

        </BarChart>
      </ResponsiveContainer>

    </div>
  );
}

export default LineUtilizationChart;