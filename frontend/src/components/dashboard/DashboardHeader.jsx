import { motion } from "framer-motion";

function DashboardHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-8"
    >
      <p className="text-lg text-slate-500">
        👋 Good Morning
      </p>

      <h1 className="mt-2 text-5xl font-extrabold text-slate-900">
        Metro Dashboard
      </h1>

      <p className="mt-2 text-slate-500 text-lg">
        AI Metro Crowd Management System
      </p>
    </motion.div>
  );
}

export default DashboardHeader;