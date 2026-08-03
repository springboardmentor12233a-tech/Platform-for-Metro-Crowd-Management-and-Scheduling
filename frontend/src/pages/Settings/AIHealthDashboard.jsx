import {
  Activity,
  Cpu,
  Database,
  Brain,
} from "lucide-react";

export default function AIHealthDashboard() {
  const services = [
    {
      name: "Passenger Prediction",
      health: 97,
      icon: Brain,
    },
    {
      name: "Recommendation Engine",
      health: 95,
      icon: Cpu,
    },
    {
      name: "Forecast Engine",
      health: 89,
      icon: Activity,
    },
    {
      name: "Model Database",
      health: 100,
      icon: Database,
    },
  ];

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

      <h2 className="text-2xl font-bold text-slate-900">
        AI Health Monitor
      </h2>

      <p className="mt-2 text-slate-500">
        Live health of all AI services.
      </p>

      <div className="mt-8 space-y-6">

        {services.map((service) => {
          const Icon = service.icon;

          return (
            <div key={service.name}>

              <div className="mb-2 flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <Icon
                    className="text-blue-600"
                    size={20}
                  />

                  <span className="font-medium">
                    {service.name}
                  </span>

                </div>

                <span className="font-bold text-blue-600">
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