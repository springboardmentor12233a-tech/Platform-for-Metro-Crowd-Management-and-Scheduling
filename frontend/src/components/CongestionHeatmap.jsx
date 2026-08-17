import { useState, useEffect } from "react";
import api from "../api/axios";

function getHeatDetails(value, max) {
  const ratio = Math.min(1, value / max);
  if (ratio < 0.25) {
    return {
      bg: `rgba(34, 197, 94, ${0.35 + ratio * 2})`,
      border: "rgba(34, 197, 94, 0.4)",
      label: "Low",
      text: "text-emerald-400",
    };
  }
  if (ratio < 0.5) {
    return {
      bg: `rgba(234, 179, 8, ${0.5 + ratio})`,
      border: "rgba(234, 179, 8, 0.5)",
      label: "Moderate",
      text: "text-amber-400",
    };
  }
  if (ratio < 0.75) {
    return {
      bg: `rgba(249, 115, 22, ${0.6 + ratio * 0.4})`,
      border: "rgba(249, 115, 22, 0.6)",
      label: "High",
      text: "text-orange-400",
    };
  }
  return {
    bg: `rgba(239, 68, 68, ${0.75 + ratio * 0.25})`,
    border: "rgba(239, 68, 68, 0.7)",
    label: "Critical",
    text: "text-red-400",
  };
}

function CongestionHeatmap() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredCell, setHoveredCell] = useState(null);

  useEffect(() => {
    api.get("/reports/congestion-heatmap", { params: { top_n: 12 } })
      .then((res) => setData(res.data))
      .catch((err) => console.error("Failed to load heatmap", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-400 animate-pulse font-mono text-xs">
        Loading network congestion heatmap...
      </div>
    );
  }

  if (!data) {
    return <p className="text-red-400 text-xs">Failed to load congestion heatmap telemetry.</p>;
  }

  const maxValue = Math.max(
    ...data.grid.flatMap((row) => row.values.map((v) => v.passengers))
  );

  return (
    <div className="space-y-4">
      {/* Top Peak Windows Highlight & Active Cell Telemetry */}
      <div className="flex items-center justify-between flex-wrap gap-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-300">PEAK WINDOWS:</span>
          <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono font-medium">
            🌅 08:00 – 10:00 (Morning Surge)
          </span>
          <span className="px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 font-mono font-medium">
            🌆 17:00 – 20:00 (Evening Surge)
          </span>
        </div>

        {/* Hovered Cell Detail Badge */}
        {hoveredCell ? (
          <div className="flex items-center gap-2 font-mono text-[11px] text-cyan-300">
            <span>{hoveredCell.station} @ {hoveredCell.hour}:00</span>
            <span className="text-white font-bold">{hoveredCell.passengers} pax</span>
            <span className={`px-1.5 py-0.2 rounded ${hoveredCell.details.text} bg-slate-900 border border-slate-700`}>
              {hoveredCell.details.label}
            </span>
          </div>
        ) : (
          <span className="text-slate-400 text-[11px]">Hover over matrix cell for telemetry details</span>
        )}
      </div>

      {/* Heatmap Matrix Table */}
      <div className="overflow-x-auto">
        <table className="border-separate border-spacing-1 text-xs w-full min-w-[700px]">
          <thead>
            <tr>
              <th className="text-left text-slate-400 pr-3 pb-2 sticky left-0 bg-slate-900/90 z-20 font-semibold uppercase text-[10px] tracking-wider">
                Station
              </th>
              {data.hours.map((hour) => {
                const isPeak = (hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 20);
                return (
                  <th
                    key={hour}
                    className={`pb-2 px-1 font-mono text-[11px] text-center font-normal min-w-[34px] rounded ${
                      isPeak ? "text-amber-400 bg-amber-500/10 font-bold" : "text-slate-400"
                    }`}
                  >
                    {hour}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {data.grid.map((row) => (
              <tr key={row.station}>
                <td className="text-slate-200 pr-3 py-1 font-semibold whitespace-nowrap sticky left-0 bg-slate-900/95 z-10 text-xs">
                  {row.station}
                </td>
                {row.values.map((v) => {
                  const details = getHeatDetails(v.passengers, maxValue);
                  return (
                    <td key={v.hour} className="p-0 text-center relative">
                      <div
                        onMouseEnter={() => setHoveredCell({ station: row.station, hour: v.hour, passengers: v.passengers, details })}
                        onMouseLeave={() => setHoveredCell(null)}
                        className="w-full h-7 rounded-md transition-all duration-150 cursor-pointer flex items-center justify-center text-[10px] font-mono font-medium hover:scale-110 hover:shadow-lg hover:z-30 relative"
                        style={{
                          backgroundColor: details.bg,
                          border: `1px solid ${details.border}`,
                        }}
                        title={`${row.station} @ ${v.hour}:00 — ${v.passengers} passengers (${details.label})`}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Heatmap Legend */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
        <span className="font-semibold text-slate-300">Congestion Severity Scale:</span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded bg-emerald-500/40 border border-emerald-500" />
            <span className="text-emerald-400 font-medium">Low (&lt; 250)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded bg-amber-500/60 border border-amber-500" />
            <span className="text-amber-400 font-medium">Moderate (250–500)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded bg-orange-500/80 border border-orange-500" />
            <span className="text-orange-400 font-medium">High (500–750)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded bg-red-600 border border-red-500" />
            <span className="text-red-400 font-medium">Critical (&gt; 750)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CongestionHeatmap;