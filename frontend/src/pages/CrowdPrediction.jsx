import { useEffect, useState } from "react";
import crowdService from "../services/crowdService";

export default function CrowdPrediction() {
  const [stations, setStations] = useState([]);
  const [loadingStations, setLoadingStations] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const [formData, setFormData] = useState({
    station_name: "",
    entry_count: "",
    exit_count: "",
    date: "",
    time: "",
  });

  useEffect(() => {
    const loadStations = async () => {
      try {
        const response = await crowdService.getStations();
        setStations(response.data || []);
      } catch (error) {
        console.error("Failed to load stations:", error);
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

  const predictCrowd = async () => {
    if (!formData.station_name) {
      alert("Please select a station.");
      return;
    }

    if (!formData.entry_count || !formData.exit_count) {
      alert("Please enter entry and exit counts.");
      return;
    }

    if (!formData.date) {
      alert("Please select a date.");
      return;
    }

    if (!formData.time) {
      alert("Please select a time.");
      return;
    }

    const entryCount = Number(formData.entry_count);
    const exitCount = Number(formData.exit_count);

    if (
      !Number.isFinite(entryCount) ||
      !Number.isFinite(exitCount)
    ) {
      alert("Please enter valid passenger counts.");
      return;
    }

    if (entryCount < 0 || exitCount < 0) {
      alert("Passenger counts cannot be negative.");
      return;
    }

    const selectedDate = new Date(
      `${formData.date}T${formData.time}`
    );

    if (Number.isNaN(selectedDate.getTime())) {
      alert("Invalid date or time.");
      return;
    }

    const hour = selectedDate.getHours();
    const day = selectedDate.getDate();
    const month = selectedDate.getMonth() + 1;

    const jsDay = selectedDate.getDay();

    const dayOfWeek =
      jsDay === 0
        ? 6
        : jsDay - 1;

    const weekend =
      dayOfWeek === 5 ||
      dayOfWeek === 6
        ? 1
        : 0;

    const requestData = {
      station_name: formData.station_name,
      entry_count: entryCount,
      exit_count: exitCount,
      hour: hour,
      day: day,
      month: month,
      day_of_week: dayOfWeek,
      weekend: weekend,
    };

    console.log(
      "Crowd prediction request:",
      requestData
    );

    setLoading(true);
    setResult(null);

    try {
      const response =
        await crowdService.predictCrowd(
          requestData
        );

      console.log(
        "Crowd prediction response:",
        response.data
      );

      setResult({
        ...response.data,
        station_name:
          formData.station_name,
        prediction_date:
          formData.date,
        prediction_time_input:
          formData.time,
      });

    } catch (error) {
      console.error(
        "Crowd prediction failed:",
        error.response?.data || error
      );

      const detail =
        error.response?.data?.detail;

      let message =
        "Crowd prediction failed.";

      if (typeof detail === "string") {
        message = detail;
      } else if (Array.isArray(detail)) {
        message =
          detail
            .map(
              (item) =>
                item.msg || "Invalid input"
            )
            .join("\n");
      }

      alert(message);

    } finally {
      setLoading(false);
    }
  };

  const getBadgeClass = (level) => {
    switch (
      String(level).toUpperCase()
    ) {
      case "LOW":
        return "bg-green-500";

      case "MEDIUM":
        return "bg-yellow-500 text-black";

      case "HIGH":
        return "bg-orange-500";

      case "VERY HIGH":
      case "VERY_HIGH":
        return "bg-red-600";

      default:
        return "bg-slate-500";
    }
  };

  const formatCrowdLevel = (level) => {
    if (!level) {
      return "Unknown";
    }

    return String(level)
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
  };

  const confidence =
    result?.confidence_score !== null &&
    result?.confidence_score !== undefined
      ? Number(result.confidence_score)
      : null;

  return (
    <div className="p-8">

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Crowd Prediction
        </h1>

        <p className="text-slate-400 mt-2">
          Predict station crowd level using
          the trained AI model.
        </p>
      </div>

      <div className="bg-slate-800 rounded-xl p-6 shadow-lg">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <div>
            <label className="block text-slate-300 mb-2">
              Station
            </label>

            <select
              name="station_name"
              value={formData.station_name}
              onChange={handleChange}
              disabled={loadingStations}
              className="w-full p-3 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
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

          <Input
            label="Entry Count"
            name="entry_count"
            value={formData.entry_count}
            onChange={handleChange}
          />

          <Input
            label="Exit Count"
            name="exit_count"
            value={formData.exit_count}
            onChange={handleChange}
          />

          <div>
            <label className="block text-slate-300 mb-2">
              Date
            </label>

            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-2">
              Time
            </label>

            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

        </div>

        <button
          onClick={predictCrowd}
          disabled={loading}
          className="mt-8 px-6 py-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-600 text-white font-semibold transition"
        >
          {loading
            ? "Predicting..."
            : "Predict Crowd"}
        </button>

      </div>

      {result && (
        <div className="mt-8 bg-slate-800 rounded-xl p-6 shadow-lg">

          <h2 className="text-white text-xl font-bold mb-6">
            Prediction Result
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <p className="text-slate-400 text-sm">
                Station
              </p>

              <p className="text-white text-lg font-semibold mt-1">
                {result.station_name}
              </p>
            </div>

            <div>
              <p className="text-slate-400 text-sm">
                Crowd Level
              </p>

              <span
                className={`inline-block mt-2 px-5 py-2 rounded-full text-white font-semibold ${getBadgeClass(
                  result.predicted_crowd_level
                )}`}
              >
                {formatCrowdLevel(
                  result.predicted_crowd_level
                )}
              </span>
            </div>

            <div>
              <p className="text-slate-400 text-sm">
                Predicted Entries
              </p>

              <p className="text-cyan-400 text-2xl font-bold mt-1">
                {result.predicted_entries ??
                  "-"}
              </p>
            </div>

            <div>
              <p className="text-slate-400 text-sm">
                Predicted Exits
              </p>

              <p className="text-cyan-400 text-2xl font-bold mt-1">
                {result.predicted_exits ??
                  "-"}
              </p>
            </div>

            <div>
              <p className="text-slate-400 text-sm">
                Prediction Date
              </p>

              <p className="text-white mt-1">
                {result.prediction_date}
              </p>
            </div>

            <div>
              <p className="text-slate-400 text-sm">
                Prediction Time
              </p>

              <p className="text-white mt-1">
                {result.prediction_time_input}
              </p>
            </div>

            <div>
              <p className="text-slate-400 text-sm">
                Prediction ID
              </p>

              <p className="text-cyan-400 mt-1 font-mono">
                {result.id || "-"}
              </p>
            </div>

            <div>
              <p className="text-slate-400 text-sm">
                Station ID
              </p>

              <p className="text-white mt-1">
                {result.station_id ?? "-"}
              </p>
            </div>

          </div>

          {confidence !== null && (
            <div className="mt-8">

              <div className="flex justify-between mb-2">

                <span className="text-slate-300">
                  Confidence
                </span>

                <span className="text-cyan-400 font-bold">
                  {(
                    confidence * 100
                  ).toFixed(2)}
                  %
                </span>

              </div>

              <div className="w-full h-3 rounded-full bg-slate-700">

                <div
                  className="h-3 rounded-full bg-cyan-500 transition-all"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(
                        0,
                        confidence * 100
                      )
                    )}%`,
                  }}
                />

              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}

function Input({
  label,
  name,
  value,
  onChange,
}) {
  return (
    <div>
      <label className="block text-slate-300 mb-2">
        {label}
      </label>

      <input
        type="number"
        min="0"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-3 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
      />
    </div>
  );
}