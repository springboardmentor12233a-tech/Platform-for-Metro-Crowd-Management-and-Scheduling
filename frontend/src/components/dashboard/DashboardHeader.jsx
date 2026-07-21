import { motion } from "framer-motion";
import {
  Search,
  CalendarDays,
  UserCircle2,
} from "lucide-react";

import NotificationBell from "../common/NotificationBell";
import SimulationControlPanel from "./SimulationControlPanel";

function DashboardHeader() {
  const currentDate = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-8"
    >
      {/* Header */}

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Left Section */}

        <div>
          <p className="text-lg text-slate-500">
            👋 Good Morning
          </p>

          <h1 className="mt-2 text-5xl font-extrabold text-slate-900">
            Metro Dashboard
          </h1>

          <p className="mt-2 text-lg text-slate-500">
            AI Metro Crowd Management System
          </p>

          <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
            <CalendarDays className="h-4 w-4" />

            <span>{currentDate}</span>
          </div>
        </div>

        {/* Right Section */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          {/* Search */}

          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              placeholder="Search stations..."
              className="
                w-72
                rounded-2xl
                border
                border-slate-200
                bg-white
                py-3
                pl-12
                pr-4
                text-sm
                shadow-sm
                outline-none
                transition-all
                duration-300
                focus:border-indigo-500
                focus:ring-4
                focus:ring-indigo-100
              "
            />
          </div>

          {/* Notification */}

          <NotificationBell />

          {/* User */}

          <button
            className="
              flex
              items-center
              gap-3
              rounded-2xl
              border
              border-slate-200
              bg-white
              px-4
              py-3
              shadow-sm
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:shadow-lg
            "
          >
            <UserCircle2 className="h-8 w-8 text-indigo-600" />

            <div className="hidden text-left md:block">
              <p className="text-sm font-semibold text-slate-800">
                Metro Admin
              </p>

              <p className="text-xs text-slate-500">
                Control Center
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Simulation Control Panel */}

      <div className="mt-8">
        <SimulationControlPanel />
      </div>
    </motion.div>
  );
}

export default DashboardHeader;