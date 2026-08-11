export default function MetroMap() {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 mb-8">

      <h2 className="text-xl font-bold mb-6">
        Metro Route Map
      </h2>

      <div className="flex justify-center">

        <svg
          width="900"
          height="420"
          viewBox="0 0 900 420"
          className="w-full h-auto"
        >

          {/* Blue Line */}
          <line
            x1="80"
            y1="120"
            x2="820"
            y2="120"
            stroke="#3b82f6"
            strokeWidth="8"
          />

          {/* Yellow Line */}
          <line
            x1="260"
            y1="40"
            x2="260"
            y2="360"
            stroke="#eab308"
            strokeWidth="8"
          />

          {/* Red Line */}
          <line
            x1="80"
            y1="320"
            x2="820"
            y2="320"
            stroke="#ef4444"
            strokeWidth="8"
          />

          {/* Green Line */}
          <line
            x1="620"
            y1="40"
            x2="620"
            y2="360"
            stroke="#22c55e"
            strokeWidth="8"
          />

          {/* Stations */}

          {[
            [80,120],[170,120],[260,120],[350,120],[440,120],[530,120],[620,120],[710,120],[820,120],
            [260,40],[260,200],[260,320],
            [620,40],[620,200],[620,320],
            [80,320],[170,320],[350,320],[440,320],[530,320],[710,320],[820,320]
          ].map(([x,y],i)=>(
            <circle
              key={i}
              cx={x}
              cy={y}
              r="8"
              fill="white"
            />
          ))}

        </svg>

      </div>

    </div>
  );
}