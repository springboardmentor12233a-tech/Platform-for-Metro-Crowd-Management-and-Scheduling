import {
  Brain,
  Users,
  Activity,
  Zap,
  TrendingUp,
  Clock,
} from "lucide-react";

const cards = [
  {
    title: "Predictions Today",
    value: "2,847",
    change: "+18%",
    icon: Users,
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Model Accuracy",
    value: "96.4%",
    change: "+0.8%",
    icon: Brain,
    color: "from-violet-500 to-purple-600",
  },
  {
    title: "AI Confidence",
    value: "97%",
    change: "+2%",
    icon: Activity,
    color: "from-emerald-500 to-green-600",
  },
  {
    title: "Inference Time",
    value: "42 ms",
    change: "-6%",
    icon: Zap,
    color: "from-amber-500 to-orange-500",
  },
  {
    title: "Forecast Trend",
    value: "High",
    change: "+12%",
    icon: TrendingUp,
    color: "from-pink-500 to-rose-500",
  },
  {
    title: "Live Status",
    value: "ONLINE",
    change: "Realtime",
    icon: Clock,
    color: "from-indigo-500 to-sky-500",
  },
];

function PredictionCard({
  title,
  value,
  change,
  icon: Icon,
  color,
}) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">

      <div
        className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${color}`}
      />

      <div className="p-6">

        <div className="flex items-start justify-between">

          <div>

            <p className="text-sm text-slate-500">
              {title}
            </p>

            <h2 className="mt-4 text-3xl font-bold text-slate-900">
              {value}
            </h2>

            <span className="mt-3 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
              {change}
            </span>

          </div>

          <div
            className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${color} shadow-lg`}
          >
            <Icon className="h-7 w-7 text-white" />
          </div>

        </div>

      </div>

    </div>
  );
}

export default function PredictionKPIs() {
  return (
    <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-6">
      {cards.map((card) => (
        <PredictionCard
          key={card.title}
          {...card}
        />
      ))}
    </div>
  );
}