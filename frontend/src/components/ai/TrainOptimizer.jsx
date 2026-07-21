import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Train,
  Activity,
  Clock3,
  Route,
  Gauge,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

function TrainOptimizer({
  trains = [],
  platforms = [],
  delays = [],
  recommendations = [],
}) {

  const summary = useMemo(() => {

    const activeTrains =
      trains.length || 142;

    const optimizedRoutes =
      trains.filter(
        (train) => train.optimized
      ).length || 118;

    const averageDelay = delays.length
      ? (
          delays.reduce(
            (sum, item) => sum + item.delay,
            0
          ) / delays.length
        ).toFixed(1)
      : 2.4;

    const fleetUtilization =
      trains.length
        ? Math.round(
            (optimizedRoutes /
              trains.length) *
              100
          )
        : 89;

    return {

      activeTrains,

      optimizedRoutes,

      averageDelay,

      fleetUtilization,

    };

  }, [trains, delays]);

  const optimizationLevels = {

    Excellent: {

      badge:
        "bg-emerald-100 text-emerald-700",

      progress:
        "bg-emerald-500",

    },

    Good: {

      badge:
        "bg-blue-100 text-blue-700",

      progress:
        "bg-blue-500",

    },

    Moderate: {

      badge:
        "bg-amber-100 text-amber-700",

      progress:
        "bg-amber-500",

    },

    Critical: {

      badge:
        "bg-red-100 text-red-700",

      progress:
        "bg-red-500",

    },

  };

  return (

    <div
      className="
        space-y-8
      "
    >

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
                AI Train Optimization
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
              Intelligent Train Scheduling
            </h1>

            <p
              className="
                mt-5
                max-w-3xl
                leading-8
                text-slate-300
              "
            >
              MetroFlow AI continuously analyzes
              passenger demand, train movement,
              platform availability, and network
              congestion to optimize schedules,
              minimize delays, and maximize fleet
              efficiency across the metro network.
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
                title: "AI Status",
                value: "Online",
                icon: CheckCircle2,
              },

              {
                title: "Optimization Cycle",
                value: "30 sec",
                icon: Activity,
              },

              {
                title: "Fleet Health",
                value: "98.6%",
                icon: Gauge,
              },

              {
                title: "Last Update",
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

        {/* Fleet Overview */}

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
              title: "Active Trains",
              value: summary.activeTrains,
              icon: Train,
            },

            {
              title: "Optimized Routes",
              value: summary.optimizedRoutes,
              icon: Route,
            },

            {
              title: "Average Delay",
              value: `${summary.averageDelay} min`,
              icon: Clock3,
            },

            {
              title: "Fleet Utilization",
              value: `${summary.fleetUtilization}%`,
              icon: Sparkles,
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
            {/* Operations KPI Dashboard */}

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
              Operations KPI Dashboard
            </h2>

            <p
              className="
                mt-2
                text-slate-500
              "
            >
              Live operational metrics generated
              by MetroFlow AI to evaluate train
              scheduling efficiency and overall
              network performance.
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
            Live AI Analytics
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
              title: "On-Time Performance",
              value: "97.8%",
              subtitle: "+2.1% today",
              icon: Clock3,
              color: "text-emerald-600",
              bg: "bg-emerald-50",
            },

            {
              title: "Delay Reduction",
              value: "41%",
              subtitle: "Compared to yesterday",
              icon: Activity,
              color: "text-indigo-600",
              bg: "bg-indigo-50",
            },

            {
              title: "Fleet Utilization",
              value: `${summary.fleetUtilization}%`,
              subtitle: "AI optimized fleet",
              icon: Gauge,
              color: "text-cyan-600",
              bg: "bg-cyan-50",
            },

            {
              title: "Routes Optimized",
              value: summary.optimizedRoutes,
              subtitle: "Real-time scheduling",
              icon: Route,
              color: "text-orange-600",
              bg: "bg-orange-50",
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

        {/* AI Operational Insights */}

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
                AI Operational Insights
              </h3>

            </div>

            <div
              className="
                mt-6
                space-y-5
              "
            >

              {[
                "Train utilization has increased by 8% compared to the previous optimization cycle.",
                "Platform occupancy remains stable despite rising passenger demand.",
                "Blue Line scheduling has reduced average waiting time by 2.3 minutes.",
                "AI recommends maintaining current headway for the next 30 minutes.",
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

          {/* Optimization Performance */}

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
                Optimization Performance
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
                  label: "Scheduling Efficiency",
                  value: 95,
                },

                {
                  label: "Route Optimization",
                  value: 92,
                },

                {
                  label: "Platform Utilization",
                  value: 88,
                },

                {
                  label: "Passenger Flow",
                  value: 94,
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

                    <span
                      className="
                        font-bold
                      "
                    >
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
            {/* Live Train Optimization Center */}

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
              Live Train Optimization Center
            </h2>

            <p
              className="
                mt-2
                text-slate-500
              "
            >
              MetroFlow AI continuously evaluates
              every running train to optimize
              schedules, minimize delays and improve
              network efficiency.
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
            Live Optimization Engine
          </div>

        </div>

        <div
          className="
            mt-10
            overflow-x-auto
          "
        >

          <table className="min-w-full">

            <thead>

              <tr className="border-b border-slate-200">

                <th className="px-4 py-4 text-left text-sm font-semibold text-slate-600">
                  Train
                </th>

                <th className="px-4 py-4 text-center text-sm font-semibold text-slate-600">
                  Route
                </th>

                <th className="px-4 py-4 text-center text-sm font-semibold text-slate-600">
                  Delay
                </th>

                <th className="px-4 py-4 text-center text-sm font-semibold text-slate-600">
                  AI Schedule
                </th>

                <th className="px-4 py-4 text-center text-sm font-semibold text-slate-600">
                  Platform
                </th>

                <th className="px-4 py-4 text-center text-sm font-semibold text-slate-600">
                  Headway
                </th>

                <th className="px-4 py-4 text-center text-sm font-semibold text-slate-600">
                  Confidence
                </th>

                <th className="px-4 py-4 text-center text-sm font-semibold text-slate-600">
                  Status
                </th>

              </tr>

            </thead>

            <tbody>

              {(trains.length
                ? trains
                : [

                    {
                      id: "T-101",
                      route: "Blue Line",
                      delay: 1,
                      schedule: "On Schedule",
                      platform: 2,
                      headway: "3 min",
                      confidence: 99,
                      status: "Excellent",
                    },

                    {
                      id: "T-204",
                      route: "Yellow Line",
                      delay: 3,
                      schedule: "Adjusted",
                      platform: 5,
                      headway: "4 min",
                      confidence: 96,
                      status: "Good",
                    },

                    {
                      id: "T-315",
                      route: "Red Line",
                      delay: 5,
                      schedule: "Recovery",
                      platform: 1,
                      headway: "5 min",
                      confidence: 91,
                      status: "Moderate",
                    },

                    {
                      id: "T-411",
                      route: "Green Line",
                      delay: 8,
                      schedule: "Priority Dispatch",
                      platform: 3,
                      headway: "6 min",
                      confidence: 84,
                      status: "Critical",
                    },

                    {
                      id: "T-527",
                      route: "Violet Line",
                      delay: 2,
                      schedule: "Optimized",
                      platform: 4,
                      headway: "3 min",
                      confidence: 97,
                      status: "Excellent",
                    },

                  ]).map((train, index) => (

                <motion.tr

                  key={train.id}

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

                  className="
                    border-b
                    border-slate-100
                    hover:bg-slate-50
                  "
                >

                  <td className="px-4 py-5">

                    <div
                      className="
                        flex
                        items-center
                        gap-3
                      "
                    >

                      <Train
                        size={22}
                        className="text-indigo-600"
                      />

                      <span
                        className="
                          font-semibold
                          text-slate-900
                        "
                      >
                        {train.id}
                      </span>

                    </div>

                  </td>

                  <td className="px-4 py-5 text-center font-medium text-slate-700">
                    {train.route}
                  </td>

                  <td className="px-4 py-5 text-center">

                    <span
                      className="
                        rounded-full
                        bg-red-100
                        px-3
                        py-1
                        text-sm
                        font-semibold
                        text-red-700
                      "
                    >
                      {train.delay} min
                    </span>

                  </td>

                  <td className="px-4 py-5 text-center font-semibold text-indigo-700">
                    {train.schedule}
                  </td>

                  <td className="px-4 py-5 text-center">
                    Platform {train.platform}
                  </td>

                  <td className="px-4 py-5 text-center">
                    {train.headway}
                  </td>

                  <td className="px-4 py-5">

                    <div
                      className="
                        mx-auto
                        max-w-[170px]
                      "
                    >

                      <div
                        className="
                          mb-2
                          flex
                          justify-between
                          text-sm
                        "
                      >

                        <span className="text-slate-500">
                          AI
                        </span>

                        <span className="font-semibold">
                          {train.confidence}%
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
                            width: `${train.confidence}%`,
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
                            bg-gradient-to-r
                            from-indigo-600
                            to-cyan-500
                          "
                        />

                      </div>

                    </div>

                  </td>

                  <td className="px-4 py-5 text-center">

                    <span
                      className={`
                        rounded-full
                        px-3
                        py-1
                        text-sm
                        font-semibold
                        ${
                          optimizationLevels[
                            train.status
                          ]?.badge
                        }
                      `}
                    >
                      {train.status}
                    </span>

                  </td>

                </motion.tr>

              ))}

            </tbody>

          </table>

        </div>

        {/* AI Optimization Recommendation */}

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
            delay: 0.3,
          }}

          className="
            mt-10
            rounded-3xl
            bg-gradient-to-r
            from-indigo-600
            via-blue-600
            to-cyan-500
            p-8
            text-white
          "
        >

          <div
            className="
              flex
              gap-5
            "
          >

            <Brain
              size={38}
              className="text-cyan-200"
            />

            <div>

              <h3
                className="
                  text-2xl
                  font-bold
                "
              >
                AI Scheduling Recommendation
              </h3>

              <p
                className="
                  mt-4
                  max-w-5xl
                  leading-8
                  text-blue-100
                "
              >
                MetroFlow AI recommends increasing
                train frequency on the Blue and
                Yellow Lines over the next 30
                minutes while prioritizing recovery
                schedules for delayed services.
                Dynamic headway adjustments are
                expected to reduce average waiting
                time by approximately 18% and improve
                overall network throughput.
              </p>

            </div>

          </div>

        </motion.div>

      </motion.div>
            {/* Dynamic Headway Optimization */}

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
          grid
          gap-6
          xl:grid-cols-3
        "
      >

        {/* Headway Optimization Dashboard */}

        <div
          className="
            xl:col-span-2
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
                Dynamic Headway Optimization
              </h2>

              <p
                className="
                  mt-2
                  text-slate-500
                "
              >
                MetroFlow AI dynamically adjusts
                train intervals based on passenger
                demand, congestion, and live
                operational conditions.
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
              AI Headway Engine
            </div>

          </div>

          <div
            className="
              mt-10
              grid
              gap-6
              md:grid-cols-2
            "
          >

            {[
              {
                line: "Blue Line",
                current: "5 min",
                recommended: "3 min",
                improvement: "40%",
                level: "Excellent",
              },

              {
                line: "Yellow Line",
                current: "6 min",
                recommended: "4 min",
                improvement: "33%",
                level: "Good",
              },

              {
                line: "Red Line",
                current: "7 min",
                recommended: "5 min",
                improvement: "28%",
                level: "Moderate",
              },

              {
                line: "Green Line",
                current: "8 min",
                recommended: "6 min",
                improvement: "25%",
                level: "Good",
              },

            ].map((item, index) => (

              <motion.div

                key={item.line}

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
                  y: -5,
                }}

                className="
                  rounded-3xl
                  border
                  border-slate-200
                  p-6
                  hover:border-indigo-200
                  hover:shadow-lg
                  transition-all
                "
              >

                <div
                  className="
                    flex
                    items-center
                    justify-between
                  "
                >

                  <h3
                    className="
                      text-xl
                      font-bold
                      text-slate-900
                    "
                  >
                    {item.line}
                  </h3>

                  <span
                    className={`
                      rounded-full
                      px-3
                      py-1
                      text-sm
                      font-semibold
                      ${
                        optimizationLevels[
                          item.level
                        ]?.badge
                      }
                    `}
                  >
                    {item.level}
                  </span>

                </div>

                <div
                  className="
                    mt-6
                    space-y-5
                  "
                >

                  <div
                    className="
                      flex
                      justify-between
                    "
                  >

                    <span className="text-slate-500">
                      Current Headway
                    </span>

                    <span className="font-semibold">
                      {item.current}
                    </span>

                  </div>

                  <div
                    className="
                      flex
                      justify-between
                    "
                  >

                    <span className="text-slate-500">
                      AI Recommendation
                    </span>

                    <span
                      className="
                        font-bold
                        text-indigo-700
                      "
                    >
                      {item.recommended}
                    </span>

                  </div>

                  <div
                    className="
                      flex
                      justify-between
                    "
                  >

                    <span className="text-slate-500">
                      Efficiency Gain
                    </span>

                    <span
                      className="
                        font-bold
                        text-emerald-600
                      "
                    >
                      +{item.improvement}
                    </span>

                  </div>

                </div>

              </motion.div>

            ))}

          </div>

          {/* Network Frequency */}

          <div
            className="
              mt-10
              rounded-3xl
              bg-slate-50
              p-6
            "
          >

            <div
              className="
                flex
                items-center
                justify-between
              "
            >

              <h3
                className="
                  text-xl
                  font-bold
                  text-slate-900
                "
              >
                Peak Hour Frequency Adjustment
              </h3>

              <span
                className="
                  rounded-full
                  bg-cyan-100
                  px-3
                  py-1
                  text-sm
                  font-semibold
                  text-cyan-700
                "
              >
                Live AI
              </span>

            </div>

            <div
              className="
                mt-8
                space-y-6
              "
            >

              {[
                {
                  label: "Morning Peak",
                  value: 96,
                },

                {
                  label: "Afternoon",
                  value: 72,
                },

                {
                  label: "Evening Peak",
                  value: 98,
                },

                {
                  label: "Night Service",
                  value: 58,
                },

              ].map((item) => (

                <div key={item.label}>

                  <div
                    className="
                      mb-2
                      flex
                      justify-between
                    "
                  >

                    <span className="text-slate-600">
                      {item.label}
                    </span>

                    <span
                      className="
                        font-bold
                      "
                    >
                      {item.value}%
                    </span>

                  </div>

                  <div
                    className="
                      h-3
                      rounded-full
                      bg-slate-200
                    "
                  >

                    <motion.div

                      initial={{
                        width: 0,
                      }}

                      whileInView={{
                        width: `${item.value}%`,
                      }}

                      viewport={{
                        once: true,
                      }}

                      transition={{
                        duration: 1
                      }}

                      className="
                        h-full
                        rounded-full
                        bg-gradient-to-r
                        from-cyan-500
                        via-indigo-500
                        to-purple-600
                      "
                    />

                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>

        {/* AI Headway Intelligence */}

        <div
          className="
            rounded-3xl
            bg-gradient-to-br
            from-slate-900
            via-indigo-900
            to-slate-900
            p-8
            text-white
            shadow-xl
          "
        >

          <Brain
            size={42}
            className="text-cyan-300"
          />

          <h2
            className="
              mt-6
              text-2xl
              font-bold
            "
          >
            AI Headway Intelligence
          </h2>

          <p
            className="
              mt-5
              leading-8
              text-slate-300
            "
          >
            MetroFlow AI continuously predicts
            passenger arrivals and automatically
            adjusts train intervals to maximize
            throughput while preventing platform
            overcrowding across the network.
          </p>

          <div
            className="
              mt-8
              space-y-5
            "
          >

            {[
              "Reduce Blue Line interval to 3 minutes.",
              "Increase Yellow Line frequency by 18%.",
              "Deploy standby train during evening peak.",
              "Maintain Green Line headway until demand increases.",
            ].map((tip) => (

              <div
                key={tip}
                className="
                  flex
                  items-center
                  gap-3
                "
              >

                <div
                  className="
                    h-3
                    w-3
                    rounded-full
                    bg-cyan-400
                  "
                />

                <span className="text-slate-200">
                  {tip}
                </span>

              </div>

            ))}

          </div>

        </div>

      </motion.div>
            {/* Platform Allocation Center */}

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
              Platform Allocation Center
            </h2>

            <p
              className="
                mt-2
                text-slate-500
              "
            >
              MetroFlow AI continuously balances
              platform utilization to reduce
              congestion, improve train turnaround,
              and maintain smooth passenger flow.
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
            Smart Platform Manager
          </div>

        </div>

        <div
          className="
            mt-10
            overflow-x-auto
          "
        >

          <table className="min-w-full">

            <thead>

              <tr className="border-b border-slate-200">

                <th className="px-4 py-4 text-left text-sm font-semibold text-slate-600">
                  Platform
                </th>

                <th className="px-4 py-4 text-center text-sm font-semibold text-slate-600">
                  Incoming Train
                </th>

                <th className="px-4 py-4 text-center text-sm font-semibold text-slate-600">
                  Passenger Load
                </th>

                <th className="px-4 py-4 text-center text-sm font-semibold text-slate-600">
                  Utilization
                </th>

                <th className="px-4 py-4 text-center text-sm font-semibold text-slate-600">
                  Congestion
                </th>

                <th className="px-4 py-4 text-center text-sm font-semibold text-slate-600">
                  AI Action
                </th>

              </tr>

            </thead>

            <tbody>

              {(platforms.length
                ? platforms
                : [

                    {
                      platform: "Platform 1",
                      train: "T-315",
                      passengers: 920,
                      utilization: 93,
                      congestion: "Critical",
                      action: "Reassign",
                    },

                    {
                      platform: "Platform 2",
                      train: "T-101",
                      passengers: 710,
                      utilization: 82,
                      congestion: "Good",
                      action: "Maintain",
                    },

                    {
                      platform: "Platform 3",
                      train: "T-411",
                      passengers: 640,
                      utilization: 74,
                      congestion: "Moderate",
                      action: "Monitor",
                    },

                    {
                      platform: "Platform 4",
                      train: "T-527",
                      passengers: 540,
                      utilization: 63,
                      congestion: "Excellent",
                      action: "Optimal",
                    },

                    {
                      platform: "Platform 5",
                      train: "T-204",
                      passengers: 805,
                      utilization: 88,
                      congestion: "Good",
                      action: "Prepare",
                    },

                  ]).map((platform, index) => (

                <motion.tr

                  key={platform.platform}

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

                  className="
                    border-b
                    border-slate-100
                    hover:bg-slate-50
                  "
                >

                  <td className="px-4 py-5">

                    <span
                      className="
                        font-semibold
                        text-slate-900
                      "
                    >
                      {platform.platform}
                    </span>

                  </td>

                  <td className="px-4 py-5 text-center font-medium text-indigo-700">
                    {platform.train}
                  </td>

                  <td className="px-4 py-5 text-center">
                    {platform.passengers.toLocaleString()}
                  </td>

                  <td className="px-4 py-5">

                    <div
                      className="
                        mx-auto
                        max-w-[180px]
                      "
                    >

                      <div
                        className="
                          mb-2
                          flex
                          justify-between
                          text-sm
                        "
                      >

                        <span className="text-slate-500">
                          Usage
                        </span>

                        <span className="font-semibold">
                          {platform.utilization}%
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
                            width: `${platform.utilization}%`,
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
                            ${
                              optimizationLevels[
                                platform.congestion
                              ]?.progress
                            }
                          `}
                        />

                      </div>

                    </div>

                  </td>

                  <td className="px-4 py-5 text-center">

                    <span
                      className={`
                        rounded-full
                        px-3
                        py-1
                        text-sm
                        font-semibold
                        ${
                          optimizationLevels[
                            platform.congestion
                          ]?.badge
                        }
                      `}
                    >
                      {platform.congestion}
                    </span>

                  </td>

                  <td className="px-4 py-5 text-center">

                    <span
                      className="
                        rounded-full
                        bg-cyan-100
                        px-3
                        py-1
                        text-sm
                        font-semibold
                        text-cyan-700
                      "
                    >
                      {platform.action}
                    </span>

                  </td>

                </motion.tr>

              ))}

            </tbody>

          </table>

        </div>

        {/* AI Platform Recommendation */}

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
            delay: 0.3,
          }}

          className="
            mt-10
            rounded-3xl
            bg-gradient-to-r
            from-slate-900
            via-indigo-900
            to-cyan-700
            p-8
            text-white
          "
        >

          <div
            className="
              flex
              gap-5
            "
          >

            <Brain
              size={38}
              className="text-cyan-300"
            />

            <div>

              <h3
                className="
                  text-2xl
                  font-bold
                "
              >
                AI Platform Optimization
              </h3>

              <p
                className="
                  mt-4
                  max-w-5xl
                  leading-8
                  text-slate-300
                "
              >
                MetroFlow AI predicts increased
                congestion on Platform 1 during the
                next operational cycle. Reassigning
                Train T-315 to Platform 4 and
                redirecting passenger flow is
                expected to decrease platform
                occupancy by approximately 17% while
                improving boarding efficiency and
                reducing waiting time.
              </p>

            </div>

          </div>

        </motion.div>

      </motion.div>
            {/* Delay Prediction & Recovery Center */}

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
          grid
          gap-6
          xl:grid-cols-3
        "
      >

        {/* Delay Prediction Dashboard */}

        <div
          className="
            xl:col-span-2
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
                Delay Prediction & Recovery
              </h2>

              <p
                className="
                  mt-2
                  text-slate-500
                "
              >
                MetroFlow AI predicts network delays,
                estimates passenger impact, and
                generates recovery strategies before
                disruptions propagate across the
                metro network.
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
              Predictive Recovery Engine
            </div>

          </div>

          <div
            className="
              mt-10
              overflow-x-auto
            "
          >

            <table className="min-w-full">

              <thead>

                <tr className="border-b border-slate-200">

                  <th className="px-4 py-4 text-left text-sm font-semibold text-slate-600">
                    Train
                  </th>

                  <th className="px-4 py-4 text-center text-sm font-semibold text-slate-600">
                    Delay
                  </th>

                  <th className="px-4 py-4 text-center text-sm font-semibold text-slate-600">
                    Hotspot
                  </th>

                  <th className="px-4 py-4 text-center text-sm font-semibold text-slate-600">
                    Passenger Impact
                  </th>

                  <th className="px-4 py-4 text-center text-sm font-semibold text-slate-600">
                    Recovery Time
                  </th>

                  <th className="px-4 py-4 text-center text-sm font-semibold text-slate-600">
                    Confidence
                  </th>

                </tr>

              </thead>

              <tbody>

                {(delays.length
                  ? delays
                  : [

                      {
                        train: "T-411",
                        delay: "8 min",
                        hotspot: "Rajiv Chowk",
                        impact: 1340,
                        recovery: "10 min",
                        confidence: 96,
                      },

                      {
                        train: "T-315",
                        delay: "5 min",
                        hotspot: "Kashmere Gate",
                        impact: 910,
                        recovery: "7 min",
                        confidence: 94,
                      },

                      {
                        train: "T-204",
                        delay: "3 min",
                        hotspot: "Central Secretariat",
                        impact: 640,
                        recovery: "5 min",
                        confidence: 97,
                      },

                      {
                        train: "T-527",
                        delay: "2 min",
                        hotspot: "Mandi House",
                        impact: 420,
                        recovery: "3 min",
                        confidence: 99,
                      },

                    ]).map((delay, index) => (

                  <motion.tr

                    key={delay.train}

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

                    className="
                      border-b
                      border-slate-100
                      hover:bg-slate-50
                    "
                  >

                    <td className="px-4 py-5">

                      <div
                        className="
                          flex
                          items-center
                          gap-3
                        "
                      >

                        <Train
                          size={22}
                          className="text-indigo-600"
                        />

                        <span
                          className="
                            font-semibold
                            text-slate-900
                          "
                        >
                          {delay.train}
                        </span>

                      </div>

                    </td>

                    <td className="px-4 py-5 text-center">

                      <span
                        className="
                          rounded-full
                          bg-red-100
                          px-3
                          py-1
                          text-sm
                          font-semibold
                          text-red-700
                        "
                      >
                        {delay.delay}
                      </span>

                    </td>

                    <td className="px-4 py-5 text-center">
                      {delay.hotspot}
                    </td>

                    <td className="px-4 py-5 text-center font-semibold">
                      {delay.impact.toLocaleString()}
                    </td>

                    <td className="px-4 py-5 text-center text-emerald-600 font-semibold">
                      {delay.recovery}
                    </td>

                    <td className="px-4 py-5">

                      <div
                        className="
                          mx-auto
                          max-w-[170px]
                        "
                      >

                        <div
                          className="
                            mb-2
                            flex
                            justify-between
                            text-sm
                          "
                        >

                          <span className="text-slate-500">
                            AI
                          </span>

                          <span className="font-semibold">
                            {delay.confidence}%
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
                              width: `${delay.confidence}%`,
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
                              bg-gradient-to-r
                              from-red-500
                              via-orange-500
                              to-emerald-500
                            "
                          />

                        </div>

                      </div>

                    </td>

                  </motion.tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

        {/* AI Recovery Intelligence */}

        <div
          className="
            rounded-3xl
            bg-gradient-to-br
            from-red-900
            via-slate-900
            to-indigo-900
            p-8
            text-white
            shadow-xl
          "
        >

          <Brain
            size={42}
            className="text-orange-300"
          />

          <h2
            className="
              mt-6
              text-2xl
              font-bold
            "
          >
            AI Recovery Intelligence
          </h2>

          <p
            className="
              mt-5
              leading-8
              text-slate-300
            "
          >
            MetroFlow AI continuously evaluates
            disruption scenarios and recommends
            recovery actions that minimize network
            delay while maintaining passenger safety
            and service reliability.
          </p>

          <div
            className="
              mt-8
              space-y-5
            "
          >

            {[
              "Dispatch standby train to Blue Line corridor.",
              "Prioritize T-411 through Rajiv Chowk junction.",
              "Reassign Platform 1 arrivals to Platform 4.",
              "Increase headway recovery frequency for 20 minutes.",
              "Broadcast passenger advisory across affected stations.",
            ].map((tip) => (

              <div
                key={tip}
                className="
                  flex
                  items-center
                  gap-3
                "
              >

                <div
                  className="
                    h-3
                    w-3
                    rounded-full
                    bg-orange-400
                  "
                />

                <span className="text-slate-200">
                  {tip}
                </span>

              </div>

            ))}

          </div>

          <div
            className="
              mt-10
              rounded-2xl
              bg-white/10
              p-6
            "
          >

            <h3
              className="
                text-lg
                font-bold
              "
            >
              Expected Recovery
            </h3>

            <div
              className="
                mt-6
                space-y-5
              "
            >

              {[
                {
                  label: "Delay Reduction",
                  value: 82,
                },

                {
                  label: "Passenger Recovery",
                  value: 91,
                },

                {
                  label: "Schedule Stability",
                  value: 95,
                },

              ].map((item) => (

                <div key={item.label}>

                  <div
                    className="
                      mb-2
                      flex
                      justify-between
                    "
                  >

                    <span>{item.label}</span>

                    <span className="font-bold">
                      {item.value}%
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
                        width: `${item.value}%`,
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
                        bg-gradient-to-r
                        from-orange-400
                        via-yellow-400
                        to-emerald-400
                      "
                    />

                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>

      </motion.div>
            {/* Executive Optimization Summary */}

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
            gap-6
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

              <span className="font-medium">
                Executive Optimization Summary
              </span>

            </div>

            <h2
              className="
                mt-6
                text-4xl
                font-black
              "
            >
              MetroFlow AI Optimization Report
            </h2>

            <p
              className="
                mt-5
                max-w-4xl
                leading-8
                text-slate-300
              "
            >
              MetroFlow AI continuously optimizes
              train scheduling, platform allocation,
              and fleet utilization using predictive
              analytics. The current optimization
              cycle indicates improved operational
              efficiency, reduced passenger waiting
              times, and better network resilience
              across the metro system.
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
              Network Efficiency Score
            </p>

            <h2
              className="
                mt-4
                text-6xl
                font-black
              "
            >
              96
            </h2>

            <p
              className="
                mt-3
                text-sm
                font-semibold
                text-emerald-300
              "
            >
              Excellent Performance
            </p>

          </div>

        </div>

        {/* Executive KPIs */}

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
              title: "Delay Reduction",
              value: "41%",
              icon: Clock3,
            },

            {
              title: "Passenger Time Saved",
              value: "12.8K min",
              icon: Activity,
            },

            {
              title: "Fleet Efficiency",
              value: "94%",
              icon: Train,
            },

            {
              title: "Operational Savings",
              value: "₹4.8L",
              icon: Gauge,
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
            AI Strategic Recommendations
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
                title: "Increase Blue Line Capacity",
                description:
                  "Deploy additional trains during evening peak periods to accommodate forecast passenger demand.",
              },

              {
                title: "Dynamic Platform Allocation",
                description:
                  "Automatically reassign platforms during congestion to reduce dwell time and improve throughput.",
              },

              {
                title: "Predictive Fleet Dispatch",
                description:
                  "Position standby trains at high-demand interchange stations before congestion develops.",
              },

              {
                title: "Adaptive Headway Control",
                description:
                  "Continuously adjust train intervals using live passenger and operational data.",
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
                MetroFlow AI concludes that the
                current optimization strategy has
                significantly improved operational
                efficiency by reducing delays,
                balancing passenger demand, and
                maximizing fleet utilization. With
                continuous predictive scheduling,
                intelligent platform allocation, and
                adaptive headway optimization, the
                metro network is expected to maintain
                high reliability while minimizing
                operational costs and passenger
                waiting times.
              </p>

            </div>

          </div>

        </motion.div>

      </motion.div>
            {/* Executive Optimization Summary */}

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
            gap-6
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

              <span className="font-medium">
                Executive Optimization Summary
              </span>

            </div>

            <h2
              className="
                mt-6
                text-4xl
                font-black
              "
            >
              MetroFlow AI Optimization Report
            </h2>

            <p
              className="
                mt-5
                max-w-4xl
                leading-8
                text-slate-300
              "
            >
              MetroFlow AI continuously optimizes
              train scheduling, platform allocation,
              and fleet utilization using predictive
              analytics. The current optimization
              cycle indicates improved operational
              efficiency, reduced passenger waiting
              times, and better network resilience
              across the metro system.
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
              Network Efficiency Score
            </p>

            <h2
              className="
                mt-4
                text-6xl
                font-black
              "
            >
              96
            </h2>

            <p
              className="
                mt-3
                text-sm
                font-semibold
                text-emerald-300
              "
            >
              Excellent Performance
            </p>

          </div>

        </div>

        {/* Executive KPIs */}

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
              title: "Delay Reduction",
              value: "41%",
              icon: Clock3,
            },

            {
              title: "Passenger Time Saved",
              value: "12.8K min",
              icon: Activity,
            },

            {
              title: "Fleet Efficiency",
              value: "94%",
              icon: Train,
            },

            {
              title: "Operational Savings",
              value: "₹4.8L",
              icon: Gauge,
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
            AI Strategic Recommendations
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
                title: "Increase Blue Line Capacity",
                description:
                  "Deploy additional trains during evening peak periods to accommodate forecast passenger demand.",
              },

              {
                title: "Dynamic Platform Allocation",
                description:
                  "Automatically reassign platforms during congestion to reduce dwell time and improve throughput.",
              },

              {
                title: "Predictive Fleet Dispatch",
                description:
                  "Position standby trains at high-demand interchange stations before congestion develops.",
              },

              {
                title: "Adaptive Headway Control",
                description:
                  "Continuously adjust train intervals using live passenger and operational data.",
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
                MetroFlow AI concludes that the
                current optimization strategy has
                significantly improved operational
                efficiency by reducing delays,
                balancing passenger demand, and
                maximizing fleet utilization. With
                continuous predictive scheduling,
                intelligent platform allocation, and
                adaptive headway optimization, the
                metro network is expected to maintain
                high reliability while minimizing
                operational costs and passenger
                waiting times.
              </p>

            </div>

          </div>

        </motion.div>

      </motion.div>
          </div>

  );

}

export default TrainOptimizer;