import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Radio } from "lucide-react";

const ACCENTS = {
  teal: { line: "#2DD4BF", glow: "rgba(45,212,191,0.35)", soft: "rgba(45,212,191,0.12)" },
  violet: { line: "#8B5CF6", glow: "rgba(139,92,246,0.35)", soft: "rgba(139,92,246,0.12)" },
  amber: { line: "#F5B942", glow: "rgba(245,185,66,0.35)", soft: "rgba(245,185,66,0.12)" },
  rose: { line: "#F2545B", glow: "rgba(242,84,91,0.35)", soft: "rgba(242,84,91,0.12)" },
};

// Best-effort mapping so old `color="from-indigo-500 to-violet-600"` style
// props still resolve to something sensible without breaking callers.
function resolveAccent(accent, legacyColor) {
  if (accent && ACCENTS[accent]) return ACCENTS[accent];
  if (legacyColor) {
    const c = legacyColor.toLowerCase();
    if (c.includes("amber") || c.includes("orange") || c.includes("yellow")) return ACCENTS.amber;
    if (c.includes("rose") || c.includes("red")) return ACCENTS.rose;
    if (c.includes("emerald") || c.includes("teal") || c.includes("green") || c.includes("cyan")) return ACCENTS.teal;
  }
  return ACCENTS.violet;
}

// If no explicit history array is passed, synthesize a short rising/falling
// sparkline from the legacy `progress` percentage so old usages still render.
function resolveHistory(history, progress) {
  if (Array.isArray(history) && history.length >= 2) return history;
  const end = typeof progress === "number" ? progress : 60;
  const start = Math.max(0, end - 18);
  return [start, start + 4, start + 2, start + 9, end - 6, end - 2, end];
}

function Sparkline({ data, color }) {
  const w = 100;
  const h = 32;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((d - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-8 w-full" preserveAspectRatio="none">
      <motion.polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
      />
    </svg>
  );
}

export default function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  accent,
  color, // legacy prop, still supported
  trend = "+4.8%",
  trendUp,
  history,
  progress, // legacy prop, still supported
  status = "Live",
}) {
  const c = resolveAccent(accent, color);
  const sparkData = resolveHistory(history, progress);
  const isUp = typeof trendUp === "boolean" ? trendUp : !String(trend).trim().startsWith("-");

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#10141C]/90 shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset] backdrop-blur-xl"
    >
      {/* Line-coded rail — signature element, reads like a metro line marker */}
      <div
        className="absolute left-0 right-0 top-0 h-[3px]"
        style={{ background: c.line, boxShadow: `0 0 12px ${c.glow}` }}
      />

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
              {title}
            </p>

            <div className="mt-3 flex items-baseline gap-2">
              <h2 className="font-mono text-3xl font-semibold tracking-tight text-slate-100 tabular-nums">
                {value}
              </h2>

              <span
                className="flex items-center gap-0.5 text-[11px] font-medium"
                style={{ color: isUp ? "#34D399" : "#F87171" }}
              >
                {isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {trend}
              </span>
            </div>

            {subtitle && <p className="mt-1.5 truncate text-[13px] text-slate-500">{subtitle}</p>}
          </div>

          {Icon && (
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.06]"
              style={{ background: c.soft }}
            >
              <Icon size={20} style={{ color: c.line }} strokeWidth={1.75} />
            </div>
          )}
        </div>

        {/* Sparkline signal replaces the old static progress bar */}
        <div className="-mx-1 mt-5">
          <Sparkline data={sparkData} color={c.line} />
        </div>

        {/* Footer */}
        <div className="mt-3 flex items-center justify-between border-t border-white/[0.05] pt-3">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span
                className="absolute inline-flex h-full w-full animate-ping rounded-full"
                style={{ background: c.line, opacity: 0.5 }}
              />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: c.line }} />
            </span>
            <span className="text-[11px] text-slate-500">{status}</span>
          </div>

          <Radio size={14} className="text-slate-600" />
        </div>
      </div>
    </motion.div>
  );
}