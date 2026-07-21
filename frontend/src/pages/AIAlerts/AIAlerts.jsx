import { useEffect, useState } from "react";
import { getAlerts } from "../../api/alert";

export default function AIAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAlerts();
  }, []);

  async function loadAlerts() {
    try {
      const data = await getAlerts();
      setAlerts(data);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  const critical = alerts.filter((a) =>
    a.severity.includes("Critical")
  ).length;

  const warning = alerts.filter((a) =>
    a.severity.includes("Warning")
  ).length;

  const normal = alerts.filter((a) =>
    a.severity.includes("Normal")
  ).length;

  return (
    <div className="min-h-screen bg-slate-100 p-8">

      <h1 className="text-4xl font-bold mb-8">
        🚨 AI Alert Center
      </h1>

      {/* Statistics */}

      <div className="grid lg:grid-cols-3 gap-6 mb-8">

        <div className="bg-red-500 text-white rounded-2xl p-6 shadow-lg">
          <p>Critical Alerts</p>
          <h2 className="text-5xl font-bold mt-3">
            {critical}
          </h2>
        </div>

        <div className="bg-yellow-500 text-white rounded-2xl p-6 shadow-lg">
          <p>Warning Alerts</p>
          <h2 className="text-5xl font-bold mt-3">
            {warning}
          </h2>
        </div>

        <div className="bg-green-500 text-white rounded-2xl p-6 shadow-lg">
          <p>Normal Alerts</p>
          <h2 className="text-5xl font-bold mt-3">
            {normal}
          </h2>
        </div>

      </div>

      {/* Alert Cards */}

      {loading ? (

        <h2 className="text-xl">
          Loading Alerts...
        </h2>

      ) : (

        <div className="grid gap-6">

          {alerts.map((alert, index) => (

            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-6"
            >

              <div className="flex justify-between items-center">

                <h2 className="text-2xl font-bold">

                  {alert.station}

                </h2>

                <span className="text-xl">
                  {alert.severity}
                </span>

              </div>

              <div className="grid md:grid-cols-3 gap-5 mt-5">

                <div>

                  <p className="text-gray-500">
                    Predicted Passengers
                  </p>

                  <h3 className="text-3xl font-bold">

                    {alert.predicted_passengers}

                  </h3>

                </div>

                <div>

                  <p className="text-gray-500">
                    Recommendation
                  </p>

                  <p className="font-medium">

                    {alert.recommendation}

                  </p>

                </div>

                <div>

                  <p className="text-gray-500">
                    Time
                  </p>

                  <p>

                    {new Date(
                      alert.created_at
                    ).toLocaleString()}

                  </p>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}