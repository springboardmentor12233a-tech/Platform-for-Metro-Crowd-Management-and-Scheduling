import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export default function StatusBadge({
  text = "System Operational",
  color = "emerald",
}) {
  const colors = {
    emerald: {
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      text: "text-emerald-300",
      icon: "text-emerald-400",
      dot: "bg-emerald-400",
    },

    cyan: {
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
      text: "text-cyan-300",
      icon: "text-cyan-400",
      dot: "bg-cyan-400",
    },

    blue: {
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      text: "text-blue-300",
      icon: "text-blue-400",
      dot: "bg-blue-400",
    },
  };

  const c = colors[color] || colors.emerald;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className={`
        inline-flex
        items-center
        gap-2
        rounded-full
        border
        px-4
        py-2
        backdrop-blur-xl
        ${c.bg}
        ${c.border}
      `}
    >
      <span
        className={`
          h-2
          w-2
          rounded-full
          animate-pulse
          ${c.dot}
        `}
      />

      <CheckCircle2
        size={15}
        className={c.icon}
      />

      <span
        className={`
          text-xs
          font-medium
          ${c.text}
        `}
      >
        {text}
      </span>
    </motion.div>
  );
}