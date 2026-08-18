import { useState } from "react";
import {
  Shield,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
} from "lucide-react";

import SettingsCard from "./SettingsCard";

export default function SecuritySettings({ onChange }) {
  const [showPassword, setShowPassword] = useState(false);

  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactor: true,
  });

  const handleChange = (field, value) => {
    setSecurity((previous) => ({
      ...previous,
      [field]: value,
    }));

    if (onChange) {
      onChange();
    }
  };

  return (
    <SettingsCard
      title="Security Settings"
      description="Manage your account security and authentication preferences."
    >
      <div className="space-y-6">

        {/* Security Status */}
        <div className="flex items-center gap-4 rounded-xl border border-green-200 bg-green-50 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600">
            <Shield size={20} />
          </div>

          <div>
            <p className="font-semibold text-green-800">
              Account Security
            </p>

            <p className="text-sm text-green-700">
              Your account security settings are active.
            </p>
          </div>
        </div>

        {/* Change Password */}
        <div>
          <div className="mb-4 flex items-center gap-2">
            <Lock size={18} className="text-slate-600" />

            <h3 className="font-semibold text-slate-800">
              Change Password
            </h3>
          </div>

          <div className="grid gap-4">

            {/* Current Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Current Password
              </label>

              <input
                type="password"
                value={security.currentPassword}
                onChange={(e) =>
                  handleChange(
                    "currentPassword",
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* New Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                New Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={security.newPassword}
                  onChange={(e) =>
                    handleChange(
                      "newPassword",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-12 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((previous) => !previous)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Confirm New Password
              </label>

              <input
                type="password"
                value={security.confirmPassword}
                onChange={(e) =>
                  handleChange(
                    "confirmPassword",
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

          </div>
        </div>

        {/* Two Factor Authentication */}
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4">

          <div className="flex items-center gap-4">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <KeyRound size={19} />
            </div>

            <div>
              <p className="font-semibold text-slate-800">
                Two-Factor Authentication
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Add an additional layer of protection to your account.
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={() =>
              handleChange(
                "twoFactor",
                !security.twoFactor
              )
            }
            className={`relative h-6 w-11 rounded-full transition ${
              security.twoFactor
                ? "bg-blue-600"
                : "bg-slate-300"
            }`}
          >
            <span
              className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
                security.twoFactor
                  ? "left-6"
                  : "left-1"
              }`}
            />
          </button>

        </div>

      </div>
    </SettingsCard>
  );
}