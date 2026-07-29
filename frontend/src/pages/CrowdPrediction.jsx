import { useState, useEffect } from "react";
import crowdService from "../services/crowdService";

export default function CrowdPrediction() {
  const [stations, setStations] = useState([]);

  const [formData, setFormData] = useState({
    station_name: "",
    entry_count: "",
    exit_count: "",
    platform_count: "",
    concourse_count: "",
    date: "",
    time: ""
});

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load stations from backend
  useEffect(() => {
    const loadStations = async () => {
      try {
        const response = await crowdService.getStations();
        setStations(response.data);
      } catch (err) {
        console.error("Failed to load stations:", err);
      }
    };

    loadStations();
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
  
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };
  
  const predictCrowd = async () => {
    // Validation
    if (!formData.station_name) {
      alert("Please select a station.");
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
  
    if (
      formData.entry_count < 0 ||
      formData.exit_count < 0 ||
      formData.platform_count < 0 ||
      formData.concourse_count < 0
    ) {
      alert("Counts cannot be negative.");
      return;
    }
  
    // Create Date object
    const selectedDate = new Date(`${formData.date}T${formData.time}`);
  
    // Extract required fields
    const hour = selectedDate.getHours();
    const day = selectedDate.getDate();
    const month = selectedDate.getMonth() + 1;
    const day_of_week = selectedDate.getDay();
    const weekend = day_of_week === 0 || day_of_week === 6 ? 1 : 0;
  
    // Request payload
    const requestData = {
      station_name: formData.station_name,
      entry_count: Number(formData.entry_count),
      exit_count: Number(formData.exit_count),
      platform_count: Number(formData.platform_count),
      concourse_count: Number(formData.concourse_count),
  
      hour,
      day,
      month,
      day_of_week,
      weekend,
    };
  
    setLoading(true);
  
    try {
      const response = await crowdService.predictCrowd(requestData);
      setResult({
        ...response.data,
        station_name: formData.station_name,
        prediction_date: formData.date,
        prediction_time: formData.time,
      });
    } catch (err) {
      console.error(err);
      alert("Prediction failed.");
    } finally {
      setLoading(false);
    }
  };

  const badgeColor = () => {
    if (!result) return "bg-gray-500";
  
    switch (result.predicted_crowd_level) {
      case "Low":
        return "bg-green-500";
  
      case "Medium":
        return "bg-yellow-500 text-black";
  
      case "High":
        return "bg-orange-500";
  
      case "Very High":
        return "bg-red-600";
  
      default:
        return "bg-blue-500";
    }
  };

  return (
    <div className="p-8">

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Crowd Prediction
        </h1>

        <p className="text-slate-400 mt-2">
          Predict crowd level using the AI model.
        </p>
      </div>

      <div className="bg-slate-800 rounded-xl p-6 shadow-lg">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Station */}

          <div>
            <label className="block text-slate-300 mb-2">
              Station
            </label>

            <select
              name="station_name"
              value={formData.station_name}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-slate-700 text-white"
            >
              <option value="">Select Station</option>

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

<Input
  label="Concourse Crowd"
  name="concourse_count"
  value={formData.concourse_count}
  onChange={handleChange}
/>

<input
  type="date"
  name="date"
  value={formData.date}
  onChange={handleChange}
  className="w-full rounded-lg border border-gray-300 p-2"
/>

<input
  type="time"
  name="time"
  value={formData.time}
  onChange={handleChange}
  className="w-full rounded-lg border border-gray-300 p-2"
/>
          </div>

        <button
          onClick={predictCrowd}
          disabled={loading}
          className="mt-8 px-6 py-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-semibold transition"
        >
          {loading ? "Predicting..." : "Predict Crowd"}
        </button>

      </div>

      {result && (
        <div className="mt-8 bg-slate-800 rounded-xl p-6">

          <h2 className="text-white text-xl font-bold mb-4">
            Prediction Result
          </h2>

          <span
            className={`px-4 py-2 rounded-full text-white ${badgeColor()}`}
          >
            {result.predicted_crowd_level}
          </span>

          <p className="mt-6 text-white">
            Confidence:
            <span className="ml-2 text-cyan-400 font-bold">
              {(result.confidence_score * 100).toFixed(2)}%
            </span>
          </p>

          <div className="mt-3 w-full h-3 rounded-full bg-slate-700">

            <div
              className="h-3 rounded-full bg-cyan-500"
              style={{
                width: `${result.confidence_score * 100}%`,
              }}
            />

          </div>

        </div>
      )}

    </div>
  );
}

function Input({ label, name, value, onChange }) {
  return (
    <div>
      <label className="block text-slate-300 mb-2">
        {label}
      </label>

      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-3 rounded-lg bg-slate-700 text-white"
      />
    </div>
  );
}