import {
  Train,
  CheckCircle,
  Wrench,
  Ban,
} from "lucide-react";


const colors = {

  cyan: {
    border: "border-cyan-500",
    bg: "bg-cyan-500/10",
    text: "text-cyan-400",
    icon: <Train size={24} />,
  },

  green: {
    border: "border-green-500",
    bg: "bg-green-500/10",
    text: "text-green-400",
    icon: <CheckCircle size={24} />,
  },

  yellow: {
    border: "border-yellow-500",
    bg: "bg-yellow-500/10",
    text: "text-yellow-400",
    icon: <Wrench size={24} />,
  },

  red: {
    border: "border-red-500",
    bg: "bg-red-500/10",
    text: "text-red-400",
    icon: <Ban size={24} />,
  },

};


export default function StatsCard({
  title,
  value,
  color = "cyan",
}) {

  const style = colors[color] || colors.cyan;


  return (

    <div
      className={`
        bg-slate-800
        rounded-2xl
        p-6
        border-l-4
        ${style.border}
        shadow-lg
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-lg
      `}
    >

      <div
        className="
          flex
          justify-between
          items-center
        "
      >

        {/* =====================================================
            Text
        ===================================================== */}

        <div>

          <p
            className="
              text-slate-400
              text-lg
            "
          >
            {title}
          </p>


          <h1
            className="
              text-5xl
              font-bold
              text-white
              mt-3
            "
          >
            {value ?? 0}
          </h1>

        </div>


        {/* =====================================================
            Icon
        ===================================================== */}

        <div
          className={`
            w-14
            h-14
            rounded-xl
            flex
            items-center
            justify-center
            ${style.bg}
            ${style.text}
          `}
        >

          {style.icon}

        </div>

      </div>

    </div>

  );
}