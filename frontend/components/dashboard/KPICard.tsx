import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor: string;
  borderColor: string;
  badge?: string;
}

export default function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor,
  borderColor,
  badge,
}: KPICardProps) {
  return (
    <div
      className={`bg-gradient-to-br from-slate-900 to-slate-800 border ${borderColor} rounded-xl p-6 hover:scale-[1.02] transition-all duration-300`}
    >
      <div className="flex justify-between items-center mb-5">
        <Icon className={iconColor} size={26} />

        {badge && (
          <span className="text-xs px-2 py-1 rounded-full bg-slate-700">
            {badge}
          </span>
        )}
      </div>

      <p className="text-slate-400 text-sm">
        {title}
      </p>

      <h2 className="text-3xl font-bold mt-2">
        {value}
      </h2>

      {subtitle && (
        <p className="text-xs text-slate-500 mt-3">
          {subtitle}
        </p>
      )}
    </div>
  );
}