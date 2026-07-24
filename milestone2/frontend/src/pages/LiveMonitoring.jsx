import React from 'react';
import { useWebSockets } from '../context/WebSocketContext';
import GlassmorphicCard from '../components/GlassmorphicCard';
import { Activity, Train, ShieldAlert, Users, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const LiveMonitoring = () => {
  const { realTimeData, wsConnected } = useWebSockets();

  const stations = realTimeData?.stations || [];
  const trains = realTimeData?.trains || [];
  const alerts = realTimeData?.alerts || [];

  // Metrics calculations
  const totalTrains = trains.length;
  const runningTrains = trains.filter(t => t.status === 'In Service').length;
  const delayedTrains = trains.filter(t => t.status === 'Delayed').length;
  const maintenanceTrains = trains.filter(t => t.status === 'Maintenance').length;

  const totalPassengers = stations.reduce((acc, curr) => acc + (curr.passenger_count || 0), 0);
  const averageCongestion = stations.length > 0 
    ? Math.round(stations.reduce((acc, curr) => acc + (curr.crowd_percentage || 0), 0) / stations.length)
    : 0;

  // Chart Data: Inflow vs Outflow
  const chartData = stations.slice(0, 8).map(s => ({
    name: s.name.replace(' Station', ''),
    Inflow: s.inflow || 0,
    Outflow: s.outflow || 0,
    Waiting: s.waiting_passengers || 0,
  }));

  // Occupancy Distribution Chart Data
  const occupancyData = trains.map(t => ({
    name: t.train_number,
    Occupancy: t.occupancy_percentage || 0,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-100 flex items-center gap-2">
            <Activity className="text-violet-500 animate-pulse" size={24} />
            <span>Live Operational Monitoring</span>
          </h1>
          <p className="text-xs font-semibold text-slate-400">
            Real-time WebSocket data stream of system-wide train fleet status and station loads.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-block w-2.5 h-2.5 rounded-full ${wsConnected ? 'bg-emerald-500 animate-ping' : 'bg-rose-500'}`}></span>
          <span className="text-xs font-black uppercase text-slate-300">
            {wsConnected ? 'WebSocket Active' : 'WebSocket Reconnecting...'}
          </span>
        </div>
      </div>

      {/* Telemetry Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 text-slate-100">
        <GlassmorphicCard className="p-5 flex items-center gap-4 border-violet-500/5 hover:border-violet-500/15" hoverEffect={false}>
          <div className="p-3.5 rounded-2xl bg-violet-600/10 text-violet-400">
            <Train size={24} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Fleet Status</span>
            <div className="text-2xl font-black">{runningTrains} / {totalTrains}</div>
            <p className="text-[10px] text-slate-400 mt-1 font-semibold">Active Running Trains</p>
          </div>
        </GlassmorphicCard>

        <GlassmorphicCard className="p-5 flex items-center gap-4 border-amber-500/5 hover:border-amber-500/15" hoverEffect={false}>
          <div className="p-3.5 rounded-2xl bg-amber-600/10 text-amber-400">
            <Clock size={24} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Delayed Services</span>
            <div className="text-2xl font-black text-amber-400">{delayedTrains}</div>
            <p className="text-[10px] text-slate-400 mt-1 font-semibold">System Headway Gaps</p>
          </div>
        </GlassmorphicCard>

        <GlassmorphicCard className="p-5 flex items-center gap-4 border-cyan-500/5 hover:border-cyan-500/15" hoverEffect={false}>
          <div className="p-3.5 rounded-2xl bg-cyan-600/10 text-cyan-400">
            <Users size={24} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Total Passengers</span>
            <div className="text-2xl font-black">{totalPassengers.toLocaleString()}</div>
            <p className="text-[10px] text-slate-400 mt-1 font-semibold">Live Station Footfall</p>
          </div>
        </GlassmorphicCard>

        <GlassmorphicCard className="p-5 flex items-center gap-4 border-rose-500/5 hover:border-rose-500/15" hoverEffect={false}>
          <div className="p-3.5 rounded-2xl bg-rose-600/10 text-rose-400">
            <ShieldAlert size={24} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Active Alerts</span>
            <div className="text-2xl font-black text-rose-400">{alerts.length}</div>
            <p className="text-[10px] text-slate-400 mt-1 font-semibold">Emergency Logs</p>
          </div>
        </GlassmorphicCard>
      </div>

      {/* Live Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassmorphicCard className="p-5 flex flex-col justify-between" hoverEffect={false}>
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-200">Station Inflow / Outflow Split</h3>
            <p className="text-[10px] text-slate-400">Renders live gates passenger throughput metrics.</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#05050e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' }}
                  labelStyle={{ color: '#94a3b8', fontWeight: 'bold' }}
                />
                <Bar dataKey="Inflow" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Outflow" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassmorphicCard>

        <GlassmorphicCard className="p-5 flex flex-col justify-between" hoverEffect={false}>
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-200">Train Capacity Occupancy (%)</h3>
            <p className="text-[10px] text-slate-400">Percentage distribution of load limits per active train number.</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={occupancyData}>
                <defs>
                  <linearGradient id="colorOcc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#05050e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' }}
                  labelStyle={{ color: '#94a3b8', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="Occupancy" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorOcc)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassmorphicCard>
      </div>

      {/* Live Train Status Table */}
      <GlassmorphicCard className="p-5 overflow-hidden" hoverEffect={false}>
        <div className="mb-4">
          <h3 className="text-sm font-bold text-slate-200">Live Active Train Schedules</h3>
          <p className="text-[10px] text-slate-400">Current status and coordinates of trains traveling on the network.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px] font-semibold text-slate-300">
            <thead>
              <tr className="border-b border-white/5 text-slate-500 text-left">
                <th className="pb-2 font-black uppercase tracking-wider">Train</th>
                <th className="pb-2 font-black uppercase tracking-wider">Current Station</th>
                <th className="pb-2 font-black uppercase tracking-wider">Occupancy</th>
                <th className="pb-2 font-black uppercase tracking-wider">Status</th>
                <th className="pb-2 font-black uppercase tracking-wider">Location Coordinates</th>
              </tr>
            </thead>
            <tbody>
              {trains.map((t) => (
                <tr key={t.train_id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 flex flex-col">
                    <span className="font-bold text-slate-100">{t.train_name}</span>
                    <span className="text-[9px] text-slate-500">#{t.train_number}</span>
                  </td>
                  <td className="py-3 text-slate-200">{t.current_station || 'Terminal Yard'}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-slate-900 rounded-full h-1.5 overflow-hidden border border-white/5">
                        <div 
                          className={`h-full rounded-full ${
                            t.occupancy_percentage > 85 ? 'bg-red-500' : t.occupancy_percentage > 60 ? 'bg-orange-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${t.occupancy_percentage}%` }}
                        />
                      </div>
                      <span>{t.current_occupancy} / {t.capacity} ({t.occupancy_percentage}%)</span>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                      t.status === 'In Service' ? 'bg-emerald-500/10 text-emerald-400' :
                      t.status === 'Delayed' ? 'bg-amber-500/10 text-amber-400' :
                      'bg-slate-700/20 text-slate-400'
                    }`}>
                      {t.status === 'In Service' ? <CheckCircle2 size={10} /> : <AlertTriangle size={10} />}
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3 text-slate-400 font-mono">
                    {t.latitude?.toFixed(4)}, {t.longitude?.toFixed(4)}
                  </td>
                </tr>
              ))}
              {trains.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-500">No active trains running.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassmorphicCard>
    </div>
  );
};

export default LiveMonitoring;
