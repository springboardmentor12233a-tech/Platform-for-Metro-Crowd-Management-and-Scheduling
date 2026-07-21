import { motion } from "framer-motion";
import {
  Activity,
  BrainCircuit,
  ShieldCheck,
  TrainFront,
} from "lucide-react";

const features = [
  {
    icon: Activity,
    title: "Live Crowd Monitoring",
    description: "Monitor passenger density in real time.",
  },
  {
    icon: BrainCircuit,
    title: "AI Predictions",
    description: "Forecast congestion before it happens.",
  },
  {
    icon: TrainFront,
    title: "Smart Scheduling",
    description: "Optimize train frequency automatically.",
  },
  {
    icon: ShieldCheck,
    title: "Operational Safety",
    description: "Alerts and intelligent recommendations.",
  },
];

export default function Branding() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="max-w-xl text-white"
    >
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="inline-flex items-center gap-3 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-5 py-2 backdrop-blur-xl"
      >
        <div className="h-3 w-3 rounded-full bg-green-400 animate-pulse"></div>

        <span className="text-sm font-semibold tracking-wide">
          MetroFlow AI Platform
        </span>
      </motion.div>

      <h1 className="mt-8 text-6xl font-black leading-tight">
        Smarter Metro.
        <br />
        Better Tomorrow.
      </h1>

      <p className="mt-8 text-lg leading-8 text-slate-300">
        AI-powered metro crowd management, operational intelligence,
        passenger forecasting, smart scheduling, and real-time
        transportation analytics in one centralized platform.
      </p>

      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <motion.div
              whileHover={{
                y: -6,
                scale: 1.02,
              }}
              key={feature.title}
              className="
                rounded-2xl
                border
                border-white/10
                bg-white/5
                p-6
                backdrop-blur-xl
              "
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20">
                <Icon className="text-cyan-400" size={24} />
              </div>

              <h3 className="font-bold text-lg">
                {feature.title}
              </h3>

              <p className="mt-2 text-sm text-slate-300">
                {feature.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}