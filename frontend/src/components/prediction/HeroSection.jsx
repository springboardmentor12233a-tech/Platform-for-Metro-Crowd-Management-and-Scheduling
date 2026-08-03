import {
  Brain,
  Cpu,
  Activity,
  Sparkles,
} from "lucide-react";

export default function HeroSection() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-600 p-8 text-white shadow-2xl">

      <div className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

      <div className="absolute -left-16 bottom-0 h-44 w-44 rounded-full bg-cyan-300/20 blur-3xl" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <div className="mb-4 flex items-center gap-3">

            <div className="rounded-2xl bg-white/20 p-3 backdrop-blur">

              <Brain className="h-8 w-8" />

            </div>

            <div>

              <h1 className="text-4xl font-bold">
                AI Passenger Prediction
              </h1>

              <p className="mt-2 text-indigo-100">
                MetroVision Intelligence Engine
              </p>

            </div>

          </div>

          <p className="max-w-3xl text-indigo-100">
            Predict passenger demand using machine learning,
            analyse crowd behaviour, estimate congestion,
            and optimise metro scheduling in real time.
          </p>

        </div>

        <div className="grid grid-cols-2 gap-4">

          <div className="rounded-2xl bg-white/15 p-5 backdrop-blur">

            <Cpu className="mb-3 h-6 w-6" />

            <p className="text-sm text-indigo-100">
              Model
            </p>

            <h3 className="text-xl font-bold">
              Random Forest
            </h3>

          </div>

          <div className="rounded-2xl bg-white/15 p-5 backdrop-blur">

            <Activity className="mb-3 h-6 w-6" />

            <p className="text-sm text-indigo-100">
              Accuracy
            </p>

            <h3 className="text-xl font-bold">
              96.4%
            </h3>

          </div>

          <div className="rounded-2xl bg-white/15 p-5 backdrop-blur">

            <Sparkles className="mb-3 h-6 w-6" />

            <p className="text-sm text-indigo-100">
              AI Confidence
            </p>

            <h3 className="text-xl font-bold">
              97%
            </h3>

          </div>

          <div className="rounded-2xl bg-white/15 p-5 backdrop-blur">

            <div className="mb-3 flex items-center gap-2">

              <span className="relative flex h-3 w-3">

                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300" />

                <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-400" />

              </span>

              <span className="text-sm">
                LIVE
              </span>

            </div>

            <p className="text-sm text-indigo-100">
              Status
            </p>

            <h3 className="text-xl font-bold">
              Online
            </h3>

          </div>

        </div>

      </div>

    </div>
  );
}