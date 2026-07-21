import ScheduleHeader from "../components/Schedule/ScheduleHeader";
import ScheduleKPIs from "../components/Schedule/ScheduleKPIs";
import AIRecommendations from "../components/Schedule/AIRecommendations";
import ScheduleTable from "../components/Schedule/ScheduleTable";
import ScheduleAnalytics from "../components/Schedule/ScheduleAnalytics";

function Schedule() {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="max-w-[1800px] mx-auto px-8 py-8 space-y-8">

        <ScheduleHeader />

        <ScheduleKPIs />

        <div className="grid xl:grid-cols-3 gap-8">

          <div className="xl:col-span-2">
            <ScheduleTable />
          </div>

          <AIRecommendations />

        </div>

        <ScheduleAnalytics />

      </div>
    </div>
  );
}

export default Schedule;