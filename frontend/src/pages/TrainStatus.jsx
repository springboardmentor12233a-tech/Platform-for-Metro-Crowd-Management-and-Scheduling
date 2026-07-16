import { useState } from 'react'
import { Zap, Clock, XCircle, CheckCircle, ArrowRight, MapPin } from 'lucide-react'

/* ── Mock data ────────────────────────────────────────────── */

const ALL_TRAINS = [
  {
    id: 'MT-101',
    line: 'Blue',
    operator: 'Riya Sen',
    currentStation: 'West Gate',
    nextStation: 'Central Station',
    terminus: 'East Junction',
    status: 'ON_TIME',
    speed: 68,
    occupancy: 68,
    capacity: 300,
    delay: 0,
    platform: 'P1',
    departedAt: '09:42',
    arrivalAt: '09:54',
  },
  {
    id: 'MT-202',
    line: 'Red',
    operator: 'Arjun Mehta',
    currentStation: 'Airport Link',
    nextStation: 'East Junction',
    terminus: 'East Junction',
    status: 'DELAYED',
    speed: 42,
    occupancy: 91,
    capacity: 280,
    delay: 12,
    platform: 'P2',
    departedAt: '09:30',
    arrivalAt: '10:08',
  },
  {
    id: 'MT-305',
    line: 'Green',
    operator: 'Priya Nair',
    currentStation: 'North Terminal',
    nextStation: 'South Bridge',
    terminus: 'South Bridge',
    status: 'ON_TIME',
    speed: 72,
    occupancy: 45,
    capacity: 320,
    delay: 0,
    platform: 'P1',
    departedAt: '09:48',
    arrivalAt: '09:59',
  },
  {
    id: 'MT-410',
    line: 'Yellow',
    operator: 'Karan Shah',
    currentStation: 'South Bridge',
    nextStation: 'Airport Link',
    terminus: 'Airport Link',
    status: 'ON_TIME',
    speed: 65,
    occupancy: 32,
    capacity: 260,
    delay: 0,
    platform: 'P3',
    departedAt: '09:50',
    arrivalAt: '10:05',
  },
  {
    id: 'MT-404',
    line: 'Red',
    operator: 'Deepak Verma',
    currentStation: 'Central Station',
    nextStation: '—',
    terminus: 'North Terminal',
    status: 'CANCELLED',
    speed: 0,
    occupancy: 0,
    capacity: 280,
    delay: 0,
    platform: '—',
    departedAt: '—',
    arrivalAt: '—',
  },
]

/* ── Style maps ───────────────────────────────────────────── */

const statusConfig = {
  ON_TIME: {
    label:  'On Time',
    badge:  'bg-green-500/20 text-green-400 border border-green-500/30',
    icon:   CheckCircle,
  },
  DELAYED: {
    label:  'Delayed',
    badge:  'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    icon:   Clock,
  },
  CANCELLED: {
    label:  'Cancelled',
    badge:  'bg-red-500/20 text-red-400 border border-red-500/30',
    icon:   XCircle,
  },
  RUNNING: {
    label:  'Running',
    badge:  'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30',
    icon:   Zap,
  },
}

const lineConfig = {
  Blue:   { badge: 'bg-blue-500/20 text-blue-400',   dot: 'bg-blue-500'   },
  Red:    { badge: 'bg-red-500/20 text-red-400',     dot: 'bg-red-500'    },
  Green:  { badge: 'bg-green-500/20 text-green-400', dot: 'bg-green-500'  },
  Yellow: { badge: 'bg-yellow-500/20 text-yellow-400', dot: 'bg-yellow-400' },
}

/* ── Train card ───────────────────────────────────────────── */
function TrainCard({ train }) {
  const sc  = statusConfig[train.status] || statusConfig.ON_TIME
  const lc  = lineConfig[train.line] || { badge: 'bg-slate-700 text-slate-400', dot: 'bg-slate-500' }
  const StatusIcon = sc.icon

  const occupancyPct = train.capacity > 0
    ? Math.round((train.occupancy / train.capacity) * 100)
    : 0

  const occupancyColor =
    occupancyPct >= 85 ? 'bg-red-500' : occupancyPct >= 65 ? 'bg-amber-500' : 'bg-green-500'

  return (
    <div className="glass-card p-5 hover:border-slate-600/60 transition-all duration-300 hover:-translate-y-0.5">
      {/* Header row */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-slate-700/60 flex items-center justify-center`}>
            <Zap size={18} className="text-cyan-400" />
          </div>
          <div>
            <div className="text-white font-bold text-base">{train.id}</div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${lc.badge}`}>
                {train.line} Line
              </span>
            </div>
          </div>
        </div>
        <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-xl ${sc.badge}`}>
          <StatusIcon size={12} />
          {sc.label}
        </span>
      </div>

      {/* Route */}
      <div className="bg-slate-800/50 rounded-xl p-3 mb-4">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <MapPin size={11} />
          Current route
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <div className="text-white text-sm font-medium">{train.currentStation}</div>
            <div className="text-slate-500 text-xs">Current</div>
          </div>
          <ArrowRight size={14} className="text-slate-600 flex-shrink-0" />
          <div className="flex-1 text-right">
            <div className="text-slate-300 text-sm font-medium">{train.nextStation}</div>
            <div className="text-slate-500 text-xs">Next stop</div>
          </div>
        </div>
        {train.terminus !== train.nextStation && train.nextStation !== '—' && (
          <div className="mt-2 text-slate-500 text-xs">
            Terminus: <span className="text-slate-400">{train.terminus}</span>
          </div>
        )}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3 mb-4 text-center">
        <div>
          <div className="text-white font-semibold text-sm tabular-nums">
            {train.speed > 0 ? `${train.speed} km/h` : '—'}
          </div>
          <div className="text-slate-500 text-xs">Speed</div>
        </div>
        <div className="border-x border-slate-700/50">
          <div className="text-white font-semibold text-sm tabular-nums">
            {train.delay > 0 ? (
              <span className="text-amber-400">+{train.delay} min</span>
            ) : train.status === 'CANCELLED' ? (
              <span className="text-red-400">N/A</span>
            ) : (
              <span className="text-green-400">On time</span>
            )}
          </div>
          <div className="text-slate-500 text-xs">Delay</div>
        </div>
        <div>
          <div className="text-white font-semibold text-sm tabular-nums">
            {train.platform}
          </div>
          <div className="text-slate-500 text-xs">Platform</div>
        </div>
      </div>

      {/* Occupancy bar */}
      {train.status !== 'CANCELLED' && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-slate-400 text-xs">Occupancy</span>
            <span className="text-slate-300 text-xs font-medium tabular-nums">
              {train.occupancy} / {train.capacity} ({occupancyPct}%)
            </span>
          </div>
          <div className="w-full bg-slate-700/60 rounded-full h-2 overflow-hidden">
            <div
              className={`${occupancyColor} h-2 rounded-full transition-all duration-500`}
              style={{ width: `${occupancyPct}%` }}
            />
          </div>
        </div>
      )}

      {train.status === 'CANCELLED' && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
          <XCircle size={13} className="text-red-400 flex-shrink-0" />
          <span className="text-red-400 text-xs">Service cancelled — passengers please reroute</span>
        </div>
      )}

      {/* Schedule */}
      {train.departedAt !== '—' && (
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-700/40">
          <span>Departed <span className="text-slate-400">{train.departedAt}</span></span>
          <span>ETA <span className="text-slate-400">{train.arrivalAt}</span></span>
        </div>
      )}
    </div>
  )
}

/* ── Page ─────────────────────────────────────────────────── */

const LINES   = ['All', 'Blue', 'Red', 'Green', 'Yellow']
const STATUSES = ['All', 'ON_TIME', 'DELAYED', 'CANCELLED']

/**
 * TrainStatus — Live train monitoring page.
 */
export default function TrainStatus() {
  const [lineFilter,   setLineFilter]   = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')

  const filtered = ALL_TRAINS.filter((t) => {
    const lineOk   = lineFilter   === 'All' || t.line   === lineFilter
    const statusOk = statusFilter === 'All' || t.status === statusFilter
    return lineOk && statusOk
  })

  const counts = {
    total:     ALL_TRAINS.length,
    on_time:   ALL_TRAINS.filter((t) => t.status === 'ON_TIME').length,
    delayed:   ALL_TRAINS.filter((t) => t.status === 'DELAYED').length,
    cancelled: ALL_TRAINS.filter((t) => t.status === 'CANCELLED').length,
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <h2 className="page-title">Train Status</h2>
        <p className="page-subtitle">Real-time position and service status of all metro trains</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Trains',  value: counts.total,     color: 'text-cyan-400',  bg: 'bg-cyan-500/10',  icon: Zap         },
          { label: 'On Time',       value: counts.on_time,   color: 'text-green-400', bg: 'bg-green-500/10', icon: CheckCircle },
          { label: 'Delayed',       value: counts.delayed,   color: 'text-amber-400', bg: 'bg-amber-500/10', icon: Clock       },
          { label: 'Cancelled',     value: counts.cancelled, color: 'text-red-400',   bg: 'bg-red-500/10',   icon: XCircle     },
        ].map(({ label, value, color, bg, icon: Icon }) => (
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

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2">
          <span className="text-slate-500 text-xs font-medium">Line:</span>
          <div className="flex gap-1.5 flex-wrap">
            {LINES.map((l) => (
              <button
                key={l}
                onClick={() => setLineFilter(l)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  lineFilter === l
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                    : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:ml-4">
          <span className="text-slate-500 text-xs font-medium">Status:</span>
          <div className="flex gap-1.5 flex-wrap">
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  statusFilter === s
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                    : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'
                }`}
              >
                {s === 'ON_TIME' ? 'On Time' : s === 'CANCELLED' ? 'Cancelled' : s}
              </button>
            ))}
          </div>
        </div>

        <span className="ml-auto text-slate-500 text-xs">
          Showing {filtered.length} of {ALL_TRAINS.length} trains
        </span>
      </div>

      {/* Train grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((t) => (
            <TrainCard key={t.id} train={t} />
          ))}
        </div>
      ) : (
        <div className="glass-card p-16 text-center">
          <div className="text-4xl mb-3">🚇</div>
          <h3 className="text-white font-semibold mb-1">No trains found</h3>
          <p className="text-slate-400 text-sm">Try adjusting the line or status filter.</p>
        </div>
      )}
    </div>
  )
}
