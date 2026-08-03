import { useState } from "react";
import {
  Brain,
  Clock3,
  Cpu,
  Sparkles,
} from "lucide-react";

import SettingsCard from "./SettingsCard";
import ToggleSwitch from "./ToggleSwitch";
import ConfidenceSlider from "./ConfidenceSlider";
import MetricCard from "./MetricCard";
import ModelStatus from "./ModelStatus";

export default function AISettings({ onChange }) {
  const [confidence, setConfidence] = useState(92);

  return (
    <div className="space-y-6">

      <SettingsCard
        title="AI Configuration"
        description="Configure MetroVision AI prediction engine."
      >

        <div className="grid gap-6 md:grid-cols-2">

          <div>
            <label className="mb-2 block font-medium text-slate-700">
              Prediction Model
            </label>

            <select
              onChange={onChange}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option>MetroNet v3.1</option>
              <option>MetroNet v2.9</option>
              <option>Experimental</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block font-medium text-slate-700">
              Forecast Horizon
            </label>

            <select
              onChange={onChange}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option>30 Minutes</option>
              <option>60 Minutes</option>
              <option>120 Minutes</option>
            </select>
          </div>

        </div>

        <div className="mt-8">
          <ConfidenceSlider
            value={confidence}
            setValue={(value) => {
              setConfidence(value);
              onChange?.();
            }}
          />
        </div>

        <div className="mt-8 space-y-4">

          <ToggleSwitch
            title="Recommendation Engine"
            description="Enable AI recommendation generation."
            defaultEnabled
            onChange={onChange}
          />

          <ToggleSwitch
            title="Auto Decision Engine"
            description="Automatically optimise schedules."
            onChange={onChange}
          />

          <ToggleSwitch
            title="Continuous Learning"
            description="Improve prediction model over time."
            defaultEnabled
            onChange={onChange}
          />

          <ToggleSwitch
            title="AI Report Generation"
            description="Automatically create AI reports."
            defaultEnabled
            onChange={onChange}
          />

        </div>

      </SettingsCard>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

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
          icon={Sparkles}
          title="Predictions"
          value="18,453"
        />

      </div>

      <SettingsCard
        title="Model Status"
        description="Current health of AI services"
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
          title="Metro Scheduler"
          status="Online"
        />

      </SettingsCard>

    </div>
  );
}