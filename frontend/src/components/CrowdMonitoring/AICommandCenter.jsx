import {
  Brain,
  AlertTriangle,
  TrendingUp,
  Activity,
  Train,
} from "lucide-react";

function AICommandCenter({ stations }) {
  const avgOccupancy =
    stations.reduce((sum, s) => sum + s.occupancy, 0) /
    stations.length;

  const busiest = [...stations].sort(
    (a, b) => b.occupancy - a.occupancy
  )[0];

  const alerts = stations.filter(
    (s) => s.crowd_level === "High"
  ).length;

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 border border-slate-200">

      <div className="flex items-center gap-3 mb-6">
        <Brain className="text-indigo-600" />
        <h2 className="text-xl font-bold">
          AI Command Center
        </h2>
      </div>

      <div className="space-y-5">

        <div className="flex justify-between">
          <span>Active Alerts</span>
          <span className="font-bold text-red-500">
            {alerts}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Busiest Station</span>
          <span className="font-bold">
            {busiest.station}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Occupancy</span>
          <span className="font-bold">
            {Math.round(avgOccupancy)}%
          </span>
        </div>

        <div>
          <div className="h-3 rounded-full bg-slate-200 overflow-hidden">

            <div
              className="h-full rounded-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"
              style={{
                width: `${avgOccupancy}%`,
              }}
            />

          </div>
        </div>

        <div className="rounded-xl bg-indigo-50 p-4">

          <div className="flex gap-2 items-center mb-2">
            <TrendingUp size={18} />
            <strong>AI Recommendation</strong>
          </div>

          <p className="text-sm text-slate-600">
            Increase train frequency on the Blue
            Line for the next 20 minutes to reduce
            congestion.
          </p>

        </div>

        <div className="rounded-xl bg-red-50 p-4">

          <div className="flex gap-2 items-center mb-2">
            <AlertTriangle size={18} />
            <strong>Risk Level</strong>
          </div>

          <div className="text-red-600 font-bold">
            HIGH
          </div>

        </div>

      </div>

    </div>
  );
}

export default AICommandCenter;