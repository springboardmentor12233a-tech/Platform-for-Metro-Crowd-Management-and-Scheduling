import { useState, useEffect } from 'react';
import { alertsApi, stationsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { AlertTriangle, CheckCircle, Plus, X, Bell } from 'lucide-react';

const SEV_CLASS = { Critical: 'critical', Warning: 'warning', Info: 'info' };

export default function AlertsPage() {
  const { user } = useAuth();
  const canManage = ['admin', 'operator', 'station_master'].includes(user?.role);

  const [alerts, setAlerts] = useState([]);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [resolving, setResolving] = useState(null);
  const [form, setForm] = useState({ station_id: '', severity: 'Warning', description: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchAlerts = () => {
    const params = {};
    if (filterStatus) params.status = filterStatus;
    alertsApi.list(params).then(setAlerts).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => {
    stationsApi.list().then(d => { setStations(d); if (d.length) setForm(f => ({ ...f, station_id: d[0].id })); });
    fetchAlerts();
  }, [filterStatus]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await alertsApi.create(form);
      setShowModal(false);
      fetchAlerts();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleResolve = async (id) => {
    setResolving(id);
    try {
      await alertsApi.resolve(id);
      fetchAlerts();
    } catch (err) {
      console.error(err);
    } finally {
      setResolving(null);
    }
  };

  const activeCount = alerts.filter(a => a.status === 'Active').length;
  const criticalCount = alerts.filter(a => a.severity === 'Critical' && a.status === 'Active').length;

  return (
    <div className="page-content">
      <div className="page-header-row">
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1>Alerts Management</h1>
          <p>Monitor and respond to system-wide crowd and operational alerts</p>
        </div>
        {canManage && (
          <button id="create-alert-btn" className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={16} /> Trigger Alert
          </button>
        )}
      </div>

      {/* Summary badges */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div className="stat-card red" style={{ flex: '1', minWidth: '160px', padding: '16px 20px' }}>
          <div className="stat-card-header"><div className="stat-card-icon red"><AlertTriangle size={18} /></div></div>
          <div className="stat-value">{criticalCount}</div>
          <div className="stat-label">Critical Active</div>
        </div>
        <div className="stat-card amber" style={{ flex: '1', minWidth: '160px', padding: '16px 20px' }}>
          <div className="stat-card-header"><div className="stat-card-icon amber"><Bell size={18} /></div></div>
          <div className="stat-value">{activeCount}</div>
          <div className="stat-label">Total Active</div>
        </div>
        <div className="stat-card green" style={{ flex: '1', minWidth: '160px', padding: '16px 20px' }}>
          <div className="stat-card-header"><div className="stat-card-icon green"><CheckCircle size={18} /></div></div>
          <div className="stat-value">{alerts.filter(a => a.status === 'Resolved').length}</div>
          <div className="stat-label">Resolved</div>
        </div>
      </div>

      {/* Filter */}
      <div style={{ marginBottom: '16px' }}>
        <select className="form-select" style={{ width: 'auto' }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">All Alerts</option>
          <option value="Active">Active</option>
          <option value="Acknowledged">Acknowledged</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      {/* Alerts List */}
      {loading ? (
        <div className="loading-container"><div className="spinner" /></div>
      ) : alerts.length === 0 ? (
        <div className="empty-state"><Bell size={40} /><h3>No Alerts Found</h3><p>All systems appear to be operating normally.</p></div>
      ) : (
        alerts.map(alert => (
          <div key={alert.id} className={`alert-item ${SEV_CLASS[alert.severity]}`}>
            <div className={`alert-icon ${SEV_CLASS[alert.severity]}`}>
              <AlertTriangle size={16} />
            </div>
            <div className="alert-body" style={{ flex: 1 }}>
              <h4>
                {alert.station_name}
                <span className={`badge badge-${alert.severity === 'Critical' ? 'danger' : alert.severity === 'Warning' ? 'warning' : 'info'}`} style={{ marginLeft: '8px' }}>
                  {alert.severity}
                </span>
                <span className={`badge badge-${alert.status === 'Active' ? 'danger' : alert.status === 'Resolved' ? 'success' : 'neutral'}`} style={{ marginLeft: '6px' }}>
                  {alert.status}
                </span>
              </h4>
              <p>{alert.description}</p>
              <div className="alert-meta">
                Triggered: {new Date(alert.triggered_at).toLocaleString()}
                {alert.resolved_at && ` · Resolved: ${new Date(alert.resolved_at).toLocaleString()}`}
              </div>
            </div>
            {canManage && alert.status === 'Active' && (
              <button
                className="btn btn-success btn-sm"
                onClick={() => handleResolve(alert.id)}
                disabled={resolving === alert.id}
              >
                {resolving === alert.id ? '…' : <><CheckCircle size={14} /> Resolve</>}
              </button>
            )}
          </div>
        ))
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Trigger New Alert</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            {error && <div className="auth-error">{error}</div>}
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label className="form-label">Station</label>
                <select className="form-select" value={form.station_id} onChange={e => setForm({ ...form, station_id: e.target.value })} required>
                  {stations.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Severity</label>
                <select className="form-select" value={form.severity} onChange={e => setForm({ ...form, severity: e.target.value })}>
                  <option>Info</option><option>Warning</option><option>Critical</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required placeholder="Describe the alert condition…" style={{ resize: 'vertical' }} />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-danger" disabled={saving}>{saving ? 'Triggering…' : <><AlertTriangle size={15} /> Trigger Alert</>}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
