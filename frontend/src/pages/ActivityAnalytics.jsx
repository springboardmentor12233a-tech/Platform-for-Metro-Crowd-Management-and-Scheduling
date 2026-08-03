import { useState } from "react";

import useActivityAnalytics from "../hooks/useActivityAnalytics";

import SummaryCards from "../components/activityAnalytics/SummaryCards";
import LoginTrendChart from "../components/activityAnalytics/LoginTrendChart";
import ModuleChart from "../components/activityAnalytics/ModuleChart";
import SuccessFailureChart from "../components/activityAnalytics/SuccessFailureChart";
import TopUsersChart from "../components/activityAnalytics/TopUsersChart";
import HourlyHeatmap from "../components/activityAnalytics/HourlyHeatmap";
import AnalyticsFilters from "../components/activityAnalytics/AnalyticsFilters";

export default function ActivityAnalytics() {
  const [dateRange, setDateRange] = useState("");
  const [module, setModule] = useState("");
  const [role, setRole] = useState("");

  const resetFilters = () => {
    setDateRange("");
    setModule("");
    setRole("");
  };

  const { analytics, loading, error } = useActivityAnalytics({
    dateRange,
    module,
    role,
  });

  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-lg font-semibold">
          Loading analytics...
        </h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h2 className="text-lg font-semibold text-red-600">
          Failed to load analytics.
        </h2>

        <p className="mt-2 text-gray-600">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold">
            Activity Analytics
          </h1>

          <p className="mt-2 text-gray-500">
            Monitor user activity and system usage.
          </p>

        </div>

        <AnalyticsFilters
          dateRange={dateRange}
          setDateRange={setDateRange}
          module={module}
          setModule={setModule}
          role={role}
          setRole={setRole}
          onReset={resetFilters}
        />

      </div>

      <SummaryCards
        summary={analytics.summary}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

        <LoginTrendChart
          data={analytics.loginTrend}
        />

        <ModuleChart
          data={analytics.moduleDistribution}
        />

        <SuccessFailureChart
          data={analytics.successRate}
        />

        <TopUsersChart
          data={analytics.topUsers}
        />

      </div>

      <HourlyHeatmap
        data={analytics.hourlyActivity}
      />

    </div>
  );
}