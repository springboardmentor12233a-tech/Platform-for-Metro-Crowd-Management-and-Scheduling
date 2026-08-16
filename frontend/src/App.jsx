import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import MetroFlowBackground from "./components/MetroFlowBackground";

import Dashboard from "./pages/Dashboard";
import Prediction from "./pages/Prediction";
import Monitoring from "./pages/Monitoring";
import DelhiMetro from "./pages/DelhiMetro";
import Schedule from "./pages/Schedule";
import Reports from "./pages/Reports";
import History from "./pages/History";
import Alerts from "./pages/Alerts";
import Login from "./pages/Login";


function ProtectedRoute({ children }) {
  const authenticated =
    localStorage.getItem(
      "metroflowAuthenticated"
    ) === "true";

  if (!authenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
}


function App() {
  return (
    <Routes>

      {/* ================================
          LOGIN
      ================================= */}

      <Route
        path="/login"
        element={<Login />}
      />


      {/* ================================
          PROTECTED APPLICATION
      ================================= */}

      <Route
        path="/*"
        element={
          <ProtectedRoute>

            <div className="app">

              <MetroFlowBackground />

              <div className="app-content">

                <Sidebar />

                <div className="main-content">

                  <Routes>

                    <Route
                      path="/"
                      element={
                        <Navigate
                          to="/dashboard"
                        />
                      }
                    />

                    <Route
                      path="/dashboard"
                      element={<Dashboard />}
                    />

                    <Route
                      path="/prediction"
                      element={<Prediction />}
                    />

                    <Route
                      path="/monitoring"
                      element={<Monitoring />}
                    />

                    <Route
                      path="/delhi-metro"
                      element={<DelhiMetro />}
                    />

                    <Route
                      path="/schedule"
                      element={<Schedule />}
                    />

                    <Route
                      path="/alerts"
                      element={<Alerts />}
                    />

                    <Route
                      path="/reports"
                      element={<Reports />}
                    />

                    <Route
                      path="/history"
                      element={<History />}
                    />

                  </Routes>

                </div>

              </div>

            </div>

          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default App;