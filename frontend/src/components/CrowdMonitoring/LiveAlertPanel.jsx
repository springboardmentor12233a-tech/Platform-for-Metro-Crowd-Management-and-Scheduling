import {
  AlertTriangle,
  ShieldCheck,
  Radio,
  Clock3,
} from "lucide-react";

function LiveAlertPanel({ stations }) {
  const highStations = stations.filter(
    (station) => station.crowd_level === "High"
  );

  const mediumStations = stations.filter(
    (station) => station.crowd_level === "Medium"
  );

  return (
    <div className="rounded-3xl overflow-hidden shadow-xl mb-8">

      {/* Header */}

      <div className="bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 text-white px-6 py-5">

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">

            <AlertTriangle size={28} />

            <div>

              <h2 className="text-2xl font-bold">
                Metro Operations Alert Center
              </h2>

              <p className="text-red-100">
                AI-powered real-time operational monitoring
              </p>

            </div>

          </div>

          <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">

            <Radio className="animate-pulse" size={18} />

            <span className="font-semibold">
              LIVE
            </span>

          </div>

        </div>

      </div>

      {/* Content */}

      <div className="bg-white p-6">

        <div className="grid lg:grid-cols-3 gap-6">

          {/* Critical */}

          <div className="rounded-2xl border border-red-200 bg-red-50 p-5">

            <div className="flex items-center gap-2 mb-3">

              <AlertTriangle
                className="text-red-600"
                size={22}
              />

              <h3 className="font-bold text-red-700">
                Critical Alerts
              </h3>

            </div>

            <p className="text-4xl font-bold text-red-700">
              {highStations.length}
            </p>

            <p className="text-sm text-red-600 mt-2">
              Stations require immediate action
            </p>

          </div>

          {/* Warning */}

          <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5">

            <div className="flex items-center gap-2 mb-3">

              <AlertTriangle
                className="text-yellow-600"
                size={22}
              />

              <h3 className="font-bold text-yellow-700">
                Warning
              </h3>

            </div>

            <p className="text-4xl font-bold text-yellow-700">
              {mediumStations.length}
            </p>

            <p className="text-sm text-yellow-600 mt-2">
              Stations under observation
            </p>

          </div>

          {/* System */}

          <div className="rounded-2xl border border-green-200 bg-green-50 p-5">

            <div className="flex items-center gap-2 mb-3">

              <ShieldCheck
                className="text-green-600"
                size={22}
              />

              <h3 className="font-bold text-green-700">
                Network Health
              </h3>

            </div>

            <p className="text-4xl font-bold text-green-700">
              98%
            </p>

            <p className="text-sm text-green-600 mt-2">
              All systems operational
            </p>

          </div>

        </div>

        {/* Footer */}

        <div className="mt-6 border-t pt-5 flex flex-wrap justify-between items-center">

          <div className="flex items-center gap-3 text-slate-600">

            <Clock3 size={18} />

            <span>
              Last Updated:
            </span>

            <strong>
              {new Date().toLocaleTimeString()}
            </strong>

          </div>

          <div className="flex items-center gap-3 mt-4 lg:mt-0">

            <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>

            <span className="font-semibold text-green-700">
              AI Monitoring Active
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}

export default LiveAlertPanel;