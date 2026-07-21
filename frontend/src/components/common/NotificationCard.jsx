import {
  AlertTriangle,
  CheckCircle2,
  Info,
  Trash2,
  Check,
  Clock,
} from "lucide-react";

import useMetro from "../../hooks/useMetro";

function NotificationCard({ notification }) {
  const {
    removeNotification,
    markNotificationRead,
  } = useMetro();

  const getPriorityConfig = () => {
    switch (notification.priority?.toLowerCase()) {
      case "high":
        return {
          icon: AlertTriangle,
          border: "border-red-500",
          bg: "bg-red-50",
          iconBg: "bg-red-100",
          iconColor: "text-red-600",
          badge: "bg-red-100 text-red-700",
          label: "High",
        };

      case "medium":
        return {
          icon: Info,
          border: "border-yellow-500",
          bg: "bg-yellow-50",
          iconBg: "bg-yellow-100",
          iconColor: "text-yellow-600",
          badge: "bg-yellow-100 text-yellow-700",
          label: "Medium",
        };

      default:
        return {
          icon: CheckCircle2,
          border: "border-emerald-500",
          bg: "bg-emerald-50",
          iconBg: "bg-emerald-100",
          iconColor: "text-emerald-600",
          badge: "bg-emerald-100 text-emerald-700",
          label: "Low",
        };
    }
  };

  const config = getPriorityConfig();
  const PriorityIcon = config.icon;

  return (
    <div
      className={`
        rounded-2xl
        border-l-4
        ${config.border}
        ${config.bg}
        p-5
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-lg
        ${
          notification.read
            ? "opacity-70"
            : "opacity-100"
        }
      `}
    >
      <div className="flex items-start justify-between gap-4">

        {/* Left */}

        <div className="flex flex-1 gap-4">

          <div
            className={`
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-xl
              ${config.iconBg}
            `}
          >
            <PriorityIcon
              className={`h-6 w-6 ${config.iconColor}`}
            />
          </div>

          <div className="flex-1">

            <div className="flex items-center gap-2">

              {!notification.read && (
                <span className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse"></span>
              )}

              <h3 className="font-semibold text-slate-900">
                {notification.title}
              </h3>

              <span
                className={`
                  rounded-full
                  px-2
                  py-1
                  text-xs
                  font-semibold
                  ${config.badge}
                `}
              >
                {config.label}
              </span>

            </div>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              {notification.message}
            </p>

            <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">

              <Clock className="h-4 w-4" />

              <span>
                {notification.time || "Just now"}
              </span>

            </div>

          </div>

        </div>

        {/* Delete */}

        <button
          onClick={() =>
            removeNotification(notification.id)
          }
          className="rounded-lg p-2 transition hover:bg-red-100"
        >
          <Trash2 className="h-5 w-5 text-red-600" />
        </button>

      </div>

      {/* Footer */}

      {!notification.read && (
        <div className="mt-5 flex justify-end">

          <button
            onClick={() =>
              markNotificationRead(notification.id)
            }
            className="
              flex
              items-center
              gap-2
              rounded-xl
              bg-indigo-600
              px-4
              py-2
              text-sm
              font-medium
              text-white
              transition
              hover:bg-indigo-700
            "
          >
            <Check className="h-4 w-4" />

            Mark as Read

          </button>

        </div>
      )}
    </div>
  );
}

export default NotificationCard;