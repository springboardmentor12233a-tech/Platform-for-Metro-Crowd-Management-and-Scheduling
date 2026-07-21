import StationPulse from "./StationPulse";

function MetroStation({ station, selected = false }) {
  const colors = {
    normal: "bg-green-500",
    busy: "bg-yellow-500",
    crowded: "bg-red-500",
  };

  return (
    <div
      className="absolute group"
      style={{
        left: station.x,
        top: station.y,
      }}
    >
      <div className="relative">
        {/* Existing Status Pulse */}
        <StationPulse status={station.status} />

        {/* Selected Station Glow */}
        {selected && (
          <div className="absolute inset-0 rounded-full bg-blue-500 opacity-30 animate-ping scale-[2.2]" />
        )}

        {/* Station Marker */}
        <div
          className={`
            relative
            w-5
            h-5
            rounded-full
            border-4
            border-white
            shadow-xl
            transition-all
            duration-500
            ${colors[station.status]}
            ${
              selected
                ? "scale-150 ring-4 ring-blue-400 shadow-blue-400/70 shadow-2xl z-20"
                : "hover:scale-110"
            }
          `}
        />

        {/* Selected Badge */}
        {selected && (
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white shadow-lg">
            Selected
          </div>
        )}
      </div>

      {/* Tooltip */}
      <div className="absolute left-6 -top-4 bg-slate-900 text-white rounded-lg px-3 py-2 text-xs opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-30">
        <strong>{station.name}</strong>

        <br />

        {station.line} Line

        <br />

        Status: {station.status}

        {selected && (
          <>
            <br />
            <span className="font-semibold text-blue-300">
              Currently Selected
            </span>
          </>
        )}
      </div>
    </div>
  );
}

export default MetroStation;