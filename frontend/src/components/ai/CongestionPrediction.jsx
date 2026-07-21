import { useMemo } from "react";

import { motion } from "framer-motion";

import {
  AlertTriangle,
  TrendingUp,
  Users,
  Activity,
  Brain,
  MapPinned,
  Timer,
} from "lucide-react";

function CongestionPrediction({
  congestion = [],
  recommendations = [],
}) {
  const summary = useMemo(() => {
    const totalStations = congestion.length;

    const criticalStations = congestion.filter(
      (station) => station.risk === "Critical"
    ).length;

    const highRiskStations = congestion.filter(
      (station) => station.risk === "High"
    ).length;

    const averageOccupancy =
      congestion.length > 0
        ? Math.round(
            congestion.reduce(
              (sum, station) => sum + (station.occupancy ?? 0),
              0
            ) / congestion.length
          )
        : 67;

    const averageConfidence =
      congestion.length > 0
        ? Math.round(
            congestion.reduce(
              (sum, station) => sum + (station.confidence ?? 95),
              0
            ) / congestion.length
          )
        : 96;

    return {
      totalStations,
      criticalStations,
      highRiskStations,
      averageOccupancy,
      averageConfidence,
    };
  }, [congestion]);

  const riskStyles = {
    Low: {
      badge: "bg-emerald-100 text-emerald-700",
      progress: "bg-emerald-500",
    },
    Moderate: {
      badge: "bg-yellow-100 text-yellow-700",
      progress: "bg-yellow-500",
    },
    High: {
      badge: "bg-orange-100 text-orange-700",
      progress: "bg-orange-500",
    },
    Critical: {
      badge: "bg-red-100 text-red-700",
      progress: "bg-red-600",
    },
  };

  return (
    <section className="space-y-8">
      {/* Header */}
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
          bg-gradient-to-r
          from-red-600
          via-orange-500
          to-amber-500
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
              "
            >
              <Brain size={18} />
              <span>AI Congestion Forecast</span>
            </div>

            <h2
              className="
                mt-6
                text-4xl
                font-black
              "
            >
              Predict Passenger Congestion Before It Happens
            </h2>

            <p
              className="
                mt-5
                max-w-3xl
                text-lg
                leading-8
                text-orange-100
              "
            >
              MetroFlow AI predicts crowd movement using historical
              passenger patterns, real-time occupancy, timetable
              information, and live operational data.
            </p>
          </div>

          {/* Executive KPI Cards */}
          <div
            className="
              grid
              gap-5
              sm:grid-cols-2
              xl:grid-cols-4
            "
          >
            {/* Critical Stations */}
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
                  <p className="text-sm text-orange-100">
                    Critical Stations
                  </p>

                  <h2
                    className="
                      mt-3
                      text-4xl
                      font-black
                    "
                  >
                    {summary.criticalStations}
                  </h2>

                  <p className="mt-2 text-sm text-orange-100">
                    Immediate attention required
                  </p>
                </div>

                <div
                  className="
                    rounded-2xl
                    bg-red-500/20
                    p-4
                  "
                >
                  <AlertTriangle size={30} />
                </div>
              </div>
            </motion.div>

            {/* High Risk */}
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
                  <p className="text-sm text-orange-100">
                    High-Risk Stations
                  </p>

                  <h2
                    className="
                      mt-3
                      text-4xl
                      font-black
                    "
                  >
                    {summary.highRiskStations}
                  </h2>

                  <p className="mt-2 text-sm text-orange-100">
                    Monitor closely
                  </p>
                </div>

                <div
                  className="
                    rounded-2xl
                    bg-orange-500/20
                    p-4
                  "
                >
                  <TrendingUp size={30} />
                </div>
              </div>
            </motion.div>

            {/* Occupancy */}
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
                  <p className="text-sm text-orange-100">
                    Avg. Occupancy
                  </p>

                  <h2
                    className="
                      mt-3
                      text-4xl
                      font-black
                    "
                  >
                    {summary.averageOccupancy}%
                  </h2>

                  <p className="mt-2 text-sm text-orange-100">
                    Across all stations
                  </p>
                </div>

                <div
                  className="
                    rounded-2xl
                    bg-cyan-500/20
                    p-4
                  "
                >
                  <Users size={30} />
                </div>
              </div>
            </motion.div>

            {/* Prediction Confidence */}
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
                  <p className="text-sm text-orange-100">
                    AI Confidence
                  </p>

                  <h2
                    className="
                      mt-3
                      text-4xl
                      font-black
                    "
                  >
                    {summary.averageConfidence}%
                  </h2>

                  <p className="mt-2 text-sm text-orange-100">
                    Prediction reliability
                  </p>
                </div>

                <div
                  className="
                    rounded-2xl
                    bg-emerald-500/20
                    p-4
                  "
                >
                  <Activity size={30} />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Station Congestion Forecast */}
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
              Station Congestion Forecast
            </h3>

            <p
              className="
                mt-2
                text-slate-500
              "
            >
              AI-powered occupancy prediction for the next 30, 60 and
              90 minutes.
            </p>
          </div>

          <div
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-indigo-100
              px-4
              py-2
              text-sm
              font-semibold
              text-indigo-700
            "
          >
            <Timer size={16} />
            Live Forecast
          </div>
        </div>

        <div
          className="
            mt-8
            grid
            gap-6
            lg:grid-cols-2
          "
        >
          {(congestion.length
            ? congestion
            : [
                {
                  station: "Rajiv Chowk",
                  occupancy: 96,
                  confidence: 98,
                  risk: "Critical",
                  forecast30: 98,
                  forecast60: 100,
                  forecast90: 93,
                },
                {
                  station: "Kashmere Gate",
                  occupancy: 88,
                  confidence: 96,
                  risk: "High",
                  forecast30: 90,
                  forecast60: 92,
                  forecast90: 85,
                },
                {
                  station: "Central Secretariat",
                  occupancy: 72,
                  confidence: 95,
                  risk: "Moderate",
                  forecast30: 75,
                  forecast60: 77,
                  forecast90: 73,
                },
                {
                  station: "HUDA City Centre",
                  occupancy: 48,
                  confidence: 94,
                  risk: "Low",
                  forecast30: 52,
                  forecast60: 56,
                  forecast90: 50,
                },
              ]
          ).map((station, index) => (
            <motion.div
              key={station.station}
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
                  items-start
                  justify-between
                "
              >
                <div>
                  <div
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >
                    <MapPinned size={22} className="text-indigo-600" />

                    <h4
                      className="
                        text-xl
                        font-bold
                        text-slate-900
                      "
                    >
                      {station.station}
                    </h4>
                  </div>

                  <p
                    className="
                      mt-2
                      text-sm
                      text-slate-500
                    "
                  >
                    Current Occupancy
                  </p>
                </div>

                <span
                  className={`
                    rounded-full
                    px-4
                    py-2
                    text-sm
                    font-semibold
                    ${riskStyles[station.risk]?.badge}
                  `}
                >
                  {station.risk}
                </span>
              </div>

              {/* Occupancy */}
              <div className="mt-6">
                <div
                  className="
                    mb-2
                    flex
                    justify-between
                  "
                >
                  <span
                    className="
                      text-sm
                      text-slate-500
                    "
                  >
                    Occupancy
                  </span>

                  <span
                    className="
                      font-bold
                      text-slate-900
                    "
                  >
                    {station.occupancy}%
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
                      width: `${station.occupancy}%`,
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
                      ${riskStyles[station.risk]?.progress}
                    `}
                  />
                </div>
              </div>

              {/* Forecast */}
              <div
                className="
                  mt-8
                  grid
                  grid-cols-3
                  gap-4
                "
              >
                {[
                  {
                    label: "30 min",
                    value: station.forecast30,
                  },
                  {
                    label: "60 min",
                    value: station.forecast60,
                  },
                  {
                    label: "90 min",
                    value: station.forecast90,
                  },
                ].map((forecast) => (
                  <div
                    key={forecast.label}
                    className="
                      rounded-2xl
                      bg-slate-50
                      p-4
                      text-center
                    "
                  >
                    <p
                      className="
                        text-xs
                        uppercase
                        tracking-wide
                        text-slate-500
                      "
                    >
                      {forecast.label}
                    </p>

                    <h5
                      className="
                        mt-2
                        text-2xl
                        font-black
                        text-slate-900
                      "
                    >
                      {forecast.value}%
                    </h5>
                  </div>
                ))}
              </div>

              {/* AI Confidence */}
              <div
                className="
                  mt-6
                  flex
                  items-center
                  justify-between
                "
              >
                <span
                  className="
                    text-sm
                    text-slate-500
                  "
                >
                  AI Confidence
                </span>

                <span
                  className="
                    rounded-full
                    bg-emerald-100
                    px-3
                    py-1
                    text-sm
                    font-semibold
                    text-emerald-700
                  "
                >
                  {station.confidence}%
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* AI Network Overview */}
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
        {/* Congestion Heatmap */}
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
              items-center
              justify-between
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
                Network Congestion Heatmap
              </h3>

              <p
                className="
                  mt-2
                  text-slate-500
                "
              >
                AI detected congestion hotspots across the metro
                network.
              </p>
            </div>

            <MapPinned className="text-indigo-600" size={30} />
          </div>

          <div
            className="
              mt-8
              grid
              grid-cols-5
              gap-3
            "
          >
            {[
              96, 90, 82, 74, 62, 88, 93, 76, 64, 55, 72, 81, 69, 59,
              47, 66, 75, 57, 44, 38, 51, 62, 49, 36, 28,
            ].map((value, index) => {
              let bg = "bg-emerald-500";

              if (value >= 90) bg = "bg-red-600";
              else if (value >= 80) bg = "bg-orange-500";
              else if (value >= 65) bg = "bg-yellow-500";

              return (
                <motion.div
                  key={index}
                  initial={{
                    scale: 0,
                  }}
                  whileInView={{
                    scale: 1,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    delay: index * 0.02,
                  }}
                  whileHover={{
                    scale: 1.15,
                  }}
                  className={`
                    ${bg}
                    aspect-square
                    rounded-xl
                    cursor-pointer
                    shadow
                  `}
                  title={`${value}% Occupancy`}
                />
              );
            })}
          </div>

          <div
            className="
              mt-8
              flex
              flex-wrap
              gap-6
            "
          >
            {[
              ["Low", "bg-emerald-500"],
              ["Moderate", "bg-yellow-500"],
              ["High", "bg-orange-500"],
              ["Critical", "bg-red-600"],
            ].map(([label, color]) => (
              <div
                key={label}
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                <span
                  className={`
                    h-4
                    w-4
                    rounded-full
                    ${color}
                  `}
                />

                <span className="text-sm text-slate-600">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Network Health */}
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
          <h3
            className="
              text-2xl
              font-bold
              text-slate-900
            "
          >
            Network Health
          </h3>

          <div className="mt-8 space-y-6">
            {[
              {
                title: "Red Line",
                load: 91,
                color: "bg-red-500",
              },
              {
                title: "Blue Line",
                load: 84,
                color: "bg-orange-500",
              },
              {
                title: "Yellow Line",
                load: 76,
                color: "bg-yellow-500",
              },
              {
                title: "Green Line",
                load: 53,
                color: "bg-emerald-500",
              },
            ].map((line) => (
              <div key={line.title}>
                <div
                  className="
                    mb-2
                    flex
                    justify-between
                  "
                >
                  <span
                    className="
                      font-medium
                      text-slate-700
                    "
                  >
                    {line.title}
                  </span>

                  <span
                    className="
                      font-bold
                      text-slate-900
                    "
                  >
                    {line.load}%
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
                      width: `${line.load}%`,
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
                      ${line.color}
                    `}
                  />
                </div>
              </div>
            ))}
          </div>

          <div
            className="
              mt-10
              rounded-2xl
              bg-gradient-to-r
              from-indigo-600
              to-cyan-500
              p-6
              text-white
            "
          >
            <h4 className="font-bold">AI Hotspot Detection</h4>

            <p
              className="
                mt-3
                text-sm
                leading-7
                text-indigo-100
              "
            >
              Rajiv Chowk and Kashmere Gate are expected to experience
              significant passenger surges within the next 45 minutes.
              MetroFlow AI recommends increasing train frequency and
              deploying additional station staff.
            </p>
          </div>
        </div>
      </motion.div>

      {/* AI Prediction Timeline */}
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
              AI Prediction Timeline
            </h3>

            <p
              className="
                mt-2
                text-slate-500
              "
            >
              Forecasted passenger demand for the next 90 minutes
              based on current network conditions.
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
            Updated Every Minute
          </div>
        </div>

        <div
          className="
            mt-10
            grid
            gap-6
            lg:grid-cols-3
          "
        >
          {[
            {
              time: "30 Minutes",
              passengers: "58,200",
              congestion: "High",
              occupancy: 82,
              confidence: 98,
              recommendation: "Increase train frequency on Blue Line.",
            },
            {
              time: "60 Minutes",
              passengers: "64,800",
              congestion: "Critical",
              occupancy: 95,
              confidence: 97,
              recommendation:
                "Deploy additional station staff and open auxiliary gates.",
            },
            {
              time: "90 Minutes",
              passengers: "52,900",
              congestion: "Moderate",
              occupancy: 69,
              confidence: 95,
              recommendation: "Network expected to stabilize naturally.",
            },
          ].map((forecast, index) => (
            <motion.div
              key={forecast.time}
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
                delay: index * 0.12,
              }}
              whileHover={{
                y: -6,
              }}
              className="
                rounded-3xl
                border
                border-slate-200
                p-6
                shadow-sm
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
                <div
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >
                  <Timer size={22} className="text-indigo-600" />

                  <h4
                    className="
                      text-xl
                      font-bold
                      text-slate-900
                    "
                  >
                    {forecast.time}
                  </h4>
                </div>

                <span
                  className={`
                    rounded-full
                    px-3
                    py-1
                    text-sm
                    font-semibold
                    ${riskStyles[forecast.congestion]?.badge}
                  `}
                >
                  {forecast.congestion}
                </span>
              </div>

              <div
                className="
                  mt-8
                  space-y-5
                "
              >
                <div>
                  <p
                    className="
                      text-sm
                      text-slate-500
                    "
                  >
                    Expected Passengers
                  </p>

                  <h3
                    className="
                      mt-2
                      text-3xl
                      font-black
                      text-slate-900
                    "
                  >
                    {forecast.passengers}
                  </h3>
                </div>

                <div>
                  <div
                    className="
                      mb-2
                      flex
                      justify-between
                    "
                  >
                    <span className="text-sm text-slate-500">
                      Occupancy
                    </span>

                    <span className="font-bold">
                      {forecast.occupancy}%
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
                        width: `${forecast.occupancy}%`,
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
                        ${riskStyles[forecast.congestion]?.progress}
                      `}
                    />
                  </div>
                </div>

                <div
                  className="
                    rounded-2xl
                    bg-slate-50
                    p-4
                  "
                >
                  <p
                    className="
                      text-sm
                      text-slate-500
                    "
                  >
                    AI Recommendation
                  </p>

                  <p
                    className="
                      mt-2
                      leading-7
                      text-slate-700
                    "
                  >
                    {forecast.recommendation}
                  </p>
                </div>

                <div
                  className="
                    flex
                    items-center
                    justify-between
                  "
                >
                  <span
                    className="
                      text-sm
                      text-slate-500
                    "
                  >
                    Confidence
                  </span>

                  <span
                    className="
                      rounded-full
                      bg-emerald-100
                      px-3
                      py-1
                      text-sm
                      font-semibold
                      text-emerald-700
                    "
                  >
                    {forecast.confidence}%
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* AI Mitigation Recommendations */}
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
              AI Mitigation Recommendations
            </h3>

            <p
              className="
                mt-2
                text-slate-500
              "
            >
              Recommended operational actions generated by MetroFlow
              AI to minimize congestion before it impacts passengers.
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
            5 Active Recommendations
          </div>
        </div>

        <div
          className="
            mt-8
            space-y-5
          "
        >
          {(recommendations.length
            ? recommendations
            : [
                {
                  title: "Increase Blue Line Frequency",
                  priority: "Critical",
                  action:
                    "Add 3 additional trains during the next 60 minutes.",
                  impact: "-18% congestion",
                  confidence: 98,
                  status: "Pending",
                },
                {
                  title: "Deploy Platform Staff",
                  priority: "High",
                  action:
                    "Assign 12 additional staff to Rajiv Chowk and Kashmere Gate.",
                  impact: "-12% waiting time",
                  confidence: 96,
                  status: "Recommended",
                },
                {
                  title: "Open Auxiliary Gates",
                  priority: "High",
                  action:
                    "Open all emergency exit gates for passenger flow.",
                  impact: "+14% throughput",
                  confidence: 95,
                  status: "Pending",
                },
                {
                  title: "Optimize Train Dispatch",
                  priority: "Moderate",
                  action: "Adjust departure intervals by 90 seconds.",
                  impact: "-8% delays",
                  confidence: 94,
                  status: "Scheduled",
                },
                {
                  title: "Passenger Advisory",
                  priority: "Low",
                  action: "Notify passengers to use alternate stations.",
                  impact: "-6% platform crowd",
                  confidence: 92,
                  status: "Ready",
                },
              ]
          ).map((item, index) => (
            <motion.div
              key={item.title}
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
                scale: 1.01,
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
                <div className="flex-1">
                  <div
                    className="
                      flex
                      flex-wrap
                      items-center
                      gap-3
                    "
                  >
                    <h4
                      className="
                        text-xl
                        font-bold
                        text-slate-900
                      "
                    >
                      {item.title}
                    </h4>

                    <span
                      className={`
                        rounded-full
                        px-3
                        py-1
                        text-xs
                        font-semibold
                        ${
                          riskStyles[item.priority]?.badge ??
                          "bg-slate-100 text-slate-700"
                        }
                      `}
                    >
                      {item.priority}
                    </span>
                  </div>

                  <p
                    className="
                      mt-4
                      leading-7
                      text-slate-600
                    "
                  >
                    {item.action}
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
                      bg-slate-50
                      px-5
                      py-4
                      text-center
                    "
                  >
                    <p
                      className="
                        text-xs
                        uppercase
                        tracking-wide
                        text-slate-500
                      "
                    >
                      Impact
                    </p>

                    <h5
                      className="
                        mt-2
                        text-lg
                        font-bold
                        text-emerald-600
                      "
                    >
                      {item.impact}
                    </h5>
                  </div>

                  <div
                    className="
                      rounded-2xl
                      bg-slate-50
                      px-5
                      py-4
                      text-center
                    "
                  >
                    <p
                      className="
                        text-xs
                        uppercase
                        tracking-wide
                        text-slate-500
                      "
                    >
                      Confidence
                    </p>

                    <h5
                      className="
                        mt-2
                        text-lg
                        font-bold
                        text-indigo-600
                      "
                    >
                      {item.confidence}%
                    </h5>
                  </div>

                  <div
                    className="
                      rounded-2xl
                      bg-slate-50
                      px-5
                      py-4
                      text-center
                    "
                  >
                    <p
                      className="
                        text-xs
                        uppercase
                        tracking-wide
                        text-slate-500
                      "
                    >
                      Status
                    </p>

                    <h5
                      className="
                        mt-2
                        text-lg
                        font-bold
                        text-slate-900
                      "
                    >
                      {item.status}
                    </h5>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Executive AI Summary */}
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
          overflow-hidden
          bg-gradient-to-br
          from-slate-900
          via-indigo-900
          to-slate-900
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
              <Brain size={18} />
              <span>Executive AI Summary</span>
            </div>

            <h3
              className="
                mt-6
                text-3xl
                font-black
              "
            >
              Network Situation Overview
            </h3>

            <p
              className="
                mt-4
                max-w-3xl
                leading-8
                text-slate-300
              "
            >
              MetroFlow AI has completed a comprehensive congestion
              analysis across the metro network. Immediate
              intervention on major interchange stations is expected
              to significantly improve passenger movement during the
              upcoming peak period.
            </p>
          </div>

          <div
            className="
              rounded-3xl
              bg-white/10
              px-8
              py-6
              text-center
            "
          >
            <p className="text-slate-300">Network Risk</p>

            <h2
              className="
                mt-2
                text-5xl
                font-black
              "
            >
              78%
            </h2>

            <p
              className="
                mt-2
                text-sm
                text-orange-300
              "
            >
              Elevated
            </p>
          </div>
        </div>

        {/* Executive Metrics */}
        <div
          className="
            mt-10
            grid
            gap-6
            md:grid-cols-2
            xl:grid-cols-4
          "
        >
          <div
            className="
              rounded-3xl
              bg-white/10
              p-6
            "
          >
            <p className="text-slate-300">Peak Window</p>

            <h4
              className="
                mt-3
                text-3xl
                font-black
              "
            >
              6–8 PM
            </h4>
          </div>

          <div
            className="
              rounded-3xl
              bg-white/10
              p-6
            "
          >
            <p className="text-slate-300">Passengers Affected</p>

            <h4
              className="
                mt-3
                text-3xl
                font-black
              "
            >
              64.8K
            </h4>
          </div>

          <div
            className="
              rounded-3xl
              bg-white/10
              p-6
            "
          >
            <p className="text-slate-300">Expected Delay Reduction</p>

            <h4
              className="
                mt-3
                text-3xl
                font-black
                text-emerald-300
              "
            >
              11%
            </h4>
          </div>

          <div
            className="
              rounded-3xl
              bg-white/10
              p-6
            "
          >
            <p className="text-slate-300">Cost Saving</p>

            <h4
              className="
                mt-3
                text-3xl
                font-black
                text-cyan-300
              "
            >
              ₹2.8L
            </h4>
          </div>
        </div>

        {/* Top Congested Stations */}
        <div className="mt-10">
          <h4
            className="
              text-xl
              font-bold
            "
          >
            Highest Risk Stations
          </h4>

          <div
            className="
              mt-6
              grid
              gap-4
              lg:grid-cols-5
            "
          >
            {[
              {
                station: "Rajiv Chowk",
                load: "98%",
              },
              {
                station: "Kashmere Gate",
                load: "95%",
              },
              {
                station: "Central Secretariat",
                load: "91%",
              },
              {
                station: "New Delhi",
                load: "89%",
              },
              {
                station: "AIIMS",
                load: "85%",
              },
            ].map((station, index) => (
              <motion.div
                key={station.station}
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
                  rounded-2xl
                  bg-white/10
                  p-5
                  text-center
                "
              >
                <MapPinned
                  size={24}
                  className="
                    mx-auto
                    text-orange-300
                  "
                />

                <h5
                  className="
                    mt-4
                    font-bold
                  "
                >
                  {station.station}
                </h5>

                <p
                  className="
                    mt-2
                    text-3xl
                    font-black
                    text-red-300
                  "
                >
                  {station.load}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* AI Conclusion */}
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
            mt-10
            rounded-3xl
            border
            border-cyan-400/30
            bg-cyan-400/10
            p-8
          "
        >
          <div className="flex gap-4">
            <Brain size={36} className="text-cyan-300" />

            <div>
              <h4
                className="
                  text-2xl
                  font-bold
                "
              >
                AI Executive Conclusion
              </h4>

              <p
                className="
                  mt-4
                  max-w-5xl
                  leading-8
                  text-slate-300
                "
              >
                MetroFlow AI predicts that the network can reduce
                congestion by approximately 18%, lower average
                passenger waiting time by 11%, and improve service
                reliability through proactive scheduling, intelligent
                passenger routing, and optimized train dispatch.
                Immediate implementation of the recommended actions is
                advised before the evening peak period.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

export default CongestionPrediction;