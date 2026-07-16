/**
 * Alerts Page
 * Alert management with severity filtering and resolve action.
 */
import { useState } from 'react'
import { AlertTriangle, AlertCircle, Info, CheckCircle, Clock, MapPin, Filter } from 'lucide-react'

const INITIAL_ALERTS = [
  {
    id: 'ALT001', severity: 'CRITICAL',
    title: 'Overcrowding — East Junction',
    message: 'Platform occupancy at 95.4%. Immediate crowd control required. Deploy additional staff to Platform 1.',
    station: 'East Junction', time: '5 min ago', isResolved: false,
  },
  {
    id: 'ALT002', severity: 'WARNING',
    title: 'Train MT-202 Delayed',
    message: 'Red Line train MT-202 is delayed by 12 minutes due to signal fault near South Bridge.',
    station: 'South Bridge', time: '18 min ago', isResolved: false,
  },
  {
    id: 'ALT004', severity: 'CRITICAL',
    title: 'Train MT-404 Cancelled',
    message: 'Blue Line MT-404 cancelled due to technical failure. Passengers advised to use alternate Blue Line services.',
    station: 'North Terminal', time: '45 min ago', isResolved: false,
  },
  {
    id: 'ALT005', severity: 'WARNING',
    title: 'High Occupancy — South Bridge',
    message: 'South Bridge Platform 2 at 82.5% capacity. Monitor situation and prepare for diversion.',
    station: 'South Bridge', time: '52 min ago', isResolved: false,
  },
  {
    id: 'ALT003', severity: 'INFO',
    title: 'Green Line Schedule Updated',
    message: 'Green Line schedule adjusted for planned maintenance window 22:00–23:30. Reduced frequency.',
    station: null, time: '1 hr ago', isResolved: true,
  },
  {
    id: 'ALT006', severity: 'INFO',
    title: 'System Maintenance Complete',
    message: 'Scheduled maintenance for signalling system on Yellow Line completed successfully.',
    station: null, time: '3 hrs ago', isResolved: true,
  },
]

const SEVERITY_STYLES = {
  CRITICAL: { badge: 'bg-red-500/20 text-red-400 border-red-500/30', dot: 'bg-red-500', icon: AlertTriangle, border: 'border-l-red-500' },
  WARNING:  { badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30', dot: 'bg-amber-500', icon: AlertCircle, border: 'border-l-amber-500' },
  INFO:     { badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30', dot: 'bg-blue-400', icon: Info, border: 'border-l-blue-500' },
}

const FILTERS = ['ALL', 'CRITICAL', 'WARNING', 'INFO', 'RESOLVED']

export default function Alerts() {
  const [alerts, setAlerts] = useState(INITIAL_ALERTS)
  const [filter, setFilter] = useState('ALL')

  const resolve = (id) => {
    setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, isResolved: true } : a))
  }

  const filtered = alerts.filter((a) => {
    if (filter === 'ALL') return true
    if (filter === 'RESOLVED') return a.isResolved
    return a.severity === filter && !a.isResolved
  })

  const counts = {
    total: alerts.length,
    unresolved: alerts.filter((a) => !a.isResolved).length,
    critical: alerts.filter((a) => a.severity === 'CRITICAL' && !a.isResolved).length,
    warning: alerts.filter((a) => a.severity === 'WARNING' && !a.isResolved).length,
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <h2 className="page-title">Alerts</h2>
        <p className="page-subtitle">Real-time crowd management alerts and incident notifications</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Alerts', value: counts.total, color: 'text-slate-300', bg: 'bg-slate-700/50' },
          { label: 'Unresolved', value: counts.unresolved, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Critical', value: counts.critical, color: 'text-red-400', bg: 'bg-red-500/10' },
          { label: 'Warnings', value: counts.warning, color: 'text-amber-400', bg: 'bg-amber-500/10' },
        ].map((s) => (
          <div key={s.label} className={`glass-card p-5 ${s.bg}`}>
            <div className={`text-3xl font-bold ${s.color} mb-1`}>{s.value}</div>
            <div className="text-slate-400 text-sm">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter size={14} className="text-slate-400" />
        {FILTERS.map((f) => (
          <button
            key={f}
            id={`filter-${f.toLowerCase()}`}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 border ${
              filter === f
                ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                : 'text-slate-400 border-slate-700 hover:border-slate-500 hover:text-white'
            }`}
          >
            {f === 'ALL' ? `All (${alerts.length})` :
             f === 'CRITICAL' ? `Critical (${counts.critical})` :
             f === 'WARNING' ? `Warning (${counts.warning})` :
             f === 'RESOLVED' ? `Resolved (${alerts.filter((a) => a.isResolved).length})` :
             f}
          </button>
        ))}
      </div>

      {/* Alert Cards */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <CheckCircle size={40} className="text-green-400 mx-auto mb-3" />
            <p className="text-white font-medium">No alerts in this category</p>
            <p className="text-slate-400 text-sm mt-1">All clear for this filter</p>
          </div>
        ) : (
          filtered.map((alert) => {
            const style = SEVERITY_STYLES[alert.severity]
            const Icon = style.icon
            return (
              <div
                key={alert.id}
                id={`alert-${alert.id}`}
                className={`glass-card p-5 border-l-4 ${style.border} ${alert.isResolved ? 'opacity-50' : ''} transition-all duration-300`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      alert.severity === 'CRITICAL' ? 'bg-red-500/20' :
                      alert.severity === 'WARNING' ? 'bg-amber-500/20' : 'bg-blue-500/20'
                    }`}>
                      <Icon size={16} className={
                        alert.severity === 'CRITICAL' ? 'text-red-400' :
                        alert.severity === 'WARNING' ? 'text-amber-400' : 'text-blue-400'
                      } />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${style.badge}`}>
                          {alert.severity}
                        </span>
                        {alert.isResolved && (
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                            RESOLVED
                          </span>
                        )}
                      </div>
                      <h4 className="text-white font-semibold text-sm">{alert.title}</h4>
                      <p className="text-slate-400 text-sm mt-1 leading-relaxed">{alert.message}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><Clock size={11} /> {alert.time}</span>
                        {alert.station && (
                          <span className="flex items-center gap-1"><MapPin size={11} /> {alert.station}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  {!alert.isResolved && (
                    <button
                      id={`resolve-${alert.id}`}
                      onClick={() => resolve(alert.id)}
                      className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-medium hover:bg-green-500/20 transition-colors"
                    >
                      <CheckCircle size={12} /> Resolve
                    </button>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
