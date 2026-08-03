import {
  Brain,
  Database,
  Server,
  Activity,
} from "lucide-react";

const services = [
  {
    icon: Brain,
    title: "AI Engine",
    value: "Online",
    color: "text-green-600",
  },
  {
    icon: Database,
    title: "Database",
    value: "Healthy",
    color: "text-green-600",
  },
  {
    icon: Server,
    title: "Backend",
    value: "Running",
    color: "text-blue-600",
  },
  {
    icon: Activity,
    title: "CPU Usage",
    value: "28%",
    color: "text-orange-500",
  },
];

export default function SystemStatusCard() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

      <h3 className="text-xl font-bold text-slate-900">
        System Status
      </h3>

      <div className="mt-6 space-y-5">

        {services.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">

                <Icon
                  className="text-blue-600"
                  size={18}
                />

                <span>{item.title}</span>

              </div>

              <span className={`font-semibold ${item.color}`}>
                {item.value}
              </span>

            </div>
          );
        })}

      </div>

    </div>
  );
}