import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import api from "../api/axios";

// Mock station data (will be replaced by real /crowd endpoint in Milestone 2)
const mockStations = [
  { name: "Rajiv Chowk", density: 82, status: "High" },
  { name: "Kashmere Gate", density: 65, status: "Moderate" },
  { name: "Central Secretariat", density: 45, status: "Low" },
  { name: "Hauz Khas", density: 90, status: "Critical" },
  { name: "Dwarka Sector 21", density: 30, status: "Low" },
  { name: "New Delhi", density: 78, status: "High" },
];

function getStatusColor(status) {
  switch (status) {
    case "Critical": return "bg-red-500";
    case "High": return "bg-orange-500";
    case "Moderate": return "bg-yellow-500";
    default: return "bg-green-500";
  }
}

function Dashboard() {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/operators/me")
      .then((res) => setProfile(res.data))
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
        <div>
          <h1 className="text-xl font-bold">MetroFlow</h1>
          <p className="text-slate-400 text-sm">Crowd Monitoring Dashboard</p>
        </div>
        <div className="flex items-center gap-4">
          {profile && (
            <span className="text-sm text-slate-300">
              {profile.full_name} <span className="text-slate-500">({profile.role})</span>
            </span>
          )}
          <button
            onClick={handleLogout}
            className="bg-slate-700 hover:bg-slate-600 text-sm px-3 py-1.5 rounded"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="p-6 space-y-6">
        <section>
          <h2 className="text-lg font-semibold mb-3">Station-wise Crowd Density</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockStations.map((station) => (
              <div
                key={station.name}
                className="bg-slate-800 rounded-lg p-4 border border-slate-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{station.name}</h3>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full text-white ${getStatusColor(station.status)}`}
                  >
                    {station.status}
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2 mb-1">
                  <div
                    className={`h-2 rounded-full ${getStatusColor(station.status)}`}
                    style={{ width: `${station.density}%` }}
                  />
                </div>
                <p className="text-sm text-slate-400">{station.density}% capacity</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Congestion Overview</h2>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700" style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockStations}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}
                  labelStyle={{ color: "#e2e8f0" }}
                />
                <Bar dataKey="density" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;