import { useState } from "react";
import { Key, Copy, Eye, EyeOff, Plus, Trash2 } from "lucide-react";

import SettingsCard from "./SettingsCard";

export default function ApiSettings({ onChange }) {
  const [showKey, setShowKey] = useState(false);

  const [apiKey, setApiKey] = useState("");

  const generateApiKey = () => {
    const newKey =
      "mv_" +
      crypto.randomUUID().replaceAll("-", "");

    setApiKey(newKey);

    if (onChange) {
      onChange();
    }
  };

  const copyApiKey = async () => {
    if (!apiKey) return;

    try {
      await navigator.clipboard.writeText(apiKey);
      console.log("API key copied");
    } catch (error) {
      console.error("Failed to copy API key:", error);
    }
  };

  const deleteApiKey = () => {
    setApiKey("");

    if (onChange) {
      onChange();
    }
  };

  return (
    <SettingsCard
      title="API Keys"
      description="Manage API keys used to connect external services with MetroVision."
    >
      <div className="space-y-6">

        {/* API Key */}
        <div>

          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
            <Key size={17} />
            API Key
          </label>

          <div className="flex gap-2">

            <div className="relative flex-1">

              <input
                type={showKey ? "text" : "password"}
                value={apiKey}
                readOnly
                placeholder="No API key generated"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 pr-12 text-sm text-slate-800 outline-none"
              />

              {apiKey && (
                <button
                  type="button"
                  onClick={() =>
                    setShowKey((previous) => !previous)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800"
                >
                  {showKey ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              )}

            </div>

            {apiKey && (
              <button
                type="button"
                onClick={copyApiKey}
                className="rounded-xl border border-slate-300 px-4 py-2 text-slate-700 transition hover:bg-slate-50"
                title="Copy API key"
              >
                <Copy size={18} />
              </button>
            )}

          </div>

        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">

          <button
            type="button"
            onClick={generateApiKey}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            <Plus size={18} />
            {apiKey ? "Regenerate API Key" : "Generate API Key"}
          </button>

          {apiKey && (
            <button
              type="button"
              onClick={deleteApiKey}
              className="flex items-center gap-2 rounded-xl border border-red-200 px-5 py-3 font-semibold text-red-600 transition hover:bg-red-50"
            >
              <Trash2 size={18} />
              Delete
            </button>
          )}

        </div>

        {/* Security Notice */}
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-medium text-amber-800">
            Security Notice
          </p>

          <p className="mt-1 text-sm text-amber-700">
            Keep your API key private. Do not share it publicly
            or commit it to GitHub.
          </p>
        </div>

      </div>
    </SettingsCard>
  );
}