import { useMemo } from "react";

import { motion } from "framer-motion";

import {
  Brain,
  Cpu,
  Activity,
  TrendingUp,
  Clock3,
  Train,
  Users,
  DollarSign,
  ShieldCheck,
} from "lucide-react";

function AIKPIs({ summary = {} }) {

  const metrics = useMemo(() => ({

    decisionsToday:
      summary.decisions_today ??
      summary.decisionsToday ??
      1284,

    predictionAccuracy:
      summary.prediction_accuracy ??
      summary.predictionAccuracy ??
      95,

    modelHealth:
      summary.ai_health ??
      summary.aiHealth ??
      98,

    inferenceLatency:
      summary.inference_latency ??
      summary.inferenceLatency ??
      124,

    automatedActions:
      summary.automated_actions ??
      summary.automatedActions ??
      312,

    congestionReduction:
      summary.congestion_reduction ??
      summary.congestionReduction ??
      18,

    passengerSatisfaction:
      summary.passenger_satisfaction ??
      summary.passengerSatisfaction ??
      94,

    revenueGrowth:
      summary.revenue_growth ??
      summary.revenueGrowth ??
      8,

  }), [summary]);

  const kpiCards = [

    {
      title: "AI Decisions",
      value: metrics.decisionsToday.toLocaleString(),
      unit: "Today",
      icon: Brain,
      color:
        "from-indigo-500 to-blue-600",
      trend: "+12%",
      description:
        "Real-time decisions generated",
    },

    {
      title: "Prediction Accuracy",
      value: metrics.predictionAccuracy,
      unit: "%",
      icon: Activity,
      color:
        "from-emerald-500 to-green-600",
      trend: "+1.8%",
      description:
        "Forecast precision",
    },

    {
      title: "Model Health",
      value: metrics.modelHealth,
      unit: "%",
      icon: Cpu,
      color:
        "from-cyan-500 to-sky-600",
      trend: "Excellent",
      description:
        "AI engine health",
    },

    {
      title: "Inference",
      value: metrics.inferenceLatency,
      unit: "ms",
      icon: Clock3,
      color:
        "from-violet-500 to-fuchsia-600",
      trend: "-15 ms",
      description:
        "Average response time",
    },

    {
      title: "Automation",
      value: metrics.automatedActions,
      unit: "",
      icon: ShieldCheck,
      color:
        "from-orange-500 to-amber-600",
      trend: "+28",
      description:
        "Automatic optimizations",
    },

    {
      title: "Congestion Reduced",
      value: metrics.congestionReduction,
      unit: "%",
      icon: Train,
      color:
        "from-rose-500 to-pink-600",
      trend: "-4%",
      description:
        "Passenger flow improvement",
    },

    {
      title: "Passenger Satisfaction",
      value: metrics.passengerSatisfaction,
      unit: "%",
      icon: Users,
      color:
        "from-teal-500 to-emerald-600",
      trend: "+3%",
      description:
        "Predicted satisfaction",
    },

    {
      title: "Revenue Growth",
      value: metrics.revenueGrowth,
      unit: "%",
      icon: DollarSign,
      color:
        "from-yellow-500 to-orange-500",
      trend: "+2%",
      description:
        "AI optimized revenue",
    },

  ];

  return (

    <section className="space-y-8">

      <div>

        <h2 className="text-3xl font-black text-slate-900">

          AI Performance Metrics

        </h2>

        <p className="mt-2 text-slate-500">

          Executive indicators measuring the
          effectiveness of MetroFlow's
          artificial intelligence engine.

        </p>

      </div>
            {/* KPI Cards */}

      <div
        className="
          grid
          gap-6
          md:grid-cols-2
          xl:grid-cols-4
        "
      >

        {kpiCards.map((card, index) => {

          const Icon = card.icon;

          return (

            <motion.div

              key={card.title}

              initial={{
                opacity: 0,
                y: 25,
              }}

              whileInView={{
                opacity: 1,
                y: 0,
              }}

              viewport={{
                once: true,
              }}

              transition={{
                delay: index * 0.08,
              }}

              whileHover={{
                y: -8,
                scale: 1.02,
              }}

              className="
                group
                relative
                overflow-hidden
                rounded-3xl
                border
                border-slate-200
                bg-white
                p-6
                shadow-sm
                transition-all
                duration-300
                hover:shadow-2xl
              "
            >

              {/* Background Glow */}

              <div
                className={`
                  absolute
                  inset-0
                  bg-gradient-to-br
                  ${card.color}
                  opacity-0
                  transition-opacity
                  duration-500
                  group-hover:opacity-5
                `}
              />

              <div className="relative z-10">

                <div
                  className="
                    flex
                    items-start
                    justify-between
                  "
                >

                  <div>

                    <p
                      className="
                        text-sm
                        font-medium
                        text-slate-500
                      "
                    >
                      {card.title}
                    </p>

                    <h3
                      className="
                        mt-4
                        flex
                        items-end
                        gap-1
                        text-4xl
                        font-black
                        text-slate-900
                      "
                    >

                      {card.value}

                      <span
                        className="
                          mb-1
                          text-lg
                          font-semibold
                          text-slate-500
                        "
                      >
                        {card.unit}
                      </span>

                    </h3>

                  </div>

                  <div
                    className={`
                      rounded-2xl
                      bg-gradient-to-br
                      ${card.color}
                      p-4
                      text-white
                      shadow-lg
                    `}
                  >

                    <Icon size={28} />

                  </div>

                </div>

                <p
                  className="
                    mt-6
                    text-sm
                    leading-6
                    text-slate-500
                  "
                >
                  {card.description}
                </p>

                <div
                  className="
                    mt-6
                    flex
                    items-center
                    justify-between
                  "
                >

                  <div
                    className="
                      inline-flex
                      items-center
                      gap-2
                      rounded-full
                      bg-emerald-100
                      px-3
                      py-1.5
                      text-sm
                      font-semibold
                      text-emerald-700
                    "
                  >

                    <TrendingUp size={16} />

                    {card.trend}

                  </div>

                  <span
                    className="
                      text-xs
                      font-medium
                      uppercase
                      tracking-wider
                      text-slate-400
                    "
                  >
                    Live
                  </span>

                </div>

              </div>

            </motion.div>

          );

        })}

      </div>
            {/* AI Performance Summary */}

      <motion.div

        initial={{
          opacity: 0,
          y: 25,
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
          border-slate-200
          bg-white
          p-8
          shadow-sm
        "
      >

        <div
          className="
            flex
            flex-col
            gap-3
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
                text-slate-900
              "
            >
              AI Performance Summary
            </h3>

            <p
              className="
                mt-2
                text-slate-500
              "
            >
              Overall health and operational
              efficiency of the MetroFlow AI
              ecosystem.
            </p>

          </div>

          <div
            className="
              rounded-2xl
              bg-gradient-to-r
              from-indigo-600
              to-cyan-500
              px-6
              py-4
              text-white
            "
          >

            <p className="text-sm opacity-90">
              Overall AI Score
            </p>

            <h2
              className="
                mt-1
                text-4xl
                font-black
              "
            >
              97.8%
            </h2>

          </div>

        </div>

        {/* Performance Metrics */}

        <div
          className="
            mt-10
            grid
            gap-8
            lg:grid-cols-2
          "
        >

          {[
            {
              label: "Processing Efficiency",
              value: 98,
              color: "bg-indigo-500",
            },

            {
              label: "Decision Success Rate",
              value: 96,
              color: "bg-emerald-500",
            },

            {
              label: "Prediction Reliability",
              value: 95,
              color: "bg-cyan-500",
            },

            {
              label: "System Availability",
              value: 99,
              color: "bg-amber-500",
            },

          ].map((metric) => (

            <div key={metric.label}>

              <div
                className="
                  mb-3
                  flex
                  items-center
                  justify-between
                "
              >

                <span
                  className="
                    font-medium
                    text-slate-700
                  "
                >
                  {metric.label}
                </span>

                <span
                  className="
                    font-bold
                    text-slate-900
                  "
                >
                  {metric.value}%
                </span>

              </div>

              <div
                className="
                  h-3
                  overflow-hidden
                  rounded-full
                  bg-slate-100
                "
              >

                <motion.div

                  initial={{
                    width: 0,
                  }}

                  whileInView={{
                    width: `${metric.value}%`,
                  }}

                  viewport={{
                    once: true,
                  }}

                  transition={{
                    duration: 1,
                  }}

                  className={`
                    h-full
                    rounded-full
                    ${metric.color}
                  `}
                />

              </div>

            </div>

          ))}

        </div>

      </motion.div>
            {/* AI Operational Insights */}

      <motion.div

        initial={{
          opacity: 0,
          y: 25,
        }}

        whileInView={{
          opacity: 1,
          y: 0,
        }}

        viewport={{
          once: true,
        }}

        transition={{
          delay: 0.2,
        }}

        className="
          rounded-3xl
          border
          border-slate-200
          bg-white
          p-8
          shadow-sm
        "
      >

        <div
          className="
            flex
            flex-col
            gap-2
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
                text-slate-900
              "
            >
              AI Operational Insights
            </h3>

            <p
              className="
                mt-2
                text-slate-500
              "
            >
              Live intelligence generated from
              MetroFlow's AI optimization engine.
            </p>

          </div>

          <div
            className="
              rounded-2xl
              bg-slate-100
              px-5
              py-3
              text-sm
              font-semibold
              text-slate-600
            "
          >
            Updated every 30 seconds
          </div>

        </div>

        <div
          className="
            mt-8
            grid
            gap-6
            md:grid-cols-2
            xl:grid-cols-4
          "
        >

          {[
            {

              title:
                "Network Optimization",

              value:
                "96%",

              icon:
                Activity,

              color:
                "bg-indigo-100 text-indigo-600",

              description:
                "Metro network operating near optimal efficiency.",

            },

            {

              title:
                "Passenger Flow",

              value:
                "94%",

              icon:
                Users,

              color:
                "bg-emerald-100 text-emerald-600",

              description:
                "Passenger movement remains smooth across stations.",

            },

            {

              title:
                "Revenue Optimization",

              value:
                "+8.4%",

              icon:
                DollarSign,

              color:
                "bg-amber-100 text-amber-600",

              description:
                "Dynamic scheduling continues improving fare revenue.",

            },

            {

              title:
                "Resource Utilization",

              value:
                "91%",

              icon:
                Train,

              color:
                "bg-cyan-100 text-cyan-600",

              description:
                "Train fleets and platforms efficiently allocated.",

            },

          ].map((item) => {

            const Icon = item.icon;

            return (

              <motion.div

                key={item.title}

                whileHover={{
                  y: -6,
                }}

                className="
                  rounded-3xl
                  border
                  border-slate-100
                  bg-slate-50
                  p-6
                  transition-all
                  duration-300
                  hover:border-indigo-200
                  hover:shadow-lg
                "
              >

                <div
                  className="
                    flex
                    items-center
                    justify-between
                  "
                >

                  <div
                    className={`
                      rounded-2xl
                      p-4
                      ${item.color}
                    `}
                  >

                    <Icon size={28} />

                  </div>

                  <span
                    className="
                      text-3xl
                      font-black
                      text-slate-900
                    "
                  >
                    {item.value}
                  </span>

                </div>

                <h4
                  className="
                    mt-6
                    text-lg
                    font-bold
                    text-slate-900
                  "
                >
                  {item.title}
                </h4>

                <p
                  className="
                    mt-3
                    text-sm
                    leading-6
                    text-slate-500
                  "
                >
                  {item.description}
                </p>

              </motion.div>

            );

          })}

        </div>

        {/* Executive Insight */}

        <motion.div

          initial={{
            opacity: 0,
          }}

          whileInView={{
            opacity: 1,
          }}

          viewport={{
            once: true,
          }}

          transition={{
            delay: 0.4,
          }}

          className="
            mt-8
            rounded-3xl
            bg-gradient-to-r
            from-indigo-600
            via-blue-600
            to-cyan-600
            p-8
            text-white
          "
        >

          <div
            className="
              flex
              items-start
              gap-4
            "
          >

            <Brain
              size={36}
              className="mt-1"
            />

            <div>

              <h3
                className="
                  text-2xl
                  font-bold
                "
              >
                Executive AI Insight
              </h3>

              <p
                className="
                  mt-4
                  max-w-4xl
                  leading-8
                  text-indigo-100
                "
              >

                MetroFlow AI predicts that
                increasing train frequency on
                the Blue and Yellow Lines during
                the evening peak window can
                reduce passenger congestion by
                approximately 18%, improve train
                punctuality by 11%, and increase
                overall passenger satisfaction
                without requiring additional
                infrastructure investment.

              </p>

            </div>

          </div>

        </motion.div>

      </motion.div>
            {/* Real-Time AI Activity Feed */}

      <motion.div

        initial={{
          opacity: 0,
          y: 25,
        }}

        whileInView={{
          opacity: 1,
          y: 0,
        }}

        viewport={{
          once: true,
        }}

        transition={{
          delay: 0.3,
        }}

        className="
          rounded-3xl
          border
          border-slate-200
          bg-white
          p-8
          shadow-sm
        "
      >

        <div
          className="
            flex
            flex-col
            gap-2
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
                text-slate-900
              "
            >
              Real-Time AI Activity
            </h3>

            <p
              className="
                mt-2
                text-slate-500
              "
            >
              Latest actions performed by the
              MetroFlow AI engine.
            </p>

          </div>

          <div
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-emerald-100
              px-4
              py-2
              text-sm
              font-semibold
              text-emerald-700
            "
          >

            <span
              className="
                h-2.5
                w-2.5
                rounded-full
                bg-emerald-500
                animate-pulse
              "
            />

            Live Feed

          </div>

        </div>

        <div className="mt-8 space-y-5">

          {[
            {
              icon: Brain,
              color:
                "bg-indigo-100 text-indigo-600",
              title:
                "Demand prediction updated",
              description:
                "AI recalculated passenger demand for the next 60 minutes.",
              time:
                "Just now",
            },

            {
              icon: Train,
              color:
                "bg-cyan-100 text-cyan-600",
              title:
                "Train frequency optimized",
              description:
                "Blue Line frequency increased by 15% to reduce congestion.",
              time:
                "2 min ago",
            },

            {
              icon: Users,
              color:
                "bg-emerald-100 text-emerald-600",
              title:
                "Passenger flow balanced",
              description:
                "Platform crowd distribution optimized across three stations.",
              time:
                "5 min ago",
            },

            {
              icon: ShieldCheck,
              color:
                "bg-amber-100 text-amber-600",
              title:
                "Incident resolved",
              description:
                "Potential overcrowding detected and mitigated automatically.",
              time:
                "9 min ago",
            },

            {
              icon: DollarSign,
              color:
                "bg-rose-100 text-rose-600",
              title:
                "Revenue optimization complete",
              description:
                "AI adjusted train allocation to improve operational efficiency.",
              time:
                "15 min ago",
            },

          ].map((activity, index) => {

            const Icon = activity.icon;

            return (

              <motion.div

                key={activity.title}

                initial={{
                  opacity: 0,
                  x: -20,
                }}

                whileInView={{
                  opacity: 1,
                  x: 0,
                }}

                viewport={{
                  once: true,
                }}

                transition={{
                  delay: index * 0.08,
                }}

                whileHover={{
                  x: 6,
                }}

                className="
                  flex
                  items-start
                  gap-5
                  rounded-2xl
                  border
                  border-slate-100
                  p-5
                  transition-all
                  duration-300
                  hover:border-indigo-200
                  hover:bg-slate-50
                "
              >

                <div
                  className={`
                    rounded-2xl
                    p-4
                    ${activity.color}
                  `}
                >

                  <Icon size={24} />

                </div>

                <div className="flex-1">

                  <div
                    className="
                      flex
                      flex-col
                      gap-2
                      lg:flex-row
                      lg:items-center
                      lg:justify-between
                    "
                  >

                    <h4
                      className="
                        text-lg
                        font-bold
                        text-slate-900
                      "
                    >
                      {activity.title}
                    </h4>

                    <span
                      className="
                        text-sm
                        font-medium
                        text-slate-400
                      "
                    >
                      {activity.time}
                    </span>

                  </div>

                  <p
                    className="
                      mt-2
                      leading-7
                      text-slate-500
                    "
                  >
                    {activity.description}
                  </p>

                </div>

              </motion.div>

            );

          })}

        </div>

      </motion.div>
       </section>

  );

}

export default AIKPIs;