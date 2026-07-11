import React, { useEffect, useState } from 'react';
import api from '../services/api';
import GlassmorphicCard from '../components/GlassmorphicCard';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
  TrendingUp, Train, Users, AlertTriangle, Clock, Building2, HelpCircle 
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
    const interval = setInterval(fetchDashboardData, 6000); // refresh every 6s to show live changes
    return () => clearInterval(interval);
  }, []);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        {/* Page Header Skeleton */}
        <div className="h-8 bg-slate-300 dark:bg-slate-800 rounded w-1/4"></div>

        {/* KPIs Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-200 dark:bg-slate-900 rounded-2xl"></div>
          ))}
        </div>

        {/* Charts Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-slate-200 dark:bg-slate-900 rounded-2xl"></div>
          <div className="h-96 bg-slate-200 dark:bg-slate-900 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center text-red-500 font-bold glass-panel border border-red-500/20 rounded-2xl">
        {error || 'Error loading dashboard. Ensure backend and DB are active.'}
      </div>
    );
  }

  const { kpis, charts, recentActivity } = data;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
            System Dashboard
          </h1>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            Real-time crowd intelligence and schedules monitoring.
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassmorphicCard className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Passengers Today</span>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white">
              {kpis.passengersToday.toLocaleString()}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
            <Users size={22} />
          </div>
        </GlassmorphicCard>

        <GlassmorphicCard className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Trains</span>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white">{kpis.activeTrains}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center">
            <Train size={22} />
          </div>
        </GlassmorphicCard>

        <GlassmorphicCard className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">System delay ratio</span>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white">{kpis.delayPercentage}%</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Clock size={22} />
          </div>
        </GlassmorphicCard>

        <GlassmorphicCard className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Alerts</span>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white">{kpis.activeAlerts}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center">
            <AlertTriangle size={22} />
          </div>
        </GlassmorphicCard>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Ridership Trend */}
        <GlassmorphicCard className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg">Weekly Passenger Trend</h3>
            <span className="text-xs font-bold text-green-500 flex items-center gap-1">
              <TrendingUp size={14} /> +3.5% vs last week
            </span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" h="100%">
              <AreaChart data={charts.ridershipTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRiders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.1}/>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                <Area type="monotone" dataKey="riders" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorRiders)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassmorphicCard>

        {/* Crowd Density by Line (Radar) */}
        <GlassmorphicCard className="space-y-4">
          <h3 className="font-bold text-lg">Density Index by Line</h3>
          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" h="100%">
              <RadarChart cx="50%" cy="50%" radius="70%" data={charts.crowdDensity}>
                <PolarGrid stroke="#94a3b8" opacity={0.2}/>
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={10} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94a3b8" opacity={0.3} fontSize={9} />
                <Radar name="Operator Average" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.35} />
                <Radar name="Platform Actual" dataKey="B" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} />
                <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </GlassmorphicCard>
      </div>

      {/* Grid for delays, station congestion, and activity feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top 5 Congested Stations */}
        <GlassmorphicCard className="space-y-4">
          <h3 className="font-bold text-lg">Top Congested Stations</h3>
          <div className="space-y-4 pt-2">
            {charts.stationCongestion.map((st, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span>{st.name}</span>
                  <span className={st.density > 80 ? 'text-red-500 font-bold' : st.density > 60 ? 'text-orange-500' : 'text-slate-500'}>
                    {st.density}% capacity
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800/80 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      st.density > 80 ? 'bg-red-500 pulse-red' : st.density > 60 ? 'bg-orange-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${st.density}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassmorphicCard>

        {/* Delay Statistics breakdown */}
        <GlassmorphicCard className="space-y-4">
          <h3 className="font-bold text-lg">Incident Delay Causes</h3>
          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" h="100%">
              <PieChart>
                <Pie
                  data={charts.delayStatistics}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {charts.delayStatistics.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassmorphicCard>

        {/* Recent Operations Activity Log */}
        <GlassmorphicCard className="space-y-4">
          <h3 className="font-bold text-lg">System Logs Feed</h3>
          <div className="flow-root pt-2">
            <ul className="-mb-8">
              {recentActivity.map((activity, idx) => (
                <li key={activity.id}>
                  <div className="relative pb-6">
                    {idx !== recentActivity.length - 1 ? (
                      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200 dark:bg-slate-800" aria-hidden="true" />
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-4 ring-slate-100 dark:ring-slate-900 ${
                          activity.type === 'Overcrowding' ? 'bg-red-500/10 text-red-500' : activity.type === 'Train Delay' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'
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
                        <div className="text-right text-[10px] whitespace-nowrap text-slate-500 font-bold uppercase">
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
      </div>
    </div>
  );
};

export default Dashboard;
