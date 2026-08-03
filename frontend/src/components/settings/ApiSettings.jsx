import {
  KeyRound,
  Database,
  MapPinned,
  Cloud,
  Bot,
  Server,
  CheckCircle2,
  Copy,
  RefreshCw,
} from "lucide-react";

import SettingsCard from "./SettingsCard";

const integrations = [
  {
    title: "Gemini AI",
    description: "Google Gemini API",
    status: "Connected",
    key: "AIzaSy•••••••••••••••",
    icon: Bot,
    color: "green",
  },
  {
    title: "Google Maps",
    description: "Maps Platform API",
    status: "Connected",
    key: "AIzaSy•••••••••••••••",
    icon: MapPinned,
    color: "green",
  },
  {
    title: "Weather API",
    description: "OpenWeather Service",
    status: "Connected",
    key: "sk-••••••••••••••",
    icon: Cloud,
    color: "green",
  },
  {
    title: "PostgreSQL",
    description: "Primary Database",
    status: "Healthy",
    key: "Connected",
    icon: Database,
    color: "blue",
  },
  {
    title: "Railway Backend",
    description: "Cloud Deployment",
    status: "Running",
    key: "Online",
    icon: Server,
    color: "blue",
  },
];

export default function ApiSettings() {
  return (
    <div className="space-y-6">

      <SettingsCard
        title="API & Integrations"
        description="Manage external services connected to MetroVision."
      >

        <div className="space-y-5">

          {integrations.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 p-5 transition hover:border-blue-400 hover:shadow-md"
              >

                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                  <div className="flex items-center gap-4">

                    <div
                      className={`rounded-xl p-3 ${
                        item.color === "green"
                          ? "bg-green-100 text-green-600"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      <Icon size={24} />
                    </div>

                    <div>

                      <h3 className="font-semibold text-slate-900">
                        {item.title}
                      </h3>

                      <p className="text-sm text-slate-500">
                        {item.description}
                      </p>

                    </div>

                  </div>

                  <div className="flex flex-wrap items-center gap-3">

                    <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                      {item.status}
                    </span>

                    <div className="rounded-lg border bg-slate-50 px-4 py-2 font-mono text-sm text-slate-700">
                      {item.key}
                    </div>

                    <button className="rounded-xl border p-2 transition hover:bg-slate-100">
                      <Copy size={18} />
                    </button>

                    <button className="rounded-xl border p-2 transition hover:bg-slate-100">
                      <RefreshCw size={18} />
                    </button>

                  </div>

                </div>

              </div>
            );
          })}

        </div>

      </SettingsCard>

      <SettingsCard
        title="System Health"
        description="Current infrastructure status."
      >

        <div className="grid gap-5 md:grid-cols-3">

          <HealthCard
            title="API Gateway"
            value="Operational"
          />

          <HealthCard
            title="Database"
            value="Healthy"
          />

          <HealthCard
            title="AI Services"
            value="Online"
          />

        </div>

      </SettingsCard>

      <div className="flex flex-wrap gap-4">

        <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:scale-105">

          <KeyRound size={18} />

          Generate API Key

        </button>

        <button className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50">

          <CheckCircle2 size={18} />

          Test Connections

        </button>

      </div>

    </div>
  );
}

function HealthCard({ title, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">

      <p className="text-sm text-slate-500">
        {title}
      </p>

      <div className="mt-3 flex items-center gap-2">

        <span className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></span>

        <h3 className="font-semibold text-slate-900">
          {value}
        </h3>

      </div>

    </div>
  );
}