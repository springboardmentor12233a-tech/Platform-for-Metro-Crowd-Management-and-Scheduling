import { useState } from "react";

import SettingsHeader from "../components/settings/SettingsHeader";
import SettingsSidebar from "../components/settings/SettingsSidebar";
import SystemStatusCard from "../components/settings/SystemStatusCard";
import SaveBar from "../components/settings/SaveBar";

import GeneralSettings from "../components/settings/GeneralSettings";

const DEFAULT_SETTINGS = {
  platformName: "MetroVision AI",
  organisation: "Delhi Metro Rail Corporation",
  timezone: "Asia/Kolkata",
  language: "English",
};

function getSavedSettings() {
  try {
    const saved = localStorage.getItem("metrovision_general_settings");

    if (saved) {
      return {
        ...DEFAULT_SETTINGS,
        ...JSON.parse(saved),
      };
    }
  } catch (error) {
    console.error("Failed to load settings:", error);
  }

  return DEFAULT_SETTINGS;
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState("general");

  // Last saved settings
  const [savedSettings, setSavedSettings] = useState(
    getSavedSettings()
  );

  // Current settings being edited
  const [settings, setSettings] = useState(
    getSavedSettings()
  );

  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  // When a setting changes
  const handleSettingsChange = (updatedSettings) => {
    setSettings(updatedSettings);
    setHasChanges(true);
  };

  // Save settings
  const handleSave = () => {
    try {
      setSaving(true);

      localStorage.setItem(
        "metrovision_general_settings",
        JSON.stringify(settings)
      );

      setSavedSettings(settings);
      setHasChanges(false);

      console.log("Settings saved successfully:", settings);
    } catch (error) {
      console.error("Failed to save settings:", error);
    } finally {
      setSaving(false);
    }
  };

  // Cancel unsaved changes
  const handleCancel = () => {
    setSettings(savedSettings);
    setHasChanges(false);

    console.log("Changes cancelled");
  };

  return (
    <div className="space-y-8">

      {/* Header */}
      <SettingsHeader
        onSave={handleSave}
        saving={saving}
        disabled={!hasChanges}
      />

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-6">

        {/* Sidebar */}
        <div className="col-span-12 lg:col-span-2">
          <SettingsSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>

        {/* Settings Content */}
        <div className="col-span-12 lg:col-span-7">

          {activeTab === "general" && (
            <GeneralSettings
              settings={settings}
              onChange={handleSettingsChange}
            />
          )}

        </div>

        {/* System Status */}
        <div className="col-span-12 lg:col-span-3">
          <SystemStatusCard />
        </div>

      </div>

      {/* Bottom Save Bar */}
      <SaveBar
        visible={hasChanges}
        onSave={handleSave}
        onCancel={handleCancel}
        saving={saving}
      />

    </div>
  );
}