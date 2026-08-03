import { Save } from "lucide-react";

export default function SettingsHeader() {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

      <div>

        <h1 className="text-4xl font-bold text-slate-900">
          Settings
        </h1>

        <p className="mt-2 text-slate-500">
          Configure MetroVision platform preferences,
          AI services and operational settings.
        </p>

      </div>

      <button className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:shadow-xl">

        <Save size={18} />

        Save Changes

      </button>

    </div>
  );
}