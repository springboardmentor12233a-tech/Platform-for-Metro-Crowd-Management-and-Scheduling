import { useEffect, useState } from "react";

import {
  BrainCircuit,
  TrendingUp,
  Clock3,
  Train,
} from "lucide-react";

import api from "../../api/axios";

function AIDemandPrediction({
  schedules = [],
  loading: scheduleLoading = false,
}) {
  const [prediction, setPrediction] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const fetchRecommendation = async () => {
      if (scheduleLoading) return;

      try {
        setLoading(true);
        setError("");

        /*
         * Use the latest predicted passenger
         * value already stored by the AI prediction
         * module.
         */
        const storedPassengers =
          localStorage.getItem(
            "predictedPassengers"
          );

        const predictedPassengers =
          Number(storedPassengers) || 0;

        if (predictedPassengers <= 0) {
          setPrediction(null);
          return;
        }

        const response = await api.post(
          "/schedule/recommend",
          {
            predicted_passengers:
              predictedPassengers,
          }
        );

        setPrediction(response.data);

      } catch (err) {
        console.error(
          "Recommendation API error:",
          err
        );

        setError(
          err.response?.data?.detail ||
            "Unable to load AI recommendation."
        );

      } finally {
        setLoading(false);
      }
    };

    fetchRecommendation();
  }, [scheduleLoading]);

  const delayedTrains =
    schedules.filter(
      (train) =>
        train.status?.toLowerCase() ===
        "delayed"
    ).length;

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl text-white shadow-xl p-6 h-full">

      <div className="flex items-center gap-3 mb-6">

        <BrainCircuit
          className="text-cyan-400"
          size={28}
        />

        <div>

          <h3 className="text-xl font-bold">
            AI Demand Prediction
          </h3>

          <p className="text-slate-400 text-sm">
            AI scheduling recommendation
          </p>

        </div>

      </div>

      {loading || scheduleLoading ? (

        <div className="py-20 text-center text-slate-400">
          Loading AI prediction...
        </div>

      ) : error ? (

        <div className="rounded-2xl bg-red-500/10 border border-red-400/20 p-4 text-red-300">
          {error}
        </div>

      ) : !prediction ? (

        <div className="rounded-2xl bg-white/5 p-5 text-slate-400">
          No passenger prediction is currently
          available.
        </div>

      ) : (

        <div className="space-y-5">

          {/* Crowd Level */}

          <div className="flex justify-between items-center">

            <span className="text-slate-300">
              Crowd Level
            </span>

            <span className="text-3xl font-bold text-cyan-400">
              {prediction.crowd_level}
            </span>

          </div>

          {/* Frequency */}

          <div className="bg-white/5 rounded-2xl p-4">

            <div className="flex items-center gap-2 mb-2">

              <Train
                className="text-green-400"
                size={20}
              />

              <span className="text-sm text-slate-400">
                Recommended Frequency
              </span>

            </div>

            <h4 className="font-bold text-lg">
              {prediction.train_frequency}
            </h4>

          </div>

          {/* Metrics */}

          <div className="grid grid-cols-2 gap-4">

            <div className="bg-white/5 rounded-2xl p-4">

              <Train
                className="text-cyan-400 mb-2"
                size={22}
              />

              <p className="text-sm text-slate-400">
                Extra Trains
              </p>

              <h4 className="font-bold text-xl mt-1">
                +{prediction.extra_trains}
              </h4>

            </div>

            <div className="bg-white/5 rounded-2xl p-4">

              <Clock3
                className="text-yellow-400 mb-2"
                size={22}
              />

              <p className="text-sm text-slate-400">
                Platform Staff
              </p>

              <h4 className="font-bold text-xl mt-1">
                {prediction.platform_staff}
              </h4>

            </div>

          </div>

          {/* Current Schedule */}

          <div className="rounded-2xl bg-white/5 p-4">

            <div className="flex justify-between items-center">

              <span className="text-slate-400">
                Current Schedule
              </span>

              <span className="font-semibold text-green-400">
                {prediction.status}
              </span>

            </div>

            <p className="text-sm text-slate-300 mt-2">
              {delayedTrains > 0
                ? `${delayedTrains} delayed train${
                    delayedTrains > 1
                      ? "s"
                      : ""
                  } currently detected in the database.`
                : "No delayed trains currently detected in the database."}
            </p>

          </div>

          {/* Recommendation */}

          <div className="rounded-2xl bg-cyan-500/10 border border-cyan-400/20 p-4">

            <div className="flex items-center gap-2 mb-2">

              <TrendingUp
                className="text-cyan-400"
                size={18}
              />

              <span className="font-semibold">
                AI Recommendation
              </span>

            </div>

            <p className="text-sm text-slate-300 leading-6">
              {prediction.recommendation}
            </p>

          </div>

        </div>

      )}

    </div>
  );
}

export default AIDemandPrediction;