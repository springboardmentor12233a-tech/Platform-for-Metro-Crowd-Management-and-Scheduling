import { motion } from "framer-motion";

export default function Divider({
  label = "OR",
  className = "",
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.35 }}
      className={`flex items-center gap-4 ${className}`}
    >
      {/* Left Line */}
      <div className="relative flex-1">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-white/20" />
      </div>

      {/* Label */}
      <span
        className="
          shrink-0
          rounded-full
          border
          border-white/10
          bg-white/5
          px-3
          py-1
          text-[10px]
          font-semibold
          uppercase
          tracking-[0.35em]
          text-slate-500
          backdrop-blur-xl
        "
      >
        {label}
      </span>

      {/* Right Line */}
      <div className="relative flex-1">
        <div className="h-px bg-gradient-to-l from-transparent via-white/10 to-white/20" />
      </div>
    </motion.div>
  );
}