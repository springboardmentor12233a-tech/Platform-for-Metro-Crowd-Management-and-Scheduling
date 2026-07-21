import { useMemo, useState } from "react";
import {
  Bell,
  BellRing,
} from "lucide-react";

import useMetro from "../../hooks/useMetro";
import NotificationDrawer from "./NotificationDrawer";

// ==========================================
// Notification Bell
// ==========================================

function NotificationBell() {
  const { notifications } = useMetro();

  const [open, setOpen] = useState(false);

  // ==========================================
  // Unread Notifications
  // ==========================================

  const unreadCount = useMemo(() => {
    return notifications.filter(
      (notification) => !notification.read
    ).length;
  }, [notifications]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="
          relative
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-2xl
          border
          border-slate-200
          bg-white
          shadow-md
          transition-all
          duration-300
          hover:-translate-y-0.5
          hover:shadow-xl
          active:scale-95
        "
      >
        {unreadCount > 0 ? (
          <BellRing
            className="h-6 w-6 text-indigo-600"
          />
        ) : (
          <Bell
            className="h-6 w-6 text-slate-700"
          />
        )}

        {unreadCount > 0 && (
          <>
            <span
              className="
                absolute
                -right-2
                -top-2
                flex
                h-6
                w-6
                items-center
                justify-center
                rounded-full
                bg-red-600
                text-xs
                font-bold
                text-white
              "
            >
              {unreadCount}
            </span>

            <span
              className="
                absolute
                -right-2
                -top-2
                h-6
                w-6
                animate-ping
                rounded-full
                bg-red-500
                opacity-40
              "
            />
          </>
        )}
      </button>

      <NotificationDrawer
        open={open}
        onClose={() => setOpen(false)}
      />
            <NotificationDrawer
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

export default NotificationBell;