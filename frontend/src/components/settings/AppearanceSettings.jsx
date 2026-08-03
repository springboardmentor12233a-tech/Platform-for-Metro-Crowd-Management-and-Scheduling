import { useState } from "react";
import {
  Monitor,
  Sun,
  Moon,
  Palette,
  Sidebar,
  Type,
  LayoutGrid,
} from "lucide-react";

import SettingsCard from "./SettingsCard";

const themes = [
  { id: "light", label: "Light", icon: Sun },
  { id: "dark", label: "Dark", icon: Moon },
  { id: "system", label: "System", icon: Monitor },
];

const accentColors = [
  "#2563EB",
  "#7C3AED",
  "#10B981",
  "#F97316",
  "#EF4444",
  "#06B6D4",
];

export default function AppearanceSettings({ onChange }) {
  const [theme, setTheme] = useState("light");
  const [accent, setAccent] = useState("#2563EB");

  return (
    <div className="space-y-6">

      <SettingsCard
        title="Appearance"
        description="Customize the look and feel of MetroVision."
      >

        {/* Theme */}

        <div>

          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">

            <Monitor size={20} />

            Theme

          </h3>

          <div className="grid gap-4 md:grid-cols-3">

            {themes.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setTheme(item.id);
                    onChange?.();
                  }}
                  className={`rounded-2xl border p-5 transition ${
                    theme === item.id
                      ? "border-blue-600 bg-blue-50"
                      : "border-slate-200 hover:border-blue-400"
                  }`}
                >

                  <Icon
                    className="mx-auto mb-3 text-blue-600"
                    size={28}
                  />

                  <p className="font-medium text-slate-700">
                    {item.label}
                  </p>

                </button>
              );
            })}

          </div>

        </div>

        {/* Accent Color */}

        <div className="mt-10">

          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">

            <Palette size={20} />

            Accent Color

          </h3>

          <div className="flex flex-wrap gap-4">

            {accentColors.map((color) => (
              <button
                key={color}
                onClick={() => {
                  setAccent(color);
                  onChange?.();
                }}
                className={`h-12 w-12 rounded-full border-4 transition ${
                  accent === color
                    ? "border-slate-900 scale-110"
                    : "border-white"
                }`}
                style={{
                  backgroundColor: color,
                }}
              />
            ))}

          </div>

        </div>

        {/* Layout */}

        <div className="mt-10 grid gap-6 md:grid-cols-2">

          <SelectField
            icon={Sidebar}
            label="Sidebar Layout"
            options={[
              "Expanded",
              "Compact",
            ]}
            onChange={onChange}
          />

          <SelectField
            icon={Type}
            label="Font Size"
            options={[
              "Small",
              "Medium",
              "Large",
            ]}
            onChange={onChange}
          />

          <SelectField
            icon={LayoutGrid}
            label="Card Radius"
            options={[
              "Rounded",
              "Extra Rounded",
              "Square",
            ]}
            onChange={onChange}
          />

          <SelectField
            icon={Monitor}
            label="Density"
            options={[
              "Comfortable",
              "Compact",
            ]}
            onChange={onChange}
          />

        </div>

      </SettingsCard>

      {/* Live Preview */}

      <SettingsCard
        title="Live Preview"
        description="Preview your current appearance settings."
      >

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8">

          <div
            className="rounded-xl p-6 text-white shadow-lg"
            style={{
              backgroundColor: accent,
            }}
          >
            <h3 className="text-xl font-bold">
              MetroVision Dashboard
            </h3>

            <p className="mt-2 text-blue-100">
              This is a preview of your selected theme.
            </p>

          </div>

        </div>

      </SettingsCard>

      <div className="flex flex-wrap gap-4">

        <button className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:scale-105">
          Save Appearance
        </button>

        <button className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50">
          Reset Defaults
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
        {options.map((option) => (
          <option key={option}>
            {option}
          </option>
        ))}
      </select>

    </div>
  );
}