import { useState } from 'react'
import { Users, AlertTriangle, Activity, CheckCircle } from 'lucide-react'

/* ── Mock station data ────────────────────────────────────── */

const ALL_STATIONS = [
  {
    id: 1,
    name: 'East Junction',
    code: 'EJN',
    platform: 'P1',
    line: 'Red',
    density: 'CRITICAL',
    occupancy: 95.4,
    headcount: 2100,
    capacity: 2200,
    lastUpdated: '1 min ago',
    trend: 'rising',
  },
  {
    id: 2,
    name: 'Central Station',
    code: 'CST',
    platform: 'P1',
    line: 'Blue',
    density: 'HIGH',
    occupancy: 82.5,
    headcount: 1650,
    capacity: 2000,
    lastUpdated: '2 min ago',
    trend: 'stable',
  },
  {
    id: 3,
    name: 'South Bridge',
    code: 'SBR',
    platform: 'P2',
    line: 'Blue',
    density: 'HIGH',
    occupancy: 72.5,
    headcount: 1450,
    capacity: 2000,
    lastUpdated: '1 min ago',
    trend: 'falling',
  },
  {
    id: 4,
    name: 'Airport Link',
    code: 'APL',
    platform: 'P1',
    line: 'Yellow',
    density: 'MEDIUM',
    occupancy: 44.5,
    headcount: 890,
    capacity: 2000,
    lastUpdated: '3 min ago',
    trend: 'rising',
  },
  {
    id: 5,
    name: 'North Terminal',
    code: 'NTR',
    platform: 'P2',
    line: 'Green',
    density: 'MEDIUM',
    occupancy: 45.3,
    headcount: 680,
    capacity: 1500,
    lastUpdated: '2 min ago',
    trend: 'stable',
  },
  {
    id: 6,
    name: 'West Gate',
    code: 'WGT',
    platform: 'P3',
    line: 'Green',
    density: 'LOW',
    occupancy: 11.7,
    headcount: 210,
    capacity: 1800,
    lastUpdated: '4 min ago',
    trend: 'falling',
  },
]

/* ── Style maps ───────────────────────────────────────────── */

const densityConfig = {
  CRITICAL: {
    bar:    'bg-red-500',
    badge:  'bg-red-500/20 text-red-400 border border-red-500/30',
    glow:   'shadow-red-500/20',
    border: 'border-red-500/30',
    dot:    'bg-red-500',
    pulse:  true,
  },
  HIGH: {
    bar:    'bg-amber-500',
    badge:  'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    glow:   'shadow-amber-500/10',
    border: 'border-amber-500/20',
    dot:    'bg-amber-500',
    pulse:  false,
  },
  MEDIUM: {
    bar:    'bg-blue-500',
    badge:  'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    glow:   '',
    border: 'border-slate-700/50',
    dot:    'bg-blue-500',
    pulse:  false,
  },
  LOW: {
    bar:    'bg-green-500',
    badge:  'bg-green-500/20 text-green-400 border border-green-500/30',
    glow:   '',
    border: 'border-slate-700/50',
    dot:    'bg-green-500',
    pulse:  false,
  },
}

const lineColors = {
  Blue:   'bg-blue-500/20 text-blue-400',
  Red:    'bg-red-500/20 text-red-400',
  Green:  'bg-green-500/20 text-green-400',
  Yellow: 'bg-yellow-500/20 text-yellow-400',
}

const trendIcon = { rising: '↑', stable: '→', falling: '↓' }
const trendColor = { rising: 'text-red-400', stable: 'text-slate-400', falling: 'text-green-400' }

/* ── Filter button ────────────────────────────────────────── */
function FilterBtn({ label, active, count, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
        active
          ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-white border border-cyan-500/40'
          : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white hover:border-slate-600'
      }`}
    >
      {label}
      {count !== undefined && (
        <span
          className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
            active ? 'bg-cyan-500/30 text-cyan-300' : 'bg-slate-700 text-slate-500'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  )
}

/* ── Station card ─────────────────────────────────────────── */
function StationCard({ station }) {
  const cfg = densityConfig[station.density] || densityConfig.MEDIUM

  return (
    <div
      className={`glass-card p-5 hover:shadow-lg ${cfg.glow} transition-all duration-300 hover:-translate-y-0.5 border ${cfg.border}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div
              className={`w-2 h-2 rounded-full ${cfg.dot} ${cfg.pulse ? 'animate-pulse' : ''}`}
            />
            <h3 className="text-white font-semibold text-sm">{station.name}</h3>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <span className="text-slate-500 text-xs font-mono">{station.code}</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-500 text-xs">{station.platform}</span>
            <span className="text-slate-600">·</span>
            <span
              className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                lineColors[station.line] || 'bg-slate-700 text-slate-400'
              }`}
            >
              {station.line} Line
            </span>
          </div>
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${cfg.badge}`}>
          {station.density}
        </span>
      </div>

      {/* Occupancy display */}
      <div className="mb-4">
        <div className="flex items-end justify-between mb-2">
          <div>
            <span className="text-3xl font-bold text-white tabular-nums">
              {station.occupancy}
            </span>
            <span className="text-slate-400 text-sm ml-1">%</span>
          </div>
          <div className={`text-sm font-bold ${trendColor[station.trend]}`}>
            {trendIcon[station.trend]}{' '}
            <span className="text-xs font-normal capitalize">{station.trend}</span>
          </div>
        </div>

        {/* Bar */}
        <div className="w-full bg-slate-700/60 rounded-full h-2.5 overflow-hidden">
          <div
            className={`${cfg.bar} h-2.5 rounded-full transition-all duration-700`}
            style={{ width: `${Math.min(station.occupancy, 100)}%` }}
          />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-700/50">
        <div className="text-center">
          <div className="text-white text-sm font-semibold tabular-nums">
            {station.headcount.toLocaleString()}
          </div>
          <div className="text-slate-500 text-xs">People</div>
        </div>
        <div className="text-center border-x border-slate-700/50">
          <div className="text-white text-sm font-semibold tabular-nums">
            {station.capacity.toLocaleString()}
          </div>
          <div className="text-slate-500 text-xs">Capacity</div>
        </div>
        <div className="text-center">
          <div className="text-slate-300 text-xs font-medium">{station.lastUpdated}</div>
          <div className="text-slate-500 text-xs">Updated</div>
        </div>
      </div>
    </div>
  )
}

/* ── Page ─────────────────────────────────────────────────── */

const FILTERS = ['All', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW']

/**
 * CrowdMonitoring — Live station crowd density grid.
 */
export default function CrowdMonitoring() {
  const [activeFilter, setActiveFilter] = useState('All')

  const counts = {
    All:      ALL_STATIONS.length,
    CRITICAL: ALL_STATIONS.filter((s) => s.density === 'CRITICAL').length,
    HIGH:     ALL_STATIONS.filter((s) => s.density === 'HIGH').length,
    MEDIUM:   ALL_STATIONS.filter((s) => s.density === 'MEDIUM').length,
    LOW:      ALL_STATIONS.filter((s) => s.density === 'LOW').length,
  }

  const filtered =
    activeFilter === 'All'
      ? ALL_STATIONS
      : ALL_STATIONS.filter((s) => s.density === activeFilter)

  const avgOccupancy = (
    ALL_STATIONS.reduce((sum, s) => sum + s.occupancy, 0) / ALL_STATIONS.length
  ).toFixed(1)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Header ──────────────────────────────────────── */}
      <div className="page-header">
        <h2 className="page-title">Crowd Monitoring</h2>
        <p className="page-subtitle">
          Live passenger density across all {ALL_STATIONS.length} metro stations
        </p>
      </div>

      {/* ── Summary stat bar ────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Stations', value: ALL_STATIONS.length, icon: Activity,      color: 'text-cyan-400',  bg: 'bg-cyan-500/10'  },
          { label: 'Critical',       value: counts.CRITICAL,     icon: AlertTriangle,  color: 'text-red-400',   bg: 'bg-red-500/10'   },
          { label: 'High Density',   value: counts.HIGH,         icon: Users,          color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Avg Occupancy',  value: `${avgOccupancy}%`,  icon: CheckCircle,    color: 'text-blue-400',  bg: 'bg-blue-500/10'  },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="glass-card p-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
              <Icon size={17} className={color} />
            </div>
            <div>
              <div className="text-white font-bold text-xl tabular-nums">{value}</div>
              <div className="text-slate-400 text-xs">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filter bar ──────────────────────────────────── */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-slate-500 text-xs font-medium mr-1">Filter by density:</span>
        {FILTERS.map((f) => (
          <FilterBtn
            key={f}
            label={f}
            active={activeFilter === f}
            count={counts[f]}
            onClick={() => setActiveFilter(f)}
          />
        ))}
        <div className="ml-auto flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-slate-500 text-xs">Live data</span>
        </div>
      </div>

      {/* ── Station grid ────────────────────────────────── */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((station) => (
            <StationCard key={station.id} station={station} />
          ))}
        </div>
      ) : (
        <div className="glass-card p-16 text-center">
          <div className="text-4xl mb-3">🏙️</div>
          <h3 className="text-white font-semibold mb-1">No stations found</h3>
          <p className="text-slate-400 text-sm">
            No stations match the selected density filter.
          </p>
        </div>
      )}
    </div>
  )
}
