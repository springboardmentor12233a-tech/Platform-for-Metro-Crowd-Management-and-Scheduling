import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TrainFront,
  ArrowLeft,
  Save,
  Users,
  Hash,
  Map,
  Gauge,
} from "lucide-react";

import api from "../../../api/axios";

export default function AddTrain() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    trainNumber: "",
    trainName: "",
    line: "",
    trainType: "Standard",
    capacity: "",
    coaches: "",
    status: "Active",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove previous error when user edits the form
    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const payload = {
        train_number: formData.trainNumber.trim(),
        train_name: formData.trainName.trim(),
        line: formData.line,
        train_type: formData.trainType,
        capacity: Number(formData.capacity),
        coaches: Number(formData.coaches),
        status: formData.status,
      };

      console.log("Creating train:", payload);

      const response = await api.post(
        "/trains/",
        payload
      );

      console.log(
        "Train created successfully:",
        response.data
      );

      // Return to Scheduling after successful creation
      navigate("/schedule");
    } catch (err) {
      console.error(
        "Create train error:",
        err
      );

      setError(
        err.response?.data?.detail ||
          "Unable to create train. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">

      <div className="mx-auto max-w-5xl px-6 py-8 lg:px-8">

        {/* =====================================================
            BACK BUTTON
        ===================================================== */}

        <button
          type="button"
          onClick={() => navigate("/schedule")}
          disabled={loading}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ArrowLeft size={17} />
          Back to Scheduling
        </button>


        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mb-8">

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100">
              <TrainFront
                size={24}
                className="text-indigo-600"
              />
            </div>

            <div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Add New Train
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Register a new train in the MetroVision network.
              </p>

            </div>

          </div>

        </div>


        {/* =====================================================
            FORM CARD
        ===================================================== */}

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl lg:p-8"
        >

          {/* ===================================================
              ERROR MESSAGE
          =================================================== */}

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}


          {/* ===================================================
              FORM FIELDS
          =================================================== */}

          <div className="grid gap-6 md:grid-cols-2">

            {/* -------------------------------------------------
                TRAIN NUMBER
            ------------------------------------------------- */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Train Number
              </label>

              <div className="relative">

                <Hash
                  size={18}
                  className="absolute left-3 top-3.5 text-slate-400"
                />

                <input
                  type="text"
                  name="trainNumber"
                  value={formData.trainNumber}
                  onChange={handleChange}
                  placeholder="e.g. M-106"
                  required
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                />

              </div>

            </div>


            {/* -------------------------------------------------
                TRAIN NAME
            ------------------------------------------------- */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Train Name
              </label>

              <input
                type="text"
                name="trainName"
                value={formData.trainName}
                onChange={handleChange}
                placeholder="e.g. Metro Express"
                required
                disabled={loading}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-50"
              />

            </div>


            {/* -------------------------------------------------
                METRO LINE
            ------------------------------------------------- */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Metro Line
              </label>

              <div className="relative">

                <Map
                  size={18}
                  className="absolute left-3 top-3.5 text-slate-400"
                />

                <select
                  name="line"
                  value={formData.line}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                >

                  <option value="">
                    Select Line
                  </option>

                  <option value="Blue">
                    Blue Line
                  </option>

                  <option value="Yellow">
                    Yellow Line
                  </option>

                  <option value="Red">
                    Red Line
                  </option>

                  <option value="Green">
                    Green Line
                  </option>

                  <option value="Violet">
                    Violet Line
                  </option>

                  <option value="Pink">
                    Pink Line
                  </option>

                  <option value="Magenta">
                    Magenta Line
                  </option>

                </select>

              </div>

            </div>


            {/* -------------------------------------------------
                TRAIN TYPE
            ------------------------------------------------- */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Train Type
              </label>

              <select
                name="trainType"
                value={formData.trainType}
                onChange={handleChange}
                disabled={loading}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-50"
              >

                <option value="Standard">
                  Standard
                </option>

                <option value="Express">
                  Express
                </option>

                <option value="Airport Express">
                  Airport Express
                </option>

              </select>

            </div>


            {/* -------------------------------------------------
                CAPACITY
            ------------------------------------------------- */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Passenger Capacity
              </label>

              <div className="relative">

                <Users
                  size={18}
                  className="absolute left-3 top-3.5 text-slate-400"
                />

                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  placeholder="e.g. 1500"
                  min="1"
                  required
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                />

              </div>

            </div>


            {/* -------------------------------------------------
                COACHES
            ------------------------------------------------- */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Number of Coaches
              </label>

              <div className="relative">

                <Gauge
                  size={18}
                  className="absolute left-3 top-3.5 text-slate-400"
                />

                <input
                  type="number"
                  name="coaches"
                  value={formData.coaches}
                  onChange={handleChange}
                  placeholder="e.g. 8"
                  min="1"
                  required
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                />

              </div>

            </div>


            {/* -------------------------------------------------
                STATUS
            ------------------------------------------------- */}

            <div className="md:col-span-2">

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Initial Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={loading}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-50"
              >

                <option value="Active">
                  Active
                </option>

                <option value="Maintenance">
                  Maintenance
                </option>

                <option value="Inactive">
                  Inactive
                </option>

              </select>

            </div>

          </div>


          {/* ===================================================
              ACTIONS
          =================================================== */}

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={() => navigate("/schedule")}
              disabled={loading}
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={17} />

              {loading
                ? "Creating..."
                : "Create Train"}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}