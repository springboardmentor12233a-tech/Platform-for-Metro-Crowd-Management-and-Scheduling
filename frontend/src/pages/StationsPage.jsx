import { useState, useEffect } from 'react';
import { stationsApi } from '../services/api';
import { Train, MapPin } from 'lucide-react';

const STATUS_BADGE = { Active: 'success', Maintenance: 'warning', Closed: 'danger' };

export default function StationsPage() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    stationsApi.list().then(setStations).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-container"><div className="spinner" /><span>Loading stations…</span></div>;

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Metro Stations</h1>
        <p>All active metro stations, their capacity, and operational status</p>
      </div>

      <div className="station-grid">
        {stations.map(s => (
          <div key={s.id} className="station-card">
            <div className="station-card-header">
              <div>
                <div style={{ fontWeight: 700, fontSize: '16px' }}>{s.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '12px', marginTop: '4px' }}>
                  <MapPin size={12} /> {s.latitude.toFixed(4)}, {s.longitude.toFixed(4)}
                </div>
              </div>
              <span className="station-code-badge">{s.code}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span className={`badge badge-${STATUS_BADGE[s.status] || 'neutral'}`}>{s.status}</span>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                <Train size={13} style={{ display: 'inline', marginRight: '4px' }} />
                Cap: {s.capacity.toLocaleString()}
              </span>
            </div>

            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Added: {new Date(s.created_at).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
