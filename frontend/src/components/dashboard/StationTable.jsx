import { motion } from "framer-motion";
import {
  TrainFront,
  Users,
  CircleCheck,
  TriangleAlert,
  Activity,
  ArrowUpRight,
} from "lucide-react";

const stations = [
  {
    rank: 1,
    name: "Rajiv Chowk",
    line: "Blue • Yellow Line",
    passengers: 308729,
    capacity: 350000,
    growth: 12.6,
    status: "Normal",
    color: "from-yellow-400 to-orange-500",
  },
  {
    rank: 2,
    name: "Noida City Centre",
    line: "Blue Line",
    passengers: 238332,
    capacity: 270000,
    growth: 8.4,
    status: "Busy",
    color: "from-slate-300 to-slate-500",
  },
  {
    rank: 3,
    name: "New Delhi",
    line: "Yellow Line",
    passengers: 162245,
    capacity: 200000,
    growth: 5.8,
    status: "Normal",
    color: "from-orange-400 to-amber-600",
  },
  {
    rank: 4,
    name: "Mandi House",
    line: "Blue • Violet Line",
    passengers: 159219,
    capacity: 180000,
    growth: 11.2,
    status: "Busy",
    color: "from-indigo-500 to-violet-600",
  },
  {
    rank: 5,
    name: "Dilshad Garden",
    line: "Red Line",
    passengers: 88415,
    capacity: 120000,
    growth: 4.1,
    status: "Normal",
    color: "from-cyan-500 to-blue-600",
  },
];

export default function StationTable() {
  return (
    <div className="bg-white rounded-[30px] border border-slate-200 shadow-xl overflow-hidden">

      {/* Header */}

      <div className="flex items-center justify-between px-8 py-6 border-b bg-white/70 backdrop-blur-xl">

        <div>

          <h2 className="text-3xl font-bold text-slate-900">
            🚉 Top Metro Stations
          </h2>

          <p className="text-slate-500 mt-1">
            Real-time passenger analytics
          </p>

        </div>

        <button className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-white font-semibold shadow-lg hover:scale-105 transition">
          View All
        </button>

      </div>

      <div className="p-6 space-y-4">

        {stations.map((station, index) => {

          const occupancy = Math.round(
            (station.passengers / station.capacity) * 100
          );

          return (

            <motion.div
              key={station.name}
              initial={{
                opacity: 0,
                y: 25,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: index * 0.08,
              }}
              whileHover={{
                y: -4,
                scale: 1.01,
              }}
              className="
              group
              rounded-3xl
              border
              border-slate-200
              bg-white
              p-6
              shadow-sm
              hover:shadow-2xl
              transition-all
              duration-300
              "
            >

              <div className="flex justify-between items-center">

                {/* Left */}

                <div className="flex items-center gap-5">

                  <div
                    className={`
                    w-16
                    h-16
                    rounded-2xl
                    bg-gradient-to-br
                    ${station.color}
                    flex
                    items-center
                    justify-center
                    text-white
                    shadow-lg
                    `}
                  >
                    <TrainFront size={28}/>
                  </div>

                  <div>

                    <div className="flex items-center gap-3">

                      <h3 className="text-xl font-bold">
                        {station.name}
                      </h3>

                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">
                        #{station.rank}
                      </span>

                    </div>

                    <p className="text-slate-500 mt-1">
                      {station.line}
                    </p>

                  </div>

                </div>

                {/* Right */}

                <div className="flex items-center gap-10">

                  <div>

                    <div className="text-sm text-slate-500">
                      Passengers
                    </div>

                    <div className="text-2xl font-bold">
                      {station.passengers.toLocaleString()}
                    </div>

                  </div>

                  <div>

                    <div className="text-sm text-slate-500">
                      Growth
                    </div>

                    <div className="flex items-center gap-2 text-green-600 font-bold">

                      <ArrowUpRight size={18}/>

                      {station.growth}%

                    </div>

                  </div>

                  <div>

                    <div className="text-sm text-slate-500 mb-2">
                      Occupancy {occupancy}%
                    </div>

                    <div className="w-48 h-3 rounded-full bg-slate-200 overflow-hidden">

                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${occupancy}%`,
                        }}
                        transition={{
                          duration: 1,
                        }}
                        className={`h-full rounded-full bg-gradient-to-r ${
                          occupancy > 90
                            ? "from-red-500 to-red-400"
                            : occupancy > 70
                            ? "from-yellow-500 to-orange-400"
                            : "from-green-500 to-emerald-400"
                        }`}
                      />

                    </div>

                  </div>

                  <div>

                    <div
                      className={`
                      px-4
                      py-2
                      rounded-full
                      flex
                      items-center
                      gap-2
                      font-semibold
                      ${
                        station.status === "Busy"
                          ? "bg-orange-100 text-orange-600"
                          : "bg-green-100 text-green-600"
                      }
                      `}
                    >

                      {station.status === "Busy"
                        ? <TriangleAlert size={18}/>
                        : <CircleCheck size={18}/>
                      }

                      {station.status}

                    </div>

                  </div>

                </div>

              </div>

              {/* Bottom */}

              <div className="mt-6 flex items-center justify-between">

                <div className="flex items-center gap-2 text-sm text-slate-500">

                  <Activity
                    size={16}
                    className="text-green-500 animate-pulse"
                  />

                  Live Monitoring Enabled

                </div>

                <div className="text-sm text-slate-400">

                  Updated just now

                </div>

              </div>

            </motion.div>

          );

        })}

      </div>

    </div>
  );
}