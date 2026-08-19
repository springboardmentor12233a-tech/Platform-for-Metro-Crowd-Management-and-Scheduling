"use client";
import { useState } from "react";

export default function PredictPage() {
  const [passengerCount, setPassengerCount] = useState("");
  const [occupancyPercent, setOccupancyPercent] = useState("");
  const [isHoliday, setIsHoliday] = useState("0");
  const [peakHour, setPeakHour] = useState("0");
  const [weather, setWeather] = useState("clear");
  const [station, setStation] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handlePredict = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    try {
      const res = await fetch(
        `http://localhost:8000/predict-crowd?passenger_count=${passengerCount}&occupancy_percent=${occupancyPercent}&is_holiday=${isHoliday}&peak_hour=${peakHour}&weather=${weather}&station=${encodeURIComponent(station)}`,
        { method: "POST" }
      );
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch (err) {
      setError("Error connecting to server");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="max-w-lg mx-auto bg-white shadow-md rounded-xl p-8">
        <h1 className="text-2xl font-bold text-slate-900 text-center">
          Crowd Prediction
        </h1>
        <p className="text-slate-500 text-center text-sm mb-6">
          Predict crowd level at a station
        </p>

        <form onSubmit={handlePredict} className="space-y-4">
          <div>
            <label htmlFor="station" className="block text-sm font-medium text-slate-700 mb-1">Station</label>
            <input
              id="station"
              name="station"
              type="text"
              value={station}
              onChange={(e) => setStation(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
              required
            />
          </div>

          <div>
            <label htmlFor="passengerCount" className="block text-sm font-medium text-slate-700 mb-1">Passenger Count</label>
            <input
              id="passengerCount"
              name="passengerCount"
              type="number"
              value={passengerCount}
              onChange={(e) => setPassengerCount(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
              required
            />
          </div>

          <div>
            <label htmlFor="occupancyPercent" className="block text-sm font-medium text-slate-700 mb-1">Occupancy Percent</label>
            <input
              id="occupancyPercent"
              name="occupancyPercent"
              type="number"
              value={occupancyPercent}
              onChange={(e) => setOccupancyPercent(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
              required
            />
          </div>

          <div>
            <label htmlFor="isHoliday" className="block text-sm font-medium text-slate-700 mb-1">Is Holiday?</label>
            <select
              id="isHoliday"
              name="isHoliday"
              value={isHoliday}
              onChange={(e) => setIsHoliday(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
            >
              <option value="0">No</option>
              <option value="1">Yes</option>
            </select>
          </div>

          <div>
            <label htmlFor="peakHour" className="block text-sm font-medium text-slate-700 mb-1">Peak Hour?</label>
            <select
              id="peakHour"
              name="peakHour"
              value={peakHour}
              onChange={(e) => setPeakHour(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
            >
              <option value="0">No</option>
              <option value="1">Yes</option>
            </select>
          </div>

          <div>
            <label htmlFor="weather" className="block text-sm font-medium text-slate-700 mb-1">Weather</label>
            <input
              id="weather"
              name="weather"
              type="text"
              value={weather}
              onChange={(e) => setWeather(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
          >
            Predict
          </button>
        </form>

        {error && (
          <p className="mt-4 text-sm text-center rounded-lg py-2 px-3 bg-red-100 text-red-700">
            {error}
          </p>
        )}

        {result && (
          <div className="mt-4 text-center rounded-lg py-3 px-3 bg-green-100 text-green-700">
            <p className="font-semibold text-lg">
              Predicted Crowd Level: {result.predicted_crowd_level}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}