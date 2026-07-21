const filters = [
  "All",
  "Active",
  "Monitoring",
  "Resolved",
];

function IncidentFilters({
  selectedFilter,
  setSelectedFilter,
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => setSelectedFilter(filter)}
          className={`px-4 py-2 rounded-xl transition
          ${
            selectedFilter === filter
              ? "bg-indigo-600 text-white"
              : "bg-white border hover:bg-slate-100"
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}

export default IncidentFilters;