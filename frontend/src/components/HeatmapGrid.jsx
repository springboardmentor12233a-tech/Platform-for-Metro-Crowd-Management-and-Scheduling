function intensityClass(status) {
  const value = status.toLowerCase();
  if (value === 'overcrowded') return 'bg-red-100 border-red-200 text-red-900';
  if (value === 'high') return 'bg-orange-100 border-orange-200 text-orange-900';
  if (value === 'moderate') return 'bg-yellow-100 border-yellow-200 text-yellow-900';
  return 'bg-emerald-100 border-emerald-200 text-emerald-900';
}

export default function HeatmapGrid({ heatmap }) {
  return (
    <section className="rounded-3xl bg-white p-6 card-shadow">
      <h2 className="text-xl font-bold text-slate-950">Congestion heatmap</h2>
      <p className="mt-1 text-sm text-slate-500">Top station loads shown as congestion tiles.</p>
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {heatmap.map((item) => (
          <div key={item.station_name} className={`rounded-2xl border p-4 ${intensityClass(item.congestion_status)}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-bold">{item.station_name}</p>
                <p className="text-sm opacity-80">Load: {item.load.toLocaleString()}</p>
              </div>
              <span className="rounded-full bg-white/70 px-2 py-1 text-xs font-bold">{item.crowd_percentage}%</span>
            </div>
            <p className="mt-3 text-sm font-semibold">{item.congestion_status}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
