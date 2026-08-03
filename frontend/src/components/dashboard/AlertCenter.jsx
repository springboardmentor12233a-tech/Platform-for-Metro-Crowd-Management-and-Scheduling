import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  Bell,
  ShieldAlert,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Search,
} from "lucide-react";

function formatRelativeTime(time) {
  const diff = Math.floor((Date.now() - new Date(time)) / 60000);

  if (diff < 1) return "Just now";
  if (diff < 60) return `${diff} min ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)} hr ago`;
  return `${Math.floor(diff / 1440)} day ago`;
}

function AlertCenter({
  alerts = [],
  onAcknowledge,
  onDismiss,
  onRefresh,
}) {

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("All");

  const [toasts, setToasts] = useState([]);

  const knownAlertIds = useRef(new Set());

  const severity = {
    Critical: {
      icon: ShieldAlert,
      bg: "bg-red-50",
      text: "text-red-600",
      border: "border-red-300",
      color: "bg-red-500",
    },

    High: {
      icon: AlertTriangle,
      bg: "bg-orange-50",
      text: "text-orange-600",
      border: "border-orange-300",
      color: "bg-orange-500",
    },

    Medium: {
      icon: AlertCircle,
      bg: "bg-yellow-50",
      text: "text-yellow-600",
      border: "border-yellow-300",
      color: "bg-yellow-500",
    },

    Low: {
      icon: CheckCircle2,
      bg: "bg-green-50",
      text: "text-green-600",
      border: "border-green-300",
      color: "bg-green-500",
    },
  };

  const filteredAlerts = useMemo(() => {

    let data = [...alerts];

    if (search) {

      data = data.filter((alert) =>
        alert.station_name
          .toLowerCase()
          .includes(search.toLowerCase())
      );

    }

    if (filter !== "All") {

      data = data.filter(
        (alert) =>
          alert.risk_level === filter
      );

    }

    const priority = {
      Critical: 4,
      High: 3,
      Medium: 2,
      Low: 1,
    };

    data.sort((a, b) => {

      if (priority[a.risk_level] !== priority[b.risk_level]) {
        return priority[b.risk_level] - priority[a.risk_level];
      }

      return new Date(b.created_at) - new Date(a.created_at);

    });

    return data;

  }, [alerts, search, filter]);

  const stats = {

    total: filteredAlerts.length,

    critical: filteredAlerts.filter(
      (a) => a.risk_level === "Critical"
    ).length,

    high: filteredAlerts.filter(
      (a) => a.risk_level === "High"
    ).length,

    medium: filteredAlerts.filter(
      (a) => a.risk_level === "Medium"
    ).length,

    low: filteredAlerts.filter(
      (a) => a.risk_level === "Low"
    ).length,

  };

  // Auto-refresh every 30s. Calls the optional onRefresh prop so only the
  // alert data updates — no forced full-page reload.
  useEffect(() => {

    const interval = setInterval(() => {
      onRefresh?.();
    }, 30000);

    return () => clearInterval(interval);

  }, [onRefresh]);

  // Fire a lightweight toast whenever a new Critical alert shows up.
  useEffect(() => {

    const currentIds = new Set(alerts.map((a) => a.id));

    if (knownAlertIds.current.size > 0) {

      const newCritical = alerts.filter(
        (a) =>
          a.risk_level === "Critical" &&
          !knownAlertIds.current.has(a.id)
      );

      if (newCritical.length > 0) {

        setToasts((prev) => [
          ...prev,
          ...newCritical.map((a) => ({
            id: a.id,
            message: `Critical Alert — ${a.station_name}`,
          })),
        ]);

        newCritical.forEach((a) => {
          setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== a.id));
          }, 5000);
        });

      }
    }

    knownAlertIds.current = currentIds;

  }, [alerts]);

  return (

    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative rounded-[32px] border border-slate-200 bg-white p-8 shadow-xl"
    >
      <div className="pointer-events-none absolute right-6 top-6 z-50 flex flex-col gap-2">

        <AnimatePresence>

          {toasts.map((toast) => (

            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              className="pointer-events-auto rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-lg"
            >

              {toast.message}

            </motion.div>

          ))}

        </AnimatePresence>

      </div>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex items-center gap-4">

          <div className="rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 p-4">

            <Bell
              size={34}
              className="text-white"
            />

          </div>

          <div>

            <h2 className="text-3xl font-bold text-slate-900">

              Operations Alert Center

            </h2>

            <p className="mt-2 text-slate-500">

              Live operational notifications

            </p>

          </div>

        </div>

        <div className="flex items-center gap-4">

          <div className="relative">

            <Bell className="text-slate-700" />

            {stats.total > 0 && (

              <div className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">

                {stats.total}

              </div>

            )}

          </div>

          <div className="flex items-center gap-2 rounded-full bg-green-100 px-4 py-2">

            <span className="h-3 w-3 rounded-full bg-green-500 animate-ping" />

            <span className="font-bold tracking-widest text-green-700">

              LIVE

            </span>

          </div>

          <div className="rounded-2xl bg-slate-100 px-5 py-4">

            <p className="text-sm text-slate-500">

              Active Alerts

            </p>

            <h2 className="text-3xl font-bold text-slate-900">

              {stats.total}

            </h2>

          </div>

        </div>

      </div>

      <div className="mt-8 grid grid-cols-2 gap-5 xl:grid-cols-4">

        {[
          ["Critical", stats.critical, "text-red-600", "bg-red-50"],
          ["High", stats.high, "text-orange-600", "bg-orange-50"],
          ["Medium", stats.medium, "text-yellow-600", "bg-yellow-50"],
          ["Low", stats.low, "text-green-600", "bg-green-50"]
        ].map(([title, value, text, bg]) => (

          <div
            key={title}
            className={`rounded-2xl ${bg} p-6`}
          >

            <p className="text-slate-500">

              {title}

            </p>

            <h2 className={`mt-2 text-4xl font-bold ${text}`}>

              {value}

            </h2>

          </div>

        ))}

      </div>

      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:justify-between">

        <div className="relative w-full lg:w-96">

          <Search
            size={18}
            className="absolute left-4 top-3.5 text-slate-400"
          />

          <input

            value={search}

            onChange={(e) => setSearch(e.target.value)}

            placeholder="Search station..."

            className="w-full rounded-2xl border border-slate-200 py-3 pl-11 pr-4 outline-none focus:border-indigo-500"

          />

        </div>

        <select

          value={filter}

          onChange={(e) => setFilter(e.target.value)}

          className="rounded-2xl border border-slate-200 px-4 py-3"

        >

          <option>All</option>

          <option>Critical</option>

          <option>High</option>

          <option>Medium</option>

          <option>Low</option>

        </select>

      </div>

      <div className="mt-10">

        {filteredAlerts.length === 0 ? (

          <div className="py-20 text-center">

            <CheckCircle2
              size={70}
              className="mx-auto text-green-500"
            />

            <h2 className="mt-6 text-3xl font-bold">

              Network Operating Normally

            </h2>

            <p className="mt-3 text-slate-500">

              No active operational alerts. MetroVision AI is continuously
              monitoring all stations.

            </p>

          </div>

        ) : (

          <div className="space-y-5">

            {filteredAlerts.map((alert, index) => {

              const config = severity[alert.risk_level];

              const Icon = config.icon;

              return (

                <motion.div

                  key={alert.id}

                  initial={{
                    opacity: 0,
                    x: 80
                  }}

                  animate={{
                    opacity: 1,
                    x: 0
                  }}

                  exit={{
                    opacity: 0,
                    x: 80
                  }}

                  transition={{
                    delay: index * 0.05
                  }}

                  whileHover={{
                    scale: 1.01
                  }}

                  className={`
                    relative
                    overflow-hidden
                    rounded-3xl
                    border
                    ${config.border}
                    bg-white
                    p-6
                    shadow-sm
                    transition-all
                    duration-300
                    hover:shadow-xl
                    ${
                      alert.risk_level === "Critical"
                        ? "ring-2 ring-red-400/40 shadow-red-300/40"
                        : ""
                    }
                  `}
                >

                  <div
                    className={`
                      absolute
                      left-0
                      top-0
                      h-full
                      w-2
                      ${config.color}
                      ${alert.risk_level === "Critical" ? "animate-pulse" : ""}
                    `}
                  />

                  <div className="relative z-10 pl-3">

                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                      <div className="flex items-center gap-4">

                        <div className={`rounded-2xl p-4 ${config.bg}`}>

                          <Icon
                            size={26}
                            className={config.text}
                          />

                        </div>

                        <div>

                          {alert.risk_level === "Critical" && (

                            <div className="mb-3 flex items-center gap-2">

                              <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-ping" />

                              <span className="font-bold uppercase tracking-wider text-red-600">

                                Immediate Action Required

                              </span>

                            </div>

                          )}

                          <h3 className="text-xl font-bold text-slate-900">

                            {alert.station_name}

                          </h3>

                          <p className="mt-1 text-slate-500">

                            {alert.message}

                          </p>

                        </div>

                      </div>

                      <div className="flex items-center gap-3">

                        <span className={`
                          rounded-full
                          px-3
                          py-1
                          text-xs
                          font-semibold
                          ${config.bg}
                          ${config.text}
                        `}>

                          {alert.risk_level}

                        </span>

                        {!alert.is_read && (

                          <span className="
                            rounded-full
                            bg-blue-600
                            px-3
                            py-1
                            text-xs
                            font-bold
                            text-white
                            animate-pulse
                          ">

                            NEW

                          </span>

                        )}

                      </div>

                    </div>

                    <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                      <p className="text-sm text-slate-500">

                        🕒 {formatRelativeTime(alert.created_at)}

                      </p>

                      <div className="flex gap-3">

                        <button

                          onClick={() => onAcknowledge?.(alert)}

                          className="
                            rounded-xl
                            bg-green-100
                            px-4
                            py-2
                            text-sm
                            font-semibold
                            text-green-700
                            transition
                            hover:bg-green-200
                          "

                        >

                          Acknowledge

                        </button>

                        <button

                          onClick={() => onDismiss?.(alert)}

                          className="
                            rounded-xl
                            bg-red-100
                            px-4
                            py-2
                            text-sm
                            font-semibold
                            text-red-700
                            transition
                            hover:bg-red-200
                          "

                        >

                          Dismiss

                        </button>

                      </div>

                    </div>

                  </div>

                </motion.div>

              );

            })}

          </div>

        )}

      </div>

      <div className="mt-8 flex items-center justify-between rounded-2xl bg-slate-50 px-6 py-4">

        <div>

          <p className="text-sm text-slate-500">

            Last Updated

          </p>

          <p className="font-semibold">

            {new Date().toLocaleTimeString()}

          </p>

        </div>

        <div className="flex items-center gap-2">

          <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />

          <span className="text-sm font-semibold text-green-700">

            Auto Refresh Enabled

          </span>

        </div>

      </div>

    </motion.section>

  );

}

export default AlertCenter;