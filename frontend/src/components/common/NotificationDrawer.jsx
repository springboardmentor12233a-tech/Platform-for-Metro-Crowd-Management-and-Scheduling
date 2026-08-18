import {
  X,
  Bell,
  BellRing,
  Sparkles,
  AlertTriangle,
  ShieldAlert,
  Clock,
  MapPin,
  RefreshCw,
} from "lucide-react";

import { useEffect, useState } from "react";

import useMetro from "../../hooks/useMetro";
import NotificationCard from "./NotificationCard";

import { getAlerts } from "../../api/alert";


// ==========================================
// Notification Drawer
// ==========================================

function NotificationDrawer({
  open,
  onClose,
}) {

  const {
    notifications,
    aiRecommendation,
  } = useMetro();


  // ==========================================
  // Manual Emergency Alerts
  // ==========================================

  const [manualAlerts, setManualAlerts] =
    useState([]);

  const [loadingEmergencyAlerts, setLoadingEmergencyAlerts] =
    useState(false);


  // ==========================================
  // Load Manual Emergency Alerts
  // ==========================================

  const loadManualAlerts = async () => {

    try {

      setLoadingEmergencyAlerts(true);

      const data = await getAlerts();

      /*
        Only take alerts created manually
        through the Emergency Alert form.
      */

      const emergencyAlerts = (data || []).filter(
        (alert) =>
          alert.source === "Manual Emergency"
      );


      /*
        Show newest emergency alerts first.
      */

      emergencyAlerts.sort(
        (a, b) =>
          new Date(b.created_at) -
          new Date(a.created_at)
      );


      setManualAlerts(
        emergencyAlerts
      );

    } catch (error) {

      console.error(
        "Failed to load emergency alerts:",
        error
      );

    } finally {

      setLoadingEmergencyAlerts(false);

    }

  };


  // ==========================================
  // Load when Drawer Opens
  // ==========================================

  useEffect(() => {

    if (!open) {
      return;
    }


    loadManualAlerts();


    /*
      Refresh every 10 seconds while
      the notification drawer is open.
    */

    const interval = setInterval(
      () => {
        loadManualAlerts();
      },
      10000
    );


    return () => {
      clearInterval(interval);
    };

  }, [open]);


  // ==========================================
  // Total Notification Count
  // ==========================================

  const totalNotifications =
    notifications.length +
    manualAlerts.length;


  return (
    <>

      {/* =====================================================
          OVERLAY
      ===================================================== */}

      <div
        onClick={onClose}
        className={`
          fixed
          inset-0
          z-40
          bg-black/40
          backdrop-blur-sm
          transition-all
          duration-300

          ${
            open
              ? "visible opacity-100"
              : "invisible opacity-0"
          }
        `}
      />


      {/* =====================================================
          DRAWER
      ===================================================== */}

      <aside
        className={`
          fixed
          top-0
          right-0
          z-50
          flex
          h-screen
          w-[430px]
          flex-col
          border-l
          border-slate-200
          bg-white
          shadow-2xl
          transition-transform
          duration-300

          ${
            open
              ? "translate-x-0"
              : "translate-x-full"
          }
        `}
      >


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-5">

          <div className="flex items-center gap-3">

            {totalNotifications > 0 ? (

              <BellRing
                className="h-7 w-7 text-indigo-600"
              />

            ) : (

              <Bell
                className="h-7 w-7 text-slate-600"
              />

            )}


            <div>

              <h2 className="text-xl font-bold text-slate-900">
                Notifications
              </h2>

              <p className="text-sm text-slate-500">
                MetroVision AI Control Center
              </p>

            </div>

          </div>


          <button
            onClick={onClose}
            className="rounded-xl p-2 transition hover:bg-slate-200"
          >

            <X className="h-5 w-5" />

          </button>

        </div>


        {/* =================================================
            AI RECOMMENDATION
        ================================================= */}

        {aiRecommendation && (

          <div className="m-5 rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-blue-50 p-5">

            <div className="mb-3 flex items-center gap-2">

              <Sparkles
                className="h-5 w-5 text-indigo-600"
              />

              <h3 className="font-semibold text-indigo-700">
                AI Recommendation
              </h3>

            </div>


            <div className="space-y-3 text-sm text-slate-700">

              <p>

                <strong>
                  Station:
                </strong>{" "}

                {aiRecommendation.station}

              </p>


              <p>

                <strong>
                  Risk:
                </strong>{" "}

                <span className="font-semibold">
                  {aiRecommendation.risk}
                </span>

              </p>


              <p>

                <strong>
                  Confidence:
                </strong>{" "}

                {aiRecommendation.confidence}%

              </p>


              <p>

                <strong>
                  Recommendation:
                </strong>{" "}

                {aiRecommendation.action}

              </p>

            </div>

          </div>

        )}


        {/* =================================================
            NOTIFICATION LIST
        ================================================= */}

        <div className="flex-1 overflow-y-auto px-5 pb-6">


          {/* =================================================
              MANUAL EMERGENCY ALERTS
          ================================================= */}

          {manualAlerts.length > 0 && (

            <div className="mb-5 space-y-4">


              {/* Section Header */}

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-2">

                  <ShieldAlert
                    size={18}
                    className="text-red-600"
                  />

                  <h3 className="text-sm font-bold text-slate-800">

                    Emergency Alerts

                  </h3>

                </div>


                {loadingEmergencyAlerts && (

                  <RefreshCw
                    size={15}
                    className="animate-spin text-slate-400"
                  />

                )}

              </div>


              {/* Emergency Alert Cards */}

              {manualAlerts.map(
                (alert, index) => (

                  <div
                    key={
                      alert.id ??
                      `${alert.created_at}-${index}`
                    }
                    className="overflow-hidden rounded-2xl border border-red-200 bg-white shadow-sm"
                  >


                    {/* Red Header */}

                    <div className="border-b border-red-200 bg-red-50 px-4 py-3">

                      <div className="flex items-center justify-between gap-3">


                        <div className="flex items-center gap-2">

                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-100">

                            <AlertTriangle
                              size={18}
                              className="text-red-600"
                            />

                          </div>


                          <div>

                            <p className="text-xs font-bold uppercase tracking-wide text-red-600">

                              Manual Emergency

                            </p>

                            <p className="text-sm font-bold text-slate-900">

                              {alert.alert_type ||
                                "Emergency Alert"}

                            </p>

                          </div>

                        </div>


                        {/* Severity */}

                        <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">

                          {alert.severity
                            ?.replace(
                              "🔴 ",
                              ""
                            )
                            .replace(
                              "🟡 ",
                              ""
                            )
                            .replace(
                              "🟢 ",
                              ""
                            )}

                        </span>

                      </div>

                    </div>


                    {/* Emergency Content */}

                    <div className="p-4">


                      {/* Station */}

                      <div className="mb-3 flex items-start gap-2">

                        <MapPin
                          size={17}
                          className="mt-0.5 shrink-0 text-red-500"
                        />

                        <div>

                          <p className="text-xs font-medium text-slate-500">
                            Station / Location
                          </p>

                          <p className="text-sm font-semibold text-slate-900">

                            {alert.station}

                          </p>

                        </div>

                      </div>


                      {/* Message */}

                      <div className="rounded-xl border border-red-100 bg-red-50 p-3">

                        <p className="text-xs font-medium text-red-600">

                          Emergency Details

                        </p>


                        <p className="mt-1 text-sm font-medium leading-5 text-slate-800">

                          {alert.recommendation}

                        </p>

                      </div>


                      {/* Time */}

                      <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">

                        <Clock size={14} />

                        {new Date(
                          alert.created_at
                        ).toLocaleString()}

                      </div>


                      {/* Manual Badge */}

                      <div className="mt-3 flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">

                        <ShieldAlert
                          size={14}
                          className="text-red-500"
                        />

                        <span className="text-xs font-medium text-slate-600">

                          Created manually by an
                          authorized operator

                        </span>

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

          )}


          {/* =================================================
              EXISTING AI NOTIFICATIONS
          ================================================= */}

          {notifications.length > 0 && (

            <div className="space-y-4">


              {/* Section Header */}

              {manualAlerts.length > 0 && (

                <div className="flex items-center gap-2 pt-2">

                  <Sparkles
                    size={17}
                    className="text-indigo-600"
                  />

                  <h3 className="text-sm font-bold text-slate-800">

                    AI Notifications

                  </h3>

                </div>

              )}


              {notifications.map(
                (notification) => (

                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                  />

                )
              )}

            </div>

          )}


          {/* =================================================
              NOTHING FOUND
          ================================================= */}

          {notifications.length === 0 &&
            manualAlerts.length === 0 && (

              <div className="flex h-full flex-col items-center justify-center py-20 text-center">

                <div className="mb-6 rounded-full bg-slate-100 p-6">

                  <Bell className="h-12 w-12 text-slate-400" />

                </div>


                <h3 className="text-xl font-bold text-slate-800">

                  No Notifications

                </h3>


                <p className="mt-3 max-w-xs text-sm leading-6 text-slate-500">

                  Everything is running smoothly.
                  MetroVision AI hasn't detected
                  any incidents that require your
                  attention.

                </p>

              </div>

            )}

        </div>


        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">

          <div className="flex items-center justify-between">


            <div>

              <p className="text-sm font-semibold text-slate-700">

                {totalNotifications} Notification
                {totalNotifications !== 1
                  ? "s"
                  : ""}

              </p>


              <p className="text-xs text-slate-500">

                Live updates from MetroVision AI

              </p>

            </div>


            <div className="flex items-center gap-2 rounded-xl bg-indigo-100 px-3 py-2">

              <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />

              <span className="text-sm font-semibold text-indigo-700">

                Live

              </span>

            </div>

          </div>

        </div>

      </aside>

    </>
  );
}


export default NotificationDrawer;