import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker } from 'react-leaflet';
import L from 'leaflet';

// Line color hex mappings
const lineColors = {
  'Yellow Line': '#eab308',
  'Yellow': '#eab308',
  'Red Line': '#ef4444',
  'Red': '#ef4444',
  'Blue Line': '#3b82f6',
  'Blue': '#3b82f6',
  'Pink Line': '#ec4899',
  'Pink': '#ec4899',
  'Violet Line': '#8b5cf6',
  'Violet': '#8b5cf6',
  'Magenta Line': '#d946ef',
  'Magenta': '#d946ef'
};

const getStatusColor = (status) => {
  switch (status?.toUpperCase()) {
    case 'RED': return '#ef4444';
    case 'ORANGE': return '#f97316';
    case 'YELLOW': return '#eab308';
    default: return '#10b981';
  }
};

// Custom train icon generator
const createTrainIcon = (lineColor, name) => {
  return L.divIcon({
    className: 'custom-train-marker',
    html: `
      <div style="
        background-color: ${lineColor || '#6366f1'};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 2px solid #ffffff;
        box-shadow: 0 0 10px ${lineColor || '#6366f1'};
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 11px;
      ">
        🚆
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

export default function MapComponent({ stations = [], trains = [], selectedLine = 'ALL' }) {
  const position = [28.62, 77.22]; // Delhi Center

  // Filter stations by line if selected
  const filteredStations = selectedLine === 'ALL' 
    ? stations 
    : stations.filter(s => s.line.toLowerCase().includes(selectedLine.toLowerCase()));

  // Group stations into polyline lines
  const linesMap = {};
  filteredStations.forEach(s => {
    const lineKey = s.line || 'Yellow Line';
    if (!linesMap[lineKey]) linesMap[lineKey] = [];
    linesMap[lineKey].push([s.latitude, s.longitude]);
  });

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden glass-panel relative border border-slate-800">
      <MapContainer 
        center={position} 
        zoom={12} 
        scrollWheelZoom={true} 
        className="w-full h-full z-10"
      >
        {/* Dark theme tile layer */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CartoDB</a> Dark Matter'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* Polylines for Metro Lines */}
        {Object.entries(linesMap).map(([lineName, coords]) => (
          <Polyline
            key={lineName}
            positions={coords}
            pathOptions={{
              color: lineColors[lineName] || '#6366f1',
              weight: 4,
              opacity: 0.8,
              dashArray: '8, 8'
            }}
          />
        ))}

        {/* Station Glowing Markers */}
        {filteredStations.map((st) => {
          const color = getStatusColor(st.status);
          return (
            <CircleMarker
              key={st.station_id || st.name}
              center={[st.latitude, st.longitude]}
              radius={st.status === 'Red' ? 12 : (st.status === 'Orange' ? 10 : 8)}
              pathOptions={{
                color: color,
                fillColor: color,
                fillOpacity: 0.8,
                weight: 2
              }}
            >
              <Popup>
                <div className="p-2 space-y-1 text-slate-100 font-sans">
                  <div className="flex items-center justify-between space-x-3 border-b border-slate-700 pb-1">
                    <h3 className="font-bold text-sm text-white">{st.name}</h3>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                      st.status === 'Red' ? 'bg-rose-500/20 text-rose-400' :
                      st.status === 'Orange' ? 'bg-orange-500/20 text-orange-400' :
                      st.status === 'Yellow' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {st.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">Line: <span className="font-semibold text-cyan-400">{st.line}</span></p>
                  <p className="text-xs text-slate-300">Current Footfall: <span className="font-bold text-indigo-300">{st.current_footfall || 450} passengers</span></p>
                  <p className="text-xs text-slate-400">Platforms: {st.platform_count || 4}</p>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}

        {/* Moving Trains Markers */}
        {trains.map((tr) => {
          // Approximate train location from station or coordinates
          const stationObj = stations.find(s => s.station_id === tr.current_station_id) || stations[0];
          const trainPos = stationObj ? [stationObj.latitude + 0.003, stationObj.longitude + 0.003] : position;
          const lineColor = lineColors[tr.line] || '#6366f1';

          return (
            <Marker
              key={tr.train_id}
              position={trainPos}
              icon={createTrainIcon(lineColor, tr.name)}
            >
              <Popup>
                <div className="p-2 space-y-1">
                  <h4 className="font-bold text-sm text-indigo-400">{tr.name} ({tr.train_id})</h4>
                  <p className="text-xs text-slate-300">Line: {tr.line}</p>
                  <p className="text-xs text-slate-300">Occupancy: <span className="font-semibold text-emerald-400">{tr.occupancy_rate || 75}%</span></p>
                  <p className="text-xs text-slate-400">Status: {tr.status}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
