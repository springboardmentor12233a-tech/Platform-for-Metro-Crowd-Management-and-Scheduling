function MetroLine({ stations, positions, color }) {
  const points = stations
    .map((station) => positions[station])
    .filter(Boolean);

  if (points.length < 2) return null;

  const path = points
    .map((point, index) =>
      `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`
    )
    .join(" ");

  return (
    <g>
      {/* Soft Shadow */}
      <path
        d={path}
        fill="none"
        stroke="#d1d5db"
        strokeWidth="18"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.4"
      />

      {/* Colored Metro Line */}
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* White Center */}
      <path
        d={path}
        fill="none"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.95"
      />

      {/* Animated Passenger Flow */}
      <path
        d={path}
        fill="none"
        stroke="rgba(255,255,255,.9)"
        strokeWidth="3"
        strokeDasharray="18 18"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="36"
          to="0"
          dur="1.4s"
          repeatCount="indefinite"
        />
      </path>
    </g>
  );
}

export default MetroLine;