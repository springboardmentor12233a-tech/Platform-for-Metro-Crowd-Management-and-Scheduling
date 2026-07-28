import { motion } from "framer-motion";

import AuthLayout from "../../components/auth/AuthLayout";
import Hero from "../../components/auth/Hero";
import ForgotPasswordCard from "../../components/auth/ForgotPasswordCard";

export default function ForgotPassword() {
  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
      transition={{
        duration: 0.35,
      }}
      className="min-h-screen"
    >
      <AuthLayout>
        {/* Left Hero */}
        <Hero />

        {/* Right Card */}
        <motion.div
          initial={{
            opacity: 0,
            x: 40,
            scale: 0.98,
          }}
          animate={{
            opacity: 1,
            x: 0,
            scale: 1,
          }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
            delay: 0.1,
          }}
        >
          <ForgotPasswordCard />
        </motion.div>
      </AuthLayout>
    </motion.div>
  );
}