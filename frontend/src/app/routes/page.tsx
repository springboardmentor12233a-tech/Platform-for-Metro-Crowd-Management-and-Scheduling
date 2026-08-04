"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import CommandCenterLayout from "@/components/CommandCenterLayout";
import { api } from "@/utils/api";
import { Plus, Trash2, Edit3, ShieldAlert, Layers, Eye } from "lucide-react";

export default function RoutesPage() {
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // Form states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<any>(null);
  const [routeName, setRouteName] = useState("");
  const [routeColor, setRouteColor] = useState("#000000");
  const [totalStations, setTotalStations] = useState("0");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const userStr = localStorage.getItem("metroflow_user");
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    }
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const data = await api.routes.list();
      setRoutes(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingRoute(null);
    setRouteName("");
    setRouteColor("#06b6d4");
    setTotalStations("10");
    setErrorMsg("");
    setModalOpen(true);
  };

  const handleOpenEdit = (route: any) => {
    setEditingRoute(route);
    setRouteName(route.route_name);
    setRouteColor(route.route_color || "#06b6d4");
    setTotalStations(route.total_stations.toString());
    setErrorMsg("");
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const payload = {
      route_name: routeName,
      route_color: routeColor,
      total_stations: parseInt(totalStations)
    };

    try {
      if (editingRoute) {
        await api.routes.update(editingRoute.route_id, payload);
      } else {
        await api.routes.create(payload);
      }
      setModalOpen(false);
      fetchRoutes();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save route.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this route line? All related train allocations will lose references.")) return;
    try {
      await api.routes.delete(id);
      fetchRoutes();
    } catch (err: any) {
      alert(err.message || "Could not delete route.");
    }
  };

  if (loading) {
    return (
      <CommandCenterLayout>
        <div className="flex h-full w-full items-center justify-center text-cyan-400">
          <div className="flex flex-col items-center space-y-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>
            <p className="font-mono text-xs tracking-wider text-cyan-300">LOADING METRO ROUTE SCHEMATICS...</p>
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
              METRO ROUTE TRANSITS
            </h1>
            <p className="text-xs text-slate-500 font-mono">Administration of active subway line colors and stop scopes</p>
          </div>

          {canModify && (
            <button
              onClick={handleOpenCreate}
              className="flex items-center space-x-1.5 rounded-lg bg-cyan-500 py-2.5 px-4 font-mono text-xs font-bold text-slate-900 hover:bg-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all"
            >
              <Plus size={14} />
              <span>NEW ROUTE</span>
            </button>
          )}
        </div>

        {/* Route List */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {routes.map(r => (
            <div
              key={r.route_id}
              className="rounded-xl border border-slate-800 bg-[#070b19] p-5 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span
                      className="h-3.5 w-3.5 rounded-full border border-slate-950 shadow-inner"
                      style={{ backgroundColor: r.route_color || "#808080" }}
                    ></span>
                    <h3 className="text-base font-bold text-slate-200 font-mono tracking-wide">{r.route_name}</h3>
                  </div>
                  <span className="rounded-full bg-slate-900 border border-slate-800 px-2 py-0.5 font-mono text-[9px] text-slate-400">
                    ID: #{r.route_id}
                  </span>
                </div>

                <div className="flex items-center justify-between bg-slate-950/40 p-3 rounded-lg border border-slate-850">
                  <div className="flex items-center space-x-2 text-xs text-slate-400 font-mono">
                    <Layers size={14} className="text-cyan-400" />
                    <span>Station Points:</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-200">{r.total_stations} Stops</span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex items-center justify-end space-x-2 border-t border-slate-800/40 pt-4">
                <Link
                  href={`/routes/${r.route_id}`}
                  className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800/30 rounded transition-all flex items-center justify-center"
                  title="View details"
                >
                  <Eye size={14} />
                </Link>
                {canModify && (
                  <button
                    onClick={() => handleOpenEdit(r)}
                    className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800/30 rounded transition-all"
                  >
                    <Edit3 size={14} />
                  </button>
                )}
                {canDelete && (
                  <button
                    onClick={() => handleDelete(r.route_id)}
                    className="p-1.5 text-red-500/80 hover:text-red-400 hover:bg-red-500/10 rounded transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-xl border border-slate-800 bg-[#070b19] p-6 shadow-2xl">
              <h2 className="font-mono text-base font-bold text-cyan-400 tracking-widest uppercase border-b border-slate-800 pb-3 mb-4">
                {editingRoute ? "Update Route Line" : "Create Route Line"}
              </h2>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block font-mono text-[9px] text-slate-400 uppercase mb-1">Route / Line Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Yellow line"
                    value={routeName}
                    onChange={(e) => setRouteName(e.target.value)}
                    className="w-full rounded bg-slate-900 border border-slate-800 py-2.5 px-3 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[9px] text-slate-400 uppercase mb-1">Line Theme Color</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={routeColor}
                        onChange={(e) => setRouteColor(e.target.value)}
                        className="h-9 w-12 rounded border border-slate-800 bg-slate-900 cursor-pointer"
                      />
                      <span className="font-mono text-xs uppercase text-slate-300">{routeColor}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-[9px] text-slate-400 uppercase mb-1">Total Stations</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={totalStations}
                      onChange={(e) => setTotalStations(e.target.value)}
                      className="w-full rounded bg-slate-900 border border-slate-800 py-2 px-3 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                    />
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
                    SAVE ROUTE
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
