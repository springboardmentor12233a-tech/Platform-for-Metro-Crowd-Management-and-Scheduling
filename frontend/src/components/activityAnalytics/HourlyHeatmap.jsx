import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function HourlyHeatmap({ data }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Hourly Activity
        </h2>

        <p className="text-sm text-gray-500">
          Number of activities performed during each hour of the day
        </p>
      </div>

      <div className="h-96">

        <ResponsiveContainer width="100%" height="100%">

          <BarChart
            data={data}
            margin={{
              top: 10,
              right: 20,
              left: 0,
              bottom: 10,
            }}
          >

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="hour"
              tick={{ fontSize: 11 }}
            />

            <YAxis />

            <Tooltip
              formatter={(value) => [
                value,
                "Activities",
              ]}
            />

            <Bar
              dataKey="count"
              fill="#8b5cf6"
              radius={[8, 8, 0, 0]}
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}