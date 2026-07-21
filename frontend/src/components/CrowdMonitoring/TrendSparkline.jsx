import {
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

function TrendSparkline({ trend = [] }) {
  const data = trend.map((value, index) => ({
    time: index,
    value,
  }));

  return (
    <div className="h-16 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="value"
            stroke="#0ea5e9"
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TrendSparkline;