import {
  BrainCircuit,
  TrendingUp,
  Clock3,
  Train,
} from "lucide-react";

function AIDemandPrediction() {
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
            Forecast for the next 60 minutes
          </p>

        </div>

      </div>

      <div className="space-y-5">

        <div className="flex justify-between items-center">

          <span className="text-slate-300">
            Predicted Demand
          </span>

          <span className="text-3xl font-bold text-cyan-400">
            +18%
          </span>

        </div>

        <div className="w-full h-3 rounded-full bg-slate-700 overflow-hidden">

          <div
            className="h-full rounded-full bg-cyan-400"
            style={{ width: "82%" }}
          />

        </div>

        <div className="grid grid-cols-2 gap-4 pt-4">

          <div className="bg-white/5 rounded-2xl p-4">

            <Clock3
              className="text-yellow-400 mb-2"
              size={22}
            />

            <p className="text-sm text-slate-400">
              Peak Hour
            </p>

            <h4 className="font-bold mt-1">
              08:30–09:30
            </h4>

          </div>

          <div className="bg-white/5 rounded-2xl p-4">

            <Train
              className="text-green-400 mb-2"
              size={22}
            />

            <p className="text-sm text-slate-400">
              Extra Trains
            </p>

            <h4 className="font-bold mt-1">
              +6 Required
            </h4>

          </div>

        </div>

        <div className="rounded-2xl bg-cyan-500/10 border border-cyan-400/20 p-4 mt-4">

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
            Increase Blue Line train frequency by approximately 10%
            between 08:30 and 09:30 to accommodate predicted passenger growth.
          </p>

        </div>

      </div>

    </div>
  );
}

export default AIDemandPrediction;