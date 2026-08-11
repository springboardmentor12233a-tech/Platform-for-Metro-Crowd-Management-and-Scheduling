'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Activity, AlertCircle, TrendingUp, Settings, BarChart3, Users, Zap } from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [kpi, setKpi] = useState<any>(null);
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    const loggedIn = localStorage.getItem('isLoggedIn');
    const email = localStorage.getItem('userEmail');

    if (!loggedIn || role !== 'admin') {
      router.replace("/dashboard");
    } else {
      setIsLoggedIn(true);
      setUserEmail(email || '');
    }
  }, [router]);

  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchData = async () => {
      try {
        const [kpiRes, healthRes, usersRes] = await Promise.all([
          fetch("http://localhost:8000/api/dashboard/kpi"),
          fetch("http://localhost:8000/api/system/health"),
          fetch("http://localhost:8000/api/admin/users")
        ]);

        const kpiData = await kpiRes.json();
        const healthData = await healthRes.json();
        const usersData = await usersRes.json();
        console.log("Users Data:", usersData);

        setKpi(kpiData.kpis);
        setSystemHealth(healthData);
        setUsers(usersData);
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    router.push('/');
  };
  const handleDeleteUser = async (id: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:8000/api/admin/users/${id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      alert(result.message);

      if (result.success) {
        setUsers(users.filter((user) => user.id !== id));
      }

    } catch (error) {
      console.error(error);
      alert("Failed to delete user");
    }
  };
  const handleCreateUser = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          full_name: fullName,
          email,
          password,
          role,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert("User created successfully!");

        const usersRes = await fetch("http://localhost:8000/api/admin/users");
        const usersData = await usersRes.json();

        setUsers(usersData);

        // Clear the form
        setUsername("");
        setFullName("");
        setEmail("");
        setPassword("");
        setRole("user");
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    }
  };

  if (!isLoggedIn || loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* HEADER */}
      <header className="border-b border-slate-800 bg-slate-900 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center font-bold text-sm">AD</div>
            <div>
              <h1 className="text-2xl font-bold">MetroFlow Admin</h1>
              <p className="text-xs text-slate-400">Control Room</p>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <div className="text-right">
              <p className="text-sm text-slate-300">{userEmail}</p>
              <p className="text-xs text-purple-400">Administrator</p>
            </div>
            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-medium transition">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* EXECUTIVE KPIs */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <BarChart3 className="text-cyan-500" size={24} />
            Executive KPIs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Passengers */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <Users className="text-cyan-500" size={24} />
                <span className="text-xs px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded">LIVE</span>
              </div>
              <p className="text-slate-400 text-sm mb-1">Total Passengers</p>
              <p className="text-3xl font-bold">{(kpi?.total_passengers_today / 1000000).toFixed(2)}M</p>
              <p className="text-xs text-slate-500 mt-2">24-hour total</p>
            </div>

            {/* Active Stations */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <Activity className="text-green-500" size={24} />
                <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded">ACTIVE</span>
              </div>
              <p className="text-slate-400 text-sm mb-1">Operating Stations</p>
              <p className="text-3xl font-bold">{kpi?.active_stations}</p>
              <p className="text-xs text-slate-500 mt-2">across network</p>
            </div>

            {/* Congested Stations */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <AlertCircle className="text-orange-500" size={24} />
                <span className="text-xs px-2 py-1 bg-orange-500/20 text-orange-400 rounded">MONITOR</span>
              </div>
              <p className="text-slate-400 text-sm mb-1">Congested Stations</p>
              <p className="text-3xl font-bold text-orange-400">{kpi?.congested_stations}</p>
              <p className="text-xs text-slate-500 mt-2">{((kpi?.congested_stations / kpi?.active_stations) * 100).toFixed(1)}% of total</p>
            </div>

            {/* Active Alerts */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <Zap className={kpi?.active_alerts > 0 ? 'text-red-500' : 'text-green-500'} size={24} />
                <span className={`text-xs px-2 py-1 rounded ${kpi?.active_alerts > 0 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                  {kpi?.active_alerts > 0 ? 'CRITICAL' : 'CLEAR'}
                </span>
              </div>
              <p className="text-slate-400 text-sm mb-1">Active Alerts</p>
              <p className={`text-3xl font-bold ${kpi?.active_alerts > 0 ? 'text-red-400' : 'text-green-400'}`}>{kpi?.active_alerts}</p>
              <p className="text-xs text-slate-500 mt-2">{kpi?.active_alerts === 0 ? '✓ All clear' : '⚠ Needs attention'}</p>
            </div>
          </div>
        </div>

        {/* SYSTEM HEALTH */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Activity className="text-green-500" size={24} />
            System Health Monitor
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* API Status */}
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="font-semibold">API Server</p>
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
              </div>
              <p className="text-2xl font-bold text-green-400">{systemHealth?.services?.api || 'Unknown'}</p>
              <p className="text-xs text-slate-500 mt-2">Primary API endpoint</p>
            </div>

            {/* Database */}
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="font-semibold">Database</p>
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
              </div>
              <p className="text-2xl font-bold text-green-400">{systemHealth?.services?.database || 'Unknown'}</p>
              <p className="text-xs text-slate-500 mt-2">CSV data sources</p>
            </div>

            {/* AI Model */}
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="font-semibold">AI Model (LSTM)</p>
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
              </div>
              <p className="text-2xl font-bold text-green-400">{systemHealth?.services?.ai_model || 'Unknown'}</p>
              <p className="text-xs text-slate-500 mt-2">TensorFlow model</p>
            </div>

            {/* Scaler */}
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="font-semibold">Data Scaler</p>
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
              </div>
              <p className="text-2xl font-bold text-green-400">{systemHealth?.services?.scaler || 'Unknown'}</p>
              <p className="text-xs text-slate-500 mt-2">Normalization engine</p>
            </div>

            {/* Prediction Service */}
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="font-semibold">Prediction Service</p>
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
              </div>
              <p className="text-2xl font-bold text-green-400">{systemHealth?.services?.prediction_service || 'Unknown'}</p>
              <p className="text-xs text-slate-500 mt-2">LSTM inference</p>
            </div>

            {/* Overall Status */}
            <div className="bg-gradient-to-br from-green-900/20 to-slate-800 border border-green-700/50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="font-semibold">Overall Status</p>
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
              </div>
              <p className="text-2xl font-bold text-green-400">HEALTHY</p>
              <p className="text-xs text-green-500 mt-2">✓ All systems operational</p>
            </div>
          </div>
        </div>

        {/* ADMIN CONTROLS */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Settings className="text-purple-500" size={24} />
            Administration Panel
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* System Configuration */}
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4">System Configuration</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Alert Threshold (%)</label>
                  <input type="number" defaultValue={80} className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Update Frequency (seconds)</label>
                  <input type="number" defaultValue={10} className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white" />
                </div>
                <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-2 rounded-lg transition">
                  Save Configuration
                </button>
              </div>
            </div>

            {/* Project Information */}
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4">Project Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Project</span>
                  <span>{systemHealth?.project?.name || 'MetroFlow'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Version</span>
                  <span>{systemHealth?.project?.version || '2.0.0'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Framework</span>
                  <span>{systemHealth?.project?.framework || 'FastAPI'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">AI Model</span>
                  <span>{systemHealth?.project?.ai_model || 'TensorFlow LSTM'}</span>
                </div>
                <div className="flex justify-between text-sm pt-3 border-t border-slate-700">
                  <span className="text-slate-400">Last Updated</span>
                  <span>{systemHealth?.server_time || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DATA STATISTICS */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="text-cyan-500" size={24} />
            Data Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
              <p className="text-slate-400 text-sm mb-2">Forecast Records</p>
              <p className="text-3xl font-bold text-cyan-400">{(kpi?.forecast_records / 1000000).toFixed(1)}M</p>
              <p className="text-xs text-slate-500 mt-2">Demand predictions</p>
            </div>
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
              <p className="text-slate-400 text-sm mb-2">Traffic Records</p>
              <p className="text-3xl font-bold text-blue-400">{(kpi?.traffic_records / 1000).toFixed(1)}K</p>
              <p className="text-xs text-slate-500 mt-2">Pattern data</p>
            </div>
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
              <p className="text-slate-400 text-sm mb-2">Model Status</p>
              <p className="text-3xl font-bold text-green-400">{kpi?.model_status || 'Offline'}</p>
              <p className="text-xs text-slate-500 mt-2">LSTM predictions</p>
            </div>
          </div>
        </div>
        {/* ADD NEW USER */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">
            Add New User
          </h2>

          <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
              />

              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
              />

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
              />

              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>

            </div>

            <button
              onClick={handleCreateUser}
              className="mt-6 bg-cyan-600 hover:bg-cyan-700 px-6 py-3 rounded-lg font-semibold"
            >
              Create User
            </button>

          </div>
        </div>
        {/* USER MANAGEMENT */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">
            User Management
          </h2>

          <div className="bg-slate-900 rounded-lg overflow-hidden border border-slate-700">
            <table className="w-full">
              <thead className="bg-slate-800">
                <tr>
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Username</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Role</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-t border-slate-700"
                  >
                    <td className="p-3">{user.id}</td>
                    <td className="p-3">{user.username}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{user.role}</td>
                    <td className="p-3">
                      {user.is_active ? "🟢 Active" : "🔴 Inactive"}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
        {/* FOOTER */}
        <div className="text-center text-sm text-slate-500 border-t border-slate-800 pt-6">
          <p>Admin Control Room | {systemHealth?.services?.api === 'Running' ? '✓ All Systems Operational' : '⚠ Some systems unavailable'} | Last check: {systemHealth?.server_time}</p>
        </div>
      </main>
    </div>
  );
}
