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
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const item = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function LoginCard() {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 30,
        scale: 0.97,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        duration: 0.75,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="relative w-full max-w-[440px] sm:max-w-[460px] xl:max-w-[470px]"
    >
      {/* =====================================================
          SUBTLE ANIMATED BORDER
      ===================================================== */}
      <div className="absolute -inset-px overflow-hidden rounded-[31px] pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -inset-[65%] opacity-60"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0%, rgba(34,211,238,0.55) 10%, transparent 22%, transparent 65%, rgba(59,130,246,0.45) 76%, transparent 88%)",
          }}
        />
      </div>

      {/* =====================================================
          MAIN CARD
      ===================================================== */}
      <div
        className="
          relative
          overflow-hidden
          rounded-[30px]

          border
          border-white/[0.18]

          bg-slate-950/[0.62]

          backdrop-blur-[30px]
          backdrop-saturate-[135%]

          shadow-[0_35px_90px_rgba(0,0,0,0.58)]
        "
      >
        {/* =================================================
            VERY SUBTLE TOP LIGHT
        ================================================= */}
        <div
          className="
            pointer-events-none
            absolute
            inset-x-0
            top-0
            h-32
            bg-gradient-to-b
            from-white/[0.07]
            to-transparent
          "
        />

        {/* =================================================
            SUBTLE CYAN CORNER GLOW
        ================================================= */}
        <div
          className="
            pointer-events-none
            absolute
            -right-24
            -top-24
            h-52
            w-52
            rounded-full
            bg-cyan-400/[0.07]
            blur-3xl
          "
        />

        {/* =================================================
            SUBTLE BLUE BOTTOM GLOW
        ================================================= */}
        <div
          className="
            pointer-events-none
            absolute
            -bottom-28
            -left-20
            h-56
            w-56
            rounded-full
            bg-blue-500/[0.06]
            blur-3xl
          "
        />

        {/* =================================================
            GLASS TOP EDGE
        ================================================= */}
        <div
          className="
            pointer-events-none
            absolute
            left-6
            right-6
            top-0
            h-px
            bg-gradient-to-r
            from-transparent
            via-white/35
            to-transparent
          "
        />

        {/* =================================================
            GLASS LEFT EDGE
        ================================================= */}
        <div
          className="
            pointer-events-none
            absolute
            left-0
            top-6
            bottom-6
            w-px
            bg-gradient-to-b
            from-white/25
            via-white/[0.08]
            to-transparent
          "
        />

        {/* =================================================
            CONTENT
        ================================================= */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="
            relative
            z-10
            px-7
            py-7
            sm:px-8
            sm:py-8
          "
        >
          {/* =================================================
              LOGO
          ================================================= */}
          <motion.div
            variants={item}
            className="flex justify-center"
          >
            <div className="relative">
              {/* Glow */}
              <motion.div
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.35, 0.12, 0.35],
                }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="
                  absolute
                  inset-0
                  rounded-2xl
                  bg-cyan-400
                  blur-xl
                "
              />

              {/* Logo */}
              <div
                className="
                  relative
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl

                  bg-gradient-to-br
                  from-cyan-400
                  via-sky-500
                  to-blue-600

                  shadow-lg
                  shadow-cyan-500/25

                  ring-1
                  ring-white/25
                "
              >
                <FaTrainSubway className="text-2xl text-white" />
              </div>
            </div>
          </motion.div>

          {/* =================================================
              BRAND
          ================================================= */}
          <motion.div
            variants={item}
            className="mt-4 text-center"
          >
            <p
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.42em]
                text-cyan-300
              "
            >
              MetroVision
            </p>

            <h2
              className="
                mt-2.5
                text-[34px]
                font-black
                leading-tight
                tracking-tight
                text-white
              "
            >
              Welcome Back
            </h2>

            <p
              className="
                mx-auto
                mt-2
                max-w-[320px]
                text-[13px]
                leading-5
                text-slate-400
              "
            >
              Sign in to continue to your MetroVision AI
              workspace.
            </p>
          </motion.div>

          {/* =================================================
              STATUS
          ================================================= */}
          <motion.div
            variants={item}
            className="
              mt-5
              flex
              items-center
              gap-1.5

              rounded-xl

              border
              border-white/[0.12]

              bg-white/[0.035]

              p-1
            "
          >
            {/* Operational */}
            <div
              className="
                flex
                flex-1
                items-center
                justify-center
                gap-2

                rounded-lg

                bg-emerald-400/[0.07]

                py-2
              "
            >
              <span className="relative flex h-1.5 w-1.5">
                <span
                  className="
                    absolute
                    inline-flex
                    h-full
                    w-full
                    animate-ping
                    rounded-full
                    bg-emerald-400
                    opacity-60
                  "
                />

                <span
                  className="
                    relative
                    h-1.5
                    w-1.5
                    rounded-full
                    bg-emerald-400
                  "
                />
              </span>

              <span className="text-[10px] font-medium text-emerald-300">
                Operational
              </span>
            </div>

            <div className="h-5 w-px bg-white/10" />

            {/* Security */}
            <div
              className="
                flex
                flex-1
                items-center
                justify-center
                gap-2

                rounded-lg

                bg-cyan-400/[0.06]

                py-2
              "
            >
              <ShieldCheck
                size={12}
                className="text-cyan-400"
              />

              <span className="text-[10px] font-medium text-cyan-300">
                Enterprise Secure
              </span>
            </div>
          </motion.div>

          {/* =================================================
              LOGIN FORM
          ================================================= */}
          <motion.div
            variants={item}
            className="mt-6"
          >
            <LoginForm />
          </motion.div>

          {/* =================================================
              DIVIDER
          ================================================= */}
          <motion.div
            variants={item}
            className="my-5 flex items-center gap-3"
          >
            <div
              className="
                h-px
                flex-1
                bg-gradient-to-r
                from-transparent
                to-white/[0.15]
              "
            />

            <span
              className="
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.35em]
                text-slate-500
              "
            >
              Or
            </span>

            <div
              className="
                h-px
                flex-1
                bg-gradient-to-l
                from-transparent
                to-white/[0.15]
              "
            />
          </motion.div>

          {/* =================================================
              SOCIAL LOGIN
          ================================================= */}
          <motion.div variants={item}>
            <SocialLogin />
          </motion.div>

          {/* =================================================
              REGISTER
          ================================================= */}
          <motion.div
            variants={item}
            className="mt-5 text-center"
          >
            <p className="text-xs text-slate-400">
              Don't have an account?{" "}

              <Link
                to="/register"
                className="
                  font-semibold
                  text-cyan-300
                  transition-colors
                  hover:text-cyan-200
                "
              >
                Create Account
              </Link>
            </p>
          </motion.div>

          {/* =================================================
              FOOTER
          ================================================= */}
          <motion.div
            variants={item}
            className="
              mt-5
              border-t
              border-white/[0.10]
              pt-4
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
                text-[10px]
                text-slate-500
              "
            >
              <div className="flex items-center gap-1.5">
                <Sparkles
                  size={11}
                  className="text-slate-400"
                />
                <span>MetroVision AI</span>
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