import { useState, useEffect } from 'react';
import { analyticsApi, alertsApi } from '../services/api';
import {
  Train, AlertTriangle, Activity, TrendingUp,
  Users, Zap, RefreshCw
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, CartesianGrid
} from 'recharts';

const CHART_TOOLTIP_STYLE = {
  contentStyle: { background: '#0f1629', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '13px' },
  labelStyle: { color: '#94a3b8' },
  itemStyle: { color: '#3b82f6' },
};

function StatCard({ label, value, icon: Icon, color, badge, badgeDir }) {
  return (
    <div className={`stat-card ${color}`}>
      <div className="stat-card-header">
        <div className={`stat-card-icon ${color}`}><Icon size={20} /></div>
        {badge !== undefined && (
          <span className={`stat-card-badge ${badgeDir}`}>
            {badgeDir === 'up' ? '▲' : '▼'} {badge}
          </span>
        )}
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [peakData, setPeakData] = useState([]);
  const [stationMetrics, setStationMetrics] = useState([]);
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchAll = async () => {
    try {
      const [sum, peaks, stations, alerts] = await Promise.all([
        analyticsApi.summary(),
        analyticsApi.peakHours(),
        analyticsApi.stationMetrics(),
        alertsApi.list({ status: 'Active' }),
      ]);
      setSummary(sum);
      setPeakData(peaks);
      setStationMetrics(stations.slice(0, 8));
      setActiveAlerts(alerts.slice(0, 5));
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <span>Loading MetroFlow Dashboard…</span>
      </div>
    );
  }

  const crowdLevelColor = (util) => {
    if (util > 0.85) return 'overcrowded';
    if (util > 0.60) return 'busy';
    if (util > 0.30) return 'moderate';
    return 'low';
  };

  return (
    <div className="page-content">
      <div className="page-header-row">
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1>System Overview</h1>
          <p>Real-time metro crowd management and scheduling dashboard</p>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={fetchAll} id="dashboard-refresh">
          <RefreshCw size={14} /> Refresh · {lastUpdated.toLocaleTimeString()}
        </button>
      </div>

      {/* Stat Cards */}
      {summary && (
        <div className="stat-grid">
          <StatCard label="Active Stations" value={summary.active_stations} icon={Train} color="blue" />
          <StatCard label="Active Alerts" value={summary.active_alerts} icon={AlertTriangle} color="red" />
          <StatCard label="Trains Today" value={summary.trains_today} icon={Activity} color="green" />
          <StatCard label="System Utilization" value={`${(summary.system_utilization * 100).toFixed(1)}%`} icon={TrendingUp} color="amber" />
          <StatCard label="Total Passengers" value={summary.system_passenger_count?.toLocaleString()} icon={Users} color="purple" />
          <StatCard label="Delay Rate" value={`${(summary.delay_rate * 100).toFixed(1)}%`} icon={Zap} color={summary.delay_rate > 0.2 ? 'red' : 'green'} />
        </div>
      )}

      <div className="grid-2">
        {/* Peak Hours Chart */}
        <div className="card">
          <div className="card-title">Peak Ridership by Hour</div>
          <div className="card-subtitle">Average passenger volume — last 7 days</div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={peakData}>
              <defs>
                <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="hour" stroke="#475569" tick={{ fontSize: 11 }} />
              <YAxis stroke="#475569" tick={{ fontSize: 11 }} />
              <Tooltip {...CHART_TOOLTIP_STYLE} />
              <Area type="monotone" dataKey="avg_passenger_count" stroke="#3b82f6" fill="url(#blueGrad)" strokeWidth={2} name="Avg Passengers" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Active Alerts */}
        <div className="card">
          <div className="card-title">Active Alerts</div>
          <div className="card-subtitle">{activeAlerts.length} unresolved system alerts</div>
          {activeAlerts.length === 0 ? (
            <div className="empty-state">
              <AlertTriangle size={36} />
              <h3>No Active Alerts</h3>
              <p>All systems are operating normally</p>
            </div>
          ) : (
            activeAlerts.map(alert => (
              <div key={alert.id} className={`alert-item ${alert.severity.toLowerCase()}`}>
                <div className={`alert-icon ${alert.severity.toLowerCase()}`}>
                  <AlertTriangle size={16} />
                </div>
                <div className="alert-body">
                  <h4>{alert.station_name} — {alert.severity}</h4>
                  <p>{alert.description}</p>
                  <div className="alert-meta">{new Date(alert.triggered_at).toLocaleString()}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Station Occupancy Grid */}
      <div className="card" style={{ marginTop: '24px' }}>
        <div className="card-title">Station Occupancy — Live</div>
        <div className="card-subtitle">Current passenger loads across all monitored stations</div>
        <div className="station-grid">
          {stationMetrics.map(s => {
            const level = crowdLevelColor(s.utilization);
            return (
              <div key={s.station_id} className="station-card">
                <div className="station-card-header">
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '15px' }}>{s.station_name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>Capacity: {s.capacity.toLocaleString()}</div>
                  </div>
                  <span className={`station-code-badge`}>{s.code}</span>
                </div>
                <div className="crowd-bar-wrap">
                  <div className="crowd-bar-label">
                    <span>{s.current_count.toLocaleString()} pax</span>
                    <span className={`badge badge-${level === 'overcrowded' ? 'danger' : level === 'busy' ? 'warning' : level === 'moderate' ? 'info' : 'success'}`}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </span>
                  </div>
                  <div className="crowd-bar-track">
                    <div className={`crowd-bar-fill ${level}`} style={{ width: `${Math.min(s.utilization * 100, 100)}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Station Bar Chart */}
      <div className="card" style={{ marginTop: '24px' }}>
        <div className="card-title">Station Load Comparison</div>
        <div className="card-subtitle">Current passengers vs. 24h average</div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={stationMetrics} barSize={16}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="code" stroke="#475569" tick={{ fontSize: 11 }} />
            <YAxis stroke="#475569" tick={{ fontSize: 11 }} />
            <Tooltip {...CHART_TOOLTIP_STYLE} />
            <Bar dataKey="current_count" fill="#3b82f6" name="Current" radius={[4,4,0,0]} />
            <Bar dataKey="avg_24h" fill="rgba(59,130,246,0.3)" name="24h Avg" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
