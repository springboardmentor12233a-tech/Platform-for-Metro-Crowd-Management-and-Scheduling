function statusClass(status) {
  const normalized = status.toLowerCase();
  if (normalized === 'overcrowded') return 'status-overcrowded';
  if (normalized === 'high') return 'status-high';
  if (normalized === 'moderate') return 'status-moderate';
  return 'status-low';
}

export default function StationTable({ stations }) {
  return (
    <div className="overflow-hidden rounded-3xl bg-white card-shadow">
      <div className="border-b border-slate-100 p-6">
        <h2 className="text-xl font-bold text-slate-950">Station wise crowd status</h2>
        <p className="text-sm text-slate-500">Latest date station load based on inbound and outbound passengers.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-6 py-4">Station</th>
              <th className="px-6 py-4">Inbound</th>
              <th className="px-6 py-4">Outbound</th>
              <th className="px-6 py-4">Load</th>
              <th className="px-6 py-4">Capacity</th>
              <th className="px-6 py-4">Crowd %</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {stations.map((station) => (
              <tr key={station.station_id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-semibold text-slate-900">{station.station_name}</td>
                <td className="px-6 py-4">{station.inbound_passengers.toLocaleString()}</td>
                <td className="px-6 py-4">{station.outbound_passengers.toLocaleString()}</td>
                <td className="px-6 py-4">{station.current_load.toLocaleString()}</td>
                <td className="px-6 py-4">{station.capacity.toLocaleString()}</td>
                <td className="px-6 py-4">{station.crowd_percentage}%</td>
                <td className="px-6 py-4">
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass(station.congestion_status)}`}>
                    {station.congestion_status}
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
