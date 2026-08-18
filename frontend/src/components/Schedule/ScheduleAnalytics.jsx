import DepartureTrendChart from "./DepartureTrendChart";
import DelayAnalysisChart from "./DelayAnalysisChart";
import LineUtilizationChart from "./LineUtilizationChart";
import AIDemandPrediction from "./AIDemandPrediction";

function ScheduleAnalytics({
  schedules = [],
  loading = false,
}) {
  return (
    <section className="mt-8">

      <div className="mb-6">

        <h2 className="text-3xl font-bold text-slate-900">
          Schedule Analytics
        </h2>

        <p className="text-slate-500 mt-2">
          AI-powered operational insights
          from today's PostgreSQL schedule.
        </p>

      </div>

      <div className="grid xl:grid-cols-2 gap-8">

        <DepartureTrendChart
          schedules={schedules}
          loading={loading}
        />

        <DelayAnalysisChart
          schedules={schedules}
          loading={loading}
        />

        <LineUtilizationChart
          schedules={schedules}
          loading={loading}
        />

        <AIDemandPrediction
          schedules={schedules}
          loading={loading}
        />

      </div>

    </section>
  );
}

export default ScheduleAnalytics;