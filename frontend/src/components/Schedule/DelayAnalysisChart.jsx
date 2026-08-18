import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip,
  Cell,
  Legend,
} from "recharts";

const COLORS = [
  "#22c55e",
  "#ef4444",
  "#3b82f6",
];

function DelayAnalysisChart({
  schedules = [],
  loading = false,
}) {
  const statusCounts = {};

  schedules.forEach((train) => {
    const status =
      train.status || "Unknown";

    statusCounts[status] =
      (statusCounts[status] || 0) + 1;
  });

  const data = Object.entries(statusCounts).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6">

      <h3 className="text-xl font-bold">
        Delay Analysis
      </h3>

      <p className="text-sm text-slate-500 mt-1 mb-6">
        Current train status distribution
      </p>

      {loading ? (

        <div className="h-[320px] flex items-center justify-center text-slate-500">
          Loading status data...
        </div>

      ) : data.length === 0 ? (

        <div className="h-[320px] flex items-center justify-center text-slate-500">
          No status data available.
        </div>

      ) : (

        <ResponsiveContainer
          width="100%"
          height={320}
        >

          <PieChart>

            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={110}
              label={({ name, value }) =>
                `${name}: ${value}`
              }
            >

              {data.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={
                    entry.name === "On Time"
                      ? "#22c55e"
                      : entry.name === "Delayed"
                      ? "#ef4444"
                      : entry.name === "Boarding"
                      ? "#3b82f6"
                      : COLORS[
                          index %
                            COLORS.length
                        ]
                  }
                />
              ))}

            </Pie>

            <Tooltip />

            <Legend />

          </PieChart>

        </ResponsiveContainer>

      )}

    </div>
  );
}

export default DelayAnalysisChart;