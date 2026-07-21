import { TrainFront } from "lucide-react";

function TrainMarker({ train }) {
  return (
    <div
      className="absolute transition-all duration-1000 ease-linear"
      style={{
        left: train.x,
        top: train.y,
      }}
    >
      <div className="relative">

        <div className="bg-indigo-600 text-white rounded-full p-2 shadow-xl animate-pulse">

          <TrainFront size={16} />

        </div>

        <div className="absolute left-9 -top-1 bg-white rounded-lg shadow px-2 py-1 text-xs whitespace-nowrap">

          {train.speed}

        </div>

      </div>

    </div>
  );
}

export default TrainMarker;