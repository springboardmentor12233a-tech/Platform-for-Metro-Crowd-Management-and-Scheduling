function TimelineLegend() {
  const items = [
    {
      label: "Running",
      color: "bg-green-500",
    },
    {
      label: "Boarding",
      color: "bg-blue-500",
    },
    {
      label: "Delayed",
      color: "bg-red-500",
    },
  ];

  return (
    <div className="flex flex-wrap gap-6">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-center gap-2"
        >
          <div className={`w-3 h-3 rounded-full ${item.color}`} />

          <span className="text-sm text-slate-600">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}

export default TimelineLegend;