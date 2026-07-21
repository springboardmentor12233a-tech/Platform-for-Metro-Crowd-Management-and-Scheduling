import { useMemo } from "react";

import { motion } from "framer-motion";

import {
  MapPinned,
  Users,
  AlertTriangle,
  Activity,
} from "lucide-react";

function HeatmapAnalytics({

  busiestStations = [],

  summary = {},

}) {

  const heatmapData = useMemo(() => {

    const maxPassengers =
      busiestStations.length > 0
        ? Math.max(
            ...busiestStations.map(
              station =>
                station.passengers ??
                station.total_passengers ??
                0
            )
          )
        : 1;

    return busiestStations.map((station) => {

      const passengers =
        station.passengers ??
        station.total_passengers ??
        0;

      const utilization = Math.round(
        (passengers / maxPassengers) * 100
      );

      let status = "Low";
      let color = "bg-emerald-500";

      if (utilization >= 85) {

        status = "Critical";
        color = "bg-red-500";

      } else if (utilization >= 70) {

        status = "High";
        color = "bg-orange-500";

      } else if (utilization >= 50) {

        status = "Moderate";
        color = "bg-amber-500";

      }

      return {

        station:
          station.station ??
          station.station_name ??
          station.name ??
          "Unknown Station",

        passengers,

        utilization,

        status,

        color,

      };

    });

  }, [busiestStations]);

  const networkHealth = useMemo(() => {

    if (heatmapData.length === 0)
      return 90;

    return Math.round(

      heatmapData.reduce(

        (sum, station) =>
          sum + (100 - station.utilization),

        0

      ) / heatmapData.length

    );

  }, [heatmapData]);

  return (

    <section className="mt-10 space-y-6">

      <div>

        <h2
          className="
            text-3xl
            font-bold
            text-slate-900
          "
        >
          Metro Network Heatmap
        </h2>

        <p
          className="
            mt-2
            text-slate-600
          "
        >
          Visualize crowd density,
          station utilization,
          congestion hotspots,
          and network health.
        </p>

      </div>
            {/* Network Overview KPIs */}

      <div
        className="
          grid
          gap-6
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >

        {/* Network Health */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-6
            shadow-sm
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500">
                Network Health
              </p>

              <h3 className="mt-2 text-3xl font-black text-emerald-600">
                {networkHealth}%
              </h3>

              <p className="mt-2 text-sm text-emerald-600">
                Stable Operations
              </p>

            </div>

            <div className="rounded-2xl bg-emerald-100 p-4">

              <Activity
                size={28}
                className="text-emerald-600"
              />

            </div>

          </div>

        </motion.div>

        {/* Total Passengers */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-6
            shadow-sm
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500">
                Total Passengers
              </p>

              <h3 className="mt-2 text-3xl font-black text-indigo-600">
                {(summary.total_passengers ?? 0).toLocaleString()}
              </h3>

              <p className="mt-2 text-sm text-indigo-600">
                Across Network
              </p>

            </div>

            <div className="rounded-2xl bg-indigo-100 p-4">

              <Users
                size={28}
                className="text-indigo-600"
              />

            </div>

          </div>

        </motion.div>

        {/* Active Stations */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-6
            shadow-sm
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500">
                Active Stations
              </p>

              <h3 className="mt-2 text-3xl font-black text-cyan-600">
                {heatmapData.length}
              </h3>

              <p className="mt-2 text-sm text-cyan-600">
                Currently Monitored
              </p>

            </div>

            <div className="rounded-2xl bg-cyan-100 p-4">

              <MapPinned
                size={28}
                className="text-cyan-600"
              />

            </div>

          </div>

        </motion.div>

        {/* Congestion Alerts */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-6
            shadow-sm
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500">
                Congestion Alerts
              </p>

              <h3 className="mt-2 text-3xl font-black text-red-600">
                {
                  heatmapData.filter(
                    station =>
                      station.status === "Critical"
                  ).length
                }
              </h3>

              <p className="mt-2 text-sm text-red-600">
                Critical Stations
              </p>

            </div>

            <div className="rounded-2xl bg-red-100 p-4">

              <AlertTriangle
                size={28}
                className="text-red-600"
              />

            </div>

          </div>

        </motion.div>

      </div>
            {/* Metro Heatmap */}

      <div
        className="
          grid
          gap-6
          xl:grid-cols-3
        "
      >

        {/* Heatmap Grid */}

        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.2,
          }}
          className="
            xl:col-span-2
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-6
            shadow-sm
          "
        >

          <div className="mb-6">

            <h3 className="text-xl font-bold text-slate-900">
              Station Congestion Heatmap
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Color intensity represents real-time station utilization.
            </p>

          </div>

          <div
            className="
              grid
              gap-4
              sm:grid-cols-2
              lg:grid-cols-3
            "
          >

            {heatmapData.map((station) => (

              <motion.div
                key={station.station}
                whileHover={{
                  scale: 1.03,
                }}
                transition={{
                  duration: 0.2,
                }}
                className="
                  rounded-2xl
                  border
                  border-slate-200
                  bg-slate-50
                  p-5
                  transition-all
                "
              >

                <div className="flex items-start justify-between">

                  <div>

                    <h4
                      className="
                        font-semibold
                        text-slate-900
                      "
                    >
                      {station.station}
                    </h4>

                    <p
                      className="
                        mt-1
                        text-sm
                        text-slate-500
                      "
                    >
                      {station.passengers.toLocaleString()} passengers
                    </p>

                  </div>

                  <div
                    className={`
                      h-4
                      w-4
                      rounded-full
                      ${station.color}
                    `}
                  />

                </div>

                <div className="mt-6">

                  <div className="mb-2 flex justify-between">

                    <span className="text-sm text-slate-500">
                      Utilization
                    </span>

                    <span className="font-semibold text-slate-900">
                      {station.utilization}%
                    </span>

                  </div>

                  <div className="h-3 rounded-full bg-slate-200">

                    <motion.div
                      initial={{
                        width: 0,
                      }}
                      animate={{
                        width: `${station.utilization}%`,
                      }}
                      transition={{
                        duration: 0.8,
                      }}
                      className={`
                        h-full
                        rounded-full
                        ${station.color}
                      `}
                    />

                  </div>

                </div>

                <div className="mt-5">

                  <span
                    className={`
                      inline-flex
                      rounded-full
                      px-3
                      py-1
                      text-xs
                      font-semibold
                      text-white
                      ${station.color}
                    `}
                  >
                    {station.status}
                  </span>

                </div>

              </motion.div>

            ))}

          </div>

        </motion.div>

        {/* Heatmap Legend */}

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
            delay: 0.3,
          }}
          className="
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-6
            shadow-sm
          "
        >

          <h3
            className="
              text-xl
              font-bold
              text-slate-900
            "
          >
            Heatmap Legend
          </h3>

          <p
            className="
              mt-1
              text-sm
              text-slate-500
            "
          >
            Congestion levels across the network.
          </p>

          <div className="mt-8 space-y-5">

            {[
              {
                label: "Critical",
                color: "bg-red-500",
                range: "85 - 100%",
              },
              {
                label: "High",
                color: "bg-orange-500",
                range: "70 - 84%",
              },
              {
                label: "Moderate",
                color: "bg-amber-500",
                range: "50 - 69%",
              },
              {
                label: "Low",
                color: "bg-emerald-500",
                range: "0 - 49%",
              },
            ].map((item) => (

              <div
                key={item.label}
                className="
                  flex
                  items-center
                  justify-between
                "
              >

                <div className="flex items-center gap-3">

                  <div
                    className={`
                      h-4
                      w-4
                      rounded-full
                      ${item.color}
                    `}
                  />

                  <span className="font-medium text-slate-700">
                    {item.label}
                  </span>

                </div>

                <span
                  className="
                    text-sm
                    text-slate-500
                  "
                >
                  {item.range}
                </span>

              </div>

            ))}

          </div>

        </motion.div>

      </div>
            {/* Metro Heatmap */}

      <div
        className="
          grid
          gap-6
          xl:grid-cols-3
        "
      >

        {/* Heatmap Grid */}

        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.2,
          }}
          className="
            xl:col-span-2
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-6
            shadow-sm
          "
        >

          <div className="mb-6">

            <h3 className="text-xl font-bold text-slate-900">
              Station Congestion Heatmap
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Color intensity represents real-time station utilization.
            </p>

          </div>

          <div
            className="
              grid
              gap-4
              sm:grid-cols-2
              lg:grid-cols-3
            "
          >

            {heatmapData.map((station) => (

              <motion.div
                key={station.station}
                whileHover={{
                  scale: 1.03,
                }}
                transition={{
                  duration: 0.2,
                }}
                className="
                  rounded-2xl
                  border
                  border-slate-200
                  bg-slate-50
                  p-5
                  transition-all
                "
              >

                <div className="flex items-start justify-between">

                  <div>

                    <h4
                      className="
                        font-semibold
                        text-slate-900
                      "
                    >
                      {station.station}
                    </h4>

                    <p
                      className="
                        mt-1
                        text-sm
                        text-slate-500
                      "
                    >
                      {station.passengers.toLocaleString()} passengers
                    </p>

                  </div>

                  <div
                    className={`
                      h-4
                      w-4
                      rounded-full
                      ${station.color}
                    `}
                  />

                </div>

                <div className="mt-6">

                  <div className="mb-2 flex justify-between">

                    <span className="text-sm text-slate-500">
                      Utilization
                    </span>

                    <span className="font-semibold text-slate-900">
                      {station.utilization}%
                    </span>

                  </div>

                  <div className="h-3 rounded-full bg-slate-200">

                    <motion.div
                      initial={{
                        width: 0,
                      }}
                      animate={{
                        width: `${station.utilization}%`,
                      }}
                      transition={{
                        duration: 0.8,
                      }}
                      className={`
                        h-full
                        rounded-full
                        ${station.color}
                      `}
                    />

                  </div>

                </div>

                <div className="mt-5">

                  <span
                    className={`
                      inline-flex
                      rounded-full
                      px-3
                      py-1
                      text-xs
                      font-semibold
                      text-white
                      ${station.color}
                    `}
                  >
                    {station.status}
                  </span>

                </div>

              </motion.div>

            ))}

          </div>

        </motion.div>

        {/* Heatmap Legend */}

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
            delay: 0.3,
          }}
          className="
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-6
            shadow-sm
          "
        >

          <h3
            className="
              text-xl
              font-bold
              text-slate-900
            "
          >
            Heatmap Legend
          </h3>

          <p
            className="
              mt-1
              text-sm
              text-slate-500
            "
          >
            Congestion levels across the network.
          </p>

          <div className="mt-8 space-y-5">

            {[
              {
                label: "Critical",
                color: "bg-red-500",
                range: "85 - 100%",
              },
              {
                label: "High",
                color: "bg-orange-500",
                range: "70 - 84%",
              },
              {
                label: "Moderate",
                color: "bg-amber-500",
                range: "50 - 69%",
              },
              {
                label: "Low",
                color: "bg-emerald-500",
                range: "0 - 49%",
              },
            ].map((item) => (

              <div
                key={item.label}
                className="
                  flex
                  items-center
                  justify-between
                "
              >

                <div className="flex items-center gap-3">

                  <div
                    className={`
                      h-4
                      w-4
                      rounded-full
                      ${item.color}
                    `}
                  />

                  <span className="font-medium text-slate-700">
                    {item.label}
                  </span>

                </div>

                <span
                  className="
                    text-sm
                    text-slate-500
                  "
                >
                  {item.range}
                </span>

              </div>

            ))}

          </div>

        </motion.div>

      </div>
            {/* Network Capacity Dashboard */}

      <div
        className="
          grid
          gap-6
          xl:grid-cols-2
        "
      >

        {/* Capacity Distribution */}

        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.6,
          }}
          className="
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-6
            shadow-sm
          "
        >

          <div className="flex items-center gap-3">

            <Users
              size={24}
              className="text-indigo-600"
            />

            <div>

              <h3 className="text-xl font-bold text-slate-900">
                Network Capacity
              </h3>

              <p className="text-sm text-slate-500">
                Passenger distribution across congestion levels.
              </p>

            </div>

          </div>

          <div className="mt-8 space-y-6">

            {[
              {
                label: "Low",
                count: heatmapData.filter(
                  s => s.status === "Low"
                ).length,
                color: "bg-emerald-500",
              },
              {
                label: "Moderate",
                count: heatmapData.filter(
                  s => s.status === "Moderate"
                ).length,
                color: "bg-amber-500",
              },
              {
                label: "High",
                count: heatmapData.filter(
                  s => s.status === "High"
                ).length,
                color: "bg-orange-500",
              },
              {
                label: "Critical",
                count: heatmapData.filter(
                  s => s.status === "Critical"
                ).length,
                color: "bg-red-500",
              },
            ].map((item) => (

              <div key={item.label}>

                <div className="mb-2 flex justify-between">

                  <div className="flex items-center gap-3">

                    <div
                      className={`
                        h-4
                        w-4
                        rounded-full
                        ${item.color}
                      `}
                    />

                    <span className="font-medium text-slate-700">
                      {item.label}
                    </span>

                  </div>

                  <span className="font-semibold text-slate-900">
                    {item.count} Stations
                  </span>

                </div>

                <div className="h-3 rounded-full bg-slate-200">

                  <motion.div
                    initial={{
                      width: 0,
                    }}
                    animate={{
                      width: `${
                        heatmapData.length
                          ? (item.count / heatmapData.length) * 100
                          : 0
                      }%`,
                    }}
                    transition={{
                      duration: 1,
                    }}
                    className={`
                      h-full
                      rounded-full
                      ${item.color}
                    `}
                  />

                </div>

              </div>

            ))}

          </div>

        </motion.div>

        {/* Network Status */}

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
            delay: 0.7,
          }}
          className="
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-6
            shadow-sm
          "
        >

          <div className="flex items-center gap-3">

            <MapPinned
              size={24}
              className="text-cyan-600"
            />

            <div>

              <h3 className="text-xl font-bold text-slate-900">
                Network Status
              </h3>

              <p className="text-sm text-slate-500">
                Overall operational health indicators.
              </p>

            </div>

          </div>

          <div className="mt-8 space-y-6">

            <div>

              <div className="mb-2 flex justify-between">

                <span className="text-slate-600">
                  Network Capacity
                </span>

                <span className="font-semibold">
                  {networkHealth}%
                </span>

              </div>

              <div className="h-3 rounded-full bg-slate-200">

                <motion.div
                  initial={{
                    width: 0,
                  }}
                  animate={{
                    width: `${networkHealth}%`,
                  }}
                  transition={{
                    duration: 1,
                  }}
                  className="
                    h-full
                    rounded-full
                    bg-cyan-500
                  "
                />

              </div>

            </div>

            <div>

              <div className="mb-2 flex justify-between">

                <span className="text-slate-600">
                  Service Availability
                </span>

                <span className="font-semibold">
                  99%
                </span>

              </div>

              <div className="h-3 rounded-full bg-slate-200">

                <motion.div
                  initial={{
                    width: 0,
                  }}
                  animate={{
                    width: "99%",
                  }}
                  transition={{
                    delay: 0.2,
                    duration: 1,
                  }}
                  className="
                    h-full
                    rounded-full
                    bg-emerald-500
                  "
                />

              </div>

            </div>

            <div>

              <div className="mb-2 flex justify-between">

                <span className="text-slate-600">
                  AI Monitoring Coverage
                </span>

                <span className="font-semibold">
                  100%
                </span>

              </div>

              <div className="h-3 rounded-full bg-slate-200">

                <motion.div
                  initial={{
                    width: 0,
                  }}
                  animate={{
                    width: "100%",
                  }}
                  transition={{
                    delay: 0.4,
                    duration: 1,
                  }}
                  className="
                    h-full
                    rounded-full
                    bg-indigo-500
                  "
                />

              </div>

            </div>

          </div>

          <div
            className="
              mt-8
              rounded-2xl
              border
              border-cyan-100
              bg-cyan-50
              p-5
            "
          >

            <h4 className="font-semibold text-cyan-700">
              AI Assessment
            </h4>

            <p className="mt-2 leading-7 text-slate-700">

              The metro network is operating within
              acceptable capacity limits. Most stations
              remain under moderate utilization while
              only a small number require immediate
              operational attention.

            </p>

          </div>

        </motion.div>

      </div>
    </section>

  );

}

export default HeatmapAnalytics;