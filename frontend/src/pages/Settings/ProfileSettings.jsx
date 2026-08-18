import { useState } from "react";
import {
  User,
  Mail,
  ShieldCheck,
} from "lucide-react";

import SettingsCard from "./SettingsCard";

export default function ProfileSettings({ onChange }) {
  const [profile, setProfile] = useState({
    name: "Sourodeep Saha",
    email: "rishir...@gmail.com",
    role: "Admin",
  });

  const handleChange = (field, value) => {
    setProfile((previous) => ({
      ...previous,
      [field]: value,
    }));

    if (onChange) {
      onChange();
    }
  };

  return (
    <SettingsCard
      title="Profile Settings"
      description="Manage your MetroVision administrator profile."
    >
      <div className="grid gap-6">

        {/* Name */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
            <User size={17} />
            Full Name
          </label>

          <input
            type="text"
            value={profile.name}
            onChange={(e) =>
              handleChange("name", e.target.value)
            }
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Email */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
            <Mail size={17} />
            Email Address
          </label>

          <input
            type="email"
            value={profile.email}
            onChange={(e) =>
              handleChange("email", e.target.value)
            }
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Role */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
            <ShieldCheck size={17} />
            Role
          </label>

          <input
            type="text"
            value={profile.role}
            disabled
            className="w-full cursor-not-allowed rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm text-slate-500"
          />

          <p className="mt-1 text-xs text-slate-500">
            Your administrator role is managed by the system.
          </p>
        </div>

      </div>
    </SettingsCard>
  );
}