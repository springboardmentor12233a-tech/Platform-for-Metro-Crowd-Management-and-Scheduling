import { useEffect, useState } from "react";

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
  const [busiestStations, setBusiestStations] = useState([]);
  const [ticketDistribution, setTicketDistribution] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    try {
      setLoading(true);
      setError("");

      const [
        summaryData,
        passengerData,
        revenueData,
        stationsData,
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
      setBusiestStations(stationsData || []);
      setTicketDistribution(ticketData || []);

      setLastUpdated(new Date());
    } catch (err) {
      console.error(err);
      setError("Failed to load analytics.");
    } finally {
      setLoading(false);
    }
  }
    /* ============================================
      LOADING STATE
  ============================================ */

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">

          <div
            className="
              mx-auto
              h-16
              w-16
              animate-spin
              rounded-full
              border-4
              border-slate-200
              border-t-indigo-600
            "
          />

          <h2 className="mt-8 text-3xl font-bold text-slate-900">
            Loading Analytics...
          </h2>

          <p className="mt-3 text-slate-500">
            Connecting to MetroFlow Analytics Engine
          </p>

        </div>
      </div>
    );
  }

  /* ============================================
      ERROR STATE
  ============================================ */

  if (error) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">

        <div
          className="
            max-w-xl
            rounded-3xl
            border
            border-red-200
            bg-red-50
            p-10
            text-center
          "
        >

          <h2 className="text-3xl font-bold text-red-600">
            Analytics Unavailable
          </h2>

          <p className="mt-5 text-slate-700">
            {error}
          </p>

          <button
            onClick={loadAnalytics}
            className="
              mt-8
              rounded-xl
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
    );
  }

  /* ============================================
      EMPTY STATE
  ============================================ */

  if (
    passengerTrend.length === 0 &&
    revenueAnalysis.length === 0 &&
    busiestStations.length === 0
  ) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">

        <div className="text-center">

          <h2 className="text-3xl font-bold">
            No Analytics Available
          </h2>

          <p className="mt-4 text-slate-500">
            Analytics data will appear once the backend
            provides operational metrics.
          </p>

        </div>

      </div>
    );
  }

  /* ============================================
      ANALYTICS DASHBOARD
  ============================================ */

  return (
    <>
      <DashboardHeader
        title="Executive Analytics Dashboard"
        subtitle="AI-powered metro intelligence and operational insights"
      />

      <div className="space-y-10 pb-10">

        {/* Hero Section */}

        <AnalyticsHero
          summary={summary}
          passengerTrend={passengerTrend}
          revenueAnalysis={revenueAnalysis}
          busiestStations={busiestStations}
          lastUpdated={lastUpdated}
        />

        {/* KPI Cards */}

        <AnalyticsKPIs
          summary={summary}
          passengerTrend={passengerTrend}
          revenueAnalysis={revenueAnalysis}
          busiestStations={busiestStations}
        />
                {/* ============================================
            PASSENGER ANALYTICS
        ============================================ */}

        <PassengerAnalytics
          summary={summary}
          passengerTrend={passengerTrend}
        />

        {/* ============================================
            REVENUE ANALYTICS
        ============================================ */}

        <RevenueAnalytics
          revenueData={revenueAnalysis}
          ticketDistribution={ticketDistribution}
        />

        {/* ============================================
            OPERATIONAL ANALYTICS
        ============================================ */}

        <OperationalAnalytics
          summary={summary}
          busiestStations={busiestStations}
        />

        {/* ============================================
            AI INSIGHTS
        ============================================ */}

        <AIInsights
          summary={summary}
          passengerTrend={passengerTrend}
          revenueAnalysis={revenueAnalysis}
          busiestStations={busiestStations}
        />

        {/* ============================================
            TREND COMPARISON
        ============================================ */}

        <TrendComparison
          passengerTrend={passengerTrend}
          revenueAnalysis={revenueAnalysis}
        />

        {/* ============================================
            STATION HEATMAP
        ============================================ */}

        <HeatmapAnalytics
          summary={summary}
          busiestStations={busiestStations}
        />

        {/* ============================================
            EXPORT PANEL
        ============================================ */}

        <ExportPanel
          summary={summary}
          passengerTrend={passengerTrend}
          revenueAnalysis={revenueAnalysis}
          busiestStations={busiestStations}
        />
                {/* ============================================
            EXECUTIVE FOOTER
        ============================================ */}

        <footer
          className="
            rounded-[32px]
            overflow-hidden
            border
            border-slate-200
            bg-gradient-to-br
            from-slate-900
            via-slate-800
            to-slate-900
            p-10
            text-white
            shadow-2xl
          "
        >
          <div
            className="
              flex
              flex-col
              gap-10
              lg:flex-row
              lg:justify-between
            "
          >
            {/* Left Section */}

            <div className="max-w-3xl">

              <h2 className="text-4xl font-black">
                MetroFlow Executive Analytics
              </h2>

              <p className="mt-6 leading-8 text-slate-300">
                MetroFlow combines AI-powered crowd prediction,
                passenger analytics, revenue intelligence,
                operational monitoring, forecasting and executive
                reporting into one intelligent metro management
                platform.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">

                <span className="rounded-full bg-indigo-500/20 px-4 py-2 text-sm">
                  AI Analytics
                </span>

                <span className="rounded-full bg-cyan-500/20 px-4 py-2 text-sm">
                  Real-Time Monitoring
                </span>

                <span className="rounded-full bg-emerald-500/20 px-4 py-2 text-sm">
                  Revenue Intelligence
                </span>

                <span className="rounded-full bg-violet-500/20 px-4 py-2 text-sm">
                  Passenger Forecasting
                </span>

              </div>

            </div>

            {/* Right Section */}

            <div className="grid gap-5 sm:grid-cols-2">

              <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-md">

                <p className="text-sm text-slate-300">
                  Network Status
                </p>

                <h3 className="mt-2 text-2xl font-bold text-emerald-400">
                  Operational
                </h3>

              </div>

              <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-md">

                <p className="text-sm text-slate-300">
                  AI Engine
                </p>

                <h3 className="mt-2 text-2xl font-bold text-cyan-400">
                  Active
                </h3>

              </div>

              <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-md">

                <p className="text-sm text-slate-300">
                  Connected APIs
                </p>

                <h3 className="mt-2 text-2xl font-bold">
                  5
                </h3>

              </div>

              <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-md">

                <p className="text-sm text-slate-300">
                  Last Updated
                </p>

                <h3 className="mt-2 text-lg font-bold">
                  {lastUpdated
                    ? lastUpdated.toLocaleString()
                    : "--"}
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
    </>
  );
}

export default Analytics;