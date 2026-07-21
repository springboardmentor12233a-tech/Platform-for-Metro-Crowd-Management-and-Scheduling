import {
  Train,
  Clock3,
  CheckCircle2,
  BrainCircuit,
} from "lucide-react";

import ScheduleKPICard from "./ScheduleKPICard";

function ScheduleKPIs() {

  return (

    <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 my-8">

      <ScheduleKPICard
        title="Active Trains"
        value="124"
        icon={Train}
        color="text-indigo-600"
      />

      <ScheduleKPICard
        title="Delayed Trains"
        value="6"
        icon={Clock3}
        color="text-red-500"
      />

      <ScheduleKPICard
        title="On-Time"
        value="95%"
        icon={CheckCircle2}
        color="text-green-500"
      />

      <ScheduleKPICard
        title="AI Optimization"
        value="98%"
        icon={BrainCircuit}
        color="text-cyan-500"
      />

    </div>

  );

}

export default ScheduleKPIs;