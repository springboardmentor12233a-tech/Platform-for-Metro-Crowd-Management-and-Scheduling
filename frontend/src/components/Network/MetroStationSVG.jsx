const colors = {
  normal: "#22c55e",
  busy: "#eab308",
  crowded: "#ef4444",
};

function MetroStationSVG({ station }) {
  return (
    <g>

      <circle
        cx={station.x}
        cy={station.y}
        r="10"
        fill={colors[station.status]}
        stroke="white"
        strokeWidth="4"
      />

      <text
        x={station.x}
        y={station.y + 30}
        textAnchor="middle"
        fontSize="12"
      >
        {station.name}
      </text>

    </g>
  );
}

export default MetroStationSVG;