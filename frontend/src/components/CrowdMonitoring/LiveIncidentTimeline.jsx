import {
  AlertTriangle,
  Activity,
  Train,
  BrainCircuit,
} from "lucide-react";

function LiveIncidentTimeline({ stations }) {

  const now = new Date();

  const formatTime = (minutesAgo = 0) => {

    const d = new Date(now.getTime() - minutesAgo * 60000);

    return d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  };

  const busiest = [...stations]
    .sort((a, b) => b.occupancy - a.occupancy)
    .slice(0, 2);

  const events = [];

  if (busiest[0]) {
    events.push({
      type: "danger",
      icon: AlertTriangle,
      title: busiest[0].station,
      message: `Occupancy reached ${busiest[0].occupancy}%`,
      time: formatTime(0),
    });
  }

  if (busiest[1]) {
    events.push({
      type: "warning",
      icon: Activity,
      title: busiest[1].station,
      message: "Passenger flow increasing",
      time: formatTime(2),
    });
  }

  events.push({
    type: "success",
    icon: Train,
    title: "Blue Line",
    message: "Train frequency increased",
    time: formatTime(5),
  });

  events.push({
    type: "info",
    icon: BrainCircuit,
    title: "AI Engine",
    message: "Prediction model updated",
    time: formatTime(7),
  });
    const colors = {
    danger: "border-red-500 bg-red-500/10 text-red-400",
    warning: "border-yellow-500 bg-yellow-500/10 text-yellow-400",
    success: "border-green-500 bg-green-500/10 text-green-400",
    info: "border-cyan-500 bg-cyan-500/10 text-cyan-400",
  };

  return (
    <div className="rounded-3xl bg-white border border-slate-200 shadow-xl">

      <div className="px-6 py-5 border-b">

        <h2 className="text-2xl font-bold">
          🚨 Live Incident Timeline
        </h2>

        <p className="text-slate-500 mt-1">
          Latest AI-generated operational events
        </p>

      </div>

      <div className="max-h-[520px] overflow-y-auto">

        {events.map((event, index) => {

          const Icon = event.icon;

          return (

            <div
              key={index}
              className="flex gap-4 px-6 py-5 border-b last:border-none hover:bg-slate-50 transition"
            >

              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${colors[event.type]}`}
              >
                <Icon size={20} />
              </div>

              <div className="flex-1">

                <div className="flex justify-between">

                  <h3 className="font-bold">
                    {event.title}
                  </h3>

                  <span className="text-sm text-slate-500">
                    {event.time}
                  </span>

                </div>

                <p className="text-slate-600 mt-1">
                  {event.message}
                </p>

              </div>

            </div>

          );

        })}

      </div>

    </div>
  );

}

export default LiveIncidentTimeline;