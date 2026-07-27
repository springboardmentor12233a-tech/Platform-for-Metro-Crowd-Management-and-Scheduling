'use client';

import styles from "./NetworkViz.module.css";
import { StationData, LiveCrowdData } from "@/lib/api";

interface NetworkVizProps {
  stations: StationData[];
  crowdLive: LiveCrowdData[];
  onStationClick: (id: number) => void;
}

export default function NetworkViz({ stations, crowdLive, onStationClick }: NetworkVizProps) {
  // Filter to Delhi Metro stations only
  const delhiStations = stations.filter(s => s.line_name !== 'MTA Subway');
  
  const onlineCount = delhiStations.length;

  // Normalize lat/lon to fit the container
  let minLat = Infinity, maxLat = -Infinity;
  let minLon = Infinity, maxLon = -Infinity;
  
  delhiStations.forEach(s => {
    if (s.latitude < minLat) minLat = s.latitude;
    if (s.latitude > maxLat) maxLat = s.latitude;
    if (s.longitude < minLon) minLon = s.longitude;
    if (s.longitude > maxLon) maxLon = s.longitude;
  });

  const getPos = (lat: number, lon: number) => {
    if (minLat === maxLat || minLon === maxLon) return { top: '50%', left: '50%' };
    // Invert lat so higher lat is top
    const yPct = 5 + ((maxLat - lat) / (maxLat - minLat)) * 90;
    const xPct = 5 + ((lon - minLon) / (maxLon - minLon)) * 90;
    return { top: `${yPct}%`, left: `${xPct}%` };
  };

  const getDensityClass = (stationId: number) => {
    const crowd = crowdLive?.find(c => c.station_id === stationId);
    if (!crowd || !crowd.density_level) return styles.densityLow;
    switch (crowd.density_level.toLowerCase()) {
      case 'low': return styles.densityLow;
      case 'moderate': return styles.densityModerate;
      case 'high': return styles.densityHigh;
      case 'critical': return styles.densityCritical;
      default: return styles.densityLow;
    }
  };

  return (
    <div className={styles.container}>
      {/* Header Bar */}
      <div className={styles.header}>
        <h2 className={styles.title}>Live Network Visualization</h2>
        <div className={styles.buttons}>
          <button className={styles.btnGhost}>TOPOLOGICAL</button>
          <button className={styles.btnActive}>RADAR</button>
        </div>
      </div>

      {/* Radar Canvas */}
      <div className={styles.canvas}>
        {/* Dot grid background */}
        <div className={styles.dotGrid} />

        {/* Center label */}
        <div className={styles.radarText}>[ {onlineCount} STATIONS ONLINE ]</div>

        {/* Render real station nodes */}
        {delhiStations.map(station => {
          const pos = getPos(station.latitude, station.longitude);
          const size = station.is_interchange ? 12 : 8;
          const densityClass = getDensityClass(station.id);
          
          return (
            <div 
              key={station.id} 
              className={`${styles.stationNode} ${densityClass}`}
              style={{ 
                ...pos,
                width: size,
                height: size,
                marginTop: -size / 2,
                marginLeft: -size / 2
              }}
              onClick={() => onStationClick(station.id)}
            >
              <div className={styles.tooltip}>{station.name}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
