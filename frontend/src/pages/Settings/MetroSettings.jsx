import {
  Train,
  Clock,
  Users,
  Gauge,
} from "lucide-react";

import SettingsCard from "./SettingsCard";

export default function MetroSettings({ onChange }) {
  const handleChange = () => {
    if (onChange) {
      onChange();
    }
  };

  return (
    <SettingsCard
      title="Metro Operations"
      description="Configure operational preferences for MetroVision."
    >
      <div className="grid gap-6">

        {/* Operating Hours */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
            <Clock size={17} />
            Operating Hours
          </label>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="time"
              defaultValue="05:30"
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <input
              type="time"
              defaultValue="23:30"
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* Train Capacity */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
            <Train size={17} />
            Default Train Capacity
          </label>

          <input
            type="number"
            defaultValue="1200"
            min="1"
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Crowd Threshold */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
            <Users size={17} />
            Crowd Alert Threshold
          </label>

          <input
            type="number"
            defaultValue="80"
            min="1"
            max="100"
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          <p className="mt-1 text-xs text-slate-500">
            Percentage of train capacity at which a crowd alert is triggered.
          </p>
        </div>

        {/* Service Frequency */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
            <Gauge size={17} />
            Default Service Frequency
          </label>

          <select
            defaultValue="5"
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="3">Every 3 minutes</option>
            <option value="5">Every 5 minutes</option>
            <option value="7">Every 7 minutes</option>
            <option value="10">Every 10 minutes</option>
          </select>
        </div>

      </div>
    </SettingsCard>
  );
}