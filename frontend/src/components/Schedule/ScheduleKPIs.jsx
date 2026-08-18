import {
  Train,
  Clock3,
  CheckCircle2,
  BrainCircuit,
} from "lucide-react";

import ScheduleKPICard from "./ScheduleKPICard";

function ScheduleKPIs({
  schedules = [],
  loading = false,
}) {

  const activeTrains = schedules.length;

  const delayedTrains = schedules.filter(
    (train) =>
      train.status?.toLowerCase() === "delayed"
  ).length;

  const onTimeTrains = schedules.filter(
    (train) =>
      train.status?.toLowerCase() === "on time"
  ).length;

  const onTimePercentage =
    activeTrains > 0
      ? Math.round(
          (onTimeTrains / activeTrains) * 100
        )
      : 0;

  /*
   * AI optimization score can later come
   * from your AI/recommendation backend.
   *
   * For now we derive it from schedule quality.
   */
  const aiOptimization =
    activeTrains > 0
      ? Math.max(
          0,
          Math.round(
            ((activeTrains - delayedTrains) /
              activeTrains) *
              100
          )
        )
      : 0;

  return (

    <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 my-8">

      <ScheduleKPICard
        title="Active Trains"
        value={loading ? "..." : activeTrains}
        icon={Train}
        color="text-indigo-600"
      />

      <ScheduleKPICard
        title="Delayed Trains"
        value={loading ? "..." : delayedTrains}
        icon={Clock3}
        color="text-red-500"
      />

      <ScheduleKPICard
        title="On-Time"
        value={
          loading
            ? "..."
            : `${onTimePercentage}%`
        }
        icon={CheckCircle2}
        color="text-green-500"
      />

      <ScheduleKPICard
        title="AI Optimization"
        value={
          loading
            ? "..."
            : `${aiOptimization}%`
        }
        icon={BrainCircuit}
        color="text-cyan-500"
      />

    </div>

  );
}

export default ScheduleKPIs;