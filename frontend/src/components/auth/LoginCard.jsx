import { motion } from "framer-motion";
import {
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { FaTrainSubway } from "react-icons/fa6";
import { Link } from "react-router-dom";

import LoginForm from "./LoginForm";
import SocialLogin from "./SocialLogin";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.12,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function LoginCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 36, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-[440px] sm:max-w-[460px] xl:max-w-[480px]"
    >
      {/* Rotating gradient border ring — the premium signature */}
      <div className="absolute -inset-px rounded-[33px] overflow-hidden pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-[60%] opacity-70"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0%, rgba(56,224,224,0.55) 12%, transparent 24%, transparent 60%, rgba(139,123,255,0.5) 74%, transparent 86%)",
          }}
        />
      </div>

      <div
        className="
          relative
          overflow-hidden
          rounded-[32px]
          border
          border-white/10
          bg-slate-900/70
          backdrop-blur-[32px]
          shadow-[0_40px_100px_rgba(0,0,0,0.55)]
        "
      >
        {/* Fine grain texture for tactile depth */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.9) 0.6px, transparent 0.6px)",
            backgroundSize: "3px 3px",
          }}
        />

        {/* Ambient top wash */}
        <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-cyan-500/[0.12] via-blue-500/[0.05] to-transparent pointer-events-none" />

        {/* Glass reflection edges */}
        <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-white/25 via-white/5 to-transparent" />
        <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-white/25 via-white/5 to-transparent" />

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative z-10 px-7 py-8 sm:px-8 sm:py-9"
        >
          {/* Logo */}
          <motion.div variants={item} className="flex justify-center">
            <div className="relative">
              <motion.div
                animate={{ scale: [1, 1.18, 1], opacity: [0.5, 0.15, 0.5] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-2xl bg-cyan-400 blur-xl"
              />
              <div
                className="
                  relative
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-2xl
                  bg-gradient-to-br
                  from-cyan-400
                  via-sky-500
                  to-blue-600
                  shadow-xl
                  shadow-cyan-500/30
                  ring-1
                  ring-white/20
                "
              >
                <FaTrainSubway className="text-3xl text-white drop-shadow-sm" />
              </div>
            </div>
          </motion.div>

          {/* Brand */}
          <motion.div variants={item} className="mt-5 text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-cyan-300/90">
              MetroVision
            </p>

            <h2
              className="
                mt-3
                bg-gradient-to-b
                from-white
                to-slate-300
                bg-clip-text
                text-[36px]
                font-black
                leading-tight
                tracking-tight
                text-transparent
              "
            >
              Welcome Back
            </h2>

            <p className="mt-2.5 text-sm leading-6 text-slate-400">
              Sign in to continue to your MetroVision AI workspace.
            </p>
          </motion.div>

          {/* Status strip — combined for a tighter, more considered layout */}
          <motion.div
            variants={item}
            className="mt-6 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-1.5"
          >
            <div className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500/10 py-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              <span className="text-[11px] font-medium text-emerald-300">
                Operational
              </span>
            </div>

            <div className="h-6 w-px bg-white/10" />

            <div className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-500/10 py-2">
              <ShieldCheck size={13} className="text-cyan-400" />
              <span className="text-[11px] font-medium text-cyan-300">
                Enterprise Secure
              </span>
            </div>
          </motion.div>

          {/* Login Form */}
          <motion.div variants={item} className="mt-7">
            <LoginForm />
          </motion.div>

          {/* Divider */}
          <motion.div variants={item} className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/15 to-white/15" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-500">
              Or
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent via-white/15 to-white/15" />
          </motion.div>

          {/* Social Login */}
          <motion.div variants={item}>
            <SocialLogin />
          </motion.div>

          {/* Register */}
          <motion.div variants={item} className="mt-6 text-center">
            <p className="text-sm text-slate-400">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-cyan-400 transition hover:text-cyan-300"
              >
                Create Account
              </Link>
            </p>
          </motion.div>

          {/* Footer */}
          <motion.div variants={item} className="mt-7 border-t border-white/10 pt-5">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <Sparkles size={13} className="text-slate-400" />
                MetroVision AI
              </div>

              <div className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-slate-600" />
                <span>Version 2.0</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}