import { motion } from "framer-motion";
import {
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { FaTrainSubway } from "react-icons/fa6";

import LoginForm from "./LoginForm";
import SocialLogin from "./SocialLogin";

export default function LoginCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.75,
        ease: "easeOut",
      }}
      className="
        relative
        w-full
        max-w-[440px]
        sm:max-w-[460px]
        xl:max-w-[480px]
        overflow-hidden
        rounded-[32px]
        border
        border-white/10
        bg-slate-900/65
        backdrop-blur-[32px]
        shadow-[0_40px_100px_rgba(0,0,0,0.55)]
      "
    >
      {/* Animated Border Glow */}
      <div
        className="
          absolute
          inset-0
          rounded-[32px]
          bg-gradient-to-br
          from-cyan-500/10
          via-transparent
          to-violet-500/10
          pointer-events-none
        "
      />

      {/* Top Glow */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-r from-cyan-500/15 via-blue-500/10 to-violet-500/15" />

      {/* Glass Reflection */}
      <div className="absolute left-0 top-0 h-full w-px bg-white/10" />
      <div className="absolute left-0 top-0 h-px w-full bg-white/10" />

      <div className="relative z-10 px-7 py-7 sm:px-8 sm:py-8">

        {/* Logo */}
        <motion.div
          animate={{
            y: [0, -5, 0],
            rotate: [0, 1, -1, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="flex justify-center"
        >
          <div
            className="
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-2xl
              bg-gradient-to-br
              from-cyan-500
              via-sky-500
              to-blue-600
              shadow-xl
              shadow-cyan-500/25
            "
          >
            <FaTrainSubway className="text-3xl text-white" />
          </div>
        </motion.div>

        {/* Brand */}
        <div className="mt-4 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-cyan-300">
            MetroFlow
          </p>

          <h2 className="mt-3 text-[38px] font-black tracking-tight text-white">
            Welcome Back
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            Sign in to continue to your
            <br />
            MetroFlow AI workspace.
          </p>
        </div>

        {/* Status */}
        <div className="mt-5 flex justify-center">
          <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />

            <span className="text-xs font-medium text-emerald-300">
              System Operational
            </span>
          </div>
        </div>

        {/* Security Badge */}
        <div
          className="
            mt-5
            flex
            items-center
            justify-center
            gap-2
            rounded-2xl
            border
            border-cyan-500/15
            bg-cyan-500/5
            py-2.5
          "
        >
          <ShieldCheck
            size={16}
            className="text-cyan-400"
          />

          <span className="text-xs font-medium text-cyan-300">
            Enterprise Secure Authentication
          </span>
        </div>

        {/* Login Form */}
        <div className="mt-7">
          <LoginForm />
        </div>

        {/* Divider */}
        <div className="my-7 flex items-center gap-4">
          <div className="h-px flex-1 bg-white/10" />

          <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-500">
            OR
          </span>

          <div className="h-px flex-1 bg-white/10" />
        </div>

        {/* Social Login */}
        <SocialLogin />

        {/* Footer */}
        <div className="mt-7 border-t border-white/10 pt-5">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <Sparkles size={14} />
              MetroFlow AI
            </div>

            <span>Version 2.0</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}