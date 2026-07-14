import React from 'react';
import { useWebSockets } from '../context/WebSocketContext';
import GlassmorphicCard from '../components/GlassmorphicCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, LogIn, LogOut, Hourglass } from 'lucide-react';

const CrowdMonitoring = () => {
  const { realTimeData } = useWebSockets();
  
  const stations = realTimeData?.stations || [];

  // Summary Metrics
  const totalRiders = stations.reduce((acc, curr) => acc + curr.passenger_count, 0);
  const totalInflow = stations.reduce((acc, curr) => acc + curr.inflow, 0);
  const totalOutflow = stations.reduce((acc, curr) => acc + curr.outflow, 0);
  const totalWaiting = stations.reduce((acc, curr) => acc + curr.waiting_passengers, 0);

  // Sorting top 10 stations by passenger count to render a gorgeous comparison bar chart
  const topStations = [...stations]
    .sort((a, b) => b.passenger_count - a.passenger_count)
    .slice(0, 8)
    .map(s => ({
      name: s.name,
      Inflow: s.inflow,
      Outflow: s.outflow,
      Passengers: s.passenger_count
    }));

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight">Crowd Flow Monitoring</h1>
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          Real-time analysis of passenger inflow, outflow, and waiting queues across the Delhi Metro Network.
        </p>
      </div>

      {/* Aggregate Flow KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassmorphicCard className="flex items-center justify-between" hoverEffect={false}>
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Active Riders</span>
            <h3 className="text-2xl font-black">{totalRiders.toLocaleString()}</h3>
          </div>
          <div className="w-11 h-11 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
            <Users size={20} />
          </div>
        </GlassmorphicCard>

        <GlassmorphicCard className="flex items-center justify-between" hoverEffect={false}>
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Inflow</span>
            <h3 className="text-2xl font-black text-green-500">+{totalInflow.toLocaleString()}</h3>
          </div>
          <div className="w-11 h-11 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center">
            <LogIn size={20} />
          </div>
        </GlassmorphicCard>

        <GlassmorphicCard className="flex items-center justify-between" hoverEffect={false}>
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Outflow</span>
            <h3 className="text-2xl font-black text-red-500">-{totalOutflow.toLocaleString()}</h3>
          </div>
          <div className="w-11 h-11 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center">
            <LogOut size={20} />
          </div>
        </GlassmorphicCard>

        <GlassmorphicCard className="flex items-center justify-between" hoverEffect={false}>
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Waiting Passengers</span>
            <h3 className="text-2xl font-black text-amber-500">{totalWaiting.toLocaleString()}</h3>
          </div>
          <div className="w-11 h-11 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Hourglass size={20} />
          </div>
        </GlassmorphicCard>
      </div>

      {/* Charts: Inflow vs Outflow */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassmorphicCard className="lg:col-span-2 space-y-4">
          <h3 className="font-bold text-lg">Inflow vs Outflow at Main Stations</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" h="100%">
              <BarChart data={topStations} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.1}/>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="Inflow" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Outflow" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassmorphicCard>

        {/* Legend / Info card */}
        <GlassmorphicCard className="space-y-4" hoverEffect={false}>
          <h3 className="font-bold text-lg">Density Levels Standard</h3>
          <div className="space-y-4 text-xs font-semibold pt-2">
            <div className="flex items-center justify-between p-3 rounded-xl bg-green-500/10 border border-green-500/25">
              <span className="text-green-500">Green level (Low Density)</span>
              <span>&lt; 30%</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/25">
              <span className="text-yellow-500">Yellow level (Moderate Density)</span>
              <span>30% - 60%</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-orange-500/10 border border-orange-500/25">
              <span className="text-orange-500">Orange level (High Density)</span>
              <span>60% - 85%</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-red-500/10 border border-red-500/25">
              <span className="text-red-500">Red level (Overcrowding)</span>
              <span>&gt; 85%</span>
            </div>
          </div>
        </GlassmorphicCard>
      </div>

      {/* Heatmap Grid Panel */}
      <GlassmorphicCard className="space-y-4" hoverEffect={false}>
        <h3 className="font-bold text-lg">Delhi Metro Network Heatmap Grid</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 pt-2">
          {stations.slice(0, 32).map((s) => {
            const levelClass = 
              s.crowd_level === 'Red' ? 'border-red-500/30 bg-red-500/5 text-red-200' :
              s.crowd_level === 'Orange' ? 'border-orange-500/30 bg-orange-500/5 text-orange-200' :
              s.crowd_level === 'Yellow' ? 'border-yellow-500/30 bg-yellow-500/5 text-yellow-200' :
              'border-green-500/30 bg-green-500/5 text-green-200';
              
            const dotClass = 
              s.crowd_level === 'Red' ? 'bg-red-500 pulse-red' :
              s.crowd_level === 'Orange' ? 'bg-orange-500 pulse-orange' :
              s.crowd_level === 'Yellow' ? 'bg-yellow-500 pulse-yellow' :
              'bg-green-500 pulse-green';

            return (
              <div 
                key={s.station_id} 
                className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center gap-1.5 transition-all hover:scale-[1.05] ${levelClass}`}
              >
                <div className="w-2.5 h-2.5 rounded-full relative">
                  <div className={`w-2.5 h-2.5 rounded-full absolute ${dotClass}`}></div>
                </div>
                <div className="overflow-hidden w-full">
                  <p className="font-bold text-xs truncate">{s.name}</p>
                  <p className="text-[9px] opacity-60 mt-0.5 truncate">{s.line}</p>
                </div>
                <p className="text-[10px] font-black">{s.passenger_count} pax</p>
              </div>
            );
          })}
        </div>
      </GlassmorphicCard>
    </div>
  );
};

export default CrowdMonitoring;
