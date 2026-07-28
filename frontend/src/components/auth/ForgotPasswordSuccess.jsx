import { motion } from "framer-motion";
import {
  CheckCircle2,
  Mail,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";

import PrimaryButton from "./PrimaryButton";

export default function ForgotPasswordSuccess({
  email,
}) {
  return (
    <motion.div
      key="success"
      initial={{
        opacity: 0,
        y: 20,
        scale: 0.98,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      exit={{
        opacity: 0,
        y: -20,
      }}
      transition={{
        duration: 0.45,
      }}
      className="space-y-8"
    >
      {/* Success Icon */}
      <motion.div
        initial={{
          scale: 0,
          rotate: -90,
        }}
        animate={{
          scale: 1,
          rotate: 0,
        }}
        transition={{
          delay: 0.15,
          type: "spring",
          stiffness: 220,
        }}
        className="flex justify-center"
      >
        <div
          className="
            flex
            h-24
            w-24
            items-center
            justify-center
            rounded-full
            bg-emerald-500/10
            border
            border-emerald-500/20
          "
        >
          <CheckCircle2
            size={42}
            className="text-emerald-400"
          />
        </div>
      </motion.div>

      {/* Heading */}
      <div className="text-center">
        <h2 className="text-3xl font-black text-white">
          Check Your Email
        </h2>

        <p className="mt-4 text-slate-300 leading-7">
          We've sent a secure password reset link to
        </p>

        <p className="mt-2 font-semibold text-cyan-300 break-all">
          {email}
        </p>
      </div>

      {/* Information Card */}
      <div
        className="
          rounded-2xl
          border
          border-cyan-500/15
          bg-cyan-500/5
          p-5
        "
      >
        <div className="flex gap-4">
          <Mail
            size={22}
            className="mt-1 text-cyan-400"
          />

          <div>
            <h4 className="font-semibold text-white">
              Didn't receive the email?
            </h4>

            <ul className="mt-3 space-y-2 text-sm text-slate-400">
              <li>• Check your Spam or Promotions folder.</li>
              <li>• Make sure you entered the correct email.</li>
              <li>• The reset link expires after a limited time.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-4">
        <PrimaryButton
          type="button"
          icon={ExternalLink}
        >
          Open Email
        </PrimaryButton>

        <Link
          to="/login"
          className="
            flex
            items-center
            justify-center
            gap-2
            rounded-2xl
            border
            border-white/10
            py-4
            text-slate-300
            transition-all
            duration-300
            hover:border-cyan-500/20
            hover:bg-white/5
            hover:text-white
          "
        >
          <ArrowLeft size={18} />
          Back to Sign In
        </Link>
      </div>
    </motion.div>
  );
}