import { useEffect, useState } from "react";
import ridershipService from "../services/ridershipService";

export default function RidershipPrediction() {

  const [stations, setStations] = useState([]);

  const [formData, setFormData] = useState({
    station_name: "",
    platform_count: "",
    concourse_count: "",
    date: "",
    time: "",
  });

  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState(null);

  useEffect(() => {

    const loadStations = async () => {

      try {

        const response =
          await ridershipService.getStations();

        setStations(response.data);

      } catch (error) {

        console.error(error);

      }

    };

    loadStations();

  }, []);

  const handleChange = (e) => {

    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "number"
          ? Number(value)
          : value,
    }));

  };

  const predictRidership = async () => {

    if (!formData.station_name) {
      alert("Please select station");
      return;
    }

    if (!formData.date) {
      alert("Please select date");
      return;
    }

    if (!formData.time) {
      alert("Please select time");
      return;
    }

    const selectedDate = new Date(
      `${formData.date}T${formData.time}`
    );

    const requestData = {

      station_name: formData.station_name,

      platform_count: Number(
        formData.platform_count
      ),

      concourse_count: Number(
        formData.concourse_count
      ),

      hour: selectedDate.getHours(),

      day: selectedDate.getDate(),

      month: selectedDate.getMonth() + 1,

      day_of_week:
        selectedDate.getDay(),

      weekend:
        selectedDate.getDay() === 0 ||
        selectedDate.getDay() === 6
          ? 1
          : 0,

    };

    setLoading(true);

    try {

      const response =
        await ridershipService.predictRidership(
          requestData
        );

      setResult(response.data);

    } catch (error) {

      console.error(error);

      alert("Prediction failed");

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="p-8">

      <h1 className="text-3xl font-bold text-white mb-6">
        Ridership Prediction
      </h1>

      <div className="bg-slate-800 rounded-xl p-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

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

              <option value="">
                Select Station
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
            label="Platform Count"
            name="platform_count"
            value={formData.platform_count}
            onChange={handleChange}
          />

          <Input
            label="Concourse Count"
            name="concourse_count"
            value={formData.concourse_count}
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
              className="w-full p-3 rounded-lg bg-slate-700 text-white"
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
              className="w-full p-3 rounded-lg bg-slate-700 text-white"
            />

          </div>

        </div>

        <button
          onClick={predictRidership}
          disabled={loading}
          className="mt-6 px-6 py-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white"
        >

          {loading
            ? "Predicting..."
            : "Predict Ridership"}

        </button>

      </div>

      {result && (

        <div className="mt-8 bg-slate-800 rounded-xl p-6">

          <h2 className="text-xl text-white font-bold mb-5">
            Prediction Result
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            <div className="bg-slate-700 rounded-lg p-5">

              <h3 className="text-slate-300">
                Predicted Entry
              </h3>

              <p className="text-3xl text-cyan-400 font-bold mt-3">
                {result.predicted_entry_count}
              </p>

            </div>

            <div className="bg-slate-700 rounded-lg p-5">

              <h3 className="text-slate-300">
                Predicted Exit
              </h3>

              <p className="text-3xl text-cyan-400 font-bold mt-3">
                {result.predicted_exit_count}
              </p>

            </div>

          </div>

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
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-3 rounded-lg bg-slate-700 text-white"
      />

    </div>

  );

}