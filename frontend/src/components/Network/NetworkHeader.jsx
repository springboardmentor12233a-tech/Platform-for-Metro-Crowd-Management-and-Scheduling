import { Activity } from "lucide-react";
import LiveClock from "./LiveClock";

function NetworkHeader() {
  return (
    <div className="flex justify-between items-center mb-8">

      <div>

        <div className="flex items-center gap-3">

          <Activity
            className="text-green-500 animate-pulse"
            size={28}
          />

          <h2 className="text-3xl font-bold">
            Live Metro Network
          </h2>

        </div>

        <p className="text-slate-500 mt-2">
          AI-powered real-time operations monitoring
        </p>

      </div>

      <LiveClock />

    </div>
  );
}

export default NetworkHeader;