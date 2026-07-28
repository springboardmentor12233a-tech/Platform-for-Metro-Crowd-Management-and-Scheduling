import { motion } from "framer-motion";
import { Bot } from "lucide-react";

const dotTransition = {
  repeat: Infinity,
  duration: 0.6,
  ease: "easeInOut",
};

function Dot({ delay }) {
  return (
    <motion.span
      className="w-2 h-2 rounded-full bg-violet-500"
      animate={{
        y: [0, -5, 0],
        opacity: [0.4, 1, 0.4],
      }}
      transition={{
        ...dotTransition,
        delay,
      }}
    />
  );
}

export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-600 text-white shadow-lg">
        <Bot size={18} />
      </div>

      <div className="max-w-xs rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-violet-600">
          MetroFlow AI
        </p>

        <div className="flex items-center gap-2">
          <Dot delay={0} />
          <Dot delay={0.15} />
          <Dot delay={0.3} />
        </div>

        <p className="mt-3 text-sm text-slate-500">
          Analyzing metro data...
        </p>
      </div>
    </div>
  );
}