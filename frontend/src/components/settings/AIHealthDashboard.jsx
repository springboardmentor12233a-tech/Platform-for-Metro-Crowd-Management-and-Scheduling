import {
  Brain,
  Cpu,
  Database,
  Activity,
} from "lucide-react";

const services = [
  {
    name: "Passenger Prediction",
    icon: Brain,
    health: 97,
  },
  {
    name: "Recommendation Engine",
    icon: Cpu,
    health: 95,
  },
  {
    name: "Forecast Engine",
    icon: Activity,
    health: 89,
  },
  {
    name: "AI Database",
    icon: Database,
    health: 100,
  },
];

export default function AIHealthDashboard() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

      <h2 className="text-xl font-bold text-slate-900">
        AI Health Monitor
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        Live status of MetroVision AI services
      </p>

      <div className="mt-6 space-y-6">

        {services.map((service) => {
          const Icon = service.icon;

          return (
            <div key={service.name}>

              <div className="mb-2 flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <Icon
                    size={18}
                    className="text-blue-600"
                  />

                  <span className="font-medium text-slate-700">
                    {service.name}
                  </span>

                </div>

                <span className="font-semibold text-blue-600">
                  {service.health}%
                </span>

              </div>

              <div className="h-3 rounded-full bg-slate-200">

                <div
                  className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-700"
                  style={{
                    width: `${service.health}%`,
                  }}
                />

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}