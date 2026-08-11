'use client';

import KPICard from './KPICard';
import {
  Activity,
  Navigation,
  AlertCircle,
  Users,
  TrendingUp,
  Zap
} from 'lucide-react';


interface DashboardContentProps {
  data: any;
  healthStatus: string;
  currentTime: Date;
}


export default function DashboardContent({
  data,
  healthStatus,
  currentTime
}: DashboardContentProps) {


  const totalPassengers =
    data?.kpiData?.kpis?.total_passengers_today || 0;


  return (

    <main className="max-w-7xl mx-auto px-6 py-8">


      {/* KPI SECTION */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">


        <KPICard
          title="API Status"
          value={healthStatus.toUpperCase()}
          subtitle="Backend connection"
          icon={Activity}
          iconColor="text-cyan-400"
          borderColor="border-cyan-500/30"
          badge="LIVE"
        />


        <KPICard
          title="Active Stations"
          value={
            data?.kpiData?.kpis?.active_stations || 0
          }
          subtitle="Operational stations"
          icon={Navigation}
          iconColor="text-green-400"
          borderColor="border-green-500/30"
        />


        <KPICard
          title="Active Alerts"
          value={
            data?.kpiData?.kpis?.active_alerts || 0
          }
          subtitle="Current alerts"
          icon={AlertCircle}
          iconColor="text-yellow-400"
          borderColor="border-yellow-500/30"
        />


        <KPICard
          title="Congested Stations"
          value={
            data?.kpiData?.kpis?.congested_stations || 0
          }
          subtitle="High crowd stations"
          icon={Users}
          iconColor="text-red-400"
          borderColor="border-red-500/30"
        />


      </div>


      


    </main>

  );
}