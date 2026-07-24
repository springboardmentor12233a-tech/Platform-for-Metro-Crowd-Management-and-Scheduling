import React from 'react';
import { useWebSockets } from '../context/WebSocketContext';
import GlassmorphicCard from '../components/GlassmorphicCard';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { MapPin, Users, Activity, AlertTriangle, ShieldCheck } from 'lucide-react';

const CrowdMonitoring = () => {
  const { realTimeData } = useWebSockets();
  
  const stations = realTimeData?.stations || [];

  // Calculate KPIs
  const totalStations = stations.length;
  const totalPassengers = stations.reduce((acc, curr) => acc + curr.passenger_count, 0);
  const activeStations = stations.filter(s => s.passenger_count > 0).length;
  
  // Calculate Average Congestion
  const avgOccupancy = totalStations > 0 
    ? Math.round(stations.reduce((acc, curr) => acc + curr.crowd_percentage, 0) / totalStations)
    : 0;

  let currentCongestionLevel = "Green";
  let congestionColor = "text-green-500";
  if (avgOccupancy > 80) { currentCongestionLevel = "Red"; congestionColor = "text-red-500"; }
  else if (avgOccupancy > 60) { currentCongestionLevel = "Orange"; congestionColor = "text-orange-500"; }
  else if (avgOccupancy > 40) { currentCongestionLevel = "Yellow"; congestionColor = "text-yellow-500"; }

  // Calculate Color Distribution (Green, Yellow, Orange, Red)
  const greenStations = stations.filter(s => s.crowd_percentage <= 40).length;
  const yellowStations = stations.filter(s => s.crowd_percentage > 40 && s.crowd_percentage <= 60).length;
  const orangeStations = stations.filter(s => s.crowd_percentage > 60 && s.crowd_percentage <= 80).length;
  const redStations = stations.filter(s => s.crowd_percentage > 80).length;

  const distributionData = [
    { name: 'Green (0-40%)', value: greenStations, color: '#22c55e' },
    { name: 'Yellow (41-60%)', value: yellowStations, color: '#eab308' },
    { name: 'Orange (61-80%)', value: orangeStations, color: '#f97316' },
    { name: 'Red (81-100%)', value: redStations, color: '#ef4444' }
  ];

  // Sorting top 10 stations for Bar Chart
  const topStations = [...stations]
    .sort((a, b) => b.crowd_percentage - a.crowd_percentage)
    .slice(0, 8)
    .map(s => ({
      name: s.name,
      Occupancy: s.crowd_percentage,
      Passengers: s.passenger_count
    }));

  // Dummy passenger trend for chart
  const passengerTrend = [
    { time: '06:00', passengers: 12000 },
    { time: '08:00', passengers: 45000 },
    { time: '10:00', passengers: 85000 },
    { time: '12:00', passengers: 55000 },
    { time: '14:00', passengers: 48000 },
    { time: '16:00', passengers: 62000 },
    { time: '18:00', passengers: 95000 },
    { time: '20:00', passengers: totalPassengers || 78000 },
  ];

  const nowString = new Date().toLocaleTimeString();

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-100">Crowd Monitoring Dashboard</h1>
        <p className="text-sm font-semibold text-slate-500">
          Real-time analytics and congestion tracking for all metro stations.
        </p>
      </div>

      {/* 1. Main KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassmorphicCard className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Stations</span>
            <h3 className="text-2xl font-black">{totalStations}</h3>
          </div>
          <div className="w-11 h-11 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
            <MapPin size={20} />
          </div>
        </GlassmorphicCard>

        <GlassmorphicCard className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Passengers</span>
            <h3 className="text-2xl font-black">{totalPassengers.toLocaleString()}</h3>
          </div>
          <div className="w-11 h-11 rounded-lg bg-violet-500/10 text-violet-500 flex items-center justify-center">
            <Users size={20} />
          </div>
        </GlassmorphicCard>

        <GlassmorphicCard className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Stations</span>
            <h3 className="text-2xl font-black">{activeStations}</h3>
          </div>
          <div className="w-11 h-11 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <Activity size={20} />
          </div>
        </GlassmorphicCard>

        <GlassmorphicCard className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">System Congestion</span>
            <h3 className={`text-2xl font-black ${congestionColor}`}>{currentCongestionLevel}</h3>
          </div>
          <div className={`w-11 h-11 rounded-lg flex items-center justify-center bg-slate-800 ${congestionColor}`}>
            {avgOccupancy > 60 ? <AlertTriangle size={20} /> : <ShieldCheck size={20} />}
          </div>
        </GlassmorphicCard>
      </div>

      {/* 2. Congestion Level Cards (Green, Yellow, Orange, Red) */}
      <h2 className="text-xl font-bold text-slate-200 mt-8 mb-4">Congestion Zones</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <GlassmorphicCard className="border-t-4 border-t-green-500">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-xs font-bold text-slate-400">0 - 40%</div>
              <div className="text-lg font-black text-green-500">Green Zone</div>
            </div>
            <div className="text-3xl font-black text-slate-200">{greenStations}</div>
          </div>
        </GlassmorphicCard>

        <GlassmorphicCard className="border-t-4 border-t-yellow-500">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-xs font-bold text-slate-400">41 - 60%</div>
              <div className="text-lg font-black text-yellow-500">Yellow Zone</div>
            </div>
            <div className="text-3xl font-black text-slate-200">{yellowStations}</div>
          </div>
        </GlassmorphicCard>

        <GlassmorphicCard className="border-t-4 border-t-orange-500">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-xs font-bold text-slate-400">61 - 80%</div>
              <div className="text-lg font-black text-orange-500">Orange Zone</div>
            </div>
            <div className="text-3xl font-black text-slate-200">{orangeStations}</div>
          </div>
        </GlassmorphicCard>

        <GlassmorphicCard className="border-t-4 border-t-red-500">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-xs font-bold text-slate-400">81 - 100%</div>
              <div className="text-lg font-black text-red-500">Red Zone</div>
            </div>
            <div className="text-3xl font-black text-slate-200">{redStations}</div>
          </div>
        </GlassmorphicCard>
      </div>

      {/* 3. Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Passenger Trend (Line Chart) */}
        <GlassmorphicCard className="space-y-4">
          <h3 className="font-bold text-lg">Passenger Trend</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" h="100%">
              <LineChart data={passengerTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.1}/>
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                <Line type="monotone" dataKey="passengers" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassmorphicCard>

        {/* Crowd Distribution (Pie Chart) */}
        <GlassmorphicCard className="space-y-4">
          <h3 className="font-bold text-lg">Crowd Distribution</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" h="100%">
              <PieChart>
                <Pie data={distributionData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassmorphicCard>

        {/* Station Occupancy (Bar Chart) */}
        <GlassmorphicCard className="space-y-4">
          <h3 className="font-bold text-lg">Station Occupancy (Top 8)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" h="100%">
              <BarChart data={topStations}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.1}/>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                <Bar dataKey="Occupancy" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassmorphicCard>

        {/* Congestion Summary (Area Chart) */}
        <GlassmorphicCard className="space-y-4">
          <h3 className="font-bold text-lg">Congestion Summary</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" h="100%">
              <AreaChart data={topStations}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.1}/>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                <Area type="monotone" dataKey="Passengers" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassmorphicCard>
      </div>

      {/* 4. Congestion Tracking Table */}
      <GlassmorphicCard className="overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Congestion Tracking</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-400 uppercase bg-slate-900/50">
              <tr>
                <th className="px-4 py-3 font-black">Station Name</th>
                <th className="px-4 py-3 font-black text-right">Passenger Count</th>
                <th className="px-4 py-3 font-black text-right">Occupancy %</th>
                <th className="px-4 py-3 font-black text-center">Crowd Level</th>
                <th className="px-4 py-3 font-black text-right">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {stations.map(s => {
                let badgeClass = "bg-green-500/10 text-green-500";
                if (s.crowd_level === "Red") badgeClass = "bg-red-500/10 text-red-500";
                if (s.crowd_level === "Orange") badgeClass = "bg-orange-500/10 text-orange-500";
                if (s.crowd_level === "Yellow") badgeClass = "bg-yellow-500/10 text-yellow-500";

                return (
                  <tr key={s.station_id} className="border-b border-slate-700/50 hover:bg-slate-800/30">
                    <td className="px-4 py-3 font-bold text-slate-200">{s.name}</td>
                    <td className="px-4 py-3 text-right text-slate-300">{s.passenger_count.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right font-mono">{s.crowd_percentage}%</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${badgeClass}`}>
                        {s.crowd_level}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-slate-400 text-xs">{nowString}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassmorphicCard>
    </div>
  );
};

export default CrowdMonitoring;
