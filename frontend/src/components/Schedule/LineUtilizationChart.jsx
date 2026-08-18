import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function LineUtilizationChart({
  schedules = [],
  loading = false,
}) {
  const lineCounts = {};

  schedules.forEach((train) => {
    const line = train.line || "Unknown";

    lineCounts[line] =
      (lineCounts[line] || 0) + 1;
  });

  const data = Object.entries(lineCounts)
    .sort(([a], [b]) =>
      a.localeCompare(b)
    )
    .map(([line, trains]) => ({
      line,
      trains,
    }));

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6">

      <h3 className="text-xl font-bold">
        Line Schedule Distribution
      </h3>

      <p className="text-sm text-slate-500 mt-1 mb-6">
        Scheduled trains by metro line
      </p>

      {loading ? (

        <div className="h-[320px] flex items-center justify-center text-slate-500">
          Loading line data...
        </div>

      ) : data.length === 0 ? (

        <div className="h-[320px] flex items-center justify-center text-slate-500">
          No line data available.
        </div>

      ) : (

        <ResponsiveContainer
          width="100%"
          height={320}
        >

          <BarChart data={data}>

            <CartesianGrid
              strokeDasharray="3 3"
            />

            <XAxis dataKey="line" />

            <YAxis
              allowDecimals={false}
            />

            <Tooltip />

            <Bar
              dataKey="trains"
              name="Scheduled Trains"
              fill="#4f46e5"
              radius={[
                8,
                8,
                0,
                0,
              ]}
            />

          </BarChart>

        </ResponsiveContainer>

      )}

    </div>
  );
}

export default LineUtilizationChart;