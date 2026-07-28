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

      await new Promise((resolve) => setTimeout(resolve, 1200));
    } finally {
      setLoading("");
    }
  };

  const handleMicrosoft = async () => {
    try {
      setLoading("microsoft");

      // TODO:
      // Implement Microsoft OAuth here

      await new Promise((resolve) => setTimeout(resolve, 1200));
    } finally {
      setLoading("");
    }
  };

  return (
    <div className="space-y-3">
      {/* Google */}
      <button
        type="button"
        onClick={handleGoogle}
        disabled={loading !== ""}
        className="
          group
          flex
          w-full
          items-center
          justify-center
          gap-3
          rounded-2xl
          border
          border-white/10
          bg-white/5
          py-3.5
          font-medium
          text-white
          backdrop-blur-xl
          transition-all
          duration-300
          hover:-translate-y-0.5
          hover:border-white/20
          hover:bg-white/10
          hover:shadow-lg
          hover:shadow-cyan-500/10
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      >
        {loading === "google" ? (
          <>
            <Loader2
              size={18}
              className="animate-spin"
            />
            Connecting...
          </>
        ) : (
          <>
            <FcGoogle className="text-2xl" />

            <span>Continue with Google</span>
          </>
        )}
      </button>

      {/* Microsoft */}
      <button
        type="button"
        onClick={handleMicrosoft}
        disabled={loading !== ""}
        className="
          group
          flex
          w-full
          items-center
          justify-center
          gap-3
          rounded-2xl
          border
          border-white/10
          bg-white/5
          py-3.5
          font-medium
          text-white
          backdrop-blur-xl
          transition-all
          duration-300
          hover:-translate-y-0.5
          hover:border-white/20
          hover:bg-white/10
          hover:shadow-lg
          hover:shadow-cyan-500/10
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      >
        {loading === "microsoft" ? (
          <>
            <Loader2
              size={18}
              className="animate-spin"
            />
            Connecting...
          </>
        ) : (
          <>
            <FaMicrosoft
              className="text-xl text-sky-400"
            />

            <span>Continue with Microsoft</span>
          </>
        )}
      </button>
    </div>
  );
}