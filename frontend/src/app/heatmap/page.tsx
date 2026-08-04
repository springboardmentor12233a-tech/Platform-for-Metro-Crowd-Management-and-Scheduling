"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import CommandCenterLayout from "@/components/CommandCenterLayout";
import { api } from "@/utils/api";

// Dynamically import the map component with SSR disabled
const CrowdMap = dynamic(() => import("@/components/CrowdMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-slate-950 text-cyan-400 border border-slate-800 rounded-xl">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>
        <p className="font-mono text-xs tracking-wider text-cyan-300">MOUNTING MAP GRAPHICS SYSTEM...</p>
      </div>
    </div>
  )
});

export default function HeatmapPage() {
  const [stations, setStations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getStationsData = async () => {
      try {
        const data = await api.stations.list();
        setStations(data);
        setLoading(false);
      } catch (err) {
        console.error("Heatmap station fetch error:", err);
        setLoading(false);
      }
    };
    getStationsData();
  }, []);

  return (
    <CommandCenterLayout>
      <div className="flex flex-col h-full space-y-4">
        {/* Header */}
        <div>
          <h1 className="text-xl font-bold tracking-wider font-mono text-cyan-400 text-glow-cyan">
            CONGESTION HEATMAP
          </h1>
          <p className="text-xs text-slate-500 font-mono">
            Interactive geographic visualization of real-time passenger densities
          </p>
        </div>

        {/* Map Frame Container */}
        <div className="flex-1 min-h-[500px]">
          {!loading ? (
            <CrowdMap stations={stations} />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-950 text-cyan-400 border border-slate-800 rounded-xl">
              <div className="flex flex-col items-center space-y-4">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>
                <p className="font-mono text-xs tracking-wider text-cyan-300">SYNCING COORDINATE MATRIX...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </CommandCenterLayout>
  );
}
