function StationPulse({ status }) {

  const color = {
    normal: "bg-green-400",
    busy: "bg-yellow-400",
    crowded: "bg-red-400",
  };

  return (
    <div
      className={`absolute inset-0 rounded-full opacity-40 animate-ping ${color[status]}`}
    />
  );
}

export default StationPulse;