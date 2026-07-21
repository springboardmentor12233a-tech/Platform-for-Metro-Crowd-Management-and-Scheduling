function PassengerFlow({
  stations,
  positions,
  color,
  duration = 8,
}) {
  const points = stations
    .map((station) => positions[station])
    .filter(Boolean);

  if (points.length < 2) return null;

  const path = points
    .map(
      (point, index) =>
        `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`
    )
    .join(" ");

  return (
    <>
      {[0, 2, 4].map((delay, index) => (
        <circle
          key={index}
          r="4"
          fill={color}
          opacity="0.9"
        >
          <animateMotion
            dur={`${duration}s`}
            begin={`${delay}s`}
            repeatCount="indefinite"
            rotate="auto"
            path={path}
          />

          <animate
            attributeName="r"
            values="3;5;3"
            dur="1.2s"
            repeatCount="indefinite"
          />

          <animate
            attributeName="opacity"
            values="1;.4;1"
            dur="1.2s"
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </>
  );
}

export default PassengerFlow;