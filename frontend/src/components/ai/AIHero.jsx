import { useMemo } from "react";

import { motion } from "framer-motion";

import {
  Brain,
  Cpu,
  Activity,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

function AIHero({

  summary = {},

  recommendations = [],

  incidents = [],

}) {

  const aiMetrics = useMemo(() => {

    const healthScore =
      summary.ai_health ??
      summary.aiHealth ??
      97;

    const confidence =
      summary.ai_confidence ??
      summary.confidence ??
      96;

    const predictionAccuracy =
      summary.prediction_accuracy ??
      summary.predictionAccuracy ??
      94;

    const activeIncidents = incidents.length;

    const activeRecommendations =
      recommendations.length;

    let networkStatus = "Optimal";

    if (activeIncidents >= 5) {

      networkStatus = "Critical";

    } else if (activeIncidents >= 3) {

      networkStatus = "Warning";

    }

    return {

      healthScore,

      confidence,

      predictionAccuracy,

      activeIncidents,

      activeRecommendations,

      networkStatus,

    };

  }, [

    summary,

    recommendations,

    incidents,

  ]);

  const statusColor = {

    Optimal: "text-emerald-600",

    Warning: "text-amber-600",

    Critical: "text-red-600",

  };

  return (

    <section className="space-y-8">

      {/* Hero */}

      <motion.div

        initial={{
          opacity: 0,
          y: 20,
        }}

        animate={{
          opacity: 1,
          y: 0,
        }}

        className="
          overflow-hidden
          rounded-3xl
          border
          border-indigo-200
          bg-gradient-to-br
          from-indigo-600
          via-blue-600
          to-cyan-600
          p-8
          text-white
          shadow-xl
        "
      >

        <div
          className="
            flex
            flex-col
            gap-8
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >

          <div>

            <div
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-white/15
                px-4
                py-2
                backdrop-blur
              "
            >

              <Sparkles size={18} />

              <span className="font-medium">
                AI Decision Engine
              </span>

            </div>

            <h1
              className="
                mt-6
                text-4xl
                font-black
                leading-tight
              "
            >
              Intelligent Metro
              <br />
              Decision Support
            </h1>

            <p
              className="
                mt-5
                max-w-2xl
                text-lg
                leading-8
                text-indigo-100
              "
            >
              MetroFlow AI continuously analyzes
              passenger demand, congestion,
              operational efficiency,
              incidents, and revenue to
              recommend real-time decisions
              for smarter metro operations.
            </p>

          </div>
                    {/* Executive AI KPIs */}

          <div
            className="
              grid
              gap-5
              sm:grid-cols-2
              xl:grid-cols-4
            "
          >

            {/* AI Health */}

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
                delay: 0.1,
              }}
              className="
                rounded-3xl
                bg-white/10
                p-6
                backdrop-blur-md
                ring-1
                ring-white/10
              "
            >

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-indigo-100">
                    AI Health
                  </p>

                  <h2
                    className="
                      mt-3
                      text-4xl
                      font-black
                    "
                  >
                    {aiMetrics.healthScore}%
                  </h2>

                  <p className="mt-2 text-sm text-indigo-100">
                    System Performance
                  </p>

                </div>

                <div
                  className="
                    rounded-2xl
                    bg-white/15
                    p-4
                  "
                >

                  <Brain size={30} />

                </div>

              </div>

            </motion.div>

            {/* Prediction Accuracy */}

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
                delay: 0.2,
              }}
              className="
                rounded-3xl
                bg-white/10
                p-6
                backdrop-blur-md
                ring-1
                ring-white/10
              "
            >

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-indigo-100">
                    Prediction Accuracy
                  </p>

                  <h2
                    className="
                      mt-3
                      text-4xl
                      font-black
                    "
                  >
                    {aiMetrics.predictionAccuracy}%
                  </h2>

                  <p className="mt-2 text-sm text-indigo-100">
                    Forecast Reliability
                  </p>

                </div>

                <div
                  className="
                    rounded-2xl
                    bg-white/15
                    p-4
                  "
                >

                  <Activity size={30} />

                </div>

              </div>

            </motion.div>

            {/* Decision Confidence */}

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
                delay: 0.3,
              }}
              className="
                rounded-3xl
                bg-white/10
                p-6
                backdrop-blur-md
                ring-1
                ring-white/10
              "
            >

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-indigo-100">
                    Decision Confidence
                  </p>

                  <h2
                    className="
                      mt-3
                      text-4xl
                      font-black
                    "
                  >
                    {aiMetrics.confidence}%
                  </h2>

                  <p className="mt-2 text-sm text-indigo-100">
                    Recommendation Quality
                  </p>

                </div>

                <div
                  className="
                    rounded-2xl
                    bg-white/15
                    p-4
                  "
                >

                  <Cpu size={30} />

                </div>

              </div>

            </motion.div>

            {/* Network Status */}

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
                delay: 0.4,
              }}
              className="
                rounded-3xl
                bg-white/10
                p-6
                backdrop-blur-md
                ring-1
                ring-white/10
              "
            >

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-indigo-100">
                    Network Status
                  </p>

                  <h2
                    className={`
                      mt-3
                      text-3xl
                      font-black
                      ${statusColor[aiMetrics.networkStatus]}
                    `}
                  >
                    {aiMetrics.networkStatus}
                  </h2>

                  <p className="mt-2 text-sm text-indigo-100">
                    AI Assessment
                  </p>

                </div>

                <div
                  className="
                    rounded-2xl
                    bg-white/15
                    p-4
                  "
                >

                  <ShieldCheck size={30} />

                </div>

              </div>

            </motion.div>

          </div>

        </div>

      </motion.div>
              {/* Executive Intelligence Panel */}

        <div
          className="
            mt-8
            grid
            gap-6
            xl:grid-cols-3
          "
        >

          {/* AI Executive Summary */}

          <motion.div
            initial={{
              opacity: 0,
              x: -20,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              delay: 0.5,
            }}
            className="
              xl:col-span-2
              rounded-3xl
              bg-white/10
              p-8
              backdrop-blur-md
              ring-1
              ring-white/10
            "
          >

            <div className="flex items-center gap-3">

              <Brain
                size={28}
                className="text-cyan-300"
              />

              <h3
                className="
                  text-2xl
                  font-bold
                "
              >
                AI Executive Intelligence
              </h3>

            </div>

            <p
              className="
                mt-6
                max-w-4xl
                leading-8
                text-indigo-100
              "
            >

              MetroFlow AI continuously evaluates
              passenger demand, train movement,
              congestion levels, operational
              efficiency, revenue trends, and
              incident reports to generate
              intelligent recommendations that
              improve passenger experience while
              maximizing network performance.

            </p>

            <div
              className="
                mt-8
                grid
                gap-4
                sm:grid-cols-3
              "
            >

              <div
                className="
                  rounded-2xl
                  bg-white/10
                  p-5
                "
              >

                <p className="text-sm text-indigo-100">
                  Recommendations
                </p>

                <h4
                  className="
                    mt-2
                    text-3xl
                    font-black
                  "
                >
                  {aiMetrics.activeRecommendations}
                </h4>

              </div>

              <div
                className="
                  rounded-2xl
                  bg-white/10
                  p-5
                "
              >

                <p className="text-sm text-indigo-100">
                  Active Incidents
                </p>

                <h4
                  className="
                    mt-2
                    text-3xl
                    font-black
                  "
                >
                  {aiMetrics.activeIncidents}
                </h4>

              </div>

              <div
                className="
                  rounded-2xl
                  bg-white/10
                  p-5
                "
              >

                <p className="text-sm text-indigo-100">
                  AI Status
                </p>

                <h4
                  className="
                    mt-2
                    text-3xl
                    font-black
                    text-emerald-300
                  "
                >
                  Online
                </h4>

              </div>

            </div>

          </motion.div>

          {/* Decision Engine */}

          <motion.div
            initial={{
              opacity: 0,
              x: 20,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              delay: 0.6,
            }}
            className="
              rounded-3xl
              bg-white/10
              p-8
              backdrop-blur-md
              ring-1
              ring-white/10
            "
          >

            <div className="flex items-center gap-3">

              <Cpu
                size={26}
                className="text-cyan-300"
              />

              <h3
                className="
                  text-xl
                  font-bold
                "
              >
                Decision Engine
              </h3>

            </div>

            <div className="mt-8 space-y-5">

              <div>

                <div className="mb-2 flex justify-between">

                  <span className="text-indigo-100">
                    Decision Quality
                  </span>

                  <span className="font-semibold">
                    {aiMetrics.confidence}%
                  </span>

                </div>

                <div className="h-3 rounded-full bg-white/15">

                  <motion.div
                    initial={{
                      width: 0,
                    }}
                    animate={{
                      width: `${aiMetrics.confidence}%`,
                    }}
                    transition={{
                      duration: 1,
                    }}
                    className="
                      h-full
                      rounded-full
                      bg-cyan-400
                    "
                  />

                </div>

              </div>

              <div>

                <div className="mb-2 flex justify-between">

                  <span className="text-indigo-100">
                    AI Health
                  </span>

                  <span className="font-semibold">
                    {aiMetrics.healthScore}%
                  </span>

                </div>

                <div className="h-3 rounded-full bg-white/15">

                  <motion.div
                    initial={{
                      width: 0,
                    }}
                    animate={{
                      width: `${aiMetrics.healthScore}%`,
                    }}
                    transition={{
                      duration: 1,
                      delay: 0.2,
                    }}
                    className="
                      h-full
                      rounded-full
                      bg-emerald-400
                    "
                  />

                </div>

              </div>

              <div>

                <div className="mb-2 flex justify-between">

                  <span className="text-indigo-100">
                    Prediction Accuracy
                  </span>

                  <span className="font-semibold">
                    {aiMetrics.predictionAccuracy}%
                  </span>

                </div>

                <div className="h-3 rounded-full bg-white/15">

                  <motion.div
                    initial={{
                      width: 0,
                    }}
                    animate={{
                      width: `${aiMetrics.predictionAccuracy}%`,
                    }}
                    transition={{
                      duration: 1,
                      delay: 0.4,
                    }}
                    className="
                      h-full
                      rounded-full
                      bg-amber-400
                    "
                  />

                </div>

              </div>

            </div>

          </motion.div>

        </div>
                {/* AI Recommendation Highlights */}

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
            delay: 0.7,
          }}
          className="
            mt-8
            rounded-3xl
            bg-white/10
            p-8
            backdrop-blur-md
            ring-1
            ring-white/10
          "
        >

          <div
            className="
              flex
              flex-col
              gap-6
              lg:flex-row
              lg:items-start
              lg:justify-between
            "
          >

            <div className="max-w-3xl">

              <div
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  bg-amber-400/20
                  px-4
                  py-2
                  text-amber-200
                "
              >

                <Sparkles size={18} />

                <span className="font-medium">
                  Highest Priority Recommendation
                </span>

              </div>

              <h2
                className="
                  mt-5
                  text-3xl
                  font-black
                "
              >
                Increase Train Frequency
                on the Blue Line
              </h2>

              <p
                className="
                  mt-5
                  max-w-3xl
                  leading-8
                  text-indigo-100
                "
              >

                MetroFlow AI predicts passenger
                demand will exceed optimal capacity
                within the next 45 minutes.
                Increasing train frequency by
                approximately 15% is expected to
                significantly reduce platform
                congestion while improving service
                reliability across the network.

              </p>

            </div>

            <div
              className="
                rounded-3xl
                bg-cyan-400/15
                p-6
                text-center
              "
            >

              <p className="text-sm text-cyan-200">
                Confidence
              </p>

              <h2
                className="
                  mt-2
                  text-5xl
                  font-black
                "
              >
                {aiMetrics.confidence}%
              </h2>

            </div>

          </div>

          {/* Expected Impact */}

          <div
            className="
              mt-10
              grid
              gap-5
              md:grid-cols-2
              xl:grid-cols-4
            "
          >

            <motion.div
              whileHover={{
                y: -5,
              }}
              className="
                rounded-3xl
                bg-white/10
                p-6
              "
            >

              <p className="text-sm text-indigo-100">
                Congestion Reduction
              </p>

              <h3
                className="
                  mt-3
                  text-4xl
                  font-black
                  text-emerald-300
                "
              >
                -18%
              </h3>

              <p className="mt-2 text-sm text-indigo-100">
                Expected improvement
              </p>

            </motion.div>

            <motion.div
              whileHover={{
                y: -5,
              }}
              className="
                rounded-3xl
                bg-white/10
                p-6
              "
            >

              <p className="text-sm text-indigo-100">
                Delay Reduction
              </p>

              <h3
                className="
                  mt-3
                  text-4xl
                  font-black
                  text-cyan-300
                "
              >
                -11%
              </h3>

              <p className="mt-2 text-sm text-indigo-100">
                Estimated network impact
              </p>

            </motion.div>

            <motion.div
              whileHover={{
                y: -5,
              }}
              className="
                rounded-3xl
                bg-white/10
                p-6
              "
            >

              <p className="text-sm text-indigo-100">
                Cost Savings
              </p>

              <h3
                className="
                  mt-3
                  text-4xl
                  font-black
                  text-amber-300
                "
              >
                +8%
              </h3>

              <p className="mt-2 text-sm text-indigo-100">
                Operational efficiency
              </p>

            </motion.div>

            <motion.div
              whileHover={{
                y: -5,
              }}
              className="
                rounded-3xl
                bg-white/10
                p-6
              "
            >

              <p className="text-sm text-indigo-100">
                Passenger Satisfaction
              </p>

              <h3
                className="
                  mt-3
                  text-4xl
                  font-black
                  text-emerald-300
                "
              >
                +14%
              </h3>

              <p className="mt-2 text-sm text-indigo-100">
                Predicted improvement
              </p>

            </motion.div>

          </div>

        </motion.div>
                {/* Live AI Monitoring */}

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
            delay: 0.8,
          }}
          className="
            mt-8
            rounded-3xl
            bg-white/10
            p-8
            backdrop-blur-md
            ring-1
            ring-white/10
          "
        >

          <div
            className="
              flex
              flex-col
              gap-6
              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >

            <div>

              <h3
                className="
                  text-2xl
                  font-bold
                "
              >
                Live AI Monitoring
              </h3>

              <p
                className="
                  mt-2
                  text-indigo-100
                "
              >
                Real-time status of MetroFlow AI
                services and inference pipeline.
              </p>

            </div>

            <div
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-emerald-500/20
                px-4
                py-2
                text-emerald-200
              "
            >

              <span
                className="
                  h-2.5
                  w-2.5
                  rounded-full
                  bg-emerald-400
                "
              />

              All AI Services Online

            </div>

          </div>

          <div
            className="
              mt-8
              grid
              gap-5
              sm:grid-cols-2
              xl:grid-cols-4
            "
          >

            <motion.div
              whileHover={{
                y: -5,
              }}
              className="
                rounded-3xl
                bg-white/10
                p-6
              "
            >

              <p className="text-sm text-indigo-100">
                AI Model
              </p>

              <h3
                className="
                  mt-3
                  text-2xl
                  font-bold
                "
              >
                MetroNet v3.2
              </h3>

              <p
                className="
                  mt-2
                  text-sm
                  text-indigo-100
                "
              >
                Production Model
              </p>

            </motion.div>

            <motion.div
              whileHover={{
                y: -5,
              }}
              className="
                rounded-3xl
                bg-white/10
                p-6
              "
            >

              <p className="text-sm text-indigo-100">
                Inference Latency
              </p>

              <h3
                className="
                  mt-3
                  text-2xl
                  font-bold
                "
              >
                124 ms
              </h3>

              <p
                className="
                  mt-2
                  text-sm
                  text-indigo-100
                "
              >
                Average Response
              </p>

            </motion.div>

            <motion.div
              whileHover={{
                y: -5,
              }}
              className="
                rounded-3xl
                bg-white/10
                p-6
              "
            >

              <p className="text-sm text-indigo-100">
                Last Prediction
              </p>

              <h3
                className="
                  mt-3
                  text-2xl
                  font-bold
                "
              >
                12 sec ago
              </h3>

              <p
                className="
                  mt-2
                  text-sm
                  text-indigo-100
                "
              >
                Auto Updated
              </p>

            </motion.div>

            <motion.div
              whileHover={{
                y: -5,
              }}
              className="
                rounded-3xl
                bg-white/10
                p-6
              "
            >

              <p className="text-sm text-indigo-100">
                Decisions Today
              </p>

              <h3
                className="
                  mt-3
                  text-2xl
                  font-bold
                "
              >
                1,284
              </h3>

              <p
                className="
                  mt-2
                  text-sm
                  text-indigo-100
                "
              >
                Successfully Generated
              </p>

            </motion.div>

          </div>

          {/* Decision Pipeline */}

          <div className="mt-10">

            <h4
              className="
                text-lg
                font-semibold
              "
            >
              AI Decision Pipeline
            </h4>

            <div
              className="
                mt-6
                grid
                gap-5
                lg:grid-cols-5
              "
            >

              {[
                "Collect Data",
                "Analyze",
                "Predict",
                "Optimize",
                "Recommend",
              ].map((step, index) => (

                <motion.div
                  key={step}
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: 0.9 + index * 0.1,
                  }}
                  className="
                    rounded-2xl
                    bg-white/10
                    p-5
                    text-center
                  "
                >

                  <div
                    className="
                      mx-auto
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-full
                      bg-cyan-400
                      font-bold
                      text-slate-900
                    "
                  >
                    {index + 1}
                  </div>

                  <p
                    className="
                      mt-4
                      font-semibold
                    "
                  >
                    {step}
                  </p>

                </motion.div>

              ))}

            </div>

          </div>

        </motion.div>
        </section>

  );

}

export default AIHero;