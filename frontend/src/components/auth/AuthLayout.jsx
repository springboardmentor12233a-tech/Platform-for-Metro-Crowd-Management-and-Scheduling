import { motion } from "framer-motion";
import Background from "./Background";
import metroLoginBg from "../../assets/metro-login-bg.png";

export default function AuthLayout({ left, right }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030712]">

      {/* =========================================================
          METRO BACKGROUND IMAGE
          ========================================================= */}
      <div
        className="
          absolute
          inset-0
          bg-cover
          bg-center
          bg-no-repeat
        "
        style={{
          backgroundImage: `url(${metroLoginBg})`,
        }}
      />

      {/* =========================================================
          LIGHT DARK OVERLAY
          Keeps the metro image clearly visible
          ========================================================= */}
      <div className="absolute inset-0 bg-black/20" />

      {/* =========================================================
          SUBTLE READABILITY GRADIENT
          Slightly darkens edges without hiding the image
          ========================================================= */}
      <div
        className="
          absolute
          inset-0
          bg-gradient-to-r
          from-[#020617]/40
          via-transparent
          to-[#020617]/45
        "
      />

      {/* =========================================================
          EXISTING ANIMATED BACKGROUND
          Reduced opacity so it doesn't cover the metro image
          ========================================================= */}
      <div className="absolute inset-0 opacity-10">
        <Background />
      </div>

      {/* =========================================================
          CONTENT
          ========================================================= */}
      <div
        className="
          relative
          z-10
          flex
          min-h-screen
          items-center
          justify-center
          px-4
          py-6
          sm:px-6
          md:px-8
          lg:px-10
          xl:px-16
        "
      >
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

            {/* =====================================================
                LEFT SIDE
                ===================================================== */}
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

            {/* =====================================================
                RIGHT SIDE
                ===================================================== */}
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

                {/* =================================================
                    LOGIN CARD GLOW
                    ================================================= */}
                <div
                  className="
                    absolute
                    inset-0
                    -z-10
                    rounded-[36px]
                    bg-cyan-500/15
                    blur-[80px]
                  "
                />

                {right}

              </motion.div>
            </section>

          </div>
        </motion.div>
      </div>

      {/* =========================================================
          DESKTOP DIVIDER
          ========================================================= */}
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

      {/* =========================================================
          MOBILE BRANDING
          ========================================================= */}
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
        <h1
          className="
            text-xl
            font-bold
            tracking-wide
            text-white
          "
        >
          MetroVision
        </h1>

        <p
          className="
            mt-1
            text-center
            text-xs
            text-slate-400
          "
        >
          AI Metro Management Platform
        </p>
      </div>

    </div>
  );
}