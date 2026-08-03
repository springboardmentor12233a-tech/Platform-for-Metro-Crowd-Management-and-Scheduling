import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

const COLORS = [
  "#2563eb",
  "#3b82f6",
  "#60a5fa",
  "#93c5fd",
  "#bfdbfe",
];

export default function TopUsersChart({ data }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Top Active Users
        </h2>

        <p className="text-sm text-gray-500">
          Users with the highest number of recorded activities
        </p>
      </div>

      <div className="h-80">

        <ResponsiveContainer width="100%" height="100%">

          <BarChart
            data={data}
            layout="vertical"
            margin={{
              top: 5,
              right: 20,
              left: 30,
              bottom: 5,
            }}
          >

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis type="number" />

            <YAxis
              type="category"
              dataKey="user"
              width={120}
              tick={{ fontSize: 12 }}
            />

            <Tooltip />

            <Bar
              dataKey="count"
              radius={[0, 8, 8, 0]}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}