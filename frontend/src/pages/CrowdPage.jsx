import { useState, useEffect } from 'react';
import { stationsApi, crowdApi } from '../services/api';
import { Train, Zap, Info } from 'lucide-react';

const WEATHER_OPTIONS = ['Clear', 'Rainy', 'Snowy', 'Stormy'];

export default function CrowdPage() {
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [forecast24h, setForecast24h] = useState([]);
  const [singleForecast, setSingleForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [forecasting, setForecasting] = useState(false);
  const [form, setForm] = useState({
    station_code: '',
    hour_of_day: new Date().getHours(),
    day_of_week: new Date().getDay(),
    month: new Date().getMonth() + 1,
    is_holiday: false,
    is_special_event: false,
    weather: 'Clear',
    lag_passenger_count: 500,
  });

  useEffect(() => {
    stationsApi.list().then(data => {
      setStations(data);
      if (data.length > 0) {
        setSelectedStation(data[0]);
        setForm(f => ({ ...f, station_code: data[0].code, lag_passenger_count: Math.floor(data[0].capacity * 0.3) }));
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedStation) {
      crowdApi.forecast24h(selectedStation.id).then(setForecast24h).catch(console.error);
    }
  }, [selectedStation]);

  const handleForecast = async (e) => {
    e.preventDefault();
    setForecasting(true);
    try {
      const result = await crowdApi.forecast(form);
      setSingleForecast(result);
    } catch (err) {
      console.error(err);
    } finally {
      setForecasting(false);
    }
  };

  const levelColor = (level) => {
    const m = { Overcrowded: 'danger', Busy: 'warning', Moderate: 'info', Low: 'success' };
    return m[level] || 'neutral';
  };

  if (loading) return <div className="loading-container"><div className="spinner" /><span>Loading stations…</span></div>;

  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Crowd Intelligence</h1>
        <p>Real-time monitoring and 24-hour ML-powered crowd density forecasting</p>
      </div>

      <div className="grid-2" style={{ marginBottom: '24px' }}>
        {/* 24h Forecast Panel */}
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <div className="card-title">24-Hour Crowd Forecast</div>
              <div className="card-subtitle">ML-predicted hourly station occupancy</div>
            </div>
            <select
              className="form-select"
              style={{ width: 'auto' }}
              value={selectedStation?.id || ''}
              onChange={(e) => {
                const s = stations.find(st => st.id === e.target.value);
                setSelectedStation(s);
              }}
            >
              {stations.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="forecast-grid">
            {forecast24h.map((f, i) => {
              const h = (new Date().getHours() + i + 1) % 24;
              return (
                <div key={i} className={`forecast-hour-card ${f.crowd_level.toLowerCase()}`}>
                  <div className="forecast-hour">{h.toString().padStart(2, '0')}:00</div>
                  <div className="forecast-count">{f.predicted_passenger_count.toLocaleString()}</div>
                  <div className={`forecast-level badge badge-${levelColor(f.crowd_level)}`} style={{ margin: '4px auto 0', display: 'inline-flex' }}>
                    {f.crowd_level}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {(f.predicted_occupancy_ratio * 100).toFixed(0)}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid-2">
        {/* Manual Forecast Form */}
        <div className="card">
          <div className="card-title"><Zap size={16} style={{ display: 'inline', marginRight: '6px' }} />Custom Prediction</div>
          <div className="card-subtitle">Forecast crowd density for any scenario</div>
          <form onSubmit={handleForecast}>
            <div className="form-group">
              <label className="form-label">Station</label>
              <select className="form-select" value={form.station_code} onChange={e => setForm({ ...form, station_code: e.target.value })}>
                {stations.map(s => <option key={s.id} value={s.code}>{s.name} ({s.code})</option>)}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Hour (0–23)</label>
                <input type="number" className="form-input" min={0} max={23} value={form.hour_of_day} onChange={e => setForm({ ...form, hour_of_day: +e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Day of Week (0=Mon)</label>
                <input type="number" className="form-input" min={0} max={6} value={form.day_of_week} onChange={e => setForm({ ...form, day_of_week: +e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Weather Condition</label>
              <select className="form-select" value={form.weather} onChange={e => setForm({ ...form, weather: e.target.value })}>
                {WEATHER_OPTIONS.map(w => <option key={w}>{w}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Previous Hour Passenger Count</label>
              <input type="number" className="form-input" min={0} value={form.lag_passenger_count} onChange={e => setForm({ ...form, lag_passenger_count: +e.target.value })} />
            </div>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.is_holiday} onChange={e => setForm({ ...form, is_holiday: e.target.checked })} />
                Holiday
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.is_special_event} onChange={e => setForm({ ...form, is_special_event: e.target.checked })} />
                Special Event
              </label>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={forecasting}>
              {forecasting ? 'Predicting…' : <><Zap size={15} /> Run ML Prediction</>}
            </button>
          </form>
        </div>

        {/* Prediction Result */}
        <div className="card">
          <div className="card-title">Prediction Result</div>
          <div className="card-subtitle">AI-generated crowd density analysis</div>
          {!singleForecast ? (
            <div className="empty-state">
              <Train size={40} />
              <h3>No Prediction Yet</h3>
              <p>Fill in the form and run the ML prediction to see results here.</p>
            </div>
          ) : (
            <div>
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{ fontSize: '56px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1 }}>
                  {singleForecast.predicted_passenger_count.toLocaleString()}
                </div>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '8px' }}>Predicted Passengers</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <span className={`badge badge-${levelColor(singleForecast.crowd_level)}`} style={{ fontSize: '14px', padding: '6px 16px' }}>
                  {singleForecast.crowd_level}
                </span>
              </div>

              <div className="crowd-bar-wrap" style={{ marginBottom: '20px' }}>
                <div className="crowd-bar-label">
                  <span>Occupancy</span>
                  <span>{(singleForecast.predicted_occupancy_ratio * 100).toFixed(1)}%</span>
                </div>
                <div className="crowd-bar-track" style={{ height: '12px' }}>
                  <div
                    className={`crowd-bar-fill ${singleForecast.crowd_level.toLowerCase()}`}
                    style={{ width: `${Math.min(singleForecast.predicted_occupancy_ratio * 100, 100)}%` }}
                  />
                </div>
              </div>

              <div className="info-box" style={{ marginBottom: 0 }}>
                <Info size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
                <span>{singleForecast.recommendation}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
