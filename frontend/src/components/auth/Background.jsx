import { motion } from "framer-motion";

const particles = Array.from({ length: 25 });

export default function Background() {
  return (
    <div className="absolute inset-0 overflow-hidden">

      {/* Base Background */}
      <div className="absolute inset-0 bg-[#030712]" />

      {/* Aurora Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#0f172a_0%,#020617_35%,#020617_100%)]" />

      {/* Animated Blue Orb */}
      <motion.div
        animate={{
          x: [0, 120, 0],
          y: [0, -90, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -left-44 -top-44 h-[600px] w-[600px] rounded-full bg-cyan-500/20 blur-[160px]"
      />

      {/* Purple Orb */}
      <motion.div
        animate={{
          x: [0, -120, 0],
          y: [0, 80, 0],
          scale: [1.1, 0.95, 1.1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute right-[-150px] bottom-[-120px] h-[520px] w-[520px] rounded-full bg-violet-600/20 blur-[160px]"
      />

      {/* Cyan Center Glow */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
        }}
        className="absolute left-1/2 top-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-[130px]"
      />

      {/* Animated Metro Lines */}
      <svg
        className="absolute inset-0 h-full w-full opacity-10"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M-100 300 C400 250 700 450 1200 350 S1800 250 2100 400"
          stroke="#06b6d4"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />

        <motion.path
          d="M-100 700 C500 600 900 850 1500 700 S1900 650 2200 820"
          stroke="#8b5cf6"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </svg>

      {/* Floating Particles */}
      {particles.map((_, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full bg-cyan-300/40"
          style={{
            width: Math.random() * 4 + 2,
            height: Math.random() * 4 + 2,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [0.15, 0.8, 0.15],
          }}
          transition={{
            duration: Math.random() * 8 + 6,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}

      {/* Grid Overlay */}
      <div
        className="
          absolute
          inset-0
          opacity-[0.05]
          [background-image:linear-gradient(rgba(255,255,255,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.15)_1px,transparent_1px)]
          [background-size:50px_50px]
        "
      />

      {/* Noise Overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "url('https://www.transparenttextures.com/patterns/noise.png')",
        }}
      />
    </div>
  );
}