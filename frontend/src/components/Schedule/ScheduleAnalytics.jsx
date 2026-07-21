import DepartureTrendChart from "./DepartureTrendChart";
import DelayAnalysisChart from "./DelayAnalysisChart";
import LineUtilizationChart from "./LineUtilizationChart";
import AIDemandPrediction from "./AIDemandPrediction";

function ScheduleAnalytics() {
  return (
    <section className="mt-8">

      <div className="mb-6">

        <h2 className="text-3xl font-bold text-slate-900">
          Schedule Analytics
        </h2>

        <p className="text-slate-500 mt-2">
          AI-powered operational insights for today's metro schedule.
        </p>

      </div>

      <div className="grid xl:grid-cols-2 gap-8">

        <DepartureTrendChart />

        <DelayAnalysisChart />

        <LineUtilizationChart />

        <AIDemandPrediction />

      </div>

    </section>
  );
}

export default ScheduleAnalytics;