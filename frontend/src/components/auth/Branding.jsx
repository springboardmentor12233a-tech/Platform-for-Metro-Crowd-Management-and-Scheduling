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
      transition={{
        duration: 0.8,
        ease: "easeOut",
      }}
    className="
  relative
  w-full
  max-w-[560px]
  -translate-x-32
  text-white
  xl:-translate-x-40
  2xl:-translate-x-48
"
    >
      {/* =====================================================
          PLATFORM BADGE
      ===================================================== */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.2,
          duration: 0.6,
        }}
        className="
          inline-flex
          items-center
          gap-3
          rounded-full
          border
          border-cyan-400/25
          bg-slate-950/35
          px-4
          py-2
          shadow-lg
          backdrop-blur-xl
        "
      >
        <span
          className="
            h-2.5
            w-2.5
            rounded-full
            bg-green-400
            shadow-[0_0_10px_rgba(74,222,128,0.8)]
            animate-pulse
          "
        />

        <span className="text-sm font-semibold tracking-wide text-white">
          MetroVision AI Platform
        </span>
      </motion.div>

      {/* =====================================================
          MAIN HEADING
      ===================================================== */}
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.7,
        }}
        className="
          mt-6
          max-w-[540px]
          text-5xl
          font-black
          leading-[1.04]
          tracking-tight
          text-white
          drop-shadow-[0_4px_20px_rgba(0,0,0,0.45)]
          xl:text-6xl
        "
      >
        Smarter Metro.
        <br />
        Better Tomorrow.
      </motion.h1>

      {/* =====================================================
          DESCRIPTION
      ===================================================== */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.4,
          duration: 0.7,
        }}
        className="
          mt-5
          max-w-[530px]
          text-base
          leading-7
          text-slate-200/90
          drop-shadow-[0_2px_10px_rgba(0,0,0,0.65)]
        "
      >
        AI-powered metro crowd management, operational intelligence,
        passenger forecasting, smart scheduling and real-time
        transportation analytics.
      </motion.p>

      {/* =====================================================
          FEATURE CARDS
      ===================================================== */}
      <div className="mt-8 grid max-w-[540px] grid-cols-2 gap-4">
        {features.map((feature, index) => {
          const Icon = feature.icon;

          return (
            <motion.div
              key={feature.title}
              initial={{
                opacity: 0,
                y: 18,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.45 + index * 0.08,
                duration: 0.6,
                ease: "easeOut",
              }}
              whileHover={{
                y: -5,
                scale: 1.015,
              }}
              className="
                group
                relative
                overflow-hidden
                rounded-2xl
                border
                border-white/15
                bg-slate-950/40
                p-5
                shadow-[0_12px_35px_rgba(0,0,0,0.22)]
                backdrop-blur-xl
                transition-all
                duration-300
                hover:border-cyan-400/25
                hover:bg-slate-950/48
              "
            >
              {/* Soft glass highlight */}
              <div
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  bg-gradient-to-br
                  from-white/[0.055]
                  via-transparent
                  to-cyan-400/[0.025]
                  opacity-0
                  transition-opacity
                  duration-300
                  group-hover:opacity-100
                "
              />

              {/* Icon */}
              <div
                className="
                  relative
                  mb-3
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-cyan-400/10
                  bg-cyan-500/10
                  shadow-[0_0_20px_rgba(34,211,238,0.08)]
                  transition-all
                  duration-300
                  group-hover:border-cyan-400/20
                  group-hover:bg-cyan-500/15
                "
              >
                <Icon
                  size={22}
                  strokeWidth={1.8}
                  className="
                    text-cyan-400
                    transition-transform
                    duration-300
                    group-hover:scale-110
                  "
                />
              </div>

              {/* Title */}
              <h3
                className="
                  relative
                  text-base
                  font-semibold
                  leading-6
                  text-white
                "
              >
                {feature.title}
              </h3>

              {/* Description */}
              <p
                className="
                  relative
                  mt-2
                  text-sm
                  leading-5
                  text-slate-300/90
                "
              >
                {feature.description}
              </p>

              {/* Bottom accent */}
              <div
                className="
                  pointer-events-none
                  absolute
                  bottom-0
                  left-0
                  h-px
                  w-0
                  bg-gradient-to-r
                  from-cyan-400
                  to-transparent
                  transition-all
                  duration-300
                  group-hover:w-full
                "
              />
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}