function PredictionBadge({ station, x, y }) {
  const current = station.occupancy;

  // Simple heuristic prediction
  const predicted = Math.min(
    100,
    Math.round(current + Math.random() * 15)
  );

  let risk = "LOW";
  let color = "#22c55e";

  if (predicted > 80) {
    risk = "HIGH";
    color = "#ef4444";
  } else if (predicted > 60) {
    risk = "MEDIUM";
    color = "#f59e0b";
  }

  return (
    <g>
      <rect
        x={x + 18}
        y={y - 60}
        width="105"
        height="42"
        rx="10"
        fill="white"
        stroke={color}
        strokeWidth="2"
      />

      <text
        x={x + 70}
        y={y - 42}
        textAnchor="middle"
        fontSize="11"
        fontWeight="700"
        fill={color}
      >
        AI +{predicted - current}%
      </text>

      <text
        x={x + 70}
        y={y - 27}
        textAnchor="middle"
        fontSize="10"
        fill="#475569"
      >
        {risk}
      </text>
    </g>
  );
}

export default PredictionBadge;