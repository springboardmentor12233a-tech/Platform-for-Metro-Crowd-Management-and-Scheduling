import { motion } from "framer-motion";
import { FaTrainSubway } from "react-icons/fa6";
import { ShieldCheck } from "lucide-react";
import LoginForm from "./LoginForm";

export default function LoginCard() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.8 }}
      className="
        relative
        w-full
        max-w-md
        overflow-hidden
        rounded-3xl
        border
        border-white/10
        bg-white/10
        shadow-2xl
        backdrop-blur-2xl
      "
    >
      {/* Top Glow */}
      <div className="absolute left-0 top-0 h-40 w-full bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-violet-500/10" />

      <div className="relative z-10 p-10">
        {/* Logo */}
        <div className="flex justify-center">
          <div
            className="
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-2xl
              bg-gradient-to-br
              from-cyan-500
              to-blue-600
              shadow-lg
            "
          >
            <FaTrainSubway className="text-4xl text-white" />
          </div>
        </div>

        {/* Title */}
        <div className="mt-8 text-center">
          <h2 className="text-4xl font-black text-white">
            Welcome Back
          </h2>

          <p className="mt-3 text-slate-300">
            Sign in to access the MetroFlow dashboard.
          </p>
        </div>

        {/* Security Badge */}
        <div
          className="
            mt-8
            flex
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-emerald-500/20
            bg-emerald-500/10
            py-3
          "
        >
          <ShieldCheck
            size={18}
            className="text-emerald-400"
          />

          <span className="text-sm text-emerald-300">
            Secure JWT Authentication
          </span>
        </div>

        {/* Login Form */}
        <div className="mt-8">
          <LoginForm />
        </div>

        {/* Divider */}
        <div className="my-8 flex items-center">
          <div className="h-px flex-1 bg-white/10" />

          <span className="mx-4 text-sm text-slate-400">
            OR
          </span>

          <div className="h-px flex-1 bg-white/10" />
        </div>

        {/* Future Social Login */}
        <div className="grid gap-3">
          <button
            type="button"
            className="
              rounded-xl
              border
              border-white/10
              bg-white/5
              py-3
              text-white
              transition
              hover:bg-white/10
            "
          >
            Continue with Google
          </button>

          <button
            type="button"
            className="
              rounded-xl
              border
              border-white/10
              bg-white/5
              py-3
              text-white
              transition
              hover:bg-white/10
            "
          >
            Continue with Microsoft
          </button>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-slate-400">
          © {new Date().getFullYear()} MetroFlow AI Platform
        </p>
      </div>
    </motion.div>
  );
}