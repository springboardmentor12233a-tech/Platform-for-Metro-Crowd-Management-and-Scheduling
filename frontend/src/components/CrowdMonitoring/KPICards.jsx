import {
  Users,
  AlertTriangle,
  Activity,
  Gauge,
  Train,
  Brain,
} from "lucide-react";

const iconMap = {
  passengers: Users,
  critical: AlertTriangle,
  stations: Train,
  occupancy: Gauge,
  health: Activity,
  ai: Brain,
};

function KPIBox({
  title,
  value,
  subtitle,
  icon,
  color = "bg-indigo-500",
}) {
  const Icon = iconMap[icon];

  return (
    <div className="rounded-3xl bg-white border border-slate-200 shadow-lg p-6 hover:shadow-2xl transition-all duration-300">

      <div className="flex justify-between items-start">

        <div>

          <p className="text-slate-500 text-sm">
            {title}
          </p>

          <h2 className="text-4xl font-bold mt-3 text-slate-900">
            {value}
          </h2>

          <p className="text-sm text-slate-500 mt-2">
            {subtitle}
          </p>

        </div>

        <div
          className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center shadow-lg`}
        >
          <Icon size={28} className="text-white" />
        </div>

      </div>

    </div>
  );
}

function KPICards({ stations, summary }) {

  const totalPassengers = stations.reduce(
    (sum, s) => sum + s.passengers,
    0
  );

  const criticalStations =
    summary?.high_risk ??
    stations.filter(
      (s) => s.crowd_level === "High"
    ).length;

  const averageOccupancy =
    summary?.average_occupancy ??
    (
      stations.reduce(
        (sum, s) => sum + s.occupancy,
        0
      ) / (stations.length || 1)
    ).toFixed(1);

  const networkHealth =
    summary?.network_health ?? 100;

  const aiConfidence =
    summary?.ai_confidence ?? 95;

  return (

    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-6 mb-10">

      <KPIBox
        title="Passengers"
        value={totalPassengers.toLocaleString()}
        subtitle="Latest network load"
        icon="passengers"
        color="bg-blue-600"
      />

      <KPIBox
        title="High Risk"
        value={criticalStations}
        subtitle="Critical stations"
        icon="critical"
        color="bg-red-600"
      />

      <KPIBox
        title="Stations"
        value={stations.length}
        subtitle="Under monitoring"
        icon="stations"
        color="bg-green-600"
      />

      <KPIBox
        title="Avg Occupancy"
        value={`${averageOccupancy}%`}
        subtitle="Network utilization"
        icon="occupancy"
        color="bg-orange-500"
      />

      <KPIBox
        title="Network Health"
        value={`${networkHealth}%`}
        subtitle="Operational efficiency"
        icon="health"
        color="bg-emerald-600"
      />

      <KPIBox
        title="AI Confidence"
        value={`${aiConfidence}%`}
        subtitle="Prediction reliability"
        icon="ai"
        color="bg-purple-600"
      />

    </div>

  );
}

export default KPICards;