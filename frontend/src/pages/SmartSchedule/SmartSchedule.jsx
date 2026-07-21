import { useState, useEffect } from "react";
import { getScheduleRecommendation } from "../../api/schedule";

export default function SmartSchedule() {
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(false);

  const predictedPassengers = Number(
    localStorage.getItem("predictedPassengers") || 0
  );

  const station =
    localStorage.getItem("predictionStation") || "Not Available";

  const destination =
    localStorage.getItem("predictionDestination") || "Not Available";

  const predictionTime =
    localStorage.getItem("predictionTime") || "Not Available";

  useEffect(() => {
    if (predictedPassengers > 0) {
      generateSchedule();
    }
  }, []);

  async function generateSchedule() {
    setLoading(true);

    try {
      const result = await getScheduleRecommendation(
        predictedPassengers
      );

      setSchedule(result);
    } catch (error) {
      console.error(error);
      alert("Unable to generate AI schedule.");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8">

      <h1 className="text-4xl font-bold text-slate-800 mb-8">
        🚆 Smart Train Scheduling
      </h1>

      {predictedPassengers === 0 ? (

        <div className="bg-yellow-100 border border-yellow-300 rounded-2xl p-8">

          <h2 className="text-2xl font-bold">
            No Prediction Found
          </h2>

          <p className="mt-3 text-lg">
            Please generate a passenger prediction first.
          </p>

        </div>

      ) : (

        <>
          {/* Prediction Summary */}

          <div className="grid lg:grid-cols-4 gap-6 mb-8">

            <div className="bg-white rounded-2xl shadow-lg p-6">

              <p className="text-gray-500">
                Predicted Passengers
              </p>

              <h2 className="text-5xl font-bold text-indigo-600 mt-3">
                {predictedPassengers}
              </h2>

            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">

              <p className="text-gray-500">
                From Station
              </p>

              <h2 className="text-xl font-bold mt-3">
                {station}
              </h2>

            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">

              <p className="text-gray-500">
                Destination
              </p>

              <h2 className="text-xl font-bold mt-3">
                {destination}
              </h2>

            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">

              <p className="text-gray-500">
                Prediction Time
              </p>

              <h2 className="text-lg font-semibold mt-3">
                {predictionTime}
              </h2>

            </div>

          </div>

          {/* Generate Button */}

          <button
            onClick={generateSchedule}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-semibold transition"
          >
            {loading
              ? "Generating..."
              : "Generate AI Schedule"}
          </button>

          {/* AI Result */}

          {schedule && (

            <div className="mt-10">

              <h2 className="text-3xl font-bold mb-6">
                🤖 AI Scheduling Recommendation
              </h2>

              <div className="grid lg:grid-cols-3 gap-6">

                <div className="bg-white rounded-2xl shadow-lg p-6">

                  <p className="text-gray-500">
                    Crowd Level
                  </p>

                  <h2 className="text-3xl font-bold mt-3">
                    {schedule.crowd_level}
                  </h2>

                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">

                  <p className="text-gray-500">
                    Train Frequency
                  </p>

                  <h2 className="text-3xl font-bold mt-3">
                    {schedule.train_frequency}
                  </h2>

                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">

                  <p className="text-gray-500">
                    Extra Trains
                  </p>

                  <h2 className="text-5xl font-bold mt-3">
                    {schedule.extra_trains}
                  </h2>

                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">

                  <p className="text-gray-500">
                    Platform Staff
                  </p>

                  <h2 className="text-5xl font-bold mt-3">
                    {schedule.platform_staff}
                  </h2>

                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">

                  <p className="text-gray-500">
                    Operational Status
                  </p>

                  <h2 className="text-2xl font-bold mt-3">
                    {schedule.status}
                  </h2>

                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">

                  <p className="text-gray-500">
                    AI Recommendation
                  </p>

                  <p className="text-lg mt-3 leading-7">
                    {schedule.recommendation}
                  </p>

                </div>

              </div>

            </div>

          )}

        </>

      )}

    </div>
  );
}