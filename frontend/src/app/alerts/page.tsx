"use client";

import React, { useState, useEffect } from "react";
import CommandCenterLayout from "@/components/CommandCenterLayout";
import { api } from "@/utils/api";
import { AlertTriangle, Plus, ShieldCheck, CheckSquare, ShieldAlert } from "lucide-react";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [stations, setStations] = useState<any[]>([]);
  const [trains, setTrains] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterUnresolved, setFilterUnresolved] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Form states
  const [modalOpen, setModalOpen] = useState(false);
  const [alertType, setAlertType] = useState("Emergency");
  const [severity, setSeverity] = useState("Critical");
  const [message, setMessage] = useState("");
  const [stationId, setStationId] = useState("");
  const [trainId, setTrainId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const userStr = localStorage.getItem("metroflow_user");
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    }
    fetchData();
  }, [filterUnresolved]);

  const fetchData = async () => {
    try {
      const data = await api.alerts.list(filterUnresolved);
      const stationData = await api.stations.list();
      const trainData = await api.trains.list();

      setAlerts(data);
      setStations(stationData);
      setTrains(trainData);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setAlertType("Emergency");
    setSeverity("Critical");
    setMessage("");
    setStationId("");
    setTrainId("");
    setErrorMsg("");
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const payload = {
      alert_type: alertType,
      severity: severity,
      message: message,
      station_id: stationId ? parseInt(stationId) : null,
      train_id: trainId ? parseInt(trainId) : null
    };

    try {
      await api.alerts.create(payload);
      setModalOpen(false);
      fetchData();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to create system announcement.");
    }
  };

  const handleResolve = async (id: string) => {
    try {
      await api.alerts.resolve(id);
      fetchData();
    } catch (err: any) {
      alert(err.message || "Could not resolve alert.");
    }
  };

  if (loading) {
    return (
      <CommandCenterLayout>
        <div className="flex h-full w-full items-center justify-center text-cyan-400">
          <div className="flex flex-col items-center space-y-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>
            <p className="font-mono text-xs tracking-wider text-cyan-300">RETRIEVING EMERGENCY LOGS...</p>
          </div>
        </div>
      </CommandCenterLayout>
    );
  }

  const role = currentUser?.role || "user";
  const canModify = role === "admin" || role === "manager";

  return (
    <CommandCenterLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-xl font-bold tracking-wider font-mono text-cyan-400 text-glow-cyan">
              ALERTS & NOTIFICATIONS
            </h1>
            <p className="text-xs text-slate-500 font-mono">Emergency broadcast terminal and crowd advisory logs</p>
          </div>

          {canModify && (
            <button
              onClick={handleOpenCreate}
              className="flex items-center space-x-1.5 rounded-lg bg-red-600 hover:bg-red-500 py-2.5 px-4 font-mono text-xs font-bold text-slate-100 hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all"
            >
              <Plus size={14} />
              <span>NEW BROADCAST</span>
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex justify-between items-center glass-card p-4 rounded-xl">
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 font-mono text-xs text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={filterUnresolved}
                onChange={(e) => setFilterUnresolved(e.target.checked)}
                className="rounded bg-slate-900 border-slate-800 text-red-500 focus:ring-0"
              />
              <span>Unresolved Issues Only</span>
            </label>
          </div>

          <div className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">
            Logged incidents: {alerts.length} Records
          </div>
        </div>

        {/* List of Alerts */}
        <div className="space-y-4">
          {alerts.length > 0 ? (
            alerts.map((a) => (
              <div
                key={a.id}
                className={`rounded-xl border p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
                  a.resolved
                    ? "bg-slate-900/20 border-slate-850 text-slate-400"
                    : a.severity === "Critical"
                    ? "bg-red-950/20 border-red-900/40 text-red-200 shadow-[0_0_15px_rgba(239,68,68,0.05)] animate-pulse-glow"
                    : "bg-amber-950/20 border-amber-900/40 text-amber-200"
                }`}
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border uppercase tracking-wider ${
                      a.resolved 
                        ? "bg-slate-950 border-slate-800 text-slate-500" 
                        : a.severity === "Critical" 
                        ? "bg-red-950 border-red-800 text-red-400" 
                        : "bg-amber-950 border-amber-800 text-amber-400"
                    }`}>
                      {a.type} - {a.severity}
                    </span>
                    
                    {a.resolved && (
                      <span className="rounded bg-green-950/30 border border-green-800/40 px-2 py-0.5 font-mono text-[9px] text-green-400">
                        RESOLVED
                      </span>
                    )}

                    <span className="font-mono text-[10px] text-slate-500">
                      {new Date(a.created_at).toLocaleString()}
                    </span>
                  </div>

                  <p className="text-xs font-mono tracking-wide">{a.message}</p>
                </div>

                {!a.resolved && canModify && (
                  <button
                    onClick={() => handleResolve(a.id)}
                    className="flex items-center space-x-1 rounded bg-green-500 hover:bg-green-400 py-1.5 px-3 font-mono text-[10px] font-bold text-slate-900 transition-all shrink-0 uppercase"
                  >
                    <CheckSquare size={13} />
                    <span>RESOLVE</span>
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="flex h-44 flex-col items-center justify-center text-slate-600 border border-dashed border-slate-800 rounded-xl bg-slate-950/20">
              <ShieldCheck size={32} className="text-green-500/40 mb-1" />
              <p className="font-mono text-xs uppercase tracking-widest text-slate-500">Zero active system incidents</p>
            </div>
          )}
        </div>

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-xl glass-panel-glow p-6">
              <h2 className="font-mono text-base font-bold text-red-500 tracking-widest uppercase border-b border-slate-800 pb-3 mb-4 flex items-center space-x-2">
                <AlertTriangle size={18} />
                <span>BroadCast Advisory</span>
              </h2>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block font-mono text-[9px] text-slate-400 uppercase mb-1">Incident Category</label>
                  <select
                    value={alertType}
                    onChange={(e) => setAlertType(e.target.value)}
                    className="w-full rounded bg-slate-900 border border-slate-800 py-2.5 px-3 text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="Emergency">Emergency Announcement</option>
                    <option value="Delay">Timetable Delay</option>
                    <option value="Overcrowding">Station Overcrowding</option>
                    <option value="Maintenance">Maintenance Stop</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[9px] text-slate-400 uppercase mb-1">Severity Priority</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    className="w-full rounded bg-slate-900 border border-slate-800 py-2.5 px-3 text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="Critical">Critical Priority</option>
                    <option value="Warning">Warning Advisory</option>
                    <option value="Info">Information Only</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[9px] text-slate-400 uppercase mb-1">Station Linked (Opt)</label>
                    <select
                      value={stationId}
                      onChange={(e) => setStationId(e.target.value)}
                      className="w-full rounded bg-slate-900 border border-slate-800 py-2.5 px-3 text-[11px] text-slate-400"
                    >
                      <option value="">None</option>
                      {stations.map(s => (
                        <option key={s.station_id} value={s.station_id}>{s.station_name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-mono text-[9px] text-slate-400 uppercase mb-1">Train Linked (Opt)</label>
                    <select
                      value={trainId}
                      onChange={(e) => setTrainId(e.target.value)}
                      className="w-full rounded bg-slate-900 border border-slate-800 py-2.5 px-3 text-[11px] text-slate-400"
                    >
                      <option value="">None</option>
                      {trains.map(t => (
                        <option key={t.train_id} value={t.train_id}>{t.train_number}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[9px] text-slate-400 uppercase mb-1">BroadCast Message</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Enter incident notice description..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full rounded bg-slate-900 border border-slate-800 py-2.5 px-3 text-xs text-slate-200 focus:outline-none"
                  />
                </div>

                {errorMsg && (
                  <div className="flex items-center space-x-2 rounded bg-red-950/30 border border-red-800/40 p-3 text-red-400">
                    <ShieldAlert size={14} className="shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="flex justify-end space-x-3 border-t border-slate-800/60 pt-4">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="rounded bg-slate-800 px-4 py-2 font-mono text-xs text-slate-400 hover:bg-slate-755"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="rounded bg-red-600 px-4 py-2 font-mono text-xs font-bold text-slate-100 hover:bg-red-500"
                  >
                    SEND ALERT
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </CommandCenterLayout>
  );
}
