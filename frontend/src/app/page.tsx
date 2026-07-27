'use client';
import { useState } from 'react';
import styles from './page.module.css';
import Sidebar from '@/components/Sidebar/Sidebar';
import TopHeader from '@/components/TopHeader/TopHeader';
import KpiCard from '@/components/KpiCard/KpiCard';
import NetworkViz from '@/components/NetworkViz/NetworkViz';
import DensityChart from '@/components/DensityChart/DensityChart';
import AlertFeed from '@/components/AlertFeed/AlertFeed';
import AuthGuard from '@/components/AuthGuard/AuthGuard';
import { useDashboardData } from '@/hooks/useDashboardData';

export default function Dashboard() {
  const { stations, crowdLive, alerts, kpis, isLoading, refetch } = useDashboardData();
  const [selectedStationId, setSelectedStationId] = useState<number | null>(null);

  return (
    <AuthGuard>
      <div className={styles.dashboard}>
        <div className={styles.sidebarArea}>
          <Sidebar />
        </div>
        <div className={styles.headerArea}>
          <TopHeader />
        </div>
        <main className={styles.mainArea}>
          <div className={styles.kpiRow}>
            <KpiCard
              label="Total Stations"
              value={isLoading ? '...' : String(kpis?.totalStations || 0)}
              icon="train"
              accentColor="var(--primary-container)"
              valueColor="var(--primary)"
            />
            <KpiCard
              label="Active Alerts"
              value={isLoading ? '...' : String(kpis?.activeAlerts || 0)}
              icon="warning"
              accentColor="var(--secondary-container)"
              valueColor="var(--secondary)"
            />
            <KpiCard
              label="Avg Occupancy"
              value={isLoading ? '...' : String(kpis?.avgOccupancy || 0)}
              icon="groups"
              accentColor="var(--primary-container)"
              valueColor="var(--primary)"
            />
            <KpiCard
              label="Critical Zones"
              value={isLoading ? '...' : String(kpis?.criticalStations || 0)}
              icon="crisis_alert"
              accentColor="var(--tertiary-fixed)"
              valueColor="var(--tertiary-fixed)"
            />
          </div>
          <NetworkViz stations={stations || []} crowdLive={crowdLive || []} onStationClick={setSelectedStationId} />
          <DensityChart selectedStationId={selectedStationId} stations={stations || []} />
        </main>
        <div className={styles.alertArea}>
          <AlertFeed alerts={alerts} onRefetch={refetch} />
        </div>
      </div>
    </AuthGuard>
  );
}
