import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  ShieldAlert,
  TrendingUp,
  Target,
} from "lucide-react";

import {
  generateRecommendation,
} from "../../utils/aiDecisionEngine";

function AIRiskPanel({
  busiestStations = [],
}) {

  const recommendations = useMemo(() => {

    if (!busiestStations.length) {
      return [];
    }

    return busiestStations
      .map((station) =>
        generateRecommendation({
          ...station,

          station:
            station.station_name ||
            station.station ||
            station.name,

          passengers:
            station.passengers ??
            station.total_passengers ??
            0,

          occupancy:
            station.occupancy ??
            Math.min(
              Math.round(
                ((station.passengers ??
                  station.total_passengers ??
                  0) /
                  10000) *
                  100
              ),
              100
            ),

          capacity:
            station.capacity ?? 10000,
        })
      )
      .sort(
        (a, b) =>
          b.riskScore - a.riskScore
      );

  }, [busiestStations]);

  return (

    <section className="space-y-8">

      {/* Header */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <h2 className="text-3xl font-bold text-slate-900">
            AI Risk Assessment
          </h2>

          <p className="mt-2 text-slate-500">
            AI-generated operational risk scores and recommendations for monitored metro stations.
          </p>

        </div>

      </div>
            {/* ==========================
          AI Risk Overview
      ========================== */}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

        {/* High Risk Stations */}

        <motion.div
          whileHover={{ y: -5 }}
          className="
            rounded-3xl
            border
            border-red-200
            bg-white
            p-6
            shadow-sm
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500">
                High Risk
              </p>

              <h3 className="mt-3 text-4xl font-bold text-red-600">

                {
                  recommendations.filter(
                    (item) => item.risk === "HIGH"
                  ).length
                }

              </h3>

            </div>

            <div className="rounded-2xl bg-red-100 p-4">

              <ShieldAlert
                size={30}
                className="text-red-600"
              />

            </div>

          </div>

          <p className="mt-5 text-sm text-slate-500">
            Stations requiring immediate action
          </p>

        </motion.div>

        {/* Average Risk Score */}

        <motion.div
          whileHover={{ y: -5 }}
          className="
            rounded-3xl
            border
            border-cyan-200
            bg-white
            p-6
            shadow-sm
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500">
                Avg Risk Score
              </p>

              <h3 className="mt-3 text-4xl font-bold text-cyan-600">

                {recommendations.length
                  ? Math.round(
                      recommendations.reduce(
                        (sum, item) =>
                          sum + item.riskScore,
                        0
                      ) / recommendations.length
                    )
                  : 0}

              </h3>

            </div>

            <div className="rounded-2xl bg-cyan-100 p-4">

              <TrendingUp
                size={30}
                className="text-cyan-600"
              />

            </div>

          </div>

          <p className="mt-5 text-sm text-slate-500">
            Network-wide AI risk score
          </p>

        </motion.div>

        {/* AI Confidence */}

        <motion.div
          whileHover={{ y: -5 }}
          className="
            rounded-3xl
            border
            border-emerald-200
            bg-white
            p-6
            shadow-sm
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500">
                AI Confidence
              </p>

              <h3 className="mt-3 text-4xl font-bold text-emerald-600">

                {recommendations.length
                  ? Math.round(
                      recommendations.reduce(
                        (sum, item) =>
                          sum + item.confidence,
                        0
                      ) / recommendations.length
                    )
                  : 0}
                %

              </h3>

            </div>

            <div className="rounded-2xl bg-emerald-100 p-4">

              <Target
                size={30}
                className="text-emerald-600"
              />

            </div>

          </div>

          <p className="mt-5 text-sm text-slate-500">
            Average prediction confidence
          </p>

        </motion.div>

        {/* AI System Status */}

        <motion.div
          whileHover={{ y: -5 }}
          className="
            rounded-3xl
            border
            border-violet-200
            bg-white
            p-6
            shadow-sm
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500">
                AI System
              </p>

              <h3 className="mt-3 text-3xl font-bold text-violet-600">
                ONLINE
              </h3>

            </div>

            <div className="rounded-2xl bg-violet-100 p-4">

              <Brain
                size={30}
                className="text-violet-600"
              />

            </div>

          </div>

          <p className="mt-5 text-sm text-slate-500">
            Decision engine operating normally
          </p>

        </motion.div>

      </div>
            {/* ==========================
          AI Risk Assessment
      ========================== */}

      <div
        className="
          rounded-3xl
          border
          border-slate-200
          bg-white
          p-8
          shadow-sm
        "
      >

        <div className="flex items-center justify-between">

          <div>

            <h3 className="text-2xl font-bold text-slate-900">
              Station Risk Assessment
            </h3>

            <p className="mt-2 text-slate-500">
              AI-generated risk scores, confidence levels and operational recommendations.
            </p>

          </div>

          <div className="rounded-full bg-slate-100 px-4 py-2">

            <span className="text-sm font-semibold text-slate-700">
              {recommendations.length} Stations
            </span>

          </div>

        </div>

        <div className="mt-8 space-y-6">

          {recommendations.map((item, index) => (

            <motion.div
              key={`${item.station}-${index}`}
              initial={{
                opacity: 0,
                y: 20,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.4,
                delay: index * 0.05,
              }}
              className="
                rounded-2xl
                border
                border-slate-200
                p-6
              "
            >

              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                {/* Left */}

                <div>

                  <div className="flex items-center gap-3">

                    <div
                      className="
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-2xl
                        bg-cyan-100
                        font-bold
                        text-cyan-700
                      "
                    >
                      #{index + 1}
                    </div>

                    <div>

                      <h4 className="text-xl font-bold text-slate-900">
                        {item.station}
                      </h4>

                      <p className="mt-1 text-sm text-slate-500">
                        {item.passengers.toLocaleString()} passengers
                      </p>

                    </div>

                  </div>

                </div>

                {/* Right */}

                <div className="flex flex-wrap items-center gap-3">

                  <span
                    className={`
                      rounded-full
                      px-4
                      py-2
                      text-sm
                      font-semibold
                      ${
                        item.risk === "HIGH"
                          ? "bg-red-100 text-red-700"
                          : item.risk === "MEDIUM"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-emerald-100 text-emerald-700"
                      }
                    `}
                  >
                    {item.risk}
                  </span>

                  <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold">
                    Risk Score: {item.riskScore}
                  </span>

                  <span className="rounded-full bg-cyan-100 px-4 py-2 text-sm font-semibold text-cyan-700">
                    Confidence {item.confidence}%
                  </span>

                </div>

              </div>

              {/* Progress */}

              <div className="mt-6">

                <div className="mb-2 flex justify-between">

                  <span className="text-sm text-slate-500">
                    AI Risk Index
                  </span>

                  <span className="font-semibold">
                    {item.riskScore}/100
                  </span>

                </div>

                <div className="h-3 overflow-hidden rounded-full bg-slate-200">

                  <motion.div
                    initial={{
                      width: 0,
                    }}
                    whileInView={{
                      width: `${item.riskScore}%`,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      duration: 0.8,
                    }}
                    className={`
                      h-full
                      rounded-full
                      ${
                        item.risk === "HIGH"
                          ? "bg-red-500"
                          : item.risk === "MEDIUM"
                          ? "bg-yellow-500"
                          : "bg-emerald-500"
                      }
                    `}
                  />

                </div>

              </div>

              {/* Prediction */}

              <div className="mt-6 grid gap-5 lg:grid-cols-2">

                <div className="rounded-2xl bg-slate-50 p-5">

                  <h5 className="font-semibold text-slate-900">
                    AI Prediction
                  </h5>

                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {item.prediction}
                  </p>

                </div>

                <div className="rounded-2xl bg-cyan-50 p-5">

                  <h5 className="font-semibold text-cyan-800">
                    Recommended Action
                  </h5>

                  <p className="mt-3 text-sm leading-7 text-slate-700">
                    {item.action}
                  </p>

                </div>

              </div>

            </motion.div>

          ))}

        </div>

      </div>
            {/* ==========================
          AI Network Summary
      ========================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
        }}
        className="
          rounded-3xl
          border
          border-cyan-200
          bg-gradient-to-r
          from-cyan-50
          via-white
          to-indigo-50
          p-8
          shadow-sm
        "
      >

        <div className="flex items-start gap-5">

          <div className="rounded-2xl bg-cyan-100 p-4">

            <Brain
              size={36}
              className="text-cyan-700"
            />

          </div>

          <div className="flex-1">

            <h3 className="text-2xl font-bold text-slate-900">
              AI Operational Summary
            </h3>

            <p className="mt-4 leading-8 text-slate-600">

              The MetroFlow AI Decision Engine analyzed{" "}
              <span className="font-semibold text-cyan-700">
                {recommendations.length}
              </span>{" "}
              monitored station
              {recommendations.length !== 1 ? "s" : ""}.
              Current analysis identifies{" "}
              <span className="font-semibold text-red-600">
                {
                  recommendations.filter(
                    (item) => item.risk === "HIGH"
                  ).length
                }
              </span>{" "}
              high-risk station
              {
                recommendations.filter(
                  (item) => item.risk === "HIGH"
                ).length !== 1
                  ? "s"
                  : ""
              }
              ,{" "}
              <span className="font-semibold text-yellow-600">
                {
                  recommendations.filter(
                    (item) => item.risk === "MEDIUM"
                  ).length
                }
              </span>{" "}
              medium-risk station
              {
                recommendations.filter(
                  (item) => item.risk === "MEDIUM"
                ).length !== 1
                  ? "s"
                  : ""
              }
              , and{" "}
              <span className="font-semibold text-emerald-600">
                {
                  recommendations.filter(
                    (item) => item.risk === "LOW"
                  ).length
                }
              </span>{" "}
              low-risk station
              {
                recommendations.filter(
                  (item) => item.risk === "LOW"
                ).length !== 1
                  ? "s"
                  : ""
              }
              .

            </p>

            <div className="mt-6 grid gap-5 lg:grid-cols-2">

              <div className="rounded-2xl border border-cyan-200 bg-white p-5">

                <h4 className="font-semibold text-cyan-700">
                  AI Recommendation
                </h4>

                <p className="mt-3 text-sm leading-7 text-slate-600">

                  {recommendations.some(
                    (item) => item.risk === "HIGH"
                  )
                    ? "Immediately prioritize critical stations by increasing train frequency, deploying additional personnel, and activating crowd diversion protocols."
                    : recommendations.some(
                        (item) => item.risk === "MEDIUM"
                      )
                    ? "Maintain enhanced monitoring and prepare additional operational resources before peak travel periods."
                    : "Network conditions are stable. Continue routine monitoring and standard operational scheduling."}

                </p>

              </div>

              <div className="rounded-2xl border border-emerald-200 bg-white p-5">

                <h4 className="font-semibold text-emerald-700">
                  AI System Health
                </h4>

                <div className="mt-4 flex items-center gap-3">

                  <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />

                  <span className="font-semibold text-emerald-700">
                    ONLINE
                  </span>

                </div>

                <p className="mt-3 text-sm leading-7 text-slate-600">

                  Prediction engine, congestion analytics,
                  and recommendation models are operating
                  normally with an average confidence of{" "}
                  <span className="font-semibold">
                    {recommendations.length
                      ? Math.round(
                          recommendations.reduce(
                            (sum, item) =>
                              sum + item.confidence,
                            0
                          ) / recommendations.length
                        )
                      : 0}
                    %
                  </span>.

                </p>

              </div>

            </div>

          </div>

        </div>

      </motion.div>

    </section>

  );

}

export default AIRiskPanel;