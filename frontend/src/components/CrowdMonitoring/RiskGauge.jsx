function RiskGauge({ score }) {
  let color = "bg-green-500";

  if (score >= 8)
    color = "bg-red-500";
  else if (score >= 5)
    color = "bg-yellow-500";

  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="font-semibold">
          {score}/10
        </span>
      </div>

      <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
        <div
          className={`${color} h-full`}
          style={{
            width: `${score * 10}%`,
          }}
        />
      </div>
    </div>
  );
}

export default RiskGauge;