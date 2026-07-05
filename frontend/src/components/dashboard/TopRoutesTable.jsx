import { motion } from "framer-motion";
import {
  TrainFront,
  ArrowRight,
  Users,
  TrendingUp,
} from "lucide-react";

function TopRoutesTable({ routes }) {
  const maxPassengers =
    routes.length > 0
      ? Math.max(...routes.map((r) => r.passengers))
      : 1;

  return (
    <div className="h-full flex flex-col">

      {/* Header */}

      <div className="flex items-center justify-between mb-6">

        <div>

          <h2 className="text-2xl font-bold text-slate-900">
            🚉 Top 10 Routes
          </h2>

          <p className="text-slate-500 mt-1">
            Most travelled metro routes
          </p>

        </div>

        <div className="flex items-center gap-2 rounded-full bg-green-100 px-3 py-1">

          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>

          <span className="text-sm font-medium text-green-700">
            Live
          </span>

        </div>

      </div>

      {/* Route Cards */}

      <div className="flex-1 overflow-y-auto pr-2 space-y-3">

        {routes.map((route, index) => {

          const percentage =
            (route.passengers / maxPassengers) * 100;

          const rankColor =
            index === 0
              ? "from-yellow-400 to-orange-500"
              : index === 1
              ? "from-slate-300 to-slate-500"
              : index === 2
              ? "from-orange-400 to-amber-600"
              : "from-indigo-500 to-violet-600";

          return (

            <motion.div
              key={index}
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: index * 0.05,
              }}
              whileHover={{
                scale: 1.015,
                y: -3,
              }}
              className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-4
              shadow-sm
              hover:shadow-xl
              hover:border-indigo-300
              transition-all
              duration-300
              "
            >

              <div className="flex justify-between items-start">

                {/* Left */}

                <div className="flex gap-4">

                  {/* Rank */}

                  <div
                    className={`
                    w-12
                    h-12
                    rounded-xl
                    bg-gradient-to-br
                    ${rankColor}
                    text-white
                    flex
                    items-center
                    justify-center
                    font-bold
                    shadow-md
                    `}
                  >
                    #{index + 1}
                  </div>

                  {/* Route */}

                  <div>

                    <div className="flex items-center gap-2 font-semibold text-slate-800">

                      <TrainFront
                        size={18}
                        className="text-indigo-600"
                      />

                      <span>{route.from_station}</span>

                      <ArrowRight
                        size={16}
                        className="text-slate-400"
                      />

                      <span>{route.to_station}</span>

                    </div>

                    <div className="mt-3 w-64">

                      <div className="h-2 rounded-full bg-slate-200 overflow-hidden">

                        <motion.div
                          initial={{
                            width: 0,
                          }}
                          animate={{
                            width: `${percentage}%`,
                          }}
                          transition={{
                            duration: 1,
                          }}
                          className="
                          h-full
                          rounded-full
                          bg-gradient-to-r
                          from-indigo-500
                          via-violet-500
                          to-purple-500
                          "
                        />

                      </div>

                    </div>

                  </div>

                </div>

                {/* Right */}

                <div className="text-right">

                  <div
                    className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-indigo-50
                    px-4
                    py-2
                    "
                  >

                    <Users
                      size={16}
                      className="text-indigo-600"
                    />

                    <span className="font-bold text-indigo-700">

                      {route.passengers.toLocaleString()}

                    </span>

                  </div>

                  <div className="mt-2 flex items-center justify-end gap-1 text-green-600 text-sm font-semibold">

                    <TrendingUp size={15} />

                    {(5 + (10 - index) * 0.7).toFixed(1)}%

                  </div>

                </div>

              </div>

            </motion.div>

          );

        })}

      </div>

    </div>
  );
}

export default TopRoutesTable;