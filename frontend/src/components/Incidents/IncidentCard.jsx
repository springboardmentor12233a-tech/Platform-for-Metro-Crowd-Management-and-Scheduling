import {
  MapPin,
  Clock,
  Users,
  Bot,
  ArrowRight,
} from "lucide-react";

import SeverityBadge from "./SeverityBadge";

function IncidentCard({ incident, onClick }) {
  const statusColors = {
    Active: "bg-red-100 text-red-700",
    Monitoring: "bg-yellow-100 text-yellow-700",
    Resolved: "bg-green-100 text-green-700",
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl border border-slate-200 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              {incident.title}
            </h3>

            <p className="text-slate-500 mt-1">
              {incident.line}
            </p>
          </div>

          <SeverityBadge severity={incident.severity} />
        </div>
      </div>

      {/* Information */}
      <div className="p-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <MapPin className="text-indigo-600" size={18} />
            <span>{incident.station}</span>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="text-indigo-600" size={18} />
            <span>{incident.reported}</span>
          </div>

          <div className="flex items-center gap-3">
            <Users className="text-indigo-600" size={18} />
            <span>{incident.passengers} passengers</span>
          </div>

          <div>
            <span className="font-medium mr-2">
              Status:
            </span>

            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                statusColors[incident.status]
              }`}
            >
              {incident.status}
            </span>
          </div>
        </div>

        {/* AI Recommendation */}
        <div className="mt-6 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl p-5">
          <div className="flex gap-3 items-start">
            <div className="bg-indigo-100 rounded-full p-2">
              <Bot
                className="text-indigo-600"
                size={20}
              />
            </div>

            <div className="flex-1">
              <h4 className="font-semibold text-slate-900">
                AI Recommendation
              </h4>

              <p className="text-sm text-slate-700 mt-2 leading-relaxed">
                {incident.recommendation}
              </p>

              <div className="mt-4 flex flex-wrap justify-between items-center gap-3">
                <span className="text-sm font-medium text-slate-600">
                  Estimated Resolution:{" "}
                  <span className="text-indigo-700">
                    {incident.eta}
                  </span>
                </span>

                <button
                  type="button"
                  className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                >
                  View Details

                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IncidentCard;