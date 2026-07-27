'use client';

import { useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Activity, Users, AlertCircle, Zap, TrendingUp, Clock, Navigation, BarChart3, LineChart as LineChartIcon } from 'lucide-react';
import { apiService } from '@/lib/api';
import { aiService } from '@/lib/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [healthStatus, setHealthStatus] = useState('checking');
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [showAIChat, setShowAIChat] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());


  // CHECK IF USER IS LOGGED IN
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const email = localStorage.getItem("userEmail");

    if (!loggedIn) {
      router.push("/");
      return;
    }

    if (!isLoggedIn) {
      setIsLoggedIn(true);
    }
    if (email && userEmail !== email) {
      setUserEmail(email);
    }

    setLoading(false);
  }, [router, isLoggedIn, userEmail]);

  // FETCH DASHBOARD DATA
  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch health status
        const health = await apiService.getHealth();
        setHealthStatus(health.status === 'healthy' ? 'online' : 'offline');

        // Fetch KPI data
        const kpiData = await apiService.getKpi();
        console.log("KPI:", kpiData);

        // Parallel API requests
        const [forecast, alerts, topStations, hourly] = await Promise.all([
          apiService.getForecast(),
          apiService.getAlerts(),
          apiService.getTopStations(5),
          apiService.getHourlyPattern(),
        ]);

        // Get prediction
        const sampleData = [150, 145, 160, 155, 170, 165, 180, 175, 172, 168, 155, 160, 165, 170, 175, 180, 185, 190, 195, 1000, 1050, 1020, 980, 950];

        const prediction = await apiService.getPrediction(sampleData);

        // Debug logs
        console.log("Forecast:", forecast);
        console.log("Alerts:", alerts);
        console.log("Top Stations:", topStations);
        console.log("Hourly:", hourly);
        console.log("Prediction:", prediction);
        console.log("KPI:", kpiData);

        // Update state with all data
        setData({
          forecast,
          alerts,
          topStations,
          hourly,
          kpiData,
          prediction
        });

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [isLoggedIn]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    router.push('/');
  };
  const handleAIChat = async () => {
    if (!aiQuestion.trim()) return;
    try {
      const result = await aiService.askQuestion(aiQuestion);
      setAiResponse(result.answer || result.message);
    } catch (error) {
      setAiResponse('Error: Could not get AI response');
    }
  };

  if (!isLoggedIn || loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Calculate metrics
  const hourlyData = data?.hourly?.hourly_pattern?.slice(0, 24) || [];
  const peakHours = data?.forecast?.peak_hours || [];
  const offPeakAvg = data?.hourly?.off_peak_avg || 500;
  const peakAvg = data?.hourly?.peak_avg || 1000;
  const totalPassengers = data?.kpiData?.kpis?.total_passengers_today || 0;

  const chartData = {
    labels: hourlyData.map((item: any) => `${item.hour}:00`),
    datasets: [
      {
        label: "Average Passengers",
        data: hourlyData.map((item: any) => item.avg_passengers),
        borderColor: "#06b6d4",
        backgroundColor: "rgba(6,182,212,0.2)",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "#ffffff",
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#94a3b8",
        },
      },
      y: {
        ticks: {
          color: "#94a3b8",
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* HEADER */}
      <header className="border-b border-slate-800 bg-slate-900 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center font-bold">MF</div>
            <div>
              <h1 className="text-2xl font-bold">MetroFlow</h1>
              <p className="text-xs text-slate-400">Live Operations Dashboard</p>
            </div>
            <div className="hidden lg:flex items-center gap-4 ml-auto">
              <a href="/dashboard" className="text-sm font-medium px-4 py-2 rounded-lg bg-cyan-600/20 text-cyan-300 hover:bg-cyan-600/30 transition">Dashboard</a>
              <a href="/analytics" className="text-sm font-medium px-4 py-2 rounded-lg text-slate-400 hover:text-slate-300 hover:bg-slate-800 transition">Analytics</a>
              <a href="/admin" className="text-sm font-medium px-4 py-2 rounded-lg text-slate-400 hover:text-slate-300 hover:bg-slate-800 transition">Admin</a>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <p className="text-sm text-slate-300">{userEmail}</p>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${healthStatus === 'online' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span className="text-xs text-slate-400">{healthStatus}</span>
            </div>
            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-medium transition">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* KPI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* API Status */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-lg p-6 hover:border-cyan-500/50 transition">
            <div className="flex items-center justify-between mb-4">
              <Activity className="text-cyan-500" size={24} />
              <span className={`text-xs px-2 py-1 rounded-full ${healthStatus === 'online' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {healthStatus.toUpperCase()}
              </span>
            </div>
            <p className="text-slate-400 text-sm mb-1">API Status</p>
            <p className="text-3xl font-bold">{healthStatus === 'online' ? '✓' : '✗'}</p>
          </div>
          {/* Active Stations */}

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-lg p-6 hover:border-green-500/50 transition">

            <div className="flex items-center justify-between mb-4">
              <Navigation className="text-green-500" size={24} />
            </div>

            <p className="text-slate-400 text-sm mb-1">
              Active Stations
            </p>

            <p className="text-3xl font-bold text-green-400">
              {data?.kpiData?.kpis?.active_stations}
            </p>

          </div>

          {/* Active Alerts */}

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-lg p-6 hover:border-yellow-500/50 transition">

            <div className="flex items-center justify-between mb-4">
              <AlertCircle className="text-yellow-500" size={24} />
            </div>

            <p className="text-slate-400 text-sm mb-1">
              Active Alerts
            </p>

            <p className="text-3xl font-bold text-yellow-400">
              {data?.kpiData?.kpis?.active_alerts}
            </p>

          </div>
          {/* Congested Stations */}

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-lg p-6 hover:border-red-500/50 transition">

            <div className="flex items-center justify-between mb-4">
              <Users className="text-red-500" size={24} />
            </div>

            <p className="text-slate-400 text-sm mb-1">
              Congested Stations
            </p>

            <p className="text-3xl font-bold text-red-400">
              {data?.kpiData?.kpis?.congested_stations}
            </p>

          </div>
          {/* Forecast Records */}

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-lg p-6 hover:border-purple-500/50 transition">

            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="text-purple-500" size={24} />
            </div>

            <p className="text-slate-400 text-sm mb-1">
              Forecast Records
            </p>

            <p className="text-3xl font-bold text-purple-400">
              {data?.kpiData?.kpis?.forecast_records?.toLocaleString()}
            </p>

          </div>
          {/* AI Model */}

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-lg p-6 hover:border-cyan-500/50 transition">

            <div className="flex items-center justify-between mb-4">
              <Zap className="text-cyan-500" size={24} />
            </div>

            <p className="text-slate-400 text-sm mb-1">
              AI Model
            </p>

            <p className="text-3xl font-bold text-cyan-400">
              {data?.kpiData?.kpis?.model_status}
            </p>

          </div>

          {/* Total Passengers */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-lg p-6 hover:border-purple-500/50 transition">
            <div className="flex items-center justify-between mb-4">
              <Users className="text-purple-500" size={24} />
              <TrendingUp className="text-green-500" size={16} />
            </div>
            <p className="text-slate-400 text-sm mb-1">Total Passengers (24h)</p>
            <p className="text-3xl font-bold">{(totalPassengers / 1000000).toFixed(2)}M</p>
            <p className="text-xs text-green-400 mt-2">+12% from yesterday</p>
          </div>

          {/* Active Alerts */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-lg p-6 hover:border-red-500/50 transition">
            <div className="flex items-center justify-between mb-4">
              <AlertCircle className={data?.alerts?.active_count > 0 ? 'text-red-500' : 'text-green-500'} size={24} />
              {data?.alerts?.active_count > 0 && <span className="animate-pulse text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded">ACTIVE</span>}
            </div>
            <p className="text-slate-400 text-sm mb-1">Active Alerts</p>
            <p className="text-3xl font-bold">{data?.alerts?.active_count || 0}</p>
            <p className="text-xs text-slate-500 mt-2">{data?.alerts?.total_alerts || 0} total today</p>
          </div>

          {/* Next Hour Prediction */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-lg p-6 hover:border-yellow-500/50 transition">
            <div className="flex items-center justify-between mb-4">
              <Zap className="text-yellow-500" size={24} />
              <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded">AI</span>
            </div>
            <p className="text-slate-400 text-sm mb-1">Next Hour Prediction</p>
            <p className="text-3xl font-bold">{data?.prediction?.prediction || 0}</p>
            <p className="text-xs text-blue-400 mt-2">{(data?.prediction?.confidence * 100).toFixed(0)}% confidence</p>
          </div>
        </div>

        {/* CHARTS ROW 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Hourly Trend Chart */}
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <LineChartIcon className="text-cyan-500" size={20} />
              <h2 className="text-xl font-bold">24-Hour Passenger Trend</h2>
            </div>
            {hourlyData.length > 0 ? (
              <div className="h-64 bg-slate-800/50 rounded-lg p-4 flex items-end gap-1 overflow-x-auto">
                {hourlyData.map((d: any, i: number) => {
                  const maxVal = Math.max(...hourlyData.map((h: any) => h.avg_passengers));
                  const percentage = (d.avg_passengers / maxVal) * 100;
                  const isPeak = peakHours.includes(d.hour);

                  return (
                    <div
                      key={i}
                      className={`flex-1 min-w-10 rounded-t-sm transition cursor-pointer group relative ${isPeak
                        ? 'bg-gradient-to-t from-orange-600 to-orange-400 hover:from-orange-500 hover:to-orange-300'
                        : 'bg-gradient-to-t from-cyan-600 to-cyan-400 hover:from-cyan-500 hover:to-cyan-300'
                        }`}
                      style={{ height: `${percentage}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 invisible group-hover:visible bg-slate-900 text-white text-xs p-2 rounded whitespace-nowrap border border-slate-700 z-10">
                        {d.hour}:00 - {d.avg_passengers}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-slate-400">Loading chart...</p>
            )}
            <div className="mt-4 flex justify-between text-xs text-slate-400">
              <span>00:00</span>
              <span>06:00</span>
              <span>12:00</span>
              <span>18:00</span>
              <span>23:00</span>
            </div>
          </div>

          {/* Peak vs Off-Peak Analysis */}
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="text-purple-500" size={20} />
              <h2 className="text-xl font-bold">Peak Hours Analysis</h2>
            </div>
            <div className="space-y-6">
              {/* Peak Hours */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-slate-300">Peak Hours (7-9am, 5-7pm)</span>
                  <span className="text-sm font-bold text-orange-400">{peakAvg.toLocaleString()}</span>
                </div>
                <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-500" style={{ width: '75%' }}></div>
                </div>
              </div>

              {/* Off-Peak */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-slate-300">Off-Peak Hours</span>
                  <span className="text-sm font-bold text-green-400">{offPeakAvg.toLocaleString()}</span>
                </div>
                <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500" style={{ width: '40%' }}></div>
                </div>
              </div>

              {/* Ratio Box */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-4 border border-slate-600">
                <p className="text-slate-400 text-sm mb-2">Peak/Off-Peak Ratio</p>
                <p className="text-3xl font-bold text-yellow-400">{(peakAvg / offPeakAvg).toFixed(2)}x</p>
                <p className="text-xs text-slate-500 mt-2">Peak hours are {((peakAvg / offPeakAvg - 1) * 100).toFixed(0)}% busier</p>
              </div>

              {/* Visual Comparison */}
              <div className="flex gap-4 pt-4">
                <div className="flex-1 bg-slate-800/50 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-2">Peak Avg</p>
                  <div className="flex items-end gap-1 h-12">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex-1 bg-gradient-to-t from-orange-600 to-orange-400 rounded-t-sm" style={{ height: `${20 + i * 15}%` }}></div>
                    ))}
                  </div>
                </div>
                <div className="flex-1 bg-slate-800/50 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-2">Off-Peak Avg</p>
                  <div className="flex items-end gap-1 h-12">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex-1 bg-gradient-to-t from-green-600 to-green-400 rounded-t-sm" style={{ height: `${5 + i * 8}%` }}></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CHARTS ROW 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Peak Hours Cards */}
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <Clock className="text-cyan-500" size={20} />
              <h2 className="text-lg font-bold">Peak Hours Today</h2>
            </div>
            {peakHours.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {peakHours.map((hour: number) => (
                  <div key={hour} className="bg-gradient-to-br from-orange-900/30 to-red-900/30 border border-orange-500/30 rounded-lg p-4 text-center hover:border-orange-500 transition">
                    <p className="text-3xl font-bold text-orange-400">{hour}</p>
                    <p className="text-xs text-slate-400">:00</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400">Loading...</p>
            )}
          </div>

          {/* Top 5 Stations */}
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <Navigation className="text-purple-500" size={20} />
              <h2 className="text-lg font-bold">Top Stations</h2>
            </div>
            {data?.topStations?.top_stations ? (
              <div className="space-y-3">
                {data.topStations.top_stations.slice(0, 5).map((s: any, i: number) => (
                  <div key={s.station_id} className={`rounded-lg p-3 border transition ${s.total_passengers > 100000
                      ? "bg-red-900/30 border-red-500 animate-pulse"
                      : "bg-slate-800/50 border-slate-700/50 hover:border-slate-600"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center text-xs font-bold">
                          {i + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">Station {s.station_id}</p>
                          <p className="text-xs text-slate-500">{(s.total_passengers / 1000).toFixed(1)}K passengers</p>
                        </div>
                      </div>
                      <div className="w-16 h-1 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-cyan-600 to-blue-600" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400">Loading...</p>
            )}
          </div>

          {/* System Health */}
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="text-green-500" size={20} />
              <h2 className="text-lg font-bold">System Health</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-green-500/20">
                <span className="text-sm text-slate-300">API Uptime</span>
                <span className="font-bold text-green-400">{data?.kpiData?.kpis?.uptime || '99.8%'}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-blue-500/20">
                <span className="text-sm text-slate-300">Model Accuracy</span>
                <span className="font-bold text-blue-400">{data?.prediction?.confidence_percentage || '92.1%'}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-cyan-500/20">
                <span className="text-sm text-slate-300">Response Time</span>
                <span className="font-bold text-cyan-400">{data?.kpiData?.kpis?.response_time || '45ms'}</span>
              </div>
            </div>
          </div>
        </div>
        {/* Passenger Trend Chart */}

        <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">
            Passenger Trend (24 Hours)
          </h2>

          <Line
            data={chartData}
            options={chartOptions}
          />
        </div>
        {/* AI Train Scheduling */}

        <h2 className="text-2xl font-bold mb-6">
          🚆 AI Train Scheduling Dashboard
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

          {/* Recommended Frequency */}

          <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">

            <h2 className="text-lg font-bold mb-4">
              Recommended Frequency
            </h2>

            <p className="text-5xl font-bold text-cyan-400">
              {data?.prediction?.train_schedule?.recommended_frequency}
            </p>

            <p className="text-slate-400 mt-2">
              Trains / Hour
            </p>

            <div className="mt-4 bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3">
              <p className="text-cyan-300 text-sm">
                {data?.prediction?.train_schedule?.recommendation}
              </p>
            </div>

          </div>

          {/* Required Trains */}

          <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">

            <h2 className="text-lg font-bold mb-4">
              Required Trains
            </h2>

            <p className="text-4xl font-bold text-green-400">
              {data?.prediction?.required_trains}
            </p>

          </div>

          {/* Platform Load */}

          <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">

            <h2 className="text-lg font-bold mb-4">
              Platform Load
            </h2>

            <span
              className={`px-4 py-2 rounded-full text-sm font-bold ${data?.prediction?.platform_load === "Low"
                ? "bg-green-500/20 text-green-400"
                : data?.prediction?.platform_load === "Moderate"
                  ? "bg-yellow-500/20 text-yellow-400"
                  : "bg-red-500/20 text-red-400 animate-pulse"
                }`}
            >
              {data?.prediction?.platform_load}
            </span>

          </div>

          {/* Frequency Adjustment */}

          <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">

            <h2 className="text-lg font-bold mb-4">
              Frequency Adjustment
            </h2>

            <p className="text-3xl font-bold text-blue-400">
              {data?.prediction?.frequency_adjustment?.action}
            </p>

            <p className="text-slate-400 mt-2">
              Current: {data?.prediction?.frequency_adjustment?.current_frequency}
            </p>

            <p className="text-slate-400">
              Recommended: {data?.prediction?.frequency_adjustment?.recommended_frequency}
            </p>

          </div>
          {/* Peak Hour Optimization */}

          <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">

            <h2 className="text-lg font-bold mb-4">
              Peak Hour
            </h2>

            <p className="text-2xl font-bold text-orange-400">
              {data?.prediction?.peak_hour_optimization?.priority}
            </p>

            <p className="text-slate-400 mt-2">
              Hour:
              {data?.prediction?.peak_hour_optimization?.hour}
            </p>

            <p className="text-slate-400">
              Optimized:
              {data?.prediction?.peak_hour_optimization?.optimized_passengers}
            </p>

          </div>

          {/* Schedule Alert */}

          <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">

            <h2 className="text-lg font-bold mb-4">
              Schedule Alert
            </h2>

            <p className="text-green-400 font-bold">
              {data?.prediction?.schedule_alert?.status}
            </p>

            <p className="text-sm text-slate-400 mt-2">
              {data?.prediction?.schedule_alert?.message}
            </p>

          </div>
        </div>
        {/* System Status */}

        <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 mt-8">

          <h2 className="text-2xl font-bold mb-6">
            🚦 System Status
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            <div className="bg-slate-800 rounded-lg p-5">
              <p className="text-slate-400 text-sm">AI Model</p>
              <p className="text-green-400 text-2xl font-bold">ONLINE</p>
            </div>


            <div className="bg-slate-800 rounded-lg p-5">
              <p className="text-slate-400 text-sm">Prediction Accuracy</p>
              <p className="text-cyan-400 text-2xl font-bold">
                {data?.prediction?.confidence_percentage}
              </p>
            </div>

            <div className="bg-slate-800 rounded-lg p-5">
              <p className="text-slate-400 text-sm">Platform Status</p>
              <p className="text-yellow-400 text-2xl font-bold">
                {data?.prediction?.platform_load}
              </p>
            </div>

            <div className="bg-slate-800 rounded-lg p-5">
              <p className="text-slate-400 text-sm">Last Updated</p>

              <p className="text-white text-xl font-bold">
                {currentTime.toLocaleTimeString()}
              </p>

              <p className="text-green-400 text-xs mt-2 animate-pulse">
                ● Live
              </p>
            </div>
          </div>
          </div>
          {/* ALERTS SECTION */}
          {data?.alerts?.active_count > 0 && (
            <div className="mb-8 bg-red-500/10 border border-red-500/30 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="text-red-500" size={24} />
                <h2 className="text-xl font-bold text-red-400">⚠️ Active Alerts</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {data.alerts.alerts.slice(0, 4).map((alert: any, idx: number) => (
                  <div key={idx} className="bg-red-500/5 border border-red-500/20 rounded-lg p-4 hover:border-red-500/40 transition">
                    <p className="text-sm font-semibold text-red-400">Station {alert.station_id}</p>
                    <p className="text-xs text-slate-400 mt-1">{alert.message}</p>
                    <p className="text-xs text-red-500 mt-2">Severity: {alert.severity}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* AI Chat Button */}
          <button
            onClick={() => setShowAIChat(!showAIChat)}
            className="fixed bottom-6 right-6 w-14 h-14 bg-red-600 rounded-full flex items-center justify-center text-white text-2xl hover:scale-110 transition shadow-lg z-50"
          >
            💬
          </button>

          {/* AI Chat Modal */}
          {showAIChat && (
            <div className="fixed bottom-24 right-6 w-80 bg-slate-900 border border-cyan-500 rounded-lg p-4 shadow-2xl z-50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-cyan-400 font-bold">MetroFlow AI</h3>
                <button onClick={() => setShowAIChat(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>
              <input
                type="text"
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAIChat()}
                placeholder="Ask anything..."
                className="w-full bg-slate-800 text-white p-2 rounded mb-2 border border-slate-700"
              />
              <button
                onClick={handleAIChat}
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded font-medium transition"
              >
                Send
              </button>
              {aiResponse && (
                <div className="mt-3 p-3 bg-slate-800 rounded border border-slate-700">
                  <p className="text-cyan-300 text-sm">{aiResponse}</p>
                </div>
              )}
            </div>
          )}
      </main>
    </div >
  );
}