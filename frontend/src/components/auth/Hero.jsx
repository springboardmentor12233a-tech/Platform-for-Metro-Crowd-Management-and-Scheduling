import { motion } from "framer-motion";
import {
  Activity,
  BrainCircuit,
  ShieldCheck,
  TrainFront,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: BrainCircuit,
    title: "AI-powered Crowd Prediction",
    description: "Forecast congestion before it impacts daily operations.",
  },
  {
    icon: TrainFront,
    title: "Smart Train Scheduling",
    description: "Optimize train frequency using live passenger demand.",
  },
  {
    icon: Activity,
    title: "Real-time Operations",
    description: "Monitor stations, routes and passenger flow instantly.",
  },
  {
    icon: ShieldCheck,
    title: "Enterprise-grade Security",
    description: "Secure authentication and operational control.",
  },
];

export default function Hero() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="relative max-w-3xl"
    >
      {/* Background Glow */}
      <div className="absolute -left-36 top-20 h-[520px] w-[520px] rounded-full bg-cyan-500/10 blur-[180px]" />

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="relative z-10 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-5 py-2 backdrop-blur-xl"
      >
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />

        <span className="text-sm font-semibold text-cyan-300">
          MetroVision AI Platform
        </span>
      </motion.div>

      {/* Heading */}
      <div className="relative z-10 mt-8">
        <h1 className="text-5xl font-black leading-[1.05] tracking-tight text-white lg:text-7xl">
          Smarter Metro.
          <br />

          <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent">
            Better Tomorrow.
          </span>
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-300">
          MetroVoision combines artificial intelligence, predictive analytics,
          and real-time monitoring to help modern metro systems improve
          passenger experience, operational efficiency, and transportation
          safety.
        </p>
      </div>

      {/* Divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.4 }}
        className="relative z-10 my-12 h-px origin-left bg-gradient-to-r from-cyan-500/40 via-white/10 to-transparent"
      />

      {/* Features */}
      <div className="relative z-10 grid gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;

          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.3 + index * 0.1,
              }}
              whileHover={{
                x: 8,
              }}
              className="group flex items-start gap-5 rounded-2xl transition-all duration-300"
            >
              {/* Icon */}
              <div
                className="
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-cyan-500/10
                  transition-all
                  duration-300
                  group-hover:bg-cyan-500/20
                "
              >
                <Icon
                  size={22}
                  className="text-cyan-400"
                />
              </div>

              {/* Text */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2
                    size={18}
                    className="text-emerald-400"
                  />

                  <h3 className="font-semibold text-white">
                    {feature.title}
                  </h3>
                </div>

                <p className="mt-2 text-sm leading-7 text-slate-400">
                  {feature.description}
                </p>
              </div>

              <ArrowRight
                size={18}
                className="
                  mt-1
                  text-slate-600
                  opacity-0
                  transition-all
                  duration-300
                  group-hover:translate-x-1
                  group-hover:opacity-100
                "
              />
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Divider */}
      <div className="relative z-10 mt-14 flex items-center gap-4 text-sm text-slate-500">
        <div className="h-px w-16 bg-cyan-500/40" />

        <span>Trusted platform for modern metro operations.</span>

        <div className="h-px flex-1 bg-white/10" />
      </div>
    </motion.div>
  );
}