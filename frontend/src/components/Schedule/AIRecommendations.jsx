import {
  BrainCircuit,
  TrendingUp,
  AlertTriangle,
  Train,
} from "lucide-react";

function AIRecommendations({
  scheduleData = [],
  loading = false,
}) {
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl text-white shadow-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <BrainCircuit
            className="text-cyan-400"
            size={28}
          />

          <div>
            <h2 className="text-xl font-bold">
              AI Recommendations
            </h2>

            <p className="text-slate-400 text-sm">
              Schedule optimization engine
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-white/5 p-4 text-slate-400">
          Loading recommendations...
        </div>
      </div>
    );
  }

  const delayed = scheduleData.filter(
    (train) =>
      train.status?.toLowerCase() === "delayed"
  );

  const boarding = scheduleData.filter(
    (train) =>
      train.status?.toLowerCase() === "boarding"
  );

  const onTime = scheduleData.filter(
    (train) =>
      train.status?.toLowerCase() === "on time"
  );

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl text-white shadow-xl p-6">

      <div className="flex items-center gap-3 mb-6">

        <BrainCircuit
          className="text-cyan-400"
          size={28}
        />

        <div>

          <h2 className="text-xl font-bold">
            AI Recommendations
          </h2>

          <p className="text-slate-400 text-sm">
            Schedule optimization engine
          </p>

        </div>

      </div>

      <div className="space-y-4">

        {delayed.length > 0 && (
          <div className="rounded-2xl bg-white/5 p-4">

            <div className="flex items-center gap-2 mb-2">

              <AlertTriangle
                className="text-red-400"
                size={18}
              />

              <span className="font-semibold">
                Delayed Services
              </span>

            </div>

            <p className="text-slate-300 text-sm">
              {delayed.length} train
              {delayed.length > 1 ? "s" : ""}
              currently delayed. Consider
              increasing frequency on affected
              routes.
            </p>

          </div>
        )}

        {boarding.length > 0 && (
          <div className="rounded-2xl bg-white/5 p-4">

            <div className="flex items-center gap-2 mb-2">

              <Train
                className="text-yellow-400"
                size={18}
              />

              <span className="font-semibold">
                Platform Preparation
              </span>

            </div>

            <p className="text-slate-300 text-sm">
              {boarding.length} train
              {boarding.length > 1 ? "s" : ""}
              currently boarding. Prepare
              platform operations.
            </p>

          </div>
        )}

        {onTime.length > 0 && (
          <div className="rounded-2xl bg-white/5 p-4">

            <div className="flex items-center gap-2 mb-2">

              <TrendingUp
                className="text-green-400"
                size={18}
              />

              <span className="font-semibold">
                Network Status
              </span>

            </div>

            <p className="text-slate-300 text-sm">
              {onTime.length} train
              {onTime.length > 1 ? "s" : ""}
              currently operating on time.
            </p>

          </div>
        )}

        {scheduleData.length === 0 && (
          <div className="rounded-2xl bg-white/5 p-4 text-slate-400">
            No AI recommendations available.
          </div>
        )}

      </div>

    </div>
  );
}

export default AIRecommendations;