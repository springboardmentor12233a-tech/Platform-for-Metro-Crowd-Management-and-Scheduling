import { useState } from "react";

export default function ToggleSwitch({
  title,
  description,
  defaultEnabled = false,
  onChange,
}) {
  const [enabled, setEnabled] = useState(defaultEnabled);

  const handleToggle = () => {
    const newValue = !enabled;
    setEnabled(newValue);

    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">

      <div>

        <h4 className="font-semibold text-slate-900">
          {title}
        </h4>

        <p className="text-sm text-slate-500">
          {description}
        </p>

      </div>

      <button
        onClick={handleToggle}
        className={`relative h-7 w-14 rounded-full transition-all duration-300 ${
          enabled ? "bg-blue-600" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all duration-300 ${
            enabled ? "left-8" : "left-1"
          }`}
        />
      </button>

    </div>
  );
}