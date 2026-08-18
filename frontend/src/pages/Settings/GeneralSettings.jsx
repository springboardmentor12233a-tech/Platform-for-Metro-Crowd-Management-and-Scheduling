import {
  Globe,
  Building2,
  Clock,
  Languages,
} from "lucide-react";

import SettingsCard from "./SettingsCard";

export default function GeneralSettings({
  settings,
  onChange,
}) {

  const handleChange = (field, value) => {

    const updatedSettings = {
      ...settings,
      [field]: value,
    };

    console.log("SETTING CHANGED:", updatedSettings);

    onChange(updatedSettings);
  };

  return (
    <SettingsCard
      title="General Settings"
      description="Configure your MetroVision workspace preferences."
    >

      <div className="grid gap-6">

        {/* Platform Name */}
        <div>

          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
            <Globe size={17} />
            Platform Name
          </label>

          <input
            type="text"
            value={settings.platformName}
            onChange={(e) =>
              handleChange(
                "platformName",
                e.target.value
              )
            }
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

        </div>

        {/* Organisation */}
        <div>

          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
            <Building2 size={17} />
            Organisation
          </label>

          <input
            type="text"
            value={settings.organisation}
            onChange={(e) =>
              handleChange(
                "organisation",
                e.target.value
              )
            }
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

        </div>

        {/* Timezone */}
        <div>

          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
            <Clock size={17} />
            Timezone
          </label>

          <select
            value={settings.timezone}
            onChange={(e) =>
              handleChange(
                "timezone",
                e.target.value
              )
            }
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="Asia/Kolkata">
              Asia/Kolkata
            </option>

            <option value="UTC">
              UTC
            </option>
          </select>

        </div>

        {/* Language */}
        <div>

          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
            <Languages size={17} />
            Language
          </label>

          <select
            value={settings.language}
            onChange={(e) =>
              handleChange(
                "language",
                e.target.value
              )
            }
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="English">
              English
            </option>

            <option value="Hindi">
              Hindi
            </option>
          </select>

        </div>

      </div>

    </SettingsCard>
  );
}