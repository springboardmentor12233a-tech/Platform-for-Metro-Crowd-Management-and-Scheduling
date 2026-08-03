import {
  Shield,
  Lock,
  Clock3,
  Smartphone,
  Bell,
  Monitor,
  ShieldCheck,
} from "lucide-react";

import SettingsCard from "./SettingsCard";
import ToggleSwitch from "./ToggleSwitch";

export default function SecuritySettings({ onChange }) {
  return (
    <div className="space-y-6">

      {/* Security Configuration */}

      <SettingsCard
        title="Security Settings"
        description="Manage authentication, sessions and account protection."
      >

        <div className="space-y-5">

          <ToggleSwitch
            title="Multi-Factor Authentication"
            description="Require a verification code during login."
            defaultEnabled
            onChange={onChange}
          />

          <ToggleSwitch
            title="Login Alerts"
            description="Receive an email whenever a new device signs in."
            defaultEnabled
            onChange={onChange}
          />

          <ToggleSwitch
            title="Allow Multiple Sessions"
            description="Permit multiple active logins."
            onChange={onChange}
          />

          <ToggleSwitch
            title="Auto Logout"
            description="Automatically logout inactive users."
            defaultEnabled
            onChange={onChange}
          />

        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">

          <SelectField
            icon={Clock3}
            label="Session Timeout"
            options={[
              "15 Minutes",
              "30 Minutes",
              "1 Hour",
              "2 Hours",
            ]}
            onChange={onChange}
          />

          <SelectField
            icon={Lock}
            label="Password Expiry"
            options={[
              "30 Days",
              "60 Days",
              "90 Days",
              "Never",
            ]}
            onChange={onChange}
          />

        </div>

      </SettingsCard>

      {/* Security Information */}

      <SettingsCard
        title="Account Security"
        description="Current security status."
      >

        <div className="grid gap-5 md:grid-cols-2">

          <StatusCard
            icon={Shield}
            title="Last Password Change"
            value="2 Days Ago"
            color="green"
          />

          <StatusCard
            icon={Monitor}
            title="Trusted Devices"
            value="5 Devices"
            color="blue"
          />

          <StatusCard
            icon={Smartphone}
            title="Last Login"
            value="Today • 10:42 AM"
            color="green"
          />

          <StatusCard
            icon={Bell}
            title="Security Alerts"
            value="Enabled"
            color="amber"
          />

        </div>

      </SettingsCard>

      {/* Action Buttons */}

      <div className="flex flex-wrap gap-4">

        <button className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:scale-105">
          Save Security Settings
        </button>

        <button className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50">
          View Login History
        </button>

      </div>

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

function StatusCard({
  icon: Icon,
  title,
  value,
  color,
}) {

  const colors = {
    green: "bg-green-100 text-green-700",
    blue: "bg-blue-100 text-blue-700",
    amber: "bg-amber-100 text-amber-700",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">

      <div className="flex items-center gap-3">

        <div className={`rounded-xl p-3 ${colors[color]}`}>

          <Icon size={20} />

        </div>

        <div>

          <p className="text-sm text-slate-500">

            {title}

          </p>

          <h3 className="font-semibold text-slate-900">

            {value}

          </h3>

        </div>

      </div>

    </div>
  );
}