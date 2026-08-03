import {
  AreaChart,
  Area,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import SettingsCard from "./SettingsCard";

const data = [
  { day: "Mon", accuracy: 94 },
  { day: "Tue", accuracy: 95 },
  { day: "Wed", accuracy: 96 },
  { day: "Thu", accuracy: 95 },
  { day: "Fri", accuracy: 97 },
  { day: "Sat", accuracy: 98 },
  { day: "Sun", accuracy: 97 },
];

export default function AIPerformanceChart() {
  return (
    <SettingsCard
      title="Prediction Accuracy"
      description="AI prediction performance over the last 7 days."
    >
      <div className="h-80">

        <ResponsiveContainer width="100%" height="100%">

          <AreaChart data={data}>

            <defs>

              <linearGradient
                id="accuracyGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>

            </defs>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="day" />

            <YAxis domain={[90, 100]} />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="accuracy"
              stroke="#2563eb"
              strokeWidth={3}
              fill="url(#accuracyGradient)"
            />

          </AreaChart>

        </ResponsiveContainer>

      </div>
    </SettingsCard>
  );
}