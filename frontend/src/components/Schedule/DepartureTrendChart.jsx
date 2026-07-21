import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const data = [
  { hour: "06", trains: 18 },
  { hour: "07", trains: 28 },
  { hour: "08", trains: 40 },
  { hour: "09", trains: 35 },
  { hour: "10", trains: 24 },
  { hour: "11", trains: 20 },
  { hour: "12", trains: 22 },
];

function DepartureTrendChart() {
  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6">

      <h3 className="text-xl font-bold mb-6">
        Hourly Departures
      </h3>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="hour" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="trains"
            stroke="#4f46e5"
            strokeWidth={3}
          />

        </LineChart>
      </ResponsiveContainer>

    </div>
  );
}

export default DepartureTrendChart;