/**
 * Analytics Page
 * Aggregated KPIs, hourly traffic bar chart, and station heatmap.
 */
import { useState } from 'react'
import { Users, Clock, Activity, TrendingUp, AlertCircle } from 'lucide-react'

const PERIODS = ['today', 'week', 'month']

const data = {
  total_passengers: 142850,
  peak_hour: '08:30 - 09:30',
  avg_crowd_level: 63.4,
  on_time_performance: 87.2,
  incidents_count: 3,
  hourly_traffic: [
    { label: '06:00', value: 4200 },
    { label: '07:00', value: 8900 },
    { label: '08:00', value: 15600 },
    { label: '09:00', value: 12300 },
    { label: '10:00', value: 7800 },
    { label: '11:00', value: 6100 },
    { label: '12:00', value: 9200 },
    { label: '13:00', value: 8700 },
    { label: '14:00', value: 7400 },
    { label: '15:00', value: 6800 },
    { label: '16:00', value: 9600 },
    { label: '17:00', value: 14200 },
    { label: '18:00', value: 16800 },
    { label: '19:00', value: 11200 },
    { label: '20:00', value: 6400 },
  ],
  station_heatmap: [
    { station: 'East Junction', value: 95 },
    { station: 'Central Station', value: 88 },
    { station: 'South Bridge', value: 72 },
    { station: 'Airport Link', value: 58 },
    { station: 'North Terminal', value: 45 },
    { station: 'West Gate', value: 31 },
  ],
}

const kpis = [
  { id: 'passengers', label: 'Total Passengers', value: '142,850', icon: Users, color: 'text-cyan-400', bg: 'bg-cyan-500/10', unit: '' },
  { id: 'peak', label: 'Peak Hour', value: '08:30', icon: Clock, color: 'text-purple-400', bg: 'bg-purple-500/10', unit: 'AM' },
  { id: 'crowd', label: 'Avg Crowd Level', value: '63.4', icon: Activity, color: 'text-amber-400', bg: 'bg-amber-500/10', unit: '%' },
  { id: 'ontime', label: 'On-time Performance', value: '87.2', icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/10', unit: '%' },
  { id: 'incidents', label: 'Incidents Today', value: '3', icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/10', unit: '' },
]

const MAX_TRAFFIC = Math.max(...data.hourly_traffic.map((h) => h.value))

function HeatmapBar({ station, value }) {
  const color =
    value >= 90 ? 'bg-red-500' :
    value >= 70 ? 'bg-amber-500' :
    value >= 50 ? 'bg-blue-500' : 'bg-green-500'
  return (
    <div className="flex items-center gap-3">
      <span className="text-slate-300 text-sm w-36 truncate">{station}</span>
      <div className="flex-1 bg-slate-700 rounded-full h-2">
        <div className={`${color} h-2 rounded-full transition-all duration-700`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-slate-400 text-xs w-10 text-right">{value}%</span>
    </div>
  )
}

export default function Analytics() {
  const [period, setPeriod] = useState('today')

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="page-header">
          <h2 className="page-title">Analytics</h2>
          <p className="page-subtitle">Metro network performance metrics and passenger flow analysis</p>
        </div>
        {/* Period Selector */}
        <div className="flex items-center gap-1 bg-slate-800 border border-slate-700 rounded-xl p-1">
          {PERIODS.map((p) => (
            <button
              key={p}
              id={`period-${p}`}
              onClick={() => setPeriod(p)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all duration-200 ${
                period === p
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {p === 'today' ? 'Today' : p === 'week' ? 'This Week' : 'This Month'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((k) => (
          <div key={k.id} id={`kpi-${k.id}`} className="stat-card">
            <div className={`w-10 h-10 rounded-xl ${k.bg} flex items-center justify-center mb-3`}>
              <k.icon size={18} className={k.color} />
            </div>
            <div className="text-xl font-bold text-white">
              {k.value}<span className="text-sm text-slate-400 ml-0.5">{k.unit}</span>
            </div>
            <div className="text-slate-400 text-xs mt-1">{k.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Hourly Traffic Chart */}
        <div className="xl:col-span-2 glass-card p-6">
          <h3 className="text-white font-semibold mb-6">Hourly Passenger Traffic</h3>
          <div className="flex items-end gap-1.5 h-48">
            {data.hourly_traffic.map((h) => {
              const heightPct = (h.value / MAX_TRAFFIC) * 100
              const isHighest = h.value === MAX_TRAFFIC
              return (
                <div key={h.label} className="flex-1 flex flex-col items-center gap-1 group">
                  <div
                    className="relative w-full rounded-t-md transition-all duration-300 group-hover:opacity-100"
                    style={{ height: `${heightPct}%` }}
                  >
                    <div
                      className={`absolute inset-0 rounded-t-md ${
                        isHighest
                          ? 'bg-gradient-to-t from-cyan-600 to-cyan-400'
                          : 'bg-gradient-to-t from-slate-600 to-slate-500 group-hover:from-blue-600 group-hover:to-blue-400'
                      } transition-all duration-200`}
                    />
                    {/* Tooltip */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-700 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      {h.value.toLocaleString()}
                    </div>
                  </div>
                  <span className="text-slate-500 text-xs rotate-45 origin-left hidden sm:block">{h.label}</span>
                </div>
              )
            })}
          </div>
          <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-gradient-to-r from-cyan-600 to-cyan-400" /> Peak Hour</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-slate-600" /> Regular Hours</span>
          </div>
        </div>

        {/* Station Heatmap */}
        <div className="glass-card p-6">
          <h3 className="text-white font-semibold mb-6">Station Occupancy Heatmap</h3>
          <div className="space-y-4">
            {data.station_heatmap.map((s) => (
              <HeatmapBar key={s.station} station={s.station} value={s.value} />
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-slate-700 grid grid-cols-2 gap-3 text-xs">
            {[
              { label: 'Critical ≥90%', color: 'bg-red-500' },
              { label: 'High ≥70%', color: 'bg-amber-500' },
              { label: 'Medium ≥50%', color: 'bg-blue-500' },
              { label: 'Low <50%', color: 'bg-green-500' },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5 text-slate-400">
                <span className={`w-2.5 h-2.5 rounded-full ${l.color}`} />
                {l.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Row */}
      <div className="glass-card p-6">
        <h3 className="text-white font-semibold mb-4">Period Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Total Journeys', value: '142,850', sub: '+8.3% vs yesterday' },
            { label: 'Avg Dwell Time', value: '2.4 min', sub: 'Per station stop' },
            { label: 'Fleet Utilization', value: '79.1%', sub: '24 of 30 trains active' },
            { label: 'Passenger Satisfaction', value: '4.2 / 5', sub: 'Based on app feedback' },
          ].map((item) => (
            <div key={item.label}>
              <div className="text-white font-bold text-xl">{item.value}</div>
              <div className="text-slate-300 text-sm mt-0.5">{item.label}</div>
              <div className="text-slate-500 text-xs mt-0.5">{item.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
