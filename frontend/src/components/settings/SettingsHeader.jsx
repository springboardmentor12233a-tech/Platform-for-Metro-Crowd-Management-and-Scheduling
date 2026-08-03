import { Save } from "lucide-react";

export default function SettingsHeader() {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

      <div>

        <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
          MetroVision Control Center
        </span>

        <h1 className="mt-4 text-4xl font-bold text-slate-900">
          Settings
        </h1>

        <p className="mt-2 max-w-2xl text-slate-500">
          Configure platform preferences, AI behaviour,
          security policies and operational settings.
        </p>

      </div>

      <button className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:scale-105">

        <Save size={18} />

        Save Changes

      </button>

    </div>
  );
}