import {
  AlertTriangle,
  CircleCheck,
} from "lucide-react";

const alerts = [
  {
    type: "warning",
    text: "Blue Line crowd exceeds 85%",
  },
  {
    type: "success",
    text: "Yellow Line recovered from delay",
  },
  {
    type: "warning",
    text: "Rajiv Chowk predicted rush in 15 mins",
  },
];

function LiveAlerts() {
  return (
    <div className="bg-white rounded-3xl shadow-lg border p-6">

      <h2 className="text-xl font-bold mb-5">
        Live Alerts
      </h2>

      <div className="space-y-4">

        {alerts.map((alert, index) => (

          <div
            key={index}
            className="flex gap-3 items-start"
          >

            {alert.type === "warning" ? (
              <AlertTriangle className="text-yellow-500 mt-1" size={18} />
            ) : (
              <CircleCheck className="text-green-500 mt-1" size={18} />
            )}

            <p className="text-sm text-slate-700">
              {alert.text}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}

export default LiveAlerts;