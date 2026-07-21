export default function MetroStatusCard() {
  const status = [
    {
      line: "Blue Line",
      status: "Running",
      color: "bg-green-500",
    },
    {
      line: "Yellow Line",
      status: "Delayed",
      color: "bg-yellow-500",
    },
    {
      line: "Red Line",
      status: "Running",
      color: "bg-green-500",
    },
    {
      line: "Pink Line",
      status: "Maintenance",
      color: "bg-red-500",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">

      <h2 className="text-2xl font-bold mb-5">
        🚇 Metro Line Status
      </h2>

      <div className="space-y-4">

        {status.map((item) => (

          <div
            key={item.line}
            className="flex justify-between items-center"
          >

            <span className="font-semibold">
              {item.line}
            </span>

            <span
              className={`${item.color} text-white px-3 py-1 rounded-full text-sm`}
            >
              {item.status}
            </span>

          </div>

        ))}

      </div>

    </div>
  );
}