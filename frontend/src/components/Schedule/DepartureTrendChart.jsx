import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function DepartureTrendChart({
  schedules = [],
  loading = false,
}) {
  const hourlyCounts = {};

  schedules.forEach((train) => {
    if (!train.departure_time) return;

    const hour = String(
      train.departure_time
    ).substring(0, 2);

    hourlyCounts[hour] =
      (hourlyCounts[hour] || 0) + 1;
  });

  const data = Object.entries(hourlyCounts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([hour, trains]) => ({
      hour: `${hour}:00`,
      trains,
    }));

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6">

      <h3 className="text-xl font-bold">
        Hourly Departures
      </h3>

      <p className="text-sm text-slate-500 mt-1 mb-6">
        Scheduled departures from PostgreSQL
      </p>

      {loading ? (

        <div className="h-[320px] flex items-center justify-center text-slate-500">
          Loading departure data...
        </div>

      ) : data.length === 0 ? (

        <div className="h-[320px] flex items-center justify-center text-slate-500">
          No departure data available.
        </div>

      ) : (

        <ResponsiveContainer
          width="100%"
          height={320}
        >

          <LineChart data={data}>

            <CartesianGrid
              strokeDasharray="3 3"
            />

            <XAxis dataKey="hour" />

            <YAxis
              allowDecimals={false}
            />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="trains"
              stroke="#4f46e5"
              strokeWidth={3}
              dot={{ r: 4 }}
            />

          </LineChart>

        </ResponsiveContainer>

      )}

    </div>
  );
}

export default DepartureTrendChart;