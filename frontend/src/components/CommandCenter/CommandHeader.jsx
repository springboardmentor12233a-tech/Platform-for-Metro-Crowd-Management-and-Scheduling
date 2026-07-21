import { ShieldCheck } from "lucide-react";

function CommandHeader() {
  return (
    <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 rounded-3xl p-8 text-white shadow-xl">

      <div className="flex justify-between items-center">

        <div>

          <p className="uppercase tracking-[0.3em] text-cyan-400 text-sm">
            AI Operations
          </p>

          <h1 className="text-5xl font-bold mt-3">
            Metro Command Center
          </h1>

          <p className="text-slate-300 mt-4">
            Unified operational intelligence for the entire metro network.
          </p>

        </div>

        <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-2xl px-5 py-4">

          <ShieldCheck className="text-green-400" />

          <div>

            <p className="text-sm text-slate-300">
              System Health
            </p>

            <h3 className="text-2xl font-bold">
              99.8%
            </h3>

          </div>

        </div>

      </div>

    </div>
  );
}

export default CommandHeader;