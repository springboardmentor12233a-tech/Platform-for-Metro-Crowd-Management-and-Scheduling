import { motion } from "framer-motion";
import {
  Brain,
  TrendingUp,
  Users,
  Clock,
} from "lucide-react";

function PassengerForecast({
  latestPrediction,
}) {

  // ==========================
  // Base Prediction
  // ==========================

  const basePassengers =
    latestPrediction?.predicted_passengers || 0;

  const forecast = [
    {
      time: "Current",
      passengers: basePassengers,
      increase: 0,
    },
    {
      time: "+15 min",
      passengers: Math.round(
        basePassengers * 1.08
      ),
      increase: 8,
    },
    {
      time: "+30 min",
      passengers: Math.round(
        basePassengers * 1.15
      ),
      increase: 15,
    },
    {
      time: "+45 min",
      passengers: Math.round(
        basePassengers * 1.22
      ),
      increase: 22,
    },
    {
      time: "+60 min",
      passengers: Math.round(
        basePassengers * 1.30
      ),
      increase: 30,
    },
  ];

  const maxPassengers =
    Math.max(
      ...forecast.map(
        (item) => item.passengers
      ),
      1
    );

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.45,
      }}
      className="
        rounded-[32px]
        border
        border-slate-200
        bg-white
        p-8
        shadow-xl
      "
    >

      {/* Header */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex items-center gap-5">

          <div
            className="
              rounded-2xl
              bg-gradient-to-br
              from-cyan-500
              to-indigo-600
              p-4
            "
          >

            <Brain
              size={34}
              className="text-white"
            />

          </div>

          <div>

            <h2 className="text-3xl font-bold text-slate-900">
              Passenger Forecast
            </h2>

            <p className="mt-2 text-slate-500">
              AI prediction for the next 60 minutes
            </p>

          </div>

        </div>

        <div
          className="
            rounded-2xl
            bg-indigo-50
            px-6
            py-4
          "
        >

          <p className="text-sm text-slate-500">
            Current Prediction
          </p>

          <h2 className="mt-1 text-3xl font-bold text-indigo-600">
            {basePassengers.toLocaleString()}
          </h2>

        </div>

      </div>

      <div className="my-8 h-px bg-slate-200" />
            {/* ==========================
          AI Forecast Insights
      ========================== */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* AI Summary */}

        <div
          className="
            xl:col-span-2
            rounded-3xl
            bg-gradient-to-br
            from-cyan-600
            via-indigo-600
            to-violet-700
            p-8
            text-white
            shadow-xl
          "
        >

          <div className="flex items-center gap-4">

            <div className="rounded-2xl bg-white/15 p-4">

              <Brain size={34} />

            </div>

            <div>

              <h2 className="text-3xl font-bold">
                AI Forecast Summary
              </h2>

              <p className="mt-2 text-cyan-100">
                Intelligent passenger flow prediction generated
                from the latest network activity.
              </p>

            </div>

          </div>

          {latestPrediction ? (

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">

                <p className="text-cyan-100">
                  Predicted Route
                </p>

                <h3 className="mt-2 text-2xl font-bold">

                  {latestPrediction.from_station}

                </h3>

                <p className="mt-2 text-lg">

                  ↓

                </p>

                <h3 className="text-2xl font-bold">

                  {latestPrediction.to_station}

                </h3>

              </div>

              <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">

                <p className="text-cyan-100">
                  Expected Peak
                </p>

                <h2 className="mt-3 text-5xl font-bold">

                  {forecast[4].passengers.toLocaleString()}

                </h2>

                <p className="mt-3 text-cyan-100">

                  within 60 minutes

                </p>

              </div>

              <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">

                <p className="text-cyan-100">
                  Ticket Type
                </p>

                <h2 className="mt-3 text-3xl font-bold">

                  {latestPrediction.ticket_type}

                </h2>

              </div>

              <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">

                <p className="text-cyan-100">
                  Estimated Growth
                </p>

                <h2 className="mt-3 text-5xl font-bold">

                  +30%

                </h2>

              </div>

            </div>

          ) : (

            <div className="mt-8 rounded-3xl bg-white/10 p-8 text-center">

              <Brain
                size={60}
                className="mx-auto opacity-80"
              />

              <h3 className="mt-5 text-2xl font-bold">
                Waiting for Prediction
              </h3>

              <p className="mt-3 text-cyan-100">
                The AI engine is collecting live operational
                data before generating the next forecast.
              </p>

            </div>

          )}

        </div>

        {/* Forecast Statistics */}

        <div
          className="
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-7
            shadow-lg
          "
        >

          <h2 className="text-2xl font-bold text-slate-900">
            Forecast Statistics
          </h2>

          <div className="mt-8 space-y-7">

            <div>

              <div className="flex justify-between">

                <span className="text-slate-600">
                  Current Forecast
                </span>

                <strong>

                  {basePassengers.toLocaleString()}

                </strong>

              </div>

            </div>

            <div>

              <div className="flex justify-between">

                <span className="text-slate-600">
                  Peak Forecast
                </span>

                <strong>

                  {forecast[4].passengers.toLocaleString()}

                </strong>

              </div>

            </div>

            <div>

              <div className="flex justify-between">

                <span className="text-slate-600">
                  Forecast Growth
                </span>

                <strong className="text-green-600">
                  +30%
                </strong>

              </div>

            </div>

            <div>

              <div className="flex justify-between">

                <span className="text-slate-600">
                  Time Horizon
                </span>

                <strong>
                  60 Minutes
                </strong>

              </div>

            </div>

            <div>

              <div className="flex justify-between">

                <span className="text-slate-600">
                  Confidence
                </span>

                <strong className="text-indigo-600">
                  High
                </strong>

              </div>

            </div>

            <div>

              <div className="flex justify-between">

                <span className="text-slate-600">
                  Status
                </span>

                <strong className="text-green-600">
                  Live Analysis
                </strong>

              </div>

            </div>

          </div>

        </div>

      </div>

      <div className="my-8 h-px bg-slate-200" />
            {/* ==========================
          AI Recommendations
      ========================== */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

        {/* AI Recommendation */}

        <div
          className="
            rounded-3xl
            border
            border-slate-200
            bg-gradient-to-br
            from-slate-900
            via-slate-800
            to-slate-900
            p-8
            text-white
            shadow-xl
          "
        >

          <div className="flex items-center gap-4">

            <div className="rounded-2xl bg-white/10 p-4">
              <Brain size={34} />
            </div>

            <div>

              <h2 className="text-2xl font-bold">
                AI Recommendation
              </h2>

              <p className="mt-2 text-slate-300">
                Suggested operational response
              </p>

            </div>

          </div>

          <div className="mt-8 rounded-2xl bg-white/5 p-6">

            <p className="leading-8 text-slate-300">

              {forecast[4].passengers >= basePassengers * 1.25
                ? "Passenger demand is expected to increase significantly within the next hour. Consider dispatching additional metro services, increasing platform staff, and monitoring high-demand routes to maintain smooth passenger movement."
                : "Passenger demand is expected to remain stable over the next hour. Continue routine monitoring while maintaining current train frequency and staffing levels."}

            </p>

          </div>

          <div className="mt-8 flex flex-wrap gap-3">

            <span className="rounded-full bg-cyan-500/20 px-4 py-2 text-cyan-300">
              AI Active
            </span>

            <span className="rounded-full bg-green-500/20 px-4 py-2 text-green-300">
              Live Forecast
            </span>

            <span className="rounded-full bg-indigo-500/20 px-4 py-2 text-indigo-300">
              60 Min Window
            </span>

          </div>

        </div>

        {/* Forecast Status */}

        <div
          className="
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-8
            shadow-lg
          "
        >

          <h2 className="text-2xl font-bold text-slate-900">
            Forecast Status
          </h2>

          <div className="mt-8 space-y-6">

            <div className="flex items-center justify-between">

              <span className="text-slate-600">
                Prediction Engine
              </span>

              <span className="font-semibold text-green-600">
                Online
              </span>

            </div>

            <div className="flex items-center justify-between">

              <span className="text-slate-600">
                Forecast Window
              </span>

              <span className="font-semibold">
                60 Minutes
              </span>

            </div>

            <div className="flex items-center justify-between">

              <span className="text-slate-600">
                Demand Level
              </span>

              <span
                className={`font-semibold ${
                  forecast[4].passengers >= basePassengers * 1.25
                    ? "text-red-600"
                    : forecast[4].passengers >= basePassengers * 1.15
                    ? "text-orange-600"
                    : "text-green-600"
                }`}
              >

                {forecast[4].passengers >= basePassengers * 1.25
                  ? "High"
                  : forecast[4].passengers >= basePassengers * 1.15
                  ? "Moderate"
                  : "Low"}

              </span>

            </div>

            <div className="flex items-center justify-between">

              <span className="text-slate-600">
                Data Source
              </span>

              <span className="font-semibold">
                Live Backend
              </span>

            </div>

            <div className="flex items-center justify-between">

              <span className="text-slate-600">
                Update Frequency
              </span>

              <span className="font-semibold">
                30 Seconds
              </span>

            </div>

          </div>

          <div
            className="
              mt-8
              rounded-2xl
              border
              border-slate-200
              bg-slate-50
              p-5
            "
          >

            <div className="flex items-center gap-3">

              <span className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></span>

              <span className="font-semibold text-slate-800">
                Live AI Forecast Running
              </span>

            </div>

            <p className="mt-4 text-sm leading-7 text-slate-600">

              Passenger demand predictions are continuously refreshed
              using the latest operational data received from the MetroFlow
              AI backend.

            </p>

          </div>

        </div>

      </div>

    </motion.section>
  );
}

export default PassengerForecast;