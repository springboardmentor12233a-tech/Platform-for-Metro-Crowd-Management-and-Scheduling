'use client';

import { useEffect, useState } from "react";
import styles from "./DensityChart.module.css";
import { StationData, CrowdHistoryData, fetchCrowdHistory } from "@/lib/api";

interface DensityChartProps {
  selectedStationId: number | null;
  stations: StationData[];
}

export default function DensityChart({ selectedStationId, stations }: DensityChartProps) {
  const [history, setHistory] = useState<CrowdHistoryData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedStationId) {
      setHistory(null);
      return;
    }
    let isMounted = true;
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchCrowdHistory(selectedStationId, 48);
        if (isMounted) setHistory(data);
      } catch (e) {
        console.error("Failed to fetch crowd history", e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadData();
    return () => { isMounted = false; };
  }, [selectedStationId]);

  if (!selectedStationId) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>Select a station on the map to view density data</div>
      </div>
    );
  }

  const stationName = stations.find(s => s.id === selectedStationId)?.name || 'Unknown Station';

  let maxEntry = 1;
  if (history?.readings?.length) {
    maxEntry = Math.max(...history.readings.map(r => r.entry_count || 1));
  }

  const getBarColor = (density: string) => {
    switch (density?.toLowerCase()) {
      case 'low': return '#00f2ff';
      case 'moderate': return '#ffe173';
      case 'high': return '#ff8c00';
      case 'critical': return 'var(--error-container)';
      default: return '#00f2ff';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>Crowd Density — {stationName}</h2>
        <span className={styles.timeLabel}>LAST 48 HOURS</span>
      </div>

      <div className={styles.chartArea}>
        {/* Horizontal grid lines */}
        <div className={styles.gridLines}>
          <div className={styles.gridLine} />
          <div className={styles.gridLine} />
          <div className={styles.gridLine} />
        </div>

        {loading ? (
          <div className={styles.loadingState}>Loading data...</div>
        ) : (
          <div className={styles.barChartContainer}>
            {history?.readings?.map((reading, i) => {
              const heightPct = Math.max((reading.entry_count / maxEntry) * 100, 2);
              const isLabel = i % 8 === 0;
              const date = new Date(reading.timestamp);
              const label = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
              
              return (
                <div key={i} className={styles.barWrapper}>
                  <div 
                    className={styles.bar} 
                    style={{ 
                      height: `${heightPct}%`,
                      backgroundColor: getBarColor(reading.density_level)
                    }} 
                    title={`Entries: ${reading.entry_count}\nDensity: ${reading.density_level}`}
                  />
                  {isLabel && <div className={styles.barLabel}>{label}</div>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
