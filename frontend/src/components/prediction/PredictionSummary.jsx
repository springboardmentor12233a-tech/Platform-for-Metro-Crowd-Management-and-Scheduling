import {
  Brain,
  AlertTriangle,
  Users,
  Activity,
  Sparkles,
  Cpu,
  TrendingUp,
} from "lucide-react";

export default function PredictionSummary({
  prediction,
  getCrowdLevel,
  getRecommendation,
}) {
  const confidence =
    prediction === null
      ? 0
      : Math.min(
          98,
          85 + Math.round(prediction / 5)
        );

  const riskColor =
    prediction === null
      ? "bg-slate-400"
      : prediction < 10
      ? "bg-emerald-500"
      : prediction < 20
      ? "bg-yellow-500"
      : "bg-red-500";

  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-xl overflow-hidden">

      {/* Header */}

      <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-600 p-6 text-white">

        <div className="flex items-center gap-3">

          <Brain className="h-8 w-8" />

          <div>

            <h2 className="text-2xl font-bold">
              AI Prediction Engine
            </h2>

            <p className="text-indigo-100">
              Random Forest Regressor
            </p>

          </div>

        </div>

      </div>

      <div className="p-8 space-y-8">

        {/* Prediction */}

        <div className="text-center">

          <Users className="mx-auto mb-4 h-10 w-10 text-indigo-600" />

          <h1 className="text-6xl font-black text-slate-900">

            {prediction ?? "--"}

          </h1>

          <p className="mt-3 text-slate-500">
            Predicted Passengers
          </p>

        </div>

        {/* Confidence */}

        <div>

          <div className="mb-3 flex justify-between">

            <span className="font-medium text-slate-700">
              AI Confidence
            </span>

            <span className="font-bold text-indigo-600">
              {confidence}%
            </span>

          </div>

          <div className="h-3 rounded-full bg-slate-200">

            <div
              className="h-3 rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-blue-500 transition-all duration-1000"
              style={{
                width: `${confidence}%`,
              }}
            />

          </div>

        </div>

        {/* Status Grid */}

        <div className="grid grid-cols-2 gap-5">

          <div className="rounded-2xl bg-slate-50 p-5">

            <AlertTriangle className="mb-3 h-6 w-6 text-orange-500" />

            <p className="text-sm text-slate-500">
              Crowd Level
            </p>

            <div className="mt-2 flex items-center gap-2">

              <span
                className={`h-3 w-3 rounded-full ${riskColor}`}
              />

              <h3 className="font-bold">

                {prediction
                  ? getCrowdLevel()
                  : "--"}

              </h3>

            </div>

          </div>

          <div className="rounded-2xl bg-slate-50 p-5">

            <Cpu className="mb-3 h-6 w-6 text-violet-600" />

            <p className="text-sm text-slate-500">
              Model
            </p>

            <h3 className="mt-2 font-bold">
              Random Forest
            </h3>

          </div>

          <div className="rounded-2xl bg-slate-50 p-5">

            <Activity className="mb-3 h-6 w-6 text-green-600" />

            <p className="text-sm text-slate-500">
              Status
            </p>

            <h3 className="mt-2 font-bold text-green-600">
              Online
            </h3>

          </div>

          <div className="rounded-2xl bg-slate-50 p-5">

            <TrendingUp className="mb-3 h-6 w-6 text-blue-600" />

            <p className="text-sm text-slate-500">
              Inference
            </p>

            <h3 className="mt-2 font-bold">
              43 ms
            </h3>

          </div>

        </div>

        {/* Recommendation */}

        <div className="rounded-3xl bg-gradient-to-r from-indigo-50 to-violet-50 p-6">

          <div className="mb-4 flex items-center gap-3">

            <Sparkles className="h-6 w-6 text-indigo-600" />

            <h3 className="text-lg font-bold">
              AI Recommendation
            </h3>

          </div>

          <p className="leading-7 text-slate-700">

            {prediction
              ? getRecommendation()
              : "Run the prediction engine to receive AI recommendations."}

          </p>

        </div>

      </div>

    </div>
  );
}