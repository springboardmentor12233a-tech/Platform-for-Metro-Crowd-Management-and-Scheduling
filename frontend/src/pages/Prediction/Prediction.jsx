import { useState, useEffect } from "react";

import { predictPassengers } from "../../api/prediction";
import { getStations } from "../../api/station";

export default function Prediction() {
  const [stations, setStations] = useState([]);

  const [form, setForm] = useState({
    from_station: "",
    to_station: "",
    distance_km: "",
    fare: "",
    cost_per_passenger: "",
    ticket_type: "",
    remarks: "",
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStations();
  }, []);

  const loadStations = async () => {
    try {
      const data = await getStations();
      setStations(data);
    } catch (error) {
      console.error("Failed to load stations", error);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handlePredict = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const data = {
        ...form,
        distance_km: Number(form.distance_km),
        fare: Number(form.fare),
        cost_per_passenger: Number(form.cost_per_passenger),
      };

      const result = await predictPassengers(data);

      // Update UI
      setPrediction(result.predicted_passengers);

      // Save for Smart Scheduling
      localStorage.setItem(
        "predictedPassengers",
        result.predicted_passengers
      );

      localStorage.setItem(
        "predictionStation",
        form.from_station
      );

      localStorage.setItem(
        "predictionDestination",
        form.to_station
      );

      localStorage.setItem(
        "predictionCrowd",
        getCrowdLevelFromPrediction(
          result.predicted_passengers
        )
      );

      localStorage.setItem(
        "predictionTime",
        new Date().toLocaleString()
      );

    } catch (error) {
      console.error(error);
      alert("Prediction Failed");
    }

    setLoading(false);
  };

  const getCrowdLevelFromPrediction = (value) => {
    if (value < 10) return "🟢 Low";
    if (value < 20) return "🟡 Medium";
    return "🔴 High";
  };

  const getCrowdLevel = () => {
    if (prediction === null) return "";
    return getCrowdLevelFromPrediction(prediction);
  };

  const getRecommendation = () => {
    if (prediction === null) return "";

    if (prediction < 10)
      return "Normal service. No additional train required.";

    if (prediction < 20)
      return "Monitor passenger flow. Keep current schedule.";

    return "Increase train frequency and deploy additional staff.";
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">

      <h1 className="text-4xl font-bold mb-8 text-slate-800">
        🤖 AI Passenger Prediction
      </h1>

      <div className="grid lg:grid-cols-2 gap-8">

        {/* Prediction Form */}

        <div className="bg-white rounded-2xl shadow-lg p-8">

          <h2 className="text-2xl font-semibold mb-6">
            Prediction Form
          </h2>

          <form
            onSubmit={handlePredict}
            className="space-y-5"
          >

            <select
              name="from_station"
              value={form.from_station}
              onChange={handleChange}
              className="w-full border rounded-xl p-3"
              required
            >
              <option value="">
                Select From Station
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

            <select
              name="to_station"
              value={form.to_station}
              onChange={handleChange}
              className="w-full border rounded-xl p-3"
              required
            >
              <option value="">
                Select To Station
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

            <input
              type="number"
              name="distance_km"
              placeholder="Distance (km)"
              value={form.distance_km}
              onChange={handleChange}
              className="w-full border rounded-xl p-3"
              required
            />

            <input
              type="number"
              step="0.01"
              name="fare"
              placeholder="Fare"
              value={form.fare}
              onChange={handleChange}
              className="w-full border rounded-xl p-3"
              required
            />

            <input
              type="number"
              step="0.01"
              name="cost_per_passenger"
              placeholder="Cost Per Passenger"
              value={form.cost_per_passenger}
              onChange={handleChange}
              className="w-full border rounded-xl p-3"
              required
            />

            <select
              name="ticket_type"
              value={form.ticket_type}
              onChange={handleChange}
              className="w-full border rounded-xl p-3"
              required
            >
              <option value="">
                Select Ticket Type
              </option>

              <option value="Smart Card">
                Smart Card
              </option>

              <option value="Single">
                Single
              </option>

              <option value="Tourist Card">
                Tourist Card
              </option>
            </select>

            <select
              name="remarks"
              value={form.remarks}
              onChange={handleChange}
              className="w-full border rounded-xl p-3"
              required
            >
              <option value="">
                Select Remarks
              </option>

              <option value="peak">
                Peak Hour
              </option>

              <option value="off-peak">
                Off Peak
              </option>

              <option value="maintenance">
                Maintenance
              </option>
            </select>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl text-lg font-semibold transition"
            >
              {loading
                ? "Predicting..."
                : "Predict Passenger Count"}
            </button>

          </form>

        </div>

        {/* Prediction Result */}

        <div className="space-y-6">

          <div className="bg-white rounded-2xl shadow-lg p-6">

            <h2 className="text-xl font-semibold mb-4">
              Prediction Summary
            </h2>

            <div className="grid gap-5">

              <div className="bg-indigo-50 rounded-xl p-5">

                <p className="text-gray-500">
                  Predicted Passengers
                </p>

                <h2 className="text-5xl font-bold text-indigo-600 mt-2">
                  {prediction ?? "--"}
                </h2>

              </div>

              <div className="bg-green-50 rounded-xl p-5">

                <p className="text-gray-500">
                  Crowd Level
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {prediction !== null
                    ? getCrowdLevel()
                    : "--"}
                </h2>

              </div>

              <div className="bg-yellow-50 rounded-xl p-5">

                <p className="text-gray-500">
                  AI Recommendation
                </p>

                <p className="text-lg font-medium mt-2">
                  {prediction !== null
                    ? getRecommendation()
                    : "Prediction not available"}
                </p>

              </div>

            </div>

          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">

            <h2 className="text-xl font-semibold mb-3">
              AI Insight
            </h2>

            <p className="text-gray-600 leading-7">
              MetroVision uses a trained Random Forest Regression model to
              estimate passenger demand. Based on station information,
              distance, fare, ticket type and operational conditions,
              the system predicts expected passenger count, identifies
              crowd level and suggests operational recommendations to
              improve metro service efficiency.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}