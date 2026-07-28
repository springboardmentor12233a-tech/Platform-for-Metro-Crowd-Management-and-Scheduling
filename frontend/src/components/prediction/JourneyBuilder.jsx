import {
  MapPin,
  ArrowDown,
  Route,
  CreditCard,
  Ticket,
  FileText,
  Sparkles,
  Loader2,
} from "lucide-react";

export default function JourneyBuilder({
  stations,
  form,
  handleChange,
  handlePredict,
  loading,
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-xl">

      {/* Header */}

      <div className="border-b border-slate-200 px-8 py-6">

        <div className="flex items-center gap-4">

          <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 p-3">

            <Route className="h-6 w-6 text-white" />

          </div>

          <div>

            <h2 className="text-2xl font-bold text-slate-900">
              Journey Builder
            </h2>

            <p className="text-slate-500">
              Configure the passenger journey for AI prediction.
            </p>

          </div>

        </div>

      </div>

      {/* Body */}

      <form
        onSubmit={handlePredict}
        className="space-y-6 p-8"
      >

        {/* FROM */}

        <div>

          <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">

            <MapPin className="h-4 w-4 text-indigo-600" />

            From Station

          </label>

          <select
            name="from_station"
            value={form.from_station}
            onChange={handleChange}
            className="h-14 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 transition focus:border-indigo-500 focus:bg-white focus:outline-none"
            required
          >

            <option value="">
              Select Origin Station
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

        {/* Journey Indicator */}

        <div className="flex justify-center">

          <div className="rounded-full bg-indigo-100 p-3">

            <ArrowDown className="h-5 w-5 text-indigo-600" />

          </div>

        </div>

        {/* TO */}

        <div>

          <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">

            <MapPin className="h-4 w-4 text-emerald-600" />

            Destination

          </label>

          <select
            name="to_station"
            value={form.to_station}
            onChange={handleChange}
            className="h-14 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 transition focus:border-indigo-500 focus:bg-white focus:outline-none"
            required
          >

            <option value="">
              Select Destination Station
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

        {/* Metrics */}

        <div className="grid gap-5 md:grid-cols-3">

          <div>

            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">

              <Route className="h-4 w-4 text-orange-500" />

              Distance

            </label>

            <input
              type="number"
              name="distance_km"
              placeholder="km"
              value={form.distance_km}
              onChange={handleChange}
              className="h-14 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 focus:border-indigo-500 focus:bg-white focus:outline-none"
              required
            />

          </div>

          <div>

            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">

              <CreditCard className="h-4 w-4 text-green-500" />

              Fare

            </label>

            <input
              type="number"
              step="0.01"
              name="fare"
              placeholder="Fare"
              value={form.fare}
              onChange={handleChange}
              className="h-14 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 focus:border-indigo-500 focus:bg-white focus:outline-none"
              required
            />

          </div>

          <div>

            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">

              <Ticket className="h-4 w-4 text-violet-500" />

              Cost / Passenger

            </label>

            <input
              type="number"
              step="0.01"
              name="cost_per_passenger"
              placeholder="Cost"
              value={form.cost_per_passenger}
              onChange={handleChange}
              className="h-14 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 focus:border-indigo-500 focus:bg-white focus:outline-none"
              required
            />

          </div>

        </div>

        {/* Ticket Type */}

        <div className="grid gap-5 md:grid-cols-2">

          <div>

            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">

              <Ticket className="h-4 w-4 text-indigo-600" />

              Ticket Type

            </label>

            <select
              name="ticket_type"
              value={form.ticket_type}
              onChange={handleChange}
              className="h-14 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 focus:border-indigo-500 focus:bg-white focus:outline-none"
              required
            >

              <option value="">
                Select Ticket
              </option>

              <option value="Smart Card">
                Smart Card
              </option>

              <option value="Single">
                Single Journey
              </option>

              <option value="Tourist Card">
                Tourist Card
              </option>

            </select>

          </div>

          <div>

            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">

              <FileText className="h-4 w-4 text-amber-600" />

              Journey Type

            </label>

            <select
              name="remarks"
              value={form.remarks}
              onChange={handleChange}
              className="h-14 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 focus:border-indigo-500 focus:bg-white focus:outline-none"
              required
            >

              <option value="">
                Select Type
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

          </div>

        </div>

        {/* Button */}

        <button
          type="submit"
          disabled={loading}
          className="flex h-16 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-600 text-lg font-semibold text-white shadow-xl transition hover:scale-[1.01] hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-60"
        >

          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Running AI Prediction...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              Predict Passenger Demand
            </>
          )}

        </button>

      </form>

    </div>
  );
}