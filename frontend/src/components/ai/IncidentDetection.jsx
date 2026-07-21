import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  ShieldAlert,
  CircleAlert,
  Activity,
  Clock3,
  CheckCircle2,
  Sparkles,
  TrendingUp,
} from "lucide-react";

function IncidentDetection({
  incidents = [],
  anomalies = [],
  recoveryActions = [],
  analytics = [],
}) {

  const summary = useMemo(() => {

    const totalIncidents =
      incidents.length || 18;

    const criticalIncidents =
      incidents.filter(
        (item) => item.severity === "Critical"
      ).length || 4;

    const resolvedIncidents =
      incidents.filter(
        (item) => item.status === "Resolved"
      ).length || 12;

    const averageConfidence =
      incidents.length
        ? Math.round(
            incidents.reduce(
              (sum, item) =>
                sum + item.confidence,
              0
            ) / incidents.length
          )
        : 97;

    return {

      totalIncidents,

      criticalIncidents,

      resolvedIncidents,

      averageConfidence,

    };

  }, [incidents]);

  const severityStyles = {

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
          via-red-900
          to-orange-800
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

              <ShieldAlert
                size={18}
                className="text-red-300"
              />

              <span
                className="
                  text-sm
                  font-semibold
                "
              >
                AI Incident Detection
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
              Real-Time Incident Intelligence
            </h1>

            <p
              className="
                mt-5
                max-w-3xl
                leading-8
                text-slate-300
              "
            >
              MetroFlow AI continuously monitors the
              metro network using predictive analytics,
              anomaly detection, and operational data
              to identify incidents before they impact
              passenger safety and service reliability.
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
                title: "Detection Engine",
                value: "Online",
                icon: CheckCircle2,
              },

              {
                title: "Critical Alerts",
                value: summary.criticalIncidents,
                icon: ShieldAlert,
              },

              {
                title: "Active Incidents",
                value: summary.totalIncidents,
                icon: CircleAlert,
              },

              {
                title: "Last Scan",
                value: "5 sec ago",
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
                      className="text-red-300"
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
              title: "Total Incidents",
              value: summary.totalIncidents,
              icon: CircleAlert,
            },

            {
              title: "Critical Incidents",
              value: summary.criticalIncidents,
              icon: ShieldAlert,
            },

            {
              title: "Resolved Today",
              value: summary.resolvedIncidents,
              icon: CheckCircle2,
            },

            {
              title: "Detection Accuracy",
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
                    className="text-red-300"
                  />

                </div>

              </motion.div>

            );

          })}

        </div>

      </motion.div>
            {/* Incident KPI Dashboard */}

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
              Incident KPI Dashboard
            </h2>

            <p
              className="
                mt-2
                text-slate-500
              "
            >
              Live operational metrics measuring
              incident severity, response efficiency,
              and AI detection performance across
              the metro network.
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
            Live Incident Analytics
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
              title: "Average Resolution",
              value: "14 min",
              subtitle: "Recovery Time",
              icon: Clock3,
              color: "text-orange-600",
              bg: "bg-orange-50",
            },

            {
              title: "Detection Accuracy",
              value: `${summary.averageConfidence}%`,
              subtitle: "AI Prediction",
              icon: Brain,
              color: "text-indigo-600",
              bg: "bg-indigo-50",
            },

            {
              title: "Critical Incidents",
              value: summary.criticalIncidents,
              subtitle: "Immediate Action",
              icon: ShieldAlert,
              color: "text-red-600",
              bg: "bg-red-50",
            },

            {
              title: "Resolved Today",
              value: summary.resolvedIncidents,
              subtitle: "Recovered Events",
              icon: CheckCircle2,
              color: "text-emerald-600",
              bg: "bg-emerald-50",
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
                  hover:border-red-200
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

        {/* AI Incident Insights */}

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
                className="text-red-600"
              />

              <h3
                className="
                  text-xl
                  font-bold
                  text-slate-900
                "
              >
                AI Incident Insights
              </h3>

            </div>

            <div
              className="
                mt-6
                space-y-5
              "
            >

              {[
                "Signal anomalies detected before service disruption.",
                "Platform congestion likely within the next 15 minutes.",
                "Escalator health monitoring predicts maintenance requirements.",
                "Passenger flow models recommend proactive station management.",
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

          {/* Detection Performance */}

          <div
            className="
              rounded-3xl
              bg-gradient-to-br
              from-red-600
              via-orange-600
              to-amber-500
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
                Detection Performance
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
                  label: "Detection Accuracy",
                  value: 97,
                },

                {
                  label: "Response Efficiency",
                  value: 94,
                },

                {
                  label: "Recovery Success",
                  value: 96,
                },

                {
                  label: "Network Stability",
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
            {/* Live Incident Feed */}

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
              Live Incident Feed
            </h2>

            <p
              className="
                mt-2
                text-slate-500
              "
            >
              AI continuously detects operational
              incidents and prioritizes them based on
              severity, passenger impact, and recovery
              urgency.
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
            Live Detection Stream
          </div>

        </div>

        <div
          className="
            mt-10
            space-y-6
          "
        >

          {(incidents.length
            ? incidents
            : [

                {
                  id: 1,
                  severity: "Critical",
                  type: "Signal Failure",
                  station: "Rajiv Chowk",
                  detected: "2 min ago",
                  status: "Response Initiated",
                  confidence: 99,
                  impact: "Blue Line Delay",
                },

                {
                  id: 2,
                  severity: "High",
                  type: "Platform Congestion",
                  station: "Kashmere Gate",
                  detected: "5 min ago",
                  status: "Passenger Diversion",
                  confidence: 96,
                  impact: "Crowd Build-up",
                },

                {
                  id: 3,
                  severity: "Medium",
                  type: "Escalator Failure",
                  station: "Central Secretariat",
                  detected: "8 min ago",
                  status: "Maintenance Assigned",
                  confidence: 94,
                  impact: "Passenger Flow",
                },

                {
                  id: 4,
                  severity: "Low",
                  type: "Ticket Counter Queue",
                  station: "Hauz Khas",
                  detected: "12 min ago",
                  status: "Monitoring",
                  confidence: 91,
                  impact: "Minor Delay",
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
                y: -5,
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
                        ${severityStyles[incident.severity].badge}
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
                        font-medium
                        text-slate-700
                      "
                    >
                      {incident.station}
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
                    {incident.type}
                  </h3>

                  <p
                    className="
                      mt-3
                      text-slate-600
                    "
                  >
                    Current Status:
                    <span className="ml-2 font-semibold">
                      {incident.status}
                    </span>
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
                      className="mx-auto text-orange-600"
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
                      Detected
                    </p>

                    <h4
                      className="
                        mt-2
                        font-bold
                        text-slate-900
                      "
                    >
                      {incident.detected}
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
                    AI Detection Confidence
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
                      ${severityStyles[incident.severity].progress}
                    `}
                  />

                </div>

              </div>

            </motion.div>

          ))}

        </div>

      </motion.div>
            {/* AI Anomaly Detection Center */}

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
              AI Anomaly Detection Center
            </h2>

            <p
              className="
                mt-2
                text-slate-500
              "
            >
              Intelligent monitoring of infrastructure,
              sensors, CCTV systems, and operational
              telemetry to identify abnormal behaviour
              before incidents escalate.
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
            Live AI Monitoring
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

          {/* Anomaly Cards */}

          <div className="xl:col-span-2 space-y-5">

            {(anomalies.length
              ? anomalies
              : [

                  {
                    id: 1,
                    anomaly: "Signal Voltage Fluctuation",
                    source: "Blue Line Controller",
                    severity: "Critical",
                    confidence: 99,
                    status: "Immediate Investigation",
                    probability: "98%",
                  },

                  {
                    id: 2,
                    anomaly: "Platform Camera Crowd Spike",
                    source: "Rajiv Chowk CCTV",
                    severity: "High",
                    confidence: 96,
                    status: "Crowd Diversion",
                    probability: "94%",
                  },

                  {
                    id: 3,
                    anomaly: "Escalator Motor Vibration",
                    source: "Central Secretariat",
                    severity: "Medium",
                    confidence: 93,
                    status: "Maintenance Scheduled",
                    probability: "87%",
                  },

                  {
                    id: 4,
                    anomaly: "Track Temperature Increase",
                    source: "Yellow Line Sensors",
                    severity: "Low",
                    confidence: 90,
                    status: "Monitoring",
                    probability: "82%",
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
                          ${severityStyles[item.severity].badge}
                        `}
                      >
                        {item.severity}
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
                        {item.source}
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
                      {item.anomaly}
                    </h3>

                    <p
                      className="
                        mt-3
                        text-slate-600
                      "
                    >
                      {item.status}
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
                        {item.confidence}%
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

                      <Activity
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
                        Probability
                      </p>

                      <h4
                        className="
                          mt-2
                          font-bold
                          text-slate-900
                        "
                      >
                        {item.probability}
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
                      Detection Confidence
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
                        ${severityStyles[item.severity].progress}
                      `}
                    />

                  </div>

                </div>

              </motion.div>

            ))}

          </div>

          {/* AI Intelligence Panel */}

          <motion.div

            whileHover={{
              y: -5,
            }}

            className="
              rounded-3xl
              bg-gradient-to-br
              from-indigo-700
              via-blue-700
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
                AI Anomaly Intelligence
              </h3>

            </div>

            <div
              className="
                mt-8
                space-y-5
              "
            >

              {[
                "Signal controller anomalies detected before operational failure.",
                "Computer vision predicts crowd surges using CCTV analytics.",
                "IoT sensor monitoring identifies equipment degradation early.",
                "Track infrastructure health remains within safe operating limits.",
                "AI recommends preventive maintenance to avoid service disruption.",
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
                Detection Statistics
              </h4>

              <div
                className="
                  mt-5
                  space-y-4
                "
              >

                {[
                  ["AI Detection Accuracy", "97%"],
                  ["False Positives", "1.8%"],
                  ["Sensor Availability", "99.4%"],
                  ["Prediction Window", "18 min"],
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
            {/* Recovery Recommendation Center */}

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
              Recovery Recommendation Center
            </h2>

            <p
              className="
                mt-2
                text-slate-500
              "
            >
              AI evaluates every incident and recommends
              the fastest recovery strategy to minimize
              passenger disruption and restore normal
              metro operations.
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
            AI Recovery Planner
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

          {/* Recovery Cards */}

          <div className="xl:col-span-2 space-y-5">

            {(recoveryActions.length
              ? recoveryActions
              : [

                  {
                    id: 1,
                    action: "Dispatch Signal Maintenance Team",
                    priority: "Critical",
                    eta: "10 min",
                    owner: "Infrastructure Team",
                    confidence: 99,
                    impact: "Restore Blue Line Service",
                  },

                  {
                    id: 2,
                    action: "Activate Standby Train",
                    priority: "High",
                    eta: "6 min",
                    owner: "Operations Control",
                    confidence: 97,
                    impact: "Reduce Passenger Waiting",
                  },

                  {
                    id: 3,
                    action: "Redirect Passenger Flow",
                    priority: "Medium",
                    eta: "3 min",
                    owner: "Station Manager",
                    confidence: 95,
                    impact: "Reduce Platform Congestion",
                  },

                  {
                    id: 4,
                    action: "Broadcast Service Advisory",
                    priority: "Low",
                    eta: "1 min",
                    owner: "Passenger Information",
                    confidence: 92,
                    impact: "Improve Passenger Awareness",
                  },

                ]).map((item, index) => (

              <motion.div

                key={item.id}

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
                          ${severityStyles[item.priority].badge}
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
                          text-slate-700
                        "
                      >
                        {item.owner}
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
                      {item.action}
                    </h3>

                    <p
                      className="
                        mt-3
                        text-slate-600
                      "
                    >
                      {item.impact}
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

                      <Clock3
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
                      Recovery Success Probability
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
                        ${severityStyles[item.priority].progress}
                      `}
                    />

                  </div>

                </div>

              </motion.div>

            ))}

          </div>

          {/* Executive Recovery Strategy */}

          <motion.div

            whileHover={{
              y: -5,
            }}

            className="
              rounded-3xl
              bg-gradient-to-br
              from-emerald-700
              via-green-700
              to-teal-700
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
                size={32}
                className="text-emerald-200"
              />

              <h3
                className="
                  text-2xl
                  font-bold
                "
              >
                Executive Recovery Strategy
              </h3>

            </div>

            <div
              className="
                mt-8
                space-y-5
              "
            >

              {[
                "Dispatch maintenance teams immediately for critical infrastructure failures.",
                "Activate standby trains to maintain timetable reliability.",
                "Redirect passengers using dynamic station guidance systems.",
                "Issue real-time announcements across affected stations.",
                "Continuously monitor recovery progress using AI analytics.",
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
                Expected Recovery Impact
              </h4>

              <div
                className="
                  mt-5
                  space-y-4
                "
              >

                {[
                  ["Service Restoration", "96%"],
                  ["Passenger Delay Reduction", "18%"],
                  ["Operational Efficiency", "95%"],
                  ["Recovery Success", "97%"],
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
            {/* Incident Analytics Dashboard */}

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
              Incident Analytics Dashboard
            </h2>

            <p
              className="
                mt-2
                text-slate-500
              "
            >
              AI continuously evaluates incident trends,
              response efficiency, recovery performance,
              and network resilience to improve metro
              operations.
            </p>

          </div>

          <div
            className="
              rounded-full
              bg-violet-100
              px-4
              py-2
              text-sm
              font-semibold
              text-violet-700
            "
          >
            Executive Analytics
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

          {/* Analytics Cards */}

          <div className="xl:col-span-2">

            <div
              className="
                grid
                gap-6
                md:grid-cols-2
              "
            >

              {[
                {
                  title: "Average Response Time",
                  value: "8.4 min",
                  change: "-12%",
                  icon: Clock3,
                  color: "text-blue-600",
                  bg: "bg-blue-50",
                },

                {
                  title: "Resolution Success",
                  value: "96%",
                  change: "+3%",
                  icon: CheckCircle2,
                  color: "text-emerald-600",
                  bg: "bg-emerald-50",
                },

                {
                  title: "Network Availability",
                  value: "99.2%",
                  change: "+0.4%",
                  icon: Activity,
                  color: "text-indigo-600",
                  bg: "bg-indigo-50",
                },

                {
                  title: "AI Prediction Accuracy",
                  value: "97%",
                  change: "+2%",
                  icon: Brain,
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
                      y: -5,
                    }}

                    className="
                      rounded-3xl
                      border
                      border-slate-200
                      p-6
                      transition-all
                      hover:border-violet-200
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
                            font-semibold
                            text-emerald-600
                          "
                        >
                          {item.change} vs yesterday
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

            {/* Performance Metrics */}

            <div
              className="
                mt-8
                rounded-3xl
                border
                border-slate-200
                p-6
              "
            >

              <h3
                className="
                  text-xl
                  font-bold
                  text-slate-900
                "
              >
                AI Performance Metrics
              </h3>

              <div
                className="
                  mt-8
                  space-y-6
                "
              >

                {[
                  {
                    label: "Incident Detection",
                    value: 97,
                  },

                  {
                    label: "Recovery Planning",
                    value: 95,
                  },

                  {
                    label: "Response Efficiency",
                    value: 94,
                  },

                  {
                    label: "Operational Stability",
                    value: 96,
                  },

                  {
                    label: "Passenger Satisfaction",
                    value: 92,
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

                      <span className="text-slate-600">
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

                        className="
                          h-full
                          rounded-full
                          bg-gradient-to-r
                          from-violet-500
                          to-indigo-600
                        "
                      />

                    </div>

                  </div>

                ))}

              </div>

            </div>

          </div>

          {/* Executive Analytics Panel */}

          <motion.div

            whileHover={{
              y: -5,
            }}

            className="
              rounded-3xl
              bg-gradient-to-br
              from-violet-700
              via-indigo-700
              to-slate-900
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

              <TrendingUp
                size={32}
                className="text-violet-200"
              />

              <h3
                className="
                  text-2xl
                  font-bold
                "
              >
                Executive Insights
              </h3>

            </div>

            <div
              className="
                mt-8
                space-y-5
              "
            >

              {[
                "Incident frequency has decreased compared to the previous operational cycle.",
                "Average response time has improved due to predictive maintenance scheduling.",
                "AI successfully predicted most critical infrastructure anomalies before disruption.",
                "Passenger impact continues to decline through proactive operational planning.",
                "Overall network resilience remains above enterprise performance targets.",
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
                    className="mt-1 text-violet-200"
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
                Executive Metrics
              </h4>

              <div
                className="
                  mt-5
                  space-y-4
                "
              >

                {[
                  ["Critical Incident Reduction", "22%"],
                  ["Average Recovery Time", "8.4 min"],
                  ["Passenger Delay Reduction", "18%"],
                  ["AI Recommendation Success", "97%"],
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
            {/* Executive Incident Summary */}

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
          via-violet-900
          to-indigo-900
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
                className="text-violet-300"
              />

              <span
                className="
                  text-sm
                  font-semibold
                "
              >
                MetroFlow Executive Report
              </span>

            </div>

            <h2
              className="
                mt-6
                text-4xl
                font-black
              "
            >
              Executive Incident Summary
            </h2>

            <p
              className="
                mt-5
                max-w-3xl
                leading-8
                text-slate-300
              "
            >
              MetroFlow AI continuously evaluates the
              health of the metro network by combining
              operational telemetry, predictive
              analytics, infrastructure monitoring,
              and real-time passenger intelligence.
              Current operational indicators suggest
              a stable network with rapid response
              capabilities and high recovery success.
            </p>

          </div>

          <motion.div

            whileHover={{
              scale: 1.05,
            }}

            className="
              rounded-3xl
              border
              border-white/10
              bg-white/10
              p-8
              text-center
              backdrop-blur-md
            "
          >

            <p className="text-slate-300">
              Overall AI Health Score
            </p>

            <h1
              className="
                mt-4
                text-6xl
                font-black
              "
            >
              97
            </h1>

            <p
              className="
                mt-3
                text-emerald-300
                font-semibold
              "
            >
              Excellent Network Stability
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
              title: "Detection Accuracy",
              value: "97%",
              icon: Brain,
            },

            {
              title: "Recovery Success",
              value: "96%",
              icon: CheckCircle2,
            },

            {
              title: "Network Availability",
              value: "99.2%",
              icon: Activity,
            },

            {
              title: "Average Response",
              value: "8.4 min",
              icon: Clock3,
            },

          ].map((item) => {

            const Icon = item.icon;

            return (

              <motion.div

                key={item.title}

                whileHover={{
                  scale: 1.03,
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
                      {item.title}
                    </p>

                    <h3
                      className="
                        mt-3
                        text-3xl
                        font-black
                      "
                    >
                      {item.value}
                    </h3>

                  </div>

                  <Icon
                    size={34}
                    className="text-violet-300"
                  />

                </div>

              </motion.div>

            );

          })}

        </div>

        {/* Strategic Recommendations */}

        <div
          className="
            mt-10
            grid
            gap-6
            xl:grid-cols-2
          "
        >

          <div
            className="
              rounded-3xl
              bg-white/10
              p-6
            "
          >

            <h3
              className="
                text-2xl
                font-bold
              "
            >
              Strategic Recommendations
            </h3>

            <div
              className="
                mt-6
                space-y-5
              "
            >

              {[
                "Expand predictive maintenance for high-risk infrastructure assets.",
                "Increase AI-assisted monitoring at major interchange stations.",
                "Automate passenger diversion using dynamic station guidance.",
                "Deploy standby trains during forecasted demand spikes.",
                "Continue integrating IoT sensors with the AI detection engine.",
                "Enhance CCTV analytics for faster anomaly recognition.",
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
                mt-6
                leading-8
                text-slate-300
              "
            >
              MetroFlow AI indicates that the metro
              network is operating within expected
              performance thresholds. Predictive
              analytics successfully identified the
              majority of high-risk anomalies before
              they developed into critical service
              disruptions. Incident response remains
              efficient due to intelligent recovery
              planning, dynamic passenger management,
              and automated operational decision
              support.
            </p>

            <div
              className="
                mt-8
                rounded-2xl
                border
                border-emerald-400/30
                bg-emerald-500/10
                p-5
              "
            >

              <div
                className="
                  flex
                  items-start
                  gap-3
                "
              >

                <TrendingUp
                  size={28}
                  className="text-emerald-300"
                />

                <div>

                  <h4
                    className="
                      font-bold
                    "
                  >
                    Executive Assessment
                  </h4>

                  <p
                    className="
                      mt-2
                      leading-7
                      text-slate-300
                    "
                  >
                    Overall network resilience remains
                    strong. AI-driven detection,
                    predictive maintenance, and
                    intelligent recovery planning are
                    reducing operational risk while
                    improving passenger safety and
                    service reliability across the
                    metro network.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </motion.div>
       </div>

  );

}

export default IncidentDetection;