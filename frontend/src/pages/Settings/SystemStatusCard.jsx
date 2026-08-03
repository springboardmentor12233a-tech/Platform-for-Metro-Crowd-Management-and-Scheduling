import {
  Brain,
  Database,
  Server,
  HardDrive,
} from "lucide-react";

export default function SystemStatusCard() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

      <h3 className="text-lg font-semibold">
        System Status
      </h3>

      <div className="mt-6 space-y-5">

        <Status
          icon={Brain}
          title="AI Services"
          value="Online"
          color="text-green-600"
        />

        <Status
          icon={Database}
          title="Database"
          value="Healthy"
          color="text-green-600"
        />

        <Status
          icon={Server}
          title="Backend"
          value="Running"
          color="text-blue-600"
        />

        <Status
          icon={HardDrive}
          title="Storage"
          value="72%"
          color="text-orange-500"
        />

      </div>

    </div>
  );
}

function Status({
  icon: Icon,
  title,
  value,
  color,
}) {
  return (
    <div className="flex items-center justify-between">

      <div className="flex items-center gap-3">

        <Icon
          size={18}
          className="text-blue-600"
        />

        <span>{title}</span>

      </div>

      <span className={`font-semibold ${color}`}>
        {value}
      </span>

    </div>
  );
}