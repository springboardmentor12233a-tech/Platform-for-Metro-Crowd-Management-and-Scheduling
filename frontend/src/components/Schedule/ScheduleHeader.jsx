import { Radio } from "lucide-react";

function ScheduleHeader() {
  const now = new Date();

  return (
    <section className="bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 rounded-3xl text-white shadow-2xl">

      <div className="p-8 flex flex-col xl:flex-row justify-between items-start">

        <div>

          <p className="uppercase tracking-[0.35em] text-cyan-400 text-sm font-semibold">
            AI Train Scheduling Platform
          </p>

          <h1 className="mt-3 text-5xl font-extrabold">
            Schedule Operations Center
          </h1>

          <p className="mt-5 max-w-3xl text-slate-300 leading-8 text-lg">
            Monitor train schedules, optimize frequency,
            minimize delays and receive AI-powered scheduling
            recommendations in real time.
          </p>

        </div>

        <div className="mt-8 xl:mt-0">

          <div className="rounded-3xl bg-white/10 backdrop-blur-xl border border-white/10 p-6 min-w-[260px]">

            <div className="flex items-center gap-3">

              <Radio
                className="text-green-400 animate-pulse"
                size={20}
              />

              <span className="font-semibold">
                LIVE OPERATIONS
              </span>

            </div>

            <div className="mt-5">

              <h2 className="text-3xl font-bold">
                {now.toLocaleTimeString()}
              </h2>

              <p className="text-slate-300">
                {now.toLocaleDateString()}
              </p>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default ScheduleHeader;