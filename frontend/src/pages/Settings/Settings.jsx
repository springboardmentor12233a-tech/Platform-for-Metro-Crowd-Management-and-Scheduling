import { useState } from "react";

import SettingsHeader from "./SettingsHeader";
import SettingsSidebar from "./SettingsSidebar";
import SystemStatusCard from "./SystemStatusCard";
import SaveBar from "./SaveBar";

import GeneralSettings from "./GeneralSettings";
import ProfileSettings from "./ProfileSettings";
import SecuritySettings from "./SecuritySettings";
import NotificationSettings from "./NotificationSettings";
import AISettings from "./AISettings";
import AppearanceSettings from "./AppearanceSettings";
import ApiSettings from "./ApiSettings";
import MetroSettings from "./MetroSettings";

const DEFAULT_SETTINGS = {
  platformName: "MetroVision AI",
  organisation: "Delhi Metro Rail Corporation",
  timezone: "Asia/Kolkata",
  language: "English",
};

function getSavedSettings() {
  try {
    const saved = localStorage.getItem(
      "metrovision_general_settings"
    );

    if (saved) {
      return {
        ...DEFAULT_SETTINGS,
        ...JSON.parse(saved),
      };
    }
  } catch (error) {
    console.error("Error loading settings:", error);
  }

  return { ...DEFAULT_SETTINGS };
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState("general");

  const [settings, setSettings] = useState(
    getSavedSettings()
  );

  const [savedSettings, setSavedSettings] = useState(
    getSavedSettings()
  );

  const [hasChanges, setHasChanges] = useState(false);

  const [saving, setSaving] = useState(false);

  // General settings change
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

      setSavedSettings({ ...settings });

      setHasChanges(false);

      console.log("Settings saved successfully:", settings);
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setSaving(false);
    }
  };

  // Cancel changes
  const handleCancel = () => {
    setSettings({ ...savedSettings });
    setHasChanges(false);

    console.log("Changes cancelled");
  };

  // For other settings tabs
  const handleOtherSettingsChange = () => {
    setHasChanges(true);
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

          {/* GENERAL */}
          {activeTab === "general" && (
            <GeneralSettings
              settings={settings}
              onChange={handleSettingsChange}
            />
          )}

          {/* PROFILE */}
          {activeTab === "profile" && (
            <ProfileSettings
              onChange={handleOtherSettingsChange}
            />
          )}

          {/* SECURITY */}
          {activeTab === "security" && (
            <SecuritySettings
              onChange={handleOtherSettingsChange}
            />
          )}

          {/* NOTIFICATIONS */}
          {activeTab === "notifications" && (
            <NotificationSettings
              onChange={handleOtherSettingsChange}
            />
          )}

          {/* AI SETTINGS */}
          {activeTab === "ai" && (
            <AISettings
              onChange={handleOtherSettingsChange}
            />
          )}

          {/* METRO OPERATIONS */}
          {activeTab === "metro" && (
            <MetroSettings
              onChange={handleOtherSettingsChange}
            />
          )}

          {/* APPEARANCE */}
          {activeTab === "appearance" && (
            <AppearanceSettings
              onChange={handleOtherSettingsChange}
            />
          )}

          {/* API */}
          {activeTab === "api" && (
            <ApiSettings
              onChange={handleOtherSettingsChange}
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