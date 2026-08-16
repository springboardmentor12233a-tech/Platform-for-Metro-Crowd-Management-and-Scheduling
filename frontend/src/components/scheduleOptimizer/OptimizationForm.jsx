import { useEffect, useState } from "react";

import trainScheduleOptimizerService from "../../services/trainScheduleOptimizerService";

export default function OptimizationForm({
  onSubmit,
  loading,
}) {
  const [stations, setStations] = useState([]);
  const [loadingStations, setLoadingStations] = useState(true);

  const [form, setForm] = useState({
    station_name: "",
    hour: 10,
    day: 20,
    month: 7,
    weekend: false,
  });

  // =====================================================
  // LOAD REAL STATIONS FROM DATABASE
  // =====================================================

  useEffect(() => {
    const loadStations = async () => {
      try {
        const response =
          await trainScheduleOptimizerService.getStations();

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

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  function handleChange(e) {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm((prev) => ({
      ...prev,

      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? Number(value)
          : value,
    }));
  }

  // =====================================================
  // SUBMIT
  // =====================================================

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.station_name) {
      alert("Please select a station.");
      return;
    }

    if (
      form.hour < 0 ||
      form.hour > 23
    ) {
      alert("Hour must be between 0 and 23.");
      return;
    }

    if (
      form.day < 1 ||
      form.day > 31
    ) {
      alert("Day must be between 1 and 31.");
      return;
    }

    if (
      form.month < 1 ||
      form.month > 12
    ) {
      alert("Month must be between 1 and 12.");
      return;
    }

    const requestData = {
      station_name: form.station_name,
      hour: Number(form.hour),
      day: Number(form.day),
      month: Number(form.month),
      weekend: Boolean(form.weekend),
    };

    console.log(
      "Schedule optimizer request:",
      requestData
    );

    onSubmit(requestData);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="
        bg-slate-800
        rounded-xl
        p-6
        space-y-6
        shadow-lg
        border
        border-slate-700
      "
    >

      {/* =================================================
          HEADER
      ================================================= */}

      <div>

        <h2 className="text-2xl font-bold text-white">
          AI Train Schedule Optimizer
        </h2>

        <p className="text-slate-400 mt-1">
          Select a station and scheduling parameters
          for AI-based optimization.
        </p>

      </div>


      {/* =================================================
          STATION SUGGESTION
      ================================================= */}

      <div>

        <label className="block text-slate-300 mb-2 font-medium">
          Station
        </label>

        <select
          name="station_name"
          value={form.station_name}
          onChange={handleChange}
          disabled={
            loading ||
            loadingStations
          }
          className="
            w-full
            p-3
            rounded-lg
            bg-slate-900
            border
            border-slate-700
            text-white
            focus:outline-none
            focus:ring-2
            focus:ring-cyan-500
            disabled:opacity-60
          "
        >

          <option value="">
            {loadingStations
              ? "Loading stations..."
              : "Select a station"}
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

        <p className="text-xs text-slate-500 mt-2">
          Select a station from the database.
        </p>

      </div>


      {/* =================================================
          HOUR / DAY / MONTH
      ================================================= */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Hour */}

        <div>

          <label className="block text-slate-300 mb-2">
            Hour
          </label>

          <input
            type="number"
            name="hour"
            min="0"
            max="23"
            value={form.hour}
            onChange={handleChange}
            disabled={loading}
            className="
              w-full
              p-3
              rounded-lg
              bg-slate-900
              border
              border-slate-700
              text-white
              focus:outline-none
              focus:ring-2
              focus:ring-cyan-500
            "
          />

        </div>


        {/* Day */}

        <div>

          <label className="block text-slate-300 mb-2">
            Day
          </label>

          <input
            type="number"
            name="day"
            min="1"
            max="31"
            value={form.day}
            onChange={handleChange}
            disabled={loading}
            className="
              w-full
              p-3
              rounded-lg
              bg-slate-900
              border
              border-slate-700
              text-white
              focus:outline-none
              focus:ring-2
              focus:ring-cyan-500
            "
          />

        </div>


        {/* Month */}

        <div>

          <label className="block text-slate-300 mb-2">
            Month
          </label>

          <input
            type="number"
            name="month"
            min="1"
            max="12"
            value={form.month}
            onChange={handleChange}
            disabled={loading}
            className="
              w-full
              p-3
              rounded-lg
              bg-slate-900
              border
              border-slate-700
              text-white
              focus:outline-none
              focus:ring-2
              focus:ring-cyan-500
            "
          />

        </div>

      </div>


      {/* =================================================
          WEEKEND
      ================================================= */}

      <div
        className="
          flex
          items-center
          justify-between
          bg-slate-900
          border
          border-slate-700
          rounded-lg
          p-4
        "
      >

        <div>

          <p className="text-white font-medium">
            Weekend
          </p>

          <p className="text-sm text-slate-500">
            Select if this is a Saturday or Sunday.
          </p>

        </div>

        <label className="flex items-center gap-3">

          <input
            type="checkbox"
            name="weekend"
            checked={form.weekend}
            onChange={handleChange}
            disabled={loading}
            className="
              w-5
              h-5
              accent-cyan-500
            "
          />

          <span className="text-slate-300">
            {form.weekend
              ? "Weekend"
              : "Weekday"}
          </span>

        </label>

      </div>


      {/* =================================================
          SUBMIT
      ================================================= */}

      <button
        type="submit"
        disabled={
          loading ||
          loadingStations
        }
        className="
          w-full
          bg-cyan-600
          hover:bg-cyan-700
          disabled:bg-slate-600
          disabled:cursor-not-allowed
          py-3
          rounded-lg
          text-white
          font-semibold
          transition
        "
      >

        {loading
          ? "Optimizing..."
          : "Optimize Schedule"}

      </button>

    </form>
  );
}