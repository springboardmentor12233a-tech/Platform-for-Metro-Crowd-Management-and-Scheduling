function IncidentSort({
  sortBy,
  setSortBy,
}) {
  return (
    <select
      value={sortBy}
      onChange={(e) => setSortBy(e.target.value)}
      className="px-4 py-3 rounded-xl border bg-white shadow-sm"
    >
      <option value="severity">
        Sort by Severity
      </option>

      <option value="passengers">
        Sort by Passenger Impact
      </option>

      <option value="time">
        Sort by Report Time
      </option>
    </select>
  );
}

export default IncidentSort;