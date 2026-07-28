import { useEffect, useState } from "react";

import Layout from "../../components/layout/Layout";
import DashboardHeader from "../../components/layout/DashboardHeader";

import AnalyticsHero from "./AnalyticsHero";
import AnalyticsKPIs from "./AnalyticsKPIs";
import PassengerAnalytics from "./PassengerAnalytics";
import RevenueAnalytics from "./RevenueAnalytics";
import OperationalAnalytics from "./OperationalAnalytics";
import AIInsights from "./AIInsights";
import TrendComparison from "./TrendComparison";
import HeatmapAnalytics from "./HeatmapAnalytics";
import ExportPanel from "./ExportPanel";

import {
  getDashboardSummary,
  getPassengerTrend,
  getRevenueAnalysis,
  getBusiestStations,
  getTicketDistribution,
} from "../../services/api";

function Analytics() {
  const [summary, setSummary] = useState({});
  const [passengerTrend, setPassengerTrend] = useState([]);
  const [revenueAnalysis, setRevenueAnalysis] = useState([]);
  const [ticketDistribution, setTicketDistribution] = useState([]);
  const [busiestStations, setBusiestStations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        summaryData,
        passengerData,
        revenueData,
        stationData,
        ticketData,
      ] = await Promise.all([
        getDashboardSummary(),
        getPassengerTrend(),
        getRevenueAnalysis(),
        getBusiestStations(),
        getTicketDistribution(),
      ]);

      setSummary(summaryData || {});
      setPassengerTrend(passengerData || []);
      setRevenueAnalysis(revenueData || []);
      setBusiestStations(stationData || []);
      setTicketDistribution(ticketData || []);
      setLastUpdated(new Date());
    } catch (err) {
      console.error(err);
      setError("Unable to load analytics dashboard.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <DashboardHeader
          title="Analytics"
          subtitle="Loading dashboard..."
        />

        <div className="flex h-[70vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
            <h2 className="mt-6 text-2xl font-bold text-slate-800">
              Loading Analytics...
            </h2>
            <p className="mt-2 text-slate-500">
              Fetching the latest network intelligence.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <DashboardHeader
          title="Analytics"
          subtitle="Executive Dashboard"
        />

        <div className="flex h-[70vh] items-center justify-center">
          <div className="rounded-3xl border border-red-200 bg-red-50 p-10 text-center shadow-sm">
            <h2 className="text-3xl font-bold text-red-600">
              {error}
            </h2>

            <p className="mt-3 text-red-500">
              Something went wrong while contacting the analytics service.
            </p>

            <button
              onClick={loadAnalytics}
              className="mt-8 rounded-xl bg-red-600 px-6 py-3 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-red-700 hover:shadow-md"
            >
              Retry
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <DashboardHeader
        title="Executive Analytics"
        subtitle="MetroFlow AI Analytics Dashboard"
      >
        <span className="flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          Live Analytics
        </span>
      </DashboardHeader>

      <div className="space-y-10 pb-10">

        {/* ======================================
            Executive Hero
        ======================================= */}

        <AnalyticsHero
          summary={summary}
          passengerTrend={passengerTrend}
          revenueAnalysis={revenueAnalysis}
          busiestStations={busiestStations}
          lastUpdated={lastUpdated}
        />

        {/* ======================================
            Executive KPI Cards
        ======================================= */}

        <AnalyticsKPIs
          summary={summary}
          passengerTrend={passengerTrend}
          revenueAnalysis={revenueAnalysis}
          busiestStations={busiestStations}
        />

        {/* ======================================
            Passenger Analytics
        ======================================= */}

        <PassengerAnalytics
          summary={summary}
          passengerTrend={passengerTrend}
        />

        {/* ======================================
            Revenue Analytics
        ======================================= */}

        <RevenueAnalytics
          revenueData={revenueAnalysis}
          ticketDistribution={ticketDistribution}
        />

        {/* ======================================
            Operational Analytics
        ======================================= */}

        <OperationalAnalytics
          summary={summary}
          busiestStations={busiestStations}
        />

        {/* ======================================
            AI Insights
        ======================================= */}

        <AIInsights
          summary={summary}
          passengerTrend={passengerTrend}
          revenueAnalysis={revenueAnalysis}
          busiestStations={busiestStations}
        />

        {/* ======================================
            Trend Comparison
        ======================================= */}

        <TrendComparison
          passengerTrend={passengerTrend}
          revenueAnalysis={revenueAnalysis}
        />

        {/* ======================================
            Heatmap
        ======================================= */}

        <HeatmapAnalytics
          summary={summary}
          busiestStations={busiestStations}
        />

        {/* ======================================
            Export Panel
        ======================================= */}

        <ExportPanel
          summary={summary}
          passengerTrend={passengerTrend}
          revenueAnalysis={revenueAnalysis}
          busiestStations={busiestStations}
        />

        {/* ======================================
            Footer
        ======================================= */}

        <footer
          className="
            rounded-[32px]
            border
            border-slate-200
            bg-gradient-to-br
            from-slate-900
            via-slate-800
            to-slate-900
            p-10
            text-white
            shadow-xl
          "
        >
          <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">

            <div className="max-w-3xl">

              <h2 className="text-4xl font-black tracking-tight">
                MetroFlow Executive Analytics
              </h2>

              <p className="mt-6 leading-8 text-slate-300">
                AI-powered operational intelligence for
                passenger movement, revenue forecasting,
                crowd monitoring, congestion prediction,
                and executive decision support.
              </p>

            </div>

            <div className="grid gap-5 sm:grid-cols-2">

              <div className="rounded-2xl bg-white/10 p-5 backdrop-blur transition-colors duration-200 hover:bg-white/[0.15]">

                <p className="text-sm text-slate-300">
                  Network Status
                </p>

                <h3 className="mt-2 text-xl font-bold text-emerald-400">
                  Operational
                </h3>

              </div>

              <div className="rounded-2xl bg-white/10 p-5 backdrop-blur transition-colors duration-200 hover:bg-white/[0.15]">

                <p className="text-sm text-slate-300">
                  AI Engine
                </p>

                <h3 className="mt-2 text-xl font-bold text-cyan-400">
                  Active
                </h3>

              </div>

              <div className="rounded-2xl bg-white/10 p-5 backdrop-blur transition-colors duration-200 hover:bg-white/[0.15]">

                <p className="text-sm text-slate-300">
                  APIs Connected
                </p>

                <h3 className="mt-2 text-xl font-bold">
                  5
                </h3>

              </div>

              <div className="rounded-2xl bg-white/10 p-5 backdrop-blur transition-colors duration-200 hover:bg-white/[0.15]">

                <p className="text-sm text-slate-300">
                  Updated
                </p>

                <h3 className="mt-2 text-lg font-bold">
                  {lastUpdated.toLocaleString()}
                </h3>

              </div>

            </div>

          </div>

          <div
            className="
              mt-10
              border-t
              border-white/10
              pt-6
              text-center
              text-sm
              text-slate-400
            "
          >
            © {new Date().getFullYear()} MetroFlow •
            AI Metro Crowd Management & Scheduling Platform
          </div>

        </footer>

      </div>

    </Layout>

  );

}

export default Analytics;