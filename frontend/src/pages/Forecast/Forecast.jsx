import { useState } from "react";
import { getForecast } from "../../api/forecast";

export default function Forecast() {
  const [station, setStation] = useState("");
  const [date, setDate] = useState("");
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleForecast = async () => {
    if (!station || !date) {
      alert("Please enter station and date.");
      return;
    }

    setLoading(true);

    try {
      const result = await getForecast({
        station: station,
        forecast_date: date,
      });

      setForecast(result);
    } catch (error) {
      console.error(error);
      alert("Forecast failed.");
    }

    setLoading(false);
  };

  const getCrowdLevel = () => {
    if (!forecast) return "";

    const passengers = forecast.predicted_passengers;

    if (passengers < 10) return "🟢 Low";

    if (passengers < 20) return "🟡 Medium";

    return "🔴 High";
  };

  const getRecommendation = () => {
    if (!forecast) return "";

    const passengers = forecast.predicted_passengers;

    if (passengers < 10)
      return "Normal operations. No additional trains required.";

    if (passengers < 20)
      return "Monitor crowd. Keep current schedule.";

    return "Increase train frequency and deploy additional staff.";
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">

      <h1 className="text-4xl font-bold mb-8">
        📈 Passenger Forecasting
      </h1>

      <div className="grid lg:grid-cols-2 gap-8">

        {/* Forecast Form */}

        <div className="bg-white rounded-2xl shadow-lg p-8">

          <h2 className="text-2xl font-semibold mb-6">
            Forecast Details
          </h2>

          <div className="space-y-5">

            <input
              type="text"
              placeholder="Station Name"
              value={station}
              onChange={(e) => setStation(e.target.value)}
              className="w-full border rounded-xl p-3"
            />

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border rounded-xl p-3"
            />

            <button
              onClick={handleForecast}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl text-lg font-semibold transition"
            >
              {loading ? "Forecasting..." : "Generate Forecast"}
            </button>

          </div>

        </div>

        {/* Result */}

        <div className="space-y-6">

          <div className="bg-white rounded-2xl shadow-lg p-6">

            <h2 className="text-2xl font-semibold mb-6">
              Forecast Result
            </h2>

            <div className="grid gap-5">

              <div className="bg-indigo-50 rounded-xl p-5">

                <p className="text-gray-500">
                  Expected Passengers
                </p>

                <h2 className="text-5xl font-bold text-indigo-600 mt-2">
                  {forecast ? Math.round(forecast.predicted_passengers) : "--"}
                </h2>

              </div>

              <div className="bg-green-50 rounded-xl p-5">

                <p className="text-gray-500">
                  Crowd Level
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {forecast ? getCrowdLevel() : "--"}
                </h2>

              </div>

              <div className="bg-yellow-50 rounded-xl p-5">

                <p className="text-gray-500">
                  AI Recommendation
                </p>

                <p className="text-lg mt-2">
                  {forecast
                    ? getRecommendation()
                    : "Forecast not generated"}
                </p>

              </div>

            </div>

          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">

            <h2 className="text-xl font-semibold mb-3">
              AI Insight
            </h2>

            <p className="text-gray-600 leading-7">

              MetroVision Forecasting estimates future passenger demand using a
              Machine Learning model trained on historical metro travel
              patterns. These forecasts help metro authorities optimize train
              scheduling, reduce congestion, and improve passenger experience.

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}