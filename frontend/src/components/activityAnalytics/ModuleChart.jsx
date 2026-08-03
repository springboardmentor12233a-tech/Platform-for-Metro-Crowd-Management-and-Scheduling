import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function ModuleChart({ data }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

      <div className="mb-6">

        <h2 className="text-xl font-semibold text-gray-800">
          Activity by Module
        </h2>

        <p className="text-sm text-gray-500">
          Distribution of activities across MetroVision modules
        </p>

      </div>

      <div className="h-80">

        <ResponsiveContainer width="100%" height="100%">

          <BarChart data={data}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="module"
              tick={{ fontSize: 12 }}
            />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="count"
              radius={[8, 8, 0, 0]}
              fill="#3b82f6"
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}