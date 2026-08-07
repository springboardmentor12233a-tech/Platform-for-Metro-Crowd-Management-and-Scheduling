import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";

import SimulationControlPanel from "./SimulationControlPanel";

function DashboardHeader() {
  const currentDate = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "👋 Good Morning";
    if (hour < 17) return "👋 Good Afternoon";
    if (hour < 21) return "👋 Good Evening";
    return "🌙 Good Night";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-8"
    >
      {/* Header */}

      <div className="flex flex-col gap-6">
        <div>
          <p className="text-lg text-slate-500">
            {getGreeting()}
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
      </div>

      {/* Simulation Control Panel */}

      <div className="mt-8">
        <SimulationControlPanel />
      </div>
    </motion.div>
  );
}

export default DashboardHeader;