import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function GlassInput({
  label,
  icon: Icon,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  autoComplete,
  name,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  return (
    <div className="space-y-2.5">
      {/* =========================================================
          LABEL
      ========================================================= */}
      {label && (
        <label
          htmlFor={name}
          className="
            block
            text-[13px]
            font-semibold
            text-slate-300
          "
        >
          {label}

          {required && (
            <span className="ml-1 text-red-400">
              *
            </span>
          )}
        </label>
      )}

      {/* =========================================================
          GLASS INPUT CONTAINER
      ========================================================= */}
      <motion.div
        whileFocus={{
          scale: 1.005,
        }}
        transition={{
          duration: 0.2,
          ease: "easeOut",
        }}
        className={`
          group
          relative
          flex
          items-center
          overflow-hidden
          rounded-xl

          border

          bg-white/[0.065]

          backdrop-blur-xl
          backdrop-saturate-[130%]

          transition-all
          duration-300

          shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]

          ${
            error
              ? `
                border-red-400/40
                bg-red-500/[0.05]
                focus-within:border-red-400/60
              `
              : `
                border-white/[0.14]
                hover:border-white/[0.22]
                hover:bg-white/[0.075]

                focus-within:border-cyan-400/60
                focus-within:bg-white/[0.09]
                focus-within:shadow-[0_0_25px_rgba(34,211,238,0.06)]
              `
          }

          ${disabled ? "cursor-not-allowed opacity-60" : ""}
        `}
      >
        {/* =======================================================
            LEFT ACCENT GLOW
        ======================================================= */}
        <div
          className={`
            pointer-events-none
            absolute
            inset-y-0
            left-0
            w-[2px]

            bg-gradient-to-b
            from-cyan-300
            via-cyan-400
            to-blue-500

            transition-opacity
            duration-300

            ${
              error
                ? `
                  opacity-100
                  from-red-400
                  via-red-500
                  to-red-600
                `
                : `
                  opacity-0
                  group-focus-within:opacity-100
                `
            }
          `}
        />

        {/* =======================================================
            LEFT ICON
        ======================================================= */}
        {Icon && (
          <div className="relative z-10 flex shrink-0 items-center pl-4">
            <Icon
              size={17}
              strokeWidth={1.8}
              className={`
                transition-colors
                duration-300

                ${
                  error
                    ? "text-red-400"
                    : `
                      text-slate-400
                      group-focus-within:text-cyan-400
                    `
                }
              `}
            />
          </div>
        )}

        {/* =======================================================
            INPUT
        ======================================================= */}
        <input
          id={name}
          name={name}
          type={
            isPassword
              ? showPassword
                ? "text"
                : "password"
              : type
          }
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          className="
            relative
            z-10

            h-14
            w-full

            bg-transparent

            px-4

            text-[14px]
            font-medium
            text-white

            caret-cyan-300

            outline-none

            placeholder:text-slate-500

            selection:bg-cyan-400/20
            selection:text-white

            disabled:cursor-not-allowed

            /* =================================================
               CHROME AUTOFILL
               ================================================= */

            [&:-webkit-autofill]:bg-transparent
            [&:-webkit-autofill]:text-white
            [&:-webkit-autofill]:caret-cyan-300

            [&:-webkit-autofill]:[-webkit-text-fill-color:white]

            [&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s]

            [&:-webkit-autofill]:[box-shadow:0_0_0_1000px_rgba(15,23,42,0.78)_inset]
          "
        />

        {/* =======================================================
            PASSWORD TOGGLE
        ======================================================= */}
        {isPassword && (
          <button
            type="button"
            disabled={disabled}
            aria-label={
              showPassword
                ? "Hide password"
                : "Show password"
            }
            aria-pressed={showPassword}
            onClick={() =>
              setShowPassword((prev) => !prev)
            }
            className="
              relative
              z-20

              mr-2

              flex
              h-9
              w-9
              shrink-0

              items-center
              justify-center

              rounded-lg

              text-slate-400

              transition-all
              duration-200

              hover:bg-white/[0.06]
              hover:text-cyan-400

              focus:outline-none
              focus:ring-2
              focus:ring-cyan-400/20

              active:scale-95

              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {showPassword ? (
              <EyeOff
                size={18}
                strokeWidth={1.8}
              />
            ) : (
              <Eye
                size={18}
                strokeWidth={1.8}
              />
            )}
          </button>
        )}

        {/* =======================================================
            TOP GLASS REFLECTION
        ======================================================= */}
        <div
          className="
            pointer-events-none
            absolute
            inset-x-0
            top-0
            z-30

            h-px

            bg-gradient-to-r
            from-transparent
            via-white/20
            to-transparent
          "
        />

        {/* =======================================================
            SUBTLE INNER HIGHLIGHT
        ======================================================= */}
        <div
          className="
            pointer-events-none
            absolute
            inset-x-4
            bottom-0
            z-30

            h-px

            bg-gradient-to-r
            from-transparent
            via-white/[0.06]
            to-transparent
          "
        />

        {/* =======================================================
            FOCUS GLOW
        ======================================================= */}
        {!error && (
          <div
            className="
              pointer-events-none
              absolute
              inset-0
              z-20

              rounded-xl

              opacity-0

              shadow-[inset_0_0_30px_rgba(34,211,238,0.045)]

              transition-opacity
              duration-300

              group-focus-within:opacity-100
            "
          />
        )}
      </motion.div>

      {/* =========================================================
          ERROR MESSAGE
      ========================================================= */}
      {error && (
        <motion.p
          initial={{
            opacity: 0,
            y: -5,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.25,
          }}
          className="
            px-1

            text-xs
            font-medium
            leading-5

            text-red-400
          "
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}