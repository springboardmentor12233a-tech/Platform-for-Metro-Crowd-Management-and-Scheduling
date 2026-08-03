import { useState } from "react";

import {
  Brain,
  Cpu,
  Clock3,
  BarChart3,
} from "lucide-react";

import SettingsCard from "./SettingsCard";
import ToggleSwitch from "./ToggleSwitch";
import ConfidenceSlider from "./ConfidenceSlider";
import MetricCard from "./MetricCard";
import ModelStatus from "./ModelStatus";

export default function AISettings() {

  const [confidence, setConfidence] = useState(92);

  return (

    <div className="space-y-6">

      <SettingsCard
        title="AI Configuration"
        description="Configure prediction models and recommendation engines."
      >

        <div className="grid gap-6 md:grid-cols-2">

          <div>

            <label className="mb-2 block font-medium">
              Prediction Model
            </label>

            <select className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3">

              <option>MetroNet v3.1</option>

              <option>MetroNet v2.9</option>

              <option>Experimental</option>

            </select>

          </div>

          <div>

            <label className="mb-2 block font-medium">
              Forecast Horizon
            </label>

            <select className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3">

              <option>30 Minutes</option>

              <option>60 Minutes</option>

              <option>120 Minutes</option>

            </select>

          </div>

        </div>

        <div className="mt-8">

          <ConfidenceSlider

            value={confidence}

            setValue={setConfidence}

          />

        </div>

        <div className="mt-8 space-y-4">

          <ToggleSwitch

            title="Recommendation Engine"

            description="Generate AI recommendations."

            defaultEnabled

          />

          <ToggleSwitch

            title="Auto Decision Engine"

            description="Allow AI to optimise schedules automatically."

          />

          <ToggleSwitch

            title="Continuous Learning"

            description="Improve prediction quality over time."

            defaultEnabled

          />

          <ToggleSwitch

            title="Generate AI Reports"

            description="Automatically generate daily reports."

            defaultEnabled

          />

        </div>

      </SettingsCard>

      <div className="grid gap-5 md:grid-cols-4">

        <MetricCard
          icon={Brain}
          title="Accuracy"
          value="97%"
        />

        <MetricCard
          icon={Cpu}
          title="Confidence"
          value="96%"
        />

        <MetricCard
          icon={Clock3}
          title="Latency"
          value="185 ms"
        />

        <MetricCard
          icon={BarChart3}
          title="Predictions"
          value="18,453"
        />

      </div>

      <SettingsCard
        title="Model Status"
        description="Current AI engine health"
      >

        <ModelStatus
          title="Passenger Prediction"
          status="Online"
        />

        <ModelStatus
          title="Recommendation Engine"
          status="Online"
        />

        <ModelStatus
          title="Forecast Engine"
          status="Training"
        />

        <ModelStatus
          title="Schedule Optimiser"
          status="Online"
        />

      </SettingsCard>

    </div>

  );

}