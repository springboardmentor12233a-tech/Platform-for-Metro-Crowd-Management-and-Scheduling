export default function MetroOverview() {
  const stats = [
    {
      title: "Total Stations",
      value: "262",
      color: "text-cyan-400",
    },
    {
      title: "Metro Lines",
      value: "10",
      color: "text-green-400",
    },
    {
      title: "Operational",
      value: "100%",
      color: "text-emerald-400",
    },
    {
      title: "Interchanges",
      value: "24",
      color: "text-yellow-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {stats.map((item) => (
        <div
          key={item.title}
          className="bg-slate-900 border border-slate-700 rounded-xl p-6"
        >
          <p className="text-slate-400 text-sm">
            {item.title}
          </p>

          <h2 className={`text-3xl font-bold mt-2 ${item.color}`}>
            {item.value}
          </h2>
        </div>
      ))}
    </div>
  );
}