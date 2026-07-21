import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Sparkles,
  Activity,
  TrendingUp,
  Clock3,
  CheckCircle2,
  Cpu,
  Network,
} from "lucide-react";

function NetworkSimulation({
  simulations = [],
  passengerFlow = [],
  schedules = [],
  finance = [],
}) {

  const summary = useMemo(() => {

    const totalSimulations =
      simulations.length || 24;

    const activeSimulations =
      simulations.filter(
        (item) => item.status === "Running"
      ).length || 8;

    const completedSimulations =
      simulations.filter(
        (item) => item.status === "Completed"
      ).length || 14;

    const averageConfidence =
      simulations.length
        ? Math.round(
            simulations.reduce(
              (sum, item) =>
                sum + item.confidence,
              0
            ) / simulations.length
          )
        : 98;

    return {

      totalSimulations,

      activeSimulations,

      completedSimulations,

      averageConfidence,

    };

  }, [simulations]);

  const riskStyles = {

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

              <Network
                size={18}
                className="text-cyan-300"
              />

              <span
                className="
                  text-sm
                  font-semibold
                "
              >
                AI Digital Twin
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
              Network Simulation Center
            </h1>

            <p
              className="
                mt-5
                max-w-3xl
                leading-8
                text-slate-300
              "
            >
              MetroFlow AI continuously simulates
              passenger demand, train movement,
              infrastructure performance, and network
              resilience to evaluate operational
              strategies before deployment in the real
              metro system.
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
                title: "Digital Twin",
                value: "Active",
                icon: Cpu,
              },

              {
                title: "Running Simulations",
                value: summary.activeSimulations,
                icon: Activity,
              },

              {
                title: "Prediction Engine",
                value: "Online",
                icon: Brain,
              },

              {
                title: "Last Simulation",
                value: "2 min ago",
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
              title: "Total Simulations",
              value: summary.totalSimulations,
              icon: Activity,
            },

            {
              title: "Running",
              value: summary.activeSimulations,
              icon: Cpu,
            },

            {
              title: "Completed",
              value: summary.completedSimulations,
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
            {/* Simulation KPI Dashboard */}

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
              Simulation KPI Dashboard
            </h2>

            <p
              className="
                mt-2
                text-slate-500
              "
            >
              Executive metrics generated from the
              MetroFlow AI Digital Twin, evaluating
              network resilience, prediction quality,
              and simulation effectiveness.
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
            AI Simulation Analytics
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
              title: "Prediction Accuracy",
              value: `${summary.averageConfidence}%`,
              subtitle: "AI Forecast",
              icon: Brain,
              color: "text-indigo-600",
              bg: "bg-indigo-50",
            },

            {
              title: "Running Models",
              value: summary.activeSimulations,
              subtitle: "Active Simulations",
              icon: Cpu,
              color: "text-cyan-600",
              bg: "bg-cyan-50",
            },

            {
              title: "Passenger Impact",
              value: "-18%",
              subtitle: "Delay Reduction",
              icon: TrendingUp,
              color: "text-emerald-600",
              bg: "bg-emerald-50",
            },

            {
              title: "Network Stability",
              value: "99.1%",
              subtitle: "Availability",
              icon: Activity,
              color: "text-violet-600",
              bg: "bg-violet-50",
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
                  hover:border-cyan-200
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

        {/* AI Simulation Insights */}

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
                className="text-cyan-600"
              />

              <h3
                className="
                  text-xl
                  font-bold
                  text-slate-900
                "
              >
                AI Simulation Insights
              </h3>

            </div>

            <div
              className="
                mt-6
                space-y-5
              "
            >

              {[
                "Peak-hour demand can be reduced by increasing train frequency by 12%.",
                "Passenger congestion decreases significantly with dynamic platform assignment.",
                "AI predicts lower delay propagation using adaptive headway optimization.",
                "Digital Twin identifies infrastructure bottlenecks before operational deployment.",
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

          {/* Simulation Performance */}

          <div
            className="
              rounded-3xl
              bg-gradient-to-br
              from-cyan-600
              via-sky-600
              to-indigo-700
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
                Simulation Performance
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
                  label: "Prediction Accuracy",
                  value: 98,
                },

                {
                  label: "Scenario Reliability",
                  value: 96,
                },

                {
                  label: "Decision Confidence",
                  value: 97,
                },

                {
                  label: "Network Optimization",
                  value: 95,
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
            {/* Network Simulation Center */}

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
              Network Simulation Center
            </h2>

            <p
              className="
                mt-2
                text-slate-500
              "
            >
              Execute AI-powered Digital Twin scenarios
              to evaluate operational risks, passenger
              impact, and recovery strategies before
              applying them to the live metro network.
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
            Live Scenario Simulator
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

          {/* Simulation Cards */}

          <div className="xl:col-span-2 space-y-5">

            {(simulations.length
              ? simulations
              : [

                  {
                    id: 1,
                    scenario: "Peak Hour Demand",
                    risk: "High",
                    confidence: 98,
                    impact: "Passenger Waiting +18%",
                    recovery: "Increase Train Frequency",
                    duration: "25 min",
                  },

                  {
                    id: 2,
                    scenario: "Signal Failure",
                    risk: "Critical",
                    confidence: 99,
                    impact: "Blue Line Delay",
                    recovery: "Activate Alternate Route",
                    duration: "18 min",
                  },

                  {
                    id: 3,
                    scenario: "Station Closure",
                    risk: "Medium",
                    confidence: 95,
                    impact: "Passenger Diversion",
                    recovery: "Dynamic Route Guidance",
                    duration: "40 min",
                  },

                  {
                    id: 4,
                    scenario: "Festival Crowd Surge",
                    risk: "High",
                    confidence: 97,
                    impact: "Platform Congestion",
                    recovery: "Deploy Extra Trains",
                    duration: "55 min",
                  },

                ]).map((scenario, index) => (

              <motion.div

                key={scenario.id}

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
                          ${riskStyles[scenario.risk].badge}
                        `}
                      >
                        {scenario.risk}
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
                        {scenario.duration}
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
                      {scenario.scenario}
                    </h3>

                    <p
                      className="
                        mt-3
                        text-slate-600
                      "
                    >
                      Predicted Impact:
                      <span className="ml-2 font-semibold">
                        {scenario.impact}
                      </span>
                    </p>

                    <p
                      className="
                        mt-2
                        text-slate-600
                      "
                    >
                      AI Recommendation:
                      <span className="ml-2 font-semibold text-cyan-700">
                        {scenario.recovery}
                      </span>
                    </p>

                  </div>

                  <div
                    className="
                      grid
                      gap-4
                      sm:grid-cols-2
                    "
                  >

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
                        {scenario.confidence}%
                      </h4>

                    </div>

                    <div
                      className="
                        rounded-2xl
                        bg-cyan-50
                        p-4
                        text-center
                      "
                    >

                      <Clock3
                        size={28}
                        className="mx-auto text-cyan-600"
                      />

                      <p
                        className="
                          mt-2
                          text-xs
                          uppercase
                          text-slate-500
                        "
                      >
                        Recovery Time
                      </p>

                      <h4
                        className="
                          mt-2
                          font-bold
                          text-slate-900
                        "
                      >
                        {scenario.duration}
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
                      Simulation Confidence
                    </span>

                    <span className="font-semibold">
                      {scenario.confidence}%
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
                        width: `${scenario.confidence}%`,
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
                        ${riskStyles[scenario.risk].progress}
                      `}
                    />

                  </div>

                </div>

              </motion.div>

            ))}

          </div>

          {/* Executive Scenario Intelligence */}

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

              <Cpu
                size={34}
                className="text-cyan-200"
              />

              <h3
                className="
                  text-2xl
                  font-bold
                "
              >
                Scenario Intelligence
              </h3>

            </div>

            <div
              className="
                mt-8
                space-y-5
              "
            >

              {[
                "Peak-hour congestion can be reduced by dynamic scheduling.",
                "Signal failures are mitigated through alternate routing simulations.",
                "Digital Twin predicts passenger redistribution before station closures.",
                "Festival demand simulations recommend temporary fleet expansion.",
                "AI continuously evaluates thousands of operational possibilities every minute.",
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
                Simulation Summary
              </h4>

              <div
                className="
                  mt-5
                  space-y-4
                "
              >

                {[
                  ["Running Simulations", "8"],
                  ["Prediction Accuracy", "98%"],
                  ["Operational Scenarios", "24"],
                  ["Best Strategy Confidence", "97%"],
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
            {/* Passenger Flow Simulation */}

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
              Passenger Flow Simulation
            </h2>

            <p
              className="
                mt-2
                text-slate-500
              "
            >
              Simulate passenger movement across
              stations, platforms, gates, escalators,
              and interchanges to optimize capacity
              and reduce congestion before it occurs.
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
            Live Flow Simulation
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

          {/* Passenger Flow Cards */}

          <div className="xl:col-span-2 space-y-5">

            {(passengerFlow.length
              ? passengerFlow
              : [

                  {
                    id: 1,
                    station: "Rajiv Chowk",
                    density: "94%",
                    prediction: "Critical Crowd Build-up",
                    recommendation: "Open Additional Gates",
                    confidence: 99,
                    risk: "Critical",
                  },

                  {
                    id: 2,
                    station: "Kashmere Gate",
                    density: "82%",
                    prediction: "Platform Congestion",
                    recommendation: "Increase Train Frequency",
                    confidence: 97,
                    risk: "High",
                  },

                  {
                    id: 3,
                    station: "Central Secretariat",
                    density: "65%",
                    prediction: "Normal Flow",
                    recommendation: "Monitor Passenger Movement",
                    confidence: 95,
                    risk: "Medium",
                  },

                  {
                    id: 4,
                    station: "Hauz Khas",
                    density: "43%",
                    prediction: "Low Density",
                    recommendation: "Normal Operations",
                    confidence: 93,
                    risk: "Low",
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
                          ${riskStyles[station.risk].badge}
                        `}
                      >
                        {station.risk}
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
                      {station.prediction}
                    </h3>

                    <p
                      className="
                        mt-3
                        text-slate-600
                      "
                    >
                      Recommendation:
                      <span className="ml-2 font-semibold text-emerald-700">
                        {station.recommendation}
                      </span>
                    </p>

                  </div>

                  <div
                    className="
                      grid
                      gap-4
                      sm:grid-cols-2
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

                      <Activity
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
                        Crowd Density
                      </p>

                      <h4
                        className="
                          mt-2
                          font-bold
                          text-slate-900
                        "
                      >
                        {station.density}
                      </h4>

                    </div>

                    <div
                      className="
                        rounded-2xl
                        bg-cyan-50
                        p-4
                        text-center
                      "
                    >

                      <Brain
                        size={28}
                        className="mx-auto text-cyan-600"
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
                      Simulation Confidence
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
                        ${riskStyles[station.risk].progress}
                      `}
                    />

                  </div>

                </div>

              </motion.div>

            ))}

          </div>

          {/* Passenger Flow Intelligence */}

          <motion.div

            whileHover={{
              y: -5,
            }}

            className="
              rounded-3xl
              bg-gradient-to-br
              from-emerald-700
              via-teal-700
              to-cyan-700
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

              <Network
                size={34}
                className="text-emerald-200"
              />

              <h3
                className="
                  text-2xl
                  font-bold
                "
              >
                Passenger Flow Intelligence
              </h3>

            </div>

            <div
              className="
                mt-8
                space-y-5
              "
            >

              {[
                "AI predicts passenger redistribution before congestion occurs.",
                "Dynamic gate management improves station throughput.",
                "Escalator utilization is optimized during peak hours.",
                "Platform crowd density remains within safe operational limits.",
                "Passenger routing recommendations reduce waiting times by up to 18%.",
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
                    className="mt-1 text-emerald-200"
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
                Flow Simulation Metrics
              </h4>

              <div
                className="
                  mt-5
                  space-y-4
                "
              >

                {[
                  ["Average Crowd Density", "68%"],
                  ["Gate Utilization", "91%"],
                  ["Queue Reduction", "18%"],
                  ["Passenger Satisfaction", "94%"],
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
            {/* Train Scheduling Simulation */}

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
              Train Scheduling Simulation
            </h2>

            <p
              className="
                mt-2
                text-slate-500
              "
            >
              Evaluate timetable adjustments,
              platform allocation, headway optimization,
              and delay recovery using MetroFlow's
              AI-powered scheduling engine.
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
            AI Scheduling Engine
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

          {/* Scheduling Cards */}

          <div className="xl:col-span-2 space-y-5">

            {(schedules.length
              ? schedules
              : [

                  {
                    id: 1,
                    route: "Blue Line",
                    optimization: "Dynamic Headway",
                    improvement: "18%",
                    delay: "2 min",
                    confidence: 98,
                    risk: "Low",
                  },

                  {
                    id: 2,
                    route: "Yellow Line",
                    optimization: "Platform Reallocation",
                    improvement: "15%",
                    delay: "4 min",
                    confidence: 97,
                    risk: "Medium",
                  },

                  {
                    id: 3,
                    route: "Red Line",
                    optimization: "Express Service",
                    improvement: "22%",
                    delay: "1 min",
                    confidence: 99,
                    risk: "Low",
                  },

                  {
                    id: 4,
                    route: "Violet Line",
                    optimization: "Adaptive Timetable",
                    improvement: "13%",
                    delay: "5 min",
                    confidence: 95,
                    risk: "High",
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
                  y: -5,
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
                          ${riskStyles[item.risk].badge}
                        `}
                      >
                        {item.risk}
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
                        {item.route}
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
                      {item.optimization}
                    </h3>

                    <p
                      className="
                        mt-3
                        text-slate-600
                      "
                    >
                      Expected Improvement:
                      <span className="ml-2 font-semibold text-indigo-700">
                        {item.improvement}
                      </span>
                    </p>

                    <p
                      className="
                        mt-2
                        text-slate-600
                      "
                    >
                      Estimated Delay:
                      <span className="ml-2 font-semibold">
                        {item.delay}
                      </span>
                    </p>

                  </div>

                  <div
                    className="
                      grid
                      gap-4
                      sm:grid-cols-2
                    "
                  >

                    <div
                      className="
                        rounded-2xl
                        bg-indigo-50
                        p-4
                        text-center
                      "
                    >

                        <TrendingUp
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
                          Efficiency
                        </p>

                        <h4
                          className="
                            mt-2
                            font-bold
                            text-slate-900
                          "
                        >
                          {item.improvement}
                        </h4>

                    </div>

                    <div
                      className="
                        rounded-2xl
                        bg-cyan-50
                        p-4
                        text-center
                      "
                    >

                      <Brain
                        size={28}
                        className="mx-auto text-cyan-600"
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
                        {item.confidence}%
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
                      Optimization Confidence
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
                        ${riskStyles[item.risk].progress}
                      `}
                    />

                  </div>

                </div>

              </motion.div>

            ))}

          </div>

          {/* Scheduling Intelligence */}

          <motion.div

            whileHover={{
              y: -5,
            }}

            className="
              rounded-3xl
              bg-gradient-to-br
              from-indigo-700
              via-violet-700
              to-sky-700
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

              <Cpu
                size={34}
                className="text-indigo-200"
              />

              <h3
                className="
                  text-2xl
                  font-bold
                "
              >
                Scheduling Intelligence
              </h3>

            </div>

            <div
              className="
                mt-8
                space-y-5
              "
            >

              {[
                "AI dynamically adjusts train headway based on passenger demand.",
                "Platform allocation minimizes congestion during peak operations.",
                "Delay propagation is predicted before affecting adjacent lines.",
                "Fleet utilization is optimized using Digital Twin simulations.",
                "Adaptive scheduling improves punctuality and operational efficiency.",
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
                    className="mt-1 text-indigo-200"
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
                Scheduling Metrics
              </h4>

              <div
                className="
                  mt-5
                  space-y-4
                "
              >

                {[
                  ["Fleet Utilization", "96%"],
                  ["Average Headway", "3.2 min"],
                  ["Delay Reduction", "21%"],
                  ["On-Time Performance", "98.6%"],
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
            {/* Financial Simulation */}

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
              Financial Simulation
            </h2>

            <p
              className="
                mt-2
                text-slate-500
              "
            >
              Predict financial outcomes of operational
              decisions including revenue growth,
              operating costs, energy consumption,
              maintenance expenses, and overall ROI
              before implementation.
            </p>

          </div>

          <div
            className="
              rounded-full
              bg-amber-100
              px-4
              py-2
              text-sm
              font-semibold
              text-amber-700
            "
          >
            AI Financial Simulator
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

          {/* Financial Cards */}

          <div className="xl:col-span-2 space-y-5">

            {(finance.length
              ? finance
              : [

                  {
                    id: 1,
                    strategy: "Increase Peak Trains",
                    revenue: "+12%",
                    savings: "₹4.8M",
                    roi: "21%",
                    confidence: 98,
                    risk: "Low",
                  },

                  {
                    id: 2,
                    strategy: "Smart Energy Scheduling",
                    revenue: "+4%",
                    savings: "₹6.2M",
                    roi: "28%",
                    confidence: 97,
                    risk: "Low",
                  },

                  {
                    id: 3,
                    strategy: "Predictive Maintenance",
                    revenue: "+3%",
                    savings: "₹5.5M",
                    roi: "25%",
                    confidence: 96,
                    risk: "Medium",
                  },

                  {
                    id: 4,
                    strategy: "Festival Operations",
                    revenue: "+17%",
                    savings: "₹2.1M",
                    roi: "34%",
                    confidence: 95,
                    risk: "High",
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
                  y: -5,
                }}

                className="
                  rounded-3xl
                  border
                  border-slate-200
                  p-6
                  transition-all
                  hover:border-amber-200
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
                          ${riskStyles[item.risk].badge}
                        `}
                      >
                        {item.risk}
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
                        ROI {item.roi}
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
                      {item.strategy}
                    </h3>

                    <p
                      className="
                        mt-3
                        text-slate-600
                      "
                    >
                      Revenue Impact:
                      <span className="ml-2 font-semibold text-emerald-700">
                        {item.revenue}
                      </span>
                    </p>

                    <p
                      className="
                        mt-2
                        text-slate-600
                      "
                    >
                      Estimated Savings:
                      <span className="ml-2 font-semibold text-amber-700">
                        {item.savings}
                      </span>
                    </p>

                  </div>

                  <div
                    className="
                      grid
                      gap-4
                      sm:grid-cols-2
                    "
                  >

                    <div
                      className="
                        rounded-2xl
                        bg-amber-50
                        p-4
                        text-center
                      "
                    >

                      <TrendingUp
                        size={28}
                        className="mx-auto text-amber-600"
                      />

                      <p
                        className="
                          mt-2
                          text-xs
                          uppercase
                          text-slate-500
                        "
                      >
                        ROI
                      </p>

                      <h4
                        className="
                          mt-2
                          font-bold
                          text-slate-900
                        "
                      >
                        {item.roi}
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

                      <Brain
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
                      Financial Confidence
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
                        ${riskStyles[item.risk].progress}
                      `}
                    />

                  </div>

                </div>

              </motion.div>

            ))}

          </div>

          {/* Executive Financial Intelligence */}

          <motion.div

            whileHover={{
              y: -5,
            }}

            className="
              rounded-3xl
              bg-gradient-to-br
              from-amber-600
              via-orange-600
              to-red-600
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

              <Sparkles
                size={34}
                className="text-amber-100"
              />

              <h3
                className="
                  text-2xl
                  font-bold
                "
              >
                Financial Intelligence
              </h3>

            </div>

            <div
              className="
                mt-8
                space-y-5
              "
            >

              {[
                "AI recommends increasing peak-hour services for maximum revenue.",
                "Smart energy scheduling significantly lowers operating expenses.",
                "Predictive maintenance reduces unexpected repair costs.",
                "Dynamic pricing models improve long-term profitability.",
                "Digital Twin simulations optimize investments before deployment.",
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
                    className="mt-1 text-amber-100"
                  />

                  <p
                    className="
                      leading-7
                      text-orange-50
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
                Executive Financial Metrics
              </h4>

              <div
                className="
                  mt-5
                  space-y-4
                "
              >

                {[
                  ["Revenue Growth", "+12%"],
                  ["Operating Cost", "-9%"],
                  ["Energy Savings", "₹6.2M"],
                  ["Projected ROI", "28%"],
                ].map(([label, value]) => (

                  <div
                    key={label}
                    className="
                      flex
                      justify-between
                    "
                  >

                    <span className="text-orange-100">
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
            {/* Executive AI Simulation Summary */}

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
          bg-gradient-to-r
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

              <Sparkles
                size={18}
                className="text-cyan-300"
              />

              <span
                className="
                  text-sm
                  font-semibold
                "
              >
                MetroFlow Executive AI Report
              </span>

            </div>

            <h2
              className="
                mt-6
                text-4xl
                font-black
              "
            >
              Executive Simulation Summary
            </h2>

            <p
              className="
                mt-4
                max-w-3xl
                leading-8
                text-slate-300
              "
            >
              MetroFlow AI Digital Twin has analyzed
              multiple operational scenarios and
              recommends optimized scheduling,
              passenger flow management, predictive
              maintenance, and financial strategies to
              improve network resilience and passenger
              satisfaction.
            </p>

          </div>

          <motion.div

            whileHover={{
              scale: 1.05,
            }}

            className="
              rounded-3xl
              border
              border-cyan-400/30
              bg-cyan-500/20
              px-10
              py-8
              text-center
            "
          >

            <p
              className="
                text-sm
                uppercase
                tracking-widest
                text-cyan-200
              "
            >
              Overall AI Score
            </p>

            <h1
              className="
                mt-3
                text-6xl
                font-black
                text-cyan-300
              "
            >
              98
            </h1>

            <p
              className="
                mt-3
                text-slate-200
              "
            >
              Excellent Operational Readiness
            </p>

          </motion.div>

        </div>

        {/* Executive KPI Cards */}

        <div
          className="
            mt-10
            grid
            gap-5
            md:grid-cols-2
            xl:grid-cols-4
          "
        >

          {[
            {
              title: "Prediction Accuracy",
              value: "98%",
              icon: Brain,
            },

            {
              title: "Passenger Satisfaction",
              value: "95%",
              icon: Activity,
            },

            {
              title: "Network Reliability",
              value: "99.2%",
              icon: Network,
            },

            {
              title: "Projected ROI",
              value: "28%",
              icon: TrendingUp,
            },

          ].map((card) => {

            const Icon = card.icon;

            return (

              <motion.div

                key={card.title}

                whileHover={{
                  y: -6,
                }}

                className="
                  rounded-3xl
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

                    <h3
                      className="
                        mt-3
                        text-3xl
                        font-black
                      "
                    >
                      {card.value}
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

        {/* Executive Recommendations */}

        <div
          className="
            mt-10
            grid
            gap-8
            xl:grid-cols-2
          "
        >

          <div
            className="
              rounded-3xl
              bg-white/10
              p-6
              backdrop-blur-md
            "
          >

            <h3
              className="
                text-2xl
                font-bold
              "
            >
              Strategic AI Recommendations
            </h3>

            <div
              className="
                mt-6
                space-y-5
              "
            >

              {[
                "Increase train frequency during predicted peak demand periods.",
                "Use adaptive platform allocation to reduce crowd density.",
                "Deploy predictive maintenance before equipment degradation.",
                "Enable AI-driven energy optimization across the network.",
                "Run Digital Twin simulations before implementing operational changes.",
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
                    className="mt-1 text-cyan-300"
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

          </div>

          <div
            className="
              rounded-3xl
              bg-white/10
              p-6
              backdrop-blur-md
            "
          >

            <h3
              className="
                text-2xl
                font-bold
              "
            >
              Executive Assessment
            </h3>

            <div
              className="
                mt-6
                space-y-4
              "
            >

              {[
                [
                  "Operational Readiness",
                  "Excellent",
                ],

                [
                  "Digital Twin Health",
                  "98%",
                ],

                [
                  "Risk Exposure",
                  "Low",
                ],

                [
                  "Passenger Experience",
                  "Improving",
                ],

                [
                  "Infrastructure Stability",
                  "99%",
                ],

                [
                  "Financial Outlook",
                  "Positive",
                ],

                [
                  "Recommended Action",
                  "Proceed with AI Optimization",
                ],

              ].map(([label, value]) => (

                <div
                  key={label}
                  className="
                    flex
                    justify-between
                    rounded-xl
                    bg-white/5
                    px-4
                    py-3
                  "
                >

                  <span className="text-slate-300">
                    {label}
                  </span>

                  <span
                    className="
                      font-semibold
                      text-cyan-300
                    "
                  >
                    {value}
                  </span>

                </div>

              ))}

            </div>

          </div>

        </div>

        {/* Final Executive Conclusion */}

        <motion.div

          whileHover={{
            scale: 1.01,
          }}

          className="
            mt-10
            rounded-3xl
            border
            border-cyan-400/20
            bg-cyan-500/10
            p-8
          "
        >

          <h3
            className="
              text-2xl
              font-bold
            "
          >
            Executive Conclusion
          </h3>

          <p
            className="
              mt-5
              leading-8
              text-slate-200
            "
          >
            Based on AI-powered Digital Twin simulations,
            MetroFlow predicts significant improvements in
            operational efficiency, passenger movement,
            service reliability, and financial performance.
            The recommended optimization strategies reduce
            congestion, improve punctuality, increase
            infrastructure utilization, and strengthen
            network resilience while maintaining a high
            confidence level of 98%. The system is ready
            for controlled deployment and continuous
            real-time optimization.
          </p>

        </motion.div>

      </motion.div>
       </div>

  );

}

export default NetworkSimulation;