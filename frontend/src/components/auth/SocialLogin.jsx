import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaMicrosoft } from "react-icons/fa";
import { Loader2 } from "lucide-react";

export default function SocialLogin() {
  const [loading, setLoading] = useState("");

  const handleGoogle = async () => {
    try {
      setLoading("google");

      // TODO:
      // Implement Google OAuth here

      await new Promise((resolve) =>
        setTimeout(resolve, 1200)
      );
    } finally {
      setLoading("");
    }
  };

  const handleMicrosoft = async () => {
    try {
      setLoading("microsoft");

      // TODO:
      // Implement Microsoft OAuth here

      await new Promise((resolve) =>
        setTimeout(resolve, 1200)
      );
    } finally {
      setLoading("");
    }
  };

  return (
    <div className="space-y-2.5">
      {/* =====================================================
          GOOGLE
      ===================================================== */}
      <button
        type="button"
        onClick={handleGoogle}
        disabled={loading !== ""}
        className="
          group
          relative
          flex
          w-full
          items-center
          justify-center
          gap-3

          overflow-hidden

          rounded-xl

          border
          border-white/[0.14]

          bg-white/[0.055]

          py-3

          text-[13px]
          font-semibold
          text-white

          backdrop-blur-md

          shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]

          transition-all
          duration-300

          hover:-translate-y-[1px]
          hover:border-white/[0.24]
          hover:bg-white/[0.09]
          hover:shadow-[0_8px_25px_rgba(0,0,0,0.18)]

          active:translate-y-0

          disabled:cursor-not-allowed
          disabled:opacity-50
          disabled:hover:translate-y-0
        "
      >
        {/* Hover glow */}
        <span
          className="
            pointer-events-none
            absolute
            inset-0
            bg-gradient-to-r
            from-transparent
            via-white/[0.035]
            to-transparent
            opacity-0
            transition-opacity
            duration-300
            group-hover:opacity-100
          "
        />

        {loading === "google" ? (
          <>
            <Loader2
              size={17}
              className="
                animate-spin
                text-cyan-300
              "
            />

            <span className="relative">
              Connecting...
            </span>
          </>
        ) : (
          <>
            <FcGoogle
              className="
                relative
                text-xl
                drop-shadow-sm
              "
            />

            <span className="relative">
              Continue with Google
            </span>
          </>
        )}
      </button>

      {/* =====================================================
          MICROSOFT
      ===================================================== */}
      <button
        type="button"
        onClick={handleMicrosoft}
        disabled={loading !== ""}
        className="
          group
          relative
          flex
          w-full
          items-center
          justify-center
          gap-3

          overflow-hidden

          rounded-xl

          border
          border-white/[0.14]

          bg-white/[0.055]

          py-3

          text-[13px]
          font-semibold
          text-white

          backdrop-blur-md

          shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]

          transition-all
          duration-300

          hover:-translate-y-[1px]
          hover:border-white/[0.24]
          hover:bg-white/[0.09]
          hover:shadow-[0_8px_25px_rgba(0,0,0,0.18)]

          active:translate-y-0

          disabled:cursor-not-allowed
          disabled:opacity-50
          disabled:hover:translate-y-0
        "
      >
        {/* Hover glow */}
        <span
          className="
            pointer-events-none
            absolute
            inset-0
            bg-gradient-to-r
            from-transparent
            via-white/[0.035]
            to-transparent
            opacity-0
            transition-opacity
            duration-300
            group-hover:opacity-100
          "
        />

        {loading === "microsoft" ? (
          <>
            <Loader2
              size={17}
              className="
                animate-spin
                text-cyan-300
              "
            />

            <span className="relative">
              Connecting...
            </span>
          </>
        ) : (
          <>
            <FaMicrosoft
              className="
                relative
                text-[17px]
                text-sky-400
                drop-shadow-sm
              "
            />

            <span className="relative">
              Continue with Microsoft
            </span>
          </>
        )}
      </button>
    </div>
  );
}