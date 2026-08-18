import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Train,
  Plus,
  Users,
  Gauge,
  RefreshCw,
  CheckCircle2,
  Wrench,
  XCircle,
} from "lucide-react";

import api from "../api/axios";

import ScheduleHeader from "../components/Schedule/ScheduleHeader";
import ScheduleKPIs from "../components/Schedule/ScheduleKPIs";
import AIRecommendations from "../components/Schedule/AIRecommendations";
import ScheduleAnalytics from "../components/Schedule/ScheduleAnalytics";

function Schedule() {
  const navigate = useNavigate();

  /* =========================================================
     SCHEDULE STATE
  ========================================================= */

  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  /* =========================================================
     TRAIN STATE
  ========================================================= */

  const [trains, setTrains] = useState([]);
  const [trainsLoading, setTrainsLoading] = useState(true);
  const [trainsError, setTrainsError] = useState("");


  /* =========================================================
     FETCH SCHEDULES
  ========================================================= */

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/schedule/");

      setSchedules(response.data || []);
    } catch (err) {
      console.error("Schedule API error:", err);

      setError(
        err.response?.data?.detail ||
          "Unable to load schedule data."
      );

      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };


  /* =========================================================
     FETCH TRAINS
  ========================================================= */

  const fetchTrains = async () => {
    try {
      setTrainsLoading(true);
      setTrainsError("");

      const response = await api.get("/trains/");

      setTrains(response.data || []);
    } catch (err) {
      console.error("Train API error:", err);

      setTrainsError(
        err.response?.data?.detail ||
          "Unable to load registered trains."
      );

      setTrains([]);
    } finally {
      setTrainsLoading(false);
    }
  };


  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    fetchSchedules();
    fetchTrains();
  }, []);


  /* =========================================================
     TRAIN STATUS ICON
  ========================================================= */

  const getStatusIcon = (status) => {
    switch (status) {
      case "Active":
        return (
          <CheckCircle2
            size={16}
            className="text-emerald-600"
          />
        );

      case "Maintenance":
        return (
          <Wrench
            size={16}
            className="text-amber-600"
          />
        );

      case "Inactive":
        return (
          <XCircle
            size={16}
            className="text-red-600"
          />
        );

      default:
        return (
          <CheckCircle2
            size={16}
            className="text-slate-400"
          />
        );
    }
  };


  /* =========================================================
     TRAIN STATUS STYLE
  ========================================================= */

  const getStatusStyle = (status) => {
    switch (status) {
      case "Active":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";

      case "Maintenance":
        return "bg-amber-50 text-amber-700 border-amber-200";

      case "Inactive":
        return "bg-red-50 text-red-700 border-red-200";

      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };


  return (
    <div className="min-h-screen bg-slate-100">

      <div className="max-w-[1800px] mx-auto px-8 py-8 space-y-8">


        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <ScheduleHeader />

          <div className="flex flex-wrap items-center gap-3">

            {/* Add Train */}
            <button
              onClick={() =>
                navigate("/schedule/add-train")
              }
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              <Plus size={18} />
              Add Train
            </button>

            {/* View Full Schedule */}
            <button
              onClick={() =>
                navigate("/schedule/list")
              }
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              View Full Schedule
              <ArrowRight size={18} />
            </button>

          </div>

        </div>


        {/* =====================================================
            KPI CARDS
        ===================================================== */}

        <ScheduleKPIs
          schedules={schedules}
          loading={loading}
        />


        {/* =====================================================
            SCHEDULE ERROR
        ===================================================== */}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
            {error}
          </div>
        )}


        {/* =====================================================
            REGISTERED TRAINS
        ===================================================== */}

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">

          {/* ---------------------------------------------------
              CARD HEADER
          --------------------------------------------------- */}

          <div className="flex flex-col gap-4 border-b border-slate-200 p-6 md:flex-row md:items-center md:justify-between">

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100">
                <Train
                  size={24}
                  className="text-indigo-600"
                />
              </div>

              <div>

                <h2 className="text-xl font-bold text-slate-900">
                  Registered Trains
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Manage trains registered in the MetroVision network.
                </p>

              </div>

            </div>


            <div className="flex items-center gap-3">

              {/* Train Count */}
              <div className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                {trains.length}{" "}
                {trains.length === 1
                  ? "Train"
                  : "Trains"}
              </div>

              {/* Refresh */}
              <button
                onClick={fetchTrains}
                disabled={trainsLoading}
                title="Refresh trains"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw
                  size={17}
                  className={
                    trainsLoading
                      ? "animate-spin"
                      : ""
                  }
                />
              </button>

            </div>

          </div>


          {/* ---------------------------------------------------
              TRAIN ERROR
          --------------------------------------------------- */}

          {trainsError && (
            <div className="m-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {trainsError}
            </div>
          )}


          {/* ---------------------------------------------------
              LOADING
          --------------------------------------------------- */}

          {trainsLoading ? (

            <div className="flex flex-col items-center justify-center py-16">

              <RefreshCw
                size={28}
                className="animate-spin text-indigo-600"
              />

              <p className="mt-3 text-sm text-slate-500">
                Loading registered trains...
              </p>

            </div>

          ) : trains.length === 0 ? (

            /* -------------------------------------------------
               EMPTY STATE
            ------------------------------------------------- */

            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50">
                <Train
                  size={30}
                  className="text-indigo-500"
                />
              </div>

              <h3 className="mt-5 text-lg font-semibold text-slate-900">
                No trains registered yet
              </h3>

              <p className="mt-2 max-w-md text-sm text-slate-500">
                Add your first metro train to start managing
                train operations and scheduling.
              </p>

              <button
                onClick={() =>
                  navigate("/schedule/add-train")
                }
                className="mt-5 flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                <Plus size={18} />
                Add First Train
              </button>

            </div>

          ) : (

            /* -------------------------------------------------
               TRAIN TABLE
            ------------------------------------------------- */

            <div className="overflow-x-auto">

              <table className="w-full min-w-[900px]">

                <thead className="border-b border-slate-200 bg-slate-50">

                  <tr>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Train
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Metro Line
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Type
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Capacity
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Coaches
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Status
                    </th>

                  </tr>

                </thead>


                <tbody className="divide-y divide-slate-100">

                  {trains.map((train) => (

                    <tr
                      key={train.id}
                      className="transition hover:bg-slate-50"
                    >

                      {/* Train */}
                      <td className="px-6 py-5">

                        <div className="flex items-center gap-3">

                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100">
                            <Train
                              size={20}
                              className="text-indigo-600"
                            />
                          </div>

                          <div>

                            <p className="font-semibold text-slate-900">
                              {train.train_number}
                            </p>

                            <p className="mt-0.5 text-xs text-slate-500">
                              {train.train_name}
                            </p>

                          </div>

                        </div>

                      </td>


                      {/* Line */}
                      <td className="px-6 py-5">

                        <span className="inline-flex rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700">
                          {train.line} Line
                        </span>

                      </td>


                      {/* Type */}
                      <td className="px-6 py-5 text-sm text-slate-600">
                        {train.train_type}
                      </td>


                      {/* Capacity */}
                      <td className="px-6 py-5">

                        <div className="flex items-center gap-2 text-sm text-slate-700">

                          <Users
                            size={16}
                            className="text-slate-400"
                          />

                          {Number(
                            train.capacity
                          ).toLocaleString()}

                        </div>

                      </td>


                      {/* Coaches */}
                      <td className="px-6 py-5">

                        <div className="flex items-center gap-2 text-sm text-slate-700">

                          <Gauge
                            size={16}
                            className="text-slate-400"
                          />

                          {train.coaches}

                        </div>

                      </td>


                      {/* Status */}
                      <td className="px-6 py-5">

                        <span
                          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusStyle(
                            train.status
                          )}`}
                        >

                          {getStatusIcon(
                            train.status
                          )}

                          {train.status}

                        </span>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>


        {/* =====================================================
            SCHEDULE SUMMARY + AI RECOMMENDATIONS
        ===================================================== */}

        <div className="grid gap-8 xl:grid-cols-3">


          {/* ---------------------------------------------------
              SCHEDULE SUMMARY
          --------------------------------------------------- */}

          <div className="xl:col-span-2">

            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">

              {/* Header */}
              <div className="p-6">

                <div className="flex items-center justify-between gap-4">

                  <div className="flex items-center gap-4">

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100">
                      <Train
                        size={24}
                        className="text-indigo-600"
                      />
                    </div>

                    <div>

                      <h2 className="text-xl font-bold text-slate-900">
                        Today's Train Schedule
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        AI Optimized Metro Timetable
                      </p>

                    </div>

                  </div>


                  <button
                    onClick={() =>
                      navigate("/schedule/list")
                    }
                    className="flex items-center gap-2 whitespace-nowrap rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
                  >
                    View Full Schedule
                    <ArrowRight size={18} />
                  </button>

                </div>

              </div>


              {/* Summary */}
              <div className="border-t border-slate-200 p-6">

                {loading ? (

                  <div className="py-8 text-center text-slate-500">
                    Loading schedule...
                  </div>

                ) : schedules.length === 0 ? (

                  <div className="py-8 text-center text-slate-500">
                    No train schedules found.
                  </div>

                ) : (

                  <>

                    {/* Total */}
                    <div className="mb-5">

                      <p className="text-sm text-slate-500">
                        Total scheduled trains
                      </p>

                      <p className="mt-1 text-3xl font-bold text-slate-900">
                        {schedules.length}
                      </p>

                    </div>


                    {/* Line Summary */}
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-5">

                      {[
                        "Blue",
                        "Yellow",
                        "Red",
                        "Green",
                        "Magenta",
                      ].map((line) => {

                        const count =
                          schedules.filter(
                            (train) =>
                              train.line === line
                          ).length;

                        return (

                          <div
                            key={line}
                            className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                          >

                            <p className="text-sm text-slate-500">
                              {line} Line
                            </p>

                            <p className="mt-1 text-2xl font-bold text-slate-900">
                              {count}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              trains
                            </p>

                          </div>

                        );

                      })}

                    </div>

                  </>

                )}

              </div>


              {/* Footer */}
              <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">

                <div className="flex items-center justify-between">

                  <p className="text-sm text-slate-500">
                    Complete timetable available on the schedule page.
                  </p>

                  <button
                    onClick={() =>
                      navigate("/schedule/list")
                    }
                    className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    View all →
                  </button>

                </div>

              </div>

            </div>

          </div>


          {/* ---------------------------------------------------
              AI RECOMMENDATIONS
          --------------------------------------------------- */}

          <AIRecommendations
            scheduleData={schedules}
            loading={loading}
          />

        </div>


        {/* =====================================================
            ANALYTICS
        ===================================================== */}

        <ScheduleAnalytics
          schedules={schedules}
          loading={loading}
        />

      </div>

    </div>
  );
}

export default Schedule;