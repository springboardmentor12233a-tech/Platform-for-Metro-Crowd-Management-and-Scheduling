function badgeClass(status) {
  if (status >= 90) return 'bg-red-100 text-red-800';
  if (status >= 70) return 'bg-orange-100 text-orange-800';
  if (status >= 40) return 'bg-yellow-100 text-yellow-800';
  return 'bg-emerald-100 text-emerald-800';
}

export default function RecommendationList({ recommendations }) {
  return (
    <section className="rounded-3xl bg-white p-6 card-shadow">
      <p className="text-sm font-bold uppercase tracking-wide text-cyan-700">Milestone 2</p>
      <h2 className="text-xl font-bold text-slate-950">Frequency adjustment recommendations</h2>
      <p className="text-sm text-slate-500">AI-assisted suggestions based on station crowd load and passenger demand.</p>
      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        {recommendations.map((item) => (
          <div key={item.station_name} className="rounded-2xl border border-slate-100 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-bold text-slate-950">{item.station_name}</p>
                <p className="text-sm text-slate-500">{item.line} | Load {item.current_load}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${badgeClass(item.crowd_percentage)}`}>{item.crowd_percentage}%</span>
            </div>
            <p className="mt-3 text-sm text-slate-600">Current: {item.current_frequency} min | Recommended: {item.recommended_frequency} min</p>
            <p className="mt-2 text-sm font-semibold text-slate-800">{item.recommendation}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
