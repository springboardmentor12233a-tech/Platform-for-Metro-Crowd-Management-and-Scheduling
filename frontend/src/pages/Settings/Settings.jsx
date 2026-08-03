import { useState } from "react";

import SettingsHeader from "../../components/settings/SettingsHeader";
import SettingsSidebar from "../../components/settings/SettingsSidebar";
import SystemStatusCard from "../../components/settings/SystemStatusCard";
import SaveBar from "../../components/settings/SaveBar";

import GeneralSettings from "../../components/settings/GeneralSettings";
import ProfileSettings from "../../components/settings/ProfileSettings";
import SecuritySettings from "../../components/settings/SecuritySettings";
import NotificationSettings from "../../components/settings/NotificationSettings";
import AISettings from "../../components/settings/AISettings";
import AppearanceSettings from "../../components/settings/AppearanceSettings";
import ApiSettings from "../../components/settings/ApiSettings";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("general");
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = () => {
    setHasChanges(true);
  };

  return (
    <div className="space-y-8">

      {/* Header */}
      <SettingsHeader />

      {/* Main Layout */}
      <div className="grid grid-cols-12 gap-6">

        {/* Sidebar */}
        <div className="col-span-12 lg:col-span-2">
          <SettingsSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>

        {/* Main Content */}
        <div className="col-span-12 lg:col-span-7">

          {activeTab === "general" && (
            <GeneralSettings
              onChange={handleChange}
            />
          )}

          {activeTab === "profile" && (
            <ProfileSettings
              onChange={handleChange}
            />
          )}

          {activeTab === "security" && (
            <SecuritySettings
              onChange={handleChange}
            />
          )}

          {activeTab === "notifications" && (
            <NotificationSettings
              onChange={handleChange}
            />
          )}

          {activeTab === "ai" && (
            <AISettings
              onChange={handleChange}
            />
          )}

          {activeTab === "appearance" && (
            <AppearanceSettings
              onChange={handleChange}
            />
          )}

          {activeTab === "api" && (
            <ApiSettings
              onChange={handleChange}
            />
          )}

        </div>

        {/* Right Sidebar */}
        <div className="col-span-12 lg:col-span-3">
          <SystemStatusCard />
        </div>

      </div>

      {/* Floating Save Bar */}
      <SaveBar
        visible={hasChanges}
      />

    </div>
  );
}