import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import StatCard from './StatCard.jsx';

export default function AnalyticsPanel({ analytics }) {
  if (!analytics) return null;
  return (
    <section className="rounded-3xl bg-white p-6 card-shadow">
      <p className="text-sm font-bold uppercase tracking-wide text-cyan-700">Milestone 3</p>
      <h2 className="text-xl font-bold text-slate-950">Analytics and operational insights</h2>
      <p className="text-sm text-slate-500">Passenger traffic analytics, station performance, congestion heatmap, and AI recommendations.</p>
      <div className="mt-5 grid gap-4 md:grid-cols-4">
        <StatCard label="Stations" value={analytics.station_count.toString()} helper="Monitored stations" />
        <StatCard label="Active alerts" value={analytics.active_alerts.toString()} helper="Open crowd or delay alerts" />
        <StatCard label="Delayed trains" value={analytics.delayed_trains.toString()} helper="Operational schedule issues" />
        <StatCard label="Predicted peak" value={analytics.predicted_peak_passengers.toLocaleString()} helper="Next forecast window" />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="h-80 rounded-2xl border border-slate-100 p-4">
          <h3 className="mb-3 font-bold text-slate-950">Station performance report</h3>
          <ResponsiveContainer width="100%" height="88%">
            <BarChart data={analytics.station_performance} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" interval={0} angle={-15} textAnchor="end" height={70} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-2xl border border-slate-100 p-4">
          <h3 className="font-bold text-slate-950">Operational insights</h3>
          <div className="mt-3 space-y-3">
            {analytics.operational_insights.map((item) => (
              <p key={item} className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-700">{item}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
