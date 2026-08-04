"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import CommandCenterLayout from "@/components/CommandCenterLayout";
import { api } from "@/utils/api";
import { Search, Plus, Trash2, Edit3, ShieldAlert, Sparkles, MapPin, Eye } from "lucide-react";

export default function StationsPage() {
  const [stations, setStations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [lineFilter, setLineFilter] = useState("all");
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // Forms & Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStation, setEditingStation] = useState<any>(null);
  const [stationName, setStationName] = useState("");
  const [lineName, setLineName] = useState("");
  const [distance, setDistance] = useState("0");
  const [latitude, setLatitude] = useState("28.6");
  const [longitude, setLongitude] = useState("77.2");
  const [layout, setLayout] = useState("Underground");
  const [isInterchange, setIsInterchange] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const lines = Array.from(new Set(stations.map(s => s.line_name)));

  useEffect(() => {
    const userStr = localStorage.getItem("metroflow_user");
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    }
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      const data = await api.stations.list();
      setStations(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingStation(null);
    setStationName("");
    setLineName("");
    setDistance("0");
    setLatitude("28.6139");
    setLongitude("77.2090");
    setLayout("Underground");
    setIsInterchange(false);
    setErrorMsg("");
    setModalOpen(true);
  };

  const handleOpenEdit = (station: any) => {
    setEditingStation(station);
    setStationName(station.station_name);
    setLineName(station.line_name);
    setDistance(station.distance_from_start.toString());
    setLatitude(station.latitude.toString());
    setLongitude(station.longitude.toString());
    setLayout(station.station_layout || "Underground");
    setIsInterchange(station.is_interchange);
    setErrorMsg("");
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    
    const payload = {
      station_name: stationName,
      line_name: lineName,
      distance_from_start: parseFloat(distance),
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      station_layout: layout,
      is_interchange: isInterchange,
      opening_date: "2024-01-01" // dummy opening date to satisfy database date format
    };

    try {
      if (editingStation) {
        // Update
        await api.stations.update(editingStation.station_id, payload);
      } else {
        // Create
        await api.stations.create(payload);
      }
      setModalOpen(false);
      fetchStations();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save station record.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to permanently delete this station?")) return;
    try {
      await api.stations.delete(id);
      fetchStations();
    } catch (err: any) {
      alert(err.message || "Could not delete station.");
    }
  };

  if (loading) {
    return (
      <CommandCenterLayout>
        <div className="flex h-full w-full items-center justify-center text-cyan-400">
          <div className="flex flex-col items-center space-y-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>
            <p className="font-mono text-xs tracking-wider text-cyan-300">LOADING METRO NETWORK STATIONS...</p>
          </div>
        </div>
      </CommandCenterLayout>
    );
  }

  const role = currentUser?.role || "user";
  const canModify = role === "admin" || role === "manager";
  const canDelete = role === "admin";

  const filteredStations = stations.filter(s => {
    const matchesSearch = s.station_name.toLowerCase().includes(search.toLowerCase()) ||
                          s.line_name.toLowerCase().includes(search.toLowerCase());
    const matchesLine = lineFilter === "all" || s.line_name === lineFilter;
    return matchesSearch && matchesLine;
  });

  return (
    <CommandCenterLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-xl font-bold tracking-wider font-mono text-cyan-400 text-glow-cyan">
              STATIONS MONITORING
            </h1>
            <p className="text-xs text-slate-500 font-mono">Dynamic passenger densities and station profile administration</p>
          </div>

          {canModify && (
            <button
              onClick={handleOpenCreate}
              className="flex items-center space-x-1.5 rounded-lg bg-cyan-500 py-2.5 px-4 font-mono text-xs font-bold text-slate-900 hover:bg-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all"
            >
              <Plus size={14} />
              <span>ADD STATION</span>
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search station or line..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-[#070b19]/80 py-2.5 pl-10 pr-4 font-mono text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-400"
            />
          </div>

          <select
            value={lineFilter}
            onChange={(e) => setLineFilter(e.target.value)}
            className="rounded-lg border border-slate-800 bg-[#070b19]/80 py-2.5 px-4 font-mono text-xs text-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
          >
            <option value="all">All Transit Lines</option>
            {lines.map(line => (
              <option key={line} value={line}>{line}</option>
            ))}
          </select>
          
          <div className="flex items-center justify-end font-mono text-[10px] text-slate-500 tracking-wider">
            SHOWING {filteredStations.length} OF {stations.length} STATIONS
          </div>
        </div>

        {/* Grid List */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredStations.map((station) => (
            <div
              key={station.station_id}
              className="rounded-xl glass-card p-5 hover:border-slate-700/60 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Line badge */}
                <div className="flex justify-between items-start">
                  <span className="rounded bg-slate-850 px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider text-cyan-400 border border-slate-800/60">
                    {station.line_name}
                  </span>
                  
                  {station.is_interchange && (
                    <span className="flex items-center space-x-1 rounded bg-violet-950/40 px-2 py-1 font-mono text-[9px] font-bold text-violet-400 border border-violet-800/30">
                      <Sparkles size={10} />
                      <span>INTERCHANGE</span>
                    </span>
                  )}
                </div>

                {/* Name */}
                <div>
                  <h3 className="text-base font-bold text-slate-200 tracking-wider font-mono">
                    {station.station_name}
                  </h3>
                  <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-mono mt-1">
                    <MapPin size={12} />
                    <span>Lat: {station.latitude}, Lng: {station.longitude}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 border-t border-slate-800/40 pt-3">
                  <div>
                    <span className="block text-[9px] font-mono text-slate-500 uppercase">Layout Design</span>
                    <span className="block text-xs font-mono font-medium text-slate-300">{station.station_layout || "Elevated"}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-mono text-slate-500 uppercase">From Terminal</span>
                    <span className="block text-xs font-mono font-medium text-slate-300">{station.distance_from_start} km</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex items-center justify-between border-t border-slate-800/60 pt-4">
                <span className="text-[10px] font-mono text-slate-500 uppercase">
                  ID: #{station.station_id}
                </span>

                <div className="flex items-center space-x-2">
                  <Link
                    href={`/stations/${station.station_id}`}
                    className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800/30 rounded transition-all flex items-center justify-center"
                    title="View details"
                  >
                    <Eye size={15} />
                  </Link>

                  {canModify && (
                    <button
                      onClick={() => handleOpenEdit(station)}
                      className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800/30 rounded transition-all"
                      title="Edit details"
                    >
                      <Edit3 size={15} />
                    </button>
                  )}

                  {canDelete && (
                    <button
                      onClick={() => handleDelete(station.station_id)}
                      className="p-1.5 text-red-500/80 hover:text-red-400 hover:bg-red-500/10 rounded transition-all"
                      title="Delete Station"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Popup */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-xl glass-panel-glow p-6">
              <h2 className="font-mono text-base font-bold text-cyan-400 tracking-widest uppercase border-b border-slate-800 pb-3 mb-4">
                {editingStation ? "Update Station Profile" : "Create New Station"}
              </h2>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block font-mono text-[9px] text-slate-400 uppercase mb-1">Station Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rajiv Chowk"
                      value={stationName}
                      onChange={(e) => setStationName(e.target.value)}
                      className="w-full rounded bg-slate-900 border border-slate-800 py-2 px-3 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[9px] text-slate-400 uppercase mb-1">Line Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Yellow line"
                      value={lineName}
                      onChange={(e) => setLineName(e.target.value)}
                      className="w-full rounded bg-slate-900 border border-slate-800 py-2 px-3 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[9px] text-slate-400 uppercase mb-1">Layout</label>
                    <select
                      value={layout}
                      onChange={(e) => setLayout(e.target.value)}
                      className="w-full rounded bg-slate-900 border border-slate-800 py-2 px-3 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                    >
                      <option value="Underground">Underground</option>
                      <option value="Elevated">Elevated</option>
                      <option value="At-Grade">At-Grade</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-mono text-[9px] text-slate-400 uppercase mb-1">Latitude</label>
                    <input
                      type="number"
                      step="0.000001"
                      required
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                      className="w-full rounded bg-slate-900 border border-slate-800 py-2 px-3 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[9px] text-slate-400 uppercase mb-1">Longitude</label>
                    <input
                      type="number"
                      step="0.000001"
                      required
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
                      className="w-full rounded bg-slate-900 border border-slate-800 py-2 px-3 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[9px] text-slate-400 uppercase mb-1">Dist from Start (km)</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={distance}
                      onChange={(e) => setDistance(e.target.value)}
                      className="w-full rounded bg-slate-900 border border-slate-800 py-2 px-3 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                    />
                  </div>

                  <div className="flex items-center space-x-2 pt-5">
                    <input
                      type="checkbox"
                      id="isInterchange"
                      checked={isInterchange}
                      onChange={(e) => setIsInterchange(e.target.checked)}
                      className="rounded border-slate-800 bg-slate-900 text-cyan-500 focus:ring-0"
                    />
                    <label htmlFor="isInterchange" className="font-mono text-[9px] text-slate-400 uppercase cursor-pointer">
                      Interchange Hub
                    </label>
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
                    className="rounded bg-slate-800 px-4 py-2 font-mono text-xs text-slate-400 hover:bg-slate-750"
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
}
