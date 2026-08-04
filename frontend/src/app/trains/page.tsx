"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import CommandCenterLayout from "@/components/CommandCenterLayout";
import { api } from "@/utils/api";
import { Plus, Trash2, Edit3, ShieldAlert, Train, RefreshCw, Eye } from "lucide-react";

export default function TrainsPage() {
  const [trains, setTrains] = useState<any[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // Forms & Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTrain, setEditingTrain] = useState<any>(null);
  const [trainNumber, setTrainNumber] = useState("");
  const [trainName, setTrainName] = useState("");
  const [routeId, setRouteId] = useState("");
  const [capacity, setCapacity] = useState("1500");
  const [status, setStatus] = useState("Active");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const userStr = localStorage.getItem("metroflow_user");
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const trainData = await api.trains.list();
      const routeData = await api.routes.list();
      setTrains(trainData);
      setRoutes(routeData);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingTrain(null);
    setTrainNumber("");
    setTrainName("");
    setRouteId(routes[0]?.route_id?.toString() || "");
    setCapacity("1500");
    setStatus("Active");
    setErrorMsg("");
    setModalOpen(true);
  };

  const handleOpenEdit = (t: any) => {
    setEditingTrain(t);
    setTrainNumber(t.train_number);
    setTrainName(t.train_name);
    setRouteId(t.route_id?.toString() || "");
    setCapacity(t.capacity.toString());
    setStatus(t.status || "Active");
    setErrorMsg("");
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const payload = {
      train_number: trainNumber,
      train_name: trainName,
      route_id: parseInt(routeId),
      capacity: parseInt(capacity),
      status: status
    };

    try {
      if (editingTrain) {
        await api.trains.update(editingTrain.train_id, payload);
      } else {
        await api.trains.create(payload);
      }
      setModalOpen(false);
      fetchData();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save train details.");
    }
  };

  const handleToggleStatus = async (train: any) => {
    const nextStatus = train.status === "Active" ? "Delayed" : "Active";
    const payload = {
      train_number: train.train_number,
      train_name: train.train_name,
      route_id: train.route_id,
      capacity: train.capacity,
      status: nextStatus
    };

    try {
      await api.trains.update(train.train_id, payload);
      
      // Auto-trigger alert if marked Delayed
      if (nextStatus === "Delayed") {
        await api.alerts.create({
          alert_type: "Delay",
          severity: "Warning",
          message: `Train ${train.train_number} on ${getRouteName(train.route_id)} has been reported DELAYED. Adjusting line timetables.`,
          train_id: train.train_id
        });
      }
      fetchData();
    } catch (err: any) {
      alert(err.message || "Failed to flip train status.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete train from rolling stock register?")) return;
    try {
      await api.trains.delete(id);
      fetchData();
    } catch (err: any) {
      alert(err.message || "Could not delete train.");
    }
  };

  const getRouteName = (id: number) => {
    const route = routes.find(r => r.route_id === id);
    return route ? route.route_name : "Unallocated";
  };

  const getRouteColor = (id: number) => {
    const route = routes.find(r => r.route_id === id);
    return route ? route.route_color : "#808080";
  };

  if (loading) {
    return (
      <CommandCenterLayout>
        <div className="flex h-full w-full items-center justify-center text-cyan-400">
          <div className="flex flex-col items-center space-y-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>
            <p className="font-mono text-xs tracking-wider text-cyan-300">SYNCING TRANSIT ROLLING STOCK...</p>
          </div>
        </div>
      </CommandCenterLayout>
    );
  }

  const role = currentUser?.role || "user";
  const canModify = role === "admin" || role === "manager";
  const canDelete = role === "admin";

  return (
    <CommandCenterLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-xl font-bold tracking-wider font-mono text-cyan-400 text-glow-cyan">
              ROLLING STOCK TRACKING
            </h1>
            <p className="text-xs text-slate-500 font-mono">Live statuses, passenger capacities, and line route assignments</p>
          </div>

          {canModify && (
            <button
              onClick={handleOpenCreate}
              className="flex items-center space-x-1.5 rounded-lg bg-cyan-500 py-2.5 px-4 font-mono text-xs font-bold text-slate-900 hover:bg-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all"
            >
              <Plus size={14} />
              <span>REGISTER TRAIN</span>
            </button>
          )}
        </div>

        {/* Trains Table */}
        <div className="rounded-xl border border-slate-800 bg-[#070b19] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 uppercase text-[9px] tracking-wider">
                  <th className="p-4">Train Info</th>
                  <th className="p-4">Assigned Line</th>
                  <th className="p-4">Passenger Capacity</th>
                  <th className="p-4">Current Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850 text-slate-300">
                {trains.map(t => (
                  <tr key={t.train_id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-4 flex items-center space-x-3">
                      <div className="p-2 rounded bg-slate-950 border border-slate-800 text-cyan-400">
                        <Train size={15} />
                      </div>
                      <div>
                        <span className="block font-bold text-slate-200">{t.train_number}</span>
                        <span className="block text-[10px] text-slate-500">{t.train_name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: getRouteColor(t.route_id) }}
                        ></span>
                        <span>{getCRouteName(t.route_id)}</span>
                      </div>
                    </td>
                    <td className="p-4 font-bold text-slate-300">{t.capacity.toLocaleString()} Pax</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        t.status === "Delayed" 
                          ? "bg-yellow-950 text-yellow-400 border border-yellow-800/40 animate-pulse" 
                          : "bg-green-950 text-green-400 border border-green-800/40"
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          href={`/trains/${t.train_id}`}
                          className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800/30 rounded transition-all flex items-center justify-center"
                          title="View details"
                        >
                          <Eye size={14} />
                        </Link>
                        {canModify && (
                          <button
                            onClick={() => handleToggleStatus(t)}
                            className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800/30 rounded transition-all"
                            title="Toggle Delay Status"
                          >
                            <RefreshCw size={14} />
                          </button>
                        )}
                        {canModify && (
                          <button
                            onClick={() => handleOpenEdit(t)}
                            className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800/30 rounded transition-all"
                            title="Edit"
                          >
                            <Edit3 size={14} />
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => handleDelete(t.train_id)}
                            className="p-1.5 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-all"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-xl border border-slate-800 bg-[#070b19] p-6 shadow-2xl">
              <h2 className="font-mono text-base font-bold text-cyan-400 tracking-widest uppercase border-b border-slate-800 pb-3 mb-4">
                {editingTrain ? "Update Train Details" : "Register Subway Train"}
              </h2>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[9px] text-slate-400 uppercase mb-1">Train Number</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. T-YEL-05"
                      value={trainNumber}
                      onChange={(e) => setTrainNumber(e.target.value)}
                      className="w-full rounded bg-slate-900 border border-slate-800 py-2 px-3 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[9px] text-slate-400 uppercase mb-1">Train Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Yellow Line Special"
                      value={trainName}
                      onChange={(e) => setTrainName(e.target.value)}
                      className="w-full rounded bg-slate-900 border border-slate-800 py-2 px-3 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block font-mono text-[9px] text-slate-400 uppercase mb-1">Assigned Route line</label>
                    <select
                      value={routeId}
                      onChange={(e) => setRouteId(e.target.value)}
                      className="w-full rounded bg-slate-900 border border-slate-800 py-2.5 px-3 text-xs text-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                    >
                      {routes.map(r => (
                        <option key={r.route_id} value={r.route_id}>{r.route_name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-mono text-[9px] text-slate-400 uppercase mb-1">Max Capacity (Pax)</label>
                    <input
                      type="number"
                      required
                      value={capacity}
                      onChange={(e) => setCapacity(e.target.value)}
                      className="w-full rounded bg-slate-900 border border-slate-800 py-2 px-3 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[9px] text-slate-400 uppercase mb-1">Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full rounded bg-slate-900 border border-slate-800 py-2 px-3 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                    >
                      <option value="Active">Active</option>
                      <option value="Delayed">Delayed</option>
                      <option value="Maintenance">Maintenance</option>
                    </select>
                  </div>
                </div>

                {errorMsg && (
                  <div className="flex items-center space-x-2 rounded bg-red-950/30 border border-red-800/40 p-3 text-xs text-red-400">
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
                    className="rounded bg-cyan-500 px-4 py-2 font-mono text-xs font-bold text-slate-900 hover:bg-cyan-400"
                  >
                    SAVE PROFILE
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </CommandCenterLayout>
  );

  function getCRouteName(id: number) {
    return getRouteName(id);
  }
}
