import { useState, useEffect } from "react";
import api from "../api/axios";

function getHeatColor(value, max) {
  const ratio = Math.min(1, value / max);
  if (ratio < 0.25) return `rgba(34, 197, 94, ${0.25 + ratio * 2})`;
  if (ratio < 0.5) return `rgba(234, 179, 8, ${0.4 + ratio})`;
  if (ratio < 0.75) return `rgba(249, 115, 22, ${0.5 + ratio * 0.5})`;
  return `rgba(239, 68, 68, ${0.6 + ratio * 0.4})`;
}

function CongestionHeatmap() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/reports/congestion-heatmap", { params: { top_n: 12 } })
      .then((res) => setData(res.data))
      .catch((err) => console.error("Failed to load heatmap", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-slate-400">Loading heatmap...</p>;
  if (!data) return <p className="text-red-400">Failed to load congestion heatmap.</p>;

  const maxValue = Math.max(
    ...data.grid.flatMap((row) => row.values.map((v) => v.passengers))
  );

  return (
    <div className="overflow-x-auto">
      <table className="border-collapse text-xs">
        <thead>
          <tr>
            <th className="text-left text-slate-400 pr-3 pb-2 sticky left-0 bg-slate-800">Station</th>
            {data.hours.map((hour) => (
              <th key={hour} className="text-slate-400 pb-2 px-1 font-normal min-w-[36px]">
                {hour}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.grid.map((row) => (
            <tr key={row.station}>
              <td className="text-slate-300 pr-3 py-0.5 whitespace-nowrap sticky left-0 bg-slate-800">
                {row.station}
              </td>
              {row.values.map((v) => (
                <td key={v.hour} className="p-0.5">
                  <div
                    title={`${row.station} @ ${v.hour}:00 — ${v.passengers} passengers`}
                    className="w-8 h-6 rounded flex items-center justify-center text-[10px] text-white/90 cursor-default"
                    style={{ backgroundColor: getHeatColor(v.passengers, maxValue) }}
                  >
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center gap-2 mt-3 text-xs text-slate-400">
        <span>Low</span>
        <div className="w-4 h-4 rounded" style={{ backgroundColor: "rgba(34, 197, 94, 0.4)" }} />
        <div className="w-4 h-4 rounded" style={{ backgroundColor: "rgba(234, 179, 8, 0.6)" }} />
        <div className="w-4 h-4 rounded" style={{ backgroundColor: "rgba(249, 115, 22, 0.8)" }} />
        <div className="w-4 h-4 rounded" style={{ backgroundColor: "rgba(239, 68, 68, 1)" }} />
        <span>Critical</span>
      </div>
    </div>
  );
}

export default CongestionHeatmap;