import { useState } from "react";

export default function ToggleSwitch({

  title,

  description,

  defaultEnabled = false,

}) {

  const [enabled, setEnabled] = useState(defaultEnabled);

  return (

    <div className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">

      <div>

        <h4 className="font-semibold">

          {title}

        </h4>

        <p className="text-sm text-slate-500">

          {description}

        </p>

      </div>

      <button

        onClick={() => setEnabled(!enabled)}

        className={`relative h-7 w-14 rounded-full transition-all ${
          enabled
            ? "bg-blue-600"
            : "bg-slate-300"
        }`}

      >

        <span

          className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${
            enabled
              ? "left-8"
              : "left-1"
          }`}

        />

      </button>

    </div>

  );

}