import { Activity, ShieldCheck, AlertTriangle, Gauge } from "lucide-react";

function MetroNetwork({ stations, summary }) {
  const getColor = (level) => {
    switch (level) {
      case "High":
        return "bg-red-500";
      case "Medium":
        return "bg-yellow-400";
      default:
        return "bg-green-500";
    }
  };

  const topStations = [...stations]
    .sort((a, b) => b.occupancy - a.occupancy)
    .slice(0, 8);

  return (
    <div className="rounded-3xl bg-white shadow-lg border border-slate-200 p-6">

      {/* Header */}

      <div className="flex items-center gap-3 mb-6">
        <Activity className="text-indigo-600" size={26} />

        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Metro Network Status
          </h2>

          <p className="text-slate-500 text-sm">
            Live AI-powered network monitoring
          </p>
        </div>
      </div>

      {/* Summary */}

      <div className="grid grid-cols-3 gap-4 mb-8">

        <div className="rounded-2xl bg-emerald-50 p-4 border border-emerald-100">

          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="text-emerald-600" size={18} />
            <span className="text-sm font-semibold text-slate-700">
              Health
            </span>
          </div>

          <h3 className="text-2xl font-bold text-emerald-700">
            {summary?.network_health ?? 100}%
          </h3>

        </div>

        <div className="rounded-2xl bg-orange-50 p-4 border border-orange-100">

          <div className="flex items-center gap-2 mb-2">
            <Gauge className="text-orange-600" size={18} />
            <span className="text-sm font-semibold text-slate-700">
              Avg Occupancy
            </span>
          </div>

          <h3 className="text-2xl font-bold text-orange-600">
            {summary?.average_occupancy ?? 0}%
          </h3>

        </div>

        <div className="rounded-2xl bg-red-50 p-4 border border-red-100">

          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="text-red-600" size={18} />
            <span className="text-sm font-semibold text-slate-700">
              High Risk
            </span>
          </div>

          <h3 className="text-2xl font-bold text-red-600">
            {summary?.high_risk ?? 0}
          </h3>

        </div>

      </div>

      {/* Top Stations */}

      <div className="grid grid-cols-2 gap-5">

        {topStations.map((station) => (

          <div
            key={station.station}
            className="flex items-center justify-between rounded-xl bg-slate-50 p-4 hover:bg-slate-100 transition"
          >

            <div className="flex items-center gap-3">

              <div
                className={`w-4 h-4 rounded-full ${getColor(
                  station.crowd_level
                )} ${
                  station.crowd_level === "High"
                    ? "animate-pulse"
                    : ""
                }`}
              />

              <div>

                <p className="font-semibold text-slate-800">
                  {station.station}
                </p>

                <p className="text-xs text-slate-500">
                  {station.occupancy}% Occupancy
                </p>

              </div>

            </div>

            <span
              className={`px-3 py-1 rounded-full text-xs font-bold text-white ${getColor(
                station.crowd_level
              )}`}
            >
              {station.crowd_level}
            </span>

          </div>

        ))}

      </div>

      {/* Legend */}

      <div className="mt-8 flex items-center gap-8">

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
          <span className="text-sm">Normal</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
          <span className="text-sm">Moderate</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          <span className="text-sm">Congested</span>
        </div>

      </div>

    </div>
  );
}

export default MetroNetwork;