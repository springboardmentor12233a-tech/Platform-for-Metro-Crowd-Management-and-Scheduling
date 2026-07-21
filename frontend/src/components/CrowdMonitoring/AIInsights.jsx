import {
  BrainCircuit,
  ShieldCheck,
  Activity,
  MapPin,
  TriangleAlert,
  TrendingUp,
  Sparkles,
  Clock3,
} from "lucide-react";

function AIInsights({ stations, summary }) {
  const busiestStation =
    stations.length > 0
      ? [...stations].sort((a, b) => b.occupancy - a.occupancy)[0]
      : null;

  const highRiskStations = stations
    .filter((station) => station.crowd_level === "High")
    .slice(0, 3);

  const recommendation =
    busiestStation?.recommendation ||
    "Network operating normally. Continue monitoring passenger flow.";

  let prediction =
    "Passenger demand expected to remain stable over the next 15 minutes.";

  if (summary?.high_risk >= 3) {
    prediction =
      "High congestion expected within the next 15–30 minutes. Increase train frequency immediately.";
  } else if (summary?.high_risk >= 1) {
    prediction =
      "Moderate passenger growth expected during the next 20 minutes.";
  }

  const ProgressBar = ({
    value,
    color = "bg-cyan-400",
  }) => (
    <div className="mt-3 h-2 w-full rounded-full bg-slate-700 overflow-hidden">
      <div
        className={`${color} h-full rounded-full transition-all duration-700`}
        style={{
          width: `${Math.min(value ?? 0, 100)}%`,
        }}
      />
    </div>
  );

  return (
    <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 border border-slate-700 text-white shadow-2xl p-6">

      {/* Header */}

      <div className="flex items-center justify-between mb-8">

        <div className="flex items-center gap-4">

          <div className="p-3 rounded-2xl bg-cyan-500/20">

            <BrainCircuit
              className="text-cyan-400"
              size={30}
            />

          </div>

          <div>

            <h2 className="text-2xl font-bold">
              AI Operations Center
            </h2>

            <p className="text-slate-400 text-sm">
              Live operational intelligence
            </p>

          </div>

        </div>

        <Sparkles
          className="text-cyan-400"
          size={22}
        />

      </div>

      <div className="space-y-6">

        {/* Network Health */}

        <div className="rounded-2xl bg-white/5 border border-white/10 p-5">

          <div className="flex justify-between items-center">

            <div className="flex items-center gap-2">

              <ShieldCheck
                className="text-green-400"
                size={20}
              />

              <span className="font-medium">
                Network Health
              </span>

            </div>

            <span className="text-green-400 font-bold text-lg">
              {summary?.network_health ?? 100}%
            </span>

          </div>

          <ProgressBar
            value={summary?.network_health ?? 100}
            color="bg-green-400"
          />

          <p className="text-xs text-slate-400 mt-3">
            Overall operational status of the metro network.
          </p>

        </div>

        {/* AI Confidence */}

        <div className="rounded-2xl bg-white/5 border border-white/10 p-5">

          <div className="flex justify-between items-center">

            <div className="flex items-center gap-2">

              <Activity
                className="text-cyan-400"
                size={20}
              />

              <span className="font-medium">
                AI Confidence
              </span>

            </div>

            <span className="text-cyan-400 font-bold text-lg">
              {summary?.ai_confidence ?? 96}%
            </span>

          </div>

          <ProgressBar
            value={summary?.ai_confidence ?? 96}
            color="bg-cyan-400"
          />

          <p className="text-xs text-slate-400 mt-3">
            Confidence score of the prediction engine.
          </p>

        </div>

        {/* PART 2 STARTS HERE */}
                {/* ================= BUSIEST STATION ================= */}

        <div className="rounded-2xl bg-white/5 border border-white/10 p-5">

          <div className="flex items-center gap-2 mb-4">

            <MapPin
              className="text-indigo-400"
              size={20}
            />

            <span className="font-semibold">
              Busiest Station
            </span>

          </div>

          {busiestStation ? (
            <>

              <h3 className="text-2xl font-bold">
                {busiestStation.station}
              </h3>

              <p className="text-slate-400 mt-1">
                {busiestStation.passengers} Passengers
              </p>

              <div className="mt-4">

                <div className="flex justify-between text-sm">

                  <span>Occupancy</span>

                  <span className="font-semibold text-indigo-300">
                    {busiestStation.occupancy}%
                  </span>

                </div>

                <ProgressBar
                  value={busiestStation.occupancy}
                  color="bg-indigo-400"
                />

              </div>

            </>
          ) : (
            <p className="text-slate-400">
              No station data available.
            </p>
          )}

        </div>

        {/* ================= HIGH RISK STATIONS ================= */}

        <div className="rounded-2xl bg-red-500/10 border border-red-500/30 p-5">

          <div className="flex items-center gap-2 mb-4">

            <TriangleAlert
              className="text-red-400"
              size={20}
            />

            <span className="font-semibold">
              High Risk Stations
            </span>

          </div>

          {highRiskStations.length === 0 ? (

            <div className="text-slate-400 text-sm">
              No stations are currently classified as high risk.
            </div>

          ) : (

            <div className="space-y-3">

              {highRiskStations.map((station) => (

                <div
                  key={station.station}
                  className="flex justify-between items-center rounded-xl bg-white/5 px-3 py-2"
                >

                  <span>
                    {station.station}
                  </span>

                  <span className="font-semibold text-red-300">
                    {station.occupancy}%
                  </span>

                </div>

              ))}

            </div>

          )}

        </div>

        {/* ================= AI PREDICTION ================= */}

        <div className="rounded-2xl bg-amber-500/10 border border-amber-400/30 p-5">

          <div className="flex items-center gap-2 mb-3">

            <Clock3
              className="text-amber-400"
              size={20}
            />

            <span className="font-semibold">
              Crowd Prediction
            </span>

          </div>

          <p className="text-slate-300 text-sm leading-7">
            {prediction}
          </p>

        </div>

        {/* ================= AI ACTIONS ================= */}

        <div className="rounded-2xl bg-cyan-500/10 border border-cyan-500/30 p-5">

          <div className="flex items-center gap-2 mb-4">

            <TrendingUp
              className="text-cyan-400"
              size={20}
            />

            <span className="font-semibold">
              Recommended Actions
            </span>

          </div>

          <div className="space-y-3">

            <div className="flex items-start gap-3">

              <div className="w-2 h-2 rounded-full bg-green-400 mt-2"></div>

              <span className="text-slate-300 text-sm">
                {recommendation}
              </span>

            </div>

            <div className="flex items-start gap-3">

              <div className="w-2 h-2 rounded-full bg-green-400 mt-2"></div>

              <span className="text-slate-300 text-sm">
                Monitor passenger flow continuously using AI analytics.
              </span>

            </div>

            <div className="flex items-start gap-3">

              <div className="w-2 h-2 rounded-full bg-green-400 mt-2"></div>

              <span className="text-slate-300 text-sm">
                Increase platform staff deployment during peak periods.
              </span>

            </div>

            <div className="flex items-start gap-3">

              <div className="w-2 h-2 rounded-full bg-green-400 mt-2"></div>

              <span className="text-slate-300 text-sm">
                Trigger passenger announcements if congestion rises further.
              </span>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AIInsights;