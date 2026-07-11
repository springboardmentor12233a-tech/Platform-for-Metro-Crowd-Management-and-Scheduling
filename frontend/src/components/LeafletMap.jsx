import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import api from '../services/api';

// Fix Leaflet icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Helper to create custom glowing HTML markers for stations
const createStationIcon = (color, name, isDark) => {
  const colorMap = {
    Green: '#22c55e',
    Yellow: '#eab308',
    Orange: '#f97316',
    Red: '#ef4444'
  };
  const hex = colorMap[color] || '#3b82f6';
  
  return L.divIcon({
    className: 'custom-map-icon',
    html: `
      <div class="relative flex items-center justify-center">
        <div class="w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 shadow-md transition-all duration-300" style="background-color: ${hex};"></div>
        <div class="absolute w-6 h-6 rounded-full opacity-40 animate-ping" style="background-color: ${hex};"></div>
      </div>
    `,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
};

// Helper to create custom HTML markers for trains
const createTrainIcon = (color) => {
  const colorMap = {
    Green: '#22c55e',
    Yellow: '#eab308',
    Orange: '#f97316',
    Red: '#ef4444'
  };
  const hex = colorMap[color] || '#3b82f6';

  return L.divIcon({
    className: 'custom-map-icon',
    html: `
      <div class="relative flex items-center justify-center">
        <div class="w-6 h-6 rounded-xl bg-slate-900 border border-slate-700 shadow-lg text-white flex items-center justify-center hover:scale-110 transition-all duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${hex}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-train"><path d="M4 3h16a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/><path d="M4 10h16v8H4z"/><path d="M12 18v4"/><path d="m8 22 1-4"/><path d="m16 22-1-4"/><path d="M8 6h8"/></svg>
        </div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

const LeafletMap = ({ stationsData = [], trainsData = [] }) => {
  const [routes, setRoutes] = useState([]);
  const delhiCenter = [28.6139, 77.2090];

  // Fetch routes from API to draw the lines
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await api.get('/stations'); // we can fetch all stations
        // We will group stationsData by line to draw lines if backend routes are not available
      } catch (err) {
        console.error("Error fetching map routes:", err);
      }
    };
    fetchRoutes();
  }, []);

  // Group stations by line and sort by coordinates to draw connection polylines
  const renderPolylines = () => {
    const lines = {};
    stationsData.forEach(s => {
      if (!lines[s.line]) lines[s.line] = [];
      lines[s.line].push(s);
    });

    const colorsMap = {
      "Red line": "#ef4444",
      "Yellow line": "#eab308",
      "Blue line": "#3b82f6",
      "Pink line": "#ec4899",
      "Magenta line": "#d946ef",
      "Violet line": "#8b5cf6",
      "Green line": "#22c55e",
      "Aqua line": "#06b6d4",
      "Rapid Metro": "#64748b"
    };

    return Object.keys(lines).map(lineName => {
      // Sort stations roughly by distance or latitude to draw a continuous path
      const sortedStations = [...lines[lineName]].sort((a, b) => a.latitude - b.latitude);
      const positions = sortedStations.map(s => [s.latitude, s.longitude]);
      
      if (positions.length < 2) return null;
      
      const strokeColor = colorsMap[lineName] || "#6366f1";
      
      return (
        <Polyline 
          key={lineName} 
          positions={positions} 
          pathOptions={{ 
            color: strokeColor, 
            weight: 3.5, 
            opacity: 0.85,
            dashArray: lineName === "Rapid Metro" ? "4, 6" : undefined
          }} 
        />
      );
    });
  };

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden border border-slate-200/50 dark:border-slate-800/40 relative shadow-xl">
      <MapContainer 
        center={delhiCenter} 
        zoom={11.5} 
        scrollWheelZoom={true} 
        className="w-full h-full"
      >
        {/* Modern dark map tiles from CartoDB */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* Draw metro line tracks */}
        {renderPolylines()}

        {/* Render Station Markers */}
        {stationsData.map((station) => (
          <Marker
            key={station.station_id || station.id}
            position={[station.latitude, station.longitude]}
            icon={createStationIcon(station.crowd_level || 'Green', station.name)}
          >
            <Popup className="custom-popup">
              <div className="p-2 min-w-40 text-slate-900 dark:text-slate-100">
                <h4 className="font-bold text-sm border-b pb-1 mb-1.5 flex justify-between items-center">
                  <span>{station.name}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-extrabold uppercase ${
                    station.crowd_level === 'Red'
                      ? 'bg-red-500/10 text-red-600'
                      : station.crowd_level === 'Orange'
                      ? 'bg-orange-500/10 text-orange-600'
                      : station.crowd_level === 'Yellow'
                      ? 'bg-yellow-500/10 text-yellow-600'
                      : 'bg-green-500/10 text-green-600'
                  }`}>
                    {station.crowd_level}
                  </span>
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1"><b>Line:</b> {station.line}</p>
                <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t text-[11px] font-semibold">
                  <div>
                    <p className="opacity-65">Riders</p>
                    <p className="text-sm font-bold text-blue-600 dark:text-blue-400">{station.passenger_count}</p>
                  </div>
                  <div>
                    <p className="opacity-65">Density</p>
                    <p className="text-sm font-bold">{station.crowd_percentage}%</p>
                  </div>
                  <div>
                    <p className="opacity-65">Inflow</p>
                    <p className="text-green-500 font-bold">+{station.inflow}</p>
                  </div>
                  <div>
                    <p className="opacity-65">Outflow</p>
                    <p className="text-red-500 font-bold">-{station.outflow}</p>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Render Live Moving Trains */}
        {trainsData.map((train) => (
          <Marker
            key={train.train_id}
            position={[train.latitude, train.longitude]}
            icon={createTrainIcon(train.crowd_level || 'Green')}
          >
            <Popup>
              <div className="p-2 min-w-44 text-slate-900 dark:text-slate-100">
                <h4 className="font-bold text-sm border-b pb-1 mb-1 flex justify-between items-center">
                  <span>{train.train_number}</span>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">{train.status}</span>
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold mb-1"><b>Name:</b> {train.train_name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1"><b>At Station:</b> {train.current_station}</p>
                <div className="mt-2 pt-2 border-t">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Occupancy:</span>
                    <span className="font-bold">{train.current_occupancy} / {train.capacity} ({train.occupancy_percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        train.crowd_level === 'Red' ? 'bg-red-500' : train.crowd_level === 'Orange' ? 'bg-orange-500' : train.crowd_level === 'Yellow' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${train.occupancy_percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default LeafletMap;
