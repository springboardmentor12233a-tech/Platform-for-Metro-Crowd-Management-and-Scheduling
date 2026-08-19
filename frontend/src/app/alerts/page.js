"use client";
import { useEffect, useState } from "react";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchAlerts = () => {
    setLoading(true);
    fetch("http://localhost:8000/alerts/active")
      .then((res) => res.json())
      .then((data) => {
        setAlerts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setError("Error connecting to server");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleResolve = async (id) => {
    try {
      await fetch(`http://localhost:8000/alerts/${id}/resolve`, {
        method: "PUT",
      });
      fetchAlerts();
    } catch (err) {
      setError("Error resolving alert");
    }
  };

  const severityColor = (severity) => {
    if (severity === "High") return "bg-red-100 text-red-700 border-red-300";
    if (severity === "Medium")
      return "bg-yellow-100 text-yellow-700 border-yellow-300";
    return "bg-green-100 text-green-700 border-green-300";
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900">Active Alerts</h1>
        <p className="text-slate-500 mt-1 mb-8">
          Live alerts requiring attention
        </p>

        {loading && <p className="text-slate-500">Loading alerts...</p>}

        {error && (
          <p className="text-red-700 bg-red-100 rounded-lg py-2 px-3 text-sm">
            {error}
          </p>
        )}

        {!loading && !error && alerts.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500">
            No active alerts. All clear.
          </div>
        )}

        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-start justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-slate-900">
                    {alert.alert_type}
                  </span>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full border ${severityColor(
                      alert.severity
                    )}`}
                  >
                    {alert.severity}
                  </span>
                </div>
                <p className="text-slate-600 text-sm">{alert.message}</p>
                <p className="text-slate-400 text-xs mt-1">
                  Station: {alert.station}
                </p>
              </div>
              <button
                onClick={() => handleResolve(alert.id)}
                className="bg-slate-900 text-white text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-slate-700"
              >
                Resolve
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}