import timelineData from "./timelineData";
import TimelineLegend from "./TimelineLegend";

const colors = {
  Running: "bg-green-500",
  Boarding: "bg-blue-500",
  Delayed: "bg-red-500",
};

function TrainTimeline() {
  return (
    <section className="mt-8 bg-white rounded-3xl border border-slate-200 shadow-xl p-6">

      <div className="flex flex-col lg:flex-row justify-between lg:items-center mb-8 gap-4">

        <div>
          <h2 className="text-2xl font-bold">
            Train Operations Timeline
          </h2>

          <p className="text-slate-500 mt-1">
            Visual representation of active train schedules.
          </p>
        </div>

        <TimelineLegend />

      </div>

      {/* Time Scale */}

      <div className="grid grid-cols-7 text-center text-sm text-slate-500 font-medium border-b pb-3">

        <span>08:00</span>
        <span>08:15</span>
        <span>08:30</span>
        <span>08:45</span>
        <span>09:00</span>
        <span>09:15</span>
        <span>09:30</span>

      </div>

      <div className="space-y-6 mt-6">

        {timelineData.map((train) => (

          <div
            key={train.id}
            className="grid grid-cols-12 gap-4 items-center"
          >

            <div className="col-span-2">

              <h3 className="font-semibold">
                {train.line}
              </h3>

              <p className="text-xs text-slate-500">
                {train.train}
              </p>

            </div>

            <div className="col-span-10">

              <div className="relative h-10 rounded-full bg-slate-100">

                <div
                  className={`absolute top-1 h-8 rounded-full ${colors[train.status]}`}
                  style={{
                    left: `${train.offset}%`,
                    width: `${train.duration}%`,
                  }}
                />

              </div>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}

export default TrainTimeline;