import { useState, useEffect } from 'react';
import { analyticsApi } from '../services/api';
import { Download, BarChart2, Clock } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, CartesianGrid, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

const TOOLTIP = {
  contentStyle: { background: '#0f1629', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '13px' },
  labelStyle: { color: '#94a3b8' },
};

export default function AnalyticsPage() {
  const [peakData, setPeakData] = useState([]);
  const [stationData, setStationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    Promise.all([analyticsApi.peakHours(), analyticsApi.stationMetrics()])
      .then(([peaks, stations]) => {
        setPeakData(peaks);
        setStationData(stations);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await analyticsApi.exportReport();
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'metroflow_crowd_report.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    } finally {
      setExporting(false);
    }
  };

  if (loading) return <div className="loading-container"><div className="spinner" /><span>Loading analytics…</span></div>;

  const radarData = stationData.slice(0, 6).map(s => ({
    station: s.code,
    utilization: Math.round(s.utilization * 100),
  }));

  return (
    <div className="page-content">
      <div className="page-header-row">
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1>Analytics & Reports</h1>
          <p>Historical ridership patterns, peak analysis, and performance metrics</p>
        </div>
        <button id="export-report-btn" className="btn btn-primary" onClick={handleExport} disabled={exporting}>
          <Download size={16} /> {exporting ? 'Generating…' : 'Export CSV Report'}
        </button>
      </div>

      {/* Peak Hours Chart */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-title"><Clock size={16} style={{ display: 'inline', marginRight: '6px' }} />Hourly Ridership Distribution</div>
        <div className="card-subtitle">Average passenger volume per hour across all stations — last 7 days</div>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={peakData}>
            <defs>
              <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="hour" stroke="#475569" tick={{ fontSize: 11 }} />
            <YAxis stroke="#475569" tick={{ fontSize: 11 }} />
            <Tooltip {...TOOLTIP} itemStyle={{ color: '#8b5cf6' }} />
            <Area type="monotone" dataKey="avg_passenger_count" stroke="#8b5cf6" fill="url(#purpleGrad)" strokeWidth={2} name="Avg Passengers" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid-2" style={{ marginBottom: '24px' }}>
        {/* Station Utilization Bar */}
        <div className="card">
          <div className="card-title">Station Utilization (%)</div>
          <div className="card-subtitle">Current occupancy as a percent of capacity</div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={stationData.map(s => ({ code: s.code, util: Math.round(s.utilization * 100) }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="code" stroke="#475569" tick={{ fontSize: 11 }} />
              <YAxis stroke="#475569" tick={{ fontSize: 11 }} domain={[0, 100]} unit="%" />
              <Tooltip {...TOOLTIP} itemStyle={{ color: '#10b981' }} />
              <Bar dataKey="util" name="Utilization %" fill="#10b981" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Radar Chart */}
        <div className="card">
          <div className="card-title">Network Utilization Radar</div>
          <div className="card-subtitle">Comparative occupancy spread across stations</div>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis dataKey="station" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#475569', fontSize: 10 }} />
              <Radar name="Utilization %" dataKey="utilization" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} />
              <Tooltip {...TOOLTIP} itemStyle={{ color: '#06b6d4' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Station Performance Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
          <div className="card-title"><BarChart2 size={16} style={{ display: 'inline', marginRight: '6px' }} />Station Performance Summary</div>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Station</th><th>Code</th><th>Capacity</th>
                <th>Current Pax</th><th>24h Avg</th><th>24h Peak</th><th>Utilization</th>
              </tr>
            </thead>
            <tbody>
              {stationData.map(s => (
                <tr key={s.station_id}>
                  <td>{s.station_name}</td>
                  <td><span className="badge badge-info">{s.code}</span></td>
                  <td>{s.capacity.toLocaleString()}</td>
                  <td>{s.current_count.toLocaleString()}</td>
                  <td>{s.avg_24h.toLocaleString()}</td>
                  <td>{s.max_24h.toLocaleString()}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div className="crowd-bar-track" style={{ flex: 1, height: '6px' }}>
                        <div
                          className={`crowd-bar-fill ${s.utilization > 0.85 ? 'overcrowded' : s.utilization > 0.60 ? 'busy' : s.utilization > 0.30 ? 'moderate' : 'low'}`}
                          style={{ width: `${Math.min(s.utilization * 100, 100)}%` }}
                        />
                      </div>
                      <span style={{ fontSize: '12px', width: '38px', textAlign: 'right' }}>{(s.utilization * 100).toFixed(0)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
