import { motion } from "framer-motion";
import Background from "./Background";

export default function AuthLayout({ left, right }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030712]">
      {/* Background */}
      <Background />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-6 sm:px-6 md:px-8 lg:px-10 xl:px-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            ease: "easeOut",
          }}
          className="mx-auto w-full max-w-[1700px]"
        >
          <div
            className="
              grid
              items-center
              gap-10
              lg:gap-14
              xl:gap-20
              grid-cols-1
              lg:grid-cols-[minmax(0,1fr)_460px]
              xl:grid-cols-[minmax(0,1fr)_480px]
              2xl:grid-cols-[minmax(0,1fr)_500px]
            "
          >
            {/* Left Side */}
            <section
              className="
                hidden
                lg:flex
                items-center
                justify-start
                min-h-[650px]
              "
            >
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.15,
                }}
                className="w-full max-w-2xl"
              >
                {left}
              </motion.div>
            </section>

            {/* Right Side */}
            <section
              className="
                flex
                items-center
                justify-center
                lg:justify-end
              "
            >
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.25,
                }}
                className="
                  relative
                  w-full
                  max-w-[430px]
                  sm:max-w-[450px]
                  md:max-w-[470px]
                  xl:max-w-[500px]
                "
              >
                {/* Glow */}
                <div
                  className="
                    absolute
                    inset-0
                    -z-10
                    rounded-[36px]
                    bg-cyan-500/10
                    blur-[80px]
                  "
                />

                {right}
              </motion.div>
            </section>
          </div>
        </motion.div>
      </div>

      {/* Desktop Divider */}
      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          hidden
          h-[72%]
          w-px
          -translate-x-1/2
          -translate-y-1/2
          bg-gradient-to-b
          from-transparent
          via-white/10
          to-transparent
          xl:block
        "
      />

      {/* Mobile Branding */}
      <div
        className="
          absolute
          top-6
          left-1/2
          -translate-x-1/2
          lg:hidden
          z-20
        "
      >
        <h1 className="text-xl font-bold tracking-wide text-white">
          MetroVision
        </h1>

        <p className="mt-1 text-center text-xs text-slate-400">
          AI Metro Management Platform
        </p>
      </div>
    </div>
  );
}