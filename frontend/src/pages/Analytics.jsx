import { useEffect, useState } from "react";

import DashboardLayout from "../components/layout/DashboardLayout";

import DashboardHeader from "../components/dashboard/DashboardHeader";

import AnalyticsHero from "../components/analytics/AnalyticsHero";
import AnalyticsKPIs from "../components/analytics/AnalyticsKPIs";
import PassengerAnalytics from "../components/analytics/PassengerAnalytics";
import RevenueAnalytics from "../components/analytics/RevenueAnalytics";
import OperationalAnalytics from "../components/analytics/OperationalAnalytics";
import AIInsights from "../components/analytics/AIInsights";
import TrendComparison from "../components/analytics/TrendComparison";
import HeatmapAnalytics from "../components/analytics/HeatmapAnalytics";
import ExportPanel from "../components/analytics/ExportPanel";

import {

  getDashboardSummary,

  getPassengerTrend,

  getRevenueAnalysis,

  getBusiestStations,

} from "../services/api";

function Analytics() {

  const [summary, setSummary] = useState({});

  const [passengerTrend, setPassengerTrend] =
    useState([]);

  const [revenueAnalysis, setRevenueAnalysis] =
    useState([]);

  const [busiestStations, setBusiestStations] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  useEffect(() => {

    async function loadAnalytics() {

      try {

        setLoading(true);

        setError(null);

        const [

          summaryData,

          passengerData,

          revenueData,

          stationsData,

        ] = await Promise.all([

          getDashboardSummary(),

          getPassengerTrend(),

          getRevenueAnalysis(),

          getBusiestStations(),

        ]);

        setSummary(summaryData);

        setPassengerTrend(passengerData);

        setRevenueAnalysis(revenueData);

        setBusiestStations(stationsData);

      } catch (err) {

        console.error(err);

        setError(
          "Unable to load analytics dashboard."
        );

      } finally {

        setLoading(false);

      }

    }

    loadAnalytics();

  }, []);
    /* ---------- Loading State ---------- */

  if (loading) {

    return (

      <DashboardLayout>

        <DashboardHeader
          title="Analytics"
          subtitle="Loading analytics dashboard..."
        />

        <div
          className="
            flex
            min-h-[70vh]
            items-center
            justify-center
          "
        >

          <div className="text-center">

            <div
              className="
                mx-auto
                h-14
                w-14
                animate-spin
                rounded-full
                border-4
                border-slate-200
                border-t-indigo-600
              "
            />

            <h2
              className="
                mt-6
                text-2xl
                font-bold
                text-slate-900
              "
            >
              Loading Analytics
            </h2>

            <p
              className="
                mt-2
                text-slate-500
              "
            >
              Fetching operational metrics,
              passenger insights,
              revenue statistics,
              and AI recommendations...
            </p>

          </div>

        </div>

      </DashboardLayout>

    );

  }

  /* ---------- Error State ---------- */

  if (error) {

    return (

      <DashboardLayout>

        <DashboardHeader
          title="Analytics"
          subtitle="Analytics dashboard"
        />

        <div
          className="
            flex
            min-h-[70vh]
            items-center
            justify-center
          "
        >

          <div
            className="
              w-full
              max-w-xl
              rounded-3xl
              border
              border-red-200
              bg-red-50
              p-10
              text-center
            "
          >

            <h2
              className="
                text-3xl
                font-bold
                text-red-600
              "
            >
              Unable to Load Analytics
            </h2>

            <p
              className="
                mt-4
                leading-7
                text-slate-700
              "
            >
              {error}
            </p>

            <button
              onClick={() =>
                window.location.reload()
              }
              className="
                mt-8
                rounded-2xl
                bg-red-600
                px-6
                py-3
                font-semibold
                text-white
                transition
                hover:bg-red-700
              "
            >
              Retry
            </button>

          </div>

        </div>

      </DashboardLayout>

    );

  }

  /* ---------- Empty State ---------- */

  if (

    !summary ||

    (
      passengerTrend.length === 0 &&
      revenueAnalysis.length === 0 &&
      busiestStations.length === 0
    )

  ) {

    return (

      <DashboardLayout>

        <DashboardHeader
          title="Analytics"
          subtitle="Analytics dashboard"
        />

        <div
          className="
            flex
            min-h-[70vh]
            items-center
            justify-center
          "
        >

          <div className="text-center">

            <h2
              className="
                text-3xl
                font-bold
                text-slate-900
              "
            >
              No Analytics Available
            </h2>

            <p
              className="
                mt-4
                text-slate-500
              "
            >
              Analytics data will appear here
              once the backend starts
              providing operational metrics.
            </p>

          </div>

        </div>

      </DashboardLayout>

    );

  }

  /* ---------- Dashboard ---------- */

  return (

    <DashboardLayout>

      <DashboardHeader
        title="Analytics Dashboard"
        subtitle="AI-powered operational intelligence and executive analytics"
      >

        <div className="flex items-center gap-3">

          <span
            className="
              rounded-full
              bg-emerald-100
              px-4
              py-2
              text-sm
              font-semibold
              text-emerald-700
            "
          >
            Live Analytics
          </span>

        </div>

      </DashboardHeader>

      <div
        className="
          space-y-10
          pb-10
        "
      >
              {/* Executive Overview */}

        <AnalyticsHero
          summary={summary}
          passengerTrend={passengerTrend}
          revenueAnalysis={revenueAnalysis}
          busiestStations={busiestStations}
        />

        {/* Executive KPIs */}

        <AnalyticsKPIs
          summary={summary}
          passengerTrend={passengerTrend}
          revenueAnalysis={revenueAnalysis}
          busiestStations={busiestStations}
        />

        {/* Passenger Analytics */}

        <PassengerAnalytics
          summary={summary}
          passengerTrend={passengerTrend}
        />
        
                {/* Revenue Analytics */}

        <RevenueAnalytics
          summary={summary}
          revenueAnalysis={revenueAnalysis}
        />

        {/* Operational Analytics */}

        <OperationalAnalytics
          summary={summary}
          busiestStations={busiestStations}
        />

        {/* AI Insights */}

        <AIInsights
          summary={summary}
          passengerTrend={passengerTrend}
          revenueAnalysis={revenueAnalysis}
          busiestStations={busiestStations}
        />
           {/* Trend Comparison */}

        <TrendComparison
          passengerTrend={passengerTrend}
          revenueAnalysis={revenueAnalysis}
        />

        {/* Heatmap Analytics */}

        <HeatmapAnalytics
          summary={summary}
          busiestStations={busiestStations}
        />

        {/* Export & Reports */}

        <ExportPanel
          summary={summary}
          passengerTrend={passengerTrend}
          revenueAnalysis={revenueAnalysis}
          busiestStations={busiestStations}
        />
          {/* Dashboard Footer */}

        <footer
          className="
            rounded-3xl
            border
            border-slate-200
            bg-gradient-to-r
            from-slate-900
            via-slate-800
            to-slate-900
            p-8
            text-white
            shadow-lg
          "
        >

          <div
            className="
              flex
              flex-col
              gap-8
              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >

            {/* Left */}

            <div>

              <h2
                className="
                  text-2xl
                  font-bold
                "
              >
                MetroFlow Executive Analytics
              </h2>

              <p
                className="
                  mt-3
                  max-w-2xl
                  leading-7
                  text-slate-300
                "
              >
                AI-powered operational intelligence
                providing real-time passenger
                analytics, revenue insights,
                congestion monitoring, and executive
                decision support for modern metro
                systems.
              </p>

            </div>

            {/* Right */}

            <div
              className="
                grid
                gap-4
                sm:grid-cols-2
              "
            >

              <div
                className="
                  rounded-2xl
                  bg-white/10
                  p-5
                  backdrop-blur-sm
                "
              >

                <p
                  className="
                    text-sm
                    text-slate-300
                  "
                >
                  Analytics Status
                </p>

                <h3
                  className="
                    mt-2
                    text-xl
                    font-bold
                    text-emerald-400
                  "
                >
                  Operational
                </h3>

              </div>

              <div
                className="
                  rounded-2xl
                  bg-white/10
                  p-5
                  backdrop-blur-sm
                "
              >

                <p
                  className="
                    text-sm
                    text-slate-300
                  "
                >
                  AI Engine
                </p>

                <h3
                  className="
                    mt-2
                    text-xl
                    font-bold
                    text-cyan-400
                  "
                >
                  Active
                </h3>

              </div>

              <div
                className="
                  rounded-2xl
                  bg-white/10
                  p-5
                  backdrop-blur-sm
                "
              >

                <p
                  className="
                    text-sm
                    text-slate-300
                  "
                >
                  Data Sources
                </p>

                <h3
                  className="
                    mt-2
                    text-xl
                    font-bold
                  "
                >
                  4 Connected APIs
                </h3>

              </div>

              <div
                className="
                  rounded-2xl
                  bg-white/10
                  p-5
                  backdrop-blur-sm
                "
              >

                <p
                  className="
                    text-sm
                    text-slate-300
                  "
                >
                  Last Updated
                </p>

                <h3
                  className="
                    mt-2
                    text-xl
                    font-bold
                  "
                >
                  {new Date().toLocaleString()}
                </h3>

              </div>

            </div>

          </div>

          <div
            className="
              mt-8
              border-t
              border-white/10
              pt-6
              text-center
              text-sm
              text-slate-400
            "
          >

            © {new Date().getFullYear()} MetroFlow •
            AI Metro Crowd Management &
            Scheduling Platform

          </div>

        </footer>

      </div>
 </DashboardLayout>

  );

}

export default Analytics;