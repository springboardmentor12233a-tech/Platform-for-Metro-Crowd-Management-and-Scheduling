export default function ActivityStats({ logs }) {
  const totalLogs = logs.length;

  const loginCount = logs.filter(
    (log) => log.action === "Login"
  ).length;

  const userActions = logs.filter((log) =>
    [
      "Create User",
      "Update User",
      "Delete User",
    ].includes(log.action)
  ).length;

  const failedActions = logs.filter(
    (log) => log.status === "Failed"
  ).length;

  const cards = [
    {
      title: "Total Logs",
      value: totalLogs,
      color: "border-blue-500",
    },
    {
      title: "Login Events",
      value: loginCount,
      color: "border-green-500",
    },
    {
      title: "User Actions",
      value: userActions,
      color: "border-purple-500",
    },
    {
      title: "Failed Actions",
      value: failedActions,
      color: "border-red-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`rounded-xl border-l-4 ${card.color} bg-white p-6 shadow`}
        >
          <h3 className="text-sm font-medium text-gray-500">
            {card.title}
          </h3>

          <p className="mt-3 text-3xl font-bold text-gray-800">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}