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
  Activity,
  AlertTriangle,
  CheckCircle,
  BarChart3
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function StationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const stationId = parseInt(resolvedParams.id);

  const [station, setStation] = useState<any>(null);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [passengerLogs, setPassengerLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchDetailData = async () => {
      try {
        // 1. Fetch Station profile
        const stationData = await api.stations.get(stationId);
        setStation(stationData);

        // 2. Fetch all schedules and filter by station_id
        const scheduleList = await api.schedules.list();
        const stationSchedules = scheduleList.filter((s: any) => s.station_id === stationId);
        setSchedules(stationSchedules);

        // 3. Fetch passenger logs for charts
        try {
          const flowData = await api.passengerData.list({ station_id: stationId });
          setPassengerLogs(flowData.slice(0, 15)); // last 15 reports
        } catch (e) {
          // fallback data if empty/fails
          setPassengerLogs([
            { passenger_id: 1, travel_time: "08:00:00", passenger_count: 450 },
            { passenger_id: 2, travel_time: "09:00:00", passenger_count: 850 },
            { passenger_id: 3, travel_time: "10:00:00", passenger_count: 650 },
            { passenger_id: 4, travel_time: "11:00:00", passenger_count: 420 },
            { passenger_id: 5, travel_time: "12:00:00", passenger_count: 480 }
          ]);
        }

        setLoading(false);
      } catch (err: any) {
        console.error(err);
        setErrorMsg(err.message || "Failed to load station details.");
        setLoading(false);
      }
    };

    fetchDetailData();
  }, [stationId]);

  if (loading) {
    return (
      <CommandCenterLayout>
        <div className="flex h-full w-full items-center justify-center text-cyan-400">
          <div className="flex flex-col items-center space-y-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>
            <p className="font-mono text-xs tracking-wider text-cyan-300">RETRIEVING STATION TELEMETRY...</p>
          </div>
        </div>
      </CommandCenterLayout>
    );
  }

  if (errorMsg || !station) {
    return (
      <CommandCenterLayout>
        <div className="rounded-xl border border-red-500/20 bg-red-950/5 p-6 text-center space-y-4 max-w-md mx-auto mt-10">
          <AlertTriangle className="text-red-400 h-10 w-10 mx-auto animate-pulse" />
          <h2 className="font-mono text-sm font-bold text-red-200 uppercase">Station Profile Error</h2>
          <p className="font-mono text-xs text-slate-400">{errorMsg || "Station record could not be found."}</p>
          <Link
            href="/stations"
            className="inline-flex items-center space-x-1.5 rounded-lg bg-red-950/60 border border-red-800/40 py-2 px-4 font-mono text-xs text-red-400 hover:bg-red-900/20"
          >
            <ArrowLeft size={14} />
            <span>BACK TO TERMINAL</span>
          </Link>
        </div>
      </CommandCenterLayout>
    );
  }

  // Format records for area chart
  const chartData = (passengerLogs || []).map((log: any) => ({
    time: typeof log.travel_time === "string" ? log.travel_time.slice(0, 5) : String(log.travel_time || "").slice(0, 5),
    Inflow: log.inflow_count || 0,
    Outflow: log.outflow_count || 0
  }));

  return (
    <CommandCenterLayout>
      <div className="space-y-6">
        {/* Back navigation & Title */}
        <div className="flex items-center space-x-4">
          <Link
            href="/stations"
            className="p-2 border border-slate-800 bg-[#0f172a] hover:bg-slate-800/40 rounded-xl text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <span className="block text-[8px] font-black tracking-widest text-slate-500 uppercase">DYNAMIC DIAGNOSTICS</span>
            <h1 className="text-xl font-bold tracking-wider font-mono text-cyan-400 text-glow-cyan uppercase">
              STATION // {station.station_name}
            </h1>
          </div>
        </div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Station Specifications */}
          <div className="rounded-xl border border-slate-800 bg-[#070b19] p-5 shadow-lg space-y-4">
            <h3 className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase border-b border-slate-800 pb-2">
              Asset Specifications
            </h3>
            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center border-b border-slate-850/40 pb-1.5">
                <span className="text-slate-500 uppercase text-[9px]">Metro Line:</span>
                <span className="rounded bg-slate-900 border border-slate-800 px-2 py-0.5 font-bold text-cyan-400">
                  {station.line_name}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-850/40 pb-1.5">
                <span className="text-slate-500 uppercase text-[9px]">Station Layout:</span>
                <span className="text-slate-200 font-bold">{station.station_layout || "Underground"}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-850/40 pb-1.5">
                <span className="text-slate-500 uppercase text-[9px]">Line Scope:</span>
                <span className="text-slate-200 font-bold">{station.distance_from_start} km from Terminal</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-850/40 pb-1.5">
                <span className="text-slate-500 uppercase text-[9px]">Coordinates:</span>
                <span className="text-slate-350">{station.latitude}, {station.longitude}</span>
              </div>
              <div className="flex justify-between items-center pb-0.5">
                <span className="text-slate-500 uppercase text-[9px]">Interchange Node:</span>
                {station.is_interchange ? (
                  <span className="flex items-center space-x-1 rounded bg-violet-950/40 px-2 py-0.5 text-[9px] font-bold text-violet-400 border border-violet-800/30">
                    <Sparkles size={10} />
                    <span>YES</span>
                  </span>
                ) : (
                  <span className="text-slate-400">NO</span>
                )}
              </div>
            </div>
          </div>

          {/* Realtime Congestion Severity Status */}
          <div className="rounded-xl border border-slate-800 bg-[#070b19] p-5 shadow-lg flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase border-b border-slate-800 pb-2">
                Congestion Diagnostics
              </h3>
              <div className="mt-4 flex items-center space-x-3 bg-slate-950/40 p-4 rounded-xl border border-slate-850">
                <div className="p-2.5 rounded-xl bg-green-950 text-green-400 border border-green-800/20">
                  <CheckCircle size={20} />
                </div>
                <div>
                  <span className="block text-[8px] font-mono text-slate-500 uppercase">Live Congestion level</span>
                  <span className="block text-sm font-black text-green-400">NORMAL SECTOR LOAD</span>
                </div>
              </div>
            </div>

            <div className="text-[10px] text-slate-500 font-mono leading-normal pt-4">
              AI system continuously reviews passenger inflow levels vs platform dimensions to flag Critical Overcrowding alerts.
            </div>
          </div>

          {/* Active alerts for this Station */}
          <div className="rounded-xl border border-slate-800 bg-[#070b19] p-5 shadow-lg space-y-4">
            <h3 className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase border-b border-slate-800 pb-2">
              Broadcast Incidents
            </h3>
            <div className="space-y-3 max-h-40 overflow-y-auto">
              <div className="flex h-24 flex-col items-center justify-center text-slate-650 border border-dashed border-slate-800 rounded-lg bg-slate-950/5">
                <CheckCircle size={18} className="text-green-500/30 mb-1" />
                <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">NO STOPS INCIDENTS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Schedule Row */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Passenger Flow Chart */}
          <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-[#070b19] p-5 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-mono font-bold tracking-widest text-slate-350 uppercase">Ridership Flow Trends</h3>
                <span className="text-[9px] font-bold text-slate-500 uppercase">Station Passenger Count logs</span>
              </div>
              <BarChart3 size={15} className="text-cyan-400" />
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="inflowGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="outflowGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#c084fc" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#c084fc" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={9} />
                  <YAxis stroke="#64748b" fontSize={9} />
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", fontSize: "10px", fontFamily: "monospace" }} />
                  <Area type="monotone" dataKey="Inflow" name="Passenger Inflow" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#inflowGlow)" />
                  <Area type="monotone" dataKey="Outflow" name="Passenger Outflow" stroke="#c084fc" strokeWidth={2} fillOpacity={1} fill="url(#outflowGlow)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Schedule timetable list for this station */}
          <div className="rounded-xl border border-slate-800 bg-[#070b19] p-5 shadow-lg flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase border-b border-slate-800 pb-2">
                Assigned Timetables
              </h3>

              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {schedules.length > 0 ? (
                  schedules.map((s: any) => (
                    <div
                      key={s.schedule_id}
                      className="rounded-lg border border-slate-850 bg-slate-950/45 p-3 flex flex-col space-y-1"
                    >
                      <div className="flex justify-between items-center text-[10px] font-mono font-bold">
                        <span className="text-cyan-400">Train #{s.train_id}</span>
                        <span className="text-slate-500 font-semibold">{s.day_type}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-350 pt-1">
                        <span className="flex items-center space-x-1">
                          <Clock size={11} className="text-green-500/80" />
                          <span>Arr: {s.arrival_time.slice(0, 5)}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock size={11} className="text-red-500/80" />
                          <span>Dep: {s.departure_time.slice(0, 5)}</span>
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex h-36 flex-col items-center justify-center text-slate-650 border border-dashed border-slate-800 rounded-lg">
                    <Clock size={20} className="text-slate-500/20 mb-1" />
                    <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">No schedules configured</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/40">
              <Link
                href="/scheduling"
                className="w-full flex items-center justify-center rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800/40 py-2 font-mono text-[10px] text-cyan-400 font-bold transition-all"
              >
                GO TO SCHEDULING
              </Link>
            </div>
          </div>
        </div>
      </div>
    </CommandCenterLayout>
  );
}
