import {
  Building2,
  Globe,
  Clock3,
  Languages,
} from "lucide-react";

import SettingsCard from "./SettingsCard";

export default function GeneralSettings({ onChange }) {
  return (
    <SettingsCard
      title="General Settings"
      description="Configure your MetroVision workspace preferences."
    >
      <div className="grid gap-6">

        <InputField
          icon={Globe}
          label="Platform Name"
          defaultValue="MetroVision AI"
          onChange={onChange}
        />

        <InputField
          icon={Building2}
          label="Organisation"
          defaultValue="Delhi Metro Rail Corporation"
          onChange={onChange}
        />

        <SelectField
          icon={Clock3}
          label="Timezone"
          options={[
            "Asia/Kolkata",
            "UTC",
            "Asia/Singapore",
          ]}
          onChange={onChange}
        />

        <SelectField
          icon={Languages}
          label="Language"
          options={[
            "English",
            "Hindi",
          ]}
          onChange={onChange}
        />

      </div>
    </SettingsCard>
  );
}

function InputField({
  icon: Icon,
  label,
  defaultValue,
  onChange,
}) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-2 font-medium text-slate-700">
        <Icon size={18} />
        {label}
      </label>

      <input
        defaultValue={defaultValue}
        onChange={onChange}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      />
    </div>
  );
}

function SelectField({
  icon: Icon,
  label,
  options,
  onChange,
}) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-2 font-medium text-slate-700">
        <Icon size={18} />
        {label}
      </label>

      <select
        onChange={onChange}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      >
        {options.map((item) => (
          <option key={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
}