import { Routes, Route, Navigate, Outlet } from "react-router-dom";

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import CrowdMonitoring from "./pages/CrowdMonitoring/CrowdMonitoring";

import Schedule from "./pages/Schedule";
import ScheduleList from "./pages/Schedule/ScheduleList";
import AddTrain from "./pages/Schedule/AddTrain/AddTrain";

import Analytics from "./pages/Analytics/Analytics";
import Settings from "./pages/Settings/Settings";
import Prediction from "./pages/Prediction/Prediction";
import Forecast from "./pages/Forecast/Forecast";
import PredictionHistory from "./pages/PredictionHistory/PredictionHistory";

import Forbidden from "./pages/Forbidden";
import SmartSchedule from "./pages/SmartSchedule/SmartSchedule";
import AIAlerts from "./pages/AIAlerts/AIAlerts";
import AI from "./pages/AI";

import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import UserManagement from "./pages/UserManagement";
import ActivityLogs from "./pages/ActivityLogs";
import Unauthorized from "./pages/Unauthorized/Unauthorized";

import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import { useAuth } from "./context/AuthContext";


/* =========================================================
   PUBLIC ROUTE
========================================================= */

function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (isAuthenticated) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return children;
}


/* =========================================================
   PROTECTED LAYOUT
========================================================= */

function ProtectedLayout() {
  return (
    <ProtectedRoute>
      <Layout>
        <Outlet />
      </Layout>
    </ProtectedRoute>
  );
}


/* =========================================================
   APP
========================================================= */

function App() {
  return (
    <Routes>

      {/* =====================================================
          PUBLIC ROUTES
      ===================================================== */}

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
        path="/register"
        element={
          <PublicRoute>
            <Register />
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


      {/* =====================================================
          CROWD MONITORING

          IMPORTANT:
          This route is intentionally OUTSIDE ProtectedLayout.

          CrowdMonitoring.jsx should contain its own <Layout>.
          This prevents the sidebar/header from being rendered
          twice.
      ===================================================== */}

      <Route
        path="/crowd"
        element={
          <ProtectedRoute
            allowedRoles={[
              "Admin",
              "Operator",
              "Analyst",
            ]}
          >
            <CrowdMonitoring />
          </ProtectedRoute>
        }
      />


      {/* =====================================================
          ALL OTHER PROTECTED ROUTES
      ===================================================== */}

      <Route element={<ProtectedLayout />}>

        {/* ---------------------------------------------------
            DASHBOARD
        --------------------------------------------------- */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              allowedRoles={[
                "Admin",
                "Operator",
                "Analyst",
                "Member",
              ]}
            >
              <Dashboard />
            </ProtectedRoute>
          }
        />


        {/* ---------------------------------------------------
            PREDICTION
        --------------------------------------------------- */}

        <Route
          path="/prediction"
          element={
            <ProtectedRoute
              allowedRoles={[
                "Admin",
                "Operator",
                "Analyst",
              ]}
            >
              <Prediction />
            </ProtectedRoute>
          }
        />


        {/* ---------------------------------------------------
            FORECAST
        --------------------------------------------------- */}

        <Route
          path="/forecast"
          element={
            <ProtectedRoute
              allowedRoles={[
                "Admin",
                "Operator",
                "Analyst",
              ]}
            >
              <Forecast />
            </ProtectedRoute>
          }
        />


        {/* ---------------------------------------------------
            PREDICTION HISTORY
        --------------------------------------------------- */}

        <Route
          path="/prediction-history"
          element={
            <ProtectedRoute
              allowedRoles={[
                "Admin",
                "Operator",
                "Analyst",
              ]}
            >
              <PredictionHistory />
            </ProtectedRoute>
          }
        />


        {/* ===================================================
            SCHEDULE
        =================================================== */}

        <Route
          path="/schedule"
          element={
            <ProtectedRoute
              allowedRoles={[
                "Admin",
                "Operator",
              ]}
            >
              <Schedule />
            </ProtectedRoute>
          }
        />


        {/* ---------------------------------------------------
            ADD TRAIN
        --------------------------------------------------- */}

        <Route
          path="/schedule/add-train"
          element={
            <ProtectedRoute
              allowedRoles={[
                "Admin",
                "Operator",
              ]}
            >
              <AddTrain />
            </ProtectedRoute>
          }
        />


        {/* ---------------------------------------------------
            SCHEDULE LIST
        --------------------------------------------------- */}

        <Route
          path="/schedule/list"
          element={
            <ProtectedRoute
              allowedRoles={[
                "Admin",
                "Operator",
              ]}
            >
              <ScheduleList />
            </ProtectedRoute>
          }
        />


        {/* ---------------------------------------------------
            SMART SCHEDULE
        --------------------------------------------------- */}

        <Route
          path="/smart-schedule"
          element={
            <ProtectedRoute
              allowedRoles={[
                "Admin",
                "Operator",
              ]}
            >
              <SmartSchedule />
            </ProtectedRoute>
          }
        />


        {/* ---------------------------------------------------
            AI ALERTS
        --------------------------------------------------- */}

        <Route
          path="/alerts"
          element={
            <ProtectedRoute
              allowedRoles={[
                "Admin",
                "Operator",
                "Analyst",
              ]}
            >
              <AIAlerts />
            </ProtectedRoute>
          }
        />


        {/* ---------------------------------------------------
            ANALYTICS
        --------------------------------------------------- */}

        <Route
          path="/analytics"
          element={
            <ProtectedRoute
              allowedRoles={[
                "Admin",
                "Operator",
                "Analyst",
              ]}
            >
              <Analytics />
            </ProtectedRoute>
          }
        />


        {/* ---------------------------------------------------
            AI
        --------------------------------------------------- */}

        <Route
          path="/ai"
          element={
            <ProtectedRoute
              allowedRoles={[
                "Admin",
                "Operator",
                "Analyst",
              ]}
            >
              <AI />
            </ProtectedRoute>
          }
        />


        {/* ---------------------------------------------------
            SETTINGS
        --------------------------------------------------- */}

        <Route
          path="/settings"
          element={
            <ProtectedRoute
              allowedRoles={[
                "Admin",
              ]}
            >
              <Settings />
            </ProtectedRoute>
          }
        />


        {/* ---------------------------------------------------
            USER MANAGEMENT
        --------------------------------------------------- */}

        <Route
          path="/users"
          element={
            <ProtectedRoute
              allowedRoles={[
                "Admin",
              ]}
            >
              <UserManagement />
            </ProtectedRoute>
          }
        />


        {/* ---------------------------------------------------
            ACTIVITY LOGS
        --------------------------------------------------- */}

        <Route
          path="/activity-logs"
          element={
            <ProtectedRoute
              allowedRoles={[
                "Admin",
              ]}
            >
              <ActivityLogs />
            </ProtectedRoute>
          }
        />

      </Route>


      {/* =====================================================
          OTHER ROUTES
      ===================================================== */}

      <Route
        path="/unauthorized"
        element={<Unauthorized />}
      />

      <Route
        path="/403"
        element={<Forbidden />}
      />


      {/* =====================================================
          FALLBACK
      ===================================================== */}

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />

    </Routes>
  );
}

export default App;