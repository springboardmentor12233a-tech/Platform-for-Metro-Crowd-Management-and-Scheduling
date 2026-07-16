/**
 * Dashboard Page
 * Real-time operations overview with KPI stats, crowd levels, alerts, and line status.
 */
import { Users, AlertTriangle, Zap, TrendingUp, TrendingDown, ArrowRight, CheckCircle, XCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

const stats = [
  { id: 'passengers', label: 'Total Passengers', value: '142,850', change: '+8.3%', up: true, icon: Users, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  { id: 'critical', label: 'Critical Stations', value: '2', change: '+1', up: false, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
  { id: 'trains', label: 'Active Trains', value: '24', change: '-2', up: false, icon: Zap, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { id: 'ontime', label: 'On-time Rate', value: '87.2%', change: '+2.1%', up: true, icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/10' },
]

const stations = [
  { name: 'East Junction', platform: 'P1', density: 'CRITICAL', occupancy: 95.4, headcount: 2100 },
  { name: 'Central Station', platform: 'P1', density: 'HIGH', occupancy: 72.5, headcount: 1450 },
  { name: 'South Bridge', platform: 'P2', density: 'HIGH', occupancy: 82.5, headcount: 1320 },
  { name: 'Airport Link', platform: 'P1', density: 'MEDIUM', occupancy: 44.5, headcount: 890 },
  { name: 'North Terminal', platform: 'P2', density: 'MEDIUM', occupancy: 45.3, headcount: 680 },
  { name: 'West Gate', platform: 'P3', density: 'LOW', occupancy: 11.7, headcount: 210 },
]

const alerts = [
  { id: 'ALT001', severity: 'CRITICAL', title: 'Overcrowding — East Junction', time: '5 min ago' },
  { id: 'ALT002', severity: 'WARNING', title: 'Train MT-202 Delayed 12 min', time: '18 min ago' },
  { id: 'ALT004', severity: 'CRITICAL', title: 'Train MT-404 Cancelled', time: '45 min ago' },
]

const lines = [
  { name: 'Blue Line', trains: 8, status: 'Operational', color: 'bg-blue-500' },
  { name: 'Red Line', trains: 6, status: 'Disruption', color: 'bg-red-500' },
  { name: 'Green Line', trains: 7, status: 'Operational', color: 'bg-green-500' },
  { name: 'Yellow Line', trains: 3, status: 'Operational', color: 'bg-yellow-500' },
]

function DensityBar({ percent, level }) {
  const colors = { CRITICAL: 'bg-red-500', HIGH: 'bg-amber-500', MEDIUM: 'bg-blue-500', LOW: 'bg-green-500' }
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-slate-700 rounded-full h-1.5">
        <div
          className={`${colors[level]} h-1.5 rounded-full transition-all duration-500`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="text-slate-400 text-xs w-10 text-right">{percent}%</span>
    </div>
  )
}

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <h2 className="page-title">Operations Dashboard</h2>
        <p className="page-subtitle">Real-time overview of Metro network — Last updated just now</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.id} id={`stat-${s.id}`} className="stat-card">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                <s.icon size={20} className={s.color} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-semibold ${s.up ? 'text-green-400' : 'text-red-400'}`}>
                {s.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {s.change}
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{s.value}</div>
            <div className="text-slate-400 text-sm">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Station Crowd Table */}
        <div className="xl:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-white font-semibold">Station Crowd Levels</h3>
            <Link to="/crowd-monitoring" className="text-cyan-400 text-xs hover:text-cyan-300 flex items-center gap-1 transition-colors">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-4">
            {stations.map((s) => (
              <div key={s.name} className="flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <span className="text-white text-sm font-medium">{s.name}</span>
                      <span className="text-slate-500 text-xs ml-2">{s.platform}</span>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      s.density === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
                      s.density === 'HIGH' ? 'bg-amber-500/20 text-amber-400' :
                      s.density === 'MEDIUM' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'
                    }`}>{s.density}</span>
                  </div>
                  <DensityBar percent={s.occupancy} level={s.density} />
                </div>
                <div className="text-right flex-shrink-0 w-16">
                  <div className="text-white text-sm font-semibold">{s.headcount.toLocaleString()}</div>
                  <div className="text-slate-500 text-xs">people</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Recent Alerts */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Recent Alerts</h3>
              <Link to="/alerts" className="text-cyan-400 text-xs hover:text-cyan-300 transition-colors">View all</Link>
            </div>
            <div className="space-y-3">
              {alerts.map((a) => (
                <div key={a.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                    a.severity === 'CRITICAL' ? 'bg-red-500' : 'bg-amber-500'
                  } animate-pulse`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-xs font-medium leading-tight">{a.title}</div>
                    <div className="text-slate-500 text-xs mt-0.5">{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Metro Line Status */}
          <div className="glass-card p-5">
            <h3 className="text-white font-semibold mb-4">Metro Line Status</h3>
            <div className="space-y-3">
              {lines.map((line) => (
                <div key={line.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-3 h-3 rounded-full ${line.color}`} />
                    <span className="text-slate-300 text-sm">{line.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-xs">{line.trains} trains</span>
                    {line.status === 'Operational'
                      ? <CheckCircle size={14} className="text-green-400" />
                      : <XCircle size={14} className="text-red-400" />
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
