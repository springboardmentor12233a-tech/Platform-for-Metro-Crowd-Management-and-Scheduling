import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import api from "../api/axios";

// Real stations from the network dataset, paired with their line
const MONITORED_STATIONS = [
  { name: "Rajiv Chowk", line: "Blue line" },
  { name: "Kashmere Gate", line: "Red line" },
  { name: "Central Secretariat", line: "Yellow line" },
  { name: "Hauz Khas", line: "Magenta line" },
  { name: "Dwarka Sector 21", line: "Orange line" },
  { name: "New Delhi", line: "Yellow line" },
];

function getStatusFromPassengers(passengers) {
  if (passengers >= 1400) return "Critical";
  if (passengers >= 900) return "High";
  if (passengers >= 400) return "Moderate";
  return "Low";
}

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
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHour, setSelectedHour] = useState(new Date().getHours());
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/operators/me")
      .then((res) => setProfile(res.data))
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, [navigate]);

  useEffect(() => {
    async function fetchPredictions() {
      setLoading(true);
      try {
        const results = await Promise.all(
          MONITORED_STATIONS.map(async (station) => {
            const res = await api.get("/predictions/crowd", {
              params: { station: station.name, line: station.line, hour: selectedHour },
            });
            const passengers = res.data.predicted_passengers;
            return {
              name: station.name,
              passengers,
              status: getStatusFromPassengers(passengers),
            };
          })
        );
        setStations(results);
      } catch (err) {
        console.error("Failed to fetch predictions", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPredictions();
  }, [selectedHour]);

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
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Station-wise Crowd Density (AI Predicted)</h2>
            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-400">Hour:</label>
              <select
                value={selectedHour}
                onChange={(e) => setSelectedHour(Number(e.target.value))}
                className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm"
              >
                {Array.from({ length: 19 }, (_, i) => i + 5).map((h) => (
                  <option key={h} value={h}>{h}:00</option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <p className="text-slate-400">Loading predictions...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {stations.map((station) => (
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
                      style={{ width: `${Math.min(100, (station.passengers / 2000) * 100)}%` }}
                    />
                  </div>
                  <p className="text-sm text-slate-400">{Math.round(station.passengers)} predicted passengers</p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Congestion Overview</h2>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700" style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stations}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}
                  labelStyle={{ color: "#e2e8f0" }}
                />
                <Bar dataKey="passengers" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;