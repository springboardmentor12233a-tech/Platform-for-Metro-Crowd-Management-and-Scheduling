import { motion } from "framer-motion";
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Bot,
  Radio,
} from "lucide-react";

function LiveAlertFeed({ recentAlerts = [] }) {
  const alerts = recentAlerts.map((alert, index) => {
    const severity =
      alert.severity ||
      (index % 3 === 0
        ? "Critical"
        : index % 3 === 1
        ? "Warning"
        : "Info");

    return {
      id: index,

      title: alert.title || alert.station_name || "Metro Station Alert",

      station: alert.station_name || "Unknown Station",

      message: alert.message || "Passenger congestion detected.",

      severity,

      time: alert.time || `${(index + 1) * 4} min ago`,

      team:
        severity === "Critical"
          ? "Emergency Operations"
          : severity === "Warning"
          ? "Station Control"
          : "Monitoring Team",
    };
  });

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "Critical":
        return "bg-red-100 text-red-700";
      case "Warning":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-cyan-100 text-cyan-700";
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case "Critical":
        return <ShieldAlert size={20} className="text-red-600" />;
      case "Warning":
        return <AlertTriangle size={20} className="text-yellow-600" />;
      default:
        return <CheckCircle2 size={20} className="text-cyan-600" />;
    }
  };

  return (
    <section
      className="
        rounded-3xl
        border
        border-slate-200
        bg-white
        shadow-sm
        overflow-hidden
      "
    >
      {/* Header */}
      <div
        className="
          border-b
          border-slate-200
          px-8
          py-6
        "
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Live Alert Feed
            </h2>
            <p className="mt-2 text-slate-500">
              Real-time operational alerts generated across the metro
              network.
            </p>
          </div>

          <div
            className="
              flex
              items-center
              gap-3
              rounded-full
              bg-emerald-50
              px-4
              py-2
            "
          >
            <Radio size={18} className="text-emerald-600 animate-pulse" />
            <span className="font-medium text-emerald-700">LIVE</span>
          </div>
        </div>
      </div>

      {/* ==========================
          Live Alert Timeline
      ========================== */}
      <div className="divide-y divide-slate-200">
        {alerts.length === 0 ? (
          <div className="px-8 py-16 text-center">
            <CheckCircle2 size={48} className="mx-auto text-emerald-500" />
            <h3 className="mt-5 text-2xl font-bold text-slate-800">
              No Active Alerts
            </h3>
            <p className="mt-2 text-slate-500">
              All monitored stations are operating normally.
            </p>
          </div>
        ) : (
          alerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
              className="px-8 py-6 hover:bg-slate-50 transition-colors"
            >
              <div className="flex gap-5">
                {/* Timeline */}
                <div className="flex flex-col items-center">
                  <div
                    className={`
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-2xl
                      ${
                        alert.severity === "Critical"
                          ? "bg-red-100"
                          : alert.severity === "Warning"
                          ? "bg-yellow-100"
                          : "bg-cyan-100"
                      }
                    `}
                  >
                    {getSeverityIcon(alert.severity)}
                  </div>

                  {index !== alerts.length - 1 && (
                    <div className="mt-2 h-full w-px bg-slate-200" />
                  )}
                </div>

                {/* Alert Content */}
                <div className="flex-1">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-bold text-slate-900">
                          {alert.title}
                        </h3>

                        <span
                          className={`
                            rounded-full
                            px-3
                            py-1
                            text-xs
                            font-semibold
                            ${getSeverityColor(alert.severity)}
                          `}
                        >
                          {alert.severity}
                        </span>
                      </div>

                      <p className="mt-3 leading-7 text-slate-600">
                        {alert.message}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center justify-end gap-2 text-slate-500">
                        <Clock size={16} />
                        <span className="text-sm">{alert.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* ==========================
          Alert Summary
      ========================== */}
      <div
        className="
          border-t
          border-slate-200
          bg-gradient-to-r
          from-slate-900
          via-slate-800
          to-slate-900
          p-8
          text-white
        "
      >
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-2xl font-bold">Alert Summary</h3>
            <p className="mt-2 text-slate-300">
              Current operational alert distribution across the metro
              network.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <div>
              <p className="text-sm text-slate-400">Total Alerts</p>
              <h4 className="mt-2 text-3xl font-bold">{alerts.length}</h4>
            </div>

            <div>
              <p className="text-sm text-slate-400">Critical</p>
              <h4 className="mt-2 text-3xl font-bold text-red-400">
                {alerts.filter((alert) => alert.severity === "Critical").length}
              </h4>
            </div>

            <div>
              <p className="text-sm text-slate-400">Warning</p>
              <h4 className="mt-2 text-3xl font-bold text-yellow-400">
                {alerts.filter((alert) => alert.severity === "Warning").length}
              </h4>
            </div>

            <div>
              <p className="text-sm text-slate-400">Information</p>
              <h4 className="mt-2 text-3xl font-bold text-cyan-400">
                {alerts.filter((alert) => alert.severity === "Info").length}
              </h4>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-slate-300">
              Live monitoring active • Auto-refresh enabled
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Bot size={18} className="text-cyan-300" />
            <span className="text-sm font-medium text-cyan-300">
              AI Decision Engine Online
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LiveAlertFeed;