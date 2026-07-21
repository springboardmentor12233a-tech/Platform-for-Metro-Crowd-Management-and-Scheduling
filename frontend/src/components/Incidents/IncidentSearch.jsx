import { Search } from "lucide-react";

function IncidentSearch({ search, setSearch }) {
  return (
    <div className="relative">
      <Search
        className="absolute left-4 top-3 text-slate-400"
        size={18}
      />

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by station, incident or line..."
        className="w-full pl-12 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none"
      />
    </div>
  );
}

export default IncidentSearch;