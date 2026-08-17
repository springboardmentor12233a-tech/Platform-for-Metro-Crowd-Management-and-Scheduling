import { BellRing, Megaphone } from 'lucide-react';

function severityClass(severity) {
  const value = severity.toLowerCase();
  if (value === 'overcrowded' || value === 'high') return 'bg-red-100 text-red-800';
  if (value === 'moderate') return 'bg-orange-100 text-orange-800';
  return 'bg-emerald-100 text-emerald-800';
}

export default function AlertPanel({ alerts, updates, announcements }) {
  return (
    <section className="grid gap-6 lg:grid-cols-3">
      <div className="rounded-3xl bg-white p-6 card-shadow lg:col-span-2">
        <div className="flex items-center gap-3">
          <BellRing className="text-cyan-600" />
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-cyan-700">Milestone 3</p>
            <h2 className="text-xl font-bold text-slate-950">Alerts and real-time updates</h2>
          </div>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {alerts.slice(0, 6).map((alert) => (
            <div key={alert.id} className="rounded-2xl border border-slate-100 p-4">
              <div className="flex justify-between gap-3">
                <p className="font-bold text-slate-950">{alert.title}</p>
                <span className={`h-fit rounded-full px-3 py-1 text-xs font-bold ${severityClass(alert.severity)}`}>{alert.severity}</span>
              </div>
              <p className="mt-1 text-sm text-slate-500">{alert.station_name || 'System'} | {alert.category}</p>
              <p className="mt-2 text-sm text-slate-700">{alert.message}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-2xl bg-slate-50 p-4">
          <h3 className="font-bold text-slate-950">Live operational updates</h3>
          <div className="mt-3 space-y-2">
            {updates.slice(0, 5).map((item) => (
              <p key={item.id} className="text-sm text-slate-700"><strong>{item.update_type}</strong> | {item.line || 'Network'} | {item.message}</p>
            ))}
          </div>
        </div>
      </div>
      <div className="rounded-3xl bg-white p-6 card-shadow">
        <div className="flex items-center gap-3">
          <Megaphone className="text-cyan-600" />
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-cyan-700">Milestone 3</p>
            <h2 className="text-xl font-bold text-slate-950">Emergency announcements</h2>
          </div>
        </div>
        <div className="mt-5 space-y-3">
          {announcements.map((item) => (
            <div key={item.id} className="rounded-2xl border border-slate-100 p-4">
              <p className="font-bold text-slate-950">{item.title}</p>
              <p className="mt-1 text-sm text-slate-500">{item.priority} | {item.target_station || 'All stations'}</p>
              <p className="mt-2 text-sm text-slate-700">{item.message}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
