import { useState } from 'react'
import { Calendar, Clock, CheckCircle, XCircle, AlertTriangle, Filter } from 'lucide-react'

/* ── Mock schedule data ───────────────────────────────────── */

const SCHEDULES = [
  {
    id: 'SCH-001',
    trainNo: 'MT-101',
    line: 'Blue',
    origin: 'West Gate',
    destination: 'East Junction',
    departure: '09:00',
    arrival: '09:48',
    platform: 'P1',
    status: 'ON_TIME',
    stops: 6,
    distance: '28 km',
  },
  {
    id: 'SCH-002',
    trainNo: 'MT-202',
    line: 'Red',
    origin: 'Airport Link',
    destination: 'East Junction',
    departure: '09:15',
    arrival: '09:58',
    platform: 'P2',
    status: 'DELAYED',
    delay: '+12 min',
    stops: 4,
    distance: '21 km',
  },
  {
    id: 'SCH-003',
    trainNo: 'MT-305',
    line: 'Green',
    origin: 'North Terminal',
    destination: 'South Bridge',
    departure: '09:30',
    arrival: '09:54',
    platform: 'P1',
    status: 'ON_TIME',
    stops: 3,
    distance: '14 km',
  },
  {
    id: 'SCH-004',
    trainNo: 'MT-404',
    line: 'Red',
    origin: 'Central Station',
    destination: 'North Terminal',
    departure: '09:45',
    arrival: '10:30',
    platform: '—',
    status: 'CANCELLED',
    stops: 5,
    distance: '23 km',
  },
  {
    id: 'SCH-005',
    trainNo: 'MT-115',
    line: 'Blue',
    origin: 'East Junction',
    destination: 'West Gate',
    departure: '10:00',
    arrival: '10:48',
    platform: 'P3',
    status: 'ON_TIME',
    stops: 6,
    distance: '28 km',
  },
  {
    id: 'SCH-006',
    trainNo: 'MT-410',
    line: 'Yellow',
    origin: 'South Bridge',
    destination: 'Airport Link',
    departure: '10:10',
    arrival: '10:35',
    platform: 'P2',
    status: 'ON_TIME',
    stops: 3,
    distance: '16 km',
  },
  {
    id: 'SCH-007',
    trainNo: 'MT-220',
    line: 'Red',
    origin: 'East Junction',
    destination: 'Airport Link',
    departure: '10:20',
    arrival: '10:55',
    platform: 'P1',
    status: 'ON_TIME',
    stops: 4,
    distance: '20 km',
  },
  {
    id: 'SCH-008',
    trainNo: 'MT-330',
    line: 'Green',
    origin: 'South Bridge',
    destination: 'North Terminal',
    departure: '10:30',
    arrival: '10:54',
    platform: 'P2',
    status: 'DELAYED',
    delay: '+5 min',
    stops: 3,
    distance: '14 km',
  },
]

/* ── Style maps ───────────────────────────────────────────── */

const statusConfig = {
  ON_TIME: {
    label: 'On Time',
    cls: 'bg-green-500/20 text-green-400 border border-green-500/30',
    icon: CheckCircle,
  },
  DELAYED: {
    label: 'Delayed',
    cls: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    icon: AlertTriangle,
  },
  CANCELLED: {
    label: 'Cancelled',
    cls: 'bg-red-500/20 text-red-400 border border-red-500/30',
    icon: XCircle,
  },
}

const lineConfig = {
  Blue:   'bg-blue-500/20 text-blue-400',
  Red:    'bg-red-500/20 text-red-400',
  Green:  'bg-green-500/20 text-green-400',
  Yellow: 'bg-yellow-500/20 text-yellow-400',
}

const LINES = ['All', 'Blue', 'Red', 'Green', 'Yellow']

/* ── Schedule row ─────────────────────────────────────────── */
function ScheduleRow({ sch, index }) {
  const sc = statusConfig[sch.status] || statusConfig.ON_TIME
  const StatusIcon = sc.icon

  return (
    <tr
      className={`border-b border-slate-700/40 hover:bg-slate-700/20 transition-colors ${
        sch.status === 'CANCELLED' ? 'opacity-60' : ''
      }`}
    >
      {/* Row number */}
      <td className="py-3.5 pl-4 pr-2 text-slate-600 text-xs tabular-nums">{index + 1}</td>

      {/* Train No. */}
      <td className="py-3.5 px-3">
        <span className="text-white font-bold text-sm">{sch.trainNo}</span>
        <div className="text-slate-500 text-xs mt-0.5">{sch.id}</div>
      </td>

      {/* Line */}
      <td className="py-3.5 px-3">
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${lineConfig[sch.line] || 'bg-slate-700 text-slate-400'}`}>
          {sch.line}
        </span>
      </td>

      {/* Origin */}
      <td className="py-3.5 px-3 text-slate-300 text-sm">{sch.origin}</td>

      {/* Destination */}
      <td className="py-3.5 px-3 text-slate-300 text-sm">{sch.destination}</td>

      {/* Departure */}
      <td className="py-3.5 px-3">
        <div className="flex items-center gap-1.5">
          <Clock size={12} className="text-slate-500" />
          <span className="text-slate-200 text-sm font-mono">{sch.departure}</span>
        </div>
      </td>

      {/* Arrival */}
      <td className="py-3.5 px-3">
        <div className="flex items-center gap-1.5">
          <Clock size={12} className="text-slate-500" />
          <span className="text-slate-200 text-sm font-mono">{sch.arrival}</span>
          {sch.delay && (
            <span className="text-amber-400 text-xs font-bold">{sch.delay}</span>
          )}
        </div>
      </td>

      {/* Platform */}
      <td className="py-3.5 px-3">
        <span className="text-slate-300 text-sm font-mono bg-slate-700/50 px-2 py-0.5 rounded">
          {sch.platform}
        </span>
      </td>

      {/* Status */}
      <td className="py-3.5 px-3 pr-4">
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${sc.cls}`}>
          <StatusIcon size={11} />
          {sc.label}
        </span>
      </td>
    </tr>
  )
}

/* ── Page ─────────────────────────────────────────────────── */

/**
 * Schedules — Train schedule table with line filter.
 */
export default function Schedules() {
  const [lineFilter, setLineFilter] = useState('All')
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const filtered =
    lineFilter === 'All'
      ? SCHEDULES
      : SCHEDULES.filter((s) => s.line === lineFilter)

  const counts = {
    on_time:   filtered.filter((s) => s.status === 'ON_TIME').length,
    delayed:   filtered.filter((s) => s.status === 'DELAYED').length,
    cancelled: filtered.filter((s) => s.status === 'CANCELLED').length,
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 page-header">
        <div>
          <h2 className="page-title">Schedule Management</h2>
          <p className="page-subtitle">Train timetables and service status</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5">
          <Calendar size={15} className="text-cyan-400" />
          <span className="text-slate-300 text-sm font-medium">{today}</span>
        </div>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'On Time',   value: counts.on_time,   color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
          { label: 'Delayed',   value: counts.delayed,   color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
          { label: 'Cancelled', value: counts.cancelled, color: 'text-red-400',   bg: 'bg-red-500/10',   border: 'border-red-500/20'   },
        ].map(({ label, value, color, bg, border }) => (
          <div key={label} className={`glass-card p-4 border ${border} text-center`}>
            <div className={`text-2xl font-bold tabular-nums ${color}`}>{value}</div>
            <div className="text-slate-400 text-xs mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3 flex-wrap">
        <Filter size={14} className="text-slate-500" />
        <span className="text-slate-500 text-xs font-medium">Filter by line:</span>
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
        <span className="ml-auto text-slate-500 text-xs">
          {filtered.length} schedules
        </span>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-slate-700/50 bg-slate-800/40">
                <th className="py-3 pl-4 pr-2 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">#</th>
                <th className="py-3 px-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Train No.</th>
                <th className="py-3 px-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Line</th>
                <th className="py-3 px-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Origin</th>
                <th className="py-3 px-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Destination</th>
                <th className="py-3 px-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Departure</th>
                <th className="py-3 px-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Arrival</th>
                <th className="py-3 px-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Platform</th>
                <th className="py-3 px-3 pr-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((sch, i) => (
                  <ScheduleRow key={sch.id} sch={sch} index={i} />
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-slate-500">
                    No schedules found for the selected line.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
