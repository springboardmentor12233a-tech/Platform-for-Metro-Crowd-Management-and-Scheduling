import { useState, useEffect } from 'react';
import { schedulesApi, stationsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Plus, X, Zap, Clock } from 'lucide-react';

const STATUS_CLASS = {
  'On-Time': 'status-on-time', 'Delayed': 'status-delayed',
  'Scheduled': 'status-scheduled', 'Cancelled': 'status-cancelled', 'Completed': 'status-completed'
};
const STATUS_BADGE = {
  'On-Time': 'success', 'Delayed': 'danger', 'Scheduled': 'info',
  'Cancelled': 'neutral', 'Completed': 'neutral'
};

export default function SchedulesPage() {
  const { user } = useAuth();
  const canManage = ['admin', 'operator'].includes(user?.role);

  const [schedules, setSchedules] = useState([]);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterLine, setFilterLine] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [optimizations, setOptimizations] = useState([]);
  const [optimStation, setOptimStation] = useState('');
  const [optimizing, setOptimizing] = useState(false);
  const [form, setForm] = useState({
    train_id: '', line_name: '', direction: 'Inbound',
    departure_station_id: '', arrival_station_id: '',
    scheduled_departure: '', scheduled_arrival: '',
    status: 'Scheduled'
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchSchedules = () => {
    const params = {};
    if (filterStatus) params.status = filterStatus;
    if (filterLine) params.line_name = filterLine;
    schedulesApi.list(params).then(setSchedules).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => {
    stationsApi.list().then(data => { setStations(data); if (data.length) setOptimStation(data[0].id); });
    fetchSchedules();
  }, [filterStatus, filterLine]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await schedulesApi.create(form);
      setShowModal(false);
      fetchSchedules();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleOptimize = async () => {
    if (!optimStation) return;
    setOptimizing(true);
    try {
      const recs = await schedulesApi.optimize(optimStation);
      setOptimizations(recs);
    } catch (err) {
      console.error(err);
    } finally {
      setOptimizing(false);
    }
  };

  return (
    <div className="page-content">
      <div className="page-header-row">
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1>Train Schedules</h1>
          <p>Manage and monitor all metro line timetables</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {canManage && (
            <button id="create-schedule-btn" className="btn btn-primary" onClick={() => setShowModal(true)}>
              <Plus size={16} /> Add Schedule
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: '20px', padding: '16px 20px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '160px' }}>
            <select className="form-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="">All Statuses</option>
              {['Scheduled','On-Time','Delayed','Cancelled','Completed'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ flex: 1, minWidth: '160px' }}>
            <select className="form-select" value={filterLine} onChange={e => setFilterLine(e.target.value)}>
              <option value="">All Lines</option>
              <option>Red Line</option>
              <option>Blue Line</option>
            </select>
          </div>
        </div>
      </div>

      {/* Schedule Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
          <div className="card-title">Schedule Log ({schedules.length})</div>
        </div>
        <div className="table-wrapper">
          {loading ? (
            <div className="loading-container"><div className="spinner" /></div>
          ) : schedules.length === 0 ? (
            <div className="empty-state"><Clock size={40} /><h3>No schedules found</h3><p>Try changing the filters or add a new schedule.</p></div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Train</th><th>Line</th><th>Direction</th>
                  <th>From</th><th>To</th>
                  <th>Departure</th><th>Arrival</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map(s => (
                  <tr key={s.id}>
                    <td>{s.train_id}</td>
                    <td><span className="badge badge-info">{s.line_name}</span></td>
                    <td>{s.direction}</td>
                    <td>{s.departure_station_name}</td>
                    <td>{s.arrival_station_name}</td>
                    <td>{new Date(s.scheduled_departure).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                    <td>{new Date(s.scheduled_arrival).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                    <td><span className={`badge badge-${STATUS_BADGE[s.status] || 'neutral'}`}>{s.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Schedule Optimization */}
      {canManage && (
        <div className="card" style={{ marginTop: '24px' }}>
          <div className="card-title"><Zap size={16} style={{ display: 'inline', marginRight: '6px' }} />Schedule Optimization Engine</div>
          <div className="card-subtitle">ML-driven headway recommendations based on historical crowd patterns</div>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
            <select className="form-select" style={{ flex: 1 }} value={optimStation} onChange={e => setOptimStation(e.target.value)}>
              {stations.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <button id="optimize-btn" className="btn btn-primary" onClick={handleOptimize} disabled={optimizing}>
              {optimizing ? 'Analyzing…' : <><Zap size={15} /> Optimize</>}
            </button>
          </div>
          {optimizations.length > 0 && (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr><th>Hour</th><th>Predicted Crowd</th><th>Utilization</th><th>Suggested Headway</th><th>Action</th><th>Reason</th></tr>
                </thead>
                <tbody>
                  {optimizations.filter(o => o.action_required).map(o => (
                    <tr key={o.hour}>
                      <td>{o.hour.toString().padStart(2,'0')}:00</td>
                      <td>{o.forecasted_crowd.toLocaleString()}</td>
                      <td>{(o.utilization * 100).toFixed(0)}%</td>
                      <td><span className="badge badge-warning">{o.suggested_headway_minutes} min</span></td>
                      <td><span className="badge badge-danger">Action Required</span></td>
                      <td style={{ maxWidth: '250px' }}>{o.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Train Schedule</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            {error && <div className="auth-error">{error}</div>}
            <form onSubmit={handleCreate}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group"><label className="form-label">Train ID</label><input className="form-input" value={form.train_id} onChange={e => setForm({...form, train_id: e.target.value})} required placeholder="T-101" /></div>
                <div className="form-group"><label className="form-label">Line Name</label>
                  <select className="form-select" value={form.line_name} onChange={e => setForm({...form, line_name: e.target.value})}>
                    <option>Red Line</option><option>Blue Line</option>
                  </select>
                </div>
                <div className="form-group"><label className="form-label">Direction</label>
                  <select className="form-select" value={form.direction} onChange={e => setForm({...form, direction: e.target.value})}>
                    <option>Inbound</option><option>Outbound</option>
                  </select>
                </div>
                <div className="form-group"><label className="form-label">Status</label>
                  <select className="form-select" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                    {['Scheduled','On-Time','Delayed','Cancelled','Completed'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group"><label className="form-label">Departure Station</label>
                  <select className="form-select" value={form.departure_station_id} onChange={e => setForm({...form, departure_station_id: e.target.value})} required>
                    <option value="">Select station…</option>
                    {stations.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div className="form-group"><label className="form-label">Arrival Station</label>
                  <select className="form-select" value={form.arrival_station_id} onChange={e => setForm({...form, arrival_station_id: e.target.value})} required>
                    <option value="">Select station…</option>
                    {stations.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div className="form-group"><label className="form-label">Scheduled Departure</label><input type="datetime-local" className="form-input" value={form.scheduled_departure} onChange={e => setForm({...form, scheduled_departure: e.target.value})} required /></div>
                <div className="form-group"><label className="form-label">Scheduled Arrival</label><input type="datetime-local" className="form-input" value={form.scheduled_arrival} onChange={e => setForm({...form, scheduled_arrival: e.target.value})} required /></div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Create Schedule'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
