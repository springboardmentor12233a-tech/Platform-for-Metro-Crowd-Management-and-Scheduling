import { Routes, Route, Navigate, Outlet } from "react-router-dom";

import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import CrowdMonitoring from "./pages/CrowdMonitoring/CrowdMonitoring";
import Schedule from "./pages/Schedule";
import Analytics from "./pages/Analytics/Analytics";
import Settings from "./pages/Settings/Settings";
import Prediction from "./pages/Prediction/Prediction";
import Forecast from "./pages/Forecast/Forecast";
import PredictionHistory from "./pages/PredictionHistory/PredictionHistory";
import SmartSchedule from "./pages/SmartSchedule/SmartSchedule";
import AIAlerts from "./pages/AIAlerts/AIAlerts";
import AI from "./pages/AI";

import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import UserManagement from "./pages/UserManagement";
import Unauthorized from "./pages/Unauthorized/Unauthorized";

import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleGuard from "./components/RoleGuard";

import { useAuth } from "./context/AuthContext";

function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function ProtectedLayout() {
  return (
    <ProtectedRoute>
      <Layout>
        <Outlet />
      </Layout>
    </ProtectedRoute>
  );
}

function App() {
  return (
    <Routes>
      {/* ================= PUBLIC ROUTES ================= */}

      <Route
        path="/"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        }
      />

      <Route
        path="/reset-password"
        element={
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        }
      />

      {/* ================= PROTECTED ROUTES ================= */}

      <Route element={<ProtectedLayout />}>
        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Crowd Monitoring */}
        <Route
          path="/crowd"
          element={
            <RoleGuard allowedRoles={["Admin", "Operator", "Analyst"]}>
              <CrowdMonitoring />
            </RoleGuard>
          }
        />

        {/* Prediction */}
        <Route
          path="/prediction"
          element={
            <RoleGuard allowedRoles={["Admin", "Operator", "Analyst"]}>
              <Prediction />
            </RoleGuard>
          }
        />

        <Route
          path="/forecast"
          element={
            <RoleGuard allowedRoles={["Admin", "Operator", "Analyst"]}>
              <Forecast />
            </RoleGuard>
          }
        />

        <Route
          path="/prediction-history"
          element={
            <RoleGuard allowedRoles={["Admin", "Operator", "Analyst"]}>
              <PredictionHistory />
            </RoleGuard>
          }
        />

        {/* Schedule */}
        <Route
          path="/schedule"
          element={
            <RoleGuard allowedRoles={["Admin", "Operator"]}>
              <Schedule />
            </RoleGuard>
          }
        />

        <Route
          path="/smart-schedule"
          element={
            <RoleGuard allowedRoles={["Admin", "Operator"]}>
              <SmartSchedule />
            </RoleGuard>
          }
        />

        {/* Alerts */}
        <Route
          path="/alerts"
          element={
            <RoleGuard allowedRoles={["Admin", "Operator", "Analyst"]}>
              <AIAlerts />
            </RoleGuard>
          }
        />

        {/* Analytics */}
        <Route
          path="/analytics"
          element={
            <RoleGuard allowedRoles={["Admin", "Operator", "Analyst"]}>
              <Analytics />
            </RoleGuard>
          }
        />

        {/* AI */}
        <Route
          path="/ai"
          element={
            <RoleGuard allowedRoles={["Admin", "Operator", "Analyst"]}>
              <AI />
            </RoleGuard>
          }
        />

        {/* Settings */}
        <Route
          path="/settings"
          element={
            <RoleGuard allowedRoles={["Admin"]}>
              <Settings />
            </RoleGuard>
          }
        />

        {/* User Management */}
        <Route
          path="/users"
          element={
            <RoleGuard allowedRoles={["Admin"]}>
              <UserManagement />
            </RoleGuard>
          }
        />
      </Route>

      {/* ================= OTHER ROUTES ================= */}

      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Temporary fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;