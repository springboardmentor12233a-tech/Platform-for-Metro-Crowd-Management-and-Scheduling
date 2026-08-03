import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import SettingsCard from "./SettingsCard";

const data = [
  {
    name: "Prediction",
    value: 42,
  },
  {
    name: "Scheduling",
    value: 28,
  },
  {
    name: "Recommendations",
    value: 18,
  },
  {
    name: "Alerts",
    value: 12,
  },
];

const COLORS = [
  "#2563EB",
  "#7C3AED",
  "#06B6D4",
  "#10B981",
];

export default function AIWorkloadChart() {
  return (
    <SettingsCard
      title="AI Workload Distribution"
      description="Current AI task allocation."
    >
      <div className="h-80">

        <ResponsiveContainer>

          <PieChart>

            <Pie
              data={data}
              innerRadius={70}
              outerRadius={110}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index]}
                />
              ))}
            </Pie>

            <Tooltip />

            <Legend />

          </PieChart>

        </ResponsiveContainer>

      </div>
    </SettingsCard>
  );
}