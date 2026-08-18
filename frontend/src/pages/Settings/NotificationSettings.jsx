import { useState } from "react";
import {
  Bell,
  Mail,
  AlertTriangle,
  Train,
} from "lucide-react";

import SettingsCard from "./SettingsCard";

export default function NotificationSettings({ onChange }) {
  const [settings, setSettings] = useState({
    pushNotifications: true,
    emailNotifications: true,
    crowdAlerts: true,
    metroAlerts: true,
  });

  const handleChange = (field) => {
    setSettings((previous) => ({
      ...previous,
      [field]: !previous[field],
    }));

    if (onChange) {
      onChange();
    }
  };

  return (
    <SettingsCard
      title="Notification Settings"
      description="Configure alerts and notifications for MetroVision operations."
    >
      <div className="space-y-4">

        {/* Push Notifications */}
        <Toggle
          icon={Bell}
          title="Push Notifications"
          description="Receive real-time notifications inside MetroVision."
          enabled={settings.pushNotifications}
          onClick={() => handleChange("pushNotifications")}
        />

        {/* Email Notifications */}
        <Toggle
          icon={Mail}
          title="Email Notifications"
          description="Receive important operational updates by email."
          enabled={settings.emailNotifications}
          onClick={() => handleChange("emailNotifications")}
        />

        {/* Crowd Alerts */}
        <Toggle
          icon={AlertTriangle}
          title="Crowd Alerts"
          description="Get notified when crowd density exceeds configured thresholds."
          enabled={settings.crowdAlerts}
          onClick={() => handleChange("crowdAlerts")}
        />

        {/* Metro Alerts */}
        <Toggle
          icon={Train}
          title="Metro Operation Alerts"
          description="Receive alerts about service disruptions and operational changes."
          enabled={settings.metroAlerts}
          onClick={() => handleChange("metroAlerts")}
        />

      </div>
    </SettingsCard>
  );
}

function Toggle({
  icon: Icon,
  title,
  description,
  enabled,
  onClick,
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4">

      <div className="flex items-center gap-4">

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <Icon size={19} />
        </div>

        <div>
          <p className="font-semibold text-slate-800">
            {title}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            {description}
          </p>
        </div>

      </div>

      <button
        type="button"
        onClick={onClick}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          enabled
            ? "bg-blue-600"
            : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
            enabled
              ? "left-6"
              : "left-1"
          }`}
        />
      </button>

    </div>
  );
}