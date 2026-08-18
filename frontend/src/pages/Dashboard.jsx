import SystemStatus from "../components/SystemStatus";
import AIAssistant from "../components/AIAssistant";
import AIChat from "../components/AIChat";

import AIInsights from "../components/dashboard/AIInsights";
import QuickActions from "../components/dashboard/QuickActions";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import KPIGrid from "../components/dashboard/KPIGrid";
import ChartsSection from "../components/dashboard/ChartsSection";
import DownloadCenter from "../components/dashboard/DownloadCenter";

function Dashboard({ data }) {
  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        boxSizing: "border-box",
        background: "#f8fafc",
      }}
    >
      {/* Header */}
      <DashboardHeader />

      {/* KPI Cards */}
      <KPIGrid data={data} />

      {/* AI Insights + Quick Actions */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 2fr) minmax(280px, 1fr)",
          gap: "20px",
          marginBottom: "25px",
        }}
      >
        <AIInsights data={data} />
        <QuickActions />
      </div>

      {/* System Status */}
      <SystemStatus data={data} />

      {/* Charts */}
      <ChartsSection data={data} />

      {/* AI Assistant */}
      <AIAssistant data={data} />

      {/* Download Center */}
      <DownloadCenter />

      {/* Floating AI Chat */}
      <AIChat />
    </div>
  );
}

export default Dashboard;