import { useState } from "react";
import {
  Palette,
  Sun,
  Moon,
  Monitor,
  Check,
} from "lucide-react";

import SettingsCard from "./SettingsCard";

export default function AppearanceSettings({ onChange }) {
  const [theme, setTheme] = useState("light");
  const [compactMode, setCompactMode] = useState(false);

  const handleThemeChange = (value) => {
    setTheme(value);

    if (onChange) {
      onChange();
    }
  };

  const handleCompactChange = () => {
    setCompactMode((previous) => !previous);

    if (onChange) {
      onChange();
    }
  };

  return (
    <SettingsCard
      title="Appearance"
      description="Customize the MetroVision interface and display preferences."
    >
      <div className="space-y-6">

        {/* Theme */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Palette size={18} className="text-slate-600" />

            <h3 className="font-semibold text-slate-800">
              Theme
            </h3>
          </div>

          <div className="grid grid-cols-3 gap-4">

            {/* Light */}
            <button
              type="button"
              onClick={() => handleThemeChange("light")}
              className={`relative flex flex-col items-center gap-3 rounded-xl border p-5 transition ${
                theme === "light"
                  ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              {theme === "light" && (
                <span className="absolute right-3 top-3 text-blue-600">
                  <Check size={17} />
                </span>
              )}

              <Sun size={26} className="text-amber-500" />

              <span className="font-medium text-slate-700">
                Light
              </span>
            </button>

            {/* Dark */}
            <button
              type="button"
              onClick={() => handleThemeChange("dark")}
              className={`relative flex flex-col items-center gap-3 rounded-xl border p-5 transition ${
                theme === "dark"
                  ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              {theme === "dark" && (
                <span className="absolute right-3 top-3 text-blue-600">
                  <Check size={17} />
                </span>
              )}

              <Moon size={26} className="text-indigo-600" />

              <span className="font-medium text-slate-700">
                Dark
              </span>
            </button>

            {/* System */}
            <button
              type="button"
              onClick={() => handleThemeChange("system")}
              className={`relative flex flex-col items-center gap-3 rounded-xl border p-5 transition ${
                theme === "system"
                  ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              {theme === "system" && (
                <span className="absolute right-3 top-3 text-blue-600">
                  <Check size={17} />
                </span>
              )}

              <Monitor size={26} className="text-slate-600" />

              <span className="font-medium text-slate-700">
                System
              </span>
            </button>

          </div>
        </div>

        {/* Compact Mode */}
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4">

          <div>
            <p className="font-semibold text-slate-800">
              Compact Mode
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Reduce spacing between dashboard and settings elements.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCompactChange}
            className={`relative h-6 w-11 rounded-full transition ${
              compactMode
                ? "bg-blue-600"
                : "bg-slate-300"
            }`}
          >
            <span
              className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
                compactMode
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