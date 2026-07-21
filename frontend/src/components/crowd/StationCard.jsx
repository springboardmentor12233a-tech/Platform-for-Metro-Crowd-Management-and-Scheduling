import {
  MdDirectionsSubway,
  MdPeople,
  MdAccessTime,
} from "react-icons/md";

export default function StationCard({ station }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "Critical":
        return "bg-red-500";
      case "Busy":
        return "bg-orange-500";
      case "Normal":
        return "bg-green-500";
      default:
        return "bg-slate-500";
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MdDirectionsSubway className="text-3xl text-indigo-600" />

          <div>
            <h2 className="text-xl font-bold">
              {station.station_name}
            </h2>

            <p className="text-sm text-slate-500">
              Metro Station
            </p>
          </div>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-white text-sm ${getStatusColor(
            station.status
          )}`}
        >
          {station.status}
        </span>
      </div>

      <div className="mt-6">
        <div className="flex justify-between mb-2">
          <span>Occupancy</span>
          <span>{station.occupancy}%</span>
        </div>

        <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${getStatusColor(station.status)}`}
            style={{ width: `${station.occupancy}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-slate-50 rounded-xl p-4">
          <div className="flex items-center gap-2 text-slate-500">
            <MdPeople />
            Passengers
          </div>

          <p className="text-2xl font-bold mt-2">
            {station.passengers}
          </p>
        </div>

        <div className="bg-slate-50 rounded-xl p-4">
          <div className="flex items-center gap-2 text-slate-500">
            <MdAccessTime />
            Updated
          </div>

          <p className="font-semibold mt-2">
            {station.last_updated}
          </p>
        </div>
      </div>
    </div>
  );
}