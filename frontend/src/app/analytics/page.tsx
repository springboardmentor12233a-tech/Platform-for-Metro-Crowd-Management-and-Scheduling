"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CommandCenterLayout from "@/components/CommandCenterLayout";
import { api } from "@/utils/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line
} from "recharts";
import { BarChart3, TrendingUp, Landmark, Milestone } from "lucide-react";

export default function AnalyticsPage() {
  const router = useRouter();
  const [stationPerformance, setStationPerformance] = useState<any[]>([]);
  const [routePerformance, setRoutePerformance] = useState<any[]>([]);
  const [trends, setTrends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem("metroflow_user");
    if (userStr) {
      const parsed = JSON.parse(userStr);
      if (parsed.role !== "admin" && parsed.role !== "manager") {
        router.push("/dashboard");
        return;
      }
    } else {
      router.push("/");
      return;
    }
    fetchAnalytics();
  }, [router]);

  const fetchAnalytics = async () => {
    try {
      const sData = await api.analytics.stationPerformance();
      const rData = await api.analytics.routePerformance();
      const tData = await api.analytics.trends();

      setStationPerformance(sData);
      setRoutePerformance(rData);
      setTrends(tData);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <CommandCenterLayout>
        <div className="flex h-full w-full items-center justify-center text-cyan-400">
          <div className="flex flex-col items-center space-y-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>
            <p className="font-mono text-xs tracking-wider text-cyan-300">COMPILING ANALYTICS REPORTS...</p>
          </div>
        </div>
      </CommandCenterLayout>
    );
  }

  return (
    <CommandCenterLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl font-bold tracking-wider font-mono text-cyan-400 text-glow-cyan">
            OPERATIONAL ANALYTICS
          </h1>
          <p className="text-xs text-slate-500 font-mono">Aggregated passenger flow charts, route line volumes, and transit histories</p>
        </div>

        {/* Charts Row A */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Top Stations Performance */}
          <div className="rounded-xl glass-card-glow-cyan p-5">
            <div className="mb-4 flex items-center space-x-2">
              <Landmark size={16} className="text-cyan-400" />
              <h3 className="text-sm font-mono font-bold tracking-wider text-slate-300">TOP 10 STATIONS BY FLOW</h3>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stationPerformance} margin={{ top: 5, right: 10, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="station_name" stroke="#64748b" fontSize={9} angle={-35} textAnchor="end" height={50} />
                  <YAxis stroke="#64748b" fontSize={9} />
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b" }} />
                  <Bar dataKey="total_flow" name="Total Riders" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Route Performance Bar */}
          <div className="rounded-xl glass-card-glow-violet p-5">
            <div className="mb-4 flex items-center space-x-2">
              <Milestone size={16} className="text-[#8b5cf6]" />
              <h3 className="text-sm font-mono font-bold tracking-wider text-slate-300">ROUTE LOAD COMPARISON</h3>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={routePerformance} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="route_name" stroke="#64748b" fontSize={9} />
                  <YAxis stroke="#64748b" fontSize={9} />
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b" }} />
                  <Bar dataKey="total_flow" name="Total flow" fill="#8b5cf6" radius={[4, 4, 0, 0]}>
                    {routePerformance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.route_color || "#8b5cf6"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Charts Row B: Trends */}
        <div className="rounded-xl glass-card p-5">
          <div className="mb-4 flex items-center space-x-2">
            <TrendingUp size={16} className="text-cyan-400" />
            <h3 className="text-sm font-mono font-bold tracking-wider text-slate-300">DAILY SYSTEM RIDERSHIP VOLUME</h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={9} tickFormatter={(v) => v.slice(5)} />
                <YAxis stroke="#64748b" fontSize={9} />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b" }} />
                <Line type="monotone" dataKey="total_flow" name="Passenger Count" stroke="#10b981" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </CommandCenterLayout>
  );
}
