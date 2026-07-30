import DashboardCards from "../components/DashboardCards";
import StatisticsChart from "../components/StatisticsChart";
import PieChart from "../components/PieChart";
import LineChart from "../components/LineChart";
import DoughnutChart from "../components/DoughnutChart";
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
  <>
    {/* Header */}
    <DashboardHeader />

    {/* KPI Cards */}
    <KPIGrid data={data} />

    {/* AI Insights + Quick Actions */}
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
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
  </>
);
      
      }

export default Dashboard;