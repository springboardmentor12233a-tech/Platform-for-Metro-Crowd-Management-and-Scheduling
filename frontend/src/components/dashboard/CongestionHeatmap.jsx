import { motion } from "framer-motion";
import {
  Activity,
  Users,
  TrendingUp,
} from "lucide-react";

function CongestionHeatmap({
  busiestStations = [],
}) {
  // ==========================
  // Prepare Data
  // ==========================

  const stations = [...busiestStations]
    .map((station) => {
      const occupancy = Math.min(
        Math.round(
          (station.passengers / 320000) * 100
        ),
        100
      );

      let status = "Low";
      let color = "bg-green-500";
      let badge =
        "bg-green-100 text-green-700";

      if (occupancy >= 85) {
        status = "Critical";
        color = "bg-red-500";
        badge =
          "bg-red-100 text-red-700";
      } else if (occupancy >= 65) {
        status = "High";
        color =
          "bg-orange-500";
        badge =
          "bg-orange-100 text-orange-700";
      } else if (occupancy >= 40) {
        status = "Moderate";
        color =
          "bg-yellow-500";
        badge =
          "bg-yellow-100 text-yellow-700";
      }

      return {
        ...station,
        occupancy,
        status,
        color,
        badge,
      };
    })
    .sort(
      (a, b) =>
        b.occupancy - a.occupancy
    );

  const averageCongestion =
    stations.length === 0
      ? 0
      : Math.round(
          stations.reduce(
            (sum, station) =>
              sum + station.occupancy,
            0
          ) / stations.length
        );

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.45,
      }}
      className="
        rounded-[32px]
        border
        border-slate-200
        bg-white
        p-8
        shadow-xl
      "
    >
      {/* Header */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex items-center gap-4">

          <div
            className="
              rounded-2xl
              bg-gradient-to-br
              from-red-500
              to-orange-500
              p-4
            "
          >

            <Activity
              size={34}
              className="text-white"
            />

          </div>

          <div>

            <h2 className="text-3xl font-bold text-slate-900">
              Live Congestion Heatmap
            </h2>

            <p className="mt-2 text-slate-500">
              AI-powered passenger congestion monitoring
            </p>

          </div>

        </div>

        <div
          className="
            rounded-2xl
            bg-red-50
            px-6
            py-4
            text-center
          "
        >

          <p className="text-sm text-slate-500">
            Average Congestion
          </p>

          <h2 className="mt-1 text-3xl font-bold text-red-600">
            {averageCongestion}%
          </h2>

        </div>

      </div>

      <div className="my-8 h-px bg-slate-200" />
            {/* ==========================
          Live Congestion List
      ========================== */}

      <div className="space-y-5">

        {stations.length === 0 ? (

          <div
            className="
              rounded-3xl
              border
              border-dashed
              border-slate-300
              py-16
              text-center
            "
          >

            <Activity
              size={60}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-5 text-2xl font-bold text-slate-700">
              No Congestion Data
            </h3>

            <p className="mt-2 text-slate-500">
              Waiting for live passenger information...
            </p>

          </div>

        ) : (

          stations.map((station, index) => (

            <motion.div
              key={index}
              initial={{
                opacity: 0,
                y: 12,
              }}
              animate={{
                opacity: 1,
                y: 0,
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
                bg-white
                p-6
                shadow-sm
                transition-all
                duration-300
                hover:shadow-lg
              "
            >

              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                {/* Left */}

                <div className="flex items-center gap-5">

                  <div
                    className="
                      flex
                      h-14
                      w-14
                      items-center
                      justify-center
                      rounded-2xl
                      bg-gradient-to-br
                      from-indigo-500
                      to-violet-600
                      text-xl
                      font-bold
                      text-white
                    "
                  >
                    {index + 1}
                  </div>

                  <div>

                    <h3 className="text-xl font-bold text-slate-900">
                      {station.station}
                    </h3>

                    <div className="mt-2 flex flex-wrap items-center gap-3">

                      <div className="flex items-center gap-2 text-slate-500">

                        <Users size={16} />

                        <span className="text-sm">
                          {station.passengers.toLocaleString()} Passengers
                        </span>

                      </div>

                      <span
                        className={`
                          rounded-full
                          px-3
                          py-1
                          text-xs
                          font-semibold
                          ${station.badge}
                        `}
                      >
                        {station.status}
                      </span>

                    </div>

                  </div>

                </div>

                {/* Right */}

                <div className="w-full lg:w-[340px]">

                  <div className="mb-2 flex justify-between text-sm">

                    <span className="font-medium text-slate-600">
                      Congestion Level
                    </span>

                    <span className="font-bold text-slate-900">
                      {station.occupancy}%
                    </span>

                  </div>

                  <div
                    className="
                      h-4
                      overflow-hidden
                      rounded-full
                      bg-slate-200
                    "
                  >

                    <motion.div
                      initial={{
                        width: 0,
                      }}
                      animate={{
                        width: `${station.occupancy}%`,
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

              </div>

            </motion.div>

          ))

        )}

      </div>

      <div className="my-8 h-px bg-slate-200" />
            {/* ==========================
          Live Congestion List
      ========================== */}

      <div className="space-y-5">

        {stations.length === 0 ? (

          <div
            className="
              rounded-3xl
              border
              border-dashed
              border-slate-300
              py-16
              text-center
            "
          >

            <Activity
              size={60}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-5 text-2xl font-bold text-slate-700">
              No Congestion Data
            </h3>

            <p className="mt-2 text-slate-500">
              Waiting for live passenger information...
            </p>

          </div>

        ) : (

          stations.map((station, index) => (

            <motion.div
              key={index}
              initial={{
                opacity: 0,
                y: 12,
              }}
              animate={{
                opacity: 1,
                y: 0,
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
                bg-white
                p-6
                shadow-sm
                transition-all
                duration-300
                hover:shadow-lg
              "
            >

              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                {/* Left */}

                <div className="flex items-center gap-5">

                  <div
                    className="
                      flex
                      h-14
                      w-14
                      items-center
                      justify-center
                      rounded-2xl
                      bg-gradient-to-br
                      from-indigo-500
                      to-violet-600
                      text-xl
                      font-bold
                      text-white
                    "
                  >
                    {index + 1}
                  </div>

                  <div>

                    <h3 className="text-xl font-bold text-slate-900">
                      {station.station}
                    </h3>

                    <div className="mt-2 flex flex-wrap items-center gap-3">

                      <div className="flex items-center gap-2 text-slate-500">

                        <Users size={16} />

                        <span className="text-sm">
                          {station.passengers.toLocaleString()} Passengers
                        </span>

                      </div>

                      <span
                        className={`
                          rounded-full
                          px-3
                          py-1
                          text-xs
                          font-semibold
                          ${station.badge}
                        `}
                      >
                        {station.status}
                      </span>

                    </div>

                  </div>

                </div>

                {/* Right */}

                <div className="w-full lg:w-[340px]">

                  <div className="mb-2 flex justify-between text-sm">

                    <span className="font-medium text-slate-600">
                      Congestion Level
                    </span>

                    <span className="font-bold text-slate-900">
                      {station.occupancy}%
                    </span>

                  </div>

                  <div
                    className="
                      h-4
                      overflow-hidden
                      rounded-full
                      bg-slate-200
                    "
                  >

                    <motion.div
                      initial={{
                        width: 0,
                      }}
                      animate={{
                        width: `${station.occupancy}%`,
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

              </div>

            </motion.div>

          ))

        )}

      </div>

      <div className="my-8 h-px bg-slate-200" />
            {/* ==========================
          Live Network Insights
      ========================== */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Congestion Overview */}

        <div
          className="
            rounded-3xl
            border
            border-slate-200
            bg-gradient-to-br
            from-red-50
            to-orange-50
            p-7
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500">
                Critical Stations
              </p>

              <h2 className="mt-2 text-5xl font-bold text-red-600">

                {
                  stations.filter(
                    (station) =>
                      station.status === "Critical"
                  ).length
                }

              </h2>

            </div>

            <div className="rounded-2xl bg-red-100 p-4">

              <TrendingUp
                size={34}
                className="text-red-600"
              />

            </div>

          </div>

          <p className="mt-6 text-slate-600">
            Stations operating above
            85% occupancy.
          </p>

        </div>

        {/* High Congestion */}

        <div
          className="
            rounded-3xl
            border
            border-slate-200
            bg-gradient-to-br
            from-orange-50
            to-yellow-50
            p-7
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500">
                High Congestion
              </p>

              <h2 className="mt-2 text-5xl font-bold text-orange-600">

                {
                  stations.filter(
                    (station) =>
                      station.status === "High"
                  ).length
                }

              </h2>

            </div>

            <div className="rounded-2xl bg-orange-100 p-4">

              <Activity
                size={34}
                className="text-orange-600"
              />

            </div>

          </div>

          <p className="mt-6 text-slate-600">
            Stations between
            65% and 84% occupancy.
          </p>

        </div>

        {/* Normal Stations */}

        <div
          className="
            rounded-3xl
            border
            border-slate-200
            bg-gradient-to-br
            from-green-50
            to-emerald-50
            p-7
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500">
                Normal Stations
              </p>

              <h2 className="mt-2 text-5xl font-bold text-green-600">

                {
                  stations.filter(
                    (station) =>
                      station.status === "Low" ||
                      station.status === "Moderate"
                  ).length
                }

              </h2>

            </div>

            <div className="rounded-2xl bg-green-100 p-4">

              <Users
                size={34}
                className="text-green-600"
              />

            </div>

          </div>

          <p className="mt-6 text-slate-600">
            Operating within safe
            passenger limits.
          </p>

        </div>

      </div>

      {/* ==========================
          Footer
      ========================== */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

        {/* Risk Legend */}

        <div
          className="
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-7
            shadow-sm
          "
        >

          <h2 className="text-2xl font-bold text-slate-900">
            Congestion Legend
          </h2>

          <div className="mt-8 space-y-5">

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-4">

                <span className="h-4 w-4 rounded-full bg-red-500"></span>

                <span className="font-medium text-slate-700">
                  Critical
                </span>

              </div>

              <span className="text-slate-500">
                85% - 100%
              </span>

            </div>

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-4">

                <span className="h-4 w-4 rounded-full bg-orange-500"></span>

                <span className="font-medium text-slate-700">
                  High
                </span>

              </div>

              <span className="text-slate-500">
                65% - 84%
              </span>

            </div>

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-4">

                <span className="h-4 w-4 rounded-full bg-yellow-500"></span>

                <span className="font-medium text-slate-700">
                  Moderate
                </span>

              </div>

              <span className="text-slate-500">
                40% - 64%
              </span>

            </div>

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-4">

                <span className="h-4 w-4 rounded-full bg-green-500"></span>

                <span className="font-medium text-slate-700">
                  Low
                </span>

              </div>

              <span className="text-slate-500">
                0% - 39%
              </span>

            </div>

          </div>

        </div>

        {/* Live Monitoring */}

        <div
          className="
            rounded-3xl
            border
            border-slate-200
            bg-gradient-to-br
            from-slate-900
            via-slate-800
            to-slate-900
            p-7
            text-white
            shadow-xl
          "
        >

          <div className="flex items-center gap-3">

            <span className="h-3 w-3 rounded-full bg-green-400 animate-pulse"></span>

            <h2 className="text-2xl font-bold">
              Live Monitoring
            </h2>

          </div>

          <div className="mt-8 space-y-5">

            <div className="flex justify-between">

              <span className="text-slate-300">
                Status
              </span>

              <span className="font-semibold text-green-400">
                Active
              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-slate-300">
                Stations Monitored
              </span>

              <span className="font-semibold">
                {stations.length}
              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-slate-300">
                Average Congestion
              </span>

              <span className="font-semibold">
                {averageCongestion}%
              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-slate-300">
                Highest Congestion
              </span>

              <span className="font-semibold">

                {stations.length
                  ? `${stations[0].occupancy}%`
                  : "--"}

              </span>

            </div>

          </div>

          <div
            className="
              mt-8
              rounded-2xl
              border
              border-white/10
              bg-white/5
              p-5
            "
          >

            <p className="text-sm leading-7 text-slate-300">

              MetroFlow continuously analyzes passenger traffic and
              congestion trends in real time. Stations with sustained
              high occupancy should be prioritized for operational
              adjustments and additional train scheduling.

            </p>

          </div>

        </div>

      </div>

    </motion.section>
  );
}

export default CongestionHeatmap;