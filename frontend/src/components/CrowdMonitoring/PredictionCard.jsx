function PredictionCard({
  prediction,
}) {
  const increase =
    prediction.change >= 0;

  return (
    <div>

      <div className="text-3xl font-bold">
        {prediction.next_15_min}%
      </div>

      <div
        className={
          increase
            ? "text-red-500"
            : "text-green-500"
        }
      >
        {increase ? "+" : ""}
        {prediction.change}%

        <span className="text-slate-400 ml-2">
          Next 15 min
        </span>
      </div>

    </div>
  );
}

export default PredictionCard;