import { motion } from "framer-motion";
import {
  Brain,
  AlertTriangle,
  TrendingUp,
  ShieldCheck,
  Activity,
} from "lucide-react";

import useMetro from "../../hooks/useMetro";

function AIRecommendationCard() {
  const { aiRecommendation } = useMetro();

  if (!aiRecommendation) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-2xl border border-slate-700 bg-slate-900/70 p-6 backdrop-blur-xl"
      >
        <div className="flex items-center gap-3">
          <Brain className="h-8 w-8 text-cyan-400" />

          <div>
            <h2 className="text-xl font-semibold text-white">
              AI Decision Engine
            </h2>

            <p className="text-slate-400">
              Waiting for live metro analysis...
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  const {
    station,
    risk,
    riskScore,
    confidence,
    action,
    prediction,
    generatedAt,
  } = aiRecommendation;

  const riskColor =
    risk === "HIGH"
      ? "text-red-400 bg-red-500/20"
      : risk === "MEDIUM"
      ? "text-amber-400 bg-amber-500/20"
      : "text-emerald-400 bg-emerald-500/20";

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.5,
      }}
      className="rounded-2xl border border-slate-700 bg-slate-900/70 p-6 backdrop-blur-xl shadow-xl"
    >
      {/* Header */}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="h-8 w-8 text-cyan-400" />

          <div>
            <h2 className="text-xl font-bold text-white">
              AI Decision Engine
            </h2>

            <p className="text-sm text-slate-400">
              Live Operational Intelligence
            </p>
          </div>
        </div>

        <div
          className={`rounded-full px-4 py-2 text-sm font-semibold ${riskColor}`}
        >
          {risk} RISK
        </div>
      </div>

      {/* Metrics */}

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-700 bg-slate-800/60 p-4">
          <div className="flex items-center gap-3">
            <Activity className="h-5 w-5 text-cyan-400" />

            <div>
              <p className="text-sm text-slate-400">Station</p>

              <h3 className="mt-1 text-lg font-semibold text-white">
                {station}
              </h3>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-800/60 p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-400" />

            <div>
              <p className="text-sm text-slate-400">Risk Score</p>

              <h3 className="mt-1 text-lg font-semibold text-white">
                {riskScore}/100
              </h3>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-800/60 p-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />

            <div>
              <p className="text-sm text-slate-400">Confidence</p>

              <h3 className="mt-1 text-lg font-semibold text-white">
                {confidence}%
              </h3>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-800/60 p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-violet-400" />

            <div>
              <p className="text-sm text-slate-400">Forecast</p>

              <h3 className="mt-1 text-lg font-semibold text-white">
                {risk}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Prediction */}

      <div className="mt-6 rounded-xl border border-slate-700 bg-slate-800/50 p-5">
        <h3 className="mb-2 text-lg font-semibold text-white">
          AI Prediction
        </h3>

        <p className="leading-7 text-slate-300">
          {prediction}
        </p>
      </div>

      {/* Recommended Action */}

      <div className="mt-6 rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-5">
        <h3 className="mb-2 text-lg font-semibold text-cyan-300">
          Recommended Action
        </h3>

        <p className="leading-7 text-slate-200">
          {action}
        </p>
      </div>

      {/* Footer */}

      <div className="mt-6 flex flex-col gap-4 border-t border-slate-700 pt-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-500">
            Last Analysis
          </p>

          <p className="mt-1 text-sm text-slate-300">
            {generatedAt
              ? new Date(generatedAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })
              : "--:--:--"}
          </p>
        </div>

        <motion.div
          animate={{
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          className="flex items-center gap-2 rounded-full bg-emerald-500/15 px-4 py-2"
        >
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />

          <span className="text-sm font-medium text-emerald-300">
            AI Monitoring Active
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default AIRecommendationCard;