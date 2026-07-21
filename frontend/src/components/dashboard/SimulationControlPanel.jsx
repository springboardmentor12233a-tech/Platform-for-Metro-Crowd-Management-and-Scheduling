import {
  Activity,
  Pause,
  Play,
  RefreshCw,
  Gauge,
  Clock3,
} from "lucide-react";

import useMetro from "../../hooks/useMetro";

function SimulationControlPanel() {
  const {
    simulationRunning,
    toggleSimulation,

    simulationSpeed,
    setSimulationSpeed,

    lastUpdated,
    runSimulationCycle,
  } = useMetro();

  const speeds = [1, 2, 5];

  const formatTime = (date) => {
    if (!date) return "--:--:--";

    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900/70 backdrop-blur-xl shadow-xl p-6">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div
            className={`h-3 w-3 rounded-full ${
              simulationRunning
                ? "bg-emerald-400 animate-pulse"
                : "bg-red-500"
            }`}
          />

          <div>

            <h2 className="text-lg font-semibold text-white">
              Live Simulation
            </h2>

            <p className="text-sm text-slate-400">
              Metro Operations Engine
            </p>

          </div>

        </div>

        <div
          className={`rounded-full px-3 py-1 text-sm font-medium ${
            simulationRunning
              ? "bg-emerald-500/20 text-emerald-400"
              : "bg-red-500/20 text-red-400"
          }`}
        >
          {simulationRunning ? "LIVE" : "PAUSED"}
        </div>

      </div>
            {/* Status Cards */}

      <div className="mt-6 grid gap-4 md:grid-cols-3">

        {/* Simulation Status */}

        <div className="rounded-xl border border-slate-700 bg-slate-800/60 p-4 transition-all duration-300 hover:border-cyan-500">

          <div className="flex items-center gap-3">

            <div className="rounded-lg bg-cyan-500/20 p-3">
              <Activity className="h-5 w-5 text-cyan-400" />
            </div>

            <div>

              <p className="text-sm text-slate-400">
                Simulation
              </p>

              <h3 className="mt-1 text-lg font-semibold text-white">
                {simulationRunning ? "Running" : "Paused"}
              </h3>

            </div>

          </div>

        </div>

        {/* Speed */}

        <div className="rounded-xl border border-slate-700 bg-slate-800/60 p-4 transition-all duration-300 hover:border-purple-500">

          <div className="flex items-center gap-3">

            <div className="rounded-lg bg-purple-500/20 p-3">
              <Gauge className="h-5 w-5 text-purple-400" />
            </div>

            <div>

              <p className="text-sm text-slate-400">
                Simulation Speed
              </p>

              <h3 className="mt-1 text-lg font-semibold text-white">
                {simulationSpeed}×
              </h3>

            </div>

          </div>

        </div>

        {/* Last Updated */}

        <div className="rounded-xl border border-slate-700 bg-slate-800/60 p-4 transition-all duration-300 hover:border-emerald-500">

          <div className="flex items-center gap-3">

            <div className="rounded-lg bg-emerald-500/20 p-3">
              <Clock3 className="h-5 w-5 text-emerald-400" />
            </div>

            <div>

              <p className="text-sm text-slate-400">
                Last Updated
              </p>

              <h3 className="mt-1 text-lg font-semibold text-white">
                {formatTime(lastUpdated)}
              </h3>

            </div>

          </div>

        </div>

      </div>

      {/* Divider */}

      <div className="my-6 h-px bg-slate-700" />
            {/* Controls */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        {/* Pause / Resume */}

        <div className="flex flex-wrap gap-3">

          <button
            onClick={toggleSimulation}
            className={`flex items-center gap-2 rounded-xl px-5 py-3 font-medium transition-all duration-300 ${
              simulationRunning
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-emerald-500 hover:bg-emerald-600 text-white"
            }`}
          >
            {simulationRunning ? (
              <>
                <Pause className="h-5 w-5" />
                Pause Simulation
              </>
            ) : (
              <>
                <Play className="h-5 w-5" />
                Resume Simulation
              </>
            )}
          </button>

          <button
            onClick={runSimulationCycle}
            className="flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 font-medium text-white transition-all duration-300 hover:bg-cyan-600"
          >
            <RefreshCw className="h-5 w-5" />
            Refresh Now
          </button>

        </div>

        {/* Speed Selector */}

        <div className="flex items-center gap-3">

          <span className="text-sm font-medium text-slate-400">
            Speed
          </span>

          <div className="flex rounded-xl border border-slate-700 bg-slate-800 p-1">

            {speeds.map((speed) => (
              <button
                key={speed}
                onClick={() => setSimulationSpeed(speed)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  simulationSpeed === speed
                    ? "bg-cyan-500 text-white shadow-lg"
                    : "text-slate-300 hover:bg-slate-700"
                }`}
              >
                {speed}×
              </button>
            ))}

          </div>

        </div>

      </div>

    </div>
  );
}

export default SimulationControlPanel;