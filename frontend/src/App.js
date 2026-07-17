import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Prediction from "./pages/Prediction";
import Schedule from "./pages/Schedule";
import Monitoring from "./pages/Monitoring";
import Forecast from "./pages/Forecast";
import Report from "./pages/Report";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login Page */}
        <Route path="/" element={<Login />} />

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

        {/* Monitoring */}
        <Route
  path="/monitoring"
  element={
    <AdminRoute>
      <Monitoring />
    </AdminRoute>
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

        {/* Report */}
        <Route
  path="/report"
  element={
    <AdminRoute>
      <Report />
    </AdminRoute>
  }
/>
<Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;