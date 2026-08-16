import { useEffect, useState } from "react";
import ridershipService from "../services/ridershipService";

export default function RidershipPrediction() {
  const [stations, setStations] = useState([]);
  const [loadingStations, setLoadingStations] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const [formData, setFormData] = useState({
    station_name: "",
    date: "",
    time: "",
  });

  useEffect(() => {
    const loadStations = async () => {
      try {
        setLoadingStations(true);

        const response =
          await ridershipService.getStations();

        let stationList = [];

        if (Array.isArray(response?.data)) {
          stationList = response.data;
        } else if (
          Array.isArray(response?.data?.data)
        ) {
          stationList = response.data.data;
        } else if (
          Array.isArray(response?.data?.stations)
        ) {
          stationList = response.data.stations;
        }

        setStations(stationList);
      } catch (error) {
        console.error(
          "Failed to load stations:",
          error
        );

        setStations([]);
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

    setResult(null);
  };

  const predictRidership = async () => {
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

    const selectedDate = new Date(
      `${formData.date}T${formData.time}`
    );

    if (Number.isNaN(selectedDate.getTime())) {
      alert("Invalid date or time.");
      return;
    }

    const hour = selectedDate.getHours();

    const day = selectedDate.getDate();

    const month =
      selectedDate.getMonth() + 1;

    const jsDay =
      selectedDate.getDay();

    // Convert JavaScript Sunday=0 convention
    // to Python/Pandas Monday=0 convention.
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

      hour: hour,

      day: day,

      month: month,

      day_of_week: dayOfWeek,

      weekend: weekend,
    };

    console.log(
      "Ridership prediction request:",
      requestData
    );

    setLoading(true);
    setResult(null);

    try {
      const response =
        await ridershipService.predictRidership(
          requestData
        );

      console.log(
        "Ridership prediction response:",
        response.data
      );

      const prediction =
        response?.data?.data ||
        response?.data;

      setResult({
        ...prediction,
        station_name:
          formData.station_name,
        prediction_date:
          formData.date,
        prediction_time:
          formData.time,
      });
    } catch (error) {
      console.error(
        "Ridership prediction failed:",
        error.response?.data ||
          error
      );

      const detail =
        error?.response?.data?.detail;

      let message =
        "Ridership prediction failed.";

      if (typeof detail === "string") {
        message = detail;
      } else if (Array.isArray(detail)) {
        message = detail
          .map(
            (item) =>
              item.msg ||
              "Invalid input."
          )
          .join("\n");
      } else if (
        error?.response?.data?.message
      ) {
        message =
          error.response.data.message;
      }

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-white">
          Ridership Prediction
        </h1>

        <p className="text-slate-400 mt-2">
          Predict passenger entry and exit
          counts based on date and time.
        </p>

      </div>

      <div className="bg-slate-800 rounded-xl p-6 shadow-lg">

        <h2 className="text-xl font-semibold text-white mb-6">
          Prediction Parameters
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <div className="md:col-span-2">

            <label className="block text-slate-300 mb-2">
              Station
            </label>

            <input
              type="text"
              name="station_name"
              list="station-suggestions"
              value={
                formData.station_name
              }
              onChange={handleChange}
              placeholder={
                loadingStations
                  ? "Loading stations..."
                  : "Search or select a station"
              }
              disabled={loadingStations}
              autoComplete="off"
              className="w-full p-3 rounded-lg bg-slate-700 text-white border border-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
            />

            <datalist id="station-suggestions">

              {stations.map(
                (station, index) => (
                  <option
                    key={
                      station.id ??
                      `${station.station_name}-${index}`
                    }
                    value={
                      station.station_name
                    }
                  />
                )
              )}

            </datalist>

            <div className="mt-2">

              <p className="text-xs text-slate-500">
                {loadingStations
                  ? "Loading station list..."
                  : `${stations.length} station${
                      stations.length !== 1
                        ? "s"
                        : ""
                    } available`}
              </p>

            </div>

          </div>

          <div>

            <label className="block text-slate-300 mb-2">
              Date
            </label>

            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-slate-700 text-white border border-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
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
              className="w-full p-3 rounded-lg bg-slate-700 text-white border border-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
            />

          </div>

        </div>

        <div className="mt-5 p-4 rounded-lg bg-slate-700/50 border border-slate-600">

          <p className="text-slate-300 text-sm">
            The AI model uses:
          </p>

          <div className="flex flex-wrap gap-2 mt-3">

            <FeatureBadge text="Hour" />
            <FeatureBadge text="Day" />
            <FeatureBadge text="Month" />
            <FeatureBadge text="Day of Week" />
            <FeatureBadge text="Weekend" />

          </div>

        </div>

        <button
          onClick={predictRidership}
          disabled={loading}
          className="mt-6 px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? "Predicting..."
            : "Predict Ridership"}
        </button>

      </div>

      {result && (

        <div className="mt-8 bg-slate-800 rounded-xl p-6 shadow-lg">

          <div className="mb-6">

            <h2 className="text-xl text-white font-bold">
              Prediction Result
            </h2>

            <p className="text-slate-400 text-sm mt-1">

              Predicted passenger movement for{" "}

              <span className="text-cyan-400 font-semibold">
                {result.station_name}
              </span>

            </p>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="bg-slate-700 rounded-lg p-5">

              <h3 className="text-slate-300">
                Predicted Entry
              </h3>

              <p className="text-3xl text-cyan-400 font-bold mt-3">

                {formatNumber(
                  result.predicted_entry_count ??
                    result.predicted_entries
                )}

              </p>

              <p className="text-slate-400 text-sm mt-2">
                Expected passenger entries
              </p>

            </div>

            <div className="bg-slate-700 rounded-lg p-5">

              <h3 className="text-slate-300">
                Predicted Exit
              </h3>

              <p className="text-3xl text-cyan-400 font-bold mt-3">

                {formatNumber(
                  result.predicted_exit_count ??
                    result.predicted_exits
                )}

              </p>

              <p className="text-slate-400 text-sm mt-2">
                Expected passenger exits
              </p>

            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">

            <InfoCard
              label="Date"
              value={
                result.prediction_date
              }
            />

            <InfoCard
              label="Time"
              value={
                result.prediction_time
              }
            />

            <InfoCard
              label="Day"
              value={getDayName(
                formData.date
              )}
            />

          </div>

          {result.id && (

            <div className="mt-6">

              <p className="text-slate-400 text-sm">
                Prediction ID
              </p>

              <p className="text-cyan-400 font-mono mt-1">
                {result.id}
              </p>

            </div>

          )}

        </div>

      )}

    </div>
  );
}

function FeatureBadge({ text }) {
  return (
    <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs">
      {text}
    </span>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="bg-slate-700 rounded-lg p-4">

      <p className="text-slate-400 text-sm">
        {label}
      </p>

      <p className="text-white font-semibold mt-1">
        {value || "-"}
      </p>

    </div>
  );
}

function getDayName(dateString) {
  if (!dateString) {
    return "-";
  }

  const date = new Date(
    `${dateString}T00:00:00`
  );

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      weekday: "long",
    }
  );
}

function formatNumber(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "N/A";
  }

  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "N/A";
  }

  return Math.round(number).toLocaleString(
    "en-IN"
  );
}