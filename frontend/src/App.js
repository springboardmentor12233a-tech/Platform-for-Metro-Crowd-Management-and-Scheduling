import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Prediction from "./pages/Prediction";
import Schedule from "./pages/Schedule";
import Monitoring from "./pages/Monitoring";
import Forecast from "./pages/Forecast";
import Report from "./pages/Report";
import Notifications from "./pages/Notifications";
import Announcement from "./pages/Announcement";
import Analytics from "./pages/Analytics";
import Heatmap from "./pages/Heatmap";
import ScheduleUpdate from "./pages/ScheduleUpdate";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Register */}
        <Route path="/register" element={<Register />} />

        {/* Home */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Prediction */}
        <Route
          path="/prediction"
          element={
            <ProtectedRoute>
              <Prediction />
            </ProtectedRoute>
          }
        />

        {/* Schedule */}
        <Route
          path="/schedule"
          element={
            <ProtectedRoute>
              <Schedule />
            </ProtectedRoute>
          }
        />

        {/* Forecast */}
        <Route
          path="/forecast"
          element={
            <ProtectedRoute>
              <Forecast />
            </ProtectedRoute>
          }
        />

        {/* Notifications */}
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />

        {/* Announcement */}
        <Route
          path="/announcement"
          element={
            <ProtectedRoute>
              <Announcement />
            </ProtectedRoute>
          }
        />

        {/* Heatmap */}
        <Route
          path="/heatmap"
          element={
            <ProtectedRoute>
              <Heatmap />
            </ProtectedRoute>
          }
        />

        {/* Live Schedule Update */}
        <Route
          path="/schedule-update"
          element={
            <ProtectedRoute>
              <ScheduleUpdate />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}

        <Route
          path="/monitoring"
          element={
            <AdminRoute>
              <Monitoring />
            </AdminRoute>
          }
        />

        <Route
          path="/report"
          element={
            <AdminRoute>
              <Report />
            </AdminRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <AdminRoute>
              <Analytics />
            </AdminRoute>
          }
        />

      </Routes>

      {/* Toast Notifications */}

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />

    </BrowserRouter>
  );
}

export default App;