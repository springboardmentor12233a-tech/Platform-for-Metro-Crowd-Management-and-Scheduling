function MetroLegend() {
  return (
    <div className="flex flex-wrap gap-6 mt-6">

      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-full bg-green-500" />
        <span>Normal</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-full bg-yellow-500" />
        <span>Busy</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-full bg-red-500" />
        <span>Crowded</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-full bg-indigo-600" />
        <span>Train</span>
      </div>

    </div>
  );
}

export default MetroLegend;