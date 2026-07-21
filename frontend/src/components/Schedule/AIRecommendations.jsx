import { BrainCircuit, TrendingUp } from "lucide-react";

function AIRecommendations() {
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

        <div className="rounded-2xl bg-white/5 p-4">

          <div className="flex items-center gap-2 mb-2">

            <TrendingUp
              className="text-green-400"
              size={18}
            />

            <span className="font-semibold">
              Blue Line
            </span>

          </div>

          <p className="text-slate-300 text-sm">
            Increase train frequency between 08:30 and 09:15.
          </p>

        </div>

        <div className="rounded-2xl bg-white/5 p-4">

          <div className="flex items-center gap-2 mb-2">

            <TrendingUp
              className="text-yellow-400"
              size={18}
            />

            <span className="font-semibold">
              Yellow Line
            </span>

          </div>

          <p className="text-slate-300 text-sm">
            Predicted passenger growth of 18%.
          </p>

        </div>

        <div className="rounded-2xl bg-white/5 p-4">

          <div className="flex items-center gap-2 mb-2">

            <TrendingUp
              className="text-cyan-400"
              size={18}
            />

            <span className="font-semibold">
              AI Suggestion
            </span>

          </div>

          <p className="text-slate-300 text-sm">
            Maintain current Green Line schedule.
          </p>

        </div>

      </div>

    </div>
  );
}

export default AIRecommendations;