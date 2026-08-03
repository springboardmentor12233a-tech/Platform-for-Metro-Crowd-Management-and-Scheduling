import {
  User,
  Mail,
  Phone,
  Building2,
  ShieldCheck,
  Camera,
} from "lucide-react";

import SettingsCard from "./SettingsCard";

export default function ProfileSettings({ onChange }) {
  return (
    <div className="space-y-6">

      <SettingsCard
        title="Profile Settings"
        description="Manage your personal information and account."
      >

        {/* Avatar */}

        <div className="mb-10 flex items-center gap-6">

          <div className="relative">

            <img
              src="https://ui-avatars.com/api/?name=Admin&background=2563eb&color=fff&size=200"
              alt="avatar"
              className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-lg"
            />

            <button
              className="absolute bottom-0 right-0 rounded-full bg-blue-600 p-2 text-white shadow-lg transition hover:bg-blue-700"
            >
              <Camera size={16} />
            </button>

          </div>

          <div>

            <h3 className="text-xl font-semibold text-slate-900">
              MetroVision Administrator
            </h3>

            <p className="text-slate-500">
              Manage your account information.
            </p>

          </div>

        </div>

        {/* Form */}

        <div className="grid gap-6 md:grid-cols-2">

          <InputField
            icon={User}
            label="Full Name"
            defaultValue="Sourodeep Saha"
            onChange={onChange}
          />

          <InputField
            icon={Mail}
            label="Email Address"
            defaultValue="admin@metrovision.ai"
            onChange={onChange}
          />

          <InputField
            icon={Phone}
            label="Phone Number"
            defaultValue="+91 9876543210"
            onChange={onChange}
          />

          <InputField
            icon={Building2}
            label="Department"
            defaultValue="Operations"
            onChange={onChange}
          />

          <InputField
            icon={ShieldCheck}
            label="Role"
            defaultValue="Administrator"
            disabled
          />

        </div>

        {/* Buttons */}

        <div className="mt-10 flex flex-wrap gap-4">

          <button
            className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:scale-105"
          >
            Update Profile
          </button>

          <button
            className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Change Password
          </button>

        </div>

      </SettingsCard>

    </div>
  );
}

function InputField({
  icon: Icon,
  label,
  defaultValue,
  disabled = false,
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
        disabled={disabled}
        onChange={onChange}
        className={`w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition
        ${
          disabled
            ? "cursor-not-allowed bg-slate-100 text-slate-500"
            : "focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        }`}
      />

    </div>
  );
}