import { useState } from "react";

import SettingsHeader from "../components/settings/SettingsHeader";
import SettingsSidebar from "../components/settings/SettingsSidebar";
import SystemStatusCard from "../components/settings/SystemStatusCard";
import SaveBar from "../components/settings/SaveBar";

import GeneralSettings from "../components/settings/GeneralSettings";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("general");
  const [hasChanges, setHasChanges] = useState(false);

  return (
    <div className="space-y-8">

      <SettingsHeader />

      <div className="grid grid-cols-12 gap-6">

        <div className="col-span-12 lg:col-span-2">
          <SettingsSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>

        <div className="col-span-12 lg:col-span-7">

          {activeTab === "general" && (
            <GeneralSettings
              onChange={() => setHasChanges(true)}
            />
          )}

        </div>

        <div className="col-span-12 lg:col-span-3">

          <SystemStatusCard />

        </div>

      </div>

      <SaveBar
        visible={hasChanges}
      />

    </div>
  );
}