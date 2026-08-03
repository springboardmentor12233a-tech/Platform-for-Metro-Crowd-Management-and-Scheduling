import React, { useEffect, useState } from 'react';
import { useWebSocket } from '../context/WebSocketContext';
import { stationService, trainService } from '../services/api';
import MapComponent from '../components/MapComponent';
import { 
  Users, 
  AlertTriangle, 
  Train, 
  CheckCircle2, 
  TrendingUp, 
  ArrowUpRight, 
  Activity, 
  Radio 
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar 
} from 'recharts';

export default function Dashboard() {
  const { telemetry, connected, alerts } = useWebSocket();
  const [stations, setStations] = useState([]);
  const [trains, setTrains] = useState([]);

  useEffect(() => {
    stationService.getStations()
      .then(res => setStations(res.data))
      .catch(err => console.error(err));

    trainService.getTrains()
      .then(res => setTrains(res.data))
      .catch(err => console.error(err));
  }, []);

  // Use WS live telemetry if connected
  const displayStations = telemetry?.stations || stations;
  const displayTrains = telemetry?.trains || trains;

  const totalFootfall = telemetry?.system_metrics?.active_passengers_total || 
    displayStations.reduce((sum, s) => sum + (s.current_footfall || 450), 0);

  const redCount = displayStations.filter(s => s.status === 'Red').length;
  const orangeCount = displayStations.filter(s => s.status === 'Orange').length;

  // Chart data formatting
  const stationChartData = displayStations.slice(0, 10).map(s => ({
    name: s.name.length > 12 ? s.name.substring(0, 10) + '..' : s.name,
    footfall: s.current_footfall || 450,
    status: s.status
  }));

  const trendData = [
    { time: '06:00', demand: 320 },
    { time: '08:00', demand: 1850 },
    { time: '10:00', demand: 1400 },
    { time: '12:00', demand: 850 },
    { time: '14:00', demand: 920 },
    { time: '16:00', demand: 1250 },
    { time: '18:00', demand: 1920 },
    { time: '20:00', demand: 1100 }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white flex items-center space-x-2">
            <span>Crowd Intelligence Command Center</span>
            {connected && <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-ping"></span>}
          </h1>
          <p className="text-sm text-slate-400">Real-time station footfall telemetry & automated dispatch optimization.</p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="glass-panel px-4 py-2 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-center space-x-2">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>WebSocket Broadcast Active</span>
          </div>
        </div>
      </div>

      {/* Quick KPI Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel glass-panel-hover p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Network Load</span>
            <Users className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-heading">
            {totalFootfall.toLocaleString()}
          </div>
          <p className="text-xs text-emerald-400 flex items-center font-medium">
            <ArrowUpRight className="w-3.5 h-3.5 mr-1 inline" />
            +8.4% from peak morning window
          </p>
        </div>

        <div className="glass-panel glass-panel-hover p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Congested Stations</span>
            <AlertTriangle className="w-5 h-5 text-rose-400" />
          </div>
          <div className="text-3xl font-extrabold text-rose-400 font-heading">
            {redCount + orangeCount} <span className="text-sm font-normal text-slate-400">/ {displayStations.length}</span>
          </div>
          <p className="text-xs text-amber-400 font-medium">
            {redCount} Critical Red level surge alerts
          </p>
        </div>

        <div className="glass-panel glass-panel-hover p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Fleet Cars</span>
            <Train className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-heading">
            {displayTrains.length} <span className="text-sm font-normal text-slate-400">Trains</span>
          </div>
          <p className="text-xs text-cyan-400 font-medium">
            92.8% Average capacity utilization
          </p>
        </div>

        <div className="glass-panel glass-panel-hover p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">System Efficiency</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 font-heading">
            {telemetry?.system_metrics?.network_efficiency || 96.5}%
          </div>
          <p className="text-xs text-slate-400">Optimal train headway maintainance</p>
        </div>
      </div>

      {/* Main Content Grid: Map & Live Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Map */}
        <div className="lg:col-span-2 h-[460px] flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-heading text-white flex items-center space-x-2">
              <Activity className="w-5 h-5 text-indigo-400" />
              <span>Live Geographic Crowd Topology</span>
            </h2>
            <span className="text-xs text-slate-400">Color-coded station occupancy glow</span>
          </div>
          <MapComponent stations={displayStations} trains={displayTrains} />
        </div>

        {/* Right 1 Col: Live Alerts & Feed */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col space-y-4 h-[460px]">
          <h2 className="text-lg font-bold font-heading text-white flex items-center justify-between">
            <span>Automated Alert Stream</span>
            <span className="px-2 py-0.5 rounded text-xs bg-indigo-500/20 text-indigo-300 font-normal">
              Live WS Feed
            </span>
          </h2>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {alerts.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs space-y-2">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500/40" />
                <p>All stations running within normal footfall capacity.</p>
              </div>
            ) : (
              alerts.map((alt, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-900/90 border border-rose-500/30 space-y-1 glow-red">
                  <div className="flex items-center justify-between text-xs font-bold text-rose-400">
                    <span>{alt.title}</span>
                    <span className="text-[10px] text-slate-500">{alt.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{alt.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Footfall Bar Chart */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold font-heading text-white">
            Station Footfall Breakdown (Top Stations)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stationChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                />
                <Bar dataKey="footfall" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Passenger Demand Area Chart */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold font-heading text-white">
            24-Hour Network Demand Curve
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                />
                <Area type="monotone" dataKey="demand" stroke="#06b6d4" fillOpacity={1} fill="url(#colorDemand)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
