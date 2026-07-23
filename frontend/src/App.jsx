import { AuthProvider, useAuth } from './context/AuthContext';
import { RouterProvider, useLocation } from './router';
import Sidebar from './components/Sidebar';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CrowdPage from './pages/CrowdPage';
import SchedulesPage from './pages/SchedulesPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AlertsPage from './pages/AlertsPage';
import StationsPage from './pages/StationsPage';

function Topbar({ title, subtitle }) {
  return (
    <div className="topbar">
      <div>
        <div className="topbar-title">{title}</div>
        {subtitle && <div className="topbar-subtitle">{subtitle}</div>}
      </div>
      <div className="topbar-actions">
        <div className="topbar-badge">
          <div className="live-dot" />
          Live
        </div>
      </div>
    </div>
  );
}

const PAGE_META = {
  '/': { title: 'Dashboard', subtitle: 'Real-time metro crowd overview' },
  '/crowd': { title: 'Crowd Intelligence', subtitle: 'ML-powered density forecasting' },
  '/schedules': { title: 'Train Schedules', subtitle: 'Timetables & optimization' },
  '/analytics': { title: 'Analytics & Reports', subtitle: 'Historical analysis & export' },
  '/alerts': { title: 'Alerts Management', subtitle: 'System warnings & incidents' },
  '/stations': { title: 'Metro Stations', subtitle: 'Station directory & status' },
  '/users': { title: 'User Management', subtitle: 'Accounts and roles' },
};

function AppRouter() {
  const { user, loading } = useAuth();
  const { pathname } = useLocation();

  if (loading) {
    return (
      <div className="loading-container" style={{ minHeight: '100vh' }}>
        <div className="spinner" />
        <span>Loading MetroFlow…</span>
      </div>
    );
  }

  if (!user) {
    if (pathname === '/register') return <RegisterPage />;
    return <LoginPage />;
  }

  const meta = PAGE_META[pathname] || { title: 'MetroFlow' };

  const renderPage = () => {
    switch (pathname) {
      case '/': return <DashboardPage />;
      case '/crowd': return <CrowdPage />;
      case '/schedules': return <SchedulesPage />;
      case '/analytics': return <AnalyticsPage />;
      case '/alerts': return <AlertsPage />;
      case '/stations': return <StationsPage />;
      default: return <DashboardPage />;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar title={meta.title} subtitle={meta.subtitle} />
        {renderPage()}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </RouterProvider>
  );
}
