import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function PredictionPanel({ prediction }) {
  if (!prediction) return null;
  const forecast = prediction.forecast.map((item) => ({ ...item, dateLabel: item.forecast_date.slice(5) }));
  return (
    <section className="rounded-3xl bg-white p-6 card-shadow">
      <p className="text-sm font-bold uppercase tracking-wide text-cyan-700">Milestone 2</p>
      <h2 className="text-xl font-bold text-slate-950">AI passenger demand forecasting</h2>
      <p className="text-sm text-slate-500">Model: {prediction.model_name}. {prediction.model_note}</p>
      <div className="mt-5 grid gap-6 lg:grid-cols-5">
        <div className="h-80 lg:col-span-3">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={forecast} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dateLabel" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="predicted_passengers" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-3 lg:col-span-2">
          {prediction.station_predictions.slice(0, 5).map((item) => (
            <div key={item.station_name} className="rounded-2xl border border-slate-100 p-4">
              <div className="flex justify-between gap-3">
                <p className="font-bold text-slate-950">{item.station_name}</p>
                <span className="text-sm font-bold text-cyan-700">{item.risk_level}</span>
              </div>
              <p className="mt-1 text-sm text-slate-500">Predicted load: {item.predicted_load}</p>
              <p className="mt-2 text-sm text-slate-700">{item.recommendation}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
