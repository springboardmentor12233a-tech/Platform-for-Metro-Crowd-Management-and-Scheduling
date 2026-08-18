'use client';

import { useHour } from "../components/HourContext";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Activity,
  AlertCircle,
  Navigation,
  Users,
  Brain
} from 'lucide-react';
import { apiService } from '@/lib/api';
import DashboardContent from '@/components/dashboard/DashboardContent';
import { Line } from "react-chartjs-2";

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
  console.log("Dashboard component rendered");
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [healthStatus, setHealthStatus] = useState('checking');
  const [currentTime, setCurrentTime] = useState(new Date());


  const crowdStations = data?.crowd?.stations || [];

  const crowdSummary = {
    total: crowdStations.length,

    normal: crowdStations.filter(
      (s: any) => s.status === "Normal"
    ).length,

    overcrowded: crowdStations.filter(
      (s: any) => s.status === "Overcrowded"
    ).length,

    critical: crowdStations.filter(
      (s: any) => s.status === "Critical"
    ).length,
  };

  const peakHours = [8, 9, 10, 17, 18, 19];
  const { selectedHour } = useHour();

  // CHECK IF USER IS LOGGED IN
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const email = localStorage.getItem("userEmail") || "";

    if (!loggedIn) {
      router.push("/login");
      return;
    }

    setIsLoggedIn(true);
    setUserEmail(email);
    setLoading(false);
  }, [router]);

  // FETCH DASHBOARD DATA
  useEffect(() => {

    console.log("isLoggedIn =", isLoggedIn);
    console.log("selectedHour =", selectedHour);

    if (!isLoggedIn) {
      return;
    }

    const fetchData = async () => {
      console.log("fetchData started");
      try {
        // Fetch health status
        const health = await apiService.getHealth();
        console.log("Health:", health);
        setHealthStatus(health.status === 'healthy' ? 'online' : 'offline');

        // Fetch KPI data
        const kpiData = await apiService.getKpi(selectedHour);
        console.log("KPI:", kpiData);


        // Parallel API requests
        console.log("Selected Hour:", selectedHour);

        const [alerts, topStations, crowd, hourly] = await Promise.all([
          apiService.getAlerts(selectedHour),
          apiService.getTopStations(5, selectedHour),
          apiService.getAllStations(selectedHour),
          apiService.getHourlyPattern()
        ]);
        console.log("HOURLY DATA FROM API:", hourly);
        console.log("HOURLY RESPONSE:", hourly);
        console.log("HOURLY PATTERN:", hourly.hourly_pattern);
        console.log("HOURLY TYPE:", typeof hourly);
        console.log("Alerts Response:", alerts);
        console.log("Crowd Response:", crowd);
        console.log("CROWD SUMMARY DEBUG:", {
          hour: selectedHour,
          total: crowd?.total,
          stations: crowd?.stations?.length,
          statuses: crowd?.stations?.reduce((acc: any, s: any) => {
            acc[s.status] = (acc[s.status] || 0) + 1;
            return acc;
          }, {})
        });

        // Get prediction
        const sampleData = [150, 145, 160, 155, 170, 165, 180, 175, 172, 168, 155, 160, 165, 170, 175, 180, 185, 190, 195, 1000, 1050, 1020, 980, 950];

        const prediction = await apiService.getPrediction(sampleData);

        // Debug logs
        console.log("Alerts:", alerts);
        console.log("Top Stations:", topStations);
        console.log("Prediction:", prediction);
        console.log("KPI:", kpiData);

        // Update state with all data
        setData({
          alerts,
          topStations,
          crowd,
          hourly: hourly.hourly_pattern,
          kpiData,
          prediction
        });
        console.log("Crowd:", crowd);
        console.log("Alerts:", alerts);

        setLoading(false);

      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        setLoading(false);
      }

    };

    fetchData();

    const interval = setInterval(fetchData, 10000);

    return () => clearInterval(interval);

  }, [isLoggedIn, selectedHour]);



  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
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
    <div className="text-white">
      <main className="w-full px-6 py-8">

        <DashboardContent
          data={data}
          healthStatus={healthStatus}
          currentTime={currentTime}
        />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

          <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
            <Users className="text-cyan-400 mb-3" />
            <p className="text-slate-400">Total Passengers Today</p>
            <h2 className="text-3xl font-bold">
              {data?.kpiData?.kpis?.total_passengers_today?.toLocaleString() || "N/A"}
            </h2>
          </div>


          <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
            <Navigation className="text-green-400 mb-3" />
            <p className="text-slate-400">Active Stations</p>
            <h2 className="text-3xl font-bold">
              {data?.kpiData?.kpis?.active_stations || "N/A"}
            </h2>
          </div>


          <div className="bg-slate-900 border border-blue-500/30 rounded-lg p-6">
            <Brain className="text-blue-400 mb-3" />
            <p className="text-slate-400">Next Hour Prediction</p>
            <h2 className="text-3xl font-bold">
              {data?.prediction?.prediction
                ? `${data.prediction.prediction.toLocaleString()}`
                : "N/A"}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Expected passengers
            </p>
          </div>


          <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
            <Brain className="text-purple-400 mb-3" />
            <p className="text-slate-400">AI Accuracy</p>
            <h2 className="text-3xl font-bold">
              92.1%
            </h2>
          </div>

        </div>

        <div className="grid grid-cols-4 gap-6 mb-8">

          <div className="bg-slate-900 border border-cyan-500 rounded-lg p-5">
            <p>Total Stations</p>
            <h2 className="text-4xl font-bold">
              262
            </h2>
          </div>


          <div className="bg-slate-900 border border-green-500 rounded-lg p-5">
            <p className="text-green-400">
              🟢 Normal
            </p>
            <h2 className="text-4xl font-bold">
              {crowdSummary.normal}
            </h2>
          </div>


          <div className="bg-slate-900 border border-yellow-500 rounded-lg p-5">
            <p className="text-yellow-400">
              🟡 Overcrowded
            </p>
            <h2 className="text-4xl font-bold">
              {crowdSummary.overcrowded}
            </h2>
          </div>


          <div className="bg-slate-900 border border-red-500 rounded-lg p-5">
            <p className="text-red-400">
              🔴 Critical
            </p>
            <h2 className="text-4xl font-bold">
              {crowdSummary.critical}
            </h2>
          </div>

        </div>


        {/* CHARTS ROW 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">


          {/* Top 5 Stations */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <Navigation className="text-purple-500" size={20} />
              <h2 className="text-lg font-bold">Top Stations</h2>
            </div>

            {data?.topStations?.top_stations ? (
              <div className="space-y-3">
                {data.topStations.top_stations.slice(0, 5).map((s: any, i: number) => (
                  <div
                    key={s.station_id}
                    className="bg-slate-800/50 border border-slate-700 rounded-lg p-3"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center text-xs font-bold">
                          {i + 1}
                        </div>

                        <div>
                          <p className="font-semibold text-sm">
                            {s.station_name || `Station ${s.station_id}`}
                          </p>

                          <p className="text-xs text-slate-500">
                            {s.total_passengers.toLocaleString()} passengers
                          </p>
                        </div>
                      </div>

                      <div className="w-16 h-1 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-600 to-blue-600"
                          style={{ width: `${Math.min(s.capacity_percentage || 0, 100)}%` }}
                        ></div>
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
                <span className="text-sm text-slate-300">API Status</span>
                <span className="font-bold text-green-400">
                  {healthStatus.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-blue-500/20">
                <span className="text-sm text-slate-300">Model Accuracy</span>
                <span className="font-bold text-blue-400">92.1%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-cyan-500/20">
                <span className="text-sm text-slate-300">Model Status</span>
                <span className="font-bold text-cyan-400">
                  {data?.kpiData?.kpis?.model_status || "Online"}
                </span>
              </div>
            </div>
          </div>
        </div >
        {/* Passenger Trend Chart */}
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 mb-8">

          <h2 className="text-xl font-bold mb-4">
            Passenger Trend (24 Hours)
          </h2>

          <div className="h-[400px] w-full">
            {data?.hourly ? (
              <>
                {console.log("CHART HOURLY DATA:", data.hourly)}

                <Line
                  data={{
                    labels: data.hourly.map(
                      (item: any) => `${item.hour}:00`
                    ),

                    datasets: [
                      {
                        label: "Passenger Flow",
                        data: data.hourly.map(
                          (item: any) => item.avg_passengers
                        ),
                        borderColor: "#22d3ee",
                        backgroundColor: "#22d3ee",
                        borderWidth: 3,
                        pointRadius: 5,
                        tension: 0.4
                      }
                    ]
                  }}

                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        labels: {
                          color: "#ffffff"
                        }
                      }
                    },
                    scales: {
                      x: {
                        ticks: {
                          color: "#94a3b8"
                        }
                      },
                      y: {
                        ticks: {
                          color: "#94a3b8"
                        }
                      }
                    }
                  }}
                />
              </>
            ) : (
              <p className="text-slate-400">
                No hourly passenger data available
              </p>
            )}
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
              <p className="text-slate-400 text-sm">Prediction Confidence</p>
              <p className="text-cyan-400 text-2xl font-bold">
                {data?.prediction?.confidence_percentage || "N/A"}
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
        {
          data?.alerts?.active_count > 0 && (
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
          )
        }

      </main >

    </div >
  );
}