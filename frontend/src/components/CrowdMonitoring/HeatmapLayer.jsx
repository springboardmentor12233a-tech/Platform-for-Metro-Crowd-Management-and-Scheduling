function HeatmapLayer({ stations, positions }) {
  return (
    <>
      {stations.map((station) => {
        const pos = positions[station.station];

        if (!pos) return null;

        let color = "#22c55e";
        let radius = 45;
        let opacity = 0.18;

        switch (station.crowd_level) {
          case "High":
            color = "#ef4444";
            radius = 90;
            opacity = 0.35;
            break;

          case "Medium":
            color = "#f59e0b";
            radius = 70;
            opacity = 0.28;
            break;

          default:
            color = "#22c55e";
            radius = 50;
            opacity = 0.18;
        }

        return (
          <circle
            key={station.station}
            cx={pos.x}
            cy={pos.y}
            r={radius}
            fill={color}
            opacity={opacity}
          >
            <animate
              attributeName="r"
              values={`${radius};${radius + 15};${radius}`}
              dur="3s"
              repeatCount="indefinite"
            />

            <animate
              attributeName="opacity"
              values={`${opacity};0.05;${opacity}`}
              dur="3s"
              repeatCount="indefinite"
            />
          </circle>
        );
      })}
    </>
  );
}

export default HeatmapLayer;