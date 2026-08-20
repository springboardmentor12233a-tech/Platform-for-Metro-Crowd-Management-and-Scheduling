"use client";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

  const [station, setStation] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleCreateAlert = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch(
        `http://localhost:8000/emergency-alert?station=${encodeURIComponent(station)}&message=${encodeURIComponent(message)}`,
        { method: "POST" }
      );
      setStation("");
      setMessage("");
      fetchAlerts();
    } catch (err) {
      setError("Error creating alert");
    }
    setSubmitting(false);
  };

  useEffect(() => {
    setRole(localStorage.getItem("role"));
  }, []);

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
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 px-6 py-10">
        <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900">Active Alerts</h1>
        <p className="text-slate-500 mt-1 mb-8">
          Live alerts requiring attention
        </p>

        <form
          onSubmit={handleCreateAlert}
          className="bg-white border border-slate-200 rounded-xl p-5 mb-6 flex gap-3 items-end"
        >
          <div className="flex-1">
            <label className="block text-sm text-slate-600 mb-1">Station</label>
            <input
              value={station}
              onChange={(e) => setStation(e.target.value)}
              placeholder="e.g. Rajiv Chowk"
              required
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-400"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm text-slate-600 mb-1">Message</label>
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. Fire alarm near platform 1"
              required
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-400"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700"
          >
            {submitting ? "Raising..." : "Raise Alert"}
          </button>
        </form>

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
            {role === "admin" ? (
              <button
                onClick={() => handleResolve(alert.id)}
                className="bg-slate-900 text-white text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-slate-700"
              >
                Resolve
              </button>
            ) : (
              <span className="text-xs text-slate-400 italic px-3 py-1.5">
                Admin only
              </span>
            )}
            </div>
          ))}
        </div>
      </div>
    </main>
        </>
  );
}