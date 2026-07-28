import { motion } from "framer-motion";
import { Loader2, ArrowRight } from "lucide-react";

export default function PrimaryButton({
  children,
  type = "button",
  onClick,
  loading = false,
  disabled = false,
  fullWidth = true,
  icon: Icon = ArrowRight,
  showIcon = true,
  variant = "primary",
}) {
  const variants = {
    primary: `
      from-cyan-500
      via-sky-500
      to-blue-600
      hover:from-cyan-400
      hover:via-sky-400
      hover:to-blue-500
      shadow-cyan-500/25
    `,

    emerald: `
      from-emerald-500
      to-teal-500
      hover:from-emerald-400
      hover:to-teal-400
      shadow-emerald-500/25
    `,

    violet: `
      from-violet-500
      to-purple-600
      hover:from-violet-400
      hover:to-purple-500
      shadow-violet-500/25
    `,
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{
        y: -2,
        scale: 1.01,
      }}
      whileTap={{
        scale: 0.98,
      }}
      transition={{
        duration: 0.2,
      }}
      className={`
        group
        relative
        overflow-hidden
        rounded-2xl
        h-14
        px-6
        font-semibold
        text-white
        transition-all
        duration-300
        focus:outline-none
        focus:ring-2
        focus:ring-cyan-400/40

        bg-gradient-to-r
        ${variants[variant]}

        shadow-xl

        ${
          fullWidth
            ? "w-full"
            : ""
        }

        ${
          disabled || loading
            ? "cursor-not-allowed opacity-70"
            : "hover:shadow-2xl"
        }
      `}
    >
      {/* Shine Animation */}
      <span
        className="
          absolute
          inset-0
          -translate-x-full
          bg-gradient-to-r
          from-transparent
          via-white/20
          to-transparent
          transition-transform
          duration-700
          group-hover:translate-x-full
        "
      />

      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading ? (
          <>
            <Loader2
              size={20}
              className="animate-spin"
            />
            Signing In...
          </>
        ) : (
          <>
            {children}

            {showIcon && (
              <Icon
                size={18}
                className="
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              />
            )}
          </>
        )}
      </span>
    </motion.button>
  );
}