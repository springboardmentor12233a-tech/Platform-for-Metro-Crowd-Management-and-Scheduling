"use client";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function HeatmapPage() {
  const [heatmap, setHeatmap] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/congestion-heatmap")
      .then((res) => res.json())
      .then((data) => {
        setHeatmap(data.heatmap || []);
        setLoading(false);
      });
  }, []);

  const stations = [...new Set(heatmap.map((h) => h.Station))];
  const hours = [...new Set(heatmap.map((h) => h.Hour))].sort((a, b) => a - b);

  const getValue = (station, hour) => {
    const row = heatmap.find((h) => h.Station === station && h.Hour === hour);
    return row ? row.avg_occupancy_percent : null;
  };

  const getColor = (value) => {
    if (value === null) return "bg-slate-100";
    if (value >= 70) return "bg-red-500 text-white";
    if (value >= 40) return "bg-yellow-400";
    return "bg-green-300";
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 px-6 py-10">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Congestion Heatmap</h1>
            <p className="text-slate-500 mt-1">Station occupancy by hour of day</p>
          </div>

          {loading && (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500">
              Loading heatmap...
            </div>
          )}

          {!loading && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left p-2 text-slate-600">Station</th>
                    {hours.map((h) => (
                      <th key={h} className="p-2 text-slate-600 text-center">
                        {h}:00
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {stations.map((station) => (
                    <tr key={station}>
                      <td className="p-2 font-medium text-slate-900 whitespace-nowrap">
                        {station}
                      </td>
                      {hours.map((h) => {
                        const val = getValue(station, h);
                        return (
                          <td key={h} className="p-1">
                            <div className={`w-12 h-8 rounded flex items-center justify-center text-xs ${getColor(val)}`}>
                              {val !== null ? val : "-"}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex items-center gap-4 mt-5 text-sm text-slate-600">
                <span className="flex items-center gap-1">
                  <span className="w-4 h-4 bg-green-300 rounded inline-block"></span> Low
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-4 h-4 bg-yellow-400 rounded inline-block"></span> Medium
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-4 h-4 bg-red-500 rounded inline-block"></span> High
                </span>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}