import {
  Mail,
  Smartphone,
  Bell,
  Brain,
  AlertTriangle,
  FileText,
  CalendarClock,
} from "lucide-react";

import SettingsCard from "./SettingsCard";
import ToggleSwitch from "./ToggleSwitch";

export default function NotificationSettings({ onChange }) {
  return (
    <div className="space-y-6">

      {/* Notification Preferences */}

      <SettingsCard
        title="Notification Settings"
        description="Configure how MetroVision communicates important updates."
      >

        <div className="space-y-5">

          <ToggleSwitch
            title="Email Notifications"
            description="Receive notifications by email."
            defaultEnabled
            onChange={onChange}
          />

          <ToggleSwitch
            title="SMS Notifications"
            description="Receive important alerts by SMS."
            onChange={onChange}
          />

          <ToggleSwitch
            title="Push Notifications"
            description="Receive browser push notifications."
            defaultEnabled
            onChange={onChange}
          />

          <ToggleSwitch
            title="AI Alerts"
            description="Receive AI prediction and recommendation alerts."
            defaultEnabled
            onChange={onChange}
          />

          <ToggleSwitch
            title="Emergency Alerts"
            description="Immediate alerts for critical incidents."
            defaultEnabled
            onChange={onChange}
          />

          <ToggleSwitch
            title="Maintenance Notifications"
            description="Scheduled maintenance announcements."
            defaultEnabled
            onChange={onChange}
          />

        </div>

      </SettingsCard>

      {/* Reports */}

      <SettingsCard
        title="Automated Reports"
        description="Choose which reports are delivered automatically."
      >

        <div className="space-y-5">

          <ToggleSwitch
            title="Daily Operations Report"
            description="Receive a daily operational summary."
            defaultEnabled
            onChange={onChange}
          />

          <ToggleSwitch
            title="Weekly Analytics Report"
            description="Passenger trends and AI insights."
            defaultEnabled
            onChange={onChange}
          />

          <ToggleSwitch
            title="Monthly Performance Report"
            description="Overall metro performance report."
            onChange={onChange}
          />

        </div>

      </SettingsCard>

      {/* Notification Summary */}

      <SettingsCard
        title="Notification Summary"
        description="Current notification status."
      >

        <div className="grid gap-5 md:grid-cols-2">

          <StatusCard
            icon={Mail}
            title="Email"
            value="Enabled"
            color="blue"
          />

          <StatusCard
            icon={Smartphone}
            title="SMS"
            value="Disabled"
            color="gray"
          />

          <StatusCard
            icon={Bell}
            title="Push"
            value="Enabled"
            color="green"
          />

          <StatusCard
            icon={Brain}
            title="AI Alerts"
            value="Enabled"
            color="purple"
          />

          <StatusCard
            icon={AlertTriangle}
            title="Emergency"
            value="Enabled"
            color="red"
          />

          <StatusCard
            icon={FileText}
            title="Reports"
            value="Daily & Weekly"
            color="amber"
          />

        </div>

      </SettingsCard>

      <div className="flex flex-wrap gap-4">

        <button className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:scale-105">
          Save Notification Settings
        </button>

        <button className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50">
          Test Notification
        </button>

      </div>

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
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    purple: "bg-purple-100 text-purple-700",
    amber: "bg-amber-100 text-amber-700",
    red: "bg-red-100 text-red-700",
    gray: "bg-slate-100 text-slate-700",
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