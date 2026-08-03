import {
  Brain,
  Clock3,
  Zap,
  TrendingUp,
} from "lucide-react";

const stats = [
  {
    title: "Predictions Today",
    value: "18,453",
    icon: Brain,
  },
  {
    title: "Average Latency",
    value: "185 ms",
    icon: Clock3,
  },
  {
    title: "Inference Queue",
    value: "12",
    icon: Zap,
  },
  {
    title: "Accuracy",
    value: "97%",
    icon: TrendingUp,
  },
];

export default function AIStatistics() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">

              <Icon
                className="text-blue-600"
                size={22}
              />

              <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600">
                Live
              </span>

            </div>

            <h2 className="mt-6 text-4xl font-bold text-slate-900">
              {stat.value}
            </h2>

            <p className="mt-2 text-slate-500">
              {stat.title}
            </p>

          </div>
        );
      })}

    </div>
  );
}