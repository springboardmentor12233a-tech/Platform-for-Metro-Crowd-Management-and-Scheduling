import React, { useEffect, useState } from 'react';
import api from '../services/api';
import GlassmorphicCard from '../components/GlassmorphicCard';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
  TrendingUp, Train, Users, AlertTriangle, Clock, Building2, HelpCircle, Activity,
  AlertCircle, Map, Zap, CheckCircle
} from 'lucide-react';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/analytics/dashboard');
      setData(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 6000);
    return () => clearInterval(interval);
  }, []);

  const COLORS = ['#8b5cf6', '#06b6d4', '#f59e0b', '#ef4444', '#10b981'];

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-8 bg-gradient-to-r from-violet-500/20 to-cyan-500/20 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gradient-to-br from-violet-500/5 to-cyan-500/5 rounded-2xl border border-[var(--border)]"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up delay-200">
          <div className="lg:col-span-2 h-96 bg-gradient-to-br from-violet-500/5 to-cyan-500/5 rounded-2xl border border-[var(--border)]"></div>
          <div className="h-96 bg-gradient-to-br from-violet-500/5 to-cyan-500/5 rounded-2xl border border-[var(--border)]"></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center text-red-400 font-bold glass-card border border-red-500/20 rounded-2xl bg-gradient-to-r from-red-500/5 to-rose-500/5">
        {error || 'Error loading dashboard. Ensure backend and DB are active.'}
      </div>
    );
  }

  const { kpis, charts, recentActivity } = data;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center animate-fade-in-up">
        <div>
          <h1 className="text-3xl font-black tracking-tight gradient-text">
            System Dashboard
          </h1>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            Real-time crowd intelligence and schedules monitoring.
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up delay-100">
        <GlassmorphicCard className="flex items-center justify-between" gradient="blue" glow>
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Passengers Today</span>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white">
              {kpis.passengersToday.toLocaleString()}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Users size={22} />
          </div>
        </GlassmorphicCard>

        <GlassmorphicCard className="flex items-center justify-between" gradient="emerald" glow>
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active Trains</span>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white">{kpis.activeTrains}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25">
            <Train size={22} />
          </div>
        </GlassmorphicCard>

        <GlassmorphicCard className="flex items-center justify-between" gradient="amber" glow>
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">System delay ratio</span>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white">{kpis.delayPercentage}%</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/25">
            <Clock size={22} />
          </div>
        </GlassmorphicCard>

        <GlassmorphicCard className="flex items-center justify-between" gradient="red" glow>
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active Alerts</span>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white">{kpis.activeAlerts}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 text-white flex items-center justify-center shadow-lg shadow-red-500/25">
            <AlertTriangle size={22} />
          </div>
        </GlassmorphicCard>
      </div>
      
      {/* Second KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up delay-150">
        <GlassmorphicCard className="flex items-center justify-between" gradient="purple" glow>
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Stations</span>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white">{kpis.totalStations}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-500 text-white flex items-center justify-center shadow-lg shadow-purple-500/25">
            <Building2 size={22} />
          </div>
        </GlassmorphicCard>

        <GlassmorphicCard className="flex items-center justify-between" gradient="orange" glow>
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Delayed Trains</span>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white">{kpis.delayedTrains}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/25">
            <AlertCircle size={22} />
          </div>
        </GlassmorphicCard>

        <GlassmorphicCard className="flex items-center justify-between" gradient="cyan" glow>
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Avg Occupancy</span>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white">{kpis.averageOccupancy}%</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 text-white flex items-center justify-center shadow-lg shadow-cyan-500/25">
            <Activity size={22} />
          </div>
        </GlassmorphicCard>

        <GlassmorphicCard className="flex items-center justify-between" gradient="pink" glow>
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Peak Hour</span>
            <h3 className="text-xl font-black text-slate-800 dark:text-white">{kpis.peakHour}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 text-white flex items-center justify-center shadow-lg shadow-pink-500/25">
            <TrendingUp size={22} />
          </div>
        </GlassmorphicCard>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up delay-200">
        {/* Daily Ridership Trend */}
        <GlassmorphicCard className="lg:col-span-2 space-y-4" gradient="primary">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg">Weekly Passenger Trend</h3>
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1 badge-gradient-emerald px-2 py-1 rounded-full">
              <TrendingUp size={14} /> +3.5% vs last week
            </span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" h="100%">
              <AreaChart data={charts.ridershipTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRiders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,92,246,0.1)"/>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ background: 'rgba(12,12,29,0.95)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '12px', color: '#fff', fontSize: '12px', backdropFilter: 'blur(20px)' }} />
                <Area type="monotone" dataKey="riders" stroke="url(#gradientLine)" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRiders)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassmorphicCard>

        {/* Crowd Density by Line (Radar) */}
        <GlassmorphicCard className="space-y-4" gradient="cyan">
          <h3 className="font-bold text-lg">Density Index by Line</h3>
          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" h="100%">
              <RadarChart cx="50%" cy="50%" radius="70%" data={charts.crowdDensity}>
                <PolarGrid stroke="rgba(139,92,246,0.15)"/>
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={10} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94a3b8" opacity={0.3} fontSize={9} />
                <Radar name="Operator Average" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.25} strokeWidth={2} />
                <Radar name="Platform Actual" dataKey="B" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.15} strokeWidth={2} />
                <Tooltip contentStyle={{ background: 'rgba(12,12,29,0.95)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '12px', color: '#fff', fontSize: '11px', backdropFilter: 'blur(20px)' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </GlassmorphicCard>
      </div>

      {/* Second Row Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up delay-200">
        <GlassmorphicCard className="space-y-4" gradient="fuchsia">
          <h3 className="font-bold text-lg">Passenger Forecast (Next 6 Hrs)</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" h="100%">
              <AreaChart data={charts.passengerForecast} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d946ef" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#d946ef" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(217,70,239,0.1)"/>
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ background: 'rgba(12,12,29,0.95)', border: '1px solid rgba(217,70,239,0.2)', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                <Area type="monotone" dataKey="predicted" name="Predicted" stroke="#d946ef" strokeWidth={2} fillOpacity={1} fill="url(#colorPredicted)" />
                <Area type="monotone" dataKey="actual" name="Actual" stroke="#8b5cf6" strokeWidth={2} fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassmorphicCard>

        <GlassmorphicCard className="space-y-4" gradient="emerald">
          <h3 className="font-bold text-lg">Route Performance / Efficiency</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" h="100%">
              <BarChart data={charts.routePerformance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(16,185,129,0.1)"/>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ background: 'rgba(12,12,29,0.95)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                <Bar dataKey="efficiency" name="Efficiency %" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassmorphicCard>
      </div>

      {/* Third Row Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up delay-250">
        <GlassmorphicCard className="space-y-4" gradient="orange">
          <h3 className="font-bold text-lg">Train Utilization</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" h="100%">
              <BarChart data={charts.trainOccupancy} layout="vertical" margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(249,115,22,0.1)"/>
                <XAxis type="number" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ background: 'rgba(12,12,29,0.95)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                <Bar dataKey="occupancy" name="Occupancy %" fill="#f97316" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassmorphicCard>

        <GlassmorphicCard className="space-y-4" gradient="rose">
          <h3 className="font-bold text-lg">Alert Statistics</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" h="100%">
              <BarChart data={charts.alertStatistics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(244,63,94,0.1)"/>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ background: 'rgba(12,12,29,0.95)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                <Bar dataKey="count" name="Total Alerts" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassmorphicCard>
      </div>

      {/* Bottom Grid: Recent Activity & System Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up delay-300">
        {/* Top 5 Congested Stations */}
        <GlassmorphicCard className="space-y-4" gradient="red">
          <h3 className="font-bold text-lg">Top Congested Stations</h3>
          <div className="space-y-4 pt-2">
            {charts.stationCongestion.map((st, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-800 dark:text-white">{st.name}</span>
                  <span className={st.density > 80 ? 'text-red-500 dark:text-red-400 font-bold' : st.density > 60 ? 'text-amber-500 dark:text-amber-400' : 'text-cyan-600 dark:text-cyan-400'}>
                    {st.density}% capacity
                  </span>
                </div>
                <div className="w-full bg-slate-200/50 dark:bg-white/5 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      st.density > 80 ? 'bg-gradient-to-r from-red-500 to-rose-500 pulse-red' : st.density > 60 ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                    }`}
                    style={{ width: `${st.density}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassmorphicCard>

        {/* Delay Statistics breakdown */}
        <GlassmorphicCard className="space-y-4" gradient="amber">
          <h3 className="font-bold text-lg">Incident Delay Causes</h3>
          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" h="100%">
              <PieChart>
                <Pie
                  data={charts.delayStatistics}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {charts.delayStatistics.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'rgba(12,12,29,0.95)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '12px', color: '#fff', fontSize: '11px', backdropFilter: 'blur(20px)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassmorphicCard>

        {/* Recent Operations Activity Log */}
        <GlassmorphicCard className="space-y-4" gradient="violet">
          <h3 className="font-bold text-lg">System Logs Feed</h3>
          <div className="flow-root pt-2">
            <ul className="-mb-8">
              {recentActivity.map((activity, idx) => (
                <li key={activity.id}>
                  <div className="relative pb-6">
                    {idx !== recentActivity.length - 1 ? (
                      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gradient-to-b from-violet-500/30 to-cyan-500/30" aria-hidden="true" />
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-4 ring-[var(--card)] ${
                          activity.type === 'Overcrowding' ? 'bg-gradient-to-br from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/20' 
                          : activity.type === 'Train Delay' ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20' 
                          : 'bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/20'
                        }`}>
                          <HelpCircle size={16} />
                        </span>
                      </div>
                      <div className="flex-1 min-w-0 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                            {activity.event}
                          </p>
                        </div>
                        <div className="text-right text-[10px] whitespace-nowrap text-slate-500 dark:text-slate-400 font-bold uppercase">
                          {activity.time}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </GlassmorphicCard>

        <GlassmorphicCard className="space-y-4" gradient="indigo">
          <h3 className="font-bold text-lg">AI Operational Insights</h3>
          <div className="space-y-3 pt-2">
            {(data.aiInsights || []).map((insight, idx) => (
              <div key={idx} className="p-3 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/50 flex gap-3 shadow-sm">
                <div className="pt-0.5">
                  {insight.type === 'Predictive' ? <Zap className="text-yellow-500" size={18} /> : 
                   insight.type === 'Warning' ? <AlertTriangle className="text-red-500" size={18} /> :
                   insight.type === 'Actionable' ? <Activity className="text-blue-500" size={18} /> :
                   <CheckCircle className="text-emerald-500" size={18} />}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase mb-1">{insight.type}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-snug">{insight.message}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassmorphicCard>
      </div>
    </div>
  );
};

export default Dashboard;
