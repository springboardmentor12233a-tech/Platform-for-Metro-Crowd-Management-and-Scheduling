import { motion } from "framer-motion";
import { FaTrainSubway } from "react-icons/fa6";

export default function Logo({ size = "lg" }) {
  const sizes = {
    sm: {
      box: "h-12 w-12",
      icon: "text-xl",
      title: "text-xs",
    },
    lg: {
      box: "h-16 w-16",
      icon: "text-3xl",
      title: "text-sm",
    },
  };

  const s = sizes[size];

  return (
    <div className="flex flex-col items-center">
      <motion.div
        animate={{
          y: [0, -4, 0],
          rotate: [0, 1, -1, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={`
          ${s.box}
          flex items-center justify-center
          rounded-2xl
          bg-gradient-to-br
          from-cyan-500
          via-sky-500
          to-blue-600
          shadow-xl
          shadow-cyan-500/25
        `}
      >
        <FaTrainSubway
          className={`${s.icon} text-white`}
        />
      </motion.div>

      <h3
        className={`
          mt-4
          ${s.title}
          font-bold
          uppercase
          tracking-[0.35em]
          text-cyan-300
        `}
      >
        MetroVision
      </h3>
    </div>
  );
}