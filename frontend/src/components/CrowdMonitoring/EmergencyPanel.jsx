import { AlertTriangle, Play } from "lucide-react";

const scenarios = [
  "Station Closure",
  "Train Breakdown",
  "Overcrowding",
  "Fire Emergency",
  "Signal Failure",
];

function EmergencyPanel({ scenario, setScenario }) {
  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6">

      <div className="flex items-center gap-3 mb-5">
        <AlertTriangle className="text-red-500" />
        <h2 className="text-xl font-bold">
          Emergency Simulation
        </h2>
      </div>

      <select
        value={scenario}
        onChange={(e) => setScenario(e.target.value)}
        className="w-full rounded-xl border p-3"
      >
        <option value="">Select Scenario</option>

        {scenarios.map((item) => (
          <option key={item}>
            {item}
          </option>
        ))}
      </select>

      <button className="mt-5 w-full flex justify-center items-center gap-2 bg-red-500 hover:bg-red-600 text-white rounded-xl py-3">
        <Play size={18} />
        Run Simulation
      </button>

    </div>
  );
}

export default EmergencyPanel;