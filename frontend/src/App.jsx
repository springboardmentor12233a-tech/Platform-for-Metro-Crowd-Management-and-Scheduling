import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

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

import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import UserManagement from "./pages/UserManagement/UserManagement";
import CreateUser from "./pages/UserManagement/CreateUser";
import Unauthorized from "./pages/Unauthorized/Unauthorized";
import NotFound from "./pages/NotFound/NotFound";

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

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= PUBLIC ================= */}

        <Route
          path="/"
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
          path="/reset-password/:token"
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          }
        />

        {/* ================= DASHBOARD ================= */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* ================= CROWD ================= */}

        <Route
          path="/crowd"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["Admin", "Operator", "Analyst"]}>
                <CrowdMonitoring />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* ================= PREDICTION ================= */}

        <Route
          path="/prediction"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["Admin", "Operator", "Analyst"]}>
                <Prediction />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/forecast"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["Admin", "Operator", "Analyst"]}>
                <Forecast />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/prediction-history"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["Admin", "Operator", "Analyst"]}>
                <PredictionHistory />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* ================= SCHEDULE ================= */}

        <Route
          path="/schedule"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["Admin", "Operator"]}>
                <Schedule />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/smart-schedule"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["Admin", "Operator"]}>
                <SmartSchedule />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* ================= ALERTS ================= */}

        <Route
          path="/alerts"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["Admin", "Operator", "Analyst"]}>
                <AIAlerts />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* ================= ANALYTICS ================= */}

        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["Admin", "Operator", "Analyst"]}>
                <Analytics />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* ================= AI ================= */}

        <Route
          path="/ai"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["Admin", "Operator", "Analyst"]}>
                <AI />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* ================= SETTINGS ================= */}

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["Admin"]}>
                <Settings />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* ================= USER MANAGEMENT ================= */}

        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["Admin"]}>
                <UserManagement />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/users/create"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["Admin"]}>
                <CreateUser />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* ================= UNAUTHORIZED ================= */}

        <Route
          path="/unauthorized"
          element={<Unauthorized />}
        />

        {/* ================= 404 ================= */}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;