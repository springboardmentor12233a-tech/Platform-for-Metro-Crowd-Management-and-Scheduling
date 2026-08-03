import React, { useEffect, useState } from 'react';
import { useWebSocket } from '../context/WebSocketContext';
import { stationService } from '../services/api';
import MapComponent from '../components/MapComponent';
import { Filter, Search, MapPin, Layers, RefreshCw } from 'lucide-react';

export default function NetworkMap() {
  const { telemetry } = useWebSocket();
  const [stations, setStations] = useState([]);
  const [selectedLine, setSelectedLine] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStation, setSelectedStation] = useState(null);

  useEffect(() => {
    stationService.getStations()
      .then(res => setStations(res.data))
      .catch(err => console.error(err));
  }, []);

  const displayStations = telemetry?.stations || stations;

  const filteredStations = displayStations.filter(s => {
    const matchesLine = selectedLine === 'ALL' || s.line.toLowerCase().includes(selectedLine.toLowerCase());
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.station_id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLine && matchesSearch;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto h-[calc(100vh-5rem)] flex flex-col">
      {/* Control Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white">Metro Network GIS Intelligence</h1>
          <p className="text-sm text-slate-400">Interactive line topology & occupancy monitoring</p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search station..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center space-x-1.5 glass-panel px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <Filter className="w-3.5 h-3.5 text-indigo-400" />
            <select
              value={selectedLine}
              onChange={(e) => setSelectedLine(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none text-xs"
            >
              <option value="ALL">All Metro Lines</option>
              <option value="Yellow">Yellow Line</option>
              <option value="Red">Red Line</option>
              <option value="Blue">Blue Line</option>
              <option value="Pink">Pink Line</option>
              <option value="Violet">Violet Line</option>
              <option value="Magenta">Magenta Line</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Map View & Side Inspector */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
        {/* Map Container */}
        <div className="lg:col-span-3 h-full">
          <MapComponent stations={filteredStations} selectedLine={selectedLine} />
        </div>

        {/* Station Inspector Panel */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col space-y-4 overflow-hidden">
          <h2 className="text-base font-bold font-heading text-white flex items-center space-x-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>Station Directory ({filteredStations.length})</span>
          </h2>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredStations.map((st) => (
              <div
                key={st.station_id || st.name}
                onClick={() => setSelectedStation(st)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  selectedStation?.station_id === st.station_id
                    ? 'bg-indigo-600/20 border-indigo-500/60'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-semibold text-white">
                  <span>{st.name}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    st.status === 'Red' ? 'bg-rose-500/20 text-rose-400' :
                    st.status === 'Orange' ? 'bg-orange-500/20 text-orange-400' :
                    st.status === 'Yellow' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {st.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                  <span>{st.line}</span>
                  <span className="font-semibold text-slate-200">{st.current_footfall || 450} passengers</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
