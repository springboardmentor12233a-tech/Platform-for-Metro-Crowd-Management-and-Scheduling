function TrainStatusBadge({ status }) {

  const styles = {
    "On Time":
      "bg-green-100 text-green-700",

    Delayed:
      "bg-red-100 text-red-700",

    Boarding:
      "bg-blue-100 text-blue-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );

}

export default TrainStatusBadge;