const timeline = [
  "08:35 Signal failure reported",
  "08:38 AI predicted congestion",
  "08:40 Maintenance dispatched",
  "08:45 Trains rerouted",
  "08:52 Passenger load reduced",
];

function IncidentTimeline() {
  return (
    <div className="bg-white rounded-2xl shadow border p-6">

      <h2 className="text-xl font-bold mb-6">
        Incident Timeline
      </h2>

      <div className="space-y-5">

        {timeline.map((event, index) => (

          <div
            key={index}
            className="flex gap-4"
          >

            <div className="w-3 h-3 rounded-full bg-indigo-600 mt-2" />

            <p>{event}</p>

          </div>

        ))}

      </div>

    </div>
  );
}

export default IncidentTimeline;