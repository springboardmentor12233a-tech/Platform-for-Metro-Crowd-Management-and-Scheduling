import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Users,
  TrendingUp,
  Activity,
  Gauge,
} from "lucide-react";

function CrowdDensityPanel({
  busiestStations = [],
}) {

  const analytics = useMemo(() => {

    if (!busiestStations.length) {

      return {
        averageOccupancy: 0,
        averagePassengers: 0,
        totalPassengers: 0,
        criticalStations: 0,
        busyStations: 0,
        normalStations: 0,
        stations: [],
      };

    }

    const stations = busiestStations.map((station, index) => {

      const passengers =
        station.passengers ??
        station.total_passengers ??
        0;

      const occupancy = Math.min(
        Math.round((passengers / 10000) * 100),
        100
      );

      let level = "Normal";

      if (occupancy >= 80) {
        level = "Critical";
      } else if (occupancy >= 60) {
        level = "Busy";
      }

      return {
        id: index,
        ...station,
        passengers,
        occupancy,
        level,
      };

    });

    const totalPassengers = stations.reduce(
      (sum, station) => sum + station.passengers,
      0
    );

    const averagePassengers =
      Math.round(
        totalPassengers / stations.length
      );

    const averageOccupancy =
      Math.round(
        stations.reduce(
          (sum, station) =>
            sum + station.occupancy,
          0
        ) / stations.length
      );

    return {

      stations: stations.sort(
        (a, b) =>
          b.occupancy - a.occupancy
      ),

      totalPassengers,

      averagePassengers,

      averageOccupancy,

      criticalStations:
        stations.filter(
          (station) =>
            station.level === "Critical"
        ).length,

      busyStations:
        stations.filter(
          (station) =>
            station.level === "Busy"
        ).length,

      normalStations:
        stations.filter(
          (station) =>
            station.level === "Normal"
        ).length,

    };

  }, [busiestStations]);

  return (

    <section className="space-y-8">

      {/* Header */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <h2 className="text-3xl font-bold text-slate-900">
            Crowd Density Analytics
          </h2>

          <p className="mt-2 text-slate-500">
            AI-powered occupancy analysis across the metro network.
          </p>

        </div>

      </div>
            {/* ==========================
          Analytics KPI Cards
      ========================== */}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

        {/* Total Passengers */}

        <motion.div
          whileHover={{ y: -6 }}
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

              <p className="text-slate-500">
                Total Passengers
              </p>

              <h3 className="mt-3 text-4xl font-bold text-slate-900">

                {analytics.totalPassengers.toLocaleString()}

              </h3>

            </div>

            <div className="rounded-2xl bg-cyan-100 p-4">

              <Users
                size={32}
                className="text-cyan-600"
              />

            </div>

          </div>

          <p className="mt-6 text-sm text-slate-500">
            Across monitored stations
          </p>

        </motion.div>

        {/* Average Occupancy */}

        <motion.div
          whileHover={{ y: -6 }}
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

              <p className="text-slate-500">
                Average Occupancy
              </p>

              <h3 className="mt-3 text-4xl font-bold text-indigo-600">

                {analytics.averageOccupancy}%

              </h3>

            </div>

            <div className="rounded-2xl bg-indigo-100 p-4">

              <Gauge
                size={32}
                className="text-indigo-600"
              />

            </div>

          </div>

          <p className="mt-6 text-sm text-slate-500">
            Network-wide utilization
          </p>

        </motion.div>

        {/* Critical Stations */}

        <motion.div
          whileHover={{ y: -6 }}
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

              <p className="text-slate-500">
                Critical Stations
              </p>

              <h3 className="mt-3 text-4xl font-bold text-red-600">

                {analytics.criticalStations}

              </h3>

            </div>

            <div className="rounded-2xl bg-red-100 p-4">

              <Activity
                size={32}
                className="text-red-600"
              />

            </div>

          </div>

          <p className="mt-6 text-sm text-slate-500">
            Immediate attention required
          </p>

        </motion.div>

        {/* Average Passengers */}

        <motion.div
          whileHover={{ y: -6 }}
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

              <p className="text-slate-500">
                Avg. Per Station
              </p>

              <h3 className="mt-3 text-4xl font-bold text-emerald-600">

                {analytics.averagePassengers.toLocaleString()}

              </h3>

            </div>

            <div className="rounded-2xl bg-emerald-100 p-4">

              <TrendingUp
                size={32}
                className="text-emerald-600"
              />

            </div>

          </div>

          <p className="mt-6 text-sm text-slate-500">
            Average passenger load
          </p>

        </motion.div>

      </div>
            {/* ==========================
          Top Congested Stations
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
              Top Congested Stations
            </h3>

            <p className="mt-2 text-slate-500">
              Ranked by live occupancy percentage.
            </p>

          </div>

          <div className="rounded-full bg-slate-100 px-4 py-2">

            <span className="text-sm font-semibold text-slate-700">
              Top 5
            </span>

          </div>

        </div>

        <div className="mt-8 space-y-6">

          {analytics.stations
            .slice(0, 5)
            .map((station, index) => (

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
                  duration: 0.4,
                  delay: index * 0.08,
                }}
                className="
                  rounded-2xl
                  border
                  border-slate-200
                  p-6
                "
              >

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-5">

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

                      <h4 className="text-lg font-bold text-slate-900">

                        {station.station_name ||
                          station.station ||
                          station.name ||
                          "Unknown Station"}

                      </h4>

                      <p className="mt-1 text-sm text-slate-500">

                        {station.passengers.toLocaleString()} passengers

                      </p>

                    </div>

                  </div>

                  <span
                    className={`
                      rounded-full
                      px-4
                      py-2
                      text-sm
                      font-semibold
                      ${
                        station.level === "Critical"
                          ? "bg-red-100 text-red-700"
                          : station.level === "Busy"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-emerald-100 text-emerald-700"
                      }
                    `}
                  >

                    {station.level}

                  </span>

                </div>

                {/* Occupancy */}

                <div className="mt-6">

                  <div className="mb-2 flex justify-between">

                    <span className="text-sm text-slate-600">
                      Occupancy
                    </span>

                    <span className="font-semibold">

                      {station.occupancy}%

                    </span>

                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-slate-200">

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
                        duration: 0.8,
                      }}
                      className={`
                        h-full
                        rounded-full
                        ${
                          station.level === "Critical"
                            ? "bg-red-500"
                            : station.level === "Busy"
                            ? "bg-yellow-500"
                            : "bg-emerald-500"
                        }
                      `}
                    />

                  </div>

                </div>

                {/* AI Insight */}

                <div className="mt-6 rounded-2xl bg-slate-50 p-4">

                  <p className="text-sm leading-7 text-slate-600">

                    {station.level === "Critical"
                      ? "AI recommends immediate intervention by increasing train frequency and deploying crowd management staff."
                      : station.level === "Busy"
                      ? "Passenger density is rising. Continue monitoring and prepare additional operational resources."
                      : "Crowd density is within normal operating limits with no intervention currently required."}

                  </p>

                </div>

              </motion.div>

            ))}

        </div>

      </div>
            {/* ==========================
          Network Distribution Summary
      ========================== */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* Normal */}

        <motion.div
          whileHover={{ y: -5 }}
          className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6"
        >
          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-emerald-700">
                Normal Stations
              </p>

              <h3 className="mt-2 text-4xl font-bold text-emerald-700">
                {analytics.normalStations}
              </h3>

            </div>

            <div className="rounded-2xl bg-white p-3 shadow-sm">
              <Activity
                size={28}
                className="text-emerald-600"
              />
            </div>

          </div>

          <p className="mt-4 text-sm text-emerald-700">
            Operating within safe occupancy levels.
          </p>

        </motion.div>

        {/* Busy */}

        <motion.div
          whileHover={{ y: -5 }}
          className="rounded-3xl border border-yellow-200 bg-yellow-50 p-6"
        >
          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-yellow-700">
                Busy Stations
              </p>

              <h3 className="mt-2 text-4xl font-bold text-yellow-700">
                {analytics.busyStations}
              </h3>

            </div>

            <div className="rounded-2xl bg-white p-3 shadow-sm">
              <TrendingUp
                size={28}
                className="text-yellow-600"
              />
            </div>

          </div>

          <p className="mt-4 text-sm text-yellow-700">
            Passenger flow should be closely monitored.
          </p>

        </motion.div>

        {/* Critical */}

        <motion.div
          whileHover={{ y: -5 }}
          className="rounded-3xl border border-red-200 bg-red-50 p-6"
        >
          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-red-700">
                Critical Stations
              </p>

              <h3 className="mt-2 text-4xl font-bold text-red-700">
                {analytics.criticalStations}
              </h3>

            </div>

            <div className="rounded-2xl bg-white p-3 shadow-sm">
              <Users
                size={28}
                className="text-red-600"
              />
            </div>

          </div>

          <p className="mt-4 text-sm text-red-700">
            Immediate operational intervention recommended.
          </p>

        </motion.div>

      </div>

      {/* ==========================
          AI Congestion Summary
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
          to-blue-50
          p-8
          shadow-sm
        "
      >

        <div className="flex items-start gap-5">

          <div className="rounded-2xl bg-cyan-100 p-4">

            <Activity
              size={34}
              className="text-cyan-700"
            />

          </div>

          <div className="flex-1">

            <h3 className="text-2xl font-bold text-slate-900">
              AI Congestion Analysis
            </h3>

            <p className="mt-4 leading-8 text-slate-600">

              Based on current passenger distribution,
              the metro network has an average occupancy of{" "}
              <span className="font-semibold text-cyan-700">
                {analytics.averageOccupancy}%
              </span>
              . AI monitoring indicates{" "}
              <span className="font-semibold text-red-600">
                {analytics.criticalStations}
              </span>{" "}
              critical station
              {analytics.criticalStations !== 1 ? "s" : ""},
              {" "}
              <span className="font-semibold text-yellow-600">
                {analytics.busyStations}
              </span>{" "}
              busy station
              {analytics.busyStations !== 1 ? "s" : ""},
              and{" "}
              <span className="font-semibold text-emerald-600">
                {analytics.normalStations}
              </span>{" "}
              normal station
              {analytics.normalStations !== 1 ? "s" : ""}.
            </p>

            <div className="mt-6 rounded-2xl border border-cyan-200 bg-white p-5">

              <p className="text-sm leading-7 text-slate-600">

                <span className="font-semibold text-cyan-700">
                  AI Recommendation:
                </span>{" "}
                {analytics.criticalStations > 0
                  ? "Immediately increase train frequency, deploy additional station personnel, and activate crowd diversion strategies at critical locations."
                  : analytics.busyStations > 0
                  ? "Continue proactive monitoring while preparing additional operational resources during upcoming peak periods."
                  : "Passenger density remains stable across the network. Maintain standard operational schedules while continuing routine AI monitoring."}

              </p>

            </div>

          </div>

        </div>

      </motion.div>

    </section>

  );

}

export default CrowdDensityPanel;