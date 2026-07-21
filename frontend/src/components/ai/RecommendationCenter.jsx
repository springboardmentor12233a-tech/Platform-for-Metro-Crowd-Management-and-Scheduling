import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Sparkles,
  ShieldAlert,
  CircleAlert,
  TrendingUp,
  Clock3,
  CheckCircle2,
  Activity,
} from "lucide-react";

function RecommendationCenter({
  recommendations = [],
  crowdActions = [],
  incidents = [],
  impacts = [],
}) {

  const summary = useMemo(() => {

    const totalRecommendations =
      recommendations.length || 24;

    const criticalActions =
      recommendations.filter(
        (item) => item.priority === "Critical"
      ).length || 5;

    const resolvedActions =
      recommendations.filter(
        (item) => item.status === "Resolved"
      ).length || 16;

    const averageConfidence =
      recommendations.length
        ? Math.round(
            recommendations.reduce(
              (sum, item) =>
                sum + item.confidence,
              0
            ) / recommendations.length
          )
        : 96;

    return {

      totalRecommendations,

      criticalActions,

      resolvedActions,

      averageConfidence,

    };

  }, [recommendations]);

  const priorityStyles = {

    Critical: {

      badge:
        "bg-red-100 text-red-700",

      progress:
        "bg-red-500",

    },

    High: {

      badge:
        "bg-orange-100 text-orange-700",

      progress:
        "bg-orange-500",

    },

    Medium: {

      badge:
        "bg-amber-100 text-amber-700",

      progress:
        "bg-amber-500",

    },

    Low: {

      badge:
        "bg-emerald-100 text-emerald-700",

      progress:
        "bg-emerald-500",

    },

  };

  return (

    <div
      className="
        space-y-8
      "
    >

      {/* Executive Hero */}

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
          duration: 0.6,
        }}

        className="
          overflow-hidden
          rounded-3xl
          bg-gradient-to-r
          from-slate-900
          via-indigo-900
          to-cyan-800
          p-8
          text-white
          shadow-2xl
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
                border
                border-white/20
                bg-white/10
                px-4
                py-2
              "
            >

              <Brain
                size={18}
                className="text-cyan-300"
              />

              <span
                className="
                  text-sm
                  font-semibold
                "
              >
                AI Recommendation Center
              </span>

            </div>

            <h1
              className="
                mt-6
                text-4xl
                font-black
                lg:text-5xl
              "
            >
              Intelligent Decision Support
            </h1>

            <p
              className="
                mt-5
                max-w-3xl
                leading-8
                text-slate-300
              "
            >
              MetroFlow AI consolidates insights
              from crowd monitoring, demand
              forecasting, train optimization,
              incident detection, and network
              analytics into a unified recommendation
              engine that helps operations teams make
              faster and more informed decisions.
            </p>

          </div>

          <div
            className="
              grid
              gap-4
              sm:grid-cols-2
            "
          >

            {[
              {
                title: "AI Engine",
                value: "Online",
                icon: CheckCircle2,
              },

              {
                title: "Critical Alerts",
                value: summary.criticalActions,
                icon: ShieldAlert,
              },

              {
                title: "Recommendations",
                value: summary.totalRecommendations,
                icon: Sparkles,
              },

              {
                title: "Last Analysis",
                value: "Just Now",
                icon: Clock3,
              },

            ].map((item) => {

              const Icon = item.icon;

              return (

                <motion.div

                  key={item.title}

                  whileHover={{
                    y: -5,
                  }}

                  className="
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/10
                    p-5
                    backdrop-blur-md
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                    "
                  >

                    <div>

                      <p
                        className="
                          text-sm
                          text-slate-300
                        "
                      >
                        {item.title}
                      </p>

                      <h3
                        className="
                          mt-2
                          text-2xl
                          font-bold
                        "
                      >
                        {item.value}
                      </h3>

                    </div>

                    <Icon
                      size={30}
                      className="text-cyan-300"
                    />

                  </div>

                </motion.div>

              );

            })}

          </div>

        </div>

        {/* Executive Overview */}

        <div
          className="
            mt-10
            grid
            gap-5
            md:grid-cols-4
          "
        >

          {[
            {
              title: "Total Recommendations",
              value: summary.totalRecommendations,
              icon: Sparkles,
            },

            {
              title: "Critical Actions",
              value: summary.criticalActions,
              icon: CircleAlert,
            },

            {
              title: "Resolved Actions",
              value: summary.resolvedActions,
              icon: CheckCircle2,
            },

            {
              title: "AI Confidence",
              value: `${summary.averageConfidence}%`,
              icon: TrendingUp,
            },

          ].map((card) => {

            const Icon = card.icon;

            return (

              <motion.div

                key={card.title}

                whileHover={{
                  scale: 1.03,
                }}

                className="
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/10
                  p-6
                  backdrop-blur-md
                "
              >

                <div
                  className="
                    flex
                    items-center
                    justify-between
                  "
                >

                  <div>

                    <p
                      className="
                        text-sm
                        text-slate-300
                      "
                    >
                      {card.title}
                    </p>

                    <h2
                      className="
                        mt-3
                        text-3xl
                        font-black
                      "
                    >
                      {card.value}
                    </h2>

                  </div>

                  <Icon
                    size={34}
                    className="text-cyan-300"
                  />

                </div>

              </motion.div>

            );

          })}

        </div>

      </motion.div>
            {/* Recommendation KPI Dashboard */}

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
            gap-4
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >

          <div>

            <h2
              className="
                text-3xl
                font-black
                text-slate-900
              "
            >
              Recommendation KPI Dashboard
            </h2>

            <p
              className="
                mt-2
                text-slate-500
              "
            >
              Real-time metrics showing the
              effectiveness and operational impact
              of MetroFlow AI recommendations.
            </p>

          </div>

          <div
            className="
              rounded-full
              bg-indigo-100
              px-4
              py-2
              text-sm
              font-semibold
              text-indigo-700
            "
          >
            Live Decision Analytics
          </div>

        </div>

        <div
          className="
            mt-10
            grid
            gap-6
            md:grid-cols-2
            xl:grid-cols-4
          "
        >

          {[
            {
              title: "Operational Improvement",
              value: "18%",
              subtitle: "Efficiency gain",
              icon: TrendingUp,
              color: "text-emerald-600",
              bg: "bg-emerald-50",
            },

            {
              title: "Passenger Satisfaction",
              value: "96%",
              subtitle: "Expected score",
              icon: Activity,
              color: "text-cyan-600",
              bg: "bg-cyan-50",
            },

            {
              title: "Critical Actions",
              value: summary.criticalActions,
              subtitle: "Immediate attention",
              icon: ShieldAlert,
              color: "text-red-600",
              bg: "bg-red-50",
            },

            {
              title: "AI Confidence",
              value: `${summary.averageConfidence}%`,
              subtitle: "Recommendation quality",
              icon: Brain,
              color: "text-indigo-600",
              bg: "bg-indigo-50",
            },

          ].map((item, index) => {

            const Icon = item.icon;

            return (

              <motion.div

                key={item.title}

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
                  delay: index * 0.08,
                }}

                whileHover={{
                  y: -6,
                }}

                className="
                  rounded-3xl
                  border
                  border-slate-200
                  p-6
                  transition-all
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

                  <div>

                    <p
                      className="
                        text-sm
                        text-slate-500
                      "
                    >
                      {item.title}
                    </p>

                    <h3
                      className="
                        mt-3
                        text-3xl
                        font-black
                        text-slate-900
                      "
                    >
                      {item.value}
                    </h3>

                    <p
                      className="
                        mt-3
                        text-sm
                        text-emerald-600
                      "
                    >
                      {item.subtitle}
                    </p>

                  </div>

                  <div
                    className={`
                      ${item.bg}
                      rounded-2xl
                      p-4
                    `}
                  >

                    <Icon
                      size={30}
                      className={item.color}
                    />

                  </div>

                </div>

              </motion.div>

            );

          })}

        </div>

        {/* Recommendation Insights */}

        <div
          className="
            mt-10
            grid
            gap-6
            lg:grid-cols-2
          "
        >

          <div
            className="
              rounded-3xl
              bg-slate-50
              p-6
            "
          >

            <div
              className="
                flex
                items-center
                gap-3
              "
            >

              <Brain
                size={30}
                className="text-indigo-600"
              />

              <h3
                className="
                  text-xl
                  font-bold
                  text-slate-900
                "
              >
                AI Recommendation Insights
              </h3>

            </div>

            <div
              className="
                mt-6
                space-y-5
              "
            >

              {[
                "Prioritize Blue Line capacity expansion during evening rush.",
                "Reassign congested platforms to reduce passenger waiting time.",
                "Increase train frequency based on predicted passenger demand.",
                "Apply dynamic scheduling for better network stability.",
              ].map((item) => (

                <div
                  key={item}
                  className="
                    flex
                    items-start
                    gap-3
                  "
                >

                  <CheckCircle2
                    size={20}
                    className="mt-1 text-emerald-500"
                  />

                  <p
                    className="
                      leading-7
                      text-slate-600
                    "
                  >
                    {item}
                  </p>

                </div>

              ))}

            </div>

          </div>

          {/* Recommendation Performance */}

          <div
            className="
              rounded-3xl
              bg-gradient-to-br
              from-indigo-600
              via-blue-600
              to-cyan-500
              p-6
              text-white
            "
          >

            <div
              className="
                flex
                items-center
                gap-3
              "
            >

              <Sparkles size={32} />

              <h3
                className="
                  text-2xl
                  font-bold
                "
              >
                Recommendation Performance
              </h3>

            </div>

            <div
              className="
                mt-8
                space-y-6
              "
            >

              {[
                {
                  label: "Decision Accuracy",
                  value: 97,
                },

                {
                  label: "Implementation Rate",
                  value: 89,
                },

                {
                  label: "Operational Impact",
                  value: 94,
                },

                {
                  label: "Network Improvement",
                  value: 91,
                },

              ].map((metric) => (

                <div key={metric.label}>

                  <div
                    className="
                      mb-2
                      flex
                      justify-between
                    "
                  >

                    <span>
                      {metric.label}
                    </span>

                    <span className="font-bold">
                      {metric.value}%
                    </span>

                  </div>

                  <div
                    className="
                      h-3
                      rounded-full
                      bg-white/20
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

                        className="
                          h-full
                          rounded-full
                          bg-white
                        "
                      />

                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>

      </motion.div>
            {/* AI Recommendation Feed */}

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
            gap-4
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >

          <div>

            <h2
              className="
                text-3xl
                font-black
                text-slate-900
              "
            >
              AI Recommendation Feed
            </h2>

            <p
              className="
                mt-2
                text-slate-500
              "
            >
              A live stream of AI-generated operational
              recommendations prioritized by urgency,
              expected impact, and confidence level.
            </p>

          </div>

          <div
            className="
              rounded-full
              bg-cyan-100
              px-4
              py-2
              text-sm
              font-semibold
              text-cyan-700
            "
          >
            Live Recommendation Engine
          </div>

        </div>

        <div
          className="
            mt-10
            space-y-6
          "
        >

          {(recommendations.length
            ? recommendations
            : [

                {
                  id: 1,
                  priority: "Critical",
                  category: "Train Scheduling",
                  title:
                    "Deploy standby train on Blue Line",
                  description:
                    "Passenger demand is predicted to exceed available capacity within the next 20 minutes.",
                  impact: "Delay reduction: 18%",
                  confidence: 98,
                  eta: "5 min",
                },

                {
                  id: 2,
                  priority: "High",
                  category: "Platform Management",
                  title:
                    "Reassign Platform 2 arrivals",
                  description:
                    "Redistribute incoming trains to reduce platform congestion during peak hours.",
                  impact: "Passenger flow: +12%",
                  confidence: 95,
                  eta: "8 min",
                },

                {
                  id: 3,
                  priority: "Medium",
                  category: "Crowd Control",
                  title:
                    "Open additional entry gates",
                  description:
                    "Increase passenger throughput at Rajiv Chowk station before evening peak.",
                  impact: "Queue reduction: 14%",
                  confidence: 93,
                  eta: "10 min",
                },

                {
                  id: 4,
                  priority: "Low",
                  category: "Energy Optimization",
                  title:
                    "Optimize off-peak train speed",
                  description:
                    "Reduce energy consumption without affecting schedule adherence.",
                  impact: "Energy savings: 6%",
                  confidence: 91,
                  eta: "20 min",
                },

              ]).map((item, index) => (

            <motion.div

              key={item.id}

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
                y: -4,
              }}

              className="
                rounded-3xl
                border
                border-slate-200
                p-6
                transition-all
                hover:border-indigo-200
                hover:shadow-lg
              "
            >

              <div
                className="
                  flex
                  flex-col
                  gap-6
                  xl:flex-row
                  xl:items-start
                  xl:justify-between
                "
              >

                <div className="flex-1">

                  <div
                    className="
                      flex
                      flex-wrap
                      items-center
                      gap-3
                    "
                  >

                    <span
                      className={`
                        rounded-full
                        px-3
                        py-1
                        text-sm
                        font-semibold
                        ${priorityStyles[item.priority].badge}
                      `}
                    >
                      {item.priority}
                    </span>

                    <span
                      className="
                        rounded-full
                        bg-slate-100
                        px-3
                        py-1
                        text-sm
                        font-medium
                        text-slate-700
                      "
                    >
                      {item.category}
                    </span>

                  </div>

                  <h3
                    className="
                      mt-5
                      text-2xl
                      font-bold
                      text-slate-900
                    "
                  >
                    {item.title}
                  </h3>

                  <p
                    className="
                      mt-3
                      leading-7
                      text-slate-600
                    "
                  >
                    {item.description}
                  </p>

                </div>

                <div
                  className="
                    grid
                    gap-4
                    sm:grid-cols-3
                    xl:w-[420px]
                  "
                >

                  <div
                    className="
                      rounded-2xl
                      bg-slate-50
                      p-4
                      text-center
                    "
                  >

                    <TrendingUp
                      size={28}
                      className="mx-auto text-emerald-600"
                    />

                    <p
                      className="
                        mt-3
                        text-xs
                        uppercase
                        tracking-wide
                        text-slate-500
                      "
                    >
                      Impact
                    </p>

                    <h4
                      className="
                        mt-2
                        font-bold
                        text-slate-900
                      "
                    >
                      {item.impact}
                    </h4>

                  </div>

                  <div
                    className="
                      rounded-2xl
                      bg-slate-50
                      p-4
                      text-center
                    "
                  >

                    <Brain
                      size={28}
                      className="mx-auto text-indigo-600"
                    />

                    <p
                      className="
                        mt-3
                        text-xs
                        uppercase
                        tracking-wide
                        text-slate-500
                      "
                    >
                      Confidence
                    </p>

                    <h4
                      className="
                        mt-2
                        font-bold
                        text-slate-900
                      "
                    >
                      {item.confidence}%
                    </h4>

                  </div>

                  <div
                    className="
                      rounded-2xl
                      bg-slate-50
                      p-4
                      text-center
                    "
                  >

                    <Clock3
                      size={28}
                      className="mx-auto text-orange-500"
                    />

                    <p
                      className="
                        mt-3
                        text-xs
                        uppercase
                        tracking-wide
                        text-slate-500
                      "
                    >
                      ETA
                    </p>

                    <h4
                      className="
                        mt-2
                        font-bold
                        text-slate-900
                      "
                    >
                      {item.eta}
                    </h4>

                  </div>

                </div>

              </div>

              <div className="mt-6">

                <div
                  className="
                    mb-2
                    flex
                    justify-between
                    text-sm
                  "
                >

                  <span className="text-slate-500">
                    Recommendation Confidence
                  </span>

                  <span className="font-semibold">
                    {item.confidence}%
                  </span>

                </div>

                <div
                  className="
                    h-3
                    rounded-full
                    bg-slate-100
                  "
                >

                  <motion.div

                    initial={{
                      width: 0,
                    }}

                    whileInView={{
                      width: `${item.confidence}%`,
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
                      ${priorityStyles[item.priority].progress}
                    `}
                  />

                </div>

              </div>

            </motion.div>

          ))}

        </div>

      </motion.div>
            {/* Operational Recommendation Center */}

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
            gap-4
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >

          <div>

            <h2
              className="
                text-3xl
                font-black
                text-slate-900
              "
            >
              Operational Recommendation Center
            </h2>

            <p
              className="
                mt-2
                text-slate-500
              "
            >
              AI-powered operational actions for
              train scheduling, fleet utilization,
              headway optimization, and platform
              management.
            </p>

          </div>

          <div
            className="
              rounded-full
              bg-emerald-100
              px-4
              py-2
              text-sm
              font-semibold
              text-emerald-700
            "
          >
            Live Operations Intelligence
          </div>

        </div>

        <div
          className="
            mt-10
            grid
            gap-6
            xl:grid-cols-3
          "
        >

          {/* Operational Recommendations */}

          <div className="xl:col-span-2 space-y-5">

            {(crowdActions.length
              ? crowdActions
              : [

                  {
                    id: 1,
                    title: "Increase Blue Line Frequency",
                    category: "Train Scheduling",
                    priority: "Critical",
                    impact: "+18% Capacity",
                    confidence: 98,
                  },

                  {
                    id: 2,
                    title: "Reassign Platform 4",
                    category: "Platform Management",
                    priority: "High",
                    impact: "-14% Congestion",
                    confidence: 95,
                  },

                  {
                    id: 3,
                    title: "Reduce Headway to 2.5 Minutes",
                    category: "Headway Optimization",
                    priority: "High",
                    impact: "+11% Passenger Flow",
                    confidence: 94,
                  },

                  {
                    id: 4,
                    title: "Deploy Standby Train",
                    category: "Fleet Allocation",
                    priority: "Medium",
                    impact: "-9% Delay",
                    confidence: 92,
                  },

                ]).map((action, index) => (

              <motion.div

                key={action.id}

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
                  y: -4,
                }}

                className="
                  rounded-3xl
                  border
                  border-slate-200
                  p-6
                  transition-all
                  hover:border-emerald-200
                  hover:shadow-lg
                "
              >

                <div
                  className="
                    flex
                    flex-col
                    gap-5
                    lg:flex-row
                    lg:items-center
                    lg:justify-between
                  "
                >

                  <div>

                    <div
                      className="
                        flex
                        flex-wrap
                        items-center
                        gap-3
                      "
                    >

                      <span
                        className={`
                          rounded-full
                          px-3
                          py-1
                          text-sm
                          font-semibold
                          ${priorityStyles[action.priority].badge}
                        `}
                      >
                        {action.priority}
                      </span>

                      <span
                        className="
                          rounded-full
                          bg-slate-100
                          px-3
                          py-1
                          text-sm
                          text-slate-700
                        "
                      >
                        {action.category}
                      </span>

                    </div>

                    <h3
                      className="
                        mt-4
                        text-2xl
                        font-bold
                        text-slate-900
                      "
                    >
                      {action.title}
                    </h3>

                  </div>

                  <div
                    className="
                      flex
                      gap-4
                    "
                  >

                    <div
                      className="
                        rounded-2xl
                        bg-emerald-50
                        p-4
                        text-center
                      "
                    >

                      <TrendingUp
                        size={28}
                        className="mx-auto text-emerald-600"
                      />

                      <p
                        className="
                          mt-2
                          text-xs
                          uppercase
                          text-slate-500
                        "
                      >
                        Impact
                      </p>

                      <h4
                        className="
                          mt-2
                          font-bold
                          text-slate-900
                        "
                      >
                        {action.impact}
                      </h4>

                    </div>

                    <div
                      className="
                        rounded-2xl
                        bg-indigo-50
                        p-4
                        text-center
                      "
                    >

                      <Brain
                        size={28}
                        className="mx-auto text-indigo-600"
                      />

                      <p
                        className="
                          mt-2
                          text-xs
                          uppercase
                          text-slate-500
                        "
                      >
                        Confidence
                      </p>

                      <h4
                        className="
                          mt-2
                          font-bold
                          text-slate-900
                        "
                      >
                        {action.confidence}%
                      </h4>

                    </div>

                  </div>

                </div>

                <div className="mt-6">

                  <div
                    className="
                      mb-2
                      flex
                      justify-between
                      text-sm
                    "
                  >

                    <span className="text-slate-500">
                      AI Confidence
                    </span>

                    <span className="font-semibold">
                      {action.confidence}%
                    </span>

                  </div>

                  <div
                    className="
                      h-3
                      rounded-full
                      bg-slate-100
                    "
                  >

                    <motion.div
                      initial={{
                        width: 0,
                      }}
                      whileInView={{
                        width: `${action.confidence}%`,
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
                        ${priorityStyles[action.priority].progress}
                      `}
                    />

                  </div>

                </div>

              </motion.div>

            ))}

          </div>

          {/* Executive Operations Panel */}

          <motion.div
            whileHover={{
              y: -5,
            }}
            className="
              rounded-3xl
              bg-gradient-to-br
              from-slate-900
              via-indigo-900
              to-cyan-800
              p-6
              text-white
            "
          >

            <div
              className="
                flex
                items-center
                gap-3
              "
            >

              <Brain
                size={34}
                className="text-cyan-300"
              />

              <h3
                className="
                  text-2xl
                  font-bold
                "
              >
                Executive Operations Summary
              </h3>

            </div>

            <div
              className="
                mt-8
                space-y-5
              "
            >

              {[
                "Increase Blue Line capacity during evening demand surge.",
                "Deploy standby train before predicted congestion occurs.",
                "Automatically redistribute platform assignments.",
                "Reduce train headway across high-demand corridors.",
                "Optimize fleet allocation using predictive analytics.",
              ].map((item) => (

                <div
                  key={item}
                  className="
                    flex
                    items-start
                    gap-3
                  "
                >

                  <CheckCircle2
                    size={20}
                    className="mt-1 text-emerald-300"
                  />

                  <p
                    className="
                      leading-7
                      text-slate-300
                    "
                  >
                    {item}
                  </p>

                </div>

              ))}

            </div>

            <div
              className="
                mt-8
                rounded-2xl
                bg-white/10
                p-5
              "
            >

              <h4
                className="
                  text-lg
                  font-bold
                "
              >
                Expected Operational Impact
              </h4>

              <div
                className="
                  mt-5
                  space-y-4
                "
              >

                {[
                  ["Delay Reduction", "19%"],
                  ["Passenger Flow", "+14%"],
                  ["Platform Efficiency", "96%"],
                  ["Fleet Utilization", "94%"],
                ].map(([label, value]) => (

                  <div
                    key={label}
                    className="
                      flex
                      justify-between
                    "
                  >

                    <span className="text-slate-300">
                      {label}
                    </span>

                    <span className="font-bold">
                      {value}
                    </span>

                  </div>

                ))}

              </div>

            </div>

          </motion.div>

        </div>

      </motion.div>
            {/* Crowd Management Recommendation Center */}

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
            gap-4
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >

          <div>

            <h2
              className="
                text-3xl
                font-black
                text-slate-900
              "
            >
              Crowd Management Recommendation Center
            </h2>

            <p
              className="
                mt-2
                text-slate-500
              "
            >
              AI continuously analyzes passenger flow,
              congestion hotspots, and station capacity
              to recommend proactive crowd management
              strategies.
            </p>

          </div>

          <div
            className="
              rounded-full
              bg-cyan-100
              px-4
              py-2
              text-sm
              font-semibold
              text-cyan-700
            "
          >
            Live Crowd Intelligence
          </div>

        </div>

        <div
          className="
            mt-10
            grid
            gap-6
            xl:grid-cols-3
          "
        >

          {/* Crowd Recommendation Cards */}

          <div className="xl:col-span-2 space-y-5">

            {(crowdActions.length
              ? crowdActions
              : [

                  {
                    id: 1,
                    station: "Rajiv Chowk",
                    action: "Open Additional Entry Gates",
                    priority: "Critical",
                    congestion: "96%",
                    impact: "-18% Queue Time",
                    confidence: 99,
                  },

                  {
                    id: 2,
                    station: "Kashmere Gate",
                    action: "Redirect Passengers",
                    priority: "High",
                    congestion: "89%",
                    impact: "-13% Platform Density",
                    confidence: 96,
                  },

                  {
                    id: 3,
                    station: "Central Secretariat",
                    action: "Increase Security Staff",
                    priority: "Medium",
                    congestion: "74%",
                    impact: "+11% Passenger Flow",
                    confidence: 93,
                  },

                  {
                    id: 4,
                    station: "Hauz Khas",
                    action: "Optimize Escalator Usage",
                    priority: "Low",
                    congestion: "58%",
                    impact: "-8% Walking Delay",
                    confidence: 90,
                  },

                ]).map((station, index) => (

              <motion.div

                key={station.id}

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
                  y: -5,
                }}

                className="
                  rounded-3xl
                  border
                  border-slate-200
                  p-6
                  transition-all
                  hover:border-cyan-200
                  hover:shadow-lg
                "
              >

                <div
                  className="
                    flex
                    flex-col
                    gap-5
                    lg:flex-row
                    lg:items-center
                    lg:justify-between
                  "
                >

                  <div>

                    <div
                      className="
                        flex
                        flex-wrap
                        items-center
                        gap-3
                      "
                    >

                      <span
                        className={`
                          rounded-full
                          px-3
                          py-1
                          text-sm
                          font-semibold
                          ${priorityStyles[station.priority].badge}
                        `}
                      >
                        {station.priority}
                      </span>

                      <span
                        className="
                          rounded-full
                          bg-slate-100
                          px-3
                          py-1
                          text-sm
                          text-slate-700
                        "
                      >
                        {station.station}
                      </span>

                    </div>

                    <h3
                      className="
                        mt-4
                        text-2xl
                        font-bold
                        text-slate-900
                      "
                    >
                      {station.action}
                    </h3>

                  </div>

                  <div
                    className="
                      grid
                      gap-4
                      sm:grid-cols-3
                    "
                  >

                    <div
                      className="
                        rounded-2xl
                        bg-red-50
                        p-4
                        text-center
                      "
                    >

                      <Activity
                        size={28}
                        className="mx-auto text-red-500"
                      />

                      <p
                        className="
                          mt-2
                          text-xs
                          uppercase
                          text-slate-500
                        "
                      >
                        Congestion
                      </p>

                      <h4
                        className="
                          mt-2
                          font-bold
                          text-slate-900
                        "
                      >
                        {station.congestion}
                      </h4>

                    </div>

                    <div
                      className="
                        rounded-2xl
                        bg-emerald-50
                        p-4
                        text-center
                      "
                    >

                      <TrendingUp
                        size={28}
                        className="mx-auto text-emerald-600"
                      />

                      <p
                        className="
                          mt-2
                          text-xs
                          uppercase
                          text-slate-500
                        "
                      >
                        Impact
                      </p>

                      <h4
                        className="
                          mt-2
                          font-bold
                          text-slate-900
                        "
                      >
                        {station.impact}
                      </h4>

                    </div>

                    <div
                      className="
                        rounded-2xl
                        bg-indigo-50
                        p-4
                        text-center
                      "
                    >

                      <Brain
                        size={28}
                        className="mx-auto text-indigo-600"
                      />

                      <p
                        className="
                          mt-2
                          text-xs
                          uppercase
                          text-slate-500
                        "
                      >
                        Confidence
                      </p>

                      <h4
                        className="
                          mt-2
                          font-bold
                          text-slate-900
                        "
                      >
                        {station.confidence}%
                      </h4>

                    </div>

                  </div>

                </div>

                <div className="mt-6">

                  <div
                    className="
                      mb-2
                      flex
                      justify-between
                      text-sm
                    "
                  >

                    <span className="text-slate-500">
                      AI Confidence
                    </span>

                    <span className="font-semibold">
                      {station.confidence}%
                    </span>

                  </div>

                  <div
                    className="
                      h-3
                      rounded-full
                      bg-slate-100
                    "
                  >

                    <motion.div
                      initial={{
                        width: 0,
                      }}
                      whileInView={{
                        width: `${station.confidence}%`,
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
                        ${priorityStyles[station.priority].progress}
                      `}
                    />

                  </div>

                </div>

              </motion.div>

            ))}

          </div>

          {/* AI Crowd Intelligence */}

          <motion.div
            whileHover={{
              y: -5,
            }}
            className="
              rounded-3xl
              bg-gradient-to-br
              from-cyan-700
              via-sky-700
              to-indigo-800
              p-6
              text-white
            "
          >

            <div
              className="
                flex
                items-center
                gap-3
              "
            >

              <Brain
                size={34}
                className="text-cyan-200"
              />

              <h3
                className="
                  text-2xl
                  font-bold
                "
              >
                AI Crowd Intelligence
              </h3>

            </div>

            <div
              className="
                mt-8
                space-y-5
              "
            >

              {[
                "Open additional entry gates at Rajiv Chowk immediately.",
                "Redirect passengers toward less crowded platforms.",
                "Deploy additional staff at major interchange stations.",
                "Display alternate route suggestions on passenger information boards.",
                "Increase train frequency before predicted congestion peaks.",
              ].map((item) => (

                <div
                  key={item}
                  className="
                    flex
                    items-start
                    gap-3
                  "
                >

                  <CheckCircle2
                    size={20}
                    className="mt-1 text-cyan-200"
                  />

                  <p
                    className="
                      leading-7
                      text-slate-200
                    "
                  >
                    {item}
                  </p>

                </div>

              ))}

            </div>

            <div
              className="
                mt-8
                rounded-2xl
                bg-white/10
                p-5
              "
            >

              <h4
                className="
                  text-lg
                  font-bold
                "
              >
                Expected Crowd Impact
              </h4>

              <div
                className="
                  mt-5
                  space-y-4
                "
              >

                {[
                  ["Queue Reduction", "18%"],
                  ["Passenger Throughput", "+16%"],
                  ["Platform Density", "-14%"],
                  ["Station Efficiency", "95%"],
                ].map(([label, value]) => (

                  <div
                    key={label}
                    className="
                      flex
                      justify-between
                    "
                  >

                    <span className="text-slate-200">
                      {label}
                    </span>

                    <span className="font-bold">
                      {value}
                    </span>

                  </div>

                ))}

              </div>

            </div>

          </motion.div>

        </div>

      </motion.div>
            {/* Incident Mitigation Dashboard */}

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
            gap-4
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >

          <div>

            <h2
              className="
                text-3xl
                font-black
                text-slate-900
              "
            >
              Incident Mitigation Dashboard
            </h2>

            <p
              className="
                mt-2
                text-slate-500
              "
            >
              AI continuously monitors incidents across
              the metro network and recommends immediate
              recovery actions to minimize operational
              disruption and passenger impact.
            </p>

          </div>

          <div
            className="
              rounded-full
              bg-red-100
              px-4
              py-2
              text-sm
              font-semibold
              text-red-700
            "
          >
            Live Incident Intelligence
          </div>

        </div>

        <div
          className="
            mt-10
            grid
            gap-6
            xl:grid-cols-3
          "
        >

          {/* Active Incidents */}

          <div className="xl:col-span-2 space-y-5">

            {(incidents.length
              ? incidents
              : [

                  {
                    id: 1,
                    severity: "Critical",
                    incident: "Signal Failure",
                    location: "Rajiv Chowk",
                    action:
                      "Dispatch maintenance crew immediately",
                    impact: "Blue Line Delays",
                    eta: "12 min",
                    confidence: 99,
                  },

                  {
                    id: 2,
                    severity: "High",
                    incident: "Platform Congestion",
                    location: "Kashmere Gate",
                    action:
                      "Redirect passengers to Platform 5",
                    impact: "Crowd Reduction",
                    eta: "8 min",
                    confidence: 96,
                  },

                  {
                    id: 3,
                    severity: "Medium",
                    incident: "Escalator Failure",
                    location: "Central Secretariat",
                    action:
                      "Activate alternate passenger route",
                    impact: "Passenger Flow",
                    eta: "18 min",
                    confidence: 94,
                  },

                  {
                    id: 4,
                    severity: "Low",
                    incident: "Ticket Counter Queue",
                    location: "Hauz Khas",
                    action:
                      "Open temporary ticket counter",
                    impact: "Queue Reduction",
                    eta: "6 min",
                    confidence: 91,
                  },

                ]).map((incident, index) => (

              <motion.div

                key={incident.id}

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
                  y: -4,
                }}

                className="
                  rounded-3xl
                  border
                  border-slate-200
                  p-6
                  transition-all
                  hover:border-red-200
                  hover:shadow-lg
                "
              >

                <div
                  className="
                    flex
                    flex-col
                    gap-5
                    lg:flex-row
                    lg:items-center
                    lg:justify-between
                  "
                >

                  <div>

                    <div
                      className="
                        flex
                        flex-wrap
                        items-center
                        gap-3
                      "
                    >

                      <span
                        className={`
                          rounded-full
                          px-3
                          py-1
                          text-sm
                          font-semibold
                          ${priorityStyles[incident.severity].badge}
                        `}
                      >
                        {incident.severity}
                      </span>

                      <span
                        className="
                          rounded-full
                          bg-slate-100
                          px-3
                          py-1
                          text-sm
                          text-slate-700
                        "
                      >
                        {incident.location}
                      </span>

                    </div>

                    <h3
                      className="
                        mt-4
                        text-2xl
                        font-bold
                        text-slate-900
                      "
                    >
                      {incident.incident}
                    </h3>

                    <p
                      className="
                        mt-3
                        leading-7
                        text-slate-600
                      "
                    >
                      {incident.action}
                    </p>

                  </div>

                  <div
                    className="
                      grid
                      gap-4
                      sm:grid-cols-3
                    "
                  >

                    <div
                      className="
                        rounded-2xl
                        bg-red-50
                        p-4
                        text-center
                      "
                    >

                      <CircleAlert
                        size={28}
                        className="mx-auto text-red-600"
                      />

                      <p
                        className="
                          mt-2
                          text-xs
                          uppercase
                          text-slate-500
                        "
                      >
                        Impact
                      </p>

                      <h4
                        className="
                          mt-2
                          font-bold
                          text-slate-900
                        "
                      >
                        {incident.impact}
                      </h4>

                    </div>

                    <div
                      className="
                        rounded-2xl
                        bg-orange-50
                        p-4
                        text-center
                      "
                    >

                      <Clock3
                        size={28}
                        className="mx-auto text-orange-500"
                      />

                      <p
                        className="
                          mt-2
                          text-xs
                          uppercase
                          text-slate-500
                        "
                      >
                        ETA
                      </p>

                      <h4
                        className="
                          mt-2
                          font-bold
                          text-slate-900
                        "
                      >
                        {incident.eta}
                      </h4>

                    </div>

                    <div
                      className="
                        rounded-2xl
                        bg-indigo-50
                        p-4
                        text-center
                      "
                    >

                      <Brain
                        size={28}
                        className="mx-auto text-indigo-600"
                      />

                      <p
                        className="
                          mt-2
                          text-xs
                          uppercase
                          text-slate-500
                        "
                      >
                        Confidence
                      </p>

                      <h4
                        className="
                          mt-2
                          font-bold
                          text-slate-900
                        "
                      >
                        {incident.confidence}%
                      </h4>

                    </div>

                  </div>

                </div>

                <div className="mt-6">

                  <div
                    className="
                      mb-2
                      flex
                      justify-between
                      text-sm
                    "
                  >

                    <span className="text-slate-500">
                      AI Recovery Confidence
                    </span>

                    <span className="font-semibold">
                      {incident.confidence}%
                    </span>

                  </div>

                  <div
                    className="
                      h-3
                      rounded-full
                      bg-slate-100
                    "
                  >

                    <motion.div
                      initial={{
                        width: 0,
                      }}
                      whileInView={{
                        width: `${incident.confidence}%`,
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
                        ${priorityStyles[incident.severity].progress}
                      `}
                    />

                  </div>

                </div>

              </motion.div>

            ))}

          </div>

          {/* AI Incident Response */}

          <motion.div
            whileHover={{
              y: -5,
            }}
            className="
              rounded-3xl
              bg-gradient-to-br
              from-red-700
              via-orange-700
              to-amber-700
              p-6
              text-white
            "
          >

            <div
              className="
                flex
                items-center
                gap-3
              "
            >

              <ShieldAlert
                size={34}
                className="text-red-200"
              />

              <h3
                className="
                  text-2xl
                  font-bold
                "
              >
                AI Incident Response
              </h3>

            </div>

            <div
              className="
                mt-8
                space-y-5
              "
            >

              {[
                "Dispatch maintenance teams to critical signal failures immediately.",
                "Automatically reroute passengers through alternate platforms.",
                "Increase train frequency on unaffected metro corridors.",
                "Broadcast live travel advisories across stations and mobile apps.",
                "Continuously monitor recovery progress using predictive analytics.",
              ].map((item) => (

                <div
                  key={item}
                  className="
                    flex
                    items-start
                    gap-3
                  "
                >

                  <CheckCircle2
                    size={20}
                    className="mt-1 text-red-200"
                  />

                  <p
                    className="
                      leading-7
                      text-slate-200
                    "
                  >
                    {item}
                  </p>

                </div>

              ))}

            </div>

            <div
              className="
                mt-8
                rounded-2xl
                bg-white/10
                p-5
              "
            >

              <h4
                className="
                  text-lg
                  font-bold
                "
              >
                Recovery Forecast
              </h4>

              <div
                className="
                  mt-5
                  space-y-4
                "
              >

                {[
                  ["Recovery Success", "97%"],
                  ["Service Restoration", "14 min"],
                  ["Passenger Impact", "-21%"],
                  ["Network Stability", "95%"],
                ].map(([label, value]) => (

                  <div
                    key={label}
                    className="
                      flex
                      justify-between
                    "
                  >

                    <span className="text-slate-200">
                      {label}
                    </span>

                    <span className="font-bold">
                      {value}
                    </span>

                  </div>

                ))}

              </div>

            </div>

          </motion.div>

        </div>

      </motion.div>
            {/* Executive Recommendation Summary */}

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
          overflow-hidden
          rounded-3xl
          bg-gradient-to-br
          from-slate-900
          via-indigo-900
          to-cyan-900
          p-8
          text-white
          shadow-2xl
        "
      >

        <div
          className="
            flex
            flex-col
            gap-8
            lg:flex-row
            lg:items-start
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
                bg-white/10
                px-4
                py-2
              "
            >

              <Brain
                size={18}
                className="text-cyan-300"
              />

              <span className="font-semibold">
                Executive Recommendation Summary
              </span>

            </div>

            <h2
              className="
                mt-6
                text-4xl
                font-black
              "
            >
              MetroFlow AI Strategic Decision Report
            </h2>

            <p
              className="
                mt-5
                max-w-4xl
                leading-8
                text-slate-300
              "
            >
              MetroFlow AI has analyzed live operational
              data across passenger demand, crowd
              density, train scheduling, platform
              allocation, and active incidents. The
              recommendation engine predicts significant
              improvements in network efficiency through
              proactive operational adjustments and
              intelligent decision support.
            </p>

          </div>

          <div
            className="
              rounded-3xl
              bg-white/10
              p-8
              text-center
            "
          >

            <p className="text-slate-300">
              Overall AI Score
            </p>

            <h2
              className="
                mt-4
                text-6xl
                font-black
              "
            >
              97
            </h2>

            <p
              className="
                mt-3
                text-sm
                font-semibold
                text-emerald-300
              "
            >
              Excellent Decision Quality
            </p>

          </div>

        </div>

        {/* Executive KPI Cards */}

        <div
          className="
            mt-10
            grid
            gap-6
            md:grid-cols-2
            xl:grid-cols-4
          "
        >

          {[
            {
              title: "Network Efficiency",
              value: "96%",
              icon: TrendingUp,
            },

            {
              title: "Passenger Time Saved",
              value: "13.4K min",
              icon: Activity,
            },

            {
              title: "Operational Savings",
              value: "₹5.2L",
              icon: Sparkles,
            },

            {
              title: "Resolved Incidents",
              value: "92%",
              icon: CheckCircle2,
            },

          ].map((metric) => {

            const Icon = metric.icon;

            return (

              <motion.div

                key={metric.title}

                whileHover={{
                  y: -6,
                }}

                className="
                  rounded-3xl
                  bg-white/10
                  p-6
                  backdrop-blur-md
                "
              >

                <div
                  className="
                    flex
                    items-center
                    justify-between
                  "
                >

                  <div>

                    <p className="text-slate-300">
                      {metric.title}
                    </p>

                    <h3
                      className="
                        mt-3
                        text-3xl
                        font-black
                      "
                    >
                      {metric.value}
                    </h3>

                  </div>

                  <Icon
                    size={34}
                    className="text-cyan-300"
                  />

                </div>

              </motion.div>

            );

          })}

        </div>

        {/* Strategic Recommendations */}

        <div className="mt-12">

          <h3
            className="
              text-2xl
              font-bold
            "
          >
            Executive AI Recommendations
          </h3>

          <div
            className="
              mt-6
              grid
              gap-5
              lg:grid-cols-2
            "
          >

            {[
              {
                title: "Expand Peak-Hour Fleet",
                description:
                  "Deploy reserve trains during forecast demand surges to maintain schedule reliability.",
              },

              {
                title: "Dynamic Platform Assignment",
                description:
                  "Automatically allocate platforms based on live passenger density and train arrival patterns.",
              },

              {
                title: "Predictive Crowd Diversion",
                description:
                  "Guide passengers toward alternate stations and exits before congestion reaches critical levels.",
              },

              {
                title: "AI Incident Recovery",
                description:
                  "Launch automated recovery workflows immediately after detecting operational disruptions.",
              },

              {
                title: "Adaptive Headway Optimization",
                description:
                  "Continuously adjust train intervals using real-time demand forecasting and traffic conditions.",
              },

              {
                title: "Integrated Network Coordination",
                description:
                  "Synchronize scheduling, platform management, and passenger information systems for end-to-end optimization.",
              },

            ].map((item, index) => (

              <motion.div

                key={item.title}

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
                  delay: index * 0.08,
                }}

                className="
                  rounded-3xl
                  bg-white/10
                  p-6
                "
              >

                <h4
                  className="
                    text-xl
                    font-bold
                  "
                >
                  {item.title}
                </h4>

                <p
                  className="
                    mt-4
                    leading-7
                    text-slate-300
                  "
                >
                  {item.description}
                </p>

              </motion.div>

            ))}

          </div>

        </div>

        {/* Executive Conclusion */}

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
            mt-12
            rounded-3xl
            border
            border-cyan-400/30
            bg-cyan-500/10
            p-8
          "
        >

          <div
            className="
              flex
              gap-5
            "
          >

            <Brain
              size={42}
              className="text-cyan-300"
            />

            <div>

              <h3
                className="
                  text-2xl
                  font-bold
                "
              >
                Executive AI Conclusion
              </h3>

              <p
                className="
                  mt-5
                  max-w-5xl
                  leading-8
                  text-slate-300
                "
              >
                MetroFlow AI recommends a proactive,
                data-driven operating strategy that
                combines predictive scheduling, intelligent
                crowd management, adaptive platform
                allocation, and automated incident response.
                By implementing these recommendations,
                metro operations can improve service
                reliability, reduce passenger delays,
                optimize resource utilization, and
                strengthen overall network resilience while
                maintaining an excellent passenger
                experience.
              </p>

            </div>

          </div>

        </motion.div>

      </motion.div>
      </div>

  );

}

export default RecommendationCenter;