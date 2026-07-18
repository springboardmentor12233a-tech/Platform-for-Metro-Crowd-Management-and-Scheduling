import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link} from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import api from "../api/axios";

const MONITORED_STATIONS = [
  { name: "Rajiv Chowk", line: "Blue line" },
  { name: "Kashmere Gate", line: "Red line" },
  { name: "Central Secretariat", line: "Yellow line" },
  { name: "Hauz Khas", line: "Magenta line" },
  { name: "Dwarka Sector 21", line: "Orange line" },
  { name: "New Delhi", line: "Yellow line" },
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
  const [stations, setStations] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHour, setSelectedHour] = useState(new Date().getHours());
  const [liveMode, setLiveMode] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/operators/me")
      .then((res) => setProfile(res.data))
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, [navigate]);

  const fetchManualPredictions = useCallback(async (hour) => {
    setLoading(true);
    try {
      const results = await Promise.all(
        MONITORED_STATIONS.map(async (station) => {
          const res = await api.get("/predictions/crowd", {
            params: { station: station.name, line: station.line, hour },
          });
          return {
            name: station.name,
            passengers: res.data.predicted_passengers,
          };
        })
      );
      setStations(results);
      setAlerts([]);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Failed to fetch predictions", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLiveStatus = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/monitoring/status");
      const results = res.data.stations.map((s) => ({
        name: s.station,
        passengers: s.predicted_passengers,
      }));
      setStations(results);
      setAlerts(res.data.alerts || []);
      setSelectedHour(res.data.current_hour);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Failed to fetch live status", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (liveMode) {
      fetchLiveStatus();
      const interval = setInterval(fetchLiveStatus, 30000);
      return () => clearInterval(interval);
    } else {
      fetchManualPredictions(selectedHour);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveMode]);

  useEffect(() => {
    if (!liveMode) {
      fetchManualPredictions(selectedHour);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedHour]);

  const stationsWithStatus = stations.map((s) => {
    let status = "Low";
    if (s.passengers >= 1400) status = "Critical";
    else if (s.passengers >= 900) status = "High";
    else if (s.passengers >= 400) status = "Moderate";
    return { ...s, status };
  });

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
          <Link to="/reports" className="bg-slate-700 hover:bg-slate-600 text-sm px-3 py-1.5 rounded">
  Reports
</Link>
          <button
            onClick={handleLogout}
            className="bg-slate-700 hover:bg-slate-600 text-sm px-3 py-1.5 rounded"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="p-6 space-y-6">
        {liveMode && alerts.length > 0 && (
          <div className="bg-red-900/40 border border-red-700 rounded-lg p-4 space-y-1">
            <p className="font-semibold text-red-300">⚠ Active Overcrowding Alerts</p>
            {alerts.map((alert, i) => (
              <p key={i} className="text-sm text-red-200">{alert.message}</p>
            ))}
          </div>
        )}

        <section>
          <div className="flex items-center justify-between mb-3 flex-wrap gap-3">
            <h2 className="text-lg font-semibold">Station-wise Crowd Density (AI Predicted)</h2>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm text-slate-400">Live Mode</label>
                <button
  type="button"
  onClick={() => setLiveMode(!liveMode)}
  className={`flex-shrink-0 w-11 h-6 p-0 border-0 rounded-full transition-colors duration-200 relative inline-flex items-center ${liveMode ? "bg-green-500" : "bg-slate-600"}`}
  style={{ boxSizing: "border-box" }}
>
  <span
    className={`absolute w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${liveMode ? "translate-x-[22px]" : "translate-x-0.5"}`}
    style={{ top: "2px" }}
  />
</button>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm text-slate-400">Hour:</label>
                <select
                  value={selectedHour}
                  disabled={liveMode}
                  onChange={(e) => setSelectedHour(Number(e.target.value))}
                  className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm disabled:opacity-50"
                >
                  {Array.from({ length: 19 }, (_, i) => i + 5).map((h) => (
                    <option key={h} value={h}>{h}:00</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {liveMode && lastUpdated && (
            <p className="text-xs text-slate-500 mb-3">
              Live — last updated {lastUpdated.toLocaleTimeString()} (auto-refreshes every 30s)
            </p>
          )}

          {loading ? (
            <p className="text-slate-400">Loading predictions...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {stationsWithStatus.map((station) => (
                <div key={station.name} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{station.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full text-white ${getStatusColor(station.status)}`}>
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
              <BarChart data={stationsWithStatus}>
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