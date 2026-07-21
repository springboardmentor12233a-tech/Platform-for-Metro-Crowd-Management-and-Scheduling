import {
  X,
  MapPin,
  Clock,
  Users,
  Bot,
} from "lucide-react";

function IncidentDrawer({
  incident,
  onClose,
}) {
  if (!incident) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-end">

      <div className="bg-white w-[500px] h-full shadow-2xl overflow-y-auto">

        <div className="flex justify-between items-center p-6 border-b">

          <h2 className="text-2xl font-bold">
            Incident Details
          </h2>

          <button onClick={onClose}>

            <X />

          </button>

        </div>

        <div className="p-6 space-y-6">

          <h3 className="text-3xl font-bold">
            {incident.title}
          </h3>

          <div className="space-y-4">

            <div className="flex gap-3">

              <MapPin />

              {incident.station}

            </div>

            <div className="flex gap-3">

              <Clock />

              {incident.reported}

            </div>

            <div className="flex gap-3">

              <Users />

              {incident.passengers}

            </div>

          </div>

          <div className="bg-indigo-50 rounded-xl p-5">

            <div className="flex gap-3">

              <Bot />

              <div>

                <h4 className="font-semibold">

                  AI Recommendation

                </h4>

                <p className="mt-2">

                  {incident.recommendation}

                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default IncidentDrawer;