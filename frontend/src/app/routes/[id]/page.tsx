"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import CommandCenterLayout from "@/components/CommandCenterLayout";
import { api } from "@/utils/api";
import {
  ArrowLeft,
  MapPin,
  Layers,
  Sparkles,
  Clock,
  Train,
  AlertTriangle,
  CheckCircle,
  Activity,
  Milestone
} from "lucide-react";

export default function RouteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const routeId = parseInt(resolvedParams.id);

  const [route, setRoute] = useState<any>(null);
  const [stations, setStations] = useState<any[]>([]);
  const [trains, setTrains] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchRouteData = async () => {
      try {
        // 1. Fetch Route metadata
        const routeData = await api.routes.get(routeId);
        setRoute(routeData);

        // 2. Fetch all stations and filter by matching line_name
        const allStations = await api.stations.list();
        const routeStations = allStations
          .filter((s: any) => s.line_name?.toLowerCase() === routeData.route_name?.toLowerCase())
          .sort((a: any, b: any) => parseFloat(a.distance_from_start) - parseFloat(b.distance_from_start));
        setStations(routeStations);

        // 3. Fetch all trains and filter by route_id
        const allTrains = await api.trains.list();
        const routeTrains = allTrains.filter((t: any) => t.route_id === routeId);
        setTrains(routeTrains);

        setLoading(false);
      } catch (err: any) {
        console.error(err);
        setErrorMsg(err.message || "Failed to load route schematics.");
        setLoading(false);
      }
    };

    fetchRouteData();
  }, [routeId]);

  if (loading) {
    return (
      <CommandCenterLayout>
        <div className="flex h-full w-full items-center justify-center text-cyan-400">
          <div className="flex flex-col items-center space-y-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>
            <p className="font-mono text-xs tracking-wider text-cyan-300">COMPILING LINE SCHEMATICS...</p>
          </div>
        </div>
      </CommandCenterLayout>
    );
  }

  if (errorMsg || !route) {
    return (
      <CommandCenterLayout>
        <div className="rounded-xl border border-red-500/20 bg-red-950/5 p-6 text-center space-y-4 max-w-md mx-auto mt-10">
          <AlertTriangle className="text-red-400 h-10 w-10 mx-auto animate-pulse" />
          <h2 className="font-mono text-sm font-bold text-red-200 uppercase">Route Details Error</h2>
          <p className="font-mono text-xs text-slate-400">{errorMsg || "Route record could not be found."}</p>
          <Link
            href="/routes"
            className="inline-flex items-center space-x-1.5 rounded-lg bg-red-950/60 border border-red-800/40 py-2 px-4 font-mono text-xs text-red-400 hover:bg-red-900/20"
          >
            <ArrowLeft size={14} />
            <span>BACK TO ROUTES</span>
          </Link>
        </div>
      </CommandCenterLayout>
    );
  }

  return (
    <CommandCenterLayout>
      <div className="space-y-6">
        {/* Back navigation & Title */}
        <div className="flex items-center space-x-4">
          <Link
            href="/routes"
            className="p-2 border border-slate-800 bg-[#0f172a] hover:bg-slate-800/40 rounded-xl text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <span className="block text-[8px] font-black tracking-widest text-slate-500 uppercase">TRANSIT LINE SPECIFICATIONS</span>
            <h1 className="text-xl font-bold tracking-wider font-mono text-cyan-400 text-glow-cyan uppercase flex items-center space-x-2.5">
              <span
                className="h-4 w-4 rounded-full border border-slate-950 shadow-md inline-block"
                style={{ backgroundColor: route.route_color || "#808080" }}
              ></span>
              <span>{route.route_name}</span>
            </h1>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Route Config card */}
          <div className="rounded-xl border border-slate-800 bg-[#070b19] p-5 shadow-lg space-y-4">
            <h3 className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase border-b border-slate-800 pb-2">
              Line Specifications
            </h3>
            <div className="space-y-3 font-mono text-xs text-slate-350">
              <div className="flex justify-between items-center border-b border-slate-850/40 pb-1.5">
                <span className="text-slate-500 uppercase text-[9px]">Transit Line:</span>
                <span className="text-slate-200 font-bold">{route.route_name}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-850/40 pb-1.5">
                <span className="text-slate-500 uppercase text-[9px]">Line Color:</span>
                <span className="font-bold uppercase" style={{ color: route.route_color }}>
                  {route.route_color || "#808080"}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-850/40 pb-1.5">
                <span className="text-slate-500 uppercase text-[9px]">Total stop points:</span>
                <span className="text-slate-200 font-bold">{route.total_stations} Stops</span>
              </div>
              <div className="flex justify-between items-center pb-0.5">
                <span className="text-slate-500 uppercase text-[9px]">Registered stock:</span>
                <span className="text-slate-200 font-bold">{trains.length} Trains Allocated</span>
              </div>
            </div>
          </div>

          {/* Active rolling stock card */}
          <div className="rounded-xl border border-slate-800 bg-[#070b19] p-5 shadow-lg space-y-4 md:col-span-2">
            <h3 className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase border-b border-slate-800 pb-2">
              Allocated Rolling Stock
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-48 overflow-y-auto pr-1">
              {trains.length > 0 ? (
                trains.map((t: any) => (
                  <Link
                    key={t.train_id}
                    href={`/trains/${t.train_id}`}
                    className="rounded-lg border border-slate-850 bg-slate-950/45 p-3 flex items-center justify-between hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="p-2 rounded bg-slate-900 border border-slate-800 text-cyan-400">
                        <Train size={14} />
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-slate-200 font-mono">{t.train_number}</span>
                        <span className="block text-[9px] text-slate-500 font-mono uppercase">{t.train_name}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold font-mono ${
                      t.status === "Delayed" 
                        ? "bg-yellow-950 text-yellow-400 border border-yellow-800/40 animate-pulse" 
                        : "bg-green-950 text-green-400 border border-green-800/40"
                    }`}>
                      {t.status}
                    </span>
                  </Link>
                ))
              ) : (
                <div className="col-span-2 flex h-24 flex-col items-center justify-center text-slate-650 border border-dashed border-slate-800 rounded-lg">
                  <Train size={20} className="text-slate-500/20 mb-1" />
                  <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">No active trains allocated</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stations Sequence Section */}
        <div className="rounded-xl border border-slate-800 bg-[#070b19] p-5 shadow-lg space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <h3 className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
              Sequential Stop Points Sequence
            </h3>
            <span className="rounded bg-slate-900 border border-slate-800 px-2 py-0.5 font-mono text-[9px] text-slate-500">
              {stations.length} STATIONS MAPPED
            </span>
          </div>

          <div className="relative pl-6 space-y-6 font-mono text-xs">
            {stations.length > 0 ? (
              stations.map((s: any, idx: number) => {
                const isFirst = idx === 0;
                const isLast = idx === stations.length - 1;
                return (
                  <div key={s.station_id} className="relative flex items-center justify-between">
                    {/* Line Connector visual */}
                    <div
                      className="absolute -left-[17px] top-[14px] w-0.5"
                      style={{
                        height: isLast ? "0px" : "36px",
                        backgroundColor: route.route_color || "#808080"
                      }}
                    ></div>
                    {/* Node Dot */}
                    <div
                      className="absolute -left-[20px] top-[4px] h-2 w-2 rounded-full border border-slate-950"
                      style={{ backgroundColor: route.route_color || "#808080" }}
                    ></div>

                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between pl-2">
                      <div className="space-y-0.5">
                        <Link
                          href={`/stations/${s.station_id}`}
                          className="font-bold text-slate-200 hover:text-cyan-400 transition-colors"
                        >
                          {s.station_name}
                        </Link>
                        <span className="block text-[9px] text-slate-500 uppercase">{s.station_layout} layout</span>
                      </div>
                      
                      <div className="flex items-center space-x-6 text-[11px] text-slate-400 mt-1 sm:mt-0">
                        <span className="flex items-center space-x-1">
                          <MapPin size={12} className="text-slate-600" />
                          <span>Dist: {s.distance_from_start} km</span>
                        </span>
                        
                        {s.is_interchange && (
                          <span className="flex items-center space-x-1 rounded bg-violet-950/40 px-2 py-0.5 text-[8px] font-bold text-violet-400 border border-violet-800/30">
                            <Sparkles size={8} />
                            <span>INTERCHANGE</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex h-36 flex-col items-center justify-center text-slate-650 border border-dashed border-slate-800/60 rounded-xl">
                <Layers size={24} className="text-slate-500/20 mb-1" />
                <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">No stations config for this transit line</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </CommandCenterLayout>
  );
}
