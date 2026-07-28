import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
} from "recharts";

import {
  Brain,
  Activity,
  Gauge,
  Cpu,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";

const chartData = [
  { time: "06:00", passengers: 120 },
  { time: "08:00", passengers: 420 },
  { time: "10:00", passengers: 310 },
  { time: "12:00", passengers: 580 },
  { time: "14:00", passengers: 460 },
  { time: "16:00", passengers: 760 },
  { time: "18:00", passengers: 920 },
  { time: "20:00", passengers: 630 },
];

function Metric({ icon: Icon, title, value, color }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-5 border border-slate-200">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-slate-500">
            {title}
          </p>

          <h3 className="mt-2 text-2xl font-bold">
            {value}
          </h3>

        </div>

        <div className={`rounded-xl p-3 ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>

      </div>

    </div>
  );
}

export default function PredictionAnalytics({
  prediction,
}) {

  const confidence =
    prediction === null
      ? 0
      : Math.min(
          98,
          88 + Math.round(prediction / 5)
        );

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-3">

      {/* Forecast */}

      <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">

        <div className="mb-8 flex items-center justify-between">

          <div>

            <h2 className="text-2xl font-bold">
              Passenger Forecast
            </h2>

            <p className="text-slate-500">
              Predicted demand throughout the day
            </p>

          </div>

          <TrendingUp className="h-8 w-8 text-indigo-600" />

        </div>

        <ResponsiveContainer width="100%" height={320}>

          <AreaChart data={chartData}>

            <defs>

              <linearGradient
                id="forecast"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >

                <stop
                  offset="0%"
                  stopColor="#6366F1"
                  stopOpacity={0.8}
                />

                <stop
                  offset="100%"
                  stopColor="#6366F1"
                  stopOpacity={0}
                />

              </linearGradient>

            </defs>

            <XAxis dataKey="time" />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="passengers"
              stroke="#6366F1"
              strokeWidth={3}
              fill="url(#forecast)"
            />

          </AreaChart>

        </ResponsiveContainer>

      </div>

      {/* AI Metrics */}

      <div className="space-y-5">

        <Metric
          icon={Brain}
          title="AI Confidence"
          value={`${confidence}%`}
          color="bg-violet-600"
        />

        <Metric
          icon={Cpu}
          title="Model"
          value="Random Forest"
          color="bg-indigo-600"
        />

        <Metric
          icon={Activity}
          title="Inference"
          value="43 ms"
          color="bg-emerald-600"
        />

        <Metric
          icon={ShieldCheck}
          title="Status"
          value="Healthy"
          color="bg-blue-600"
        />

      </div>

      {/* Circular Gauge */}

      <div className="lg:col-span-3 rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">

        <div className="mb-6 flex items-center justify-between">

          <div>

            <h2 className="text-2xl font-bold">
              AI Confidence Gauge
            </h2>

            <p className="text-slate-500">
              Prediction reliability score
            </p>

          </div>

          <Gauge className="h-8 w-8 text-indigo-600" />

        </div>

        <div className="flex flex-col items-center">

          <div className="relative h-56 w-56">

            <svg
              viewBox="0 0 120 120"
              className="h-full w-full -rotate-90"
            >

              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="#E2E8F0"
                strokeWidth="10"
                fill="none"
              />

              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="#6366F1"
                strokeWidth="10"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="314"
                strokeDashoffset={
                  314 -
                  (314 * confidence) / 100
                }
              />

            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">

              <h2 className="text-5xl font-black text-indigo-600">

                {confidence}%

              </h2>

              <p className="mt-2 text-slate-500">

                Reliable

              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}