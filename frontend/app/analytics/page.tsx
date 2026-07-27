'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, TrendingUp, BarChart3, PieChart, LineChart, Calendar, AlertCircle } from 'lucide-react';
import { apiService } from '@/lib/api';

export default function Analytics() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [data, setData] = useState<any>(null);
  const [kpi, setKpi] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    const email = localStorage.getItem('userEmail');
    if (!loggedIn) {
      router.push('/');
    } else {
      setIsLoggedIn(true);
      setUserEmail(email || '');
    }
  }, [router]);

  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchData = async () => {
      try {
        // Fetch KPI data from real endpoint
        const kpiResponse = await fetch('http://localhost:8000/api/dashboard/kpi');
        const kpiData = await kpiResponse.json();
        setKpi(kpiData.kpis);

        // Fetch other analytics data
        const [forecast, topStations, hourly] = await Promise.all([
          apiService.getForecast(),
          apiService.getTopStations(15),
          apiService.getHourlyPattern(),
        ]);

        setData({ forecast, topStations, hourly });
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    router.push('/');
  };

  if (!isLoggedIn || loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  // Calculate metrics from KPI data
  const totalPassengers = kpi?.total_passengers_today || 0;
  const activeStations = kpi?.active_stations || 0;
  const congestedStations = kpi?.congested_stations || 0;
  const activeAlerts = kpi?.active_alerts || 0;

  const peakHour = data?.hourly?.peak_avg || 0;
  const offPeakHour = data?.hourly?.off_peak_avg || 0;
  const avgHourly = totalPassengers > 0 ? totalPassengers / 24 : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* HEADER */}
      <header className="border-b border-slate-800 bg-slate-900 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center font-bold">MF</div>
            <div>
              <h1 className="text-2xl font-bold">MetroFlow Analytics</h1>
              <p className="text-xs text-slate-400">Real-time Metrics Dashboard</p>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <p className="text-sm text-slate-300">{userEmail}</p>
            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-medium transition">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* KPI CARDS FROM REAL API */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Passengers */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-lg p-6 hover:border-cyan-500/50 transition">
            <TrendingUp className="text-green-500 mb-2" size={24} />
            <p className="text-slate-400 text-sm mb-1">Total Passengers (24h)</p>
            <p className="text-3xl font-bold">{(totalPassengers / 1000000).toFixed(2)}M</p>
            <p className="text-xs text-green-400 mt-2">✓ Real data from API</p>
          </div>

          {/* Active Stations */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-lg p-6 hover:border-blue-500/50 transition">
            <BarChart3 className="text-blue-500 mb-2" size={24} />
            <p className="text-slate-400 text-sm mb-1">Active Stations</p>
            <p className="text-3xl font-bold">{activeStations}</p>
            <p className="text-xs text-blue-400 mt-2">Operating now</p>
          </div>

          {/* Congested Stations */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-lg p-6 hover:border-orange-500/50 transition">
            <AlertCircle className="text-orange-500 mb-2" size={24} />
            <p className="text-slate-400 text-sm mb-1">Congested Stations</p>
            <p className="text-3xl font-bold text-orange-400">{congestedStations}</p>
            <p className="text-xs text-orange-400 mt-2">{((congestedStations / activeStations) * 100).toFixed(1)}% of total</p>
          </div>

          {/* Active Alerts */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-lg p-6 hover:border-red-500/50 transition">
            <AlertCircle className={activeAlerts > 0 ? 'text-red-500' : 'text-green-500'} size={24} />
            <p className="text-slate-400 text-sm mb-1">Active Alerts</p>
            <p className={`text-3xl font-bold ${activeAlerts > 0 ? 'text-red-400' : 'text-green-400'}`}>{activeAlerts}</p>
            <p className={`text-xs mt-2 ${activeAlerts > 0 ? 'text-red-400' : 'text-green-400'}`}>{activeAlerts === 0 ? '✓ All clear' : '⚠ Needs attention'}</p>
          </div>
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Hourly Distribution */}
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <LineChart className="text-cyan-500" size={20} />
              24-Hour Hourly Distribution
            </h2>
            <div className="h-80 bg-slate-800/50 rounded-lg p-4 flex items-end gap-1 overflow-x-auto">
              {data?.hourly?.hourly_pattern?.slice(0, 24).map((h: any, i: number) => (
                <div
                  key={i}
                  className="flex-1 min-w-12 bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t-sm hover:from-cyan-500 hover:to-cyan-300 transition cursor-pointer group relative"
                  style={{ height: `${(h.avg_passengers / Math.max(...data.hourly.hourly_pattern.slice(0, 24).map((x: any) => x.avg_passengers))) * 100}%` }}
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 invisible group-hover:visible bg-slate-900 text-white text-xs p-2 rounded whitespace-nowrap border border-slate-700">
                    {h.hour}:00 - {h.avg_passengers}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between text-xs text-slate-400">
              <span>00:00</span>
              <span>06:00</span>
              <span>12:00</span>
              <span>18:00</span>
              <span>23:00</span>
            </div>
          </div>

          {/* Top 15 Stations */}
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <BarChart3 className="text-purple-500" size={20} />
              Top 15 Busiest Stations
            </h2>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {data?.topStations?.top_stations?.slice(0, 15).map((s: any, i: number) => (
                <div key={s.station_id} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">Station {s.station_id}</p>
                    <p className="text-xs text-slate-500">{(s.total_passengers / 1000).toFixed(1)}K passengers</p>
                  </div>
                  <div className="h-6 bg-slate-700 rounded-full flex-1 max-w-32 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full"
                      style={{
                        width: `${(s.total_passengers / Math.max(...data.topStations.top_stations.map((x: any) => x.total_passengers))) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-xs font-semibold text-slate-300 w-12 text-right">{(s.total_passengers / 1000).toFixed(1)}K</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* STATISTICS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Calendar className="text-cyan-500" size={20} />
              24-Hour Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Total</span>
                <span className="font-semibold">{(totalPassengers / 1000000).toFixed(2)}M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Avg Hourly</span>
                <span className="font-semibold">{Math.round(avgHourly).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Peak Hour</span>
                <span className="font-semibold text-orange-400">{peakHour.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-slate-700">
                <span className="text-slate-400">Off-Peak</span>
                <span className="font-semibold text-blue-400">{offPeakHour.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <LineChart className="text-orange-500" size={20} />
              Peak Hour Analysis
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Morning</span>
                <span className="font-semibold">7-9 AM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Evening</span>
                <span className="font-semibold">5-7 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Peak/Off Ratio</span>
                <span className="font-semibold text-orange-400">{(peakHour / offPeakHour).toFixed(2)}x</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-slate-700">
                <span className="text-slate-400">Busier</span>
                <span className="font-bold text-green-400">+{((peakHour / offPeakHour - 1) * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="text-green-500" size={20} />
              System Overview
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Active Stations</span>
                <span className="font-semibold">{activeStations}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Congested</span>
                <span className="font-semibold text-orange-400">{congestedStations}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Alerts</span>
                <span className={`font-semibold ${activeAlerts > 0 ? 'text-red-400' : 'text-green-400'}`}>{activeAlerts}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-slate-700">
                <span className="text-slate-400">Status</span>
                <span className="font-bold text-green-400">✓ Healthy</span>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="text-center text-sm text-slate-500 border-t border-slate-800 pt-6">
          <p>Analytics Dashboard | Connected to Real API | Last Updated: {kpi?.last_updated || 'N/A'}</p>
        </div>
      </main>
    </div>
  );
}