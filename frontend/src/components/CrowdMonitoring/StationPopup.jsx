import { X } from "lucide-react";

function StationPopup({ station, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">

      <div className="bg-white rounded-3xl w-[430px] shadow-2xl p-8 relative">

        <button
          onClick={onClose}
          className="absolute right-5 top-5"
        >
          <X />
        </button>

        <h2 className="text-3xl font-bold mb-5">
          {station.station}
        </h2>

        <div className="space-y-4">

          <div className="flex justify-between">
            <span>Occupancy</span>
            <strong>{station.occupancy}%</strong>
          </div>

          <div className="flex justify-between">
            <span>Crowd Level</span>
            <strong>{station.crowd_level}</strong>
          </div>

          <div className="flex justify-between">
            <span>Passengers</span>
            <strong>{station.passengers}</strong>
          </div>

          <div className="flex justify-between">
            <span>Prediction</span>
            <strong>{station.ai_prediction}</strong>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-indigo-50 border border-indigo-200">

            <h4 className="font-bold mb-2">
              AI Recommendation
            </h4>

            <p className="text-sm">
              {station.recommendation}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default StationPopup;