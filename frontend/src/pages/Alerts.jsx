import { useEffect, useState } from "react";

import {
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  Clock,
  MapPin,
  Filter,
  Plus,
  Loader2,
  X,
  RefreshCw,
} from "lucide-react";

import { useAuth } from "../hooks/useAuth";
import api from "../services/api";


const SEVERITY_STYLES = {
  CRITICAL: {
    badge:
      "bg-red-500/20 text-red-400 border-red-500/30",
    dot: "bg-red-500",
    icon: AlertTriangle,
    border: "border-l-red-500",
    iconBg: "bg-red-500/20",
    iconColor: "text-red-400",
  },

  HIGH: {
    badge:
      "bg-orange-500/20 text-orange-400 border-orange-500/30",
    dot: "bg-orange-500",
    icon: AlertTriangle,
    border: "border-l-orange-500",
    iconBg: "bg-orange-500/20",
    iconColor: "text-orange-400",
  },

  MEDIUM: {
    badge:
      "bg-amber-500/20 text-amber-400 border-amber-500/30",
    dot: "bg-amber-500",
    icon: AlertCircle,
    border: "border-l-amber-500",
    iconBg: "bg-amber-500/20",
    iconColor: "text-amber-400",
  },

  LOW: {
    badge:
      "bg-blue-500/20 text-blue-400 border-blue-500/30",
    dot: "bg-blue-400",
    icon: Info,
    border: "border-l-blue-500",
    iconBg: "bg-blue-500/20",
    iconColor: "text-blue-400",
  },

  // Backward compatibility if old alerts contain WARNING/INFO
  WARNING: {
    badge:
      "bg-amber-500/20 text-amber-400 border-amber-500/30",
    dot: "bg-amber-500",
    icon: AlertCircle,
    border: "border-l-amber-500",
    iconBg: "bg-amber-500/20",
    iconColor: "text-amber-400",
  },

  INFO: {
    badge:
      "bg-blue-500/20 text-blue-400 border-blue-500/30",
    dot: "bg-blue-400",
    icon: Info,
    border: "border-l-blue-500",
    iconBg: "bg-blue-500/20",
    iconColor: "text-blue-400",
  },
};


// ============================================================
// FILTERS
// ============================================================

const FILTERS = [
  "ALL",
  "CRITICAL",
  "HIGH",
  "MEDIUM",
  "LOW",
  "RESOLVED",
];


// ============================================================
// TIME FORMATTER
// ============================================================

function formatTime(timestamp) {
  if (!timestamp) {
    return "Unknown time";
  }

  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return timestamp;
  }

  const now = new Date();

  const difference =
    Math.floor(
      (now.getTime() - date.getTime()) / 1000
    );

  if (difference < 60) {
    return "Just now";
  }

  if (difference < 3600) {
    return `${Math.floor(difference / 60)} min ago`;
  }

  if (difference < 86400) {
    return `${Math.floor(difference / 3600)} hr ago`;
  }

  if (difference < 604800) {
    return `${Math.floor(difference / 86400)} days ago`;
  }

  return date.toLocaleString();
}


// ============================================================
// EMPTY FORM
// ============================================================

const EMPTY_FORM = {
  alert_type: "",
  severity: "CRITICAL",
  message: "",
  station_id: "",
  train_id: "",
};


// ============================================================
// ALERTS PAGE
// ============================================================

export default function Alerts() {

  const { user } = useAuth();

  const isAdmin =
    user?.role === "admin";


  // ----------------------------------------------------------
  // STATE
  // ----------------------------------------------------------

  const [alerts, setAlerts] = useState([]);

  const [filter, setFilter] =
    useState("ALL");

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [showCreateForm, setShowCreateForm] =
    useState(false);

  const [creating, setCreating] =
    useState(false);

  const [resolvingId, setResolvingId] =
    useState(null);

  const [form, setForm] =
    useState(EMPTY_FORM);


  // ==========================================================
  // GET ALERTS
  // ==========================================================

  const fetchAlerts = async (
    showRefreshLoader = false
  ) => {

    try {

      if (showRefreshLoader) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await api.get(
        "/alerts/"
      );

      /*
       * success_response() normally returns:
       *
       * {
       *   data: {
       *     total: ...,
       *     unresolved: ...,
       *     alerts: [...]
       *   }
       * }
       *
       * The fallback also handles a direct response.
       */

      const responseData =
        response.data?.data ??
        response.data;

      const backendAlerts =
        responseData?.alerts ?? [];

      setAlerts(
        backendAlerts.map((alert) => ({
          ...alert,

          id:
            alert.alert_id ??
            alert.id,

          isResolved:
            alert.is_resolved ??
            (
              alert.status === "RESOLVED" ||
              alert.status === "CLOSED"
            ),

          title:
            alert.title ??
            alert.alert_type ??
            "Alert",

          time:
            formatTime(
              alert.timestamp
            ),
        }))
      );

    } catch (err) {

      console.error(
        "Failed to fetch alerts:",
        err
      );

      setError(
        err.response?.data?.detail ||
        "Unable to load alerts."
      );

    } finally {

      setLoading(false);
      setRefreshing(false);
    }
  };


  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {

    fetchAlerts();

  }, []);


  // ==========================================================
  // FORM CHANGE
  // ==========================================================

  const handleFormChange = (
    event
  ) => {

    const {
      name,
      value,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  // ==========================================================
  // CREATE ALERT
  // ==========================================================

  const createAlert = async (
    event
  ) => {

    event.preventDefault();

    if (!form.alert_type.trim()) {

      setError(
        "Please enter an alert title."
      );

      return;
    }

    if (!form.message.trim()) {

      setError(
        "Please enter an alert message."
      );

      return;
    }

    try {

      setCreating(true);
      setError("");

      /*
       * IMPORTANT:
       *
       * Your FastAPI endpoint currently defines:
       *
       * alert_type
       * severity
       * message
       * station_id
       * train_id
       *
       * as query parameters.
       *
       * Therefore we send them using `params`,
       * not JSON.
       */

      await api.post(
        "/alerts/",
        null,
        {
          params: {
            alert_type:
              form.alert_type.trim(),

            severity:
              form.severity,

            message:
              form.message.trim(),

            station_id:
              form.station_id
                ? Number(form.station_id)
                : undefined,

            train_id:
              form.train_id.trim() ||
              undefined,
          },
        }
      );


      // Clear form

      setForm(
        EMPTY_FORM
      );

      setShowCreateForm(
        false
      );


      // Reload from PostgreSQL

      await fetchAlerts(
        true
      );

    } catch (err) {

      console.error(
        "Create alert error:",
        err
      );

      setError(
        err.response?.data?.detail ||
        "Unable to create alert."
      );

    } finally {

      setCreating(false);
    }
  };


  // ==========================================================
  // RESOLVE ALERT
  // ==========================================================

  const resolveAlert = async (
    alertId
  ) => {

    try {

      setResolvingId(
        alertId
      );

      setError("");

      await api.patch(
        `/alerts/${alertId}/resolve`
      );


      // Reload latest data

      await fetchAlerts(
        true
      );

    } catch (err) {

      console.error(
        "Resolve alert error:",
        err
      );

      setError(
        err.response?.data?.detail ||
        "Unable to resolve alert."
      );

    } finally {

      setResolvingId(
        null
      );
    }
  };


  // ==========================================================
  // FILTER
  // ==========================================================

  const filteredAlerts =
    alerts.filter((alert) => {

      const resolved =
        alert.isResolved;

      if (filter === "ALL") {
        return true;
      }

      if (filter === "RESOLVED") {
        return resolved;
      }

      return (
        alert.severity === filter &&
        !resolved
      );
    });


  // ==========================================================
  // COUNTS
  // ==========================================================

  const counts = {

    total:
      alerts.length,

    unresolved:
      alerts.filter(
        (a) => !a.isResolved
      ).length,

    critical:
      alerts.filter(
        (a) =>
          a.severity === "CRITICAL" &&
          !a.isResolved
      ).length,

    high:
      alerts.filter(
        (a) =>
          a.severity === "HIGH" &&
          !a.isResolved
      ).length,

    medium:
      alerts.filter(
        (a) =>
          a.severity === "MEDIUM" &&
          !a.isResolved
      ).length,

    resolved:
      alerts.filter(
        (a) => a.isResolved
      ).length,
  };


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <div className="space-y-6 animate-fade-in">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="page-header">

        <div className="flex items-start justify-between gap-4">

          <div>

            <h2 className="page-title">
              Alerts
            </h2>

            <p className="page-subtitle">
              Real-time crowd management alerts
              and incident notifications
            </p>

          </div>


          <div className="flex items-center gap-2">

            {/* Refresh */}

            <button
              type="button"
              onClick={() =>
                fetchAlerts(true)
              }
              disabled={refreshing}
              title="Refresh alerts"
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 transition-colors disabled:opacity-50"
            >

              <RefreshCw
                size={15}
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />

              <span className="hidden sm:inline">
                Refresh
              </span>

            </button>


            {/* Admin Create */}

            {isAdmin && (

              <button
                type="button"
                onClick={() => {

                  setShowCreateForm(
                    (value) => !value
                  );

                  setError("");
                }}
                className="btn-primary flex items-center gap-2"
              >

                {showCreateForm ? (
                  <X size={16} />
                ) : (
                  <Plus size={16} />
                )}

                {showCreateForm
                  ? "Close"
                  : "Create Alert"}

              </button>

            )}

          </div>

        </div>

      </div>


      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (

        <div className="flex items-center justify-between gap-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm">

          <div className="flex items-center gap-2">

            <AlertCircle
              size={16}
            />

            <span>
              {error}
            </span>

          </div>

          <button
            type="button"
            onClick={() =>
              setError("")
            }
            className="text-red-400 hover:text-white"
          >
            <X size={15} />
          </button>

        </div>

      )}


      {/* =====================================================
          ADMIN CREATE FORM
      ===================================================== */}

      {isAdmin &&
        showCreateForm && (

          <div className="glass-card p-6">

            <div className="flex items-center gap-2 mb-5">

              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 flex items-center justify-center">

                <Plus
                  size={18}
                  className="text-cyan-400"
                />

              </div>

              <div>

                <h3 className="text-white font-semibold">
                  Create New Alert
                </h3>

                <p className="text-slate-400 text-xs">
                  This alert will be visible to
                  all authenticated users.
                </p>

              </div>

            </div>


            <form
              onSubmit={createAlert}
              className="space-y-4"
            >

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Alert Type */}

                <div>

                  <label className="block text-slate-300 text-sm font-medium mb-1.5">
                    Alert Title
                  </label>

                  <input
                    type="text"
                    name="alert_type"
                    value={
                      form.alert_type
                    }
                    onChange={
                      handleFormChange
                    }
                    placeholder="e.g. Heavy Crowd"
                    required
                    className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50"
                  />

                </div>


                {/* Severity */}

                <div>

                  <label className="block text-slate-300 text-sm font-medium mb-1.5">
                    Severity
                  </label>

                  <select
                    name="severity"
                    value={
                      form.severity
                    }
                    onChange={
                      handleFormChange
                    }
                    className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50"
                  >

                    <option value="CRITICAL">
                      CRITICAL
                    </option>

                    <option value="HIGH">
                      HIGH
                    </option>

                    <option value="MEDIUM">
                      MEDIUM
                    </option>

                    <option value="LOW">
                      LOW
                    </option>

                  </select>

                </div>


                {/* Station */}

                <div>

                  <label className="block text-slate-300 text-sm font-medium mb-1.5">
                    Station ID
                  </label>

                  <input
                    type="number"
                    name="station_id"
                    value={
                      form.station_id
                    }
                    onChange={
                      handleFormChange
                    }
                    placeholder="Optional"
                    min="1"
                    className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50"
                  />

                </div>


                {/* Train */}

                <div>

                  <label className="block text-slate-300 text-sm font-medium mb-1.5">
                    Train ID
                  </label>

                  <input
                    type="text"
                    name="train_id"
                    value={
                      form.train_id
                    }
                    onChange={
                      handleFormChange
                    }
                    placeholder="Optional"
                    className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50"
                  />

                </div>

              </div>


              {/* Message */}

              <div>

                <label className="block text-slate-300 text-sm font-medium mb-1.5">
                  Alert Message
                </label>

                <textarea
                  name="message"
                  value={
                    form.message
                  }
                  onChange={
                    handleFormChange
                  }
                  placeholder="Describe the situation and required action..."
                  rows={4}
                  required
                  className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 resize-none"
                />

              </div>


              {/* Submit */}

              <div className="flex justify-end">

                <button
                  type="submit"
                  disabled={creating}
                  className="btn-primary flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >

                  {creating ? (

                    <>
                      <Loader2
                        size={16}
                        className="animate-spin"
                      />

                      Creating...
                    </>

                  ) : (

                    <>
                      <Plus
                        size={16}
                      />

                      Create Alert
                    </>

                  )}

                </button>

              </div>

            </form>

          </div>

        )}


      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        {[
          {
            label: "Total Alerts",
            value: counts.total,
            color: "text-slate-300",
            bg: "bg-slate-700/50",
          },

          {
            label: "Unresolved",
            value: counts.unresolved,
            color: "text-amber-400",
            bg: "bg-amber-500/10",
          },

          {
            label: "Critical",
            value: counts.critical,
            color: "text-red-400",
            bg: "bg-red-500/10",
          },

          {
            label: "Resolved",
            value: counts.resolved,
            color: "text-green-400",
            bg: "bg-green-500/10",
          },

        ].map((summary) => (

          <div
            key={summary.label}
            className={`glass-card p-5 ${summary.bg}`}
          >

            <div
              className={`text-3xl font-bold ${summary.color} mb-1`}
            >
              {summary.value}
            </div>

            <div className="text-slate-400 text-sm">
              {summary.label}
            </div>

          </div>

        ))}

      </div>


      {/* =====================================================
          FILTER BAR
      ===================================================== */}

      <div className="flex items-center gap-2 flex-wrap">

        <Filter
          size={14}
          className="text-slate-400"
        />

        {FILTERS.map((currentFilter) => (

          <button
            key={currentFilter}
            id={`filter-${currentFilter.toLowerCase()}`}
            onClick={() =>
              setFilter(
                currentFilter
              )
            }
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 border ${
              filter === currentFilter
                ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/40"
                : "text-slate-400 border-slate-700 hover:border-slate-500 hover:text-white"
            }`}
          >

            {currentFilter === "ALL"
              ? `All (${alerts.length})`
              : currentFilter ===
                  "RESOLVED"
                ? `Resolved (${counts.resolved})`
                : `${currentFilter} (${
                    alerts.filter(
                      (a) =>
                        a.severity ===
                          currentFilter &&
                        !a.isResolved
                    ).length
                  })`}

          </button>

        ))}

      </div>


      {/* =====================================================
          LOADING
      ===================================================== */}

      {loading ? (

        <div className="glass-card p-12 text-center">

          <Loader2
            size={32}
            className="text-cyan-400 mx-auto mb-3 animate-spin"
          />

          <p className="text-white font-medium">
            Loading alerts...
          </p>

          <p className="text-slate-400 text-sm mt-1">
            Fetching latest alerts from the server
          </p>

        </div>

      ) : (

        /* ===================================================
           ALERT LIST
        =================================================== */

        <div className="space-y-3">

          {filteredAlerts.length === 0 ? (

            <div className="glass-card p-12 text-center">

              <CheckCircle
                size={40}
                className="text-green-400 mx-auto mb-3"
              />

              <p className="text-white font-medium">
                No alerts in this category
              </p>

              <p className="text-slate-400 text-sm mt-1">
                All clear for this filter
              </p>

            </div>

          ) : (

            filteredAlerts.map(
              (alert) => {

                const style =
                  SEVERITY_STYLES[
                    alert.severity
                  ] ||
                  SEVERITY_STYLES.INFO;

                const Icon =
                  style.icon;

                const isResolving =
                  resolvingId ===
                  alert.id;


                return (

                  <div
                    key={alert.id}
                    id={`alert-${alert.id}`}
                    className={`glass-card p-5 border-l-4 ${
                      style.border
                    } ${
                      alert.isResolved
                        ? "opacity-60"
                        : ""
                    } transition-all duration-300`}
                  >

                    <div className="flex items-start justify-between gap-4">

                      <div className="flex items-start gap-3 flex-1 min-w-0">

                        {/* Icon */}

                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${style.iconBg}`}
                        >

                          <Icon
                            size={17}
                            className={
                              style.iconColor
                            }
                          />

                        </div>


                        {/* Content */}

                        <div className="flex-1 min-w-0">

                          <div className="flex items-center gap-2 flex-wrap mb-1">

                            <span
                              className={`text-xs font-bold px-2 py-0.5 rounded-full border ${style.badge}`}
                            >
                              {alert.severity}
                            </span>


                            {alert.isResolved && (

                              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">

                                RESOLVED

                              </span>

                            )}

                          </div>


                          <h4 className="text-white font-semibold text-sm">

                            {alert.title}

                          </h4>


                          <p className="text-slate-400 text-sm mt-1 leading-relaxed">

                            {alert.message}

                          </p>


                          <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 flex-wrap">

                            <span className="flex items-center gap-1">

                              <Clock
                                size={11}
                              />

                              {alert.time}

                            </span>


                            {alert.station_id && (

                              <span className="flex items-center gap-1">

                                <MapPin
                                  size={11}
                                />

                                Station{" "}
                                {
                                  alert.station_id
                                }

                              </span>

                            )}


                            {alert.train_id && (

                              <span>

                                Train{" "}
                                {
                                  alert.train_id
                                }

                              </span>

                            )}

                          </div>

                        </div>

                      </div>


                      {/* Resolve — ADMIN ONLY */}

                      {isAdmin &&
                        !alert.isResolved && (

                          <button
                            id={`resolve-${alert.id}`}
                            onClick={() =>
                              resolveAlert(
                                alert.id
                              )
                            }
                            disabled={
                              isResolving
                            }
                            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-medium hover:bg-green-500/20 transition-colors disabled:opacity-50"
                          >

                            {isResolving ? (

                              <Loader2
                                size={12}
                                className="animate-spin"
                              />

                            ) : (

                              <CheckCircle
                                size={12}
                              />

                            )}

                            {isResolving
                              ? "Resolving..."
                              : "Resolve"}

                          </button>

                        )}

                    </div>

                  </div>

                );

              }
            )

          )}

        </div>

      )}

    </div>

  );
}