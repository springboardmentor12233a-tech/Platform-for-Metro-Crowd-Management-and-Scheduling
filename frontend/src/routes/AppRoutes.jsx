import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import CrowdPrediction from "../pages/CrowdPrediction";
import ProtectedRoute from "../components/ProtectedRoute";
import History from "../pages/History";
function AppRoutes() {
  return (
    <Routes>

      {/* Login */}
      <Route path="/login" element={<Login />} />

      {/* Protected Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Protected Prediction */}
      <Route
        path="/prediction"
        element={
          <ProtectedRoute>
            <CrowdPrediction />
          </ProtectedRoute>
        }
      />
      <Route path="/history" element={<History />} />
      {/* Default Route */}
      <Route path="*" element={<Login />} />

    </Routes>
  );
}

export default AppRoutes;