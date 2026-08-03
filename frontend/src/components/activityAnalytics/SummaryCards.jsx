import {
  Activity,
  CheckCircle2,
  XCircle,
  Users,
} from "lucide-react";

function StatCard({
  title,
  value,
  icon: Icon,
  iconBg,
  iconColor,
  valueColor,
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <h2
            className={`mt-3 text-3xl font-bold ${valueColor}`}
          >
            {value.toLocaleString()}
          </h2>
        </div>

        <div
          className={`flex h-14 w-14 items-center justify-center rounded-xl ${iconBg}`}
        >
          <Icon className={`h-7 w-7 ${iconColor}`} />
        </div>

      </div>
    </div>
  );
}

export default function SummaryCards({ summary }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">

      <StatCard
        title="Total Activities"
        value={summary.total}
        icon={Activity}
        iconBg="bg-blue-100"
        iconColor="text-blue-600"
        valueColor="text-blue-700"
      />

      <StatCard
        title="Successful Actions"
        value={summary.success}
        icon={CheckCircle2}
        iconBg="bg-green-100"
        iconColor="text-green-600"
        valueColor="text-green-700"
      />

      <StatCard
        title="Failed Actions"
        value={summary.failed}
        icon={XCircle}
        iconBg="bg-red-100"
        iconColor="text-red-600"
        valueColor="text-red-700"
      />

      <StatCard
        title="Active Users"
        value={summary.activeUsers}
        icon={Users}
        iconBg="bg-purple-100"
        iconColor="text-purple-600"
        valueColor="text-purple-700"
      />

    </div>
  );
}