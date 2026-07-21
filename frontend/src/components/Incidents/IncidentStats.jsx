import {
  AlertTriangle,
  ShieldAlert,
  CircleCheck,
  Clock5,
  Users,
} from "lucide-react";

const stats = [
  {
    title: "Active",
    value: 8,
    icon: AlertTriangle,
    color: "text-red-500",
  },
  {
    title: "Critical",
    value: 2,
    icon: ShieldAlert,
    color: "text-orange-500",
  },
  {
    title: "Resolved Today",
    value: 17,
    icon: CircleCheck,
    color: "text-green-500",
  },
  {
    title: "Avg Resolution",
    value: "18 min",
    icon: Clock5,
    color: "text-blue-500",
  },
  {
    title: "Passengers Affected",
    value: "4.8K",
    icon: Users,
    color: "text-purple-500",
  },
];

function IncidentStats() {
  return (
    <div className="grid md:grid-cols-5 gap-5">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="bg-white rounded-2xl shadow border p-5"
          >
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-sm">
                {item.title}
              </span>

              <Icon className={item.color} />
            </div>

            <h2 className="text-3xl font-bold mt-4">
              {item.value}
            </h2>
          </div>
        );
      })}
    </div>
  );
}

export default IncidentStats;