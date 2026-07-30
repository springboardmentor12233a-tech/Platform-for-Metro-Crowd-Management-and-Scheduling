import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import CrowdPrediction from "../pages/CrowdPrediction";
import History from "../pages/History";
import EmergencyAnnouncement from "../pages/EmergencyAnnouncement";
import SmartAlerts from "../pages/SmartAlerts";
import ScheduleUpdates from "../pages/ScheduleUpdates";
import AnalyticsDashboard from "../pages/AnalyticsDashboard";
import CongestionHeatmap from "../pages/CongestionHeatmap";
import Monitoring from "../pages/Monitoring";
import Reports from "../pages/Reports";
import Schedule from "../pages/Schedule";
import ProtectedRoute from "../components/ProtectedRoute";
import DashboardLayout from "../components/DashboardLayout";
import Frequency from "../pages/Frequency";


function AppRoutes() {
  return (
    <Routes>

      {/* Public Routes */}

      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />

      <Route path="/signup" element={<Signup />} />

      {/* Protected Layout */}

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/prediction" element={<CrowdPrediction />} />

        <Route path="/history" element={<History />} />

        <Route
          path="/emergency-announcement"
          element={<EmergencyAnnouncement />}
        />

        <Route
          path="/smart-alerts"
          element={<SmartAlerts />}
        />

        <Route
          path="/schedule-updates"
          element={<ScheduleUpdates />}
        />

        <Route
          path="/analytics-dashboard"
          element={<AnalyticsDashboard />}
        />

        <Route
          path="/heatmap"
          element={<CongestionHeatmap />}
        />
        <Route path="/monitoring" element={<Monitoring />} />
        <Route path="/reports" element={<Reports />} />
         <Route path="/schedule" element={<Schedule />} />
         <Route path="/frequency" element={<Frequency />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />

    </Routes>
  );
}

export default AppRoutes;