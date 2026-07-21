function ScheduleKPICard({
  title,
  value,
  icon: Icon,
  color,
}) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-6">

      <div className="flex justify-between items-start">

        <div>

          <p className="text-slate-500">
            {title}
          </p>

          <h2 className="text-4xl font-bold mt-3">
            {value}
          </h2>

        </div>

        <Icon
          className={color}
          size={34}
        />

      </div>

      <div className="mt-6 h-2 rounded-full bg-slate-200 overflow-hidden">

        <div
          className={`h-full ${color.replace("text", "bg")}`}
          style={{
            width: "82%",
          }}
        />

      </div>

    </div>
  );
}

export default ScheduleKPICard;