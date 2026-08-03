import { Globe, Building2, Clock, Languages } from "lucide-react";

import SettingsCard from "./SettingsCard";

export default function GeneralSettings({
    onChange,
}) {

    return (

        <SettingsCard
            title="General Settings"
            description="Configure workspace preferences."
        >

            <div className="grid gap-6">

                <Input
                    icon={Globe}
                    label="Platform Name"
                    defaultValue="MetroVision AI"
                    onChange={onChange}
                />

                <Input
                    icon={Building2}
                    label="Organisation"
                    defaultValue="Delhi Metro Rail Corporation"
                    onChange={onChange}
                />

                <Select
                    icon={Clock}
                    label="Timezone"
                    options={[
                        "Asia/Kolkata",
                        "UTC",
                    ]}
                />

                <Select
                    icon={Languages}
                    label="Language"
                    options={[
                        "English",
                        "Hindi",
                    ]}
                />

            </div>

        </SettingsCard>

    );

}