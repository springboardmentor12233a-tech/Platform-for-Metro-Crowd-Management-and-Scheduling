import {
  X,
  Bell,
  BellRing,
  Sparkles,
} from "lucide-react";

import useMetro from "../../hooks/useMetro";
import NotificationCard from "./NotificationCard";

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

  return (
    <>
      {/* ================= Overlay ================= */}

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
              ? "opacity-100 visible"
              : "opacity-0 invisible"
          }
        `}
      />

      {/* ================= Drawer ================= */}

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
        {/* ================= Header ================= */}

        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-5">

          <div className="flex items-center gap-3">

            {notifications.length > 0 ? (
              <BellRing className="h-7 w-7 text-indigo-600" />
            ) : (
              <Bell className="h-7 w-7 text-slate-600" />
            )}

            <div>

              <h2 className="text-xl font-bold text-slate-900">
                Notifications
              </h2>

              <p className="text-sm text-slate-500">
                MetroFlow AI Control Center
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

        {/* ================= AI Recommendation ================= */}

        {aiRecommendation && (
          <div className="m-5 rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-blue-50 p-5">

            <div className="mb-3 flex items-center gap-2">

              <Sparkles className="h-5 w-5 text-indigo-600" />

              <h3 className="font-semibold text-indigo-700">
                AI Recommendation
              </h3>

            </div>

           <div className="space-y-3 text-sm text-slate-700">

  <p>
    <strong>Station:</strong>{" "}
    {aiRecommendation.station}
  </p>

  <p>
    <strong>Risk:</strong>{" "}
    <span className="font-semibold">
      {aiRecommendation.risk}
    </span>
  </p>

  <p>
    <strong>Confidence:</strong>{" "}
    {aiRecommendation.confidence}%
  </p>

  <p>
    <strong>Recommendation:</strong>{" "}
    {aiRecommendation.action}
  </p>

</div>

          </div>
        )}

        {/* ================= Notification List ================= */}

        <div className="flex-1 overflow-y-auto px-5 pb-6">

        {notifications.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-20 text-center">

            <div className="mb-6 rounded-full bg-slate-100 p-6">
                <Bell className="h-12 w-12 text-slate-400" />
            </div>

            <h3 className="text-xl font-bold text-slate-800">
                No Notifications
            </h3>

            <p className="mt-3 max-w-xs text-sm leading-6 text-slate-500">
                Everything is running smoothly.
                MetroFlow AI hasn't detected any
                incidents that require your
                attention.
            </p>

            </div>
        ) : (
            <div className="space-y-4">

            {notifications.map((notification) => (
                <NotificationCard
                key={notification.id}
                notification={notification}
                />
            ))}

            </div>
        )}

        </div>

        {/* ================= Footer ================= */}

        <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-semibold text-slate-700">
                {notifications.length} Notification
                {notifications.length !== 1 ? "s" : ""}
              </p>

              <p className="text-xs text-slate-500">
                Live updates from MetroFlow AI
              </p>

            </div>

            <div className="rounded-xl bg-indigo-100 px-3 py-2">

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