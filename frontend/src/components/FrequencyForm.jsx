import { useState } from "react";

export default function FrequencyForm({ onSubmit, loading }) {
  const [form, setForm] = useState({
    station_name: "",
    platform_count: 1,
    concourse_count: 1,
    current_frequency: 10,
    date: "",
    time: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.date || !form.time) {
      alert("Please select date and time.");
      return;
    }

    const selectedDate = new Date(form.date);

    const payload = {
      station_name: form.station_name,
      platform_count: Number(form.platform_count),
      concourse_count: Number(form.concourse_count),
      current_frequency: Number(form.current_frequency),

      hour: Number(form.time.split(":")[0]),

      day: selectedDate.getDate(),

      month: selectedDate.getMonth() + 1,

      day_of_week: selectedDate.getDay(),

      weekend:
        selectedDate.getDay() === 0 ||
        selectedDate.getDay() === 6,
    };

    onSubmit(payload);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-800 border border-slate-700 rounded-xl shadow-xl p-8 space-y-6"
    >
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        🚆 Metro Frequency Adjustment
      </h2>
  
      {/* Station */}
      <div>
        <label className="block text-slate-300 text-sm font-medium mb-2">
          Station Name
        </label>
  
        <input
          type="text"
          name="station_name"
          placeholder="Enter Station Name (e.g. Rajiv Chowk)"
          value={form.station_name}
          onChange={handleChange}
          className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </div>
  
      {/* Date & Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
  
        <div>
          <label className="block text-slate-300 text-sm font-medium mb-2">
            Prediction Date
          </label>
  
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
  
        <div>
          <label className="block text-slate-300 text-sm font-medium mb-2">
            Prediction Time
          </label>
  
          <input
            type="time"
            name="time"
            value={form.time}
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
  
      </div>
  
      {/* Platform & Concourse */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
  
        <div>
          <label className="block text-slate-300 text-sm font-medium mb-2">
            Platform Count
          </label>
  
          <input
            type="number"
            name="platform_count"
            value={form.platform_count}
            onChange={handleChange}
            min="1"
            className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
  
        <div>
          <label className="block text-slate-300 text-sm font-medium mb-2">
            Concourse Count
          </label>
  
          <input
            type="number"
            name="concourse_count"
            value={form.concourse_count}
            onChange={handleChange}
            min="1"
            className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
  
      </div>
  
      {/* Current Frequency */}
      <div>
        <label className="block text-slate-300 text-sm font-medium mb-2">
          Current Train Frequency (minutes)
        </label>
  
        <input
          type="number"
          name="current_frequency"
          value={form.current_frequency}
          onChange={handleChange}
          min="1"
          placeholder="10"
          className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </div>
  
      {/* Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-300 text-white py-3 rounded-lg font-semibold shadow-lg"
      >
        {loading ? "Predicting..." : "🚆 Predict Recommendation"}
      </button>
    </form>
  );
}