import { useState } from "react";

// ==========================================
// Component
// ==========================================

function MetroStationNode({
  station,
  x,
  y,
  selected = false,
  onClick,
}) {
  const [hovered, setHovered] = useState(false);

  // ==========================================
  // Crowd Level Color
  // ==========================================

  const getColor = () => {
    switch (station.crowd_level) {
      case "High":
        return "#ef4444";

      case "Medium":
        return "#f59e0b";

      default:
        return "#22c55e";
    }
  };

  const color = getColor();

  const scale = hovered
    ? 1.15
    : selected
    ? 1.12
    : 1;

  return (
    <g
      onClick={() => onClick(station)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: "pointer",
        transition: "all .3s ease",
      }}
      transform={`translate(${x},${y}) scale(${scale}) translate(${-x},${-y})`}
    >
      <title>
        {station.station}
        {"\n"}
        Occupancy: {station.occupancy}%
        {"\n"}
        Crowd Level: {station.crowd_level}
      </title>

      {/* ================= Selected Glow ================= */}

      {selected && (
        <>
          <circle
            cx={x}
            cy={y}
            r="48"
            fill="#4f46e5"
            opacity="0.08"
          />

          <circle
            cx={x}
            cy={y}
            r="34"
            fill="none"
            stroke="#4f46e5"
            strokeWidth="3"
          >
            <animate
              attributeName="r"
              values="34;46;34"
              dur="1.8s"
              repeatCount="indefinite"
            />

            <animate
              attributeName="opacity"
              values="0.9;0.2;0.9"
              dur="1.8s"
              repeatCount="indefinite"
            />
          </circle>
        </>
      )}

      {/* ================= Outer Glow ================= */}

      <circle
        cx={x}
        cy={y}
        r={hovered || selected ? 38 : 32}
        fill={selected ? "#6366f1" : color}
        opacity={selected ? "0.18" : "0.08"}
      />

      {/* ================= Animated Pulse ================= */}

      <circle
        cx={x}
        cy={y}
        r={selected ? "22" : "18"}
        fill={selected ? "#6366f1" : color}
        opacity="0.22"
      >
        <animate
          attributeName="r"
          values={
            selected
              ? "22;34;22"
              : "18;32;18"
          }
          dur="2s"
          repeatCount="indefinite"
        />

        <animate
          attributeName="opacity"
          values="0.3;0;0.3"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>

      {/* ================= High Crowd Warning ================= */}

      {station.crowd_level === "High" && (
        <circle
          cx={x}
          cy={y}
          r="36"
          fill="none"
          stroke="#ef4444"
          strokeWidth="2"
          opacity=".45"
        >
          <animate
            attributeName="r"
            values="36;48;36"
            dur="2s"
            repeatCount="indefinite"
          />

          <animate
            attributeName="opacity"
            values=".45;0;.45"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
      )}

      {/* ================= Main Station ================= */}

      <circle
        cx={x}
        cy={y}
        r={selected ? 17 : hovered ? 15 : 13}
        fill={selected ? "#4f46e5" : color}
        stroke="white"
        strokeWidth="4"
      />

      {/* ================= Inner Dot ================= */}

      <circle
        cx={x}
        cy={y}
        r="4"
        fill="white"
      />

      {/* ================= AI Indicator ================= */}
            {/* ================= AI Indicator ================= */}

      <circle
        cx={x + 18}
        cy={y - 18}
        r="6"
        fill={selected ? "#6366f1" : "#3b82f6"}
        stroke="white"
        strokeWidth="2"
      >
        <animate
          attributeName="opacity"
          values="1;.3;1"
          dur="1.5s"
          repeatCount="indefinite"
        />

        <animate
          attributeName="r"
          values="5;7;5"
          dur="1.5s"
          repeatCount="indefinite"
        />
      </circle>

      {/* ================= Station Name ================= */}

      <rect
        x={x - 60}
        y={y + 18}
        width="120"
        height="26"
        rx="13"
        fill={selected ? "#eef2ff" : "white"}
        stroke={selected ? "#6366f1" : "#cbd5e1"}
        strokeWidth={selected ? "2" : "1"}
        filter="drop-shadow(0px 2px 5px rgba(0,0,0,.12))"
      />

      <text
        x={x}
        y={y + 35}
        textAnchor="middle"
        fontSize="11"
        fontWeight="700"
        fill={selected ? "#4338ca" : "#0f172a"}
      >
        {station.station}
      </text>

      {/* ================= Occupancy Badge ================= */}

      <rect
        x={x - 24}
        y={y + 52}
        width="48"
        height="22"
        rx="11"
        fill={selected ? "#4f46e5" : color}
      />

      <text
        x={x}
        y={y + 67}
        textAnchor="middle"
        fontSize="10"
        fontWeight="700"
        fill="white"
      >
        {station.occupancy}%
      </text>

      {/* ================= Selected Badge ================= */}

      {selected && (
        <>
          <rect
            x={x - 42}
            y={y - 62}
            width="84"
            height="22"
            rx="11"
            fill="#4f46e5"
            opacity="0.95"
          />

          <text
            x={x}
            y={y - 47}
            textAnchor="middle"
            fontSize="10"
            fontWeight="700"
            fill="white"
          >
            Selected
          </text>
        </>
      )}

      {/* ================= Live Indicator ================= */}

      <circle
        cx={x - 18}
        cy={y - 18}
        r="4"
        fill="#10b981"
      >
        <animate
          attributeName="opacity"
          values="1;.2;1"
          dur="1.2s"
          repeatCount="indefinite"
        />
      </circle>
    </g>
  );
}

export default MetroStationNode;