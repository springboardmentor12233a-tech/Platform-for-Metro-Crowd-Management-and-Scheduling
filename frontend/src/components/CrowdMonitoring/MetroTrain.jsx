function MetroTrain({ stations, positions, color }) {
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
      {/* Train Body */}
      <rect
        x="-10"
        y="-6"
        width="20"
        height="12"
        rx="4"
        fill={color}
        stroke="white"
        strokeWidth="2"
      >
        <animateMotion
          dur="10s"
          repeatCount="indefinite"
          rotate="auto"
          path={path}
        />
      </rect>

      {/* Front Light */}
      <circle
        cx="8"
        cy="0"
        r="2"
        fill="white"
      >
        <animateMotion
          dur="10s"
          repeatCount="indefinite"
          rotate="auto"
          path={path}
        />
      </circle>
    </g>
  );
}

export default MetroTrain;