"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import CommandCenterLayout from "@/components/CommandCenterLayout";
import { api } from "@/utils/api";
import {
  ArrowLeft,
  Train,
  Milestone,
  Clock,
  Layers,
  Activity,
  AlertTriangle,
  CheckCircle,
  Users
} from "lucide-react";

export default function TrainDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const trainId = parseInt(resolvedParams.id);

  const [train, setTrain] = useState<any>(null);
  const [route, setRoute] = useState<any>(null);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [stations, setStations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchTrainDetailData = async () => {
      try {
        // 1. Fetch Train metadata
        const trainData = await api.trains.get(trainId);
        setTrain(trainData);

        // 2. Fetch associated route
        if (trainData.route_id) {
          try {
            const routeData = await api.routes.get(trainData.route_id);
            setRoute(routeData);
          } catch (e) {
            console.error("Failed to fetch train route:", e);
          }
        }

        // 3. Fetch schedules and filter by train_id
        const scheduleList = await api.schedules.list();
        const trainSchedules = scheduleList.filter((s: any) => s.train_id === trainId);
        setSchedules(trainSchedules);

        // 4. Fetch stations for reference
        const stationList = await api.stations.list();
        setStations(stationList);

        setLoading(false);
      } catch (err: any) {
        console.error(err);
        setErrorMsg(err.message || "Failed to load train diagnostics.");
        setLoading(false);
      }
    };

    fetchTrainDetailData();
  }, [trainId]);

  const getStationName = (id: number) => {
    const s = stations.find(item => item.station_id === id);
    return s ? s.station_name : `Station #${id}`;
  };

  if (loading) {
    return (
      <CommandCenterLayout>
        <div className="flex h-full w-full items-center justify-center text-cyan-400">
          <div className="flex flex-col items-center space-y-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>
            <p className="font-mono text-xs tracking-wider text-cyan-300">RETRIEVING STOCK DIAGNOSTICS...</p>
          </div>
        </div>
      </CommandCenterLayout>
    );
  }

  if (errorMsg || !train) {
    return (
      <CommandCenterLayout>
        <div className="rounded-xl border border-red-500/20 bg-red-950/5 p-6 text-center space-y-4 max-w-md mx-auto mt-10">
          <AlertTriangle className="text-red-400 h-10 w-10 mx-auto animate-pulse" />
          <h2 className="font-mono text-sm font-bold text-red-200 uppercase">Train Profile Error</h2>
          <p className="font-mono text-xs text-slate-400">{errorMsg || "Train record could not be found."}</p>
          <Link
            href="/trains"
            className="inline-flex items-center space-x-1.5 rounded-lg bg-red-950/60 border border-red-800/40 py-2 px-4 font-mono text-xs text-red-400 hover:bg-red-900/20"
          >
            <ArrowLeft size={14} />
            <span>BACK TO STOCKS</span>
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
            href="/trains"
            className="p-2 border border-slate-800 bg-[#0f172a] hover:bg-slate-800/40 rounded-xl text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <span className="block text-[8px] font-black tracking-widest text-slate-500 uppercase">ROLLING STOCK DIAGNOSTICS</span>
            <h1 className="text-xl font-bold tracking-wider font-mono text-cyan-400 text-glow-cyan uppercase">
              TRAIN // {train.train_number}
            </h1>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Train Specifications Card */}
          <div className="rounded-xl border border-slate-800 bg-[#070b19] p-5 shadow-lg space-y-4">
            <h3 className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase border-b border-slate-800 pb-2">
              Train Specifications
            </h3>
            <div className="space-y-3 font-mono text-xs text-slate-350">
              <div className="flex justify-between items-center border-b border-slate-850/40 pb-1.5">
                <span className="text-slate-500 uppercase text-[9px]">Train ID:</span>
                <span className="text-slate-200 font-bold">#{train.train_id}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-850/40 pb-1.5">
                <span className="text-slate-500 uppercase text-[9px]">Stock Number:</span>
                <span className="text-slate-200 font-bold">{train.train_number}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-850/40 pb-1.5">
                <span className="text-slate-500 uppercase text-[9px]">Stock Name:</span>
                <span className="text-slate-200 font-bold">{train.train_name}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-850/40 pb-1.5">
                <span className="text-slate-500 uppercase text-[9px]">Passenger Limit:</span>
                <span className="text-slate-200 font-bold">{train.capacity.toLocaleString()} Pax</span>
              </div>
              <div className="flex justify-between items-center pb-0.5">
                <span className="text-slate-500 uppercase text-[9px]">Live Route:</span>
                {route ? (
                  <Link
                    href={`/routes/${route.route_id}`}
                    className="flex items-center space-x-2 rounded bg-slate-900 border border-slate-850 px-2 py-0.5 text-xs text-cyan-400 font-bold"
                  >
                    <span
                      className="h-2 w-2 rounded-full inline-block"
                      style={{ backgroundColor: route.route_color || "#808080" }}
                    ></span>
                    <span>{route.route_name}</span>
                  </Link>
                ) : (
                  <span className="text-slate-400">UNALLOCATED</span>
                )}
              </div>
            </div>
          </div>

          {/* Telemetry Status Card */}
          <div className="rounded-xl border border-slate-800 bg-[#070b19] p-5 shadow-lg flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase border-b border-slate-800 pb-2">
                Operational Status
              </h3>
              <div className="mt-4 flex items-center space-x-3 bg-slate-950/40 p-4 rounded-xl border border-slate-850">
                {train.status === "Delayed" ? (
                  <>
                    <div className="p-2.5 rounded-xl bg-yellow-950 text-yellow-400 border border-yellow-800/20 animate-pulse">
                      <AlertTriangle size={20} />
                    </div>
                    <div>
                      <span className="block text-[8px] font-mono text-slate-500 uppercase">Current Operations Status</span>
                      <span className="block text-sm font-black text-yellow-400">DELAYED ON LINE</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-2.5 rounded-xl bg-green-950 text-green-400 border border-green-800/20">
                      <CheckCircle size={20} />
                    </div>
                    <div>
                      <span className="block text-[8px] font-mono text-slate-500 uppercase">Current Operations Status</span>
                      <span className="block text-sm font-black text-green-400">STOCK NORMAL / RUNNING</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="text-[10px] text-slate-500 font-mono leading-normal pt-4">
              Real-time speed controls and driver schedules are synced automatically. Operators can update state directly from terminal stock listings.
            </div>
          </div>

          {/* Incident Severity */}
          <div className="rounded-xl border border-slate-800 bg-[#070b19] p-5 shadow-lg space-y-4">
            <h3 className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase border-b border-slate-800 pb-2">
              Broadcast Advisories
            </h3>
            <div className="space-y-3 max-h-40 overflow-y-auto">
              {train.status === "Delayed" ? (
                <div className="rounded-lg border border-yellow-900/30 bg-yellow-950/10 p-3 flex flex-col space-y-1">
                  <div className="flex justify-between items-center text-[9px] font-mono font-black text-yellow-400">
                    <span>DELAY BROADCAST</span>
                    <span>LIVE</span>
                  </div>
                  <p className="text-xs font-mono text-slate-300 leading-normal">
                    Train reported delays. Schedules have been updated on transit boards.
                  </p>
                </div>
              ) : (
                <div className="flex h-24 flex-col items-center justify-center text-slate-650 border border-dashed border-slate-800 rounded-lg bg-slate-950/5">
                  <CheckCircle size={18} className="text-green-500/30 mb-1" />
                  <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">NO BROADCASTS</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Schedules / Stops List for this Train */}
        <div className="rounded-xl border border-slate-800 bg-[#070b19] p-5 shadow-lg space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <h3 className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
              Configured Schedules & Timetable Stops
            </h3>
            <span className="rounded bg-slate-900 border border-slate-800 px-2 py-0.5 font-mono text-[9px] text-slate-500">
              {schedules.length} TIMETABLES CONFIG
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 uppercase text-[9px] tracking-wider">
                  <th className="p-3">Stop Station</th>
                  <th className="p-3">Arrival Time</th>
                  <th className="p-3">Departure Time</th>
                  <th className="p-3">Service mode</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850 text-slate-350">
                {schedules.length > 0 ? (
                  schedules.map((s: any) => (
                    <tr key={s.schedule_id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-3 font-bold text-slate-200">
                        <Link
                          href={`/stations/${s.station_id}`}
                          className="hover:text-cyan-400 transition-colors"
                        >
                          {getStationName(s.station_id)}
                        </Link>
                      </td>
                      <td className="p-3 flex items-center space-x-1.5 text-green-400">
                        <Clock size={12} />
                        <span>{s.arrival_time}</span>
                      </td>
                      <td className="p-3 items-center space-x-1.5 text-red-400">
                        <span className="flex items-center space-x-1.5">
                          <Clock size={12} />
                          <span>{s.departure_time}</span>
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="rounded bg-slate-950 border border-slate-850 px-2 py-0.5 text-[9px]">
                          {s.day_type}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-500 text-[10px] uppercase font-bold">
                      No active timetable stops configured for this rolling stock
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </CommandCenterLayout>
  );
}
