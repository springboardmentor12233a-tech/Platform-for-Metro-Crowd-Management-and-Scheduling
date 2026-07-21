function ConfidenceBar({ confidence }) {
  return (
    <div>

      <div className="flex justify-between mb-1">
        <span>{confidence}%</span>
      </div>

      <div className="h-2 rounded-full bg-slate-200">

        <div
          className="bg-green-500 h-full rounded-full"
          style={{
            width: `${confidence}%`,
          }}
        />

      </div>

    </div>
  );
}

export default ConfidenceBar;