import { useEffect, useState } from "react";

import MetricCard from "../components/MetricCard";
import RecommendationCard from "../components/RecommendationCard";

import frequencyAdjustmentService from "../services/frequencyAdjustmentService";

export default function FrequencyAdjustment() {
  const [stations, setStations] = useState([]);
  const [loadingStations, setLoadingStations] = useState(true);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    station_name: "",
    current_frequency: "",
  });

  const [result, setResult] = useState(null);

  useEffect(() => {
    const loadStations = async () => {
      try {
        const response =
          await frequencyAdjustmentService.getStations();

        setStations(response.data || []);
      } catch (error) {
        console.error(
          "Failed to load stations:",
          error.response?.data || error
        );
      } finally {
        setLoadingStations(false);
      }
    };

    loadStations();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePredict = async () => {
    if (!formData.station_name) {
      alert("Please select a station.");
      return;
    }

    if (
      formData.current_frequency === "" ||
      formData.current_frequency === null
    ) {
      alert("Please enter the current frequency.");
      return;
    }

    const currentFrequency = Number(
      formData.current_frequency
    );

    if (!Number.isFinite(currentFrequency)) {
      alert("Please enter a valid frequency.");
      return;
    }

    if (currentFrequency <= 0) {
      alert("Frequency must be greater than 0.");
      return;
    }

    const payload = {
      station_name: formData.station_name,
      current_frequency: currentFrequency,
    };

    console.log(
      "Frequency adjustment request:",
      payload
    );

    setLoading(true);
    setResult(null);

    try {
      const response =
        await frequencyAdjustmentService.recommendFrequency(
          payload
        );

      console.log(
        "Frequency adjustment response:",
        response.data
      );

      setResult(response.data);
    } catch (error) {
      console.error(
        "Frequency adjustment failed:",
        error.response?.data || error
      );

      const detail =
        error.response?.data?.detail;

      let message =
        "Frequency adjustment failed.";

      if (typeof detail === "string") {
        message = detail;
      } else if (Array.isArray(detail)) {
        message = detail
          .map((item) => item.msg)
          .join(", ");
      }

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (action) => {
    switch (
      String(action || "").toLowerCase()
    ) {
      case "increase":
        return "green";

      case "decrease":
        return "orange";

      case "maintain":
        return "blue";

      default:
        return "purple";
    }
  };

  const getPriorityColor = (priority) => {
    switch (
      String(priority || "").toLowerCase()
    ) {
      case "critical":
        return "red";

      case "high":
        return "orange";

      case "medium":
        return "yellow";

      case "low":
        return "green";

      default:
        return "blue";
    }
  };

  const getValue = (value) => {
    if (
      value === undefined ||
      value === null ||
      value === ""
    ) {
      return "-";
    }

    return value;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            🚇 Metro Frequency Adjustment
          </h1>

          <p className="text-gray-600 mt-2">
            Get an AI-based train frequency
            recommendation using the latest
            station occupancy data.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">

          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Frequency Adjustment Input
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Station
              </label>

              <select
                name="station_name"
                value={formData.station_name}
                onChange={handleChange}
                disabled={loadingStations}
                className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="">
                  {loadingStations
                    ? "Loading stations..."
                    : "Select Station"}
                </option>

                {stations.map((station) => (
                  <option
                    key={station.id}
                    value={station.station_name}
                  >
                    {station.station_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Current Frequency
              </label>

              <input
                type="number"
                name="current_frequency"
                min="1"
                step="1"
                value={formData.current_frequency}
                onChange={handleChange}
                placeholder="e.g. 8"
                className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />

              <p className="text-sm text-gray-500 mt-2">
                Time between trains, in minutes.
              </p>
            </div>

          </div>

          <button
            onClick={handlePredict}
            disabled={
              loading ||
              loadingStations
            }
            className="mt-8 px-6 py-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-400 text-white font-semibold transition"
          >
            {loading
              ? "Analyzing..."
              : "Recommend Frequency"}
          </button>

        </div>

        {result && (
          <div className="mt-10">

            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              AI Recommendation
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              <MetricCard
                title="Frequency Action"
                value={getValue(
                  result.frequency_action
                )}
                color={getActionColor(
                  result.frequency_action
                )}
              />

              <MetricCard
                title="Current Frequency"
                value={`${getValue(
                  result.current_frequency
                )} min`}
                color="purple"
              />

              <MetricCard
                title="Recommended Frequency"
                value={`${getValue(
                  result.recommended_frequency
                )} min`}
                color="green"
              />

              <MetricCard
                title="Occupancy"
                value={getValue(
                  result.occupancy
                )}
                color="blue"
              />

              <MetricCard
                title="Capacity"
                value={getValue(
                  result.capacity
                )}
                color="indigo"
              />

              <MetricCard
                title="Occupancy Percentage"
                value={`${getValue(
                  result.occupancy_percentage
                )}%`}
                color="yellow"
              />

              <MetricCard
                title="Additional Trains"
                value={getValue(
                  result.additional_trains_required
                )}
                color="orange"
              />

              <MetricCard
                title="Priority"
                value={getValue(
                  result.priority
                )}
                color={getPriorityColor(
                  result.priority
                )}
              />

              <MetricCard
                title="Action Required"
                value={
                  result.action_required
                    ? "Yes"
                    : "No"
                }
                color={
                  result.action_required
                    ? "red"
                    : "green"
                }
              />

            </div>

            <div className="mt-8">
              <RecommendationCard
                result={result}
              />
            </div>

            <div className="mt-6 bg-white rounded-xl shadow-md p-6">

              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Estimated Wait-Time Impact
              </h3>

              <p className="text-gray-700">
                {getValue(
                  result.estimated_wait_time_impact
                )}
              </p>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}