export default function ScheduleTable({ schedules }) {
  return (
    <div className="overflow-hidden rounded-3xl bg-white card-shadow">
      <div className="border-b border-slate-100 p-6">
        <p className="text-sm font-bold uppercase tracking-wide text-cyan-700">Milestone 2</p>
        <h2 className="text-xl font-bold text-slate-950">Train schedule management</h2>
        <p className="text-sm text-slate-500">Schedule records, delay handling, and train frequency planning.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-5 py-4">Train</th>
              <th className="px-5 py-4">Line</th>
              <th className="px-5 py-4">Route</th>
              <th className="px-5 py-4">Time</th>
              <th className="px-5 py-4">Freq.</th>
              <th className="px-5 py-4">AI freq.</th>
              <th className="px-5 py-4">Load</th>
              <th className="px-5 py-4">Delay</th>
              <th className="px-5 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {schedules.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="px-5 py-4 font-bold text-slate-950">{item.train_number}</td>
                <td className="px-5 py-4">{item.line}</td>
                <td className="px-5 py-4">{item.source_station} to {item.destination_station}</td>
                <td className="px-5 py-4">{item.departure_time} to {item.arrival_time}</td>
                <td className="px-5 py-4">{item.frequency_minutes} min</td>
                <td className="px-5 py-4">{item.recommended_frequency} min</td>
                <td className="px-5 py-4">{item.expected_load}</td>
                <td className="px-5 py-4">{item.delay_minutes} min</td>
                <td className="px-5 py-4">
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${item.status === 'Delayed' ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
