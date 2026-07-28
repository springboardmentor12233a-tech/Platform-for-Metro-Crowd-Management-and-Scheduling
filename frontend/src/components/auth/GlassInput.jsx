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
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-slate-200"
        >
          {label}
          {required && (
            <span className="ml-1 text-red-400">*</span>
          )}
        </label>
      )}

      <motion.div
        whileFocus={{
          scale: 1.01,
        }}
        className={`
          group
          relative
          flex
          items-center
          overflow-hidden
          rounded-2xl
          border
          transition-all
          duration-300

          ${
            error
              ? "border-red-500/40"
              : "border-white/10 focus-within:border-cyan-400/60"
          }

          bg-white/5
          backdrop-blur-xl
          focus-within:bg-white/10
        `}
      >
        {/* Left Glow */}
        <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-cyan-400 to-blue-500 opacity-0 transition-opacity duration-300 group-focus-within:opacity-100" />

        {/* Icon */}
        {Icon && (
          <div className="pl-4">
            <Icon
              size={19}
              className={`
                transition-colors
                duration-300
                ${
                  error
                    ? "text-red-400"
                    : "text-slate-400 group-focus-within:text-cyan-400"
                }
              `}
            />
          </div>
        )}

        {/* Input */}
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
            h-14
            w-full
            bg-transparent
            px-4
            text-white
            placeholder:text-slate-500
            focus:outline-none
          "
        />

        {/* Password Toggle */}
        {isPassword && (
          <button
            type="button"
            onClick={() =>
              setShowPassword(!showPassword)
            }
            className="
              mr-4
              text-slate-400
              transition-colors
              hover:text-cyan-400
            "
          >
            {showPassword ? (
              <EyeOff size={20} />
            ) : (
              <Eye size={20} />
            )}
          </button>
        )}
      </motion.div>

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
          className="text-sm text-red-400"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}